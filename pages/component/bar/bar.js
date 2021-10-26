// pages/component/bar/bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    navtab: String,
  
    scrolltop:{
      type:Boolean,
      value:false,
      observer:function(newval,oldval){
          console.log(newval,oldval);
          if(newval){
            this.setData({
              indextitle:'返回顶部',
              animation1:'rocket-animation'
            })
            setTimeout(()=>{
              this.setData({
              
                //rocket_animation:''
               
              })
             },1000)
          }else{
            this.setData({
              indextitle:'首页',
              animation1:'rocket-animation2'
            })
            setTimeout(()=>{
              this.setData({
              
                //rocket_animation:''
               
              })
             },1000)
          }
          
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { 
      console.log(this.properties.navtab+'?????');
      
      if(this.properties.navtab=='index'){
        this.setData({
          animation1:'animation'
        })
        
        
      }
      if(this.properties.navtab=='warehouse'){
        this.setData({
          animation2:'animation'
        })
       
      }
      if(this.properties.navtab=='mystar'){
        this.setData({
          animation3:'star-animation'
        })
       
      }
      if(this.properties.navtab=='shop'){
        this.setData({
          animation4:'animation'
        })
        
      }
      if(this.properties.navtab=='my'){
        this.setData({
          animation5:'animation'
        })
        
      }
    },
    hide: function () { 
      this.setData({
        animation1:'',
        animation2:'',
        animation3:'',
        animation4:'',
        animation5:''
      })
    },
    resize: function () { },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    
    nav: function(e){
      console.log(e);
      console.log('show',this.properties.navtab);
      console.log(this.properties.navtab);
      if(this.properties.navtab=='index'){
        if(e.currentTarget.dataset.tabs=='index'){
          console.log('我在首页，点的还是首页，出现火箭吧');
          wx.pageScrollTo({
            scrollTop: 0
          })
        }
      }
      
      if(e.currentTarget.dataset.tabs=='index'){
        wx.switchTab({
          url: '/pages/index/index',
        })
        
      }
      if(e.currentTarget.dataset.tabs=='mystar'){
        wx.switchTab({
          url: '/pages/mystar/mystar',
        })
      }
      if(e.currentTarget.dataset.tabs=='warehouse'){
        wx.switchTab({
          url: '/pages/warehouse/warehouse',
        })
      }
      if(e.currentTarget.dataset.tabs=='shop'){
        wx.switchTab({
          url: '/pages/shop/shop',
        })
      }
      if(e.currentTarget.dataset.tabs=='my'){
        wx.switchTab({
          url: '/pages/my/my',
        })
      }
    },
  }
})
