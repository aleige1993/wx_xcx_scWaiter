
let FormdataConfig = require('../config/index.js');
let UserLogin = require('../utils/UserLogin.js');
// let HTTPOPENAPIURL = FormdataConfig.HTTPOPENAPIURL;
let HTTPHEADER_APPID = FormdataConfig.HTTPHEADER_APPID;
let HTTPHEADER_APPVERSION = FormdataConfig.HTTPHEADER_APPVERSION;
let HTTPHEADER_APPSIGN = FormdataConfig.HTTPHEADER_APPSIGN;

let DEV_CONFIG = {
    HTTPOPENAPIURL: 'http://192.168.201.137:80'
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


let CONFIG = DEV_CONFIG; // 选取当前环境配置

var app=getApp(); 
if(!app){
  setTimeout(function(){
    app = getApp();
  })
}
// ==get请求方法模版
let post = (url, data, callback) =>{
    wx.request({
        method: 'POST',
        url: CONFIG.HTTPOPENAPIURL+url ,
        data: data,
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            'appId': HTTPHEADER_APPID,
            'version': HTTPHEADER_APPVERSION,
            'sign': HTTPHEADER_APPSIGN,
            'token': UserLogin.get('userInfo').token || ''
        },
        success(res) {
            let data = res.data;
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            if (data.code === '0004') {
                app.Tools.showToast('客官还未登录，请登录浏览');
                app.UserLogin.remove('userInfo');
                app.UserLogin.remove('wxUserInfo');
                setTimeout(function () {
                    wx.switchTab({
                        url: '/pages/index/index',
                    })
                }, 2000);
                return false;
            }
            if (data.code != '0000') {
                if (data.message == '') {

                } else {
                    app.Tools.showToast(data.message);
                }
            }
            callback(data);
        },
        fail(e) {
            app.Tools.showToast('客官系统繁忙, 请稍后再试');
        }
    })
}

let get = (url, data, callback) => {
    wx.request({
        method: 'GET',
        url: CONFIG.HTTPOPENAPIURL + url,
        data: data,
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            'appId': HTTPHEADER_APPID,
            'version': HTTPHEADER_APPVERSION,
            'sign': HTTPHEADER_APPSIGN,
            'token': UserLogin.get('userInfo').token || ''
        },
        success(res) {
            let data = res.data;
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            if (data.code === '0004') {
                app.Tools.showToast('客官还未登录，请登录浏览');
                app.UserLogin.remove('userInfo');
                app.UserLogin.remove('wxUserInfo');
                setTimeout(function () {
                    wx.switchTab({
                        url: '/pages/index/index',
                    })
                }, 2000);
                return false;
            }
            if (data.code != '0000') {
                if (data.message == '') {

                } else {
                    app.Tools.showToast(data.message);
                }
            }
            callback(data);
        },
        fail(e) {
            app.Tools.showToast('客官系统繁忙, 请稍后再试');
        }
    });
}

module.exports = {
    post: post,
    get: get
} 