const app = getApp();
let videoAd = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    jifen:0.00,
    starparameter:[],
    one_sec_productivity:0,
    one_sec_productivity2:0,
    available_integral:0,
    successmodalenable:false,
    islogin:true,
    isgzhtask:0,
    isminiapptask:0,
    miniapp_runtime:0,
    intervalID:0,
    liuliangzhu_parameter:[],
    selecttask:[],
    ads:[],
    pg:0,
    questionmodal:false,
    answer:'',
    inviterlist:[],
    show_jili_type:0//触发激励视频的原因0挖掘矿石 1激励任务
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var randomnum2=0;
   var t=this;
    setInterval(()=>{
      
      randomnum2=Math.floor(Math.random()*4);
      if(randomnum2==t.data.randomnum){
      
      }else{
       
       
       
       t.data.randomnum=randomnum2;
      }
      
      t.data.available_integral=parseFloat(t.data.available_integral+t.data.one_sec_productivity).toFixed(3)
      t.data.available_integral=parseFloat(t.data.available_integral);
      
      t.setData({
       
       jifenanimation:'jifen-animation'
      
     })
      setTimeout(()=>{
       t.setData({
       
         jifenanimation:''
        
       })
      },500)
      
     t.setData({
      available_integral2:t.data.available_integral.toLocaleString(),
      
      
     })
     //console.log(t.data.danmulist);
     
   },1000)
    
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
 // 在页面onLoad回调事件中创建激励视频广告实例
    var t =this;
    wx.getStorage({
      key: 'guide',
      success (res) {
        console.log(res.data)
        
      },
      fail(){
        wx.createSelectorQuery().select('#wjbutton').boundingClientRect(function(res){
          console.log('wjbutton',res)
          t.setData({
            yindao_d:res
          })
        }).exec()
        app.globalData.guide[4]=true;
        t.setData({
          guide:app.globalData.guide
        })
      }
    })
   
    

  },
  dotask(e){
    var t=this;
    t.data.selecttask=[];
    console.log(t.data.tasklist[e.currentTarget.dataset.index]);
    
    t.setData({
      selecttask:t.data.tasklist[e.currentTarget.dataset.index]
    })
    switch(t.data.selecttask.task_type)
{
        case "1":
         console.log('每日签到');
         t.up_taskinfo(t.data.selecttask.id,'');
        break;
        case "2":
          console.log('每日开盒');
          t.up_taskinfo(t.data.selecttask.id,'');
        break;
        case "3":
          console.log('关注公众号');
          wx.navigateTo({
            url: '/pages/webview/webview?url='+t.data.selecttask['gzh_qrurl'],
          })
          t.data.isgzhtask=t.data.selecttask.id;
          
        break;
        case "4":
          console.log('体验小程序');
          wx.navigateToMiniProgram({
            appId: t.data.selecttask['miniapp_appid'],
            path: t.data.selecttask['miniapp_path'],
            
            
            success(res) {
              // 打开成功开始计时
              t.data.isminiapptask=t.data.selecttask.id;
              t.data.intervalID=setInterval(()=>{
                t.data.miniapp_runtime=t.data.miniapp_runtime+1;
                t.data.miniapp_min_runtime=parseInt(t.data.selecttask['miniapp_runtime']);
                console.log('小程序运行秒数',t.data.miniapp_runtime);
              }, 1000)
            },
            fail(res) {
              console.log(res);
              wx.showModal({
                title: '错误',
                showCancel:false,
                content:res.errMsg,
                success (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
          

        break;
        case "5":
          t.data.show_jili_type=1;
          if (videoAd) {
            videoAd.show().catch(() => {
              // 失败重试
              videoAd.load()
                .then(() => videoAd.show())
                .catch(err => {
                  console.log('激励视频 广告显示失败',err)
                })
            })
          }
          console.log('观看激励视频');
        break;
        case "6":
          t.setData({
            answer:'',
            questionmodal:true
          })
          console.log('答题任务');
        break;
          
}
  },
  up_taskinfo(taskid,answer){
    var t=this;
    console.log('当前任务taskid'+taskid);
    app.util.request({
      url: 'entry/wxapp/uptaskinfo',
      data: {
        m: app.globalData.module_name,
        id:taskid,
        answer:answer
        
      },
      method: 'post',
      success: function (response) {
        console.log('uptaskinfo',response.data);
        if(response.data.errno==0){
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
          t.setData({
            questionmodal:false,
            answer:''
          })
         
        }else{
          //失败
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
        t.getindexparameter();
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
  taskcardtap(e){
    console.log(e.currentTarget.dataset.id);
    this.setData({
      clicktaskid:e.currentTarget.dataset.id,
    })
    setTimeout(()=>{
      this.setData({
        clicktaskid:''
      })
     },500)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var t=this
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
    t.getinviterlist(0);
    
    if(t.data.isgzhtask!==0){
      t.up_taskinfo(t.data.isgzhtask,'');
      t.data.isgzhtask=0;
    }
    if(t.data.isminiapptask!==0){
      clearInterval(t.data.intervalID);
      
      if(t.data.miniapp_runtime<t.data.miniapp_min_runtime){
        wx.showModal({
          title: '提示',
          showCancel:false,
          content:'试用时间不足'+t.data.miniapp_min_runtime+'秒，无法领取奖励',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        t.data.isminiapptask=0;
        t.data.miniapp_runtime=0;
        t.data.miniapp_min_runtime=0;
        return;
      }
      
      
      t.up_taskinfo(t.data.isminiapptask,'');
      t.data.isminiapptask=0;
      t.data.miniapp_runtime=0;
      t.data.miniapp_min_runtime=0;
      
    }

    
         
    this.getindexparameter();
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.guide[5]=false;
    if(app.globalData.guide_step<5){
      app.globalData.guide_step=5;
      
    }
    this.setData({
      guide:app.globalData.guide
    })
    

    
    console.log('触发了onhide');
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

    var that = this;
    that.data.pg=that.data.pg+1;
    console.log('触发加载更多'+that.data.pg);
    this.getinviterlist(that.data.pg);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var uid=0;
    var memberinfo=wx.getStorageSync('memberinfo');
    
    
    memberinfo.id&&(uid=memberinfo.id);
    console.log('uid',uid);
    return {
      title: '来我的星球抽好物吧',
      imageUrl:'',
      path: '/pages/index/index?sharetype=invite&uid='+uid
    }
  },
  clickgetintegral() {
    // 用户触发广告后，显示激励视频广告
    this.data.show_jili_type=0;
    console.log('触发激励视频');
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
    }
  },
  getintegral(e){
    var t=this;
    app.globalData.guide[4]=false;
    app.globalData.guide[5]=true;
    t.setData({
      guide:app.globalData.guide
    })
    if(app.util.islogin()){
      console.log('已经登陆 执行业务流程');
      app.util.request({
        url: 'entry/wxapp/getintegral',
        data: {
          m: app.globalData.module_name,
          
        },
        method: 'get',
        success: function (response) {
          console.log('getintegral',response.data);
          if(response.data.errno==0){
            
            
            wx.showModal({
              title: '领取成功',
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
            t.getindexparameter();
          }else{
            //失败
            
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
      console.log('还没登陆');
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
    }

  },
  hidemodal(){
    this.setData({
      questionmodal:false
    })
  },
  steal(e){
    console.log(e);
    var t=this;
    app.util.request({
      url: 'entry/wxapp/steal',
      data: {
        m: app.globalData.module_name,
        uid:e.currentTarget.dataset.uid
        
      },
      method: 'get',
      success: function (response) {
        console.log('steal',response.data);
        if(response.data.errno==0){
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
          t.getindexparameter();
          
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
  inputanswer(e){
    console.log(e.detail.value);
    this.data.answer=e.detail.value;
  },
  doanswertask(){
    this.up_taskinfo(this.data.selecttask['id'],this.data.answer);
  },
  showsuccessmodal(enable,title,content){
    enable?
    this.setData({
      successmodalenable:true,
      successmodal:{
        
        'title':title,
        'content':content
      }
    }):this.setData({
      successmodalenable:false,
    })
  },
  getinviterlist(pg){
    var t=this;
    app.util.request({
      url: 'entry/wxapp/getinviterlist',
      data: {
        m: app.globalData.module_name,
        page:t.data.pg
        
      },
      method: 'get',
      success: function (response) {
        console.log('getinviterlist',response.data);
        if(response.data.errno==0){
          if(t.data.pg>0){
            
            t.data.inviterlist=t.data.inviterlist.concat(response.data.data);
          }else{
            t.data.inviterlist=response.data.data;
          }
          t.setData({
            inviterlist:t.data.inviterlist
          })
          
          if(t.data.inviterlist.length>0){
            wx.getStorage({
              key: 'guide',
              success (res) {
                wx.getStorage({
                  key: 'juming_notice',
                  success (res) {
                    
                  },
                  fail(){
                    wx.setStorage({
                      key:"juming_notice",
                      data:"1"
                    })
                    t.setData({
                      juming_notice:true
                    })
                    
                  }
                })
                
              },
              fail(){
               
              }
            })


            
          }
          
        }else{
          //失败
          
          
          
        }
      },
      fail: function (response) {
        
       
      }
    });
  },
  closenotice(){
    

    this.setData({
      juming_notice:false
    })
 
  },
  getindexparameter(){
    var t=this;
    app.util.request({
      url: 'entry/wxapp/getstarparameter',
      data: {
        m: app.globalData.module_name,
        
      },
      method: 'get',
      success: function (response) {
        console.log('getstarparameter',response.data);
        if(response.data.errno==0){
          t.setData({
            starparameter:response.data.data,
            one_sec_productivity:response.data.data.calculate_available_integral.one_sec_productivity,
            one_sec_productivity2:(response.data.data.calculate_available_integral.one_sec_productivity*60).toFixed(3),
            available_integral:response.data.data.calculate_available_integral.final_integral,
            onepeople_productivity:response.data.data.calculate_available_integral.onepeople_second_integral*86400,
            tasklist:response.data.data.tasklist,
            liuliangzhu_parameter: response.data.data.liuliangzhu_parameter,
            ads: response.data.data.ad,
          })
          if(response.data.data.task_jili_enable==1 || response.data.data.jiliad_enable==1){
              if(!videoAd){
                if (wx.createRewardedVideoAd) {
                  videoAd = wx.createRewardedVideoAd({
                    adUnitId: t.data.liuliangzhu_parameter.jili_adid
                  })
                  videoAd.onLoad(() => {})
                  videoAd.onError((err) => {})
                  videoAd.onClose((res) => {
                    console.log(res);
                    if(res.isEnded){
                      if(t.data.show_jili_type==0){
                        t.getintegral();
                      }else if(t.data.show_jili_type==1){
                        t.up_taskinfo(t.data.selecttask['id'],'');
                      }
                        
                    }else{
                      wx.showModal({
                        title: '提示',
                        showCancel:false,
                        content:'完整看完视频才能领取哦',
                        success (res) {
                          if (res.confirm) {
                            console.log('用户点击确定')
                          } else if (res.cancel) {
                            console.log('用户点击取消')
                          }
                        }
                      })

                      
                    }
                  })
                }
              }
          }
         
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
      }
    });
  }


})