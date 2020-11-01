import Color from 'color'
import { getImageSourceAsync } from '@/utils/dom-helper'

const getBackgroundColor = (el, opacity) => {
  try {
    const backgroundColor = getComputedStyle(el).backgroundColor
    const o = new Color(backgroundColor).object()
    return `rgba(${o.r}, ${o.g}, ${o.b}, ${opacity})`
  } catch (e) {
    // parse error by invalid background color
    return undefined
  }
}

const parseCommonElements = async el => {
  const id = el.id
  const author = el.querySelector('#author-name')?.textContent ?? undefined
  const authorType = el.getAttribute('author-type') ?? undefined
  const avatorImage = el.querySelector('#img')
  const avatarUrl = (avatorImage && (await getImageSourceAsync(avatorImage))) ?? undefined
  const message = el.querySelector('#message')?.textContent ?? undefined
  const badgeUrl = el.querySelector('img.yt-live-chat-author-badge-renderer')?.src
  return { id, message, author, authorType, avatarUrl, badgeUrl }
}

const parseTextMessage = async el => {
  const params = await parseCommonElements(el)
  const html = el.querySelector('#message')?.innerHTML
  const timestamp = el.querySelector('#timestamp')?.innerHTML

  return {
    ...params,
    html,
    messageType: 'text-message',
    timestamp,
  }
}

const parsePaidMessage = async el => {
  const params = await parseCommonElements(el)

  const html = el.querySelector('#message')?.innerHTML
  const purchaseAmount = el.querySelector('#purchase-amount')?.textContent ?? undefined
  const card = el.querySelector('#card > #header')
  const backgroundColor = (card && getBackgroundColor(card, 0.8)) ?? undefined

  return {
    ...params,
    html,
    backgroundColor,
    purchaseAmount,
    messageType: 'paid-message',
  }
}

const parsePaidSticker = async el => {
  const params = await parseCommonElements(el)

  const purchaseAmount = el.querySelector('#purchase-amount-chip')?.textContent ?? ''
  const card = el.querySelector('#card')
  const backgroundColor = (card && getBackgroundColor(card, 0.8)) ?? undefined
  const stickerImage = el.querySelector('#sticker > #img')
  const stickerUrl = (stickerImage && (await getImageSourceAsync(stickerImage))) ?? undefined

  return {
    ...params,
    stickerUrl,
    backgroundColor,
    purchaseAmount,
    messageType: 'paid-sticker',
  }
}

const parseMembershipItem = async el => {
  const params = await parseCommonElements(el)

  const detailText = el.querySelector('#header-subtext')?.textContent ?? undefined
  const header = el.querySelector('#card > #header')
  const backgroundColor = (header && getBackgroundColor(header, 0.8)) ?? undefined

  return {
    ...params,
    html: detailText,
    backgroundColor,
    messageType: 'membership-item',
  }
}

export const parse = async el => {
  const tagName = el.tagName.toLowerCase()
  switch (tagName) {
    case 'yt-live-chat-text-message-renderer':
      return await parseTextMessage(el)
    case 'yt-live-chat-paid-message-renderer':
      return await parsePaidMessage(el)
    case 'yt-live-chat-paid-sticker-renderer':
      return await parsePaidSticker(el)
    case 'yt-live-chat-membership-item-renderer':
      return await parseMembershipItem(el)
  }
}
