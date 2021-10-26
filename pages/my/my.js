const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberinfo:[],
    loginmodal:false,
    
    menulist:[{
      'icon':'/resource/icon/add.png',
      'title':'地址管理',
      'desc':'还没有添加收货地址',
      'path':'/pages/my/address/address'
    },{
      'icon':'/resource/icon/message.png',
      'title':'客服中心',
      'desc':'问题咨询和交流群',
      'path':'/pages/webview/webview?url=http://www.baidu.com'
    },{
      'icon':'/resource/icon/help.png',
      'title':'帮助与反馈',
      'desc':'',
      'path':''
    },{
      'icon':'/resource/icon/xieyi.png',
      'title':'使用协议',
      'desc':'',
      'path':''
    },{
      'icon':'/resource/icon/about.png',
      'title':'关于我们',
      'desc':'',
      'path':''
    }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      version:app.siteInfo.version,
      develop_version:app.globalData.develop_version
    })
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
    var t=this;
    
    if(!app.util.islogin()){
      this.setData({
       islogin:false
      })
      return;
    }else{
      this.setData({
        islogin:true
       })
    }

   app.util.request({
    url: 'entry/wxapp/getuserinfo',
    data: {
      m: app.globalData.module_name,
      title: '',
    },
    method: 'post',
    success: function (response) {
      console.log(response.data);
      if(response.data.errno==9999){
        //未授权头像
        
      }else{
        t.setData({
          memberinfo:response.data.data,
          memberinfo_integral:parseFloat(response.data.data.integral).toLocaleString()
        })
        wx.setStorage({
          key:"memberinfo",
          data:response.data.data
        })
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  jumppage_index(e){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  jumppage_login(e){
    wx.navigateTo({
      url: '/pages/auth/auth',
    })
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