const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('我是app.globalData.invite_uid',app.globalData.invite_uid);
    var MenuButton=wx.getMenuButtonBoundingClientRect();
    var t=this;
    this.setData({
      
      MenuButton:MenuButton
    })
    if (wx.getUserProfile) {
      
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

    app.util.request({
      url: 'entry/wxapp/getloginbg',
      data: {
        m: app.globalData.module_name,

      },
      method: 'get',
      success: function (response) {
        console.log('getindexparameter', response.data);
        if (response.data.errno == 0) {
          t.setData({
            info: response.data.data.loginbackground,

          })
          

          



        }else {
          //失败
          console.log('???',response.data.errno);
          

        }
      },
      fail: function (response) {
        
        
        
      },
      complete: function () {
        
      }
    });
/*
    app.util.getUserInfo(function (userInfo) {
      console.log(userInfo)
    })
    */
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
  back(){
    
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
  updateUserInfo(result) {
    var t=this;
    var app = getApp()
	//拿到用户数据时，通过app.util.getUserinfo将加密串传递给服务端
  //服务端会解密，并保存用户数据，生成sessionid返回
  if(result.errMsg=="getUserProfile:fail auth deny"){
    wx.showModal({
      title: '提示',
      showCancel:false,
      content:'您拒绝了授权，无法登录',
      success (res) {
        if (res.confirm) {
          wx.navigateBack({
            delta:1
          })
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    return;
  }

    app.util.getUserInfo(function(userInfo) {
		//这回userInfo为用户信息
       console.log('userInfo',userInfo);
       console.log('邀请者UID',app.globalData.invite_uid);
       if(userInfo.sessionid){
        app.util.request({
          url: 'entry/wxapp/getuserinfo',
          data: {
            m: app.globalData.module_name,
            invite_uid: app.globalData.invite_uid?app.globalData.invite_uid:0,
          },
          method: 'post',
          success: function (response) {
            console.log('登录返回信息',response.data);
            if(response.data.errno==9999){
              //未注册
              
            }else{
              console.log('登录成功');
              if(result.errMsg=="getUserProfile:ok"){
                console.log('授权成功？',result);
                //授权成功，重新更新头像等资料
                
                app.util.request({
                  url: 'entry/wxapp/update',
                  data: {
                    m: app.globalData.module_name,
                    avatar: result.userInfo.avatarUrl,
                    nickname: result.userInfo.nickName,
                    city: result.userInfo.city,
                    sex: result.userInfo.gender,
                  },
                  method: 'post',
                  success: function (response) {
                    console.log('更新用户资料成功',response.data);
                    
                  },
                  fail: function (response) {
                    console.log('更新用户资料失败',response);
                  }
                });
                
                
              }else if(result.errMsg=="getUserProfile:fail auth deny"){
                console.log('您拒绝了授权，无法登录。');
              }else{
                console.log(result.errMsg);
              }
              t.setData({
                memberinfo:response.data.data
              })
              try {
                wx.setStorageSync('memberinfo',response.data.data)
              } catch (e) { }
              
              console.log('登录成功,设置memberinfo缓存成功');
              wx.navigateBack({
                delta:1
              })
            }
          },
          fail: function (response) {
            console.log('登录错误？',response);
          }
        });
       }else{
        console.log('uid都没获取到？？');
       }
    })
    //console.log(result.detail)
    console.log('登录返回信息aa',result);
    
},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    

  },

  login(){
    var t=this;
    console.log('哈哈 新接口');
    wx.getUserProfile({
      'desc':'讲获取您的公开信息用于登录',
      success:function(res){
        console.log(res);
      },
      fail:function(res){
        console.log(res);
      },
      complete:function(res){
        t.updateUserInfo(res);
      }
    })
      
    
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