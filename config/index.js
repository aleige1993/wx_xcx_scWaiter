'use strict';
let app = getApp();
let DEV_CONFIG = {
    HTTPOPENAPIURL: 'http://192.168.202.203:10036'//田怀志
};
let SIT_CONFIG = {
    HTTPOPENAPIURL: 'https://dev.api.songchejr.com' // 请求OPENAPI的接口
};
let PRE_CONFIG = {
    HTTPOPENAPIURL: 'https://pre.openapi.songchewang.com' // 请求OPENAPI的接口
};
let PROD_CONFIG = {
    HTTPOPENAPIURL: 'https://openapi.songchewang.com' // 请求OPENAPI的接口
};
let OPEN_API = {
    HTTPOPENAPIURL: app.OPEN_API //切换域名
}

let CONFIG = OPEN_API; // 选取当前环境配置

module.exports = {
    PAGE_SIZE: 10,
    HTTPHEADER_APPID: '100006',
    HTTPHEADER_APPVERSION: '',
    HTTPHEADER_APPSIGN: 'SONGCHE',
    HTTPOPENAPIURL: CONFIG.HTTPOPENAPIURL // 请求OPENAPI的接口
};
