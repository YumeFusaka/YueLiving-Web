<template>
  <div class="repair-history">
    <div class="header">
      <h3>我的报修</h3>
      <p>查看个人历史报修记录、处理状态与评价情况。</p>
    </div>

    <el-table :data="repairs" style="width: 100%">
      <el-table-column prop="description" label="故障描述" min-width="260" />
      <el-table-column prop="status" label="状态" width="120">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="assignTime" label="受理时间" width="180" />
      <el-table-column prop="completeTime" label="完成时间" width="180" />
      <el-table-column prop="rating" label="评分" width="90" />
      <el-table-column prop="createTime" label="提交时间" width="180" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getMyRepairs } from '@/apis/repair'
import type { RepairItem } from '@/types/models'

const repairs = ref<RepairItem[]>([])

const loadRepairs = async () => {
  const res = await getMyRepairs()
  if (res.code === 200) {
    repairs.value = res.data
  }
}

const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = { 0: '待受理', 1: '已受理', 2: '处理中', 3: '已完成' }
  return statusMap[status] || '未知'
}

const getStatusType = (status: number) => {
  const typeMap: Record<number, '' | 'warning' | 'info' | 'primary' | 'success'> = {
    0: 'warning',
    1: 'info',
    2: 'primary',
    3: 'success'
  }
  return typeMap[status] || ''
}

onMounted(() => {
  loadRepairs()
})
</script>

<style scoped>
.repair-history {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.header h3 {
  margin: 0 0 8px;
}

.header p {
  margin: 0;
  color: #64748b;
}
</style>
