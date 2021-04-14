import Vue from 'vue'
import VueRouter from 'vue-router'
import StudentLogin from '../views/StudentLogin.vue'
import StudentHome from '../views/StudentHome.vue'
Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        { path: '/StudentLogin', component: StudentLogin },
        { path: '/StudentHome', component: StudentHome }
    ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/StudentLogin') return next();
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('StudentLogin');
    next();
})

export default router



/*
const routes = [{
    path: '/StudentLogin',
    componet: Login
}, {
    path: '/',
    redirect: '/StudentLogin'
}]

const router = new VueRouter({
    routes
})

export default router
*/