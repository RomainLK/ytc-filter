export const getVideoId = () => {
  if (document.location.origin === 'https://studio.youtube.com') {
    return 'studio'
  }
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get('v') || new URLSearchParams(window.parent.top.location.search).get('v')
}
