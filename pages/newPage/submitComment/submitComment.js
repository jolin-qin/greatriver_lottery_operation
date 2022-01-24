// pages/newPage/submitComment/submitComment.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        message: '',
        disable: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        setTimeout(() => {
            console.log("3")
        }, 0)
        new Promise((resolve, reject) => {
            console.log("1")
            resolve()
        }).then(() => {
            console.log("2")
        })
        new Promise((resolve, reject) => {
            console.log("5")
            resolve()
        }).then(() => {
            console.log("6")
        })
        console.log("4")
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    onChange(event) {
        // event.detail 为当前输入的值
        console.log(event.detail);
        this.setData({
            message: event.detail
        })
        //判断是否为空
        if (this.data.message.length) {
            this.setData({
                disable: false
            })
        } else {
            this.setData({
                disable: true
            })
        }
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})