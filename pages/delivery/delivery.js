const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		page_title: '',
		delivery: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var t = this;
		if (options.state == 'under_review') {
			t.setData({
				page_title: '待审核'
			})
		}
		if (options.state == 'waiting_for_delivery') {
			t.setData({
				page_title: '待发货'
			})

		}
		if (options.state == 'completed_delivery') {
			t.setData({
				page_title: '已审核'
			})

		}

		if (options.state == 'waiting_for_receive') {
			t.setData({
				page_title: '待收货'
			})

		}
		if (options.state == 'completed') {
			t.setData({
				'page_title': '已完成'
			})

		}
	},
	//获取订单列表
	getlist() {
		var t = this;
		if (app.util.islogin()) {
			console.log('已经登陆 执行业务流程');
			app.util.request({
				url: 'entry/wxapp/getdelivery',
				data: {
					m: app.globalData.module_name,
				},
				method: 'get',
				success: function (response) {
					console.log('订单列表：', response.data);
					if (response.data.errno == 0) {
						var aa = []

						if (t.data.page_title == '待审核') {
							aa = response.data.data.under_review
						}
						if (t.data.page_title == '待发货') {
							aa = response.data.data.waiting_for_delivery
						}
						if (t.data.page_title == '待收货') {
							aa = response.data.data.waiting_for_receive
						}
						if (t.data.page_title == '已完成') {
							aa = response.data.data.completed
						}
						if (t.data.page_title == '已审核') {
							aa = response.data.data.completed_delivery
						}
						t.setData({
							delivery: aa
						})
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
		} else {
			console.log('还没登陆');
			wx.navigateTo({
				url: '/pages/auth/auth',
			})
		}
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
		this.getlist();
	},
	//去订单详情
	fahuo(e) {
		console.log(e);
		var t = this;
		wx.navigateTo({
			url: '/pages/warehouse/applyfordelivery?id=' + e.currentTarget.dataset.id,
		})
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