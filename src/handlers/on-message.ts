import {
  log,
  Message,
  Wechaty,
}             from 'wechaty'

import { getSCP, getZhiHuFollower } from '../plugins'

export default async function onMessage (
  this    : Wechaty,
  message : Message,
): Promise<void> {
  log.info('on-message', 'onMessage(%s)', message)
  const room = message.room()
  const text = message.text()
  // const contact = message.from()
  const mentions = await message.mention()
  if (room && mentions) {
    for (const mention of mentions) {

      if ((text.includes('知乎') || text.includes('知呼')) && text.includes('粉丝')) {
        const ret = await getZhiHuFollower()
        await room.say(ret)
        return
      }

      const m = text.match(/SCP(\d+)/i)
      if (m) {
        const scp = await getSCP(m[1])
        await room.say(scp)
        return
      }
      if (mention.id === message.wechaty.self().id) {
        await room.say('我什么都不会呢at我也没用')
      }
    }
  }
}
