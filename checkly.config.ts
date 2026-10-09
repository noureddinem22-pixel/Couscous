import { defineConfig } from 'checkly'

export default defineConfig({
  projectName: 'DZ AI PRO',
  logicalId: 'dz-ai-pro',
  checks: {
    locations: ['eu-west-3', 'eu-central-1'],
    checkMatch: '**/*.check.ts',
    browserChecks: { testMatch: '**/*.spec.ts' },
  },
})
