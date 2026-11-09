import { cloudflareTest } from '@cloudflare/vitest-plugin'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    cloudflareTest({
      singleWorker: true,
      isolatedStorage: false,
      wrangler: { configPath: './wrangler.toml' },
    }),
  ],
  test: {
    include: ['worker/**/*.spec.ts'],
  },
})
