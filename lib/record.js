/**
 * Filename: f:\workingspace\js\record\lib\record.js
 * Path: f:\workingspace\js\record
 * Created Date: Sun May 28 2017
 * Author: Wy
 *
 * Copyright (c) 2017 Your Company
 */

(function (window) {
  var Record = function (ele, options) {
    return new Record.prototype.Init(ele, options)
  }

  var that = null

  Record.prototype = {
    Init: function (ele, options) {
      that = this
      this.mediaConstraints = { video: true, audio: true }
      this.options = options || {
        mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 128000,
        bitsPerSecond: 128000 // if this line is provided, skip above two
      }
      that.recordRTC = {}
      this.video = document.querySelector(ele)
      console.log('this.video', this.video)
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
    that.video.src = window.URL.createObjectURL(stream)

    that.recordRTC = window.RecordRTC(stream, this.options)

    that.recordRTC.startRecording()
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
    that.recordRTC.pauseRecording()
    that.video.pause()
    return this
  }

  /**
   * resume
   *
   */
  Record.prototype.resume = function () {
    that.recordRTC.resumeRecording()
    that.video.play()
    return this
  }

  /**
   * stop
   *
   */
  Record.prototype.stop = function (cb) {
    that.recordRTC.stopRecording(function (audioVideoWebMURL) {
      that.video.pause()
      cb(that.recordRTC)
    })
    return this
  }

  Record.prototype.Init.prototype = Record.prototype
 // window['W'] = {}
  window['Record'] = Record
})(window)
