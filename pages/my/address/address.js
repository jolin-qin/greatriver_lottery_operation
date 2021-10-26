const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    address_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.StatusBar);
    console.log(this.data.CustomBar);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  addaddress(){
    wx.navigateTo({
      url: '/pages/my/address/addaddress',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var t=this;
    app.util.request({
      url: 'entry/wxapp/getaddress',
      data: {
        m: app.globalData.module_name,
        op:'list',
      },
      method: 'get',
      success: function (response) {
        console.log('', response.data);


        if (response.data.errno == 0) {
          t.setData({
            'address_list':response.data.data
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
        console.log(response);
        if(response.data.errno==9999){
          wx.showToast({
            icon: 'none',
            title: '没有信息',
          })
        }
        
      }
    });
  },

  select(e){
    
    app.globalData.selectaddressid=e.currentTarget.dataset.id
    wx.navigateBack({
      delta: -1,
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