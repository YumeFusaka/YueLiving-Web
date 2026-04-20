<template>
  <div class="home">
    <el-container style="height: 100vh">
      <el-header>
        <div class="header">
          <h2>悦居管家</h2>
          <el-button @click="logout">退出登录</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu :default-active="$route.path" router>
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
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.header h2 {
  margin: 0;
}
</style>