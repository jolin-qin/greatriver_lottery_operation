// pages/component/bar/bar.js
const app = getApp()

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		navtab: String,
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		jumpurl: '',
		jumppng: '',
	},
	lifetimes: {
		
		attached() {
			// app.watch(this.watchBack)
			this.setJumpUrl()
		}
	},
	
	/**
	 * 组件的方法列表
	 */
	methods: {
		watchBack(value) { //这里的value 就是 app.js 中 watch 方法中的 set, 返回整个 globalData
			let that = this;
			that.setData({
				jumpurl: app.globalData.jump_url,
				jumppng: value,
			});
		},
		setJumpUrl() {
			this.setData({
				jumpurl: app.globalData.jump_url,
				jumppng: app.globalData.jump_png,
			});
		},
		//跳转webview
		tiaozhuan() {
			wx.navigateTo({
				//url太长且会被截取，编码一下，避免这种情况
				url: `/pages/newPage/webviewH5/webviewH5?url=${encodeURIComponent(this.data.jumpurl)}`,
			});
		}
	}
})