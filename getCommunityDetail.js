const axios = require('axios');
const cheerio = require('cheerio');
const dotenv = require('dotenv');

dotenv.config({
  path: `./${process.env.NODE_ENV}.env`
})

const { Community } = require('./entities');

getDistrict = async (city) => {
  console.log(`开始获取 ${city.city} 的区数据...`);
  const districts = [];
  let res = await axios.get(`${city.href}/xiaoqu`);
  const $ = cheerio.load(res.data);
  $('div[data-role=ershoufang]').find('div').find('a').each(function () {
    districts.push({ href: $(this).attr('href'), name: $(this).text(), city: city.id });
  });
  console.log(`获取到 ${city.city} 的 ${districts.length} 个区数据。`);
  return districts;
}

getBizCircle = async (city, district) => {
  console.log(`开始获取 ${city.city} 的 ${district.name}区 的商圈数据...`);
  const bizCircles = [];
  let res = await axios.get(`${city.href}${district.href}`);
  const $ = cheerio.load(res.data);
  $('div[data-role=ershoufang]').find('div').next('div').find('a').each(function () {
    bizCircles.push({ href: $(this).attr('href'), name: $(this).text(), district: district.id });
  });
  console.log(`获取到 ${city.city} 的 ${district.name}区 的 ${bizCircles.length} 个商圈数据。`);
  return bizCircles;
}

getCommunity = async (city, bizCircle, page = 1) => {
  const communities = [];
  let res = await axios.get(`${city.href}${bizCircle.href}pg${page}`);
  const $ = cheerio.load(res.data);
  $('ul.listContent').find('li').each(function () {
    const a = $(this).find('a');
    communities.push({
      href: a.attr('href'), img: a.find('img').attr('src'), name: a.attr('title'),
      code: $(this).attr('data-id'), biz_circle: bizCircle.id
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
  const queries = await Community.findAll();
  for (const query of queries) {
    const community = query.toJSON();
    if (community.building_type) {
      console.log(`${community.name} 信息已补全`);
      continue;
    }
    const data = {};
    const res = await axios.get(community.href);
    const $ = cheerio.load(res.data);
    $('div.xiaoquInfo').find('div.xiaoquInfoItem').each(function () {
      const label = $(this).find('span.xiaoquInfoLabel').text().trim();
      const content = $(this).find('span.xiaoquInfoContent').text().trim();
      switch (label) {
        case '建筑类型':
          data.building_type = content;
          break;
        case '物业费用':
          data.property_cost = content;
          break;
        case '物业公司':
          data.property_manager = content;
          break;
        case '开发商':
          data.developer = content;
          break;
        case '楼栋总数':
          data.building_count = content.replace('栋', '');
          break;
        case '房屋总数':
          data.house_count = content.replace('户', '');
          break;
      }
    })
    $('script').each(function () {
      const script = $(this).html();
      let info;
      if (script.indexOf('window.GLOBAL_INFOS') !== -1) {
        eval(script.replace('window.GLOBAL_INFOS', 'info'));
        const [lng, lat] = info.resblockPosition.split(',');
        data.lng = lng;
        data.lat = lat;
      }
    })
    const updatedData = await Community.update(data, { where: { id: community.id } });
    if (updatedData[0] === 1) {
      console.log(`${community.name} 信息已更新`);
    }
  }
})();
