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
    this.getinfo();
  },
  getinfo(){
    var t=this;
    app.util.request({
      url: 'entry/wxapp/gettixianinfo',
      data: {
        m: app.globalData.module_name,
        title: '',
      },
      method: 'get',
      success: function (response) {
        console.log(response.data);
        if(response.data.errno==0){
          t.setData({
            memberinfo:response.data.data,
            memberinfo_yue:parseFloat(response.data.data.yue).toLocaleString(),
            memberinfo_frozen_money:parseFloat(response.data.data.frozen_money).toLocaleString()

          })
          
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
  tixian(){
    var t=this;
    app.util.request({
      url: 'entry/wxapp/dotixian',
      data: {
        m: app.globalData.module_name,
        title: '',
      },
      method: 'get',
      success: function (response) {
        console.log(response.data);
        if(response.data.errno==0){
          wx.showModal({
            title: '提示',
            showCancel:false,
            content:response.data.message,
            success (res) {
              if (res.confirm) {
                t.getinfo();
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          
          
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
        console.log(response.data);
        wx.showModal({
          title: '提示',
          showCancel:false,
          content:response.data.message,
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
  
      },
      complate(response){
        console.log(response.data);
      }
    });

  },
  getPhoneNumber(e){
    console.log()
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    var t=this;
    if(e.detail.errMsg=="getPhoneNumber:ok"){
      app.util.request({
        url: 'entry/wxapp/getphonenumber',
        data: {
          m: app.globalData.module_name,
          iv:e.detail.iv,
          encryptedData:e.detail.encryptedData
        },
        method: 'post',
        success: function (response) {
          console.log(response);
          if(response.data.errno==0){
           
            t.tixian();
          }else{
            wx.showModal({
              title: '提示',
              showCancel:false,
              content:response.data.message,
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        },
        fail: function (response) {
     
          wx.showToast({
            icon:'none',
            title: response.data.message,
          })
    
        }
      });
    }else{
      wx.showModal({
        title: '提示',
        showCancel:false,
        content:'为避免恶意作弊，账号需绑定手机号才可以提现',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    

    
    
  },
  showreasons(e){
    console.log(e);
    if(e.currentTarget.dataset.txt==null){
      wx.showModal({
        title: '详情',
        showCancel:false,
        content:'无',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      wx.showModal({
        title: '详情',
        showCancel:false,
        content:e.currentTarget.dataset.txt,
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
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