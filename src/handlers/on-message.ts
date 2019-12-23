import {
  log,
  Message,
  Wechaty,
}             from 'wechaty'

export default async function onMessage (
  this    : Wechaty,
  message : Message,
): Promise<void> {
  log.info('on-message', 'onMessage(%s)', message)
  const room = message.room()
  // const contact = message.from()
  const mentions = await message.mention()
  if (room && mentions) {
    for (const mention of mentions) {
      if (mention.id === message.wechaty.self().id) {
        await room.say('我什么都不会呢at我也没用')
      }
    }
  }
}
