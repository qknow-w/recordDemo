(function (window) {
  var Record = function (ele, options) {
    return new Record.prototype.Init(ele, options)
  }

  Record.prototype = {
    Init: function (ele, options) {
      this.mediaConstraints = { video: true, audio: true }
      this.options = options || {
        mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 128000,
        bitsPerSecond: 128000 // if this line is provided, skip above two
      }
      window.recordRTC = {}
      this.video = document.querySelector(ele)
      window.URL = window.URL || window.webkitURL
      navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia
      return this
    }

  }

  /**
   * start
   *
   */
  Record.prototype.start = function () {
    console.log('mediaConstraints', this.mediaConstraints)
   //
    if (navigator.getUserMedia) {
      navigator.getUserMedia(this.mediaConstraints, this.successCallback, this.errorCallback)
    } else {
      navigator.mediaDevices.getUserMedia(this.mediaConstraints).then(this.successCallback).catch(this.errorCallback)
    }

    return this
  }

  /**
   * successCallback
   *
   */
  Record.prototype.successCallback = function (stream) {
    this.video.src = window.URL.createObjectURL(stream)

    window.recordRTC = window.RecordRTC(stream, this.options)

    window.recordRTC.startRecording()
  }

  /**
   * errorCallback
   *
   */
  Record.prototype.errorCallback = function (error) {
    console.log('error', error)
    // maybe another application is using the device
  }

  /**
   * paused
   *
   */
  Record.prototype.paused = function () {
    window.recordRTC.pauseRecording()
    this.video.pause()
    return this
  }

  /**
   * resume
   *
   */
  Record.prototype.resume = function () {
    window.recordRTC.resumeRecording()
    this.video.play()
    return this
  }

  /**
   * stop
   *
   */
  Record.prototype.stop = function (cb) {
    var lelf = this
    window.recordRTC.stopRecording(function (audioVideoWebMURL) {
      lelf.video.pause()
      cb(window.recordRTC)
    })
    return this
  }

  Record.prototype.Init.prototype = Record.prototype
 // window['W'] = {}
  window['Record'] = Record
})(window)
