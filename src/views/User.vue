<template>
  <div class="user">
    <div class="header">
      <h3>{{ pageTitle }}</h3>
      <el-button v-if="userStore.isSystemAdmin() && activeTab === 'users'" type="primary" @click="showAddDialog">添加用户</el-button>
    </div>
    <el-tabs v-if="userStore.isSystemAdmin()" v-model="activeTab" class="page-tabs">
      <el-tab-pane label="管理员管理" name="users"></el-tab-pane>
      <el-tab-pane label="系统配置" name="configs"></el-tab-pane>
    </el-tabs>

    <el-table v-if="activeTab === 'users'" :data="users" style="width: 100%">
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="realName" label="真实姓名"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="roleId" label="角色">
        <template #default="scope">
          {{ getRoleName(scope.row.roleId) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          {{ scope.row.status === 1 ? '启用' : '禁用' }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button v-if="userStore.isSystemAdmin()" size="small" @click="editUser(scope.row)">编辑</el-button>
          <el-button size="small" :type="scope.row.status === 1 ? 'warning' : 'success'" @click="toggleStatus(scope.row)">
            {{ scope.row.status === 1 ? '禁用' : '启用' }}
          </el-button>
          <el-button v-if="userStore.isSystemAdmin()" size="small" type="danger" @click="deleteUserItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table v-else :data="configs" style="width: 100%">
      <el-table-column prop="configName" label="配置名称"></el-table-column>
      <el-table-column prop="configKey" label="配置键"></el-table-column>
      <el-table-column prop="configValue" label="配置值"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
    </el-table>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑用户' : '添加用户'" width="500px">
      <el-form :model="userForm" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input v-model="userForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="userForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="userForm.roleId">
            <el-option label="业主" :value="1"></el-option>
            <el-option label="物业管理员" :value="2"></el-option>
            <el-option label="系统管理员" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="userForm.status">
            <el-option label="禁用" :value="0"></el-option>
            <el-option label="启用" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUser">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUsers, addUser, updateUser, updateUserStatus, deleteUser } from '@/apis/user'
import { getSystemConfigs } from '@/apis/config'
import { useUserStore } from '@/stores/modules/user'
import type { SystemConfigItem, UserItem } from '@/types/models'

const userStore = useUserStore()
const users = ref<UserItem[]>([])
const configs = ref<SystemConfigItem[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()
const activeTab = ref('users')

const pageTitle = computed(() => userStore.isSystemAdmin() ? '管理员与系统配置' : '业主管理')

const userForm = reactive({
  id: null as number | null,
  username: '',
  password: '',
  realName: '',
  phone: '',
  email: '',
  roleId: 1,
  status: 1
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const getRoleName = (roleId: number) => {
  const roles: Record<number, string> = { 1: '业主', 2: '物业管理员', 3: '系统管理员' }
  return roles[roleId] || '未知'
}

const loadUsers = async () => {
  const res = await getUsers()
  if (res.code === 200) {
    users.value = res.data
  }
}

const loadConfigs = async () => {
  if (!userStore.isSystemAdmin()) return
  const res = await getSystemConfigs()
  if (res.code === 200) {
    configs.value = res.data
  }
}

const showAddDialog = () => {
  isEdit.value = false
  Object.assign(userForm, {
    id: null,
    username: '',
    password: '',
    realName: '',
    phone: '',
    email: '',
    roleId: 1,
    status: 1
  })
  dialogVisible.value = true
}

const editUser = (user: any) => {
  isEdit.value = true
  Object.assign(userForm, user)
  dialogVisible.value = true
}

const submitUser = async () => {
  try {
    await formRef.value.validate()
    const payload = {
      ...userForm,
      id: userForm.id ?? undefined
    }
    if (isEdit.value) {
      await updateUser(payload)
      ElMessage.success('更新成功')
    } else {
      await addUser(payload)
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    loadUsers()
  } catch (error) {
    console.error(error)
  }
}

const deleteUserItem = async (user: any) => {
  try {
    await ElMessageBox.confirm('确定删除此用户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteUser(user.id)
    ElMessage.success('删除成功')
    loadUsers()
  } catch (error) {
    console.error(error)
  }
}

const toggleStatus = async (user: any) => {
  try {
    const newStatus = user.status === 1 ? 0 : 1
    await updateUserStatus({ userId: user.id, status: newStatus })
    ElMessage.success(newStatus === 1 ? '启用成功' : '禁用成功')
    loadUsers()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  loadUsers()
  loadConfigs()
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.user {
  padding: 20px;
}

.page-tabs {
  margin-bottom: 16px;
}

.user :deep(.el-dialog .el-select) {
  width: 100%;
  min-width: 220px;
}
</style>
