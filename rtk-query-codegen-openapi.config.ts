import { ConfigFile } from '@rtk-query/codegen-openapi'

// 参考: https://redux-toolkit.js.org/rtk-query/usage/code-generation
const config: ConfigFile = {
  schemaFile: './schemas/swagger.yml',
  apiFile: './src/store/baseApi.ts',
  apiImport: 'baseApi',
  outputFile: './src/generated/dreamkast-api.generated.ts',
  exportName: 'dreamkastApi',
  hooks: true,
  unionUndefined: true,
  tag: true,
}

export default config
