// pages/newPage/paySuccess.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        scrollList: [],
        boxId: '',//盒子Id
        finalList: [],
        animationData: null,
        zhongjiangindex: 6,//中奖价格最高的在scrollList数组里对应的index
        allPrizePopupShow: false,
        winningAllList: [],//全包中奖
        winningList: [{},{},{}],//1、3、5次抽奖
        times: '',//抽奖次数
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            boxId: options.id
        })
        //从缓存中取中奖数组(5是除了全包外的购买盒子，6是全包购买盒子)
        if (options.time == '5') {
            let takeout = wx.getStorageSync('prizedata')
            if (takeout) {
                console.log("55555:", JSON.parse(takeout))
                this.setData({
                    winningList: JSON.parse(takeout),
                    times: '5'
                })
            }
        } else {
            let takeout = wx.getStorageSync('prizedata')
            if (takeout) {
                console.log("66666:", JSON.parse(takeout))
                this.setData({
                    allPrizePopupShow: true,
                    winningAllList: JSON.parse(takeout),
                    times: '6'
                })
            }
        }
        //盒子详情
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
                    let result = response.data.data.prizes_list
					t.setData({
                        scrollList: result,
                        finalList: [...result,...result,...result,...result]
                    })
                    //利用中奖数组第一项，找出它在result中的下标值，抽奖用
                    if (t.data.times == '5') {
                        let index = result.findIndex(function(x){
                            return x.prize_fragment_id == t.data.winningList[0].prize_fragment_id
                        })
                        t.setData({
                            zhongjiangindex: index
                        })
                    } else if (t.data.times == '6') {
                        let index = result.findIndex(function(x){
                            return x.prize_fragment_id == t.data.winningAllList[0].prize_fragment_id
                        })
                        t.setData({
                            zhongjiangindex: index
                        })
                    }
                    //抽奖效果
                    t.translateFun()
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
    translateFun() {
        //cycle表示3个周期，duration动画执行时间，translateNumber平移距离
        let cycle = 3,duration = 4000,translateNumber = 0;
        //移动3个周期+中奖的下标
        translateNumber = this.data.scrollList.length * 110 * cycle + (this.data.zhongjiangindex - 1) * 110
        //创建动画
        let animationRun = wx.createAnimation({  
            duration: duration,
            timingFunction: 'ease',
            delay: 500
        })
        animationRun.translateX(-translateNumber).step()
        this.setData({
            animationData: animationRun.export()
        })
    },
    //关闭全部弹窗
    closeAllPrizePupop() {
        this.setData({ 
            allPrizePopupShow: false
        });
    },
    //去胶库页
    goWarehousePage() {
        wx.switchTab({
            url: '/pages/warehouse/warehouse'
        })
    },
    //继续抽盲盒
    againFun() {
        wx.redirectTo({
            url: '/pages/newPage/JCshang/JCshang?id='+this.data.boxId
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