# 贝壳找房小区爬虫

## 初始化

创建一个数据库。

以下表和字段会自动创建：
- province: 省份
  - pinyin: 省份拼音
  - name: 省份名

- city: 城市
  - abbr: 城市名首字母
  - city: 城市名
  - href: 贝壳 url
  - province: 所在省份

- district: 城区
  - name: 城区名
  - href: 贝壳 url
  - city: 所属城市

- biz_circle: 商圈
  - name: 商圈名
  - href: 贝壳 url
  - district: 所属城区

- community: 小区
  - name: 小区名
  - href: 贝壳 url
  - img: 小区照片
  - code: 小区编号
  - lng: 经度
  - lat: 纬度
  - property_cost: 物业费
  - property_manager: 物业公司
  - developer: 开发商
  - building_type: 建筑类型
  - building_count: 楼栋数量
  - house_count: 房屋总数
  - biz_circle: 所在商圈

## 配置

配置文件为 `{process.env.NODE_ENV}.env`

配置参数：
- CITY: 城市名，会从数据库的 `city` 表中检索。

数据库配置位于 `ormconfig.json`，具体方法参考 `typeorm`

## 文件

### Spider

爬虫程序。

#### 方法

getCommunities

该程序为获取 `CITY` 城市参数下的城区列表、商圈列表、小区列表。其中小区列表仅获取基础字段。

getCommunityDetail.js

该程序为 `community` 表下所有还未获取经纬度等详细数据的小区进行爬虫，获取详细数据。

## 截图

![image](https://i.loli.net/2020/03/07/G9hvrbzsKAC4iMT.png)
