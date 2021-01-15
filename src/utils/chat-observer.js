import { parse } from '@/utils/message-parser'
import 'arrive'

export class ChatObserver {
  constructor() {
    this.listeners = []
  }

  async observe() {
    if (!document.querySelector('#items.yt-live-chat-item-list-renderer')) {
      await new Promise(resolve => document.arrive('#items.yt-live-chat-item-list-renderer', resolve))
      document.unbindArrive()
    }
    const items = document.querySelector('#items.yt-live-chat-item-list-renderer')
    this.observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        const nodes = Array.from(mutation.addedNodes)
        nodes.forEach(node => {
          if (node instanceof HTMLElement) {
            this.proceed(node)
          }
        })
      })
    })

    this.observer.observe(items, { childList: true })
  }

  async proceed(element) {
    const message = await parse(element)
    if (!message) {
      return
    }

    for (const listener of this.listeners) {
      listener(message)
    }
  }

  clear() {
    this.listeners.length = 0
    this.observer.disconnect()
  }
}
