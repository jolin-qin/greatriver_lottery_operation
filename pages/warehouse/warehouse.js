const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 0,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    TabCur: 0,
    loading:false,
    upperthreshold:false,
    scrollLeft:0,
    prize_pg:0,
    prize_list:[],
    tools_list:[],
    tool_pg:0,
    islogin:true,
    fahuosuccessmodal:false,
    resulttitle:''
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    
    


  },
  getmembersprize(pg){
    var t=this;
    app.util.request({
      url: 'entry/wxapp/getmemberprizes',
      data: {
        m: app.globalData.module_name,
        page:pg
      },
      method: 'get',
      success: function (response) {
        console.log('getmemberprizes',response.data);
        if(response.data.errno==0){
          if(response.data.data.length==0 && pg==0){
            wx.showToast({
              icon:'none',
              title: '没有更多了',
            })
            t.setData({
              prize_list:response.data.data
             
            })
          }else{
            t.setData({
              prize_list:pg>0?t.data.prize_list.concat(response.data.data):response.data.data,
              prize_pg:pg+1
            })
          }
          
         console.log(t.data.prize_list);
        }else{
          //失败
          wx.showToast({
            icon:'none',
            title: '获取参数失败',
          })
          
        }
      },
      fail: function (response) {
        
        wx.showToast({
          icon:'none',
          title: '获取参数失败',
        })
      },
      complete:function(){
        t.setData({
          loading:false
        });
      }
    });
  },
  getmemberstools(pg){
    var t=this;
    app.util.request({
      url: 'entry/wxapp/getmembertools',
      data: {
        m: app.globalData.module_name,
        page:pg
      },
      method: 'get',
      success: function (response) {
        console.log('getmembertools',response.data);
        if(response.data.errno==0){
          if(response.data.data.length==0){
            wx.showToast({
              icon:'none',
              title: '没有更多了',
            })
          }else{
            t.setData({
              tools_list:pg>0?t.data.tools_list.concat(response.data.data):response.data.data,
              tool_pg:pg+1
            })
          }
          
         console.log(t.data.tools_list);
        }else{
          //失败
          wx.showToast({
            icon:'none',
            title: '获取参数失败',
          })
          
        }
      },
      fail: function (response) {
        
        wx.showToast({
          icon:'none',
          title: '获取参数失败',
        })
      },
      complete:function(){
        t.setData({
          loading:false
        });
      }
    });
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  },
  pageChange(e) {
    console.log('PageChange:', e.detail.current)
    
    this.setData({
      activeTab:e.detail.current
    })

  },
  clickchange(e) {
    console.log('PageChange:', e.target.dataset.tab)
    this.setData({
      activeTab:e.target.dataset.tab
    })
    if(e.target.dataset.tab==1 && this.data.tool_pg==0){
      this.getmemberstools(0);
    }


  },
  fahuo(e){
    console.log(e);
    var t=this;
    wx.navigateTo({
      url: '/pages/warehouse/applyfordelivery?id='+e.currentTarget.dataset.id,
    })

  },
  onRefresh() {
    console.log('刷新');
    var t=this;
    this.data.prize_pg=0;
    this.getmembersprize(this.data.prize_pg);
    
    
  },
  toolonRefresh() {
    console.log('刷新');
    var t=this;
    this.data.prize_pg=0;
    this.getmemberstools(this.data.prize_pg);
    
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  PageChange(e){

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
    if(this.data.upperthreshold==true || this.data.prize_pg==0){
      this.getmembersprize(0);
      this.data.upperthreshold=false;
    }
    
  },
  scrolltoupper(){
    console.log('scrolltoupper');
    this.data.upperthreshold=true
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
  hidefahuosuccessmodal(){
    this.setData({
      fahuosuccessmodal:false
    })
  },
  loadmore(){
    
    this.getmembersprize(this.data.prize_pg);
    console.log('上拉触底？',this.data.prize_pg);
  },
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})