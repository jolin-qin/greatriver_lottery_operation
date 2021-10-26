// pages/component/loginmodal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    jumppage_login: function(e){
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
    },
    jumppage_index: function(e){
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  }
})
