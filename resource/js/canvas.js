const getPhone = (code, imgs, sWidth, sHeight, classNames, textStyle, successCallback, textcolor, codecolor )=>{
  let that = this;
    const variableNum =sWidth / 750;
    const ctx = wx.createCanvasContext(classNames);
    
    ctx.drawImage(imgs, 0, 0, sWidth, sHeight);  //绘制图片
    ctx.drawImage(code, 250 * variableNum+5, 750 * variableNum, 120, 120); //绘制二维码
    ctx.setTextAlign(textStyle)
  ctx.setFillStyle(codecolor)
    ctx.setFontSize(28)
    //ctx.fillText("我是文字部分....", 400 * variableNum, 500 * variableNum)
  ctx.setFillStyle(textcolor)
    //ctx.fillText("长按二维码....", 400 * variableNum, 600 * variableNum)
    ctx.stroke()
    ctx.draw();
  setTimeout(function () {  //这里要加定时器，转成图片需要一定的时间，不然是不出来图片的哦
    // canvas画布转成图片
    var i = getCurrentPages(), a = i[i.length - 1];//获取当前引用该方法的data里面的值
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: sWidth*2,
      height: sHeight*2,
      destWidth: sWidth*2,
      destHeight: sHeight*2,
      canvasId: classNames,
      fileType: 'png',  
      success: (res)=>{
        console.log(res);
        successCallback
          a.setData({
            imgurl: res.tempFilePath,
            hidden: false
          })
          wx.hideLoading({
            success: (res) => {},
          })
      },
      fail: function () {
        console.log("保存失败......")
      }
    })
  }, 2000)
}

module.exports = {//将此回调暴露出去
  getPhone: getPhone
}