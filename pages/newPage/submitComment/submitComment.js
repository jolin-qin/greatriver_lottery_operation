// pages/newPage/submitComment/submitComment.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: app.util.imageUrl,//宝塔图片域名
        message: '',
        disable: true,
        uploaderList: [],
        showUpload: true,
        goodsImg: '',
        goodsName: '',
        goodId: '',
        orderId: '',
        imgs: [],//上传图片的id数组
        isShake: true,//防抖
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            goodsImg: options.pic,
            goodsName: options.name,
            goodId: options.id,
            orderId: options.orderid
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
    onChange(event) {
        // event.detail 为当前输入的值
        console.log(event.detail);
        this.setData({
            message: event.detail
        })
        //判断是否为空
        if (this.data.message.length) {
            this.setData({
                disable: false
            })
        } else {
            this.setData({
                disable: true
            })
        }
    },
    //上传图片
    uploadChooseImage: function() {
		let self = this
		wx.chooseImage({
			count: 3,
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function(res) {
				//选择图片成功回调
				wx.showLoading({
					title: '上传中',
					mask: true
                })
                let showImgs = self.data.uploaderList.concat(res.tempFilePaths)
                if (showImgs.length > 3) {
                    wx.hideLoading()
                    wx.showToast({
                        icon: 'none',
                        title: '最多上传3张评论图片',
                        duration: 2000
                    })
                    return false
                }
                let length = res.tempFilePaths.length,index = 0;
                //大于三条隐藏"+"号
                if (length >= 3) {
                    self.setData({
                        showUpload: false
                    })
                }
                self.setData({
                    uploaderList: showImgs
                })
                console.log("res:", res.tempFilePaths) //图片本地路径数组
                self.signatureAndUpload(res.tempFilePaths, length, 0)
			},
		})
    },
    
    signatureAndUpload(arr, length, index) {
        var that = this;
        if (index < length) {
            var tempPath = arr[index]
            // 多选的话需要循环上传了
            let url = app.util.joinurl("entry/wxapp/upload_img")
            console.log("上传url:", url)
            wx.uploadFile({
                url: url, //上传图片地址
                filePath: tempPath,
                name: 'file',
                formData: {},
                success(res) {
                    console.log("上传图片返回值：", res)
                    if (res.statusCode === 200) {
                        //提交图片的ids
                        let result = JSON.parse(res.data),imgId = result.data.id;

                        let idArr = that.data.imgs.concat(imgId);
                        that.setData({
                            imgs: idArr
                        })
                        console.log("imgs:", idArr)
                        //递归调用
                        that.signatureAndUpload(arr, length, index+1)	
                    } else {
                        wx.showToast({
                            title: '上传失败！',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                },
                fail: function(err) {
                    wx.showToast({
                        title: '上传失败！',
                        icon: 'none',
                        duration: 2000
                    })
                }
            })
        } else {
            wx.hideLoading()
        }
    },
    // 删除图片
    detelImg(e) {
        let greslist = this.data.uploaderList
		if (greslist.length > 0) {
			let index = e.currentTarget.dataset.index
			
			greslist.splice(index, 1);
			this.setData({
				showUpload: true,
				uploaderList: greslist
			})
		}
    },
    // 点击图片放大
	showImg(e) {
		var url = e.target.dataset.url;
		wx.previewImage({
			current: url, // 当前显示图片的http链接
			urls: [url] // 需要预览的图片http链接列表
		})
    },
    //提交评论
    submitComment() {
        let self = this
        if (this.data.isShake) {
            this.setData({ isShake: false })
            app.util.request({
				url: 'entry/wxapp/set_comment',
				data: {
                    m: app.globalData.module_name,
                    content: self.data.message,
                    img: self.data.imgs.join(),
                    prize_id: self.data.goodId,
                    order_id: self.data.orderId
				},
				method: 'post',
				success: function (response) {
					console.log('评论返回：', response.data);
					if (response.data.errno == 0) {
                        wx.showToast({
                            title: '评论成功',
                            icon: 'success',
                            duration: 1200
                        })
                        setTimeout(() => {
                            wx.redirectTo({
                                url: '/pages/delivery/delivery?state=completed',
                            })
                        }, 1200)
					} else {
						//失败
						wx.showToast({
							icon: 'none',
							title: response.data.message,
						})
                        self.setData({ isShake: true })
					}
				},
				fail: function (response) {
                    self.setData({ isShake: true })
					wx.showToast({
						icon: 'none',
						title: response.data.message,
					})
				}
			});
        }
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