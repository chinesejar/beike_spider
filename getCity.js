const axios = require('axios');
const cheerio = require('cheerio');
const dotenv = require('dotenv');

dotenv.config({
  path: `./${process.env.NODE_ENV}.env`
})

const { City } = require('./entities');

getCity = async () => {
  console.log(`开始获取城市数据...`);
  let res = await axios.get(`https://www.ke.com/city/`);
  const $ = cheerio.load(res.data);
  $('div.city-item').find('ul.city_list_ul').find('li.city_list_li.city_list_li_selected').each(async function () {
    const abbr = $(this).find('div.city_firstletter').find('span').text();
    $(this).find('div.city_list').find('div.city_province').each(async function () {
      const name = $(this).find('div.city_list_tit.c_b').text();
      $(this).find('ul').find('li').each(async function () {
        const city = $(this).find('a');
        await City.create({
          province: name.trim(), abbr,
          href: `https:${city.attr('href')}`, city: city.text()
        })
      })
    })
  });
  console.log(`写入完毕`);
}


(async () => {
  await getCity();
})();
