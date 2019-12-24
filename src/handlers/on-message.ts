import {
  log,
  Message,
  Wechaty,
} from 'wechaty'

import { onSCP, onRandomSCP, onZhiHuFollower } from '../plugins'

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

  if (room && mentionMe) {
    for (const func of FUNCTIONS) {
      const reply = await func(text)
      if (reply) {
        await room.say(reply)
        return
      }
    }
    await room.say('我什么都不会呢')
  }

  if (!room && contact) {
    await contact.say('我什么都不会呢')
  }
}
