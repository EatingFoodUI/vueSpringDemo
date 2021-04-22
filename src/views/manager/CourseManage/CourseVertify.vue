<!-- 课程分类词条的增删改查 -->
<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/ManagerHome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>课程管理</el-breadcrumb-item>
            <el-breadcrumb-item>课程审核</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区 -->
        <el-card class="box-card">
            <!-- 搜索与添加区 -->
            <div style="margin-top: 10px;">
                <el-row :gutter="20">
                    <!-- 选择区 -->
                    <el-col :span="9">
                        <el-select v-model="value" clearable @change="changeCourseVertify(value)" placeholder="课程是否审核">
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
            <!-- 课程分类列表区域 -->
            <el-table :data="courseList" stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="课程名称" prop="courseName"></el-table-column>
                <el-table-column prop="courseType" label="课程分类"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="courseLessonSum" label="课程章节数"></el-table-column>
                <el-table-column label="操作" width="190px">
                    <template slot-scope="scope">
                        <!-- 审核按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showVertifyDialog(scope.row.courseId)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 审核课程的对话框 -->
        <el-dialog title="审核课程" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
            <!-- 内容主体区 -->
            <el-form :model="addForm" ref="addFormRef" label-width="80px">
                <el-form-item label="课程名称" prop="courseName">
                    <el-input v-model="addForm.courseName" disabled></el-input>
                </el-form-item>
                <el-form-item label="课程分类" prop="courseType">
                    <el-input v-model="addForm.courseType" disabled></el-input>
                </el-form-item>
                <el-form-item label="课程简介" prop="courseDes">
                    <el-input v-model="addForm.courseDes" type="textarea" disabled></el-input>
                </el-form-item>
                <el-form-item label="参考资料" prop="courseBook">
                    <el-input v-model="addForm.courseBook" @input="change($event)" disabled></el-input>
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
            // 课程分类的数据列表，默认为空
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
            // 展示审核课程对话框
            addDialogVisible:false,
            // 查询的课程信息
            addForm:{},
        }
    },
    created:function(){
        // console.log('启动create')
        this.getCourseListByVertify();
    },
    methods:{
        // 获取课程分类
        async getCourseListByVertify(){
            console.log(this.queryInfo);
            const {data:res} = await this.$http.get('/ManageCourse/ViewCourseByVertify',{
                params : this.queryInfo,
            });
            if(res.status == 0){
                    return this.$message.error('获取课程失败');
            }
            for(let i = 0; i < res.content.length; i++){
                res.content[i].createTime = res.content[i].createTime.slice(0,10);
            }
            // 把数据列表赋值
            console.log(res);
            this.courseList = res.content;
            this.total = res.totalElements;
            // console.log(this.courseTypeList);
            // console.log(this.total);
        },
        // 下拉搜索框展示课程分类
        changeCourseVertify(Verity){
           // console.log("下拉搜索框展示课程分类:当前搜索分类等级：" + val);
            this.queryInfo.Vertify = Verity;
            // 重新获取课程分类
            this.getCourseListByVertify();
        },
        // 展示审核课程对话框
        async showVertifyDialog(id){
            // 发起查询当前课程信息的网络请求
            const {data:res} = await this.$http.get('/viewCourse/viewCourseInfo/',{
                params:{
                    courseId:id
                }
            });
            console.log(res);
            if(res.courseId != id){
               return this.$message.error('查询课程信息失败！')
            }
            this.addForm = res;
            this.addDialogVisible = true;
        },
        // 关闭审核课程对话框
        addDialogClose(){
            this.addDialogVisible = false;
        },
        // 审核课程
        async VertifyCourse(){
            console.log(this.addForm)
            const {data : res} = await this.$http.get('/ManageCourse/VertityCourseById',{
                params: {
                    "CourseId":this.addForm.courseId,
                }
            });
            console.log(res);
            if(res == 0 && res == 1){
               return this.$message.error('审核课程失败！')
            }
            this.$message.success('审核课程成功！');
            this.addDialogClose();
            this.getCourseListByVertify();
        }
    }
}

</script>

<style lang="less" scoped>

</style>