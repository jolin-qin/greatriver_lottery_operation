const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pg:0,
    steallist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getlist(0);
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
  getlist(pg){
    var t=this;
    app.util.request({
      url: 'entry/wxapp/steallist',
      data: {
        m: app.globalData.module_name,
        page:pg
        
      },
      method: 'get',
      success: function (response) {
        console.log('steal',response.data);
        if(response.data.errno==0){
          if(t.data.steallist.length>0){
            
            t.data.steallist=t.data.steallist.concat(response.data.data);
          }else{
            t.data.steallist=response.data.data;
          }
         

         t.setData({
          steallist:t.data.steallist
         })
         
        }else{
          //失败
          
          
          
        }
      },
      fail: function (response) {
        
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
  onReachBottom: function () {
    
    var that = this;
    that.data.pg=that.data.pg+1;
    console.log('触发加载更多'+that.data.pg);
    this.getlist(that.data.pg);

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})