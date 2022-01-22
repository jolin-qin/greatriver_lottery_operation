// pages/newPage/commentDetail/commentDetail.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: app.util.imageUrl,//宝塔图片域名
        goodsId: '',
        commentList: [],
        pageNumber: 1,
        isScroll: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            goodsId: options.id
        })
        this.getCommentListFun(this.data.pageNumber)
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
	getCommentListFun(pageNumber) {
		let t = this;
		app.util.request({
			url: 'entry/wxapp/get_comment',
			data: {
				m: app.globalData.module_name,
				prize_id: t.data.goodsId,
				page: pageNumber
			},
			method: 'get',
			success: function (response) {
				console.log('评论列表：', response);
				if (response.data.errno == 0) {
                    let result = response.data.data
					if (result.list.length == 0) {
						wx.showToast({
							icon: 'none',
							title: '没有更多了',
                        })
                        t.setData({isScroll: false})
					} else {
						t.setData({
							commentList: pageNumber > 1 ? t.data.commentList.concat(result.list) : result.list,
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