import fetch from 'node-fetch'
import cheerio from 'cheerio'

export async function onSCP (text: string): Promise<null|string> {
  const m = text.match(/SCP(\d+)/i)
  if (m) {
    const scp = await getSCP(m[1])
    return scp
  }
  return null
}

export async function onRandomSCP (text: string): Promise<null|string> {
  const m = (text.includes('随机') || text.match(/rand/i)) && text.match(/scp/i)
  if (m) {
    const scp = await randomSCP()
    return scp
  }
  return null
}

async function randomSCP (): Promise<string> {
  const code = Math.floor(Math.random() * 3000 + 1).toString()
  return getSCP(code)
}

async function getSCP (codeStr: string): Promise<string> {
  if (!codeStr.match(/^\d+$/)) {
    return 'SCP代码必须是纯数字'
  }
  const n = Number.parseInt(codeStr)
  if (n <= 0 || n > 4000) {
    return 'SCP数字应在(1, 4000]'
  }
  while (codeStr.length < 3) {
    codeStr = '0' + codeStr
  }
  const url = `http://scp-wiki-cn.wikidot.com/scp-${codeStr}`
  let obj = await fetch(url)
  let content = await obj.text()
  const $ = cheerio.load(content)
  let data = $('div#page-content p').text()
  if (data.length > 350) {
    data = data.substr(0, 350)
  }
  data = data + '\n更多： ' + url
  return data
}
