let app = getApp();

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const screenSize = () => {
    var that = this;
    wx.getSystemInfo({
        success: function(res) {
            setTimeout(function() {
                app = getApp();
                var ww = res.windowWidth;
                var hh = res.windowHeight;
                app.globalData.ww = ww;
                app.globalData.hh = hh;
            })
        }
    })
}
const GetDateStr = (index) => {
    var dd = new Date();
    dd.setDate(dd.getDate() + index);
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;
    var d = dd.getDate();
    if (m < 10) {
        m = '0' + m
    }
    if (d < 10) {
        d = '0' + d
    }
    return y + "-" + m + "-" + d;
}
const bezier = (points, times) => {
    var bezier_points = [];
    var points_D = [];
    var points_E = [];
    const DIST_AB = Math.sqrt(Math.pow(points[1]['x'] - points[0]['x'], 2) + Math.pow(points[1]['y'] - points[0]['y'], 2));
    const DIST_BC = Math.sqrt(Math.pow(points[2]['x'] - points[1]['x'], 2) + Math.pow(points[2]['y'] - points[1]['y'], 2));
    const EACH_MOVE_AD = DIST_AB / times;
    const EACH_MOVE_BE = DIST_BC / times;
    const TAN_AB = (points[1]['y'] - points[0]['y']) / (points[1]['x'] - points[0]['x']);
    const TAN_BC = (points[2]['y'] - points[1]['y']) / (points[2]['x'] - points[1]['x']);
    const RADIUS_AB = Math.atan(TAN_AB);
    const RADIUS_BC = Math.atan(TAN_BC);
    for (var i = 1; i <= times; i++) {
        var dist_AD = EACH_MOVE_AD * i;
        var dist_BE = EACH_MOVE_BE * i;
        var point_D = {};
        point_D['x'] = dist_AD * Math.cos(RADIUS_AB) + points[0]['x'];
        point_D['y'] = dist_AD * Math.sin(RADIUS_AB) + points[0]['y'];
        points_D.push(point_D);
        var point_E = {};
        point_E['x'] = dist_BE * Math.cos(RADIUS_BC) + points[1]['x'];
        point_E['y'] = dist_BE * Math.sin(RADIUS_BC) + points[1]['y'];
        points_E.push(point_E);
        var tan_DE = (point_E['y'] - point_D['y']) / (point_E['x'] - point_D['x']);
        var radius_DE = Math.atan(tan_DE);
        var dist_DE = Math.sqrt(Math.pow((point_E['x'] - point_D['x']), 2) + Math.pow((point_E['y'] - point_D['y']), 2));
        var dist_DF = (dist_AD / DIST_AB) * dist_DE;
        var point_F = {};
        point_F['x'] = dist_DF * Math.cos(radius_DE) + point_D['x'];
        point_F['y'] = dist_DF * Math.sin(radius_DE) + point_D['y'];
        bezier_points.push(point_F);
    }
    return {
        'bezier_points': bezier_points
    };
}
const updateManager = () => {
    if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager();
        updateManager.onCheckForUpdate(function(res) {
            if (res.hasUpdate) {
                updateManager.onUpdateReady(function() {
                    wx.showModal({
                        title: '更新提示',
                        content: '新版本已经准备好，是否重启应用？',
                        success: function(res) {
                            if (res.confirm) {
                                updateManager.applyUpdate()
                            } else if (res.cancel) {
                                wx.showModal({
                                    title: '已经有新版本',
                                    content: '不更新将会影响使用，删除当前小程序，重新搜索打开哟~',
                                    showCancel: false
                                })
                            }
                        }
                    })
                })
                updateManager.onUpdateFailed(function() {
                    wx.showModal({
                        title: '已经有新版本了哟~',
                        content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
                        showCancel: false
                    })
                })
            }
        })
    } else {
        wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
            showCancel: false
        })
    }
}
var touchStartX = 0; //触摸时的原点  
var touchStartY = 0; //触摸时的原点  
var time = 0; // 时间记录，用于滑动时且时间小于1s则执行左右滑动  
var interval = ""; // 记录/清理时间记录  
var touchMoveX = 0; // x轴方向移动的距离
var touchMoveY = 0; // y轴方向移动的距离
var isScroll = 0;//是否滑动一定距离
// 触摸开始事件  
const touchStart = (e) => {
    touchStartX = e.touches[0].pageX; // 获取触摸时的原点  
    touchStartY = e.touches[0].pageY; // 获取触摸时的原点  
    // 使用js计时器记录时间    
    interval = setInterval(function() {
        time++;
    }, 100);
}
// 触摸移动事件  
const touchMove = (e) => {
        touchMoveX = e.touches[0].pageX;
        touchMoveY = e.touches[0].pageY;
    }
// 触摸结束事件  
const touchEnd = (e) => {
    let istext = '';
    if (touchMoveX == 0 || touchMoveY == 0 ){

    }else{
        var moveX = touchMoveX - touchStartX
        var moveY = touchMoveY - touchStartY
        if (Math.sign(moveX) == -1) {
            moveX = moveX * -1
        }
        if (Math.sign(moveY) == -1) {
            moveY = moveY * -1
        }
        if (moveX <= moveY) { // 上下
            // 向上滑动
            if (touchMoveY - touchStartY <= -30 && time < 100) {
                istext = 'top'
            }
            // 向下滑动  
            if (touchMoveY - touchStartY >= 30 && time < 100) {
                istext = 'down'
            }
        } else if (moveX >= moveY) { // 左右
            // 向左滑动
            if (touchMoveX - touchStartX <= -30 && time < 100) {
                istext = 'left'
            }
            // 向右滑动  
            if (touchMoveX - touchStartX >= 30 && time < 100) {
                istext = 'right'
            }
        }
    } 
    clearInterval(interval); // 清除setInterval  
    time = 0;
     touchStartX = 0; //触摸时的原点  
     touchStartY = 0; //触摸时的原点  
     touchMoveX = 0; // x轴方向移动的距离
     touchMoveY = 0; // y轴方向移动的距离
    return istext
}

module.exports = {
    formatTime: formatTime,
    screenSize: screenSize,
    bezier: bezier,
    updateManager: updateManager,
    GetDateStr: GetDateStr,
    touchStart: touchStart,
    touchMove: touchMove,
    touchEnd: touchEnd
}