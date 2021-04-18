import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'

// import axios from './axios/axiosIndex'
// Vue.prototype.$http = axios

// 配置请求的根路径
import axios from 'axios'
axios.defaults.baseURL = "http://localhost:8888";
// 配置请求拦截器,为已登录用户的每个请求添加token
axios.interceptors.request.use(config => {
    console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')