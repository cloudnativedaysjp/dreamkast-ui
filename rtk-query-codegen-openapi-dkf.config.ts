import { ConfigFile } from '@rtk-query/codegen-openapi'

// 参考: https://redux-toolkit.js.org/rtk-query/usage/code-generation
const config: ConfigFile = {
  schemaFile: './schemas/swagger.yml',
  apiFile: './src/store/baseDkfApi.ts',
  apiImport: 'baseDkfApi',
  outputFile: './src/generated/dreamkast-functions-api.generated.ts',
  exportName: 'dkfApi',
  hooks: true,
  unionUndefined: true,
  tag: true,
}

export default config
