import { spawn } from 'child_process'

const seedFiles = [
  'prisma/seed-frontend.ts',
  'prisma/seed-backend.ts',
  'prisma/seed-devops.ts',
  'prisma/seed-fullstack.ts',
  'prisma/seed-dsa.ts',
]

function runSeed(file: string) {
  return new Promise<void>((resolve, reject) => {
    const proc = spawn('tsx', [file], { stdio: 'inherit' })
    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Seeding failed for ${file}`))
      } else {
        resolve()
      }
    })
  })
}

async function main() {
  for (const file of seedFiles) {
    console.log(`\n▶ Running ${file}`)
    await runSeed(file)
  }
  console.log('\n✅ All seed files executed successfully')
}

main().catch((err) => {
  console.error('\n❌ Error seeding database:', err)
  process.exit(1)
})
