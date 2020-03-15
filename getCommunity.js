const axios = require('axios');
const cheerio = require('cheerio');
const dotenv = require('dotenv');

dotenv.config({
  path: `./${process.env.NODE_ENV}.env`
})

const { City, District, BizCircle, Community } = require('./entities');

getDistrict = async (city) => {
  console.log(`开始获取 ${city.name} 的区数据...`);
  const districts = [];
  let res = await axios.get(`${city.href}/xiaoqu`);
  const $ = cheerio.load(res.data);
  $('div[data-role=ershoufang]').find('div').find('a').each(function () {
    districts.push({ href: $(this).attr('href'), name: $(this).text(), cityId: city.id });
  });
  console.log(`获取到 ${city.name} 的 ${districts.length} 个区数据。`);
  return districts;
}

getBizCircle = async (city, district) => {
  console.log(`开始获取 ${city.name} 的 ${district.name}区 的商圈数据...`);
  const bizCircles = [];
  let res = await axios.get(`${city.href}${district.href}`);
  const $ = cheerio.load(res.data);
  $('div[data-role=ershoufang]').find('div').next('div').find('a').each(function () {
    bizCircles.push({ href: $(this).attr('href'), name: $(this).text(), districtId: district.id });
  });
  console.log(`获取到 ${city.name} 的 ${district.name}区 的 ${bizCircles.length} 个商圈数据。`);
  return bizCircles;
}

getCommunity = async (city, bizCircle, page = 1) => {
  const communities = [];
  let res = await axios.get(`${city.href}${bizCircle.href}pg${page}`);
  const $ = cheerio.load(res.data);
  $('ul.listContent').find('li').each(function () {
    const a = $(this).find('a');
    communities.push({
      href: a.attr('href'), img: a.find('img').attr('data-original'), name: a.attr('title'),
      code: $(this).attr('data-id'), bizCircleId: bizCircle.id
    });
  });
  let pageInfo = $('div.page-box.house-lst-page-box').attr('page-data');
  // 如果该商圈无小区，返回空数组
  if (pageInfo) pageInfo = JSON.parse(pageInfo);
  else return [];
  if (pageInfo.totalPage === pageInfo.curPage) {
    return communities;
  } else {
    return communities.concat(await getCommunity(city, bizCircle, page + 1));
  }
}

(async () => {
  let query = await City.findOne({ where: { name: process.env.CITY } });
  if (!query) {
    throw (`未找到该城市，请填写正确的城市名或者执行 node getCity.js 更新一下城市列表.`);
  }
  const city = query.toJSON();
  console.log(`开始爬 ${city.name} 的数据...`);
  const districts = await getDistrict(city);
  for (let district of districts) {
    let query = await District.findOne({ where: { name: district.name, cityId: city.id } });
    if (!query) {
      district = (await District.create(district)).toJSON();
      console.log(`${city.name} 的 ${district.name} 不存在，创建成功`);
    } else {
      district = query.toJSON();
    }
    const bizCircles = await getBizCircle(city, district);
    for (let bizCircle of bizCircles) {
      let query = await BizCircle.findOne({ where: { name: bizCircle.name, districtId: district.id } });
      if (!query) {
        bizCircle = (await BizCircle.create(bizCircle)).toJSON();
        console.log(`${city.name} 的 ${district.name} 的 ${bizCircle.name} 不存在，创建成功`);
      } else {
        bizCircle = query.toJSON();
      }
      query = await Community.count({ where: { bizCircleId: bizCircle.id } });
      if (query > 0) {
        console.log(`${city.name} 的 ${district.name}区 的 ${bizCircle.name}商圈 的小区数据已存在`);
        continue;
      }
      console.log(`开始获取 ${city.name} 的 ${district.name}区 的 ${bizCircle.name}商圈 的小区数据...`);
      const communities = await getCommunity(city, bizCircle);
      console.log(`获取到 ${city.name} 的 ${district.name}区 的 ${bizCircle.name}商圈 的 ${communities.length} 个小区数据。`);
      for (let community of communities) {
        let query = await Community.findOne({ where: { name: community.name, bizCircleId: bizCircle.id } });
        if (!query) {
          community = (await Community.create(community)).toJSON();
          console.log(`${city.name} 的 ${district.name} 的 ${bizCircle.name} 的 ${community.name} 不存在，创建成功`);
        }
      }
    }
  }
})();
