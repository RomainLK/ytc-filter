import 'arrive'
import { mount } from '@/utils/mount'
console.log('[ytcFilter] Content loaded')

const isStudio = document.location.origin === 'https://studio.youtube.com'

const listener = async () => {
  console.log('[ytcFilter] DOM loaded.')
  mount('Mount from DOM loaded')
  if (isStudio) {
    document.removeEventListener('DOMContentLoaded', listener)
  } else {
    document.unbindArrive()
  }
}

if (isStudio) {
  document.arrive('#chat', listener)
} else {
  document.addEventListener('DOMContentLoaded', listener)
}
console.log('[ytcFilter] Content ended')
