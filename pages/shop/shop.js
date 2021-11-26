const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		toolslist: [],
		modal: false,
		select_pay_type: 0,
		payloading: 0,
		isios: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.gettools();
		try {

			var res = wx.getSystemInfoSync()

			this.setData({
				isios: res.platform
			})
			console.log(res.platform)

		} catch (e) {

			// Do something when catch error

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

	},
	openmodal(e) {
		var t = this;
		if (!app.util.islogin()) {
			wx.navigateTo({
				url: '/pages/auth/auth',
			})
			return;
		}

		console.log(e.currentTarget.dataset.id);
		app.util.request({
			url: 'entry/wxapp/pulltool',
			data: {
				m: app.globalData.module_name,
				id: e.currentTarget.dataset.id
			},
			method: 'get',
			success: function (response) {
				console.log('openmodal', response.data);
				if (response.data.errno == 0) {

					if (response.data.data.ios_pay_show == "0" && t.data.isios == 'ios') {
						response.data.data.payment_wechatpay = 0
					}
					t.setData({
						selecttool: response.data.data,
					})
					if (response.data.data.payment_integral == 1) {
						t.setData({
							select_pay_type: 1
						})
					} else if (response.data.data.payment_wechatpay == 1) {
						t.setData({
							select_pay_type: 2
						})
					} else if (response.data.data.payment_balance == 1) {
						t.setData({
							select_pay_type: 3
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
					title: '网络连接失败',
				})
			}
		});
		this.setData({
			modal: true
		})
	},
	closemodal() {
		this.setData({
			modal: false
		})
	},
	//radio-group改变
	payradioChange(e) {
		console.log(e);
		this.setData({
			select_pay_type: e.detail.value
		})
	},
	//点击了radio
	payradioclick(e) {
		this.setData({
			select_pay_type: e.currentTarget.dataset.paytype
		})
	},
	// 支付
	toolpay(e) {
		console.log(e.currentTarget.dataset.id);
		var t = this;
		if (t.data.select_pay_type == 2 && t.data.selecttool.tool_price > 0) { //微信支付
			app.util.request({
				url: 'entry/wxapp/gettoolswepaypara',
				data: {
					m: app.globalData.module_name,
					tool_id: e.currentTarget.dataset.id
				},
				method: 'get',
				success: function (response) {
					console.log('gettoolswepaypara', response.data);
					wx.requestPayment({
						'timeStamp': response.data.data.timeStamp,
						'nonceStr': response.data.data.nonceStr,
						'package': response.data.data.package,
						'signType': 'MD5',
						'paySign': response.data.data.paySign,
						'success': function (res) {
							console.log("支付成功！")
							t.setData({
								payloading: 1
							})
							setTimeout(() => {
								//检查订单号是否支付成功开始
								t.checkpayresult(response.data.data.local_order_data.order_id);


								//检查订单号是否支付成功结束
							}, 3000)


						},
						'fail': function (res) {
							wx.showToast({
								icon: 'none',
								title: '订单支付失败',
							})
							t.setData({
								openboxbuttonenable: true
							})
						}
					})
				},
				fail: function (response) {
					console.log('gettoolswepaypara', response.data);
				},

			})
		} else {
			app.util.request({
				url: 'entry/wxapp/buytool',
				data: {
					m: app.globalData.module_name,
					tool_id: e.currentTarget.dataset.id,
					paytype: t.data.select_pay_type
				},
				method: 'get',
				success: function (response) {
					console.log('buytool1', response);
					t.setData({
						payloading: 3
					})
				},
				fail: function (response) {
					console.log('buytool2', response.data);
					t.setData({
						payresnotice: response.data.message,
						payloading: 2
					})
				},

			})
		}

	},
	checkpayresultclick(e) {
		console.log(e.currentTarget.dataset.orderid);
		this.checkpayresult(e.currentTarget.dataset.orderid);
	},
	checkpayresult(order_id) {
		console.log('check order_id=', order_id);
		var t = this;
		t.setData({
			payloading: 1,
			paycheck_orderid: ''
		})

		app.util.request({
			url: 'entry/wxapp/checkpayresult',
			data: {
				m: app.globalData.module_name,
				orderid: order_id
			},
			method: 'get',
			success: function (response2) {
				console.log('订单支付结果', response2);
				if (response2.data.errno == 0) {

					t.setData({
						payloading: 3,
						paycheck_orderid: ''
					})
				}

			},
			fail: function (response2) {
				console.log('订单支付失败', response2);
				wx.showToast({
					icon: 'none',
					title: response2.data.message,
				})
				t.setData({
					payloading: 2,
					paycheck_orderid: order_id,
					payresnotice: '支付未成功'
				})
				return;
			},
			complete: function (response2) {
				t.setData({
					openboxbuttonenable: true
				})
			}
		})
	},
	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},
	hidecheckpaymodal() {
		console.log('this.data.payloading', this.data.payloading);

		this.data.payloading == 3 && (this.closemodal());
		this.setData({
			payloading: 0,
			paycheck_orderid: ''
		})

	},
	gotowearhouse() {
		wx.switchTab({
			url: '/pages/warehouse/warehouse',
		})
	},
	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},
	gettools() {
		var t = this;

		app.util.request({
			url: 'entry/wxapp/gettools',
			data: {
				m: app.globalData.module_name
			},
			method: 'get',
			success: function (response) {
				console.log('gettools', response.data);
				if (response.data.errno == 0) {
					t.setData({
						//openboxinfo: response.data.data
						toolslist: response.data.data
					})

				} else {
					//失败
					wx.showToast({
						icon: 'none',
						title: '网络连接失败',
					})

				}
			},
			fail: function (response) {

				wx.showToast({
					icon: 'none',
					title: '网络连接失败',
				})
			},
			complete: function (response) {
				wx.stopPullDownRefresh({
					success: (res) => {},
				})

			}
		});

	},
	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		this.gettools();
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