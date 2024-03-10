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
    frame.src += `&feature=oembed&enablejsapi=1&domain=${window.location.host}`
    // @ts-ignore

    frame.ytPlayer = new YT.Player(frame, {
    })
  })
}

function youTubePlay(item) {    
  const yt = document.querySelector('iframe#youtube')
  if (!yt) {
    const ytFrame = document.createElement('iframe')
    ytFrame.id = 'youtube'
    ytFrame.setAttribute('type', 'text/html')
    ytFrame.src=`https://www.youtube.com/embed?${item.split('=')[1]}`
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

