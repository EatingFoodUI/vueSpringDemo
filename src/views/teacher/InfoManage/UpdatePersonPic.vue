<!-- 修改个人头像 -->
<template>
    <el-upload
        name="multipartFile"
        class="avatar-uploader"
        action="http://localhost:8888/modify/modifyAccountPit"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :data="updateData"
        >
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
</template>

<script>
export default {
data() {
    return {
        // :headers='header'
        imageUrl: '',
        /*header:{
            'Accept': 'application/json, text/plain, /',
        },*/
        // 上传参数
        updateData:{
            status:"1",
            id:window.sessionStorage.getItem('teacherId'),
        }
    };
},
methods: {
    handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        if(res == 0) return this.$message.error('上传头像失败');
        if(res == 1) this.$message.success('上传头像成功');
    },
    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
    }
}
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>