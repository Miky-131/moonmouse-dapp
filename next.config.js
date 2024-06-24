const nextBuildId = require('next-build-id')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
const withGlobalCssConfig = require('next-global-css').withGlobalCss()

const moduleExports = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,

  productionBrowserSourceMaps: false,

  generateBuildId: () => nextBuildId({ dir: __dirname }),
}

module.exports = withBundleAnalyzer(withGlobalCssConfig(moduleExports))
