export const getVideoId = () => {
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get('v') || new URLSearchParams(window.parent.top.location.search).get('v')
}

// export const getChannelId = () => {
//   return window.parent.top.document
//     .querySelector('ytd-channel-name .yt-simple-endpoint')
//     .href.split('/')
//     .pop()
// }
