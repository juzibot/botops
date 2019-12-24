import fetch from 'node-fetch'
import cheerio from 'cheerio'

// const code_str = '073'
// const url = `http://scp-wiki-cn.wikidot.com/scp-${code_str}`

export async function getSCP (codeStr: string): Promise<string> {
  const url = `http://scp-wiki-cn.wikidot.com/scp-${codeStr}`
  let obj = await fetch(url)
  let content = await obj.text()
  const $ = cheerio.load(content)
  return $('div#page-content p').text()
}

// getSCP()
