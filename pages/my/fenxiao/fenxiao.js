const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:0,
    distribution_list:[],
    modal:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t=this;
    app.util.request({
      url: 'entry/wxapp/getfenxiao',
      data: {
        m: app.globalData.module_name,
        op: 'info',
      },
      method: 'get',
      success: function (response) {
        console.log(response.data);
        if(response.data.errno==0){
          t.setData({
            first_stage_num:response.data.data.first_stage_num,
            second_stage_num:response.data.data.second_stage_num,
            history_sum_money:response.data.data.history_sum_money,
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
    this.getinfo();
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
  jump(){
    wx.switchTab({
      url: '/pages/mystar/mystar',
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
  qrcode(){
    wx.navigateTo({
      url: '/pages/my/canvas/canvas',
    })
  },
  hideModal(){
    this.setData({
      modal:false
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.page=this.data.page+1;
    this.getinfo();
  },
  getinfo(){
    var t=this;
    app.util.request({
      url: 'entry/wxapp/getfenxiao',
      data: {
        m: app.globalData.module_name,
        op: '',
        page:t.data.page,
      },
      method: 'get',
      success: function (response) {
        console.log(response.data);
        if(response.data.errno==0){
          t.setData({
            
            distribution_list: t.data.page > 0 ? t.data.distribution_list.concat(response.data.data) : response.data.data,
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
  share(){
    this.setData({
      modal:true
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var memberinfo=wx.getStorageSync('memberinfo');
    var uid=0;
    console.log('uid',memberinfo.id);
    memberinfo.id&&(uid=memberinfo.id);
    var t=this;
   
    console.log('/pages/index/index?sharetype=invite&uid='+uid);
    
    return {
      title: '礼品盒子无限抽！',
      imageUrl:'',
      path: '/pages/index/index?sharetype=invite&uid='+uid
    }
    
    
    
  },
})