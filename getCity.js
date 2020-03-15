const axios = require('axios');
const cheerio = require('cheerio');
const dotenv = require('dotenv');
const pinyin = require('tiny-pinyin');

dotenv.config({
  path: `./${process.env.NODE_ENV}.env`
})

const { City, Province } = require('./entities');

getCity = async () => {
  console.log(`开始获取城市数据...`);
  let res = await axios.get(`https://www.ke.com/city/`);
  const $ = cheerio.load(res.data);
  const abbrs = [];
  $('div.city-item').find('ul.city_list_ul').find('li.city_list_li.city_list_li_selected').each(function () {
    const abbr = $(this).find('div.city_firstletter').find('span').text();
    const provinces = [];
    $(this).find('div.city_list').find('div.city_province').each(function () {
      const name = $(this).find('div.city_list_tit.c_b').text().trim();
      const cities = [];
      $(this).find('ul').find('li').each(function () {
        cities.push($(this).find('a'));
      })
      provinces.push({ name, cities });
    });
    abbrs.push({ abbr, provinces });
  })
  for (const { abbr, provinces } of abbrs) {
    for (const { name, cities } of provinces) {
      const province = (await Province.findOrCreate({ where: {abbr, name} }))[0];
      for (const city of cities) {
        const data = {
          href: `https:${city.attr('href')}`,
          abbr: pinyin.convertToPinyin(city.text()).toLowerCase(),
          name: city.text(),
          provinceId: province.id
        };
        await City.create(data)
      }
    }
  }
  console.log(`写入完毕`);
}


(async () => {
  await getCity();
})();
