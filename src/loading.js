import { mount } from '@/utils/mount'

if (document.querySelector('#ytc-filter') == null) {
  console.log('[ytcFilter] Loading message insertion')
  const loadingDiv = document.createElement('div')
  loadingDiv.classList.add('ytc-loading')
  loadingDiv.innerHTML = `ytcFilter is loading. Click <span id="remount-ytc">here</span>  if it doesn't load properly `
  // const loadingMessage = document.createTextNode(`ytcFilter is loading. Click <a id="remount-ytc">here</a>  if it doesn't load properly `)
  // loadingDiv.appendChild(loadingMessage)
  document.body.insertBefore(loadingDiv, document.body.firstChild)
  const loadButton = document.querySelector('#remount-ytc')
  loadButton.addEventListener('click', mount)
  console.log('[ytcFilter] Loading message inserted')
}
