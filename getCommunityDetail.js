const axios = require('axios');
const cheerio = require('cheerio');
const dotenv = require('dotenv');

dotenv.config({
  path: `./${process.env.NODE_ENV}.env`
})

const { Community } = require('./entities');

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
        data.lng = parseFloat(lng);
        data.lat = parseFloat(lat);
      }
    })
    const updatedData = await Community.update(data, { where: { id: community.id } });
    if (updatedData[0] === 1) {
      console.log(`${community.name} 信息已更新`);
    }
  }
})();
