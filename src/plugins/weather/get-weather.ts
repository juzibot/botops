
import fetch from 'node-fetch'
import cheerio from 'cheerio'
import { getCode } from './read-city'

const HEADERS = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'max-age=0',
  'Connection': 'keep-alive',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/72.0.3626.121 Chrome/72.0.3626.121 Safari/537.36',
}

async function getWeather (city: string) {
  const pos = await getCode(city)
  const url = `http://www.weather.com.cn/weather/${pos}.shtml`
  let obj = await fetch(url, {
    headers: HEADERS,
  })
  const html = await obj.text()
  const $ = cheerio.load(html)
  let r = $('li.sky').text()
  const lines: string[] = r.split('\n')
    .filter(s => s.trim().length)
    .map(s => s.trim())
    .slice(0, 8)
  return lines.slice(0, 4).join('\t') + '\n' + lines.slice(4).join('\t')
}

export async function onWeather (text: string): Promise<null|string> {
  text = text.trim()
  const m = text.match(/weather\s+(.+)$/i)
  if (m) {
    const ret = await getWeather(m[1])
    if (ret) {
      return `${m[1]}的天气：\n${ret}`
    } else {
      return `没找到${m[1]}的天气`
    }
  }
  return null
}

// setTimeout(async () => {
//   const r = await getWeather('北京市海淀区')
//   console.log(r)
// }, 100)
