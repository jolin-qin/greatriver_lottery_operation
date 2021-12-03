// pages/newPage/JCshang/JCshang.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
		imgUrl: app.util.imageUrl,
		boxId: '',//盒子Id
		boxObj: {},
		goodsList: [],//盒子里商品种类数
		remainNum: 0,//剩余数量
        couponId: '',//优惠券
        toolId: '',//使用道具Id
        toolPrizeId: '',//使用道具的商品ID
		couponPopupShow: false,//优惠券弹窗
        buyPopupShow: false,//购买弹窗
        winningPopupShow: false,//购买弹窗
        allPrizePopupShow: false,//全部奖品弹窗弹窗
		couponList: [],//可用优惠券
        toolList: [], //道具列表
        winningList: [],//中奖一、三、五个奖品数组
        winningAllList: [],//全部奖品数组（全包中奖数组）
        times: 0,//默认抽一次
        activeIndex: 99999,//默认选择优惠券下标
        totalPrice: 0,//用户选择抽几次，没减任何优惠的价格，用于各种计算
        showPrice: 0,//选了优惠券的后展示给用户看的价格
        discountAmount: '无可用优惠券',
        memberinfo_integral: 0,//用户可用积分
        requireIntegral: 0,//开盒需要积分
        integralRadio: true,//是否禁用积分支付
        select_pay_type: '',//支付方式  2微信支付   1积分支付
        isShake: true,//防抖
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
		this.setData({
			boxId: options.id
		})
        this.getBoxDetailFun()
        this.geCouponFun() //获取优惠券
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
        this.getAvailableIntegral() //获取可用积分
    },
	//请求盒子详情
	getBoxDetailFun() {
		let t = this;
		app.util.request({
			url: 'entry/wxapp/getboxinfobyid',
			data: {
				m: app.globalData.module_name,
				id: t.data.boxId
			},
			method: 'get',
			success: function (response) {
				console.log('盒子详情函数', response);
				if (response.data.errno == 0) {
					let arr = [], shengyu = 0, type = '', result = response.data.data;
					if (result.prizes_list.length > 9) {
						arr = result.prizes_list.slice(0, 9)
					} else {
						arr = result.prizes_list
					}
					//计算盒子商品总剩余
					arr.forEach(item => {
						if (item.num) {
							shengyu = shengyu + Number(item.num)
						}
                    })
                    //判断支付方式
                    
                    if (result.box_pay_payment_integral == '1') {
                        type = '1'
                    }
                    if (result.box_pay_payment_wechatpay == '1') {
                        type = '2'
                    }
					t.setData({
						boxObj: result || {},
                        goodsList: arr,
                        select_pay_type: type,
						remainNum: shengyu
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
    //获取可用积分
    getAvailableIntegral() {
        let t = this;
        app.util.request({
			url: 'entry/wxapp/getuserinfo',
			data: {
				m: app.globalData.module_name,
				title: ''
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
	// 获取可用优惠券
	geCouponFun() {
		var t = this;
		app.util.request({
			url: 'entry/wxapp/get_user_coupon',
			data: {
				m: app.globalData.module_name,
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
				wx.showToast({
					icon: 'none',
					title: response.data.message,
				})
			}
		});
	},
	//选择优惠券（去使用）
    choiceCouponFun(e) {
        console.log(e)
        let result = e.currentTarget.dataset.item,index = e.currentTarget.dataset.index;
        //判断是否达到用满减券要求
        if (result.type === '2' && (Number(result.full_minus) > Number(this.data.totalPrice))) {
            wx.showToast({
                icon: 'none',
                title: '实付金额低于满减额',
            })
            return false
        }

        let newPrice = (this.data.totalPrice - Number(result.price)).toFixed(2)
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
    openBuyPopup(e) {
        let buyNumber = e.currentTarget.dataset.num
        let totalAmount = buyNumber * Number(this.data.boxObj.box_open_price)
        let totalIntegral = buyNumber * Number(this.data.boxObj.box_open_integral)
        this.setData({ 
            times: buyNumber,
            buyPopupShow: true,
            totalPrice: totalAmount,
            showPrice: totalAmount,
            requireIntegral: totalIntegral,
            integralRadio: this.data.memberinfo_integral >= totalIntegral ? false : true,
            discountAmount: this.data.couponList.length ? '请选择优惠券' : '无可用优惠券'
        });
    },
    //弹窗里选择抽几次
    changeTimes(e) {
        let buyNumber = e.currentTarget.dataset.num
        let totalAmount = buyNumber * Number(this.data.boxObj.box_open_price)
        let totalIntegral = buyNumber * Number(this.data.boxObj.box_open_integral)
        //微信支付
        if (this.data.select_pay_type == '2') {
            this.setData({ 
                times: buyNumber,
                totalPrice: totalAmount,
                showPrice: totalAmount,
                requireIntegral: totalIntegral,
                integralRadio: this.data.memberinfo_integral >= totalIntegral ? false : true,
                discountAmount: this.data.couponList.length ? '请选择优惠券' : '无可用优惠券',
                couponId: '',
                activeIndex: 99999
            });
        //积分支付
        } else {
            if (this.data.memberinfo_integral >= totalIntegral) {
                this.setData({ 
                    times: buyNumber,
                    totalPrice: totalAmount,
                    showPrice: totalAmount,
                });
            } else {
                wx.showToast({
                    icon: 'none',
                    title: '~可用积分不够哦~',
                })
            }
        }
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
    //查看全部中奖商品
    checkAll() {
        this.setData({ 
            allPrizePopupShow: true
        });
    },
    //关闭全部弹窗
    closeAllPrizePupop() {
        this.setData({ 
            allPrizePopupShow: false
        });
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
                    discountAmount: '请选择优惠券'
                })
            }
        }
		this.setData({
            select_pay_type: radioValue,
            showPrice: this.data.totalPrice
		})
	},
	//点击了radio
	payradioclick(e) {
        console.log("我被执行了")
		this.setData({
			select_pay_type: e.currentTarget.dataset.paytype
		})
    },
    //去胶库页
    goWarehousePage() {
        wx.switchTab({
            url: '/pages/warehouse/warehouse'
        })
    },
    //继续抽盲盒
    againFun() {
        this.getBoxDetailFun() //盒子详情
        this.geCouponFun() //获取优惠券
        this.getAvailableIntegral() //获取可用积分
    },
    //支付
    confirmPayFun() {
        let t = this
        if (this.data.isShake && this.data.select_pay_type) {
            this.setData({ isShake: false })
            app.util.request({
                url: 'entry/wxapp/openthebox',
                data: {
                    m: app.globalData.module_name,
                    box_id: t.data.boxId,
                    open_num: t.data.times,
                    coupon_id: t.data.couponId,
                    tool_id: t.data.toolId,
                    tool_prize_id: t.data.toolPrizeId,
                    paytype: t.data.select_pay_type
                },
                method: 'get',
                success: function (response) {
                    console.log('抽盲盒返回值：', response.data);
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
                            t.setData({
                                
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
                                console.log("支付成功：", res)
                                setTimeout(() => {
                                    t.checkpayresult(response.data.data.local_order_data.order_id)
                                }, 1000)
                            },
                            fail: function (res) {
                                wx.showToast({
                                    icon: 'none',
                                    title: '订单支付失败',
                                })
                                setTimeout(() => {
                                    wx.switchTab({
                                        url: '/pages/mystar/mystar',
                                    })
                                }, 1500)
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
    },
    // 检查支付结果
	checkpayresult(order_id) {
		console.log('check order_id=', order_id);
		let t = this;
		app.util.request({
			url: 'entry/wxapp/checkpayresult',
			data: {
				m: app.globalData.module_name,
				orderid: order_id
			},
			method: 'get',
			success: function (response2) {
				console.log('中奖结果：', response2);
				if (response2.data.errno == 0) {
                    //根据times判断为哪个数组赋值
                    if (5 >= t.data.times) {
                        t.setData({
                            winningPopupShow: true,
                            buyPopupShow: false,
                            couponId: '',
                            activeIndex: 99999,
                            winningList: response2.data.data
                        })
                    } else {
                        t.setData({
                            winningPopupShow: true,
                            buyPopupShow: false,
                            couponId: '',
                            activeIndex: 99999,
                            winningList: response2.data.data.slice(0, 5),
                            winningAllList: response2.data.data
                        })
                    }
				}
			},
			fail: function (response2) {
				console.log('订单支付失败', response2);
				wx.showToast({
					icon: 'none',
					title: response2.data.message,
				})
				return;
			}
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