import { createConnection } from "typeorm";
import * as dotenv from 'dotenv';
import Spider from "./spider";

var env = process.env.NODE_ENV;
if (!env) env = 'development';

dotenv.config({
  path: `./${env}.env`
})

createConnection().then(async connection => {
  const spider = new Spider();
  // spider.getCommunities();
  spider.getCommunityDetail();
})
