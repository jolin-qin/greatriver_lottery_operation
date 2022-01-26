const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		prize: {},
		useraddress: {},
		member_prize_id: 0,
		modal: false,
		payloading: 0
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var t = this;
		t.data.member_prize_id = options.id;//订单id
		// app.globalData.selectaddressid == null
		app.globalData.selectaddressid = null;
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		if (!app.util.islogin()) {
			this.setData({
				islogin: false
			})
			return;
		} else {
			this.setData({
				islogin: true
			})
		}
		// console.log(app.globalData.selectaddressid);
		// console.log(typeof app.globalData.selectaddressid);
		this.getprize();
	},
	//获取订单详情
	getprize() {
		var t = this;
		app.util.request({
			url: 'entry/wxapp/applydelivery',
			data: {
				m: app.globalData.module_name,
				id: t.data.member_prize_id,
				op: 'getinfo'
			},
			method: 'get',
			success: function (response) {
				console.log('订单详情：', response.data);
				if (response.data.errno == 0) {
					let result = response.data.data
					result.prize.prize_content = result.prize.prize_content.replace(/\<img/gi, '<img class="rich_img"')
					t.setData({
						prize: result
					})
					//判断一下看用订单详情返回的收获地址，还是用户在地址列表页选择了某个地址
					if (app.globalData.selectaddressid) {
						t.getChooseAddress()
					} else {
						t.setData({
							useraddress: result.user_address || {}
						})
					}
				} else {
					//失败
					wx.showToast({
						icon: 'none',
						title: '获取参数失败',
					})

				}
			},
			fail: function (response) {
				
				wx.showModal({
					title: '提示',
					showCancel: false,
					content: response.data.message,
					success(res) {
						if (res.confirm) {
							console.log('用户点击确定')
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			complete: function () {
				t.setData({
					loading: false
				});
			}
		});
	},
	//根据用户在地址列表选择收获地址的id，请求数据
	getChooseAddress() {
		let t = this;
		app.util.request({
			url: 'entry/wxapp/getaddress',
			data: {
				m: app.globalData.module_name,
				op: 'one',
				id: app.globalData.selectaddressid
			},
			method: 'get',
			success: function (response) {
				console.log('选的地址：', response.data);
				if (response.data.errno == 0) {
					t.setData({
						useraddress: response.data.data
					})
				} else {
					//失败
					t.setData({
						useraddress: {}
					})
					wx.showToast({
						icon: 'none',
						title: response.data.message,
					})
				}
			},
			fail: function (response) {
				wx.showToast({
					icon: 'none',
					title: '网络连接失败',
				})
			}
		})
	},
	//复制快递单号
	copyexpress() {
		wx.setClipboardData({
			data: this.data.prize.poster.express_sn,
			success(res) {

			}
		})
	},
	//获取手机号
	getPhoneNumber(e) {
		console.log()
		console.log(e.detail.iv)
		console.log(e.detail.encryptedData)
		var t = this;
		if (e.detail.errMsg == "getPhoneNumber:ok") {
			app.util.request({
				url: 'entry/wxapp/getphonenumber',
				data: {
					m: app.globalData.module_name,
					iv: e.detail.iv,
					encryptedData: e.detail.encryptedData
				},
				method: 'post',
				success: function (response) {
					console.log(response);
					if (response.data.errno == 0) {

						t.clickdelivery();
					} else {
						wx.showModal({
							title: '提示',
							showCancel: false,
							content: response.data.message,
							success(res) {
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
					wx.showModal({
						title: '提示',
						showCancel: false,
						content: response.data.message,
						success(res) {
							if (res.confirm) {
								console.log('用户点击确定')
							} else if (res.cancel) {
								console.log('用户点击取消')
							}
						}
					})


				}
			});
		} else {
			wx.showModal({
				title: '提示',
				showCancel: false,
				content: '为避免恶意作弊，账号需绑定手机号才可以申请发货',
				success(res) {
					if (res.confirm) {
						console.log('用户点击确定')
					} else if (res.cancel) {
						console.log('用户点击取消')
					}
				}
			})
		}
	},
	
	jumpminiapp(e) {
		wx.navigateToMiniProgram({
			appId: e.currentTarget.dataset.appid,
			path: e.currentTarget.dataset.path,

			success(res) {
				// 打开成功
			}
		})
	},
	
	// 抽盲盒订单，点击‘申请发货’
	clickdelivery(e) {
		console.log(e);
		var t = this;
		if (t.data.prize.prize.prize_type == 1) {
			if (!t.data.useraddress.id) {
				wx.showModal({
					title: '提示',
					content: '请先填写收件信息',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							wx.navigateTo({
								url: '/pages/my/address/address',
							})
							// t.getprize();
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
				return;
			}
		}
		if (t.data.prize.prize_first_state == 0 || t.data.prize.prize_first_state == -2) {
			var tmpls = []
			t.data.prize.tmplids['fahuo_notice_tmplid'] && (tmpls.push(t.data.prize.tmplids['fahuo_notice_tmplid']));
			t.data.prize.tmplids['guoqi_notice_tmplid'] && (tmpls.push(t.data.prize.tmplids['guoqi_notice_tmplid']));
			t.data.prize.tmplids['shenhe_notice_tmplid'] && (tmpls.push(t.data.prize.tmplids['shenhe_notice_tmplid']));

			wx.requestSubscribeMessage({
				tmplIds: tmpls,
				success(res) {

				},
				fail(res) {
					console.log('订阅失败', res);
				},
				complete(res) {
					t.todelivery();
				}
			})
			return;
		}
		t.todelivery();
	},
	// 申请发货
	todelivery() {
		var t = this;
		app.util.request({
			url: 'entry/wxapp/applydelivery',
			data: {
				m: app.globalData.module_name,
				id: t.data.member_prize_id,
				useraddressid: t.data.useraddress.id,
				op: 'delivery'
			},
			method: 'get',
			success: function (response) {
				console.log('response', response.data);
				if (response.data.errno == 0) {
					console.log('申请完成1', response.data.message);
					wx.showModal({
						title: '提示',
						content: response.data.message,
						showCancel: false,
						success(res) {
							if (res.confirm) {
								console.log('用户点击确定1')
								t.getprize();
							} else if (res.cancel) {
								console.log('用户点击取消')
							}
						}
					})
				} else {
					console.log('申请完成2', response.data.message);
				}
			},
			fail: function (response) {
				console.log('fail', response);
				if (response.data.errno == 800) {
					console.log('支付邮费', response.data.message);
					wx.requestPayment({
						'timeStamp': response.data.data.timeStamp,
						'nonceStr': response.data.data.nonceStr,
						'package': response.data.data.package,
						'signType': 'MD5',
						'paySign': response.data.data.paySign,
						'success': function (res) {
							console.log("支付成功！")
							t.setData({
								payloading: 1
							})
							setTimeout(() => {
								//检查订单号是否支付成功开始
								t.checkpayresult(response.data.data.local_order_data.order_id);


								//检查订单号是否支付成功结束
							}, 3000)


						},
						'fail': function (res) {
							wx.showToast({
								icon: 'none',
								title: '订单支付失败',
							})
							t.setData({
								openboxbuttonenable: true
							})
						}
					})
				} else {
					wx.showModal({
						title: '提示',
						showCancel: false,
						content: response.data.message,
						success(res) {
							if (res.confirm) {
								console.log('用户点击确定')
							} else if (res.cancel) {
								console.log('用户点击取消')
							}
						}
					})
				}

			},
			complete: function () {

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
	// 平台回收
	recovery() {
		var t = this;
		wx.showModal({
			title: '提示',
			content: '平台将以¥' + t.data.prize.prize.prize_fragment.prizes_fragments_recovery_price + '的价格回收，请确认',
			success(res) {
				if (res.confirm) {
					console.log('用户点击确定')
					app.util.request({
						url: 'entry/wxapp/recycleprize',
						data: {
							m: app.globalData.module_name,
							prizeid: t.data.member_prize_id
						},
						method: 'get',
						success: function (response) {
							console.log('回收结果', response);
							if (response.data.errno == 0) {
								wx.showModal({
									title: '提示',
									showCancel: false,
									content: response.data.message,
									success(res) {
										if (res.confirm) {
											console.log('用户点击确定')
											wx.navigateBack({
												delta: -1,
											})
										} else if (res.cancel) {
											console.log('用户点击取消')
										}
									}
								})

							}

						},
						fail: function (response) {
							console.log('订单支付失败', response);
							wx.showModal({
								title: '提示',
								showCancel: false,
								content: response.data.message,
								success(res) {
									if (res.confirm) {
										console.log('用户点击确定')
									} else if (res.cancel) {
										console.log('用户点击取消')
									}
								}
							})

						}

					})

				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	},
	checkpayresultclick(e) {
		console.log(e.currentTarget.dataset.orderid);
		this.checkpayresult(e.currentTarget.dataset.orderid);
	},
	regetinfo() {
		this.getprize();
		this.setData({
			payloading: 0
		})
	},
	copycdkey() {

		wx.setClipboardData({
			data: "卡密:\n" + this.data.prize.prize_inclusion.cdkey.cdkey.cdkey + "\n\n使用方法:\n" + this.data.prize.prize_inclusion.cdkey.cdkey_instructions,
			success(res) {

			}
		})
	},
	// 检查支付结果（运费支付）
	checkpayresult(order_id) {
		console.log('check order_id=', order_id);
		var t = this;
		t.setData({
			payloading: 1,
			paycheck_orderid: ''
		})

		app.util.request({
			url: 'entry/wxapp/checkpayresult',
			data: {
				m: app.globalData.module_name,
				orderid: order_id
			},
			method: 'get',
			success: function (response2) {
				console.log('订单支付结果', response2);
				if (response2.data.errno == 0) {

					t.setData({
						payloading: 3,
						paycheck_orderid: ''
					})
				}

			},
			fail: function (response2) {
				console.log('订单支付失败', response2);
				wx.showToast({
					icon: 'none',
					title: response2.data.message,
				})
				t.setData({
					payloading: 2,
					paycheck_orderid: order_id,
					payresnotice: '支付未成功'
				})
				return;
			},
			complete: function (response2) {
				t.setData({
					openboxbuttonenable: true
				})
			}
		})
	},
	//去提交评论
	goCommentPage() {
		let pic = this.data.prize.prize.prize_pic,name = this.data.prize.prize.prize_title,prizeId = this.data.prize.prize.id,orderId = this.data.prize.order.order_id;
		wx.navigateTo({
			url: '/pages/newPage/submitComment/submitComment?pic='+pic+'&name='+name+'&id='+prizeId+'&orderid='+orderId
		})
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
	// 送给朋友
	sendprize(e) {
		console.log('要赠送的盒子ID', e.currentTarget.dataset.id);
		var t = this;
		app.util.request({
			url: 'entry/wxapp/sendprize',
			data: {
				m: app.globalData.module_name,
				prizeid: t.data.member_prize_id
			},
			method: 'get',
			success: function (response) {
				console.log('送出结果', response);
				if (response.data.errno == 0) {
					wx.showModal({
						title: '提示',
						showCancel: false,
						content: response.data.message,
						success(res) {
							if (res.confirm) {
								console.log('用户点击确定')
								t.setData({


									//['boxlist[' + t.data.select_box_index + '].state']: 0
								})

							} else if (res.cancel) {
								console.log('用户点击取消')
							}
						}
					})

				}

			},
			fail: function (response) {
				wx.showModal({
					title: '提示',
					showCancel: false,
					content: response.data.message,
					success(res) {
						if (res.confirm) {

						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})


			}

		})
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		var uid = 0;
		var memberinfo = wx.getStorageSync('memberinfo');
		var t = this;

		memberinfo.id && (uid = memberinfo.id);
		console.log('uid', uid);
		return {
			title: '送你一个' + t.data.prize.prize.complete_prize_title,
			imageUrl: t.data.prize.prize.prize_pic,
			path: '/pages/index/index?sharetype=sendprize&senduid=' + uid + '&prizeid=' + t.data.member_prize_id
		}
	},
})