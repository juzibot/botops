import {
  log,
  Message,
  Wechaty,
} from 'wechaty'

import {
  onSCP,
  onRandomSCP,
  onZhiHuFollower,
  talkTBP,
  onWeather,
} from '../plugins'

const FUNCTIONS = [
  onSCP,
  onRandomSCP,
  onZhiHuFollower,
  onWeather,
]

async function isRoomMentionMe (message: Message) : Promise<string|null> {
  const room = message.room()
  const text = message.text()
  if (room && text.match(/^pda\s/i)) {
    return text.substr(4)
  }
  if (room && await message.mentionSelf()) {
    return message.mentionText()
  }
  return null
}

export default async function onMessage (
  this: Wechaty,
  message: Message,
): Promise<void> {
  log.info('on-message', 'onMessage(%s)', message)
  const room = message.room()
  let text = message.text()
  const contact = message.from()

  const mentionMe = await isRoomMentionMe(message)
  log.info('onMessage', 'mention %s', mentionMe)
  if (mentionMe) {
    text = mentionMe.trim()
    log.info('onMessage', 'mentioned text %s', text)
  } else {
    log.info('onMessage', 'non-mentioned text %s', text)
  }

  if ((room && mentionMe) || (!room && contact)) {
    for (const func of FUNCTIONS) {
      const reply = await func(text)
      if (reply) {
        if (room) {
          await room.say(reply)
        } else if (contact) {
          await contact.say(reply)
        }
        return
      }
    }
    const defaultReply = await talkTBP(text) || '我什么都不会呢'
    if (room) {
      await room.say(defaultReply)
    } else if (contact) {
      await contact.say(defaultReply)
    }
  }
}
