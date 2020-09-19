import { querySelectorAsync } from '@/utils/dom-helper'
import { parse } from '@/utils/message-parser'
import 'arrive'

export class ChatObserver {
  constructor() {
    this.listeners = []
  }

  async observe() {
    await new Promise(resolve => document.arrive('#items.yt-live-chat-item-list-renderer', resolve))
    document.unbindArrive()
    const items = document.querySelector('#items.yt-live-chat-item-list-renderer')

    this.observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        console.log('mut', mutation)
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
    console.log('proceed', element)
    const message = await parse(element)
    if (!message) {
      return
    }

    for (const listener of this.listeners) {
      listener(message)
    }
  }

  clear() {
    this.observer?.disconnect()
  }
}
