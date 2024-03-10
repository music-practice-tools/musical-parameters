/* global YT */

// @ts-ignore
window.onYouTubeIframeAPIReady = function () {
  onYouTubeIframeAPIReady()
}

function injectYTAPI() {
  // YouTube iFrame API
  const script = document.createElement('script')
  script.src = 'https://www.youtube.com/iframe_api'
  script.type = 'text/javascript'
  const head = document.querySelector('head')
  head.insertAdjacentElement('afterbegin', script)
  // when ready this calls onYouTubeIframeAPIReady
}

function enhanceYTFrames(ytFrames) {
  // @ts-ignore

  ytFrames.forEach((frame) => {
    // Reload with API enabled
    frame.src += frame.src.includes('?') ? '' : '?feature=oembed'
    frame.src += `&enablejsapi=1&domain=${window.location.host}`
    // @ts-ignore

    frame.ytPlayer = new YT.Player(frame, {
    })
  })
}

function youTubePlay(item) {    
  const yt = document.querySelector('frame#youtube')
  if (!yt) {
    const ytFrame = document.createElement('iframe')
    ytFrame.id = 'youtube'
    ytFrame.src='https://www.youtube.com/watch?${item}'
    document.body.appendChild(ytFrame)

    window.onYouTubeIframeAPIReady = function () {
      onYouTubeIframeAPIReady()
    }
    
    function onYouTubeIframeAPIReady() {
      enhanceYTFrames([ytFrame])
    }

    injectYTAPI()
  } 
}

export { youTubePlay }

