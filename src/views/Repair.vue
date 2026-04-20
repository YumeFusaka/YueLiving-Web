<template>
  <div class="repair">
    <h3>在线报修</h3>
    <el-button type="primary" @click="showAddDialog = true">提交报修</el-button>
    <el-table :data="repairs" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="description" label="故障描述"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          {{ getStatusText(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="提交时间"></el-table-column>
    </el-table>

    <el-dialog v-model="showAddDialog" title="提交报修" width="500px">
      <el-form :model="repairForm" :rules="rules" ref="formRef">
        <el-form-item label="故障描述" prop="description">
          <el-input v-model="repairForm.description" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="submitRepair">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMyRepairs, addRepair } from '@/apis/repair'

const repairs = ref([])
const showAddDialog = ref(false)
const formRef = ref()

const repairForm = reactive({
  description: ''
})

const rules = {
  description: [{ required: true, message: '请输入故障描述', trigger: 'blur' }]
}

onMounted(async () => {
  loadRepairs()
})

const loadRepairs = async () => {
  const res = await getMyRepairs()
  if (res.code === 1) {
    repairs.value = res.data
  }
}

const submitRepair = async () => {
  try {
    await formRef.value.validate()
    const res = await addRepair(repairForm)
    if (res.code === 1) {
      ElMessage.success('提交成功')
      showAddDialog.value = false
      repairForm.description = ''
      loadRepairs()
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    console.error(error)
  }
}

const getStatusText = (status: number) => {
  const statusMap = { 0: '待处理', 1: '处理中', 2: '已完成' }
  return statusMap[status] || '未知'
}
</script>

<style scoped>
.repair {
  padding: 20px;
}
</style>