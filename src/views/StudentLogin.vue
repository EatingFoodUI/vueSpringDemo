<template>
  <div class="login_container">
    <div class="login_box">
        <!--logo区域-->
        <div class="avatar_box">
            <img class="logoImg" src="../assets/logo1.png" alt="">
        </div>
        <!--界面名称区域-->
        <div class="pageName">
            <a>登录</a>
        </div>
        <!--登录表单区域-->
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
            <!--账号-->
            <el-form-item prop="StudentId">
                <el-input v-model="loginForm.StudentId" prefix-icon="el-icon-user"></el-input>
            </el-form-item>
            <!--密码-->
            <el-form-item prop="StudentPwd">
                <el-input v-model="loginForm.StudentPwd" prefix-icon="el-icon-lock" type="StudentPwd"></el-input>
            </el-form-item>
            <!--按钮-->
            <el-form-item class="btns">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="success" @click="toSign">注册</el-button>
                <el-button type="info" @click="resetLoginForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import Qs from "qs";
export default {
    data(){
        return{
            // 登录表单的数据绑定对象
            loginForm:{
                StudentId:'03232021154344',
                StudentPwd:'12345'
            },
            // 表单的验证规则对象
            loginFormRules: {
                // 验证账号是否合法
                StudentId: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                ],
                //验证密码是否合法
                StudentPwd:[
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        // 点击重置按钮，重置登录表单
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields()
        },
        // 表单预校验
        login(){
            this.$refs.loginFormRef.validate(async (valid) => {
                if(!valid) return;
                await this.$http({
                    headers: {
	                    'Content-Type': 'application/x-www-form-urlencoded'
	                },
	                method: 'post',
	                url: 'login/Student',
	                data: Qs.stringify(this.loginForm)
                }).then(
                    res => {

                        // 1. 保存token,保存到客户端的sessionStorage中
                        status = res.data.status
                        // console.log(res.data.token)
                        if(status == 0) return this.$message.error('用户不存在')
                        if(status == 1) return this.$message.error('密码错误')
                        if(status == 2) this.$message.success('登录成功')
                        window.sessionStorage.setItem("token",res.data.token);
                        window.sessionStorage.setItem("teacherId", this.loginForm.StudentId);
                        this.$router.push("/StudentHome");
                    }
                );
            });
        },
        toSign(){
            this.$router.push("/StudentSign");
        }
    }
};
</script>

<style lang="less" scoped>
.login_container{
    background-image: url("../assets/login-background.jpg");
    height: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
.login_box{
    width:450px;
    height: 300px;
    background-color: rgba(240, 240, 245, 0.932);
    border-radius: 3px;
    position:absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);

    .avatar_box{
        height: 160px;
        width: 160px;
        position: absolute;
        left:50%;
        transform: translate(-50%,-50%);
        img{
            height: 100%;
            width: 100%;
        }
    }

    .pageName{
        position: absolute;
        left:50%;
        top:25%;
        color:#317400;
        font:25px/14px Georgia, "Times New Roman", Times, serif;
        transform: translate(-50%);
    }
}

.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

.btns {
    display: flex;
    justify-content: flex-end;
}
</style>