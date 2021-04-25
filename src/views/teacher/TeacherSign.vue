<!-- 教师注册页面 -->
<template>
  <div class="sign_container">
    <div class="sign_box">
        <!--logo区域-->
        <div class="avatar_box">
            <img class="logoImg" src="../../assets/logo1.png" alt="">
        </div>
        <!--界面名称区域-->
        <div class="pageName">
            <a>注册</a>
        </div>
        <!--注册表单区域-->
        <el-form ref="signFormRef" :model="signForm" :rules="signFormRules" label-width="0px" class="sign_form">
            <!--用户名-->
            <el-form-item prop="TeacherName">
                <el-input v-model="signForm.TeacherName" prefix-icon="el-icon-user"></el-input>
            </el-form-item>
            <!--大学-->
            <el-form-item prop="TeacherColleague">
                <el-input v-model="signForm.TeacherColleague" prefix-icon="el-icon-user"></el-input>
            </el-form-item>
            <!--电话-->
            <el-form-item prop="TeacherTel">
                <el-input v-model="signForm.TeacherTel" prefix-icon="el-icon-phone"></el-input>
            </el-form-item>
            <!--邮箱-->
            <el-form-item prop="TeacherEmail">
                <el-input v-model="signForm.TeacherEmail" prefix-icon="el-icon-message"></el-input>
            </el-form-item>
            <!--密码--->
            <el-form-item prop="TeacherPwd">
                <el-input v-model="signForm.TeacherPwd" prefix-icon="el-icon-lock"></el-input>
            </el-form-item>
            <!--按钮-->
            <el-form-item class="btns">
                <el-button type="primary" @click="sign">注册</el-button>
                <el-button type="success" @click="toLogin">登录</el-button>
                <el-button type="info" @click="resetSignForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import Qs from "qs";
export default {
    data(){
        var validateEmail = (rule, value, callback) => {
            var reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
            if (value === '') {
                callback(new Error('请输入注册邮箱'));
            } else {
                if (!reg.test(value)) {
                    callback(new Error('请输入正确的邮箱'));
                }
            callback();
            }
        };
        return{
            // 注册表单的数据绑定对象
            signForm:{
                TeacherName:'mikess',
                TeacherTel:'12345678910',
                TeacherEmail:'111@qq.com',
                TeacherPwd:'12345',
                TeacherColleague:'重庆邮电大学',
                TeacherVertify:'0',
            },
            // 表单的验证规则对象
            signFormRules: {
                // 验证用户名是否合法
                TeacherName: [
                    { required: true, message: '请输入注册用户名', trigger: 'blur' },
                    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                ],
                //验证电话是否合法
                TeacherTel:[
                    { required: true, message: '请输入注册电话', trigger: 'blur' },
                    { min: 11, max: 11, message: '请输入正确的电话号码', trigger: 'blur' }
                ],
                //验证邮箱是否合法
                TeacherEmail:[
                    { validator: validateEmail, trigger: 'blur' }
                ],
                //验证密码是否合法
                TeacherPwd:[
                    { required: true, message: '请输入注册密码', trigger: 'blur' },
                    { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
                ],
                // 验证大学
                TeacherColleague:[],
            }
        }
    },
    methods:{
        // 点击重置按钮，重置注册表单
        resetSignForm(){
            console.log("重置")
            this.$refs.signFormRef.resetFields()
        },
        // 跳转到登录界面
        toLogin(){
            this.$router.push("/TeacherLogin");
        },
        // 表单预验证
        sign(){
            this.$refs.signFormRef.validate(async (valid) => {
                if(!valid) return;
                await this.$http({
                    headers: {
	                    'Content-Type': 'application/x-www-form-urlencoded'
	                },
	                method: 'post',
	                url: 'register/teacher',
	                data: Qs.stringify(this.signForm)
                }).then(
                    res => {
                        status = res.data.status
                        console.log(res.data.status)
                        if(status == 0) return this.$message.error('注册电话已存在')
                        if(status == 1) return this.$message.error('注册邮箱已存在')
                        if(status == 2) this.$message.success('注册成功，用户注册id：'+ res.data.TeacherId)
                        // 显示注册成功,显示用户名,跳转到登录页
                        this.$router.push("/TeacherLogin");
                    }
                );
            })
        }
    }
}
</script>

<style lang="less" scoped>
.sign_container{
    background-image: url("../../assets/login-background.jpg");
    height: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

.sign_box{
    width:450px;
    height: 500px;
    background-color: rgba(240, 240, 245, 0.932);
    border-radius: 3px;
    position:absolute;
    left:50%;
    top:55%;
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
        top:20%;
        color:#317400;
        font:25px/14px Georgia, "Times New Roman", Times, serif;
        transform: translate(-50%);
    }
}

.sign_form{
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