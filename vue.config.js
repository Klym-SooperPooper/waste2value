const path = require('path')

module.exports = {
  runtimeCompiler: true,
  // publicPath:'/',
  "transpileDependencies": [
    "vuetify"
  ],

  publicPath: '',

  pluginOptions: {
    cordovaPath: 'src-cordova'
  },

  outputDir: path.resolve(__dirname, 'src-cordova', 'www'),
  assetsDir: '',
}
