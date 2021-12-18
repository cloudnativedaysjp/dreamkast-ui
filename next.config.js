const { withSentryConfig } = require('@sentry/nextjs');

const moduleExports = {
  basePath: '/cndt2021/ui',
  assetPrefix: '/cndt2021/ui',
  publicRuntimeConfig: {
    basePath: '/cndt2021/ui',
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
