import Vue from 'vue'
import VueRouter from 'vue-router'
import StudentLogin from '../views/StudentLogin.vue'
import StudentHome from '../views/StudentHome.vue'
import StudentSign from '../views/StudentSign.vue'
// Teacher
import TeacherHome from '../views/teacher/TeacherHome.vue'
import TeacherWelcom from '../views/teacher/TeacherWelcom.vue'
import ShowAllCourse from '../views/teacher/courseManage/ShowAllCourse.vue'
Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        { path: '/StudentLogin', component: StudentLogin },
        { path: '/StudentHome', component: StudentHome },
        { path: '/StudentSign', component: StudentSign },
        // Teacher
        {
            path: '/TeacherHome',
            component: TeacherHome,
            redirect: '/TeacherWelcom',
            children: [
                { path: '/TeacherWelcom', component: TeacherWelcom },
                { path: '/ShowAllCourse', component: ShowAllCourse },
            ]
        },
    ]
})

// 挂载路由导航守卫
// 开发时注释掉
/*
router.beforeEach((to, from, next) => {
    if (to.path === '/StudentLogin') return next();
    if (to.path === '/StudentSign') return next();
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('StudentLogin');
    next();
})*/

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