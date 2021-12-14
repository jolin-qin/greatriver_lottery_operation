const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		page: 1,
		distribution_list: [],//收益记录数组
		modal: false,
		first_stage_num: 0,//一级下级数
		second_stage_num: 0,//二级下级数
		history_sum_money: 0,//累计收益
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var t = this;
		//总收益，一级下级数，二级下级数
		// app.util.request({
		// 	url: 'entry/wxapp/getfenxiao',
		// 	data: {
		// 		m: app.globalData.module_name,
		// 		op: 'info',
		// 	},
		// 	method: 'get',
		// 	success: function (response) {
		// 		console.log("各种收益接口：", response.data);
		// 		if (response.data.errno == 0) {
		// 			t.setData({
		// 				first_stage_num: response.data.data.first_stage_num,
		// 				second_stage_num: response.data.data.second_stage_num,
		// 				history_sum_money: response.data.data.history_sum_money || 0,
		// 			})

		// 		} else {
					
		// 		}
		// 	},
		// 	fail: function (response) {
		// 		wx.showToast({
		// 			icon: 'none',
		// 			title: '网络错误000',
		// 		})
		// 	}
		// });
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
	//去分享有礼列表页
	goSharePolitePage() {
		wx.navigateTo({
			url: '/pages/newPage/fenxiangyouli/fenxiangyouli',
		})
	},
	//去持续有礼列表页
	goContinuePage() {
		wx.navigateTo({
			url: '/pages/newPage/chixuyouli/chixuyouli',
		})
	},
	jump() {
		wx.switchTab({
			url: '/pages/mystar/mystar',
		})
	},
	//所有收益记录
	getinfo() {
		var t = this;
		app.util.request({
			url: 'entry/wxapp/my_share_list',
			data: {
				m: app.globalData.module_name,
				type: '0',
				page: t.data.page
			},
			method: 'get',
			success: function (response) {
				console.log("分享收益：", response.data);
				if (response.data.errno == 0) {
					t.setData({
						distribution_list: t.data.page > 1 ? t.data.distribution_list.concat(response.data.data.list) : response.data.data.list,
						page: t.data.page + 1,
						history_sum_money: response.data.data.count_price
					})
				} else {
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
	// getinfo() {
	// 	var t = this;
	// 	app.util.request({
	// 		url: 'entry/wxapp/getfenxiao',
	// 		data: {
	// 			m: app.globalData.module_name,
	// 			op: '',
	// 			page: t.data.page,
	// 		},
	// 		method: 'get',
	// 		success: function (response) {
	// 			console.log("分享收益：", response.data);
	// 			if (response.data.errno == 0) {
	// 				t.setData({
	// 					distribution_list: t.data.page > 0 ? t.data.distribution_list.concat(response.data.data) : response.data.data,
	// 				})
	// 			} else {
	// 				t.setData({
	// 				  memberinfo:response.data.data,
	// 				  memberinfo_integral:parseFloat(response.data.data.integral).toLocaleString()
	// 				})
	// 			}
	// 		},
	// 		fail: function (response) {
	// 			wx.showToast({
	// 				icon: 'none',
	// 				title: '网络错误',
	// 			})
	// 		}
	// 	});
	// },
	//点击立即邀请
	share() {
		this.setData({
			modal: true
		})
	},
	//生成分享海报
	qrcode() {
		wx.navigateTo({
			url: '/pages/my/canvas/canvas',
		})
	},
	//关闭分享弹窗
	hideModal() {
		this.setData({
			modal: false
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
		// this.data.page = this.data.page + 1;
		this.getinfo();
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		var memberinfo = wx.getStorageSync('memberinfo');
		var uid = 0;
		console.log('uid', memberinfo.id);
		memberinfo.id && (uid = memberinfo.id);
		var t = this;
		console.log('/pages/index/index?sharetype=invite&uid=' + uid);
		return {
			title: '胶潮-潮玩聚集地!',
			imageUrl: 'https://www.jiaochao.top/imageurl/share_pic.jpg',
			path: '/pages/index/index?sharetype=invite&uid=' + uid
		}
	},
})