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
            <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.label }}</span>
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { House, Money, Tools, Bell, User, Avatar } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/modules/user'

const router = useRouter()
const userStore = useUserStore()

type MenuItem = {
  path: string
  label: string
  icon: typeof House
}

const ownerMenu: MenuItem[] = [
  { path: '/', label: '仪表板', icon: House },
  { path: '/property', label: '我的房产', icon: House },
  { path: '/bill', label: '费用中心', icon: Money },
  { path: '/repair', label: '在线报修', icon: Tools },
  { path: '/announcement', label: '公告通知', icon: Bell },
  { path: '/profile', label: '个人中心', icon: Avatar }
]

const propertyManagerMenu: MenuItem[] = [
  { path: '/', label: '仪表板', icon: House },
  { path: '/property', label: '房产资源', icon: House },
  { path: '/bill', label: '费用管理', icon: Money },
  { path: '/repair', label: '报修工单', icon: Tools },
  { path: '/announcement', label: '公告管理', icon: Bell },
  { path: '/profile', label: '个人中心', icon: Avatar }
]

const systemAdminMenu: MenuItem[] = [
  { path: '/', label: '仪表板', icon: House },
  { path: '/announcement', label: '公告管理', icon: Bell },
  { path: '/user', label: '用户管理', icon: User },
  { path: '/profile', label: '个人中心', icon: Avatar }
]

const menuItems = computed(() => {
  if (userStore.isSystemAdmin()) {
    return systemAdminMenu
  }
  if (userStore.isPropertyManager()) {
    return propertyManagerMenu
  }
  return ownerMenu
})

const logout = () => {
  userStore.logout()
  router.push('/login')
}

const getRoleName = () => {
  const roleId = userStore.getRoleId()
  const roles: Record<number, string> = { 1: '业主', 2: '物业管理员', 3: '系统管理员' }
  if (roleId == null) return '未知角色'
  return roles[roleId] || '未知角色'
}

const getRoleTagType = () => {
  const roleId = userStore.getRoleId()
  const tagTypes: Record<number, '' | 'success' | 'primary' | 'danger'> = {
    1: 'success',
    2: 'primary',
    3: 'danger'
  }
  if (roleId == null) return ''
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
