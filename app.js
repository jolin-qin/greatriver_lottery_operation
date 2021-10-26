var util = require('resource/js/util.js');
App({
    onLaunch: function (res) {
        wx.getSystemInfo({
            success: e => {
              this.globalData.StatusBar = e.statusBarHeight;
              let custom = wx.getMenuButtonBoundingClientRect();
              this.globalData.Custom = custom;  
              this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
            }
          })
    },
    onShow: function (res) {
    },
    onHide: function () {
    },
    onError: function (msg) {
        console.log(msg)
    },
    //加载微擎工具类
    util: util,
    //导航菜单，微擎将会自己实现一个导航菜单，结构与小程序导航菜单相同
    //用户信息，sessionid是用户是否登录的凭证
    userInfo: {
        sessionid: null,
    },
    "tabBar": {
        "color": "#999",
        "selectedColor": "#f86b4f",
        "borderStyle": "#fff",
        "backgroundColor": "#fff",
        "list": [
            {
                "pagePath": "/pages/index/index",
                "iconPath": "/resource/icon/home.png",
                "selectedIconPath": "/resource/icon/home-selected.png",
                "text": "首页"
            },
            {
                "pagePath": "/pages/index/index",
                "iconPath": "/resource/icon/home.png",
                "selectedIconPath": "/resource/icon/home-selected.png",
                "text": "首页"
            },
            {
                "pagePath": "/pages/index/index",
                "iconPath": "/resource/icon/home.png",
                "selectedIconPath": "/resource/icon/home-selected.png",
                "text": "首页"
            },
            {
                "pagePath": "/pages/index/index",
                "iconPath": "/resource/icon/home.png",
                "selectedIconPath": "/resource/icon/home-selected.png",
                "text": "首页"
            },
        ]
    },
    globalData:{
        guide:{
            0:false, //引导确认
            1:false, //引导点击领取矿石按钮
            2:false, //引导点击兑换盒子按钮
            3:false, //引导打开第一个盒子
            4:false, //星球页引导点击挖矿按钮
            5:false, //挖矿完成返回首页引导
            6:false, //引导点击立即开盒按钮
            7:false, //结束语
            
        },
        guide_step:0,
        juming_notice:0,
        develop_version:"1.0.9_operation",
        module_name:"greatriver_lottery_operation"
    },
    siteInfo: require('siteinfo.js')
});