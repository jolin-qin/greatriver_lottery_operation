// pages/newPage/detail/detail.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsId: '',
        goodsObj: {},
        projecturl: app.util.projectUrl,
        show: false,//查看弹窗
        popupType: '',//代表打开哪个弹窗
        strings: '',
        couponPopupShow: false,//优惠券弹窗
		buyPopupShow: false,//购买弹窗
        couponList: [],//可用优惠券
        activeIndex: 99999,//默认选择优惠券下标
        useraddress: {},
        couponId: 0,//优惠券id
        totalPrice: 0,//总支付价格
        originPrice: 0,//商品的后台返回价
        showPrice: 0,//商品实际支付价格
        discountAmount: '无可用优惠券',
        memberinfo_integral: 0,
        requireIntegral: 0,//开盒需要积分
        integralRadio: true,//是否禁用积分支付
        select_pay_type: '',//支付方式  2微信支付   1积分支付
        isShake: true,//防抖
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.globalData.selectaddressid = null
        this.setData({
            goodsId: options.id
        })
        this.geDetailFun();//请求详情函数
        this.geCouponFun();//请可用优惠券
        this.getDefaultAddressFun();//默认地址
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
        let t = this;
		if (typeof app.globalData.selectaddressid == "string") {
			app.util.request({
				url: 'entry/wxapp/getaddress',
				data: {
					m: app.globalData.module_name,
					op: 'one',
					id: app.globalData.selectaddressid
				},
				method: 'get',
				success: function (response) {
					console.log('根据id请求收获地址：', response.data);
					if (response.data.errno == 0) {
						t.setData({
							useraddress: response.data.data
						})
					} else {
						//失败
						t.setData({
							useraddress: {}
						})
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
			})
        }
        //获取用户可用积分
        app.util.request({
			url: 'entry/wxapp/getuserinfo',
			data: {
				m: app.globalData.module_name,
				title: '',
			},
			method: 'post',
			success: function (response) {
				console.log(response.data);
				if (response.data.errno == 9999) {
					//未授权头像

				} else {
					t.setData({
						memberinfo_integral: Number(response.data.data.integral)
					})
				}
			},
			fail: function (response) {
				wx.showToast({
					icon: 'none',
					title: '网络错误',
				})
			}
		})
    },
    // 获取详情函数
	geDetailFun() {
		var t = this;
		app.util.request({
			url: 'entry/wxapp/get_prizes_details',
			data: {
				m: app.globalData.module_name,
				id: t.data.goodsId
			},
			method: 'get',
			success: function (response) {
                console.log('获取商品详情', response)
                
				if (response.data.errno == 0) {
                    let result = response.data.data, richText = '';
                    if (result.prize_content) {
                        richText = t.escape2Html(result.prize_content);
                    }
                    //判断支付方式
                    let type = ''
                    if (result.prizes_pay_payment_integral == '1') {
                        type = '1'
                    }
                    if (result.prizes_pay_payment_wechatpay == '1') {
                        type = '2'
                    }
                    t.setData({
                        goodsObj: result,
                        strings: richText,
                        select_pay_type: type,
                        originPrice: result.prize_market_price,
                        showPrice: result.prize_market_price,
                        requireIntegral: Number(result.prize_integral)
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
    //获取默认收获地址
    getDefaultAddressFun() {
        let t = this;
		app.util.request({
			url: 'entry/wxapp/getaddress',
			data: {
				m: app.globalData.module_name,
				op: 'list',
			},
			method: 'get',
			success: function (response) {
				console.log('地址列表', response.data);
				if (response.data.errno == 0) {
                    let result = response.data.data
                    if (result.length === 1) {
                        t.setData({
                            useraddress: result[0]
                        })
                    } else {
                        result.forEach(item => {
                            if (item.isdefault === '1') {
                                t.setData({
                                    useraddress: item
                                })
                            }
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
				console.log(response);
				if (response.data.errno == 9999) {
					t.setData({
                        useraddress: {}
                    })
				}
			}
		})
    },
    // 获取可用优惠券
	geCouponFun() {
		var t = this;
		app.util.request({
			url: 'entry/wxapp/get_user_coupon',
			data: {
				m: app.globalData.module_name
			},
			method: 'get',
			success: function (response) {
				console.log('获取可用优惠券', response);
				if (response.data.errno == 0) {
                    t.setData({
                        couponList: response.data.data.list
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
				// wx.showToast({
				// 	icon: 'none',
				// 	title: response.data.message,
				// })
			}
		});
	},
    //去JC赏列表页
	goJCshangPage() {
		wx.switchTab({
            url: '/pages/mystar/mystar',
        })
    },
    //打开查看弹窗
    openPopup(e) {
        let type = e.currentTarget.dataset.type;
        this.setData({
            popupType: type,
            show: true
        })
    },
    //转义方法
    escape2Html(str) {
        var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; }).replace(/\<section/ig, '<div').replace(/\<img/ig, '<img class="rich_img" ');
    },
	goAwayFun() {
        this.setData({
            couponPopupShow: true
        })
    },
    //go收获地址页
    goAddress() {
        wx.navigateTo({
			url: '/pages/my/address/address',
        })
    },
    //选择优惠券（去使用）
    choiceCouponFun(e) {
        console.log(e)
        let result = e.currentTarget.dataset.item,index = e.currentTarget.dataset.index;
        //判断是否达到用满减券要求
        if (result.type == '2' && (Number(result.full_minus) > Number(this.data.originPrice))) {
            wx.showToast({
                icon: 'none',
                title: '商品价格低于满减额',
            })
            return false
        }

        let newPrice = (this.data.originPrice - Number(result.price)).toFixed(2)
        if (0 >= newPrice) {
            newPrice = 0
        }
        this.setData({
            discountAmount: '-'+result.price+'元',
            couponId: result.id,
            couponPopupShow: false,
            activeIndex: index,
            showPrice: newPrice
        })
        //计算总实付价格
        this.countTotalPeiceFun()
    },
    // 计算总实际支付价
    countTotalPeiceFun() {
        let zongjia = (Number(this.data.showPrice) + Number(this.data.goodsObj.prize_postage)).toFixed(2)
        this.setData({
            totalPrice: zongjia
        })
    },
    //关闭查看弹窗
    onClose() {
        this.setData({ 
            show: false,
            popupType: ''
        });
    },
    //关闭优惠券弹窗
    closeCouponPupop() {
        this.setData({ 
            couponPopupShow: false,
        });
    },
    //关闭购买弹窗
    closeBuyPopup() {
        this.setData({ 
            buyPopupShow: false,
            couponId: '',
            activeIndex: 99999
        });
    },
    //打开购买弹窗
    openBuyPopup() {
        //运费
        // let yunfei = 0;
        // if (this.data.goodsObj.prize_postage_type === '1') {
        //     yunfei = Number(this.data.goodsObj.prize_postage)
        // }
        // let heji = (Number(this.data.goodsObj.prize_market_price) + yunfei).toFixed(2)
        //判断积分支付是否可点击
        if (!this.data.originPrice) {
            wx.showToast({
                icon: 'none',
                title: '后台参数配置错误',
            })
            return 
        }
        //计算总实付价格
        this.countTotalPeiceFun()
        this.setData({ 
            buyPopupShow: true,
            integralRadio: this.data.memberinfo_integral >= this.data.requireIntegral ? false : true,
            discountAmount: this.data.couponList.length ? '请选择优惠券' : '无可用优惠券'
        });
    },
    //打开优惠券弹窗
    openCouponPopup() {
        if ((this.data.couponList.length > 0) && (this.data.select_pay_type == '2')) {
            this.setData({
                couponPopupShow: true
            })
        } else {
            wx.showToast({
                icon: 'none',
                title: '无可用优惠券哦',
            })
        }
    },
    //radio-group改变
	payradioChange(e) {
        console.log(e);
        //如果选择积分支付，不能用优惠券了
        let radioValue = e.detail.value
        if (radioValue == '1') {
            this.setData({
                discountAmount: '无可用优惠券',
                couponId: '',
                activeIndex: 99999,
            })
        } else {
            if (this.data.couponList.length > 0) {
                this.setData({
                    discountAmount: '请选择优惠券',
                })
            }
        }
		this.setData({
            select_pay_type: radioValue,
            showPrice: this.data.originPrice
        })
        //计算总实付价格
        this.countTotalPeiceFun()
	},
    //支付
    confirmPayFun() {
        let t = this
        if (!this.data.useraddress.id) {
            wx.showToast({
                icon: 'none',
                title: '请选择收获地址',
            })
            setTimeout(() => {
                wx.navigateTo({
                    url: '/pages/my/address/address',
                })
            }, 1200)
        } else {
            if (this.data.isShake) {
                this.setData({ isShake: false })
                app.util.request({
                    url: 'entry/wxapp/buy_prizes',
                    data: {
                        m: app.globalData.module_name,
                        prizes_id: t.data.goodsId,
                        address_id: t.data.useraddress.id,
                        coupon_id: t.data.couponId,
                        paytype: t.data.select_pay_type
                    },
                    method: 'get',
                    success: function (response) {
                        console.log('立即购买返回值：', response.data);
                        //根据返回结果是否调用微信支付
                        if (response.data.data.order_id) {
                            wx.showLoading({
                                title: '支付中',
                            })
                            setTimeout(() => {
                                wx.showToast({
                                    icon: 'none',
                                    title: response.data.message,
                                    duration: 1000
                                })
                            }, 1000)
                            setTimeout(() => {
                                wx.hideLoading()
                                wx.switchTab({
                                    url: '/pages/index/index',
                                })
                            }, 2000)
                        } else {
                            wx.requestPayment({
                                'timeStamp': response.data.data.timeStamp,
                                'nonceStr': response.data.data.nonceStr,
                                'package': response.data.data.package,
                                'signType': 'MD5',
                                'paySign': response.data.data.paySign,
                                success: function (res) {
                                    console.log("支付成功！")
                                    // t.setData({
                                    // 	payloading: 1
                                    // })
                                    // setTimeout(() => {
                                    // 	//检查订单号是否支付成功开始
                                    // 	t.checkpayresult(response.data.data.local_order_data.order_id);
                                    // 	//检查订单号是否支付成功结束
                                    // }, 3000)
                                    wx.reLaunch({
                                        url: '/pages/index/index',
                                    })
        
                                },
                                fail: function (res) {
                                    wx.showToast({
                                        icon: 'none',
                                        title: '订单支付失败',
                                    })
                                    setTimeout(() => {
                                        wx.switchTab({
                                            url: '/pages/index/index',
                                        })
                                    }, 1200)
                                }
                            })
                        }
                    },
                    fail: function (response) {
                        console.log("response:", response)
                        wx.showToast({
                            icon: 'none',
                            title: '支付参数错误',
                        })
                        t.setData({ isShake: true })
                    }
                })
            }
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