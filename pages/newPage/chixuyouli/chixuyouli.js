// pages/newPage/chixuyouli/chixuyouli.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page: 1,
        distribution_list: [{
            title: "满减券",
			create_time: "2021/12/5",
			price: "555"
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getinfo();
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
    getinfo() {
		var t = this;
		app.util.request({
			url: 'entry/wxapp/my_share_list',
			data: {
				m: app.globalData.module_name,
				type: '2',
				page: t.data.page
			},
			method: 'get',
			success: function (response) {
				console.log("分享收益：", response.data);
				if (response.data.errno == 0) {
					t.setData({
						distribution_list: t.data.page > 1 ? t.data.distribution_list.concat(response.data.data.list) : response.data.data.list,
						page: t.data.page + 1,
					})
				}
			},
			fail: function (response) {
				wx.showToast({
					icon: 'none',
					title: '网络错误二级请求',
				})
			}
		});
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
        this.getinfo();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})