function injectYTAPI() {
  // YouTube iFrame API
  // Might not be needed if script async now fully supported
  const script = document.createElement('script')
  script.id = 'youtube'
  script.src = 'https://www.youtube.com/iframe_api'
  script.type = 'text/javascript'
  const head = document.querySelector('head')
  head.insertAdjacentElement('afterbegin', script)
  // when ready this calls onYouTubeIframeAPIReady
}

function playVideo(player, { videoId, startSeconds = undefined, endSeconds = undefined }) {
  player.loadVideoById({
    videoId,
    startSeconds,
    endSeconds
  })
}

let player
let cuedVideo  // to playing when player is ready
let interval

export function youTubePlay(item) {
  // Note seems safe to assume id doesn't include =
  const video = {
    endSeconds: item.split('e=')[1]?.trim(),
    startSeconds: item.split('e=')[0].split('s=')[1]?.trim(),
    videoId: item.split('e=')[0].split('s=')[0].split('v=')[1]?.trim()
  }

  if (player) {
    playVideo(player, video);
  }
  {
    // To play when player is ready
    cuedVideo = video
  }
}

function extendPlayer(proto) {
  if (proto.getPlayerTimeState) {
    return
  }

  // TODO MDN says this kills optimisations
  proto.getPlayerTimeState = function () {
    return {
      duration: this.getDuration(),
      time: this.getCurrentTime(),
      isPlaying: this.getPlayerState() == YT.PlayerState.PLAYING,
    }
  }
  Object.defineProperty(proto, 'playbackRate', {
    set(rate) {
      this.setPlaybackRate(parseFloat(rate));
    },
  })
  proto.loop = true
  proto.pause = function () {
    this.pauseVideo()
  }
  proto.play = function () {
    this.playVideo()
  }
  proto.setStateFunc = function (func) {
    this.stateFunc = func
  }
}

export function youTubeLoad() {
  let { promise, resolve } = Promise.withResolvers();

  function callStateFunc(player) {
    if (player.stateFunc) {
      player.stateFunc(player.getPlayerTimeState())
    }
  }
  function onPlayerReady(event) {
    player = event.target
    resolve(player)
    if (cuedVideo) {
      playVideo(player, cuedVideo)
    }
  }

  function startPoll(player) {
    if (!interval) {
      interval = setInterval(() => {
        callStateFunc(player)
      }, 450)
    }
  }

  function stopPoll() {
    cleanup()
  }

  function cleanup() {
    if (interval) {
      clearInterval(interval)
      interval = undefined
    }
  }

  function onPlayerStateChange(event) {
    const { data: playerStatus, target: player } = event

    if (playerStatus == YT.PlayerState.PLAYING) {
      stopPoll()
      startPoll(player)
    } else {
      stopPoll()
      // cant get loop to work with single video - maybe needs playlist
      if (playerStatus == YT.PlayerState.ENDED) {
        if (player.loop) { // end video
          const seekTime = cuedVideo.startSeconds ? cuedVideo.startSeconds : 0
          player.seekTo(seekTime)
        }
        else {
          player.getIframe().dispatchEvent(
            new CustomEvent('ended', {
              bubbles: true,
            })
          )
        }
      }
    }
    callStateFunc(player)
  }

  // function is global so youtube API can call it
  window.onYouTubeIframeAPIReady = function () {
    extendPlayer(YT.Player.prototype)

    let p = new YT.Player('ytVideo', {
      height: '180',
      width: '320',
      playerVars: {
        'playsinline': 1, // not full screen on iOS
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
    window.onunload = cleanup
  }

  if (window.YT) {
    if (player) {
      player.destroy();
      player = undefined
      stopPoll()
    }
    window.onYouTubeIframeAPIReady()
  }
  else {
    injectYTAPI()
  }

  return promise
}