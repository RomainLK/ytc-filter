export const getVideoId = () => {
  return new URLSearchParams(window.parent.top.location.search).get('v')
}

export const getChannelId = () => {
  return window.parent.top.document.querySelector('ytd-channel-name .yt-simple-endpoint').href.split('/').pop()
}