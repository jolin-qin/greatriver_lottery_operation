// pages/newPage/yushou/yushou.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageNumber: 1,
		goodsList: [],
		bannerList: [],
		projecturl: app.util.projectUrl,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getBanner();
		this.getGoodsListFun(this.data.pageNumber);
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
    // 获取商品列表函数
	getGoodsListFun(pageNumber) {
		var t = this;
		if (pageNumber == 1) {
			t.data.pageNumber = 1;
		}
		app.util.request({
			url: 'entry/wxapp/get_prizes_list',
			data: {
				m: app.globalData.module_name,
				sale_type: '2',
				page: pageNumber
			},
			method: 'get',
			success: function (response) {
				console.log('获取商品列表函数', response);
				if (response.data.errno == 0) {
					if (response.data.data.length == 0 && pageNumber == 1) {
						wx.showToast({
							icon: 'none',
							title: '没有更多了',
						})
					} else {
						t.setData({
							goodsList: pageNumber > 1 ? t.data.goodsList.concat(response.data.data.list) : response.data.data.list,
							pageNumber: t.data.pageNumber + 1,
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
	// 获取banner数据
	getBanner() {
		var t = this;
		app.util.request({
			url: 'entry/wxapp/get_banner_list',
			data: {
				m: app.globalData.module_name
			},
			method: 'get',
			success: function (response) {
				console.log('首页banner图', response);
				if (response.data.errno == 0) {
					t.setData({
						bannerList: response.data.data.list || []
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
			},
			complete: function () {
				wx.stopPullDownRefresh();
			}
		});
	},
	//去商品详情页
	goGoodsDetailPage(e) {
		let type = e.currentTarget.dataset.type, id = '';
		id = type ? e.currentTarget.dataset.prizeid : e.currentTarget.dataset.id;
		wx.navigateTo({
			url: '/pages/newPage/detail/detail?id=' + id,
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
        this.getGoodsListFun(this.data.pageNumber);//商品列表
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})