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
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
    random_string(len) {
        len = len || 32;
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        var maxPos = chars.length;
        var pwd = '';
        for (var i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },
    get_suffix(filename) {
        var pos = filename.lastIndexOf('.');
        var suffix = '';
        if (pos != -1) {
            suffix = filename.substring(pos);
        }
        return suffix;
    },
    calculate_object_name(filename) {
        return this.random_string(16) + this.get_suffix(filename);
    },
    //上传图片
    uploadChooseImage: function() {
		let self = this
		wx.chooseImage({
			count: 9,
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function(res) {
				//选择图片成功回调
				wx.showLoading({
					title: '上传中',
					mask: true
                })
                console.log("res:", res.tempFilePaths) //图片本地路径数组
                let length = res.tempFilePaths.length,index = 0;
                self.signatureAndUpload(res.tempFilePaths, length, 0)
                
			},
		})
    },
    // 签名上传阿里云
    signatureAndUpload(arr, length, index) {
        var that = this;
        if (index < length) {
            var tempPath = arr[index]
            // 多选的话需要循环上传了
            var dir = 'punchImg/'
            var fileName = that.calculate_object_name(tempPath) //加密解析本地图片名称
            const aliyunFileKey = dir + fileName; //保存图片的文件后缀名
            //发起后端请求签名
            wx.request({
                url: API.mpUploadOssHelper,
                data: {
                    dir: dir
                },
                success: function(res) {
                    console.log('签名', res.data)
                    if (res.data.code == '200') {
                        let post = res.data.data; //需要的参数都在这里面
                        wx.uploadFile({
                            url: post.ossUrl, //开发者服务地址
                            filePath: tempPath,
                            name: 'file',
                            formData: {
                                'name': tempPath,
                                'key': aliyunFileKey,
                                'OSSAccessKeyId': post.OSSAccessKeyId,
                                'policy': post.policy,
                                'signature': post.signature,
                                'success_action_status': '200'
                            },
                            success: function(res) {
                                console.log("阿里云", res.statusCode)
                                if (res.statusCode == 200) {
                                    let showUrl = post.ossUrl + '/' + aliyunFileKey
                                    let uploaderFile = that.data.uploaderList.concat({imgUrl: showUrl});
                                    //大于三条隐藏"+"号
                                    if (uploaderFile.length == 9) {
                                        that.setData({
                                            showUpload: false
                                        })
                                    }
                                    that.setData({
                                        uploaderList: uploaderFile
                                    })
                                    //递归调用
                                    that.signatureAndUpload(arr, length, index+1)			
                                } else {
                                    common.Toast("上传失败！")
                                }
                            },
                            fail: function(err) {
                                console.log(err)
                                common.Toast("上传失败！")
                            }
                        })
                    }
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