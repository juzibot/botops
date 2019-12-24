
const path = require('path')
const csv = require('csv-parser')
const fs = require('fs')

const csvPath = path.join(__dirname, 'cityidloc-20180625.csv')
const results: any[] = []

fs.createReadStream(csvPath)
  .pipe(csv(['ID', 'City', 'Area', 'N', 'N2', 'N3', 'Code']))
  .on('data', (data: any) => results.push(data))

export async function getCode (city: string): Promise<string | null> {
  for (const row of results) {
    if ((row['City'] + row['Area']).includes(city)) {
      return row['Code']
    }
    if (row['City'].includes(city)) {
      return row['Code']
    }
    if (row['Area'].includes(city)) {
      return row['Code']
    }
  }
  return null
}

// setTimeout(async () => {
//     console.log(await getCode('北京'))
//     console.log(await getCode('南京'))
//     console.log(await getCode('海淀区'))
// }, 100)
