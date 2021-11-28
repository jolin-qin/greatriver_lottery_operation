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