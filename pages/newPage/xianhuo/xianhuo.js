// pages/newPage/xianhuo/xianhuo.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
		projecturl: app.util.projectUrl,
		goodsList: [],
		bannerList: [],
		tabs: [],
		seriesId: '',
		tabIndex: 0,
		baseNumber: 0,//px与rpx转换基数
		isFixed: false,
		pageNumber: 1,
		
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
		this.getBanner();
		this.getGoodsListFun(this.data.pageNumber);
		this.getSeriesListFun();
		//获取px与rpx的转换基数
        let Height = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
        this.setData({
            baseNumber: 534 / (750 / Height)
        })
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
	//获取系列
	getSeriesListFun() {
		let t = this;
		app.util.request({
			url: 'entry/wxapp/get_series_ist',
			data: {
				m: app.globalData.module_name
			},
			method: 'get',
			success: function (response) {
				console.log('获取系列列表函数', response);
				if (response.data.errno == 0) {
					let result = response.data.data.list
					t.setData({
						tabs: result,
						seriesId: result[0].box_class_id
					})
					//根据seriesId请求盒子列表
					t.getGoodsListFun(result[0].box_class_id, 1)
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
	// 获取商品列表函数
	getGoodsListFun(id, pageNumber) {
		var t = this;
		app.util.request({
			url: 'entry/wxapp/get_prizes_list',
			data: {
				m: app.globalData.module_name,
				sale_type: '1',
				class_id: id,
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
					console.log("我只是没有数据")
					wx.showToast({
						icon: 'none',
						title: response.data.message,
					})
				}
			},
			fail: function (response) {
				console.log("我走了fail")
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
				m: app.globalData.module_name,
				type: '1'
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
	//tab点击
	tabClick(e) {
		let index = e.currentTarget.dataset.index;
		let id = e.currentTarget.dataset.id;
		if (index === this.data.tabIndex) {
			return
		}

		this.setData({
			tabIndex: index,
			pageNumber: 1,
			seriesId: id,
			classList: []
		})
		//请求系列下的盒子列表
		this.getGoodsListFun(id, this.data.pageNumber)
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
	//监听滚动事件
    onPageScroll(e) {
        if (e.scrollTop >= this.data.baseNumber) {
            this.setData({
                isFixed: true
            })
        } else {
            this.setData({
                isFixed: false
            })
        }
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
		this.getGoodsListFun(this.data.seriesId, this.data.pageNumber);//商品列表
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})