// 管理axios的全局配置和拦截器封装

// 1. 引入
import axios from "axios";
import qs from 'qs'

// 2. 创建实例
axios.defaults.baseURL = 'http://localhost:8888/'

// 3. 配置信息
let config = {
    // 每次请求的协议、IP地址。  设置该配置后，每次请求路径都可以使用相对路径，例如"/admin/login"
    // 请求超时时间
    timeout: 10000,
    // 每次请求携带cookie
    withCredentials: true,
    // 全局设置 POST请求为Form Data格式
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset-UTF-8' }
}

// 请求拦截器
axios.interceptors.response.use(
    config => {
        config.data = qs.stringify(config.data) // 转为 formdata 数据格式
        return config
    },
    error => Promise.error(error)
)

// 4. 导出
export default axios