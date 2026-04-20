<template>
  <div class="property">
    <div class="header">
      <h3>{{ userStore.isOwner() ? '我的房产' : '房产管理' }}</h3>
      <div v-if="userStore.isPropertyManager() || userStore.isSystemAdmin()">
        <el-button type="primary" @click="showAddDialog">添加房产</el-button>
      </div>
    </div>
    <el-table :data="properties" style="width: 100%">
      <el-table-column prop="buildingNo" label="楼栋号"></el-table-column>
      <el-table-column prop="unitNo" label="单元号"></el-table-column>
      <el-table-column prop="roomNo" label="房号"></el-table-column>
      <el-table-column prop="area" label="面积"></el-table-column>
      <el-table-column prop="ownerId" label="业主ID" v-if="!userStore.isOwner()"></el-table-column>
      <el-table-column prop="ownerNameSnapshot" label="业主姓名" v-if="!userStore.isOwner()"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          {{ getStatusLabel(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="userStore.isPropertyManager() || userStore.isSystemAdmin()">
        <template #default="scope">
          <el-button size="small" @click="editProperty(scope.row)">编辑</el-button>
          <el-button
            v-if="!scope.row.ownerId"
            size="small"
            type="primary"
            @click="openBindDialog(scope.row)"
          >绑定业主</el-button>
          <el-button
            v-else
            size="small"
            type="warning"
            @click="unbindOwner(scope.row)"
          >解绑业主</el-button>
          <el-button size="small" type="danger" @click="deletePropertyItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑房产对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑房产' : '添加房产'" width="500px">
      <el-form :model="propertyForm" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="楼栋号" prop="buildingNo">
          <el-input v-model="propertyForm.buildingNo"></el-input>
        </el-form-item>
        <el-form-item label="单元号" prop="unitNo">
          <el-input v-model="propertyForm.unitNo"></el-input>
        </el-form-item>
        <el-form-item label="房号" prop="roomNo">
          <el-input v-model="propertyForm.roomNo"></el-input>
        </el-form-item>
        <el-form-item label="面积" prop="area">
          <el-input v-model.number="propertyForm.area"></el-input>
        </el-form-item>
        <el-form-item label="业主ID" prop="ownerId" v-if="!userStore.isOwner()">
          <el-input v-model.number="propertyForm.ownerId"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="propertyForm.status">
            <el-option label="空置" :value="0"></el-option>
            <el-option label="已入住" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitProperty">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="bindDialogVisible" title="绑定业主" width="420px">
      <el-form :model="bindForm" label-width="90px">
        <el-form-item label="房产">
          <el-input :value="bindForm.displayText" disabled />
        </el-form-item>
        <el-form-item label="业主ID">
          <el-input-number v-model="bindForm.ownerId" :min="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="bindDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitBind">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMyProperties, getAllProperties, addProperty, updateProperty, deleteProperty, bindPropertyOwner, unbindPropertyOwner } from '@/apis/property'
import { useUserStore } from '@/stores/modules/user'
import type { PropertyItem } from '@/types/models'

const userStore = useUserStore()
const properties = ref<PropertyItem[]>([])
const dialogVisible = ref(false)
const bindDialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()

const propertyForm = reactive({
  id: null as number | null,
  buildingNo: '',
  unitNo: '',
  roomNo: '',
  area: null as number | null,
  ownerId: null as number | null,
  status: 1
})

const bindForm = reactive({
  propertyId: null as number | null,
  ownerId: null as number | null,
  displayText: ''
})

const rules = {
  buildingNo: [{ required: true, message: '请输入楼栋号', trigger: 'blur' }],
  unitNo: [{ required: true, message: '请输入单元号', trigger: 'blur' }],
  roomNo: [{ required: true, message: '请输入房号', trigger: 'blur' }],
  area: [{ required: true, message: '请输入面积', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const loadProperties = async () => {
  const res = userStore.isOwner() ? await getMyProperties() : await getAllProperties()
  if (res.code === 200) {
    properties.value = res.data
  }
}

const showAddDialog = () => {
  isEdit.value = false
  Object.assign(propertyForm, {
    id: null,
    buildingNo: '',
    unitNo: '',
    roomNo: '',
    area: null,
    ownerId: userStore.isOwner() ? userStore.user?.id : null,
    status: 1
  })
  dialogVisible.value = true
}

const editProperty = (property: PropertyItem) => {
  isEdit.value = true
  Object.assign(propertyForm, property)
  dialogVisible.value = true
}

const submitProperty = async () => {
  try {
    await formRef.value.validate()
    const payload = {
      ...propertyForm,
      id: propertyForm.id ?? undefined,
      area: propertyForm.area ?? undefined,
      ownerId: propertyForm.ownerId ?? undefined
    }
    if (isEdit.value) {
      await updateProperty(payload)
      ElMessage.success('更新成功')
    } else {
      await addProperty(payload)
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    loadProperties()
  } catch (error) {
    console.error(error)
  }
}

const deletePropertyItem = async (property: PropertyItem) => {
  try {
    await ElMessageBox.confirm('确定删除此房产吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteProperty(property.id)
    ElMessage.success('删除成功')
    loadProperties()
  } catch (error) {
    console.error(error)
  }
}

const openBindDialog = (property: PropertyItem) => {
  bindForm.propertyId = property.id
  bindForm.ownerId = null
  bindForm.displayText = `${property.buildingNo}-${property.unitNo}-${property.roomNo}`
  bindDialogVisible.value = true
}

const submitBind = async () => {
  if (!bindForm.propertyId || !bindForm.ownerId) return
  await bindPropertyOwner({ propertyId: bindForm.propertyId, ownerId: bindForm.ownerId })
  ElMessage.success('绑定成功')
  bindDialogVisible.value = false
  loadProperties()
}

const unbindOwner = async (property: PropertyItem) => {
  await unbindPropertyOwner(property.id)
  ElMessage.success('解绑成功')
  loadProperties()
}

const getStatusLabel = (status?: number) => {
  if (status === 2) return '装修中'
  return status === 1 ? '已入住' : '空置'
}

onMounted(() => {
  loadProperties()
})
</script>

<style scoped>
.property {
  padding: 20px;
}

.property :deep(.el-dialog .el-select) {
  width: 100%;
  min-width: 220px;
}
</style>
