<template>
  <div class="login-container">
    <div class="auth-shell">
      <section class="brand-panel">
        <p class="eyebrow">YueLiving</p>
        <h1>悦居管家</h1>
        <p class="subtitle">把房产、费用、报修和公告集中到一个清爽入口里。</p>
        <div class="feature-list">
          <div>业主服务统一入口</div>
          <div>物业运营工作台</div>
          <div>系统管理总览</div>
        </div>
      </section>

      <el-form :model="form" :rules="rules" ref="formRef" label-position="top" class="login-form">
        <div class="form-heading">
          <h2>欢迎登录</h2>
          <p>请输入账号信息进入系统</p>
        </div>
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account" placeholder="请输入用户名或手机号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item class="action-row">
          <el-button type="primary" @click="handleLogin" :loading="loading" class="primary-btn">登录</el-button>
          <el-button @click="goToRegister" class="secondary-btn">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/apis/user'
import { useUserStore } from '@/stores/modules/user'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  account: '',
  password: ''
})

const rules = {
  account: [{ required: true, message: '请输入用户名或手机号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  try {
    await formRef.value.validate()
    loading.value = true
    const res = await login({ username: form.account, password: form.password })
    if (res.code === 200) {
      userStore.setToken(res.data.token)
      userStore.setUser(res.data.user)
      ElMessage.success('登录成功')
      router.push('/')
    } else {
      ElMessage.error(res.msg || res.message || '登录失败')
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
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
  grid-template-columns: 1.1fr 0.9fr;
  width: min(1080px, 100%);
  overflow: hidden;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 32px 80px rgba(15, 23, 42, 0.12);
}

.brand-panel {
  padding: 56px 48px;
  color: #fff;
  background: linear-gradient(145deg, #12324a 0%, #1f6d89 55%, #3a9d5d 100%);
}

.eyebrow {
  margin: 0 0 12px;
  letter-spacing: 0.18em;
  opacity: 0.72;
}

.brand-panel h1 {
  margin: 0;
  font-size: 42px;
}

.subtitle {
  margin: 18px 0 0;
  max-width: 360px;
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

.login-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px;
}

.form-heading {
  margin-bottom: 12px;
}

.form-heading h2 {
  margin: 0;
  color: #12324a;
  font-size: 32px;
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
  .login-container {
    padding: 12px;
  }

  .auth-shell {
    grid-template-columns: 1fr;
  }

  .brand-panel,
  .login-form {
    padding: 32px 24px;
  }
}
</style>
