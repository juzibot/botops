import {
  log,
  Message,
  Wechaty,
} from 'wechaty'

import { onSCP, onRandomSCP, onZhiHuFollower, talkTBP } from '../plugins'

const FUNCTIONS = [
  onSCP,
  onRandomSCP,
  onZhiHuFollower,
]

async function isRoomMentionMe (message: Message) {
  const room = message.room()
  const text = message.text()
  if (room && text.match(/^pda\s/i)) {
    return true
  }
  const mentions = await message.mentionList()
  if (room && mentions) {
    for (const mention of mentions) {
      if (mention.id === message.wechaty.self().id) {
        return true
      }
    }
  }
  return false
}

export default async function onMessage (
  this: Wechaty,
  message: Message,
): Promise<void> {
  log.info('on-message', 'onMessage(%s)', message)
  const room = message.room()
  const text = message.text()
  const contact = message.from()

  const mentionMe = await isRoomMentionMe(message)

  if ((room && mentionMe) || contact) {
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
