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
    // 获取评论列表函数
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
					if (result.list.length == 0 || result.count === result.list.length) {
                        //拼接地址
                        result.list.forEach((item) => {
                            item.img.forEach(sonitem => {
                                sonitem.url = app.util.projectUrl + sonitem.url
                                sonitem.thumb = app.util.projectUrl + sonitem.thumb
                            })
                            //为商家回复添加‘商家回复：’
                            if (item.reply.length) {
                                item.reply[0].content = '商家回复：' + item.reply[0].content
                            }
                            //默认都没有点赞
                            item.isClick = false
                            //点赞数为0，就显示‘点赞’文字，否则显示数量
                            if (!(Number(item.like))) {
                                item.like = '点赞'
                            }
                        })
                        t.setData({
                            isScroll: false,
                            commentList: result.list
                        })
					} else {
                        result.list.forEach((item) => {
                            item.img.forEach(sonitem => {
                                sonitem.url = app.util.projectUrl + sonitem.url
                                sonitem.thumb = app.util.projectUrl + sonitem.thumb
                            })
                            //为商家回复添加‘商家回复：’
                            if (item.reply.length) {
                                item.reply[0].content = '商家回复：' + item.reply[0].content
                            }
                        })
						t.setData({
							commentList: pageNumber > 1 ? t.data.commentList.concat(result.list) : result.list,
							pageNumber: t.data.pageNumber + 1,
						})
                    }
                    console.log("commentList:", t.data.commentList)
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
    //点赞
    clickZan(e) {
        let t = this
        let index = e.currentTarget.dataset.index,commentId = e.currentTarget.dataset.id;
        let likeNumber = this.data.commentList[index].like
        if (Number(likeNumber)) {
            likeNumber = Number(likeNumber) + 1
        } else {
            likeNumber = 1
        }
        app.util.request({
            url: 'entry/wxapp/set_like',
            data: {
                m: app.globalData.module_name,
                comment_id: commentId
            },
            method: 'get',
            success: function (response) {
                console.log('点赞成功：', response.data);
                if (response.data.errno == 0) {
                    let newValue = 'commentList['+index+'].isClick',newValue1 = 'commentList['+index+'].like'
                    t.setData({
                        [newValue]: true,
                        [newValue1]: likeNumber
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