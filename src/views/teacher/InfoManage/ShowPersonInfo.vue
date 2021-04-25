<!-- 展示个人信息 -->
<template>
<!-- 主体区域 -->
<el-row>
    <el-col :span="10" offset="2">
        <el-card :body-style="{ padding: '10px' }">
            <el-avatar :size="200" :src="circleUrl"></el-avatar>
            <div style="padding: 14px;">
            <div class="bottom">
                <el-button type="text" class="button" @click="changePit">修改头像</el-button>
            </div>
            </div>
        </el-card>
    </el-col>

    <!-- 教师信息区域 -->
    <el-col :span="8" offset="12">
        <el-card>
            <el-col :span="20">
                <el-form label-width="70px">
                    <el-form-item label="教师姓名">
                        <el-input v-model="TeacherInfo.teacherName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="教师高校">
                        <el-input v-model="TeacherInfo.teacherColleague" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话">
                        <el-input v-model="TeacherInfo.teacherTel" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮件">
                        <el-input v-model="TeacherInfo.teacherEmail" disabled></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <div class="bottom">
                <el-button type="text" class="button" @click="changePersonInfo">修改信息</el-button>
            </div>
        </el-card>
    </el-col>
</el-row>
</template>

<script>
export default {
    data(){
        return{
            // 存储教师信息
            TeacherInfo:{},
            // 默认图片
            circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            // 头像基本url
            baseUrl:"http://localhost:8888/PersonPit/",
        }
    },
    created: function (){
        // 获取教师信息
        this.getTeacherInfo();

        // 获取头像
        this.getPersonPic();
    },
    mounted: function() {
        console.log("mounted....")
    },
methods:{
    // 获取教师信息
    async getTeacherInfo(){
        console.log('1');
        // 发起获取教师信息的请求
        const {data:res} = await this.$http.get('/view/TeacherInfo/',{
                params:{
                    teacherId:window.sessionStorage.getItem("teacherId"),
                }
            });
        console.log(res);
        // 存储数据
        this.TeacherInfo = res;
    },
    // 获取头像
    async getPersonPic(){
        console.log('1');
        // 发起获取教师信息的请求
        const {data:res} = await this.$http.get('/modify/getAccountPit/',{
                params:{
                    status:1,
                    id:window.sessionStorage.getItem('teacherId'),
                }
            });
        console.log("获取头像")
        console.log(res);
        if(res.status == '1') return console.log('使用默认头像');
        // 修改为当前用户的头像
        if(res.status == '2') this.circleUrl = this.baseUrl + res.pitAddr;
        forceUpdate();
    },
    // 修改头像
    changePit(){
        // 跳转到修改头像信息页
        this.$router.push("/UpdatePersonPic");
    },
    // 修改用户信息
    changePersonInfo(){
        // 跳转到修改用户信息页
        this.$router.push("/ChangePersonInfo");
    },
}
}
</script>

<style lang='less' scoped>
</style>