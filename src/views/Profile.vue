<template>
  <div class="profile">
    <h3>个人中心</h3>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="个人信息" name="info">
        <el-form :model="user" label-width="80px">
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              action="/user/profile/avatar"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :headers="{ Authorization: 'Bearer ' + userStore.token }"
            >
              <img v-if="user.avatar" :src="user.avatar" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              <div v-if="!user.avatar" class="avatar-uploader-text">点击上传头像</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="user.username" readonly></el-input>
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="user.realName"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="user.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="user.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateProfile">更新信息</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="password">
        <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="passwordForm.oldPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="passwordForm.newPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input v-model="passwordForm.confirmPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleUpdatePassword">修改密码</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getUserProfile, updateUserProfile, updatePassword as updateUserPassword } from '@/apis/user'
import { useUserStore } from '@/stores/modules/user'
import type { UserItem } from '@/types/models'

const activeTab = ref('info')
const passwordFormRef = ref()
const userStore = useUserStore()

const user = reactive<Partial<UserItem>>({
  username: '',
  realName: '',
  phone: '',
  email: '',
  avatar: ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

onMounted(async () => {
  const profileRes = await getUserProfile()
  if (profileRes.code === 200) {
    Object.assign(user, profileRes.data)
  }
})

const updateProfile = async () => {
  const res = await updateUserProfile(user)
  if (res.code === 200) {
    ElMessage.success('更新成功')
  } else {
    ElMessage.error(res.message)
  }
}

const handleUpdatePassword = async () => {
  try {
    await passwordFormRef.value.validate()
    const res = await updateUserPassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })
    if (res.code === 200) {
      ElMessage.success('密码修改成功')
      passwordForm.oldPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    console.error(error)
  }
}

const handleAvatarSuccess = (response: any, file: any) => {
  if (response.code === 200) {
    user.avatar = response.data.url
    ElMessage.success('头像上传成功')
  } else {
    ElMessage.error('头像上传失败')
  }
}

const beforeAvatarUpload = (file: any) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}
</script>

<style scoped>
.profile {
  padding: 20px;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.avatar-uploader-text {
  font-size: 12px;
  color: #8c939d;
  text-align: center;
}
</style>
