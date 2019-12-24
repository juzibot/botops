
import fetch from 'node-fetch'
import cheerio from 'cheerio'

const url = 'https://www.zhihu.com/people/qhduan/activities'

export async function getZhiHuFollower (): Promise<string> {
  let obj = await fetch(url)
  let content = await obj.text()
  const $ = cheerio.load(content)
  let ret = $('meta[itemProp="zhihu:followerCount"]').attr('content')
  if (!ret) {
    ret = '没找到啊'
  } else {
    ret = '有' + ret
  }
  return ret
}
