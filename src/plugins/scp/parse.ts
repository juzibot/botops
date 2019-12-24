
import cheerio from 'cheerio'

export function parseContent (content: string) {
  const $ = cheerio.load(content)
  const maxPara = 5
  const contents: string[] = []
  $('div#page-content p').each((i, elem) => {
    if (i < maxPara) {
      contents.push($(elem).text())
    }
  })
  return contents.join('\n')
}

// const fs = require('fs')
// const content = fs.readFileSync('./173.html', {encoding: 'utf-8'})
// console.log(parseContent(content))
