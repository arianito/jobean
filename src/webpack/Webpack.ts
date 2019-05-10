const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

export type WebpackConfig = {
	entries: {[key:string]:Array<string>}
	devTool?: string
	sharedStyle?: string
	stylesPath?: Array<string>
	typescriptLoaders?: Array<string>
	publicPath?: string
	publicUri?: string
	externals?: {[key:string]:string}
}

export class Webpack {

	static gzipMiddleware = (app: any) => {
		app.get(/(\.js)(\?.+)?$/, function (req, res, next) {
			const spl = req.url.split('?');
			req.url = spl.join('.gz?');
			res.set('Content-Encoding', 'gzip');
			next();
		});
	};
	static devMiddleware = (app: any, config: any) =>{
		if (process.env.NODE_ENV === 'development') {
			const webpack = require('webpack');
			const compiler = webpack(config);
			app.use(require('webpack-dev-middleware')(compiler, {
				noInfo: true,
				publicPath: config.output.publicPath
			}));
			app.use(require('webpack-hot-middleware')(compiler, {
				log: console.log,
				path: '/__webpackhmr',
				heartbeat: 5 * 1000
			}));
		}
	};

	static config = (options: WebpackConfig) => {
		options = {
			devTool: 'sourcemap',
			publicPath: 'dist/',
			publicUri: '/dist/',
			sharedStyle: '',
			externals: {},
			typescriptLoaders: [],
			stylesPath:[],
			...options
		};
		return {
			mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
			devtool: options.devTool,
			target: 'web',
			entry: Object.keys(options.entries).reduce((acc, key)=>{
				return {
					...acc,
					[key]: [
						...(process.env.NODE_ENV === 'development' ? [
							"react-hot-loader/patch",
							"webpack-hot-middleware/client?path=/__webpackhmr&timeout=20000&reload=true",
						] : []),
						...options.entries[key],
					]
				}
			}, {}),
			output: {
				filename: '[name].js',
				chunkFilename: '[name].bundle.js',
				path: options.publicPath,
				publicPath: options.publicUri,
				...(process.env.NODE_ENV === 'development' ? {
					hotUpdateChunkFilename: 'hot/hot-update.js',
					hotUpdateMainFilename: 'hot/hot-update.json'
				} : {})
			},
			node: {
				fs: "empty"
			},
			resolve: {
				extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
				plugins: [new TsconfigPathsPlugin({})]
			},
			externals: process.env.NODE_ENV !== 'production' ? {} : options.externals,
			module: {
				rules: [
					{
						test: /\.tsx?$/,
						use: [
							'awesome-typescript-loader',
							...options.typescriptLoaders
						],
					},
					{
						test: /\.(woff|woff2|eot|ttf|jpg|jpeg|gif|png|svg)$/,
						exclude: /node_modules/,
						loader: 'url-loader?limit=1024&name=[sha512:hash:base64:16].[ext]',
					},
					{
						test: /\.(sass|scss|css)$/,
						exclude: /node_modules/,
						use: [
							(process.env.NODE_ENV === 'development') ? 'style-loader' : MiniCssExtractPlugin.loader,
							'css-loader',
							'postcss-loader',
							{
								loader: 'sass-loader',
								options: {
									data: options.sharedStyle,
									includePaths: options.stylesPath,
								},
							}
						],
					},
				]
			},
			plugins: process.env.NODE_ENV === 'development' ? [
				new webpack.HotModuleReplacementPlugin()
			] : [
				new TerserPlugin({
					parallel: true,
					terserOptions: {
						ecma: 6,
					},
				}),
				new CompressionPlugin({
					test: /(\.js)$/,
					deleteOriginalAssets: true
				}),
				new OptimizeCSSAssetsPlugin(),
				new MiniCssExtractPlugin({
					filename: '[name].css',
					chunkFilename: '[key].css',
				})
			],
		};

	}
}
