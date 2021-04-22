<!-- 课程分类词条的增删改查 -->
<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/TeacherHome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>课程管理</el-breadcrumb-item>
            <el-breadcrumb-item>课程分类词条</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区 -->
        <el-card class="box-card">
            <!-- 搜索与添加区 -->
            <div style="margin-top: 10px;">
                <el-row :gutter="20">
                    <!-- 选择区 -->
                    <el-col :span="9">
                        <el-select v-model="value" clearable @change="changeCourseType(value)" placeholder="课程分类等级">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <!-- 添加区 -->
                    <el-col :span="4">
                        <el-button type="primary" @click="ChangeAddDialogVisible()">创建分类</el-button>
                    </el-col>
                </el-row>
            </div>

            <!-- 表格 -->
            <!-- 课程分类列表区域 -->
            <el-table :data="courseTypeList" stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="分类id" prop="courseTypeId"></el-table-column>
                <el-table-column label="分类名称" prop="courseTypeName"></el-table-column>
                <el-table-column label="分类父id" prop="courseTypePid"></el-table-column>
                <el-table-column label="分类当前层级" prop="courseTypeLevel"></el-table-column>
                <el-table-column label="操作" width="190px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.courseTypeId)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="primary" icon="el-icon-delete" size="mini" @click="removeCourseTypeById(scope.row.courseTypeId)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
        </el-card>

        <!-- 创建课程的对话框 -->
        <el-dialog title="创建课程分类词条" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
            <!-- 内容主体区 -->
            <el-form :model="addForm" ref="addFormRef" label-width="80px">
                <el-form-item label="分类名称" prop="CourseTypeName">
                    <el-input v-model="addForm.CourseTypeName"></el-input>
                </el-form-item>
                <el-form-item label="分类父id" prop="CourseTypePid">
                    <el-input v-model="addForm.CourseTypePid"></el-input>
                </el-form-item>
                <el-form-item label="分类当前层级" prop="CourseTypeLevel">
                    <el-input v-model="addForm.CourseTypeLevel" disabled></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="RemoveAddDialogVisible()">取 消</el-button>
                    <el-button type="primary" @click="AddCourseType()">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 修改课程分类词条的对话框 -->
        <el-dialog title="修改课程分类词条" :visible.sync="editDialogVisible" width="50%" @close="editDialogVisible">
            <!-- 内容主体区 -->
            <el-form :model="editForm" ref="editFormRef" label-width="80px">
                <el-form-item label="分类名称" prop="courseTypeName">
                    <el-input v-model="editForm.courseTypeName"></el-input>
                </el-form-item>
                <el-form-item label="分类父id" prop="courseTypePid" disabled>
                    <el-input v-model="editForm.courseTypePid" disabled></el-input>
                </el-form-item>
                <el-form-item label="分类当前层级" prop="courseTypeLevel">
                    <el-input v-model="editForm.courseTypeLevel" disabled></el-input>
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
            // 查询条件
            queryInfo:{
                courseTypeLevel:3,
                pageNum:1,
                pagesize:5,
            },
            // 课程分类的数据列表，默认为空
            courseTypeList:[],
            // 总数据条数
            total:0,
            // 搜索框数据
            options: [{
                value: 1,
                label: '一级分类'
            },{
                value: 2,
                label: '二级分类'
            },{
                value: 3,
                label: '三级分类'
            }],
            value: '',
            // 控制修改课程分类对话框的显示与隐藏
            editDialogVisible:false,
            // 当前修改的课程分类的信息
            editForm:{},
            // 控制添加课程分类对话框的显示与隐藏
            addDialogVisible:false,
            // 当前添加的课程分类的信息
            addForm:{CourseTypeLevel:3},
        }
    },
    created:function(){
        // console.log('启动create')
        this.getCourseTypeList();
    },
    methods:{
        // 获取课程分类
        async getCourseTypeList(){
            console.log(this.queryInfo);
            const {data:res} = await this.$http.get('/ManageCourseType/viewCourseTypeByLevel',{
                params : this.queryInfo,
            });
            if(res.status == 0){
                    return this.$message.error('获取课程分类失败');
            }
            // 把数据列表赋值
            console.log(res);
            this.courseTypeList = res.content;
            this.total = res.totalElements;
            // console.log(this.courseTypeList);
            // console.log(this.total);
        },
        // 下拉搜索框展示课程分类
        changeCourseType(val){
            // console.log("下拉搜索框展示课程分类:当前搜索分类等级：" + val);
            this.queryInfo.courseTypeLevel = val;
            // 重新获取课程分类
            this.getCourseTypeList();
        },
        // 显示添加课程分类表的对话框
        ChangeAddDialogVisible(){
            this.addDialogVisible = true;
            console.log(this.addDialogVisible);
            // this.$forceUpdate();
        },
        // 隐藏添加课程分类表的对话框
        RemoveAddDialogVisible(){
            this.addDialogVisible = false;
            console.log(this.addDialogVisible);
            // this.$forceUpdate();
        },
        // 监听添加课程分类表的关闭事件
        addDialogClose(){
            this.$refs.addFormRef.resetFields();
        },
        // 点击按钮，添加课程
        AddCourseType(){
            this.$refs.addFormRef.validate(async (valid) =>{
                if(!valid) return;
                // 发起创建课程的网络请求
                await this.$http({
                    headers: {
	                    'Content-Type': 'application/x-www-form-urlencoded'
	                },
	                method: 'post',
	                url: 'ManageCourseType/addCourseType',
	                data: Qs.stringify(this.addForm)
                }).then(
                    res => {
                        console.log(res.data)
                        status = res.data.status
                        console.log(status)
                        // console.log(res.data.token)
                        if(status === 2) return this.$message.error('已经有相同名字的课程分类！');
                        if(status === 0) return this.$message.error('创建课程分类词条失败！');
                        this.$message.success('创建课程分类词条成功！');
                        // 隐藏添加课程的对话框
                        this.RemoveAddDialogVisible();
                        // 重新获取课程列表数据
                        this.getCourseTypeList();
                    }
                );
            })
        },
        // 展示修改课程分类信息的对话框
        async showEditDialog(id){
            const {data:res} = await this.$http.get('/ManageCourseType/viewCourseTypeById',{
                    params:{
                        'courseTypeId':id
                }
            });
            if(res.status == 0){
                    return this.$message.error('获取当前课程分类信息失败');
            }
            this.editForm = res;
            this.editDialogVisible = true;
        },
        // 隐藏修改课程分类信息对话框
        RemoveDialogClose(){
            this.editDialogVisible = false;
        },
        // 修改课程分类信息
        EditCourse(){
            this.$refs.editFormRef.validate(async (valid) =>{
                if(!valid) return;
                // 发起修改课程的网络请求
                await this.$http({
                    headers: {
	                    'Content-Type': 'application/x-www-form-urlencoded'
	                },
	                method: 'post',
	                url: 'ManageCourseType/editCourseTypeById',
	                data: Qs.stringify(this.editForm)
                }).then(
                    res => {
                        status = res.data.status
                        // console.log(res)
                        if(status == 0) return this.$message.error('修改课程分类失败！');
                        this.$message.success('修改课程分类成功！');
                        // 隐藏添加课程的对话框
                        this.RemoveDialogClose();
                        // 重新获取课程列表数据
                        this.getCourseTypeList();
                    }
                );
            })
        },
        // 根据id删除对应的课程分类
        async removeCourseTypeById(id){
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
            const {data:res} = await this.$http.get('/ManageCourseType/deleteCourseTypeById',{
                params:{
                    courseTypeId:id
                }
            });
            console.log(res);
            if(res == 0){
               return this.$message.error('删除课程分类失败！')
            }
            this.$message.success('删除课程分类成功！');
            this.getCourseTypeList();
        },
    }
}

</script>

<style lang="less" scoped>

</style>