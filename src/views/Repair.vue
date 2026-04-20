<template>
  <div class="repair">
    <div class="header">
      <h3>{{ userStore.isOwner() ? '我的报修' : '报修管理' }}</h3>
      <div v-if="userStore.isOwner()">
        <el-button type="primary" @click="showAddDialog = true">提交报修</el-button>
      </div>
    </div>

    <!-- 筛选条件 -->
    <el-form :inline="true" class="filter-form" v-if="userStore.isPropertyManager() || userStore.isSystemAdmin()">
      <el-form-item label="状态">
        <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
          <el-option label="待受理" :value="0"></el-option>
          <el-option label="已受理" :value="1"></el-option>
          <el-option label="处理中" :value="2"></el-option>
          <el-option label="已完成" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loadRepairs">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="repairs" style="width: 100%">
      <el-table-column prop="id" label="工单号" width="100"></el-table-column>
      <el-table-column prop="propertyId" label="房产ID" v-if="!userStore.isOwner()"></el-table-column>
      <el-table-column prop="userId" label="报修人ID" v-if="!userStore.isOwner()"></el-table-column>
      <el-table-column prop="description" label="故障描述" min-width="200"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="assignUserId" label="分配人员" v-if="userStore.isPropertyManager() || userStore.isSystemAdmin()">
        <template #default="scope">
          {{ scope.row.assignUserId ? `员工${scope.row.assignUserId}` : '未分配' }}
        </template>
      </el-table-column>
      <el-table-column prop="assignTime" label="分配时间" v-if="userStore.isPropertyManager() || userStore.isSystemAdmin()"></el-table-column>
      <el-table-column prop="completeTime" label="完成时间" v-if="userStore.isPropertyManager() || userStore.isSystemAdmin()"></el-table-column>
      <el-table-column prop="createTime" label="提交时间"></el-table-column>
      <el-table-column label="操作" min-width="200">
        <template #default="scope">
          <!-- 业主操作 -->
          <el-button
            v-if="userStore.isOwner() && scope.row.status === 3 && !scope.row.rating"
            size="small"
            type="success"
            @click="showRatingDialog(scope.row)"
          >
            评价
          </el-button>

          <!-- 物业管理员操作 -->
          <div v-if="userStore.isPropertyManager() || userStore.isSystemAdmin()">
            <el-button
              v-if="scope.row.status === 0"
              size="small"
              type="primary"
              @click="assignRepairItem(scope.row)"
            >
              分配
            </el-button>
            <el-button
              v-if="scope.row.status === 1 || scope.row.status === 2"
              size="small"
              type="success"
              @click="completeRepairItem(scope.row)"
            >
              完成
            </el-button>
            <el-button size="small" @click="viewDetail(scope.row)">详情</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 提交报修对话框 -->
    <el-dialog v-model="showAddDialog" title="提交报修" width="500px">
      <el-form :model="repairForm" :rules="rules" ref="formRef">
        <el-form-item label="故障描述" prop="description">
          <el-input v-model="repairForm.description" type="textarea" :rows="4" placeholder="请详细描述故障情况"></el-input>
        </el-form-item>
        <el-form-item label="上传图片" prop="images">
          <el-upload
            v-model:file-list="fileList"
            action="/repair/upload"
            list-type="picture-card"
            :multiple="true"
            :limit="3"
            accept="image/*"
            :on-success="handleUploadSuccess"
            :on-remove="handleRemove"
            :headers="{ Authorization: 'Bearer ' + userStore.token }"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="submitRepair">提交</el-button>
      </template>
    </el-dialog>

    <!-- 分配维修人员对话框 -->
    <el-dialog v-model="assignDialogVisible" title="分配维修人员" width="400px">
      <el-form :model="assignForm" :rules="assignRules" ref="assignFormRef">
        <el-form-item label="维修人员" prop="assignUserId">
          <el-select v-model="assignForm.assignUserId" placeholder="请选择维修人员">
            <el-option
              v-for="user in maintenanceUsers"
              :key="user.id"
              :label="user.realName || user.username"
              :value="user.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAssign">确定</el-button>
      </template>
    </el-dialog>

    <!-- 评价对话框 -->
    <el-dialog v-model="ratingDialogVisible" title="评价服务" width="400px">
      <el-form :model="ratingForm" :rules="ratingRules" ref="ratingFormRef">
        <el-form-item label="评分" prop="rating">
          <el-rate v-model="ratingForm.rating" :max="5"></el-rate>
        </el-form-item>
        <el-form-item label="评价内容" prop="comment">
          <el-input v-model="ratingForm.comment" type="textarea" :rows="3" placeholder="请写下您的评价"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="ratingDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRating">提交评价</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getMyRepairs, getAllRepairs, addRepair, assignRepair, completeRepair, rateRepair } from '@/apis/repair'
import { getMaintenanceUsers } from '@/apis/user'
import { useUserStore } from '@/stores/modules/user'
import type { RepairItem, UserItem } from '@/types/models'

const userStore = useUserStore()
const repairs = ref<RepairItem[]>([])
const maintenanceUsers = ref<UserItem[]>([])
const showAddDialog = ref(false)
const assignDialogVisible = ref(false)
const ratingDialogVisible = ref(false)
const formRef = ref()
const assignFormRef = ref()
const ratingFormRef = ref()
const fileList = ref<any[]>([])

const filterForm = reactive({
  status: null as number | null
})

const repairForm = reactive({
  description: '',
  images: [] as string[]
})

const assignForm = reactive({
  repairId: null as number | null,
  assignUserId: null as number | null
})

const ratingForm = reactive({
  repairId: null as number | null,
  rating: 5,
  comment: ''
})

const rules = {
  description: [{ required: true, message: '请输入故障描述', trigger: 'blur' }]
}

const assignRules = {
  assignUserId: [{ required: true, message: '请选择维修人员', trigger: 'change' }]
}

const ratingRules = {
  rating: [{ required: true, message: '请给出评分', trigger: 'change' }]
}

const loadRepairs = async () => {
  try {
    let res
    if (userStore.isPropertyManager() || userStore.isSystemAdmin()) {
      res = await getAllRepairs(filterForm)
    } else {
      res = await getMyRepairs()
    }
    if (res.code === 200) {
      repairs.value = res.data
    }
  } catch (error) {
    console.error(error)
  }
}

const loadMaintenanceUsers = async () => {
  const res = await getMaintenanceUsers()
  if (res.code === 200) {
    maintenanceUsers.value = res.data
  }
}

const submitRepair = async () => {
  try {
    await formRef.value.validate()
    const res = await addRepair(repairForm)
    if (res.code === 200) {
      ElMessage.success('提交成功')
      showAddDialog.value = false
      repairForm.description = ''
      repairForm.images = []
      fileList.value = []
      loadRepairs()
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    console.error(error)
  }
}

const handleUploadSuccess = (response: any, file: any) => {
  if (response.code === 200) {
    repairForm.images.push(response.data.url)
  } else {
    ElMessage.error('上传失败')
  }
}

const handleRemove = (file: any, fileList: any[]) => {
  // 从 images 中移除对应的 URL
  const index = repairForm.images.findIndex(url => url.includes(file.name))
  if (index > -1) {
    repairForm.images.splice(index, 1)
  }
}

const assignRepairItem = (repair: RepairItem) => {
  assignForm.repairId = repair.id
  assignForm.assignUserId = repair.assignUserId ?? null
  assignDialogVisible.value = true
}

const submitAssign = async () => {
  try {
    await assignFormRef.value.validate()
    if (assignForm.repairId == null || assignForm.assignUserId == null) return
    const res = await assignRepair(assignForm.repairId, assignForm.assignUserId)
    if (res.code === 200) {
      ElMessage.success('分配成功')
      assignDialogVisible.value = false
      loadRepairs()
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    console.error(error)
  }
}

const completeRepairItem = async (repair: RepairItem) => {
  try {
    const res = await completeRepair(repair.id)
    if (res.code === 200) {
      ElMessage.success('工单已完成')
      loadRepairs()
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    console.error(error)
  }
}

const showRatingDialog = (repair: RepairItem) => {
  ratingForm.repairId = repair.id
  ratingForm.rating = 5
  ratingForm.comment = ''
  ratingDialogVisible.value = true
}

const submitRating = async () => {
  try {
    await ratingFormRef.value.validate()
    if (ratingForm.repairId == null) return
    const res = await rateRepair(ratingForm.repairId, ratingForm.rating, ratingForm.comment)
    if (res.code === 200) {
      ElMessage.success('评价成功')
      ratingDialogVisible.value = false
      loadRepairs()
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    console.error(error)
  }
}

const viewDetail = (_repair: RepairItem) => {
  // 这里可以实现查看详情的逻辑
  ElMessage.info('详情功能待实现')
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
  if (userStore.isPropertyManager() || userStore.isSystemAdmin()) {
    loadMaintenanceUsers()
  }
})
</script>

<style scoped>
.repair {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-form {
  margin-bottom: 20px;
}

.filter-form :deep(.el-select) {
  width: 180px;
}

.repair :deep(.el-dialog .el-select) {
  width: 100%;
  min-width: 220px;
}
</style>
