# 贝壳找房小区爬虫

## 初始化

创建一个 MYSQL 数据库，记住配置。

以下表和字段会自动创建：
- cities: 城市列表
  - abbr: 城市名首字母
  - city: 城市名
  - href: 贝壳 url
  - province: 所在省份
- districts: 城区列表
  - name: 城区名
  - href: 贝壳 url
  - city: 所属城市 id
- biz_circles: 商圈列表
  - name: 商圈名
  - href: 贝壳 url
  - district: 所属城区 id
- communities: 小区列表
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

## 配置

配置文件为 `{process.env.NODE_ENV}.env`

配置参数：
- CITY: 城市名，会从数据库的 `city` 表中检索。
- MYSQL_URI: 数据库 URI

## 文件

### getCity.js

该程序为获取城市列表并写入数据库，是执行其他文件的前提。

### getCommunity.js

该程序为获取 `CITY` 城市参数下的城区列表、商圈列表、小区列表。其中小区列表仅获取基础字段。

### getCommunityDetail.js

该程序为 `community` 表下所有还未获取经纬度等详细数据的小区进行爬虫，获取详细数据。
