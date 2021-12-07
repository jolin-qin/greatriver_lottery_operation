const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		dailylist: [],
		pg: 1
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getdailyaccount(1);
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
	getdailyaccount(pg) {
		var t = this;
		app.util.request({
			url: 'entry/wxapp/getdailyaccount',
			data: {
				m: app.globalData.module_name,
				page: pg,
				type: '2'
			},
			method: 'get',
			success: function (response) {
				console.log('steal', response.data);
				if (response.data.errno == 0) {
					// if (t.data.dailylist.length > 0) {

					// 	t.data.dailylist = t.data.dailylist.concat(response.data.data);
					// } else {
					// 	t.data.dailylist = response.data.data;
					// }


					// t.setData({
					// 	dailylist: t.data.dailylist
					// })
					if (response.data.data.length == 0) {
						wx.showToast({
							icon: 'none',
							title: '没有更多了',
						})
					} else {
						t.setData({
							dailylist: pg > 1 ? t.data.dailylist.concat(response.data.data) : response.data.data,
							pg: t.data.pg + 1,
						})
					}

				} else {
					//失败
					wx.showToast({
						icon: 'none',
						title: response.data.message,
					})
				}
			},
			fail: function (response) {
				wx.showToast({
					icon: 'none',
					title: response.data.message,
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
		var that = this;
		// that.data.pg = that.data.pg + 1;
		// console.log('触发加载更多' + that.data.pg);
		this.getdailyaccount(that.data.pg);
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})