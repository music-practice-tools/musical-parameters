/* global YT */

// @ts-ignore
window.onYouTubeIframeAPIReady = function () {
  onYouTubeIframeAPIReady()
}

function injectYTAPI() {
  // YouTube iFrame API
  // Might not be needed if script async now fully supported
  const script = document.createElement('script')
  script.src = 'https://www.youtube.com/iframe_api'
  script.type = 'text/javascript'
  const head = document.querySelector('head')
  head.insertAdjacentElement('afterbegin', script)
  // when ready this calls onYouTubeIframeAPIReady
}

var player;

function playVideo({ videoId, startSeconds = undefined, endSeconds = undefined }) {
  player.loadVideoById({
    videoId,
    startSeconds,
    endSeconds
  })
}

let video // make global as don't want closure

function youTubePlay(item) {
  // Note seems safe to assume id doesn't include =
  video = {
    endSeconds: item.split('e=')[1]?.trim(),
    startSeconds: item.split('e=')[0].split('s=')[1]?.trim(),
    videoId: item.split('e=')[0].split('s=')[0].split('v=')[1]?.trim()
  }

  let ytDiv = document.querySelector('#youtube') // NB youtube replaces div with iframe
  if (!ytDiv) {
    ytDiv = document.createElement('div')
    ytDiv.style = 'display:none'
    ytDiv.id = 'youtube'
    document.body.appendChild(ytDiv)

    function onPlayerReady(event) {
      playVideo(video);
    }

    function onPlayerStateChange(event) {
      // cant get loop to work with single video
      if (event.data == 0) {
        playVideo(video);
      }
    }

    window.onYouTubeIframeAPIReady = function () {
      player = new YT.Player('youtube', {
        playerVars: {
          'playsinline': 1, // not full screen on iOS
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    }
    injectYTAPI()
  }
  else {
    playVideo(video);
  }
}

export { youTubePlay }
