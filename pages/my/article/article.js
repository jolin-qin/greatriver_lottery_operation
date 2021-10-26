const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t=this;
    app.util.request({
      url: 'entry/wxapp/getarticle',
      data: {
        m: app.globalData.module_name
        
      },
      method: 'get',
      success: function (response) {
        console.log(response.data);
        if(response.data.errno==0){
          if(options.type=='help'){
            wx.setNavigationBarTitle({
              title: '帮助中心' 
            })
            t.setData({
              article:response.data.data.help_content
            })
          }
          if(options.type=='xieyi'){
            wx.setNavigationBarTitle({
              title: '使用协议' 
            })
            t.setData({
              article:response.data.data.xieyi_content
            })
          }
          if(options.type=='about'){
            wx.setNavigationBarTitle({
              title: '关于我们' 
            })
            t.setData({
              article:response.data.data.about_content
            })
          }
          
          
        }else{
          /*
          t.setData({
            memberinfo:response.data.data,
            memberinfo_integral:parseFloat(response.data.data.integral).toLocaleString()
          })
          */
        }
      },
      fail: function (response) {
   
        wx.showToast({
          icon:'none',
          title: '网络错误',
        })
  
      }
    });
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