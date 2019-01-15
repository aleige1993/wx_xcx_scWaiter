
let app = getApp();
if (!app) {
  setTimeout(function () {
    app = getApp();
  })
}
let LOGININFO = 'logininfo';

const SET = (data) => {
  wx.setStorageSync(LOGININFO, data);
}

const GET = () => {
  return wx.getStorageSync(LOGININFO);
}

const DEL = () => {
  wx.removeStorageSync(LOGININFO);
}

module.exports = {
  SET: SET,
  GET: GET,
  DEL: DEL
} 