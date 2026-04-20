<template>
  <div class="dashboard">
    <div class="hero-card">
      <div>
        <p class="eyebrow">{{ roleTitle }}</p>
        <h3>{{ heroTitle }}</h3>
        <p class="hero-text">{{ heroText }}</p>
      </div>
      <el-button type="primary" plain @click="refreshStats">刷新数据</el-button>
    </div>

    <el-row :gutter="20">
      <el-col v-for="item in statCards" :key="item.label" :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-meta">{{ item.label }}</div>
            <div class="stat-number">{{ item.value }}</div>
            <div class="stat-desc">{{ item.description }}</div>
          </div>
          <el-icon class="stat-icon"><component :is="item.icon" /></el-icon>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="detail-row">
      <el-col :xs="24" :lg="14">
        <el-card class="detail-card">
          <template #header>
            <div class="detail-header">
              <span>最新公告</span>
              <span class="detail-note">来自后台公告列表</span>
            </div>
          </template>
          <el-empty v-if="announcements.length === 0" description="暂无公告" />
          <div v-else class="announcement-list">
            <div v-for="item in announcements" :key="item.id" class="announcement-item">
              <div>
                <div class="announcement-title">{{ item.title }}</div>
                <div class="announcement-summary">{{ item.summary || item.content }}</div>
              </div>
              <el-tag v-if="item.isTop === 1" type="danger" effect="dark">置顶</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="10">
        <el-card class="detail-card">
          <template #header>
            <div class="detail-header">
              <span>使用提示</span>
            </div>
          </template>
          <ul class="tips">
            <li>业主可查看个人房产、待缴账单和报修进度。</li>
            <li>物业管理员可管理业主、房产、账单、报修和公告。</li>
            <li>系统管理员可维护管理员账号和系统配置。</li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { House, Money, Tools, User } from '@element-plus/icons-vue'
import { getAnnouncements } from '@/apis/announcement'
import { getManagerStatistics, getOwnerDashboard, getSystemOverview } from '@/apis/dashboard'
import { useUserStore } from '@/stores/modules/user'
import type { AnnouncementItem } from '@/types/models'

const userStore = useUserStore()
const stats = ref({
  totalProperties: 0,
  unpaidBills: 0,
  pendingRepairs: 0,
  totalUsers: 0
})
const announcements = ref<AnnouncementItem[]>([])

const roleTitle = computed(() => {
  if (userStore.isSystemAdmin()) return '系统管理员工作台'
  if (userStore.isPropertyManager()) return '物业管理工作台'
  return '业主工作台'
})

const heroTitle = computed(() => {
  if (userStore.isSystemAdmin()) return '掌握系统运行与配置状态'
  if (userStore.isPropertyManager()) return '掌握小区运营全貌'
  return '集中查看我的房产与服务'
})

const heroText = computed(() => {
  if (userStore.isSystemAdmin()) return '查看平台用户、房产、欠费与报修情况，并维护系统级配置。'
  if (userStore.isPropertyManager()) return '优先关注欠费账单、待办工单和业主服务状态。'
  return '快速查看房产数量、待缴账单、报修进度和最新公告。'
})

const statCards = computed(() => [
  { label: '房产总数', value: stats.value.totalProperties, description: '当前可见房产资源', icon: House },
  { label: '未缴账单', value: stats.value.unpaidBills, description: '待支付或待处理账单', icon: Money },
  { label: '待办报修', value: stats.value.pendingRepairs, description: '仍在流程中的报修工单', icon: Tools },
  { label: '用户数量', value: stats.value.totalUsers, description: '当前角色可见用户统计', icon: User }
])

const loadStats = async () => {
  const res = userStore.isSystemAdmin()
    ? await getSystemOverview()
    : userStore.isPropertyManager()
      ? await getManagerStatistics()
      : await getOwnerDashboard()

  if (res.code === 200) {
    stats.value = {
      totalProperties: Number(res.data.totalProperties ?? 0),
      unpaidBills: Number(res.data.unpaidBills ?? 0),
      pendingRepairs: Number(res.data.pendingRepairs ?? 0),
      totalUsers: Number(res.data.totalUsers ?? 0)
    }
  }
}

const loadAnnouncements = async () => {
  const res = await getAnnouncements()
  if (res.code === 200) {
    announcements.value = res.data.slice(0, 5)
  }
}

const refreshStats = async () => {
  await Promise.all([loadStats(), loadAnnouncements()])
}

onMounted(() => {
  refreshStats()
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 28px;
  border-radius: 24px;
  color: #fff;
  background: linear-gradient(135deg, #0f4c81 0%, #3a9d5d 100%);
  box-shadow: 0 24px 48px rgba(15, 76, 129, 0.22);
}

.eyebrow {
  margin: 0 0 8px;
  opacity: 0.8;
  letter-spacing: 0.08em;
}

.hero-card h3 {
  margin: 0;
  font-size: 30px;
}

.hero-text {
  margin: 12px 0 0;
  max-width: 560px;
  line-height: 1.6;
  opacity: 0.9;
}

.stat-card {
  position: relative;
  min-height: 168px;
  border-radius: 20px;
  overflow: hidden;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-meta {
  color: #64748b;
  font-size: 14px;
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  color: #102a43;
}

.stat-desc {
  font-size: 14px;
  color: #64748b;
}

.stat-icon {
  position: absolute;
  top: 18px;
  right: 18px;
  font-size: 28px;
  color: #3b82f6;
  opacity: 0.65;
}

.detail-row {
  margin-top: 0;
}

.detail-card {
  height: 100%;
  border-radius: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-note {
  color: #94a3b8;
  font-size: 12px;
}

.announcement-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.announcement-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid #eef2f7;
}

.announcement-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.announcement-title {
  font-weight: 600;
  color: #102a43;
}

.announcement-summary {
  margin-top: 6px;
  color: #64748b;
  line-height: 1.5;
}

.tips {
  margin: 0;
  padding-left: 18px;
  color: #475569;
  line-height: 1.8;
}

@media (max-width: 900px) {
  .hero-card {
    flex-direction: column;
  }
}
</style>
