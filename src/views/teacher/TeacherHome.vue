<!-- 教师管理系统主页 -->
<template>
    <el-container class="home-container">
        <!--头部区域-->
        <el-header>
            <div>
                <img src="../../assets/logo1.png" alt="">
                <span class="font">iStudy教师资源管理平台</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!--页面主题区域-->
        <el-container>
            <!--侧边栏-->
            <el-aside :width="isCollapse ? '64px':'200px'">
                <!-- 折叠侧边栏按钮 -->
                <div class="toggle-button" @click="toggleCllapse">|||</div>
                <!--侧边栏菜单区域-->
                <el-menu background-color="rgb(50,64,87)" text-color="#fff"
                active-text-color="#409EFF" unique-opened :collapse=isCollapse
                :collapse-transition="false" :router="true" :default-active="activePath">
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                        <!-- 一级菜单的模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[item.id]" id="iconFont"></i>
                            <!-- 文本 -->
                            <span>{{item.authorName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subItem.path + ''" v-for="subItem in item.children" 
                        :key="subItem.id" @click="saveNavState('/' + subItem.path)">
                            <!-- 二级菜单的模板区域 -->
                            <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>{{subItem.authorName}}</span>
                        </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!--右侧内容主题-->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data(){
        return{
            menuList:[{
                id:101,
                authorName:"信息管理",
                path:"null",
                children:[
                    {
                        id:1011,
                        authorName:"展示个人信息",
                        path:"ShowPersonInfo",
                    },
                    {
                        id:1012,
                        authorName:"修改个人信息",
                        path:"ChangePersonInfo",
                    },
                    {
                        id:1013,
                        authorName:"修改个人头像",
                        path:"UpdatePersonPic",
                    },
                    {
                        id:1014,
                        authorName:"修改密码",
                        path:"ChangePwd",
                    }
                ]
            },
            {
                id:102,
                authorName:"课程管理",
                path:"null",
                children:[
                    {
                        id:1021,
                        authorName:"查看个人全部课程",
                        path:"ShowAllCourse",
                    },
                    {
                        id:1022,
                        authorName:"创建课程",
                        path:"null",
                    },
                    {
                        id:1023,
                        authorName:"上传课程文件",
                        path:"null",
                    },
                    {
                        id:1024,
                        authorName:"创建考试",
                        path:"null",
                    }
                ]
            },
            {
                id:103,
                authorName:"试题管理",
                path:"null",
                children:[
                    {
                        id:1031,
                        authorName:"创建试卷",
                        path:"null",
                    },
                    {
                        id:1032,
                        authorName:"创建试题",
                        path:"null",
                    }
                ]
            },
            {
                id:104,
                authorName:"消息管理",
                path:"null",
                children:[
                    {
                        id:1041,
                        authorName:"查看消息",
                        path:"null",
                    }
                ]
            }],
            iconsObj:{
                '101':"el-icon-user",
                '102':"el-icon-data-analysis",
                '103':"el-icon-edit",
                '104':"el-icon-s-comment"
            },
            // 是否折叠
            isCollapse : false,
            // 激活的链接地址
            activePath : '',
        }
    },
    created(){
        this.activePath = window.sessionStorage.getItem('activePath');
    },
    methods:{
        // 待修改成跳转到老师登录界面
        logout(){
            window.sessionStorage.clear();
            this.$router.push('/TeacherLogin');
        },
        // 点击按钮,切换菜单的折叠与展开
        toggleCllapse(){
            this.isCollapse = !this.isCollapse;
        },
        // 保存链接的激活状态
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath);
            this.activePath = activePath;
        },
    }
}
</script>

<style lang="less" scoped>
.home-container{
    height: 100%;
}

.el-header{
    // header布局
    background-color: rgb(167,205,204);
    display: flex;
    justify-content: space-between;
    // 图片
    img{
        width:60px;
    }
    padding-left: 0;
    // 按钮
    align-items: center;
    // 文字
    > div{
        display: flex;
        color:#ffff;
        font-size: 20px;
        align-items: center;
    }
}

.el-aside{
    background-color: rgb(50,64,87);
    .el-menu{
        border-right:0px;
    }
}

.el-main{
    background-color: rgb(239,242,247)
;
}

#iconFont{
    margin-right: 10px;
}

.toggle-button{
    background-color: #4A5064;
    font-size: 14px;
    line-height: 24px;
    color:#fff;
    text-align:center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>