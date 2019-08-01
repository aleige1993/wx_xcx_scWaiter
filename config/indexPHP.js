'use strict';
let app = getApp();
let DEV_CONFIG = {
    HTTPOPENAPIURL: 'http://shop.com' //李昆韦
    //HTTPOPENAPIURL: 'http://192.168.201.54' //何鑫
};
let SIT_CONFIG = {
    HTTPOPENAPIURL: 'https://supermarket.songchedai.com' // 请求OPENAPI的接口
};
let PRE_CONFIG = {
    HTTPOPENAPIURL: 'https://pre.pos.songchexiaozhan.com' // 请求OPENAPI的接口
};
let PROD_CONFIG = {
    HTTPOPENAPIURL: 'https://pos.songchexiaozhan.com' // 请求OPENAPI的接口
};
let OPEN_API = {
    HTTPOPENAPIURL: app.OPEN_APIPHP //切换域名
}
let CONFIG = OPEN_API;// 选取当前环境配置

module.exports = {
    PAGE_SIZE: 10,
    HTTPHEADER_APPID: '100006',
    HTTPHEADER_APPVERSION: '',
    HTTPHEADER_APPSIGN: 'SONGCHE',
    HTTPOPENAPIURL: CONFIG.HTTPOPENAPIURL // 请求OPENAPI的接口
};
