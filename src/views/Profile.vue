<template>
  <div class="profile">
    <h3>个人中心</h3>
    <el-form :model="user" label-width="80px">
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getUserProfile, updateUserProfile } from '@/apis/user'

const user = reactive({
  username: '',
  realName: '',
  phone: '',
  email: ''
})

onMounted(async () => {
  const res = await getUserProfile()
  if (res.code === 1) {
    Object.assign(user, res.data)
  }
})

const updateProfile = async () => {
  const res = await updateUserProfile(user)
  if (res.code === 1) {
    ElMessage.success('更新成功')
  } else {
    ElMessage.error(res.message)
  }
}
</script>

<style scoped>
.profile {
  padding: 20px;
}
</style>