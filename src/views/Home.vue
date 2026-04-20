<template>
  <div class="home">
    <el-container style="height: 100vh">
      <el-header>
        <div class="header">
          <div class="header-left">
            <h2>悦居管家</h2>
          </div>
          <div class="header-right">
            <div class="user-info">
              <span class="user-name">{{ userStore.user?.realName || userStore.user?.username }}</span>
              <el-tag size="small" :type="getRoleTagType()">{{ getRoleName() }}</el-tag>
            </div>
            <el-button @click="logout" size="small">退出登录</el-button>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu :default-active="$route.path" router>
            <!-- 仪表板 -->
            <el-menu-item index="/">
              <el-icon><House /></el-icon>
              <span>仪表板</span>
            </el-menu-item>
            <!-- 业主可见 -->
            <el-menu-item v-if="userStore.isOwner() || userStore.isPropertyManager() || userStore.isSystemAdmin()" index="/property">
              <el-icon><House /></el-icon>
              <span>房产管理</span>
            </el-menu-item>
            <el-menu-item v-if="userStore.isOwner() || userStore.isPropertyManager() || userStore.isSystemAdmin()" index="/bill">
              <el-icon><Money /></el-icon>
              <span>费用管理</span>
            </el-menu-item>
            <el-menu-item v-if="userStore.isOwner() || userStore.isPropertyManager() || userStore.isSystemAdmin()" index="/repair">
              <el-icon><Tools /></el-icon>
              <span>报修管理</span>
            </el-menu-item>
            <!-- 物业经理和管理员可见 -->
            <el-menu-item v-if="userStore.isPropertyManager() || userStore.isSystemAdmin()" index="/announcement">
              <el-icon><Bell /></el-icon>
              <span>公告管理</span>
            </el-menu-item>
            <el-menu-item v-if="userStore.isSystemAdmin()" index="/user">
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </el-menu-item>
            <!-- 所有登录用户可见 -->
            <el-menu-item index="/profile">
              <el-icon><Avatar /></el-icon>
              <span>个人中心</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { House, Money, Tools, Bell, User, Avatar } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/modules/user'

const router = useRouter()
const userStore = useUserStore()

const logout = () => {
  userStore.logout()
  router.push('/login')
}

const getRoleName = () => {
  const roleId = userStore.getRoleId()
  const roles = { 1: '业主', 2: '物业管理员', 3: '系统管理员' }
  return roles[roleId] || '未知角色'
}

const getRoleTagType = () => {
  const roleId = userStore.getRoleId()
  const tagTypes = { 1: 'success', 2: 'primary', 3: 'danger' }
  return tagTypes[roleId] || ''
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.header-left h2 {
  margin: 0;
  color: #409eff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-name {
  font-weight: 500;
  color: #333;
}
</style>