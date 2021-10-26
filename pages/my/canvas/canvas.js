import Info from "../../../resource/js/canvas.js"; //引入外部js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    code: "",
    title: "",
    imgs: "",
    imgUrl: "",
    sHeight: "",
    sWidth: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '海报生成中...',
    })
    var memberinfo = wx.getStorageSync('memberinfo');
    var uid = 0;
    console.log('uid', memberinfo.id);
    memberinfo.id && (uid = memberinfo.id);
    app.util.request({
      url: 'entry/wxapp/getqrbg',
      data: {
        m: app.globalData.module_name,

      },
      method: 'get',
      success: function (response) {
        console.log(response.data);
        wx.showLoading({
          title: '海报生成中...',
        })
        if (response.data.errno == 0) {

          wx.downloadFile({
            url: response.data.data,
            success: (res) => {
              that.setData({
                imgs: res.tempFilePath
              })
              wx.downloadFile({
                url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=makeqrcode&m=' + app.globalData.module_name + '&uid=' + uid,
                success: (res) => {
                  that.setData({
                    code: res.tempFilePath
                  })
                  //获取设备的宽高，因为canvas中像素是px而不是rpx

                  wx.getSystemInfo({
                    success: function (res) {
                      console.log(res);
                      that.setData({
                        sHeight: 2 * res.screenWidth, //设计稿上面的宽高
                        sWidth: res.screenWidth
                      })
                      setTimeout(() => {
                        Info.getPhone(that.data.code, that.data.imgs, that.data.sWidth, that.data.sHeight, 'shareImg', 'center', 'red', 'yellow', ) //调用外部封装好的js
                      }, 0)



                    }
                  })
                },
                fail:function(e){
                  console.log(e);
                  wx.showToast({
                    title: '背景或白名单未设置',
                  })
                }
              })
            }
          })
        }
      },
      fail: function (response) {

        wx.showToast({
          icon: 'none',
          title: '网络错误',
        })

      }
    });




  },

  //保存海报到手机相册
  save: function () {
    var that = this
    wx.showLoading({
      title: '保存中...',
    })
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imgurl,
      success(t) {
        wx.showModal({
          content: '海报已保存到相册',
          showCancel: false,
          confirmText: '好的',
          success: function (t) {
            if (t.confirm) {
              console.log('用户确定了');
              that.setData({
                hidden: true
              })
            }
          },

        })
      },
      fail: function (t) {
        console.log("失败", t);
        wx.getSetting({
          success: function (t) {
            t.authSetting["scope.writePhotosAlbum"] || (console.log("进入信息授权开关页面"), wx.openSetting({
              success: function (t) {
                console.log("openSetting success", t.authSetting);
              }
            }));
          }
        });
      },
      complete: function (t) {
        wx.hideLoading({
          success: (res) => {},
        })
      }
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