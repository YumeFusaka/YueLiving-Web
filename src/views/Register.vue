<template>
  <div class="register-container">
    <div class="auth-shell">
      <section class="brand-panel">
        <p class="eyebrow">Join YueLiving</p>
        <h1>创建业主账号</h1>
        <p class="subtitle">完成注册后即可查看房产信息、账单状态、报修进度和公告通知。</p>
        <div class="feature-list">
          <div>统一查看房产与账单</div>
          <div>在线提交报修并跟进进度</div>
          <div>实时接收小区公告</div>
        </div>
      </section>

      <el-form :model="form" :rules="rules" ref="formRef" label-position="top" class="register-form">
        <div class="form-heading">
          <h2>注册账号</h2>
          <p>默认注册为业主身份</p>
        </div>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份">
          <el-input value="业主" disabled></el-input>
        </el-form-item>
        <el-form-item class="action-row">
          <el-button type="primary" @click="handleRegister" :loading="loading" class="primary-btn">注册</el-button>
          <el-button @click="goToLogin" class="secondary-btn">返回登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { register as registerApi } from '@/apis/user'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
  phone: '',
  email: '',
  realName: '',
  roleId: 1
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  roleId: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

const handleRegister = async () => {
  try {
    await formRef.value.validate()
    loading.value = true
    const res = await registerApi(form)
    if (res.code === 200) {
      ElMessage.success('注册成功，请登录')
      router.push('/login')
    } else {
      ElMessage.error(res.msg || res.message || '注册失败')
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  display: flex;
  align-items: stretch;
  justify-content: center;
  height: 100vh;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(64, 158, 255, 0.18), transparent 30%),
    radial-gradient(circle at bottom right, rgba(103, 194, 58, 0.16), transparent 24%),
    linear-gradient(135deg, #eef4fa 0%, #f7fbff 100%);
}

.auth-shell {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  width: min(1120px, 100%);
  overflow: hidden;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 32px 80px rgba(15, 23, 42, 0.12);
}

.brand-panel {
  padding: 56px 48px;
  color: #fff;
  background: linear-gradient(145deg, #134e5e 0%, #1c7d7e 54%, #4cbf8b 100%);
}

.eyebrow {
  margin: 0 0 12px;
  letter-spacing: 0.18em;
  opacity: 0.72;
}

.brand-panel h1 {
  margin: 0;
  font-size: 40px;
}

.subtitle {
  margin: 18px 0 0;
  max-width: 380px;
  line-height: 1.7;
  opacity: 0.86;
}

.feature-list {
  display: grid;
  gap: 12px;
  margin-top: 28px;
}

.feature-list div {
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
}

.register-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 48px;
}

.form-heading {
  margin-bottom: 12px;
}

.form-heading h2 {
  margin: 0;
  color: #12324a;
  font-size: 30px;
}

.form-heading p {
  margin: 10px 0 0;
  color: #64748b;
}

.action-row :deep(.el-form-item__content) {
  display: flex;
  gap: 12px;
}

.primary-btn,
.secondary-btn {
  flex: 1;
  height: 44px;
}

@media (max-width: 900px) {
  .register-container {
    padding: 12px;
  }

  .auth-shell {
    grid-template-columns: 1fr;
  }

  .brand-panel,
  .register-form {
    padding: 32px 24px;
  }
}
</style>
