// pages/ schoolCar/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shopArr: [{
                name: '店铺1',
                id: "1"
            },
            {
                name: '店铺2',
                id: "2"
            }
        ],
        shopIndex: '',
        carArr: [{
                name: 'A1',
                id: '5'
            },
            {
                name: 'A2',
                id: '6'
            },
            {
                name: 'A3',
                id: '7'
            },
            {
                name: 'B1',
                id: '8'
            },
            {
                name: 'B2',
                id: '9'
            },
            {
                name: 'C1',
                id: '1'
            },
            {
                name: 'C2',
                id: '2'
            },
            {
                name: 'C3',
                id: '3'
            },
            {
                name: 'C4',
                id: '4'
            }
        ],
        carIndex: '',
        sexIndex: '',
        sexArr: [{
                name: '男',
                id: "1"
            },
            {
                name: '女',
                id: "2"
            }
        ],
        checked: '',
        shopItem: '',
        carIitem: '',
        sexItem: ''
    },
    onChange(e) {
        this.setData({
            checked: !this.data.checked
        })
    },
    // 选择店铺
    shoprChange(e) {
        console.log(e)
        this.setData({
            shopIndex: e.detail.value
        })
    },
    // 选择车型
    carChange() {
        this.setData({
            carIndex: e.detail.value
        })
    },
    // 选择性别
    sexChange(e) {
        this.setData({
            sexIndex: e.detail.value
        })
    },
    //提交
    formSubmit(e) {
        console.log(e)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})