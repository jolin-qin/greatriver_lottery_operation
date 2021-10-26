const app = getApp()
const innerAudioContext = wx.createInnerAudioContext()
const innerAudioContext2 = wx.createInnerAudioContext()
let videoAd = null
// 在页面中定义插屏广告
let interstitialAd = null

Page({
	data: {
		text: "demo",
		jifen: 0.00,
		one_sec_productivity: 0,
		one_sec_productivity2: 0,
		modalName: '',
		boxtitle: '',
		danmulist: [],
		randomnum: 0,
		boxmodal: false,
		boxcontentmodal: false,
		boxbuymodal: false,
		getboxesmodal: false,
		jifenfontsize: '40rpx',
		newboxclass: 'newbox-none',
		newboxlist: [],
		indexparameter: [],
		box_pageno: 0,
		boxlist: [],
		loading: true,
		answer: '',
		online_member_data: [],
		openboxinfo: [],
		MenuButton: [],
		select_pay_type: 0,
		openboxbuttonenable: true,
		select_box_index: -1, //当前浏览盒子内容的下标
		liuliangzhu_parameter: [],
		ads: [],
		rand_box: [],
		scrollontop: true,
		scroll_start: 0,
		scroll_end: 0,
		select_toolsid: 0,
		choicezhonglvprize_index: -1,
		islogin: true,
		reciveboxmodal: false,
		recivebox: [],
		recivebox_boxid: 0,
		recivebox_senduid: 0,
		reciveprizemodal: false,
		reciveprize: [],
		reciveprize_prizeid: 0,
		reciveprize_senduid: 0,
		winning_list_index: 0,
		danmususpend: false,
		isios: '',
		box_class: [],
		yindao: [] //新手引导

	},
	onLoad: function (options) {

		var t = this;
		var myDate = new Date();
		var time = myDate.toLocaleDateString();
		try {

			var res = wx.getSystemInfoSync()
			t.data.isios = res.platform;
			console.log(res.platform)

		} catch (e) {

			// Do something when catch error

		}

		t.checkUpdate(); //检查是否版本更新
		if (options.scene) {
			console.log('海报邀请', options.scene);
			app.globalData.invite_uid = options.scene
		}

		switch (options.sharetype) {
			case 'invite':
				console.log('接受邀请', options.uid);
				app.globalData.invite_uid = options.uid
				break;
			case 'sendbox':
				console.log('接收分享的礼物');
				console.log(options)
				app.util.request({
					url: 'entry/wxapp/receivebox',
					data: {
						m: app.globalData.module_name,
						boxid: options.boxid,
						uid: options.senduid
					},
					method: 'get',
					success: function (response) {
						console.log('receivebox', response.data);
						if (response.data.errno == 0) {


							t.setData({
								recivebox: response.data.data,
								recivebox_boxid: options.boxid,
								recivebox_senduid: options.senduid,
								reciveboxmodal: true
							})
						} else {
							//失败

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

				break;
			case 'sendprize':
				console.log('接收分享的奖品');
				console.log(options)
				app.util.request({
					url: 'entry/wxapp/receiveprize',
					data: {
						m: app.globalData.module_name,
						prizeid: options.prizeid,
						uid: options.senduid
					},
					method: 'get',
					success: function (response) {
						console.log('receiveprize', response.data);
						if (response.data.errno == 0) {


							t.setData({
								reciveprize: response.data.data,
								reciveprize_prizeid: options.prizeid,
								reciveprize_senduid: options.senduid,
								reciveprizemodal: true
							})
						} else {
							//失败

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

				break;
			default:
				console.log('我是默认内容');
		}

		// 页面初始化 options为页面跳转所带来的参数
		var t = this;
		var MenuButton = wx.getMenuButtonBoundingClientRect();
		t.setData({

			MenuButton: MenuButton
		})
		console.log('MenuButton', t.data.MenuButton);

		console.log(this);
		//t.getmemberboxes(t.data.box_pageno);



		var randomnum2 = 0;

		setInterval(() => {
			/*
			      randomnum2 = Math.floor(Math.random() * 4);
			      if (randomnum2 == t.data.randomnum) {
			      } else {
			        if (t.data.danmulist.length > 10) {
			          setTimeout(() => {
			            t.data.danmulist = []
			          }, 2800)
			        } else {
			          t.data.danmulist.push(['', randomnum2])
			          t.setData({
			            danmulist: t.data.danmulist,
			          })
			        }
			        t.data.randomnum = randomnum2;
			      }
			      */
			t.data.jifen = parseFloat(t.data.jifen + t.data.one_sec_productivity).toFixed(3)
			t.data.jifen = parseFloat(t.data.jifen);
			if (t.data.jifen > 999999) {
				t.setData({
					jifenfontsize: '35rpx'
				})
			} else {
				t.setData({
					jifenfontsize: '40rpx'
				})
			}
			t.setData({
				jifenanimation: 'jifen-animation'
			})
			setTimeout(() => {
				t.setData({
					jifenanimation: ''
				})
			}, 500)
			t.setData({
				jifens: t.data.jifen.toLocaleString(),
			})
		}, 1000)
		this.getindexparameter();
		if (!app.util.islogin()) {
			t.setData({
				islogin: false
			})

		}
	},
	checkUpdate() {
		//使用更新对象之前判断是否可用
		if (wx.canIUse('getUpdateManager')) {
			const updateManager = wx.getUpdateManager()
			updateManager.onCheckForUpdate(function (res) {
				// 请求完新版本信息的回调
				console.log(res.hasUpdate) //res.hasUpdate返回boolean类型
				if (res.hasUpdate) {
					updateManager.onUpdateReady(function () {
						wx.showModal({
							title: '更新提示',
							content: '新版本已经准备好，是否重启当前应用？',
							success(res) {
								if (res.confirm) {
									// 新的版本已经下载好，调用applyUpdate应用新版本并重启
									updateManager.applyUpdate()
								}
							}
						})
					})
					// 新版本下载失败时执行
					updateManager.onUpdateFailed(function () {
						wx.showModal({
							title: '发现新版本',
							content: '请删除当前小程序，重新搜索打开...',
						})
					})
				}
			})
		} else {
			//如果小程序需要在最新的微信版本体验，如下提示
			wx.showModal({
				title: '更新提示',
				content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
			})
		}

	},
	receivebox() {
		var t = this;
		if (!app.util.islogin()) {
			wx.navigateTo({
				url: '/pages/auth/auth',
			})
			return;
		}
		app.util.request({
			url: 'entry/wxapp/receivebox',
			data: {
				m: app.globalData.module_name,
				boxid: t.data.recivebox_boxid,
				uid: t.data.recivebox_senduid
			},
			method: 'post',
			success: function (response) {
				console.log('接收盒子操作返回', response.data);
				if (response.data.errno == 0) {

					wx.showModal({
						title: '提示',
						showCancel: false,
						content: response.data.message,
						success(res) {
							if (res.confirm) {
								console.log('用户点击确定')
								t.setData({
									reciveboxmodal: false,
									reciveprizemodal: false
								})
								t.data.box_pageno = 0;
								t.getmemberboxes(t.data.box_pageno);
							} else if (res.cancel) {
								console.log('用户点击取消')
							}
						}
					})

				} else {
					//失败

					wx.showModal({
						title: '提示',
						showCancel: false,
						content: response.data.message,
						success(res) {
							if (res.confirm) {
								console.log('用户点击确定')
								t.setData({
									reciveboxmodal: false,
									reciveprizemodal: false
								})
							} else if (res.cancel) {
								console.log('用户点击取消')
							}
						}
					})

				}
			},
			fail: function (response) {
				console.log('接收盒子操作返回', response.data);
				wx.showModal({
					title: '提示',
					showCancel: false,
					content: response.data.message,
					success(res) {
						if (res.confirm) {
							t.setData({
								reciveboxmodal: false,
								reciveprizemodal: false
							})
							console.log('用户点击确定')
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			}
		});

	},
	receiveprize() {
		var t = this;
		if (!app.util.islogin()) {
			wx.navigateTo({
				url: '/pages/auth/auth',
			})
			return;
		}
		app.util.request({
			url: 'entry/wxapp/receiveprize',
			data: {
				m: app.globalData.module_name,
				prizeid: t.data.reciveprize_prizeid,
				uid: t.data.reciveprize_senduid
			},
			method: 'post',
			success: function (response) {
				console.log('接收奖品操作返回', response.data);
				if (response.data.errno == 0) {

					wx.showModal({
						title: '提示',
						showCancel: false,
						content: response.data.message,
						success(res) {
							if (res.confirm) {
								console.log('用户点击确定')
								t.setData({
									reciveboxmodal: false,
									reciveprizemodal: false
								})


							} else if (res.cancel) {
								console.log('用户点击取消')
							}
						}
					})

				} else {
					//失败

					wx.showModal({
						title: '提示',
						showCancel: false,
						content: response.data.message,
						success(res) {
							if (res.confirm) {
								console.log('用户点击确定')
								t.setData({
									reciveboxmodal: false,
									reciveprizemodal: false
								})
							} else if (res.cancel) {
								console.log('用户点击取消')
							}
						}
					})

				}
			},
			fail: function (response) {
				console.log('接收盒子操作返回', response.data);
				wx.showModal({
					title: '提示',
					showCancel: false,
					content: response.data.message,
					success(res) {
						if (res.confirm) {
							t.setData({
								reciveboxmodal: false,
								reciveprizemodal: false
							})
							console.log('用户点击确定')
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			}
		});

	},
	onReady: function () {
		// 页面渲染完成
		var t = this;

		setTimeout(() => {
			try {
				if (typeof (t.data.indexparameter.other_parameter.chapin_index) == 'undefined') {
					return;
				}
			} catch (err) {
				return;
			}

			if (t.data.indexparameter.other_parameter.chapin_index == 1) {
				console.log('首页插屏打开');
				// 在页面onLoad回调事件中创建插屏广告实例
				if (wx.createInterstitialAd) {
					interstitialAd = wx.createInterstitialAd({
						adUnitId: t.data.indexparameter.liuliangzhu_parameter.chapin_adid
					})
					interstitialAd.onLoad(() => {})
					interstitialAd.onError((err) => {})
					interstitialAd.onClose(() => {})
				}

				// 在适合的场景显示插屏广告
				if (interstitialAd) {
					interstitialAd.show().catch((err) => {
						console.error(err)
					})
				}
			} else {
				console.log('首页插屏关闭');
			}
		}, 5000)













	},
	clickgetfreebox() {
		// 用户触发广告后，显示激励视频广告
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
	getfreebox(e) {
		var t = this;
		t.setData({
			newboxlist: [],

		})
		if (app.util.islogin()) {
			console.log('已经登陆 执行业务流程');
			//开始随机抽取一个盒子
			app.util.request({
				url: 'entry/wxapp/getfreebox',
				data: {
					m: app.globalData.module_name,

				},
				method: 'get',
				success: function (response) {
					console.log(response);
					if (response.data.errno == 0) {
						innerAudioContext.src = '/resource/voice/5018.jpg'
						innerAudioContext.play();
						t.setData({
							newboxlist: response.data.data.reverse(),
							scrolltop: 0
						})
						console.log('newboxlist', t.data.newboxlist);
						t.setData({
							leftcard_animation: 'slideleft-animation',
							rightcard_animation: 'slideright-animation',

						})
						innerAudioContext.onEnded(() => {

							setTimeout(() => {
								t.setData({

									newboxclass: 'newbox-animation',
									newboxscrollwidth: t.newboxscrollwidth(t.data.newboxlist.length)
								})
							}, 100)

							innerAudioContext2.src = '/resource/voice/5012.jpg'
							innerAudioContext2.play();
							innerAudioContext2.onError((e) => {
								console.log(e);
							})
							setTimeout(() => {
								wx.vibrateLong();
							}, 300)
							// 
						})
						innerAudioContext.onError((e) => {
							console.log(e);
						})
						t.getmemberboxes(0);


					} else {
						//失败
						t.setData({
							leftcard_animation: 'a-shake',
						})
						setTimeout(() => {
							t.setData({
								leftcard_animation: '',
							})
						}, 300)
						wx.showToast({
							icon: 'none',
							title: '没有可以领的盒子',
						})
					}
				},
				fail: function (response) {
					t.setData({
						leftcard_animation: 'a-shake',
					})
					setTimeout(() => {
						t.setData({
							leftcard_animation: '',
						})
					}, 300)
					wx.showToast({
						icon: 'none',
						title: '没有可以领的盒子',
					})
				}
			});
			//抽取盒子数据结束


		} else {
			wx.navigateTo({
				url: '/pages/auth/auth',
			})
		}
	},
	getpaybox(e) {
		var t = this;
		t.setData({
			newboxlist: [],

		})

		if (app.util.islogin()) {
			console.log('已经登陆 执行业务流程');
			//开始随机抽取一个盒子
			app.util.request({
				url: 'entry/wxapp/getpaybox',
				data: {
					m: app.globalData.module_name,

				},
				method: 'get',
				success: function (response) {
					console.log(response);
					if (response.data.errno == 0) {
						innerAudioContext.src = '/resource/voice/5018.jpg'
						innerAudioContext.play();
						t.setData({
							newboxlist: response.data.data.reverse()
						})
						console.log('newboxlist', t.data.newboxlist);
						t.setData({
							leftcard_animation: 'slideleft-animation',
							rightcard_animation: 'slideright-animation',

						})
						innerAudioContext.onEnded(() => {

							setTimeout(() => {
								t.setData({

									newboxclass: 'newbox-animation',
									newboxscrollwidth: t.newboxscrollwidth(t.data.newboxlist.length),
									scrolltop: 0
								})
							}, 100)

							innerAudioContext2.src = '/resource/voice/5012.jpg'
							innerAudioContext2.play();
							setTimeout(() => {
								wx.vibrateLong();
							}, 300)


						})
						innerAudioContext.onError((e) => {
							console.log(e);
						})
						t.getmemberboxes(0);


					} else {

						//失败
						t.setData({

							rightcard_animation: 'shake',

						})
						setTimeout(() => {
							t.setData({
								rightcard_animation: '',
							})
						}, 300)
						wx.showToast({
							icon: 'none',
							title: '网络超时',
						})
					}
				},
				fail: function (response) {
					console.log(response);
					t.setData({
						rightcard_animation: 'a-shake',
					})
					setTimeout(() => {
						t.setData({
							rightcard_animation: '',
						})
					}, 300)
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
			//抽取盒子数据结束
			this.getindexmemberinfo();

		} else {
			wx.navigateTo({
				url: '/pages/auth/auth',
			})
		}
	},
	scroll(e) {
		//console.log(e);
		if (e.detail.scrollTop > 1 && this.data.scrollontop == true) {
			this.data.scrollontop = false;
		}
	},
	ontop(e) {
		console.log('ontop', e);
		this.data.scrollontop = true;
	},
	touchstart(e) {
		console.log(e);
		this.data.scroll_start = e.changedTouches[0].pageY;

	},
	touchend(e) {
		console.log(e);
		console.log('this.data.scroll_start', this.data.scroll_start);
		console.log('this.data.scroll_end', e.changedTouches[0].pageY);
		console.log('this.data.scrollontop', this.data.scrollontop);
		if ((e.changedTouches[0].pageY - this.data.scroll_start) > 80 && this.data.scrollontop == true) {
			this.hideModal()
		}

	},
	showbox(e) {
		console.log(e);
		var t = this;
		app.globalData.guide[3] = false;
		wx.getStorage({
			key: 'guide',
			success(res) {
				console.log(res.data)

			},
			fail() {
				wx.createSelectorQuery().select('#openboxbutton').boundingClientRect(function (res) {
					console.log('openboxbutton', res)
					app.globalData.guide[6] = true;
					t.setData({
						yindao_d: res,
						guide: app.globalData.guide
					})
				}).exec()


			}
		})



		this.setData({
			guide: app.globalData.guide,
			scrolltop: 0,
			openthebox_animation: '',
			openthebox_animation2: '',
			openthebox_animation3: '',
			openthebox_animation4: '',
			openthebox_title: '此盒子可能开出',
			showprize: false,
			showprize_animation: '',
			select_pay_type: 1,
			answer: '',
			openboxbutton: true,
			click_box_index: e.currentTarget.dataset.indexid,
			openboxbuttonenable: true
		})
		wx.vibrateShort({
			type: 'medium',
			success: (res) => {

			},
		})
		setTimeout(() => {
			t.setData({
				//click_box_index:-1,
			})
		}, 300)
		var box_id = e.currentTarget.dataset.id;
		this.data.select_box_index = e.currentTarget.dataset.indexid;
		app.util.request({
			url: 'entry/wxapp/getboxinfobymembersboxid',
			data: {
				m: app.globalData.module_name,
				boxid: box_id,
				os: t.data.isios
			},
			method: 'get',
			success: function (response) {
				console.log('getboxinfo', response.data);


				if (response.data.errno == 0) {
					if (e.currentTarget.dataset.canopen == 1) {
						t.setData({
							click_box_index: -1
						})
						wx.showToast({
							icon: 'none',
							title: '盒子已失效，无法打开',
						})
						return;
					}

					t.setData({
						openboxinfo: response.data.data,
						select_pay_type: response.data.data.box_pay_payment_integral == 1 ? 1 : response.data.data.box_pay_payment_wechatpay == 1 ? 2 : 3,
						boxmodal: true,
						openthebox_title: response.data.data.membersbox_state == 1 ? '此盒子已被打开' : '此盒子可能开出',
						openboxbutton: response.data.data.membersbox_state == 0 ? response.data.data.state == 1 ? true : false : false
					})


				} else {
					//失败
					wx.showToast({
						icon: 'none',
						title: '网络连接失败',
					})

				}
			},
			fail: function (response) {

				wx.showToast({
					icon: 'none',
					title: '网络连接失败',
				})
			}
		});


	},
	delbox(e) {
		console.log('要删除的盒子ID', e.currentTarget.dataset.id);
		var t = this;
		wx.showModal({
			title: '提示',
			content: '此操作不可撤回，确认要删除吗？',
			success(res) {
				if (res.confirm) {
					console.log('用户点击确定')
					app.util.request({
						url: 'entry/wxapp/delbox',
						data: {
							m: app.globalData.module_name,
							boxid: e.currentTarget.dataset.id
						},
						method: 'get',
						success: function (response) {
							console.log('删除结果', response);
							if (response.data.errno == 0) {
								wx.showModal({
									title: '提示',
									showCancel: false,
									content: response.data.message,
									success(res) {
										if (res.confirm) {
											console.log('用户点击确定')
											t.setData({


												['boxlist[' + t.data.select_box_index + '].state']: 2
											})
											t.hideModal();
										} else if (res.cancel) {
											console.log('用户点击取消')
										}
									}
								})

							}

						},
						fail: function (response) {

							wx.showToast({
								icon: 'none',
								title: response.data.message,
							})

						}

					})

				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		var memberinfo = wx.getStorageSync('memberinfo');
		var uid = 0;
		console.log('uid', memberinfo.id);
		memberinfo.id && (uid = memberinfo.id);
		var t = this;
		console.log(this.data.openboxinfo == false ? '礼品盒子无限抽！' : this.data.openboxinfo['box_title']);
		console.log(this.data.openboxinfo == false ? '' : this.data.openboxinfo['box_cover']);
		console.log(this.data.openboxinfo == false ? '/pages/index/index' : '/pages/index/index?sharetype=sendbox&senduid=' + uid + '&boxid=' + this.data.openboxinfo['membersbox_id']);

		return {
			title: t.data.openboxinfo == false ? '礼品盒子无限抽！' : t.data.openboxinfo['box_title'],
			imageUrl: t.data.openboxinfo == false ? '' : t.data.openboxinfo['box_cover'],
			path: t.data.openboxinfo == false ? '/pages/index/index?sharetype=invite&uid=' + uid : '/pages/index/index?sharetype=sendbox&senduid=' + uid + '&boxid=' + t.data.openboxinfo['membersbox_id'],
		}



	},
	sendbox(e) {
		console.log('要赠送的盒子ID', e.currentTarget.dataset.id);


		var t = this;
		app.util.request({
			url: 'entry/wxapp/sendbox',
			data: {
				m: app.globalData.module_name,
				boxid: e.currentTarget.dataset.id
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
	openboxcontentmodal(e) {
		console.log(e);
		this.setData({
			scrollintoviewid: 'content'
			//boxcontentmodal: true,
			//box_content: this.data.openboxinfo.box_content
			//boxtitle:'你拆开了'+e.target.dataset.boxid+'号盒子'
		})
	},
	openboxbuymodal(e) {
		console.log(e);
		this.setData({
			boxbuymodal: true,
			//boxtitle:'你拆开了'+e.target.dataset.boxid+'号盒子'
		})
	},
	gotowarehouse() {
		wx.switchTab({
			url: '/pages/warehouse/warehouse',
		})
		this.hideModal();
	},
	payradioChange(e) {
		console.log(e);
		this.setData({
			select_pay_type: e.detail.value
		})
	},
	payitemclick(e) {
		console.log(e.currentTarget.dataset.type);
		this.setData({
			select_pay_type: e.currentTarget.dataset.type
		})
	},
	usetools(e) {
		var t = this;
		var toolid = e.currentTarget.dataset.id;
		var tooltype = e.currentTarget.dataset.type;
		console.log(e);
		tooltype == 0 && (t.setData({
			select_toolsid: toolid,
			select_toolsindex: e.currentTarget.dataset.index,
			tools_zhonglv: true,
			zhonglvtitle: t.data.openboxinfo.memberstools[e.currentTarget.dataset.index].tools.add_winning_probability
		}));
		if (tooltype == 2) {
			if (t.data.openboxinfo.box_show_prizeslist == 1) {
				wx.showToast({
					icon: 'none',
					title: '此盒子已经显示奖品列表，无需使用',
				})
			} else { //使用透视卡
				t.setData({
					select_toolsid: toolid,
					tools_toushi: true
				})
			}
		}

	},
	choicezhonglvprize(e) {
		var t = this;
		t.setData({
			choicezhonglvprize_index: e.currentTarget.dataset.index,
			zhonglvtitle: t.data.openboxinfo.memberstools[t.data.select_toolsindex].tools.add_winning_probability
		})

	},

	usetoushi(e) {
		var t = this;
		var toolsid = this.data.select_toolsid;
		app.util.request({
			url: 'entry/wxapp/usetoushitool',
			data: {
				m: app.globalData.module_name,
				toolsid: toolsid,
				type: 2,
				boxid: t.data.openboxinfo.id
			},
			method: 'get',
			success: function (response) {
				console.log('透视卡使用结果', response);
				if (response.data.errno == 0) {
					t.data.openboxinfo.prizes_list = response.data.data.prizes_list,
						t.data.openboxinfo.memberstools = response.data.data.memberstools
					t.setData({
						openboxinfo: t.data.openboxinfo
					})
					wx.showToast({
						icon: 'none',
						title: response.data.message,
					})

				}
			},
			fail: function (response) {
				console.log('透视卡使用失败', response);
				wx.showToast({
					icon: 'none',
					title: response.data.message,
				})

				return;
			},
			complete: function (response) {
				t.hidetoolmodal()
			}
		})

	},
	inputanswer(e) {
		this.data.answer = e.detail.value;
	},
	openthebox(e) {
		//拆盒子
		var t = this;
		console.log(e);
		if (t.data.openboxbuttonenable == false) {
			wx.showToast({
				icon: 'none',
				title: '请不要重复操作',
			})
			return;
		}
		t.setData({
			prize: [],
			openboxbuttonenable: false
		})
		var membersbox_id = e.currentTarget.dataset.id;
		app.util.request({
			url: 'entry/wxapp/openthebox',
			data: {
				m: app.globalData.module_name,
				membersbox_id: membersbox_id,
				paytype: t.data.select_pay_type,
				answer: t.data.answer,
				zhonglvtool_id: t.data.select_toolsid,
				zhonglvtool_choiceprize: t.data.choicezhonglvprize_index
			},
			method: 'get',
			success: function (response) {
				console.log('openthebox', response.data);
				if (response.data.errno == 0) {
					if (t.data.select_pay_type == 2 && t.data.openboxinfo.box_open_price > 0) { //微信支付
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
						t.setData({
							topNum: 0
						});
						t.showprize(response);
						wx.getStorage({
							key: 'guide',
							success(res) {
								console.log(res.data)

							},
							fail() {

								app.globalData.guide[6] = false;
								t.setData({
									guide: app.globalData.guide
								})
							}
						})
					}
					/*
					t.setData({
					  openthebox_animation: 'openthebox_animation',
					})
					setTimeout(() => {
					  t.setData({
					    openthebox_animation2: 'slideleft-animation',
					    openthebox_animation3: 'openthebox_animation2',
					    openthebox_animation4: 'slideright-animation',

					  })
					}, 1000)

					setTimeout(() => {
					  t.setData({
					    showprize: true,
					    showprize_animation: 'a-bouncein',
					    openthebox_title: '开盒结果',
					    openthebox_animation3: '',
					    openboxbutton: false
					  })
					  wx.vibrateLong();
					}, 2000)
					if (response.data.data) {

					  t.setData({
					    prize: response.data.data

					  })

					} else {
					  t.setData({
					    prize: ''
					  })
					}
					t.getindexmemberinfo();

					console.log('根据下标修改', t.data.select_box_index);
					t.setData({


					  ['boxlist[' + t.data.select_box_index + '].state']: 1
					})
					*/
				} else {
					t.setData({
						openthebox_animation: 'openthebox_animation_fail'
					})
					setTimeout(() => {
						t.setData({
							openthebox_animation: '',
						})

					}, 700)
					//失败
					wx.showToast({
						icon: 'none',
						title: response.data.message,
					})
					t.setData({
						openboxbuttonenable: true
					})

				}


			},
			fail: function (response) {
				t.setData({
					openthebox_animation: 'openthebox_animation_fail'
				})
				t.setData({
					openboxbuttonenable: true
				})
				setTimeout(() => {
					t.setData({
						openthebox_animation: '',
					})

				}, 700)
				wx.showToast({
					icon: 'none',
					title: response.data.message,
				})
			}
		});
	},
	checkpayresultclick(e) {
		console.log(e.currentTarget.dataset.orderid);
		this.checkpayresult(e.currentTarget.dataset.orderid);
	},
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
					t.showprize(response2);
					t.setData({
						payloading: 0,
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
					paycheck_orderid: order_id
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
	hidecheckpaymodal() {
		this.setData({
			payloading: 0,
			paycheck_orderid: ''
		})
	},
	showprize(response) {
		var t = this;


		t.setData({
			openthebox_animation: 'openthebox_animation',
		})
		setTimeout(() => {
			t.setData({
				openthebox_animation2: 'slideleft-animation',
				openthebox_animation3: 'openthebox_animation2',
				openthebox_animation4: 'slideright-animation',

			})

		}, 1000)
		setTimeout(() => {
			innerAudioContext.src = '/resource/voice/5012.jpg'
			innerAudioContext.play();
			innerAudioContext.onError((e) => {
				console.log(e);
			})
		}, 1700)
		setTimeout(() => {

			innerAudioContext.stop();
		}, 3300)

		setTimeout(() => {
			t.setData({
				showprize: true,
				showprize_animation: 'a-bouncein',
				openthebox_title: '开盒结果',
				openthebox_animation3: '',
				openboxbutton: false,
				openboxbuttonenable: true
			})

			wx.vibrateLong();
			setTimeout(() => {
				wx.getStorage({
					key: 'guide',
					success(res) {
						console.log(res.data)

					},
					fail() {
						if (app.globalData.guide_step == 6) {
							app.globalData.guide[7] = true;
							t.setData({
								guide: app.globalData.guide
							})
						}

					}
				})

			}, 2000)
		}, 2000)
		if (response.data.data) {

			t.setData({
				prize: response.data.data
			})
		} else {
			t.setData({
				prize: ''
			})
		}
		t.getindexmemberinfo();
		console.log('根据下标修改', t.data.select_box_index);
		t.setData({
			['boxlist[' + t.data.select_box_index + '].state']: 1
		})
	},
	onPullDownRefresh: function (res) {
		console.log('下拉刷新');
		this.getmemberboxes(0);
		this.getindexmemberinfo();
	},
	viewprizesimg(e) {
		console.log(e.currentTarget.dataset.pic);
		console.log(this.data.openboxinfo.prizes_list);
		if (e.currentTarget.dataset.pic == '') {
			wx.showToast({
				icon: 'none',
				title: '盒子信息已被隐藏',
			})
			return;
		}
		var prizes_pics = [];
		for (var x in this.data.openboxinfo.prizes_list) { //x = index
			prizes_pics.push(this.data.openboxinfo.prizes_list[x].prize_pic);
		}
		wx.previewImage({
			current: e.currentTarget.dataset.pic, // 当前显示图片的http链接
			urls: prizes_pics // 需要预览的图片http链接列表
		})
	},
	viewprizesname(e) {
		wx.showToast({
			icon: 'none',
			title: e.currentTarget.dataset.name,
		})
	},
	hideboxcontentModal() {
		this.setData({
			boxcontentmodal: false
		})
	},
	newboxviewclose() {
		this.setData({
			leftcard_animation: 'slideleft-back-animation',
			rightcard_animation: 'slideright-back-animation',
			newboxclass: 'newbox-none'
		})
		this.getboxparameter();
	},
	hideboxbuymodal() {
		this.setData({
			boxbuymodal: false
		})
	},
	choicezhonglvsubmit() {
		this.setData({
			tools_zhonglv: false
		})
	},
	hidetoolmodal() {
		this.setData({
			tools_zhonglv: false,
			tools_toushi: false,
			choicezhonglvprize_index: -1
		})
	},
	hideModal() {
		var t = this;
		this.setData({
			boxmodal: false,
			select_box_index: t.data.select_box_index,
			click_box_index: -1,
			select_toolsid: 0,
			choicezhonglvprize_index: -1,
			openboxinfo: []
		})
		setTimeout(() => {
			t.setData({
				select_box_index: -1,
			})
		}, 300)
	},
	hidegetboxesmodal() {
		this.setData({
			getboxesmodal: false
		})
	},
	onShow: function () {
		var t = this;
		wx.getStorage({
			key: 'guide',
			success(res) {
				console.log(res.data)
			},
			fail() {
				if (app.globalData.guide_step == 5) {
					wx.createSelectorQuery().select('#buyboxbutton').boundingClientRect(function (res) {
						console.log(res)
						app.globalData.guide[2] = true;
						t.setData({
							yindao_b: res,
							guide: app.globalData.guide
						})
					}).exec()
				}
			}
		})
		this.data.danmususpend = false;
		if (app.util.islogin()) {
			t.setData({
				islogin: true
			})
			wx.getStorage({
				key: 'guide',
				success(res) {
					console.log(res.data)
				},
				fail() {
					if (app.globalData.guide_step == 0) {
						wx.createSelectorQuery().select('#lingqubutton').boundingClientRect(function (res) {
							console.log(res)
							app.globalData.guide[0] = true;
							t.setData({
								yindao_a: res,
								guide: app.globalData.guide
							})
						}).exec()
					}
				}
			})
		}
		this.setData({
			animation: 'animation'
		})
		this.getindexmemberinfo();
		if (t.data.boxlist.length < 1) {
			t.getmemberboxes(0);
		}
	},
	onHide: function () {
		// 页面隐藏
		console.log('暂停弹幕');
		this.data.danmususpend = true;
	},
	onUnload: function () {
		// 页面关闭
	},
	getpoints() {
		app.globalData.guide[1] = false;
		this.setData({
			getpoints_animation: 'button-animation',
			guide: app.globalData.guide
		})
		setTimeout(() => {
			this.setData({
				getpoints_animation: ''
			})
		}, 500)
		wx.switchTab({
			url: '/pages/mystar/mystar',
		})
	},
	newboxscrollwidth(newboxlength) {
		console.log('新盒子个数', newboxlength);
		if (newboxlength == 1) {
			return '230rpx'
		} else if (newboxlength == 2) {
			return '470rpx'
		} else {
			return '100%'
		}
	},
	getboxes() {
		wx.createSelectorQuery().select('#boxlist').boundingClientRect(function (res) {
			console.log('boxlist', res)
			app.globalData.guide[2] = false;
			app.globalData.guide[3] = true;
			t.setData({
				yindao_c: res,
				guide: app.globalData.guide
			})
			app.globalData.guide_step = 6;
		}).exec()
		if (!app.util.islogin()) {
			wx.navigateTo({
				url: '/pages/auth/auth',
			})
			return;
		}
		var t = this;
		t.setData({
			getboxparameter: []
		})
		t.setData({
			getboxes_animation: 'button-animation',
			leftcard_animation: '',
			rightcard_animation: '',
			newboxclass: 'newbox-none'
		})
		setTimeout(() => {
			t.setData({
				getboxes_animation: ''
			})
		}, 500)
		t.getboxparameter();
	},
	getboxparameter() {
		var t = this;
		app.util.request({
			url: 'entry/wxapp/getboxparameter',
			data: {
				m: app.globalData.module_name,
			},
			method: 'get',
			success: function (response) {
				console.log(response.data);
				if (response.data.errno == 0) {
					t.setData({
						getboxesmodal: true,
						getboxparameter: response.data.data
					})
				} else {
					//失败
					wx.showToast({
						icon: 'none',
						title: response.data.message,
					})
				}
			},
			fail: function (response) {
				wx.showToast({
					icon: 'none',
					title: response.data.message,
				})
			}
		});
	},
	guidenext(e) {
		console.log(e);
		var t = this;
		if (e.target.dataset.step == 0) { //第一次
			if (e.target.dataset.do == 'yes') {
				app.globalData.guide[1] = true;
				app.globalData.guide_step = 1;
			} else {
				wx.setStorage({
					key: "guide",
					data: "1"
				})
			}
			app.globalData.guide[0] = false;
			t.setData({
				guide: app.globalData.guide
			})
		}
		if (e.target.dataset.step == 6) { //结束
			app.globalData.guide_step = 7;
			app.globalData.guide[7] = false;
			t.setData({
				guide: app.globalData.guide
			})
			wx.setStorage({
				key: "guide",
				data: "1"
			})
		}
	},
	getindexmemberinfo() {
		var t = this;
		if (!app.util.islogin()) {
			console.log('没有登陆终止流程1');
			return;
		}
		app.util.request({
			url: 'entry/wxapp/getindexmemberinfo',
			data: {
				m: app.globalData.module_name,
			},
			method: 'get',
			success: function (response) {
				console.log('getindexmemberinfo', response.data);
				if (response.data.errno == 0) {
					t.setData({
						indexmemberinfo: response.data.data,
						one_sec_productivity: response.data.data.calculate_available_integral.one_sec_productivity,
						one_sec_productivity2: (response.data.data.calculate_available_integral.one_sec_productivity * 60).toFixed(3),
						jifen: response.data.data.calculate_available_integral.final_integral,
						online_member_data: response.data.data.online_member_data,
						online_member_data_integral: parseFloat(response.data.data.online_member_data.integral).toLocaleString(),
					})
				} else {
					//失败
					console.log('???', response.data.errno);
					wx.showToast({
						icon: 'none',
						title: response.data.message,
					})
				}
			},
			fail: function (response) {
				console.log('???x', response);
				if (response.data.errno == 8888) {
					console.log('8888', response.data);
					wx.showToast({
						icon: 'none',
						title: '登录态过期，请重新登录',
					})
					wx.clearStorage({
						success: (res) => {},
					})
				} else {
					wx.showToast({
						icon: 'none',
						title: response.data.message,
					})
				}
			},
			complete: function () {
				wx.stopPullDownRefresh();
			}
		});
	},
	getindexparameter() {
		var t = this;
		app.util.request({
			url: 'entry/wxapp/getindexparameter',
			data: {
				m: app.globalData.module_name,
			},
			method: 'get',
			success: function (response) {
				console.log('getindexparameter', response.data);
				if (response.data.errno == 0) {
					t.setData({
						indexparameter: response.data.data,
						box_class: response.data.data.box_class,
						rand_box: response.data.data.rand_box,
						liuliangzhu_parameter: response.data.data.liuliangzhu_parameter,
						ads: response.data.data.ad,
					})
					var randomnum2 = 0;
					// t.data.danmulist=response.data.data.winning_list
					setInterval(() => {
						if (t.data.danmususpend == true) {
							return;
						}
						randomnum2 = Math.floor(Math.random() * 4);
						if (randomnum2 == t.data.randomnum) {} else {
							if (t.data.danmulist.length >= response.data.data.winning_list.length - 1) {
								t.data.winning_list_index = -1
								setTimeout(() => {
									t.data.danmulist = [];
									t.data.winning_list_index = 0
								}, 2800)
							} else if (t.data.winning_list_index !== -1) {
								t.data.winning_list_index = t.data.winning_list_index + 1
								t.data.danmulist.push([response.data.data.winning_list[t.data.winning_list_index], randomnum2])
								t.setData({
									danmulist: t.data.danmulist,
								})
							}
							t.data.randomnum = randomnum2;
						}
						//console.log('弹幕数据',t.data.danmulist);
					}, 1000)
					if (response.data.data.liuliangzhu_parameter.jili_adid !== '' && response.data.data.other_parameter.free_box_jiliad_enable == 1) {

						// 在页面onLoad回调事件中创建激励视频广告实例
						if (wx.createRewardedVideoAd) {
							videoAd = wx.createRewardedVideoAd({
								adUnitId: response.data.data.liuliangzhu_parameter.jili_adid
							})
							videoAd.onLoad(() => {})
							videoAd.onError((err) => {})
							videoAd.onClose((res) => {
								console.log(res);
								if (res.isEnded) {
									t.getfreebox();
								} else {
									wx.showToast({
										icon: 'none',
										title: '完整看完视频才能领取哦',
									})
								}
							})
						}
					}
				} else {
					//失败
					console.log('???', response.data.errno);
					wx.showToast({
						icon: 'none',
						title: response.data.message,
					})
				}
			},
			fail: function (response) {
				console.log('???x', response);
				wx.showToast({
					icon: 'none',
					title: response.data.message,
				})
			},
			complete: function () {
				wx.stopPullDownRefresh();
				t.setData({
					loading: false
				})
			}
		});
	},
	onReachBottom: function () {
		var that = this;
		this.getmemberboxes(that.data.box_pageno);
	},
	jumpminiapp(e) {
		console.log(e.currentTarget.dataset);
		if (e.currentTarget.dataset.appid == '') {
			wx.showToast({
				icon: 'none',
				title: '参数错误,appid为空',
			})
			return;
		}
		wx.navigateToMiniProgram({
			appId: e.currentTarget.dataset.appid,
			path: e.currentTarget.dataset.path,
			success(res) {
				// 打开成功
			}
		})
	},
	jumpurl(e) {
		console.log(e);
		if (e.currentTarget.dataset.url == '') {
			wx.showToast({
				icon: 'none',
				title: '参数错误,url为空',
			})
			return;
		}
		wx.navigateTo({
			url: '/pages/webview/webview?url=' + e.currentTarget.dataset.url,
		})
	},
	// 获取盲盒函数
	getmemberboxes(box_pageno) {
		var t = this;
		if (box_pageno == 0) {
			t.data.box_pageno = 0;
		}
		app.util.request({
			url: 'entry/wxapp/getmemberboxes',
			data: {
				m: app.globalData.module_name,
				page: box_pageno
			},
			method: 'get',
			success: function (response) {
				console.log('getmemberboxes', response.data);
				if (response.data.errno == 0) {
					if (response.data.data.length == 0 && box_pageno == 0) {
						wx.showToast({
							icon: 'none',
							title: '没有更多了',
						})
						t.setData({
							boxlist: response.data.data,
						})
					} else {
						t.setData({
							boxlist: box_pageno > 0 ? t.data.boxlist.concat(response.data.data) : response.data.data,
							box_pageno: t.data.box_pageno + 1,
						})
					}
				} else {
					//失败
					wx.showToast({
						icon: 'none',
						title: response.data.message,
					})
				}
			},
			fail: function (response) {
				wx.showToast({
					icon: 'none',
					title: response.data.message,
				})
			},
			complete: function () {
				wx.stopPullDownRefresh();
			}
		});
	},
	getboxinfo(box_id) {
		var t = this;
		app.util.request({
			url: 'entry/wxapp/getboxinfobyid',
			data: {
				m: app.globalData.module_name,
				boxid: box_id
			},
			method: 'get',
			success: function (response) {
				console.log('getboxinfo', response.data);
				if (response.data.errno == 0) {
					t.setData({
						openboxinfo: response.data.data
					})
				} else {
					//失败
					wx.showToast({
						icon: 'none',
						title: response.data.message,
					})
				}
			},
			fail: function (response) {
				wx.showToast({
					icon: 'none',
					title: response.data.message,
				})
			}
		});
	},
	onShareTimeline() {
		var memberinfo = wx.getStorageSync('memberinfo');
		var uid = 0;
		console.log('uid', memberinfo.id);
		memberinfo.id && (uid = memberinfo.id);
		var t = this;
		console.log(this.data.openboxinfo == false ? '礼品盒子无限抽！' : this.data.openboxinfo['box_title']);
		console.log(this.data.openboxinfo == false ? '' : this.data.openboxinfo['box_cover']);
		console.log(this.data.openboxinfo == false ? '/pages/index/index' : '/pages/index/index?sharetype=sendbox&senduid=' + uid + '&boxid=' + this.data.openboxinfo['membersbox_id']);
		return {
			title: t.data.openboxinfo == false ? '礼品盒子无限抽！' : t.data.openboxinfo['box_title'],
			imageUrl: t.data.openboxinfo == false ? '' : t.data.openboxinfo['box_cover'],
			query: t.data.openboxinfo == false ? '' : 'sharetype=sendbox&senduid=' + uid + '&boxid=' + t.data.openboxinfo['membersbox_id'],
		}
	},
	onPageScroll: function (res) {
		//console.log(res);
		var t = this;
		if (res.scrollTop > 300) {
			if (!t.data.scrolltopenable) {
				this.setData({
					scrolltopenable: true
				})
			}
		} else {
			if (t.data.scrolltopenable) {
				this.setData({
					scrolltopenable: false
				})
			}
		}
	},
})