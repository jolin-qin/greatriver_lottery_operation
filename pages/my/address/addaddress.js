const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['广东省', '广州市', '海珠区'],
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
  formbsumit(e){
    console.log(e.detail.value);
    if(e.detail.value.name==""){
        wx.showToast({
          icon:'none',
          title: '收货人不能为空',
        })
        return;
    }
    if(e.detail.value.phone==""){
      wx.showToast({
        icon:'none',
        title: '手机号不能为空',
      })
      return;
    }
    if(e.detail.value.address==""){
      wx.showToast({
        icon:'none',
        title: '详细地址不能为空',
      })
      return;
    }
    
    app.util.request({
      url: 'entry/wxapp/addaddress',
      data: {
        m: app.globalData.module_name,
        op:'add',
        name: e.detail.value.name,
        phone: e.detail.value.phone,
        province:e.detail.value.area[0],
        city:e.detail.value.area[1],
        district:e.detail.value.area[2],
        address:e.detail.value.address,
        isdefault:e.detail.value.isdefault==true?1:0
      },
      method: 'post',
      success: function (response) {
        console.log('getboxinfo', response.data);


        if (response.data.errno == 0) {
          wx.showToast({
            icon: 'none',
            title: response.data.message,
          })
          wx.navigateBack({
            delta: -1,
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
          title: '网络连接失败',
        })
      }
    });
  },
  RegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
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