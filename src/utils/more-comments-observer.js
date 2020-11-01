export class MoreCommentsObserver {
  constructor() {
    this.listeners = []
    var observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'style') {
          this.listeners.forEach(fn => fn(mutation.target))
        }
      }
    })
    observer.observe(document.getElementById('show-more'), {
      attributes: true,
      attributeFilter: ['style'],
    })
  }
}
