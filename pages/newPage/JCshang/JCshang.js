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
		openNum: 0,//打开数量
		payType: '',//支付方式
		couponId: '',//优惠券
		couponPopupShow: false,//优惠券弹窗
		buyPopupShow: true,//购买弹窗
		couponList: [],//可用优惠券
		toolList: [], //道具列表
        activeIndex: 99999,//默认选择优惠券下标
        totalPrice: 0,//合计
        discountAmount: '无可用优惠券',
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
					let arr = [], shengyu = 0, result = response.data.data;
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
					t.setData({
						boxObj: result || {},
						goodsList: arr,
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
	// 获取可用优惠券
	geCouponFun() {
		var t = this;
		app.util.request({
			url: 'entry/wxapp/get_user_coupon',
			data: {
				m: app.globalData.module_name,
				debug: 67
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
        if (result.type === '2' && result.full_minus > this.goodsObj.prize_market_price) {
            wx.showToast({
                icon: 'none',
                title: '商品价格低于满减额',
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
            totalPrice: newPrice
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
        });
    },
    //打开购买弹窗
    openBuyPopup() {
		this.geCouponFun() //获取优惠券
        //运费
        let yunfei = 0;
        if (this.data.goodsObj.prize_postage_type === '1') {
            yunfei = Number(this.data.goodsObj.prize_postage)
        }
        let heji = (Number(this.data.goodsObj.prize_market_price) + yunfei).toFixed(2)
        
        this.setData({ 
            buyPopupShow: true,
            totalPrice: heji,
            discountAmount: this.data.couponList.length ? '请选择优惠券' : '无可用优惠券'
        });
    },
    //打开优惠券弹窗
    openCouponPopup() {
        if (this.data.couponList.length > 0) {
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