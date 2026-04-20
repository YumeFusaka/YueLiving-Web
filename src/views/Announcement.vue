<template>
  <div class="announcement">
    <div class="header">
      <h3>公告通知</h3>
      <div v-if="userStore.isPropertyManager() || userStore.isSystemAdmin()">
        <el-button type="primary" @click="showAddDialog">发布公告</el-button>
      </div>
    </div>

    <div v-if="announcements.length === 0" class="no-data">
      <el-empty description="暂无公告"></el-empty>
    </div>

    <div v-else>
      <el-card v-for="item in announcements" :key="item.id" class="announcement-card">
        <template #header>
          <div class="card-header">
            <div class="title-section">
              <span class="title">{{ item.title }}</span>
              <el-tag v-if="item.isTop === 1" type="danger" size="small">置顶</el-tag>
            </div>
            <div class="actions" v-if="userStore.isPropertyManager() || userStore.isSystemAdmin()">
              <el-button size="small" @click="editAnnouncement(item)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteAnnouncementItem(item)">删除</el-button>
            </div>
          </div>
        </template>
        <div class="content">
          <p>{{ item.content }}</p>
        </div>
        <div class="card-footer">
          <span class="publish-info">
            发布人：{{ item.publishUserId ? `用户${item.publishUserId}` : '系统' }} |
            发布时间：{{ formatDate(item.publishTime) }}
          </span>
        </div>
      </el-card>
    </div>

    <!-- 添加/编辑公告对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑公告' : '发布公告'" width="600px">
      <el-form :model="announcementForm" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="announcementForm.title" placeholder="请输入公告标题"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="announcementForm.content"
            type="textarea"
            :rows="6"
            placeholder="请输入公告内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否置顶">
          <el-switch v-model="announcementForm.isTop" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAnnouncement">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAnnouncements, addAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/apis/announcement'
import { useUserStore } from '@/stores/modules/user'
import type { AnnouncementItem } from '@/types/models'

const userStore = useUserStore()
const announcements = ref<AnnouncementItem[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()

const announcementForm = reactive({
  id: null as number | null,
  title: '',
  content: '',
  isTop: 0
})

const rules = {
  title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
}

const loadAnnouncements = async () => {
  const res = await getAnnouncements()
  if (res.code === 200) {
    announcements.value = res.data
  }
}

const showAddDialog = () => {
  isEdit.value = false
  Object.assign(announcementForm, {
    id: null,
    title: '',
    content: '',
    isTop: 0
  })
  dialogVisible.value = true
}

const editAnnouncement = (announcement: AnnouncementItem) => {
  isEdit.value = true
  Object.assign(announcementForm, announcement)
  dialogVisible.value = true
}

const submitAnnouncement = async () => {
  try {
    await formRef.value.validate()
    const payload = {
      ...announcementForm,
      id: announcementForm.id ?? undefined
    }
    if (isEdit.value) {
      await updateAnnouncement(payload)
      ElMessage.success('更新成功')
    } else {
      await addAnnouncement(payload)
      ElMessage.success('发布成功')
    }
    dialogVisible.value = false
    loadAnnouncements()
  } catch (error) {
    console.error(error)
  }
}

const deleteAnnouncementItem = async (announcement: AnnouncementItem) => {
  try {
    await ElMessageBox.confirm('确定删除此公告吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteAnnouncement(announcement.id)
    ElMessage.success('删除成功')
    loadAnnouncements()
  } catch (error) {
    console.error(error)
  }
}

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  loadAnnouncements()
})
</script>

<style scoped>
.announcement {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.announcement-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title {
  font-weight: bold;
  font-size: 16px;
}

.actions {
  display: flex;
  gap: 10px;
}

.content {
  margin: 15px 0;
  line-height: 1.6;
}

.card-footer {
  margin-top: 10px;
  color: #999;
  font-size: 14px;
}

.no-data {
  text-align: center;
  margin-top: 50px;
}
</style>
