<template>
  <div class="dashboard">
    <h3>仪表板</h3>
    <div class="stats">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ stats.totalProperties }}</div>
              <div class="stat-label">总房产数</div>
            </div>
            <el-icon class="stat-icon"><House /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ stats.unpaidBills }}</div>
              <div class="stat-label">未缴账单</div>
            </div>
            <el-icon class="stat-icon"><Money /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ stats.pendingRepairs }}</div>
              <div class="stat-label">待处理报修</div>
            </div>
            <el-icon class="stat-icon"><Tools /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ stats.totalUsers }}</div>
              <div class="stat-label">总用户数</div>
            </div>
            <el-icon class="stat-icon"><User /></el-icon>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { House, Money, Tools, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()
const stats = ref({
  totalProperties: 0,
  unpaidBills: 0,
  pendingRepairs: 0,
  totalUsers: 0
})

const loadStats = async () => {
  // 这里可以调用后端统计API
  // 暂时使用模拟数据
  if (userStore.isSystemAdmin()) {
    stats.value = {
      totalProperties: 120,
      unpaidBills: 15,
      pendingRepairs: 8,
      totalUsers: 95
    }
  } else if (userStore.isPropertyManager()) {
    stats.value = {
      totalProperties: 120,
      unpaidBills: 15,
      pendingRepairs: 8,
      totalUsers: 0 // 物业经理看不到用户数
    }
  } else {
    stats.value = {
      totalProperties: 2,
      unpaidBills: 1,
      pendingRepairs: 0,
      totalUsers: 0
    }
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stats {
  margin-top: 20px;
}

.stat-card {
  position: relative;
  text-align: center;
  padding: 20px;
}

.stat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 36px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px;
  color: #409eff;
  opacity: 0.5;
}
</style>