console.log('[ytcFilter] Inject start')
const originalFetch = window.fetch

const convertTimestampUsec = timestamp => {
  return new Intl.DateTimeFormat('default', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }).format(new Date(timestamp / 1000))
}

const toMessage = (messages = []) => {
  return (
    messages.reduce((acc, msg) => {
      if (msg.text) {
        return acc + msg.text
      }
      return acc
    }, '') || ''
  )
}
const toHtml = (messages = []) => {
  return (
    messages.reduce((acc, msg) => {
      if (msg.text) {
        return acc + msg.text
      }
      if (msg.emoji) {
        return acc + `<img src="${msg.emoji.image.thumbnails[0].url}"/>`
      }
      return acc
    }, '') || ''
  )
}
window.fetch = async (...args) => {
  //example url https://www.youtube.com/youtubei/v1/live_chat/get_live_chat?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8
  try {
    if (args[0].url.includes('live_chat/get_live_chat')) {
      const response = await originalFetch(...args)
      const text = await response.text()
      const json = JSON.parse(text)
      try {
        if (json.continuationContents.liveChatContinuation.actions) {
          for (let action of json.continuationContents.liveChatContinuation.actions) {
            if (action.replayChatItemAction) {
              action = action.replayChatItemAction.actions[0]
            }

            const chatMessage = action?.addChatItemAction?.item?.liveChatTextMessageRenderer || action?.addChatItemAction?.item?.liveChatPaidMessageRenderer

            const msg = {}
            if (chatMessage) {
              msg.id = chatMessage.id
              if (chatMessage.message) {
                msg.message = toMessage(chatMessage.message.runs)
                msg.html = toHtml(chatMessage.message.runs)
              }
              msg.author = chatMessage.authorName.simpleText
              msg.timestamp = chatMessage?.timestampText?.simpleText ?? convertTimestampUsec(chatMessage.timestampUsec)
              if (chatMessage.authorBadges) {
                for (const authorBadge of chatMessage.authorBadges) {
                  const chatBadge = authorBadge.liveChatAuthorBadgeRenderer
                  if (chatBadge.tooltip.toLowerCase().includes('member')) {
                    msg.badgeUrl = chatBadge.customThumbnail.thumbnails[0].url
                    msg.member = true
                  }
                  if (chatBadge.tooltip.toLowerCase().includes('moderator')) {
                    msg.moderator = true
                  }
                  if (chatBadge.tooltip.toLowerCase().includes('verified')) {
                    msg.verified = true
                  }
                  if (chatBadge.tooltip.toLowerCase().includes('owner')) {
                    msg.owner = true
                  }
                }
              } else {
              }
              if (chatMessage.purchaseAmountText) {
                msg.messageType = 'paid-message'
                msg.purchaseAmount = chatMessage.purchaseAmountText.simpleText
                switch (chatMessage.bodyBackgroundColor) {
                  case 4280191205:
                    msg.backgroundColor = '#1565c0'
                    break
                  case 4278248959:
                    msg.backgroundColor = '#00e5ff'
                    break
                  case 4280150454:
                    msg.backgroundColor = '#1de9b6'
                    break
                  case 4294953512:
                    msg.backgroundColor = '#ffb300'
                    break
                  case 4294278144:
                    msg.backgroundColor = '#f57c00'
                    break
                  case 4293467747:
                    msg.backgroundColor = '#e91e63'
                    break
                  case 4293271831:
                    msg.backgroundColor = '#e62117'
                    break
                }
              }
              document.dispatchEvent(new CustomEvent('chat-message-capture', { detail: msg }))
            } else {
              console.log('[ytcFilter] Unsupported chat action', action)
            }
          }
        } else {
          console.log('[ytcFilter] Non interesting actions', json)
        }
      } catch (e) {
        console.log('[ytcFilter] Fetch interceptor failed parsing', json)
        console.error(e)
      }
      return {
        ...response,
        text() {
          return Promise.resolve(text)
        },
        json() {
          return Promise.resolve(json)
        },
      }
    }
  } catch (e) {
    console.error(e)
  }
  return originalFetch(...args)
}
