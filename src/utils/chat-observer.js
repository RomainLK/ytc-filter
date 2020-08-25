import { querySelectorAsync } from '@/utils/dom-helper'
import { parse } from '@/utils/message-parser'

export class ChatObserver {
  constructor() {
    this.listeners = []
  }

  async observe() {
    const items = await querySelectorAsync('#items.yt-live-chat-item-list-renderer')

    if (!items) {
      return
    }

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

    // this.cleanupTimer = setInterval(() => {
    //   this.timelines = this.timelines.map((timelines) => {
    //     return timelines.filter((timeline) => {
    //       return timeline.didDisappear > Date.now()
    //     })
    //   })
    // }, 1000)
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
    this.observer?.disconnect()
  }
}
