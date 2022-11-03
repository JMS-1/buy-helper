const path = require('path')

/** Zum Kopieren von statischen Inhalten in das Bundle. */
const copyStatic = require('copy-webpack-plugin')

/** Die dann hier zu finden sind. */
const publicFolder = path.join(__dirname, 'public')

/** Zum Extrahieren eines CSS Stylesheets in das Bundle. */
const extractCss = require('mini-css-extract-plugin')

/** Nachladen bei Änderungen. */
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ReactRefreshTypeScript = require('react-refresh-typescript')

/** Variablen setzen. */
const { DefinePlugin } = require('webpack')

module.exports = (env) => ({
    /** Source Maps für das Debuggen mit Breakpoints aktivieren. */
    devtool: 'source-map',

    /** Hier wird nur ein Einstieg in die Anwendung verwendet - dynamische (Lazy) Komponenten können Chunks erzeugen. */
    entry: { prices: path.join(__dirname, './src/index.tsx') },

    ignoreWarnings: [/Failed to parse source map/],

    /** Man beachte, dass --env in der package.json explizit gesetzt wird. */
    mode: env.production ? 'production' : 'development',

    /** Die unterstützten Dateitypen. */
    module: {
        rules: [
            /** Debuggen der Bibliotheken. */
            {
                enforce: 'pre',
                test: /\.js$/,
                use: ['source-map-loader'],
            } /** Code Dateien (Typescript). */,
            {
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: require.resolve('ts-loader'),
                        options: {
                            getCustomTransformers: () => ({
                                before: [!env.production && ReactRefreshTypeScript()].filter(Boolean),
                            }),
                        },
                    },
                ],
            },
            /** Styling. */
            {
                test: /\.s?css$/,
                use: [
                    { loader: extractCss.loader },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: { auto: true, localIdentName: '[local]-[hash:base64:5]' },
                            sourceMap: false,
                            url: false,
                        },
                    },
                    'sass-loader',
                ],
            },
            /** Assets. */
            {
                test: /\.svg$/,
                use: [{ loader: 'svg-inline-loader', options: {} }],
            },
        ],
    },

    /** Gewisse Minimierungen zur besseren Unterstüzung der GraphQL Hilfsbibliothek deaktivieren. */
    optimization: {
        minimizer: [
            (compiler) => {
                const TerserPlugin = require('terser-webpack-plugin')

                const terserPlugin = new TerserPlugin({
                    terserOptions: { keep_classnames: true, keep_fnames: true },
                })

                terserPlugin.apply(compiler)
            },
        ],
    },

    /** Standardausgabe für die Bundledateien. */
    output: { filename: '[name].js', path: path.join(__dirname, 'build') },

    /** Wir sind etwas entspannter was die Größe der Assets angeht. */
    performance: { maxAssetSize: 4000000, maxEntrypointSize: 4000000 },

    /** Kopieren statischer Dateien und Extraktion des Stylings - separat für alle Chunks.  */
    plugins: [
        new copyStatic({ patterns: [{ from: publicFolder }] }),
        new extractCss({ filename: 'prices.css', ignoreOrder: true }),
        new DefinePlugin({ __API__: !env.production ? '"https://mobile.psimarron.net/BuyIt/"' : '""' }),
        !env.production && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),

    /** Aktuell unterstützte Quelldateiarten. */
    resolve: { extensions: ['.ts', '.tsx', '.scss', '.js', '.css', '.svg'] },
})
