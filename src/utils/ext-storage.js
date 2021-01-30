import copy from 'copy-to-clipboard'

class ExtStorage {
  get() {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get('@@vwe-persistence', s => resolve(s['@@vwe-persistence'] || null))
      } catch (e) {
        console.error('[ytcFilter] extStorage get failed', e)
        reject(e)
      }
    })
  }

  async getYtcFilterVersion() {
    const storage = await this.get()
    return storage?.global?.version
  }

  async copyToClipboard() {
    copy(JSON.stringify(await this.get()))
  }
}

export const extStorage = new ExtStorage()
