const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		region: ['广东省', '广州市', '海珠区'],
		phone_number: ''
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getUserInfor()
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},
	//获取用户信息
	getUserInfor() {
		let t = this;
		app.util.request({
			url: 'entry/wxapp/getuserinfo',
			data: {
				m: app.globalData.module_name,
				title: '',
			},
			method: 'post',
			success: function (response) {
				console.log(response.data);
				if (response.data.errno == 0) {
					t.setData({
						phone_number: response.data.data.phonenumber,
					})
				}
			},
			fail: function (response) {
				wx.showToast({
					icon: 'none',
					title: '网络错误',
				})
			}
		});
	},
	//获取手机号
	getPhoneNumber(e) {
		// console.log()
		// console.log(e.detail.iv)
		// console.log(e.detail.encryptedData)
		var t = this;
		if (e.detail.errMsg == "getPhoneNumber:ok") {
			app.util.request({
				url: 'entry/wxapp/getphonenumber',
				data: {
					m: app.globalData.module_name,
					iv: e.detail.iv,
					encryptedData: e.detail.encryptedData
				},
				method: 'post',
				success: function (response) {
					console.log(response);
					if (response.data.errno == 0) {
						//请求用户信息，是否有手机号
						t.getUserInfor();
					} else {
						wx.showToast({
							icon: 'none',
							title: response.data.message
						})
					}
				},
				fail: function (response) {
					console.log("走了fail")
					wx.showToast({
						icon: 'none',
						title: response.data.message
					})
				}
			})
		} else {
			wx.showModal({
				title: '提示',
				showCancel: false,
				content: '为避免恶意作弊，需绑定手机号',
				success(res) {
					if (res.confirm) {
						console.log('用户点击确定')
					} else if (res.cancel) {
						console.log('用户点击取消')
					}
				}
			})
		}
	},
	
	//保存地址
	formbsumit(e) {
		console.log(e.detail.value);
		if (e.detail.value.name == "") {
			wx.showToast({
				icon: 'none',
				title: '收货人不能为空',
			})
			return;
		}
		if (e.detail.value.phone == "") {
			wx.showToast({
				icon: 'none',
				title: '手机号不能为空',
			})
			return;
		}
		if (e.detail.value.address == "") {
			wx.showToast({
				icon: 'none',
				title: '详细地址不能为空',
			})
			return;
		}

		app.util.request({
			url: 'entry/wxapp/addaddress',
			data: {
				m: app.globalData.module_name,
				op: 'add',
				name: e.detail.value.name,
				phone: e.detail.value.phone,
				province: e.detail.value.area[0],
				city: e.detail.value.area[1],
				district: e.detail.value.area[2],
				address: e.detail.value.address,
				isdefault: e.detail.value.isdefault == true ? 1 : 0
			},
			method: 'post',
			success: function (response) {
				console.log('getboxinfo', response.data);


				if (response.data.errno == 0) {
					wx.showToast({
						icon: 'none',
						title: response.data.message,
					})
					wx.navigateBack({
						delta: -1,
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
					title: '网络连接失败',
				})
			}
		});
	},
	RegionChange: function (e) {
		this.setData({
			region: e.detail.value
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