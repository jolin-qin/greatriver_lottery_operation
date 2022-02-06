// pages/newPage/JCshang/JCshang.js
const app = getApp();
var inttime = 100;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: app.util.imageUrl,
        projecturl: app.util.projectUrl,
        boxId: '',//盒子Id
        myLevel: '',//我的等级
		boxObj: {},
		goodsList: [],//盒子里商品种类数
		remainNum: 0,//剩余数量
        couponId: '',//优惠券
        toolId: '',//使用道具Id
        useToolNumber: 0,//使用道具数量
        toolPrizeId: '',//使用道具的商品ID
        toolPrizeIndex: '',//选中使用道具的商品index
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
        showTime: 0,//显示时间
        animationPopup: false,//支付完抽奖动画弹窗
        // 轮播的参数
        isAuto: false,
        intervalTime: 250,
        huandongTime: 200,
        currentIndex: 0,
        zhongjiangindex: 0,
        // tabs
        tabs: ['中奖概率', '玩法说明', '分享减免'],
        tabIndex: 0
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
        // this.setData({
        //     isAuto: true
        // })
        // setTimeout(() => {
        //     this.stop(this.data.zhongjiangindex)
        // }, 2500)
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
    stop(which) {
        let index = this.data.currentIndex
        this.stopLuch(which, index, inttime)
    },
    stopLuch(which, index, time) {
        // if (index >= 8) {
        //     index = 0
        // } else {
        //     index = this.data.currentIndex + 1
        // }
        setTimeout(() => {
            if(400 > time || which != index) {
                console.log("isAuto:", this.data.isAuto)
                console.log("time:", time)
                console.log("which:", which)
                console.log("index:", index)
                // splittime++;
                time += 50;
                this.setData({
                    intervalTime: this.data.intervalTime + time,
                })
                // console.log("showTime：", this.data.showTime)
                this.stopLuch(which, this.data.currentIndex, time)
            } else {
                console.log("走的else")
                this.setData({
                    isAuto: false
                })
            }
        }, time)
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
                    //盒子详情内容
                    if (result.box_content) {
					    result.box_content = result.box_content.replace(/\<img/gi, '<img class="rich_img"')
                    }
                    //盒子中奖概率
                    if (result.box_award_details) {
					    result.box_award_details = result.box_award_details.replace(/\<img/gi, '<img class="rich_img"')
                    }
                    //盒子玩法说明
                    if (result.box_play_details) {
					    result.box_play_details = result.box_play_details.replace(/\<img/gi, '<img class="rich_img"')
                    }
                    //盒子分享减免
                    if (result.box_share_details) {
					    result.box_share_details = result.box_share_details.replace(/\<img/gi, '<img class="rich_img"')
                    }
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
						remainNum: shengyu > 0 ? shengyu : 0
                    })
                    //控制每个显示时间
                    t.addTime(arr.length)
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
    addTime(len) {
        setTimeout(() => {
            this.setData({
                showTime: this.data.showTime + 1
            })
            
            if (len >= this.data.showTime) {
                this.addTime(len)
            }
        }, 100)
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
				console.log("个人信息：",response.data);
				if (response.data.errno == 0) {
					t.setData({
						memberinfo_integral: Number(response.data.data.integral),
                        myLevel: response.data.data.star_lv
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
    // 获取道具列表
	getToolsFun() {
		var t = this;
		app.util.request({
			url: 'entry/wxapp/getmembertools',
			data: {
				m: app.globalData.module_name,
			},
			method: 'get',
			success: function (response) {
				console.log('获取道具', response);
				if (response.data.errno == 0) {
                    response.data.data.forEach(item => {
                        item.isSelect = false
                    })
                    t.setData({
                        toolList: response.data.data
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
				// wx.showToast({
				// 	icon: 'none',
				// 	title: '',
				// })
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
            activeIndex: 99999,
            toolPrizeIndex: '',
            toolPrizeId: '',
            toolId: '',
            useToolNumber: 0
        });
    },
    //打开购买弹窗
    openBuyPopup(e) {
        //盲盒被抽完
        if (!this.data.remainNum) {
            wx.showToast({
                icon: 'none',
                title: '盲盒被抽完啦',
            })
            return
        }
        //VIP等级少于开盒等级
        if (Number(this.data.boxObj.star_lv) > Number(this.data.myLevel)) {
            wx.showToast({
                icon: 'none',
                title: '需VIP等级达到'+this.data.boxObj.star_lv+'级哦',
            })
            return
        }
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
        this.getToolsFun()//道具列表
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
                    requireIntegral: totalIntegral
                });
            } else {
                wx.showToast({
                    icon: 'none',
                    title: '~可用积分不够哦~',
                })
            }
        }
    },
    //选择使用道具的商品
    choiceGoodFun(e) {
        let index = e.currentTarget.dataset.index, id = e.currentTarget.dataset.id;
        this.setData({
            toolPrizeId: id,
            toolPrizeIndex: index,
        })
    },
    //选中道具
    openmodal(e) {
        if (!this.data.toolPrizeId) {
            wx.showToast({
                icon: 'none',
                title: '请先选择商品',
            })
            return
        }
        let isSelect = e.currentTarget.dataset.select, id = e.currentTarget.dataset.id, index1 = e.currentTarget.dataset.index;
        this.data.toolList.forEach((item, index) => {
            let emp = 'toolList[' +  index + '].isSelect'
            this.setData({
                [emp]: false
            })
        })
        //判断是否点击同一个
        if (isSelect) {
            this.setData({
                toolId: '',
                useToolNumber: 0
            })
            let emp = 'toolList[' +  index1 + '].isSelect'
            this.setData({
                [emp]: false
            })
            
        } else {
            this.setData({
                toolId: id,
                useToolNumber: 1
            })
            let emp = 'toolList[' +  index1 + '].isSelect'
            this.setData({
                [emp]: true
            })
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
        this.getToolsFun() //获取道具
        this.setData({
            winningPopupShow: false
        })
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
                    if (Array.isArray(response.data.data) && !response.data.data.local_order_data) {
                        console.log("走积分支付")
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
                            //根据times判断为哪个数组赋值
                            if (5 >= t.data.times) {
                                t.setData({
                                    winningPopupShow: true,
                                    buyPopupShow: false,
                                    winningList: response.data.data,
                                    isShake: true
                                })
                            } else {
                                t.setData({
                                    winningPopupShow: true,
                                    buyPopupShow: false,
                                    winningList: response.data.data.slice(0, 5),
                                    winningAllList: response.data.data,
                                    isShake: true
                                })
                            }
                        }, 2000)
                    } else {
                        console.log("走微信支付")
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
                            toolPrizeIndex: '',
                            toolPrizeId: '',
                            toolId: '',
                            useToolNumber: 0,
                            winningList: response2.data.data,
                            isShake: true
                        })
                    } else {
                        t.setData({
                            winningPopupShow: true,
                            buyPopupShow: false,
                            couponId: '',
                            activeIndex: 99999,
                            toolPrizeIndex: '',
                            toolPrizeId: '',
                            toolId: '',
                            useToolNumber: 0,
                            winningList: response2.data.data.slice(0, 5),
                            winningAllList: response2.data.data,
                            isShake: true
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
                t.setData({
                    isShake: true
                })
				return;
			}
		})
    },
    //显示大图(最终赏)
    viewBigPic_1(e) {
        console.log("e:", e)
        let url = e.currentTarget.dataset.url, arr = [];
        arr.push(url)
        wx.previewImage({
			current: url, // 当前显示图片的http链接
			urls: arr // 需要预览的图片http链接列表
		})
    },
    //显示大图(九宫格)
    viewBigPic(e) {
        console.log("e:", e)
        let all = e.currentTarget.dataset.all, arr = [], index = e.currentTarget.dataset.index;
        all.forEach(item => {
            arr.push(item.prize_pic)
        })
        wx.previewImage({
			current: all[index].prize_pic, // 当前显示图片的http链接
			urls: arr // 需要预览的图片http链接列表
		})
    },
    //swiper切换
    handleChange(e) {
        console.log("currentIndex:", e.detail.current)
        this.setData({
            currentIndex: e.detail.current
        })
    },
    clickTab(e) {
        let index = e.currentTarget.dataset.index
        this.setData({
            tabIndex: index
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