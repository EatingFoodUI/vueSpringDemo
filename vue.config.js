// 配置跨域
// 无效，使用后台跨域方法
module.exports = {
    devServer: {
        port: 8080, // 源地址端口，自行修改
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8888/', // 跨域目标主机，自行修改
                ws: true, // 代理 websockets
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/' // 重写地址
                }
            },
        }
    }
}