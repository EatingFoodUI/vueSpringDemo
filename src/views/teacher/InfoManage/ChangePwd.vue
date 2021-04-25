<!-- 修改密码 -->
<template>
    <div>
    <!-- 教师信息区域 -->
    <el-col :span="8" offset="1">
        <el-card>
            <el-col>
                <el-form ref="signFormRef" :model="Pwdform" label-width="80px" :rules="signFormRules">
                    <el-form-item label="原密码" prop="personEnterPwd">
                        <el-input v-model="Pwdform.personEnterPwd" type="password" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="修改密码" prop="personResetPwd">
                        <el-input v-model="Pwdform.personResetPwd" type="password"></el-input>
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
    var validateOriginPwd = (rule, value, callback) => {
        if (!value) {
            return callback(new Error('密码不能为空'));
        }
        setTimeout(() => {
            if (value != this.Pwdform.personPwd) {
                callback(new Error('请输入正确的原始密码'));
            } else {
                callback();
            }
        }, 1000);
    };
    return{
            Pwdform:{
                // 存用户原密码
                personPwd:"",
                // 存用户输入的密码
                personEnterPwd:"",
                // 存用户修改的密码
                personResetPwd:"",
            },
            // 表单的验证规则对象
            signFormRules: {
                // 验证输入是否为原密码
                personEnterPwd:[
                    { validator: validateOriginPwd, trigger: 'blur' }
                ],
                //验证修改密码是否合法
                personResetPwd:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
                ],
            }
    }
},
created: function (){
    this.getPersonPwd();
},
methods:{
    // 获取用户密码
    async getPersonPwd(){
        // 发起获取教师信息的请求
        const {data:res} = await this.$http.get('/modify/getPwd/',{
                params:{
                    id:window.sessionStorage.getItem("teacherId"),
                    status:1,
                }
            });
        console.log(res);
        if(res.status == '0') return console.log('获取用户密码失败');
        // 存储数据
        this.Pwdform.personPwd = res.pwd;
        console.log('获取用户密码成功');
    },

    // 修改用户密码
    async changePersonInfo(){
        var resetpwd = {
                'status':'1',
                'pwd':this.Pwdform.personResetPwd,
                'id':window.sessionStorage.getItem("teacherId"),
            };
        this.$refs.signFormRef.validate(async (valid) =>{
                if(!valid) return;
                // 发起修改密码的请求
                await this.$http({
                    headers: {
	                    'Content-Type': 'application/x-www-form-urlencoded'
	                },
	                method: 'post',
	                url: 'modify/resetPwd',
	                data: Qs.stringify(resetpwd)
                }).then(
                    res => {
                        status = res.data
                        console.log('修改信息状态')
                        console.log(res)
                        if(status == '0') return this.$message.error('修改失败！');
                        if(status == '1') this.$message.success('修改成功！');

                        this.getPersonPwd();
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