<template>
  <div class="operation-logs">
    <div class="header">
      <h3>操作记录</h3>
      <p>查看当前账号在系统中的关键操作历史。</p>
    </div>

    <el-table :data="logs" style="width: 100%">
      <el-table-column prop="moduleName" label="模块" width="120" />
      <el-table-column prop="actionName" label="操作" width="120" />
      <el-table-column prop="targetType" label="对象类型" width="120" />
      <el-table-column prop="content" label="内容" min-width="260" />
      <el-table-column prop="createTime" label="时间" width="180" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getMyLogs } from '@/apis/user'
import type { OperationLogItem } from '@/types/models'

const logs = ref<OperationLogItem[]>([])

const loadLogs = async () => {
  const res = await getMyLogs()
  if (res.code === 200) {
    logs.value = res.data
  }
}

onMounted(() => {
  loadLogs()
})
</script>

<style scoped>
.operation-logs {
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
