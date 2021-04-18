<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/TeacherHome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>课程管理</el-breadcrumb-item>
            <el-breadcrumb-item>查看个人全部课程</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card class="box-card">
            <!-- 搜索与添加区 -->
            <div style="margin-top: 15px;">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable @clear="getCourseList()" @input="change($event)">
                            <template #append>
                                <el-button icon="el-icon-search" @click="getCourseList()"></el-button>
                            </template>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" @click="ChangeAddDialogVisible()">创建课程</el-button>
                    </el-col>
                </el-row>
            </div>

            <!-- 用户列表区域 -->
            <el-table :data="courseList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="课程名称" prop="courseName"></el-table-column>
                <el-table-column prop="courseType" label="课程分类"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="courseLessonSum" label="课程章节数"></el-table-column>
                <el-table-column label="操作" width="190px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.courseId)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="primary" icon="el-icon-delete" size="mini" @click="removeCourseById(scope.row.courseId)"></el-button>
                        <!-- 上传资源按钮 -->
                        <el-tooltip effect="dark" content="上传课件资源" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-upload" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <!--
                    获取当前列的数据对象
                    <template slot-scope="scope">
                        {{scope.row}}
                    </template>
                -->
            </el-table>

            <!-- 分页区域 -->
            <div class="block">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1,2,5,10]"
                :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
            </div>
        </el-card>

        <!-- 创建课程的对话框 -->
        <el-dialog title="创建课程" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
            <!-- 内容主体区 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
                <el-form-item label="课程名称" prop="courseName">
                    <el-input v-model="addForm.courseName"></el-input>
                </el-form-item>
                <el-form-item label="课程分类" prop="courseType">
                    <el-input v-model="addForm.courseType"></el-input>
                </el-form-item>
                <el-form-item label="课程简介" prop="courseDes">
                    <el-input v-model="addForm.courseDes" type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="参考资料" prop="courseBook">
                    <el-input v-model="addForm.courseBook" @input="change($event)"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="RemoveAddDialogVisible()">取 消</el-button>
                    <el-button type="primary" @click="AddCourse()">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 修改课程的对话框 -->
        <el-dialog title="修改课程" :visible.sync="editDialogVisible" width="50%" @close="editDialogVisible">
            <!-- 内容主体区 -->
            <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="80px">
                <el-form-item label="课程名称">
                    <el-input v-model="editForm.courseName" disabled></el-input>
                </el-form-item>
                <el-form-item label="课程分类" prop="courseType">
                    <el-input v-model="editForm.courseType"></el-input>
                </el-form-item>
                <el-form-item label="课程简介" prop="courseDes">
                    <el-input v-model="editForm.courseDes" type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="参考资料" prop="courseBook">
                    <el-input v-model="editForm.courseBook"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogClose()">取 消</el-button>
                    <el-button type="primary" @click="EditCourse()">确 定</el-button>
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
            // 获取课程列表的参数对象
            queryInfo:{},
            courseList:[],
            total:0,
            // 控制添加课程对话框的显示与隐藏
            addDialogVisible:false,
            // 创建课程的表单数据
            addForm:{
                courseName:"操作系统",
                courseType:"cs",
                courseDes:"操作系统导论",
                courseBook:"操作系统机器",
                TeacherId:window.sessionStorage.getItem("teacherId"),
            },
            // 添加表单的验证规则对象
            addFormRules:{
                courseName:[
                    {required:true, message:'请输入课程名称', trigger:'blur'},
                    {min:1, max:30, message:'课程名称的长度在1到30个字符之间', trigger:'blur'}
                ],
                courseType:[
                    {required:true, message:'请输入课程分类', trigger:'blur'},
                    {min:1, max:30, message:'课程分类的长度在1到10个字符之间', trigger:'blur'}
                ],
                courseDes:[
                    {required:true, message:'请输入课程简介', trigger:'blur'},
                    {min:1, max:30, message:'课程简介的长度在1到100个字符之间', trigger:'blur'}
                ],
                courseBook:[
                    {required:true, message:'请输入参考资料', trigger:'blur'},
                    {min:1, max:30, message:'参考资料的长度在1到30个字符之间', trigger:'blur'}
                ],
            },
            // 控制修改课程对话框的显示与隐藏
            editDialogVisible:false,
            // 查询到的课程信息对象
            editForm:{},
        }
    },
    created: function (){
        this.queryInfo = {
                teacherId: '03232021154344',
                // window.sessionStorage.getItem('teacherId')
                query: '',
                // 当前页码
                pagenum: 1,
                pageSize: 5,
        };
        this.courseList = [];
        this.total = 0;
        // 调用查询课程方法
        this.getCourseList();
    },
    methods:{
        async getCourseList(){
            const {data : res} = await this.$http.get('/view/TeacherAllCourse',{params: this.queryInfo});
            for(let i = 0; i < res.content.length; i++){
                res.content[i].createTime = res.content[i].createTime.slice(0,10);
            }
            console.log(res);
            this.courseList = res.content;
            this.total = res.totalElements;
            // this.courseList = res.content;
            // this.total = res.totalElements;
            console.log(this.courseList.length);
            console.log(this.courseList);
            console.log('query:' +  this.queryInfo.query);
            // 强制刷新解决前端获取数据更新，界面不更新的情况
            // this.$forceUpdate();
            // console.log(this.courseList[1].courseName);
        },
        // 监听pagesize改变的事件
        handleSizeChange(newSize){
            console.log(newSize);
            this.queryInfo.pageSize = newSize;
            this.getCourseList();
        },
        // 监听页码值改变的事件
        handleCurrentChange(newPage){
            console.log(newPage);
            this.queryInfo.pagenum = newPage;
            this.getCourseList();
        },
        // 强制刷新,解决输入框输入值，但是视图无法显示，且每次只会读取最后一个输入的值的情况。
        change(e){
            this.$forceUpdate();
        },
        // 显示添加用户的对话框
        ChangeAddDialogVisible(){
            this.addDialogVisible = true;
            console.log(this.addDialogVisible);
            // this.$forceUpdate();
        },
        // 隐藏添加用户的对话框
        RemoveAddDialogVisible(){
            this.addDialogVisible = false;
            console.log(this.addDialogVisible);
            // this.$forceUpdate();
        },
        // 监听添加课程对话框的关闭事件
        addDialogClose(){
            this.$refs.addFormRef.resetFields();
        },
        // 点击按钮，添加课程
        AddCourse(){
            this.$refs.addFormRef.validate(async (valid) =>{
                if(!valid) return;
                // 发起创建课程的网络请求
                await this.$http({
                    headers: {
	                    'Content-Type': 'application/x-www-form-urlencoded'
	                },
	                method: 'post',
	                url: 'ManageCourse/createCourse',
	                data: Qs.stringify(this.addForm)
                }).then(
                    res => {
                        status = res.data.status
                        // console.log(res.data.token)
                        if(status == 0) return this.$message.error('创建课程失败！');
                        this.$message.success('创建课程成功！');
                        // 隐藏添加课程的对话框
                        this.RemoveAddDialogVisible();
                        // 重新获取课程列表数据
                        this.getCourseList();
                    }
                );
            })
        },
        // 展示修改课程的对话框
        async showEditDialog(id){
            // console.log(id)
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
            this.editForm = res;
            this.editDialogVisible = true;
        },
        // 隐藏修改课程对话框
        RemoveDialogClose(){
            this.editDialogVisible = false;
        },
        // 监听添加课程对话框的关闭事件
        editDialogClose(){
            this.$refs.editFormRef.resetFields();
            this.editDialogVisible = false;
        },
        // 点击修改按钮，修改课程
        EditCourse(){
            this.$refs.editFormRef.validate(async (valid) =>{
                if(!valid) return;
                // 发起修改课程的网络请求
                await this.$http({
                    headers: {
	                    'Content-Type': 'application/x-www-form-urlencoded'
	                },
	                method: 'post',
	                url: 'ManageCourse/modifyCourseInfo',
	                data: Qs.stringify(this.editForm)
                }).then(
                    res => {
                        status = res.data.status
                        // console.log(res)
                        if(status == 0) return this.$message.error('修改课程失败！');
                        this.$message.success('修改课程成功！');
                        // 隐藏添加课程的对话框
                        this.RemoveDialogClose();
                        // 重新获取课程列表数据
                        this.getCourseList();
                    }
                );
            })
        },
        // 根据id删除对应的课程
        async removeCourseById(id){
            console.log(id);
            // 询问是否删除改课程
            const confirmResult = await this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)

            // 如果用户确认删除，则返回值为字符串confirm
            // 如果用户取消了删除，则返回值为字符串cancel
            if(confirmResult !== 'confirm'){
                return this.$message.info('已取消删除');
            };
            
            // 调用后台删除课程接口实现删除课程功能
            // 发起删除当前课程信息的网络请求
            const {data:res} = await this.$http.get('/ManageCourse/deleteCourseInfo/',{
                params:{
                    courseId:id
                }
            });
            console.log(res);
            if(res.status == 0){
               return this.$message.error('删除课程失败！')
            }
            this.$message.success('删除课程成功！');
            this.getCourseList();
        },
    }
}
</script>

<style lang="less" scoped>

</style>