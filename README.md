# 颂小二

>config文件里公共接口配置
请求接口切换，（index.js是java配置，indexPHP.js是php配合）

>app.js文件
版本切换接口请求（版本号由后台给）

>utils
---Formdata.js  java接口请求封装
---FormdataPHP.js  PHP接口请求封装
---UserLogin.js  本地缓存封装方法
---qqmap-wx-jssdk.min.js 调用腾讯地图
其他没有什么重点，但是不要删除

>ui-plugins
采用的有赞小程序UI框架，当时没有UI设计，也没有充足的时间，所以采用了UI框架，不熟悉多看看UI框架(vant)

>static
使用阿里的icon图标

>page 页面构建
--index 首页
--laundyOrder 洗衣模块
    $  orderDetails 订单详情
    $ payMent 支付
    $ shoooCart 购物车
    $ setTlement 洗衣下单

--leaseCar 租车模块
    $ leaseDetails 租车详情

--login 登录注册模块
    $ register 验证码登录

--mernberInfo 会员模块
    $ openMernber 开通会员
    $ modifyMernber 个人会员信息

--myExpress 快递模块

--schoolCar 学车模块

--shopList 小站列表
    $ map 店铺地图

--usCenter 个人中心
    $ couponInfo 我的优惠劵

--webView web页面展示
    $ viewInstions  banner页面详情

--shopMall (*******商超模块******)
    $ shopList (同上-小站列表)
    $ addressList 添加收货地址
    $ goodDetails 商品详情
    $ orderDetails 我的订单列表和详情
    $ orderList 提交订单
    $ returnGoods  退货原因
    $ returnOrder 退货订单



