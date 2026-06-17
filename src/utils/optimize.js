import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const directory = './public'

const files = fs.readdirSync(directory)

await Promise.all(
    files.map(async (file) => {
        if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {
            const filename = path.parse(file).name
            try {
                await sharp(`${directory}/${file}`)
                    .resize(800)
                    .webp({ quality: 80 })
                    .toFile(`${directory}/${filename}.webp`)
                console.log(`Optimizado: ${filename}`)
            } catch (error) {
                console.error(error)
            }
        }
    }),
)