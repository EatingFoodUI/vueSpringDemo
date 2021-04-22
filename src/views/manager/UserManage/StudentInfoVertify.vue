<!-- 学生信息审核 -->
<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/ManagerHome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>学生信息审核</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区 -->
        <el-card class="box-card">
            <!-- 搜索区 -->
            <div style="margin-top: 10px;">
                <el-row :gutter="20">
                    <!-- 选择区 -->
                    <el-col :span="9">
                        <el-select v-model="value" @change="changeCourseVertify(value)" placeholder="学生信息">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </div>

            <!-- 表格 -->
            <!-- 学生信息列表区域 -->
            <el-table :data="courseList" stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="studentId" label="学生用户账号"></el-table-column>
                <el-table-column prop="studentName" label="学生姓名"></el-table-column>
                <el-table-column prop="studentTel" label="联系电话"></el-table-column>
                <el-table-column prop="studentEmail" label="电子邮件"></el-table-column>
                <el-table-column prop="studentPwd" label="登录密码"></el-table-column>
                <el-table-column label="操作" width="190px">
                    <template slot-scope="scope">
                        <!-- 审核按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showVertifyDialog(scope.row.studentId)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 审核学生信息的对话框 -->
        <el-dialog title="审核注册信息" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
            <!-- 内容主体区 -->
            <el-form :model="addForm" ref="addFormRef" label-width="80px">
                <el-form-item label="学生账号" prop="studentId">
                    <el-input v-model="addForm.studentId" disabled></el-input>
                </el-form-item>
                <el-form-item label="学生姓名" prop="studentName">
                    <el-input v-model="addForm.studentName" disabled></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="studentTel">
                    <el-input v-model="addForm.studentTel" type="textarea" disabled></el-input>
                </el-form-item>
                <el-form-item label="电子邮件" prop="studentEmail">
                    <el-input v-model="addForm.studentEmail" disabled></el-input>
                </el-form-item>
                <el-form-item label="登录密码" prop="studentPwd">
                    <el-input v-model="addForm.studentPwd" disabled></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogClose()">取 消</el-button>
                    <el-button type="primary" @click="VertifyCourse()">审核通过</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import Qs from "qs";
export default {
    data(){
        return{
            // 查询条件
            queryInfo:{
                Vertify:"0",
                pagenum:1,
                pageSize:5,
            },
            // 学生信息的数据列表，默认为空
            courseList:[],
            // 总数据条数
            total:0,
            // 搜索框数据
            options: [{
                value: "1",
                label: '已审核'
            },{
                value: "0",
                label: '未审核'
            }],
            value: '',
            // 展示审核学生信息对话框
            addDialogVisible:false,
            // 查询的审核学生信息
            addForm:{},
        }
    },
    created:function(){
        // console.log('启动create')
        this.getCourseListByVertify();
    },
    methods:{
        // 获取审核学生信息
        async getCourseListByVertify(){
            console.log(this.queryInfo);
            const {data:res} = await this.$http.get('/Vertify/ViewStudentByVertify',{
                params : this.queryInfo,
            });
            if(res.status == 0){
                    return this.$message.error('获取学生信息失败');
            }
            // 把数据列表赋值
            console.log(res);
            this.courseList = res.content;
            this.total = res.totalElements;
            // console.log(this.courseTypeList);
            // console.log(this.total);
        },
        // 下拉搜索框展示学生审核信息
        changeCourseVertify(Verity){
           // console.log("下拉搜索框展示课程分类:当前搜索分类等级：" + val);
            this.queryInfo.Vertify = Verity;
            // 重新获取课程分类
            this.getCourseListByVertify();
        },
        // 展示学生审核信息对话框
        async showVertifyDialog(id){
            // 发起查询当前课程信息的网络请求
            const {data:res} = await this.$http.get('/view/StudentInfo/',{
                params:{
                    studentId:id
                }
            });
            console.log(res);
            if(res.studentId != id){
               return this.$message.error('查询学生信息失败！')
            }
            this.addForm = res;
            this.addDialogVisible = true;
        },
        // 关闭审核课程对话框
        addDialogClose(){
            this.addDialogVisible = false;
        },
        // 审核学生信息
        async VertifyCourse(){
            // console.log('审核学生信息')
            // console.log(this.addForm)
            const {data : res} = await this.$http.get('/Vertify/VertityStudentById',{
                params: {
                    "studentId":this.addForm.studentId,
                }
            });
            console.log(res);
            if(res == 0 && res == 1){
               return this.$message.error('审核学生信息失败！')
            }
            this.$message.success('审核学生信息成功！');
            this.addDialogClose();
            this.getCourseListByVertify();
        }
    }
}

</script>

<style lang="less" scoped>

</style>