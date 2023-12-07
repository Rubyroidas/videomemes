const path = require('path');

module.exports = ({WEBPACK_SERVE, WEBPACK_BUILD, WEBPACK_BUNDLE, ...restEnv}) => {
    // console.log('restEnv', restEnv);
    return {
        mode: WEBPACK_BUILD ? 'production' : 'development',
        entry: path.resolve(__dirname, 'src/index.tsx'),
        output: {
            clean: true,
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        stats: false,
        module: {
            rules: [
                {
                    test: /\.tsx?$/i,
                    use: 'ts-loader',
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
            ],
        },
        plugins: [
            // TODO
        ],
        devServer: {
            open: true,
            port: 6706,
            static: path.resolve(__dirname, 'public'),
        },
    };
}