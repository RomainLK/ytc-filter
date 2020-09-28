export const getVideoId = () => {
  if (document.location.origin === 'https://studio.youtube.com') {
    return 'studio'
  }
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get('v') || new URLSearchParams(window.parent.top.location.search).get('v')
}

export const getChannelId = () => {
  if (document.location.origin === 'https://studio.youtube.com') {
    return 'Studio'
  } else if (document.referrer.startsWith('https://www.youtube.com') && window.parent !== window) {
    return window.parent.top.document
      .querySelector('ytd-channel-name .yt-simple-endpoint')
      .href.split('/')
      .pop()
  } else {
    // Context other than Youtube's chat
    return null
  }
}

export const getChannelName = () => {
  if (document.location.origin === 'https://studio.youtube.com') {
    return 'Studio'
  } else if (document.referrer.startsWith('https://www.youtube.com') && window.parent !== window) {
    return window.parent.top.document.querySelector('ytd-channel-name .yt-simple-endpoint').text
  } else {
    // Context other than Youtube
    return null
  }
}
