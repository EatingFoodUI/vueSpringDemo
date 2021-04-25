<!-- 修改个人信息 -->
<template>
    <div>
    <!-- 教师信息区域 -->
    <el-col :span="8" offset="1">
        <el-card>
            <el-col>
                <el-form ref="signFormRef" :model="TeacherInfo" label-width="80px" :rules="signFormRules">
                    <el-form-item label="教师姓名" prop="teacherName">
                        <el-input v-model="TeacherInfo.teacherName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="教师高校" prop="teacherColleague">
                        <el-input v-model="TeacherInfo.teacherColleague"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="teacherTel">
                        <el-input v-model="TeacherInfo.teacherTel"></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮件" prop="teacherEmail">
                        <el-input v-model="TeacherInfo.teacherEmail"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-button type="primary" class="button" @click="changePersonInfo">修改信息</el-button>
        </el-card>
    </el-col>
    </div>
</template>
<script>
import Qs from "qs";
export default {
data(){
    var validateEmail = (rule, value, callback) => {
    var reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
        if (value === '') {
            callback(new Error('请输入邮箱'));
        } else {
            if (!reg.test(value)) {
                callback(new Error('请输入正确的邮箱'));
            }
        callback();
        }
    };
    return{
            // 存储教师信息
            TeacherInfo:{},
            // 表单的验证规则对象
            signFormRules: {
                // 验证用户名是否合法
                teacherName: [
                    { required: true, message: '请输入注册用户名', trigger: 'blur' },
                    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                ],
                //验证电话是否合法
                teacherTel:[
                    { required: true, message: '请输入电话', trigger: 'blur' },
                    { min: 11, max: 11, message: '请输入正确的电话号码', trigger: 'blur' }
                ],
                //验证邮箱是否合法
                teacherEmail:[
                    { validator: validateEmail, trigger: 'blur' }
                ],
                //验证密码是否合法
                teacherPwd:[
                    { required: true, message: '请输入注册密码', trigger: 'blur' },
                    { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
                ],
                // 验证大学
                TeacherColleague:[],
            }
    }
},
created: function (){
    // 获取教师信息
    this.getInfo();
},
methods:{
    // 获取教师信息
    async getInfo(){
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
    // 修改用户信息
    async changePersonInfo(){
            var TeacherInfoNew = {
                'status':'2',
                'tel':this.TeacherInfo.teacherTel,
                'email':this.TeacherInfo.teacherEmail,
                'colleague':this.TeacherInfo.teacherColleague,
                'id':this.TeacherInfo.teacherId,
            }
            this.$refs.signFormRef.validate(async (valid) =>{
                if(!valid) return;
                // 发起修改教师信息的请求
                await this.$http({
                    headers: {
	                    'Content-Type': 'application/x-www-form-urlencoded'
	                },
	                method: 'post',
	                url: 'modify/modifyPersonInfo',
	                data: Qs.stringify(TeacherInfoNew)
                }).then(
                    res => {
                        status = res
                        console.log('修改信息状态')
                        console.log(res)
                        if(status == '0') return this.$message.error('电话已存在！');
                        if(status == '1') return this.$message.error('邮箱已存在！');
                        this.$message.success('修改信息成功！');
                        // 重新获取课程列表数据
                        this.getInfo();
                    }
                );
            })
    },
}
}
</script>
<style lang='less' scoped>
/*.button{
    position: relative;
    top: 20px;
    left: 275px;
}*/
</style>