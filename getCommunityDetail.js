const axios = require('axios');
const cheerio = require('cheerio');
const dotenv = require('dotenv');

dotenv.config({
  path: `./${process.env.NODE_ENV}.env`
})

const { Community } = require('./entities');

updateCommunity = async (community, res) => {
  const data = {};
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
      data.lng = parseFloat(lng);
      data.lat = parseFloat(lat);
    }
  })
  const updatedData = await Community.update(data, { where: { id: community.id } });
  if (updatedData[0] === 1) {
    console.log(`${community.name} 信息已更新`);
  }
}

(async () => {
  const queries = await Community.findAll();
  let reqs = [];
  for (const query of queries) {
    const community = query.toJSON();
    if (community.building_type) {
      console.log(`${community.name} 信息已补全`);
      continue;
    }
    // const res = await axios.get(community.href);
    reqs.push({community, req: axios.get(community.href)});
    if (reqs.length === 50) {
      const ress = await axios.all(reqs.map(r => r.req));
      for (const index in ress) {
        await updateCommunity(reqs[index].community, ress[index]);
      }
      reqs = [];
    }
  }
  if (reqs.length > 0) {
    const ress = await axios.all(reqs);
    for (const res of ress) {
      await updateCommunity(community, res);
    }
  }
})();
