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
              <el-avatar :size="38" :src="userStore.user?.avatar" class="user-avatar">
                <el-icon><UserFilled /></el-icon>
              </el-avatar>
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
import { House, Money, Tools, Bell, User, Avatar, UserFilled } from '@element-plus/icons-vue'
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
  { path: '/user', label: '业主管理', icon: User },
  { path: '/property', label: '房产资源', icon: House },
  { path: '/bill', label: '费用管理', icon: Money },
  { path: '/repair', label: '报修工单', icon: Tools },
  { path: '/announcement', label: '公告管理', icon: Bell },
  { path: '/operation-logs', label: '操作记录', icon: Avatar },
  { path: '/profile', label: '个人中心', icon: Avatar }
]

const systemAdminMenu: MenuItem[] = [
  { path: '/', label: '仪表板', icon: House },
  { path: '/announcement', label: '公告管理', icon: Bell },
  { path: '/user', label: '管理员与配置', icon: User },
  { path: '/operation-logs', label: '操作记录', icon: Avatar },
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
.home {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(64, 158, 255, 0.14), transparent 28%),
    radial-gradient(circle at bottom right, rgba(103, 194, 58, 0.12), transparent 24%),
    linear-gradient(180deg, #f4f8fc 0%, #eef3f8 100%);
}

.home :deep(.el-container) {
  background: transparent;
}

.home :deep(.el-header) {
  height: 72px;
  background: rgba(255, 255, 255, 0.84);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.home :deep(.el-aside) {
  padding: 20px 14px;
  background: transparent;
}

.home :deep(.el-main) {
  padding: 20px 24px 28px;
}

.home :deep(.el-menu) {
  border-right: none;
  border-radius: 20px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
}

.home :deep(.el-menu-item) {
  height: 46px;
  margin-bottom: 6px;
  border-radius: 12px;
}

.home :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, #409eff, #67c23a);
  color: #fff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.header-left h2 {
  margin: 0;
  color: #12324a;
  font-size: 24px;
  letter-spacing: 0.04em;
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

.user-avatar {
  flex-shrink: 0;
  background: linear-gradient(135deg, #409eff, #67c23a);
  color: #fff;
}

.user-name {
  font-weight: 500;
  color: #333;
}

@media (max-width: 960px) {
  .home :deep(.el-container) {
    flex-direction: column;
  }

  .home :deep(.el-aside) {
    width: 100% !important;
    padding: 12px 20px 0;
  }

  .home :deep(.el-menu) {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .home :deep(.el-menu-item) {
    flex: 1 1 calc(50% - 8px);
    margin-bottom: 0;
  }

  .header {
    padding: 0 8px;
  }
}
</style>
