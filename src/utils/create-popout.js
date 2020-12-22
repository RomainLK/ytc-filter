export const createYtcPopout = info => {
  chrome.windows.create(
    {
      url: `${chrome.runtime.getURL('popout.html')}?vid=${info.videoId}&vname=${encodeURIComponent(info.videoName)}&cid=${info.channelId}&cname=${info.channelName}`,
      type: 'popup',
    },
    function(window) {}
  )
}

export const createYoutubePopout = info => {
  chrome.windows.create({
    url: `https://www.youtube.com/live_chat?is_popout=1&v=${info.videoId}&ytc=1&vid=${info.videoId}&cid=${info.channelId}&cname=${info.channelName}`,
  })
}
