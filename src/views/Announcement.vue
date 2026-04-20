<template>
  <div class="announcement">
    <h3>公告通知</h3>
    <el-card v-for="item in announcements" :key="item.id" class="announcement-card">
      <template #header>
        <div class="card-header">
          <span>{{ item.title }}</span>
          <el-tag v-if="item.isTop === 1" type="danger">置顶</el-tag>
        </div>
      </template>
      <p>{{ item.content }}</p>
      <div class="card-footer">
        发布时间：{{ item.publishTime }}
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAnnouncements } from '@/apis/announcement'

const announcements = ref([])

onMounted(async () => {
  const res = await getAnnouncements()
  if (res.code === 1) {
    announcements.value = res.data
  }
})
</script>

<style scoped>
.announcement {
  padding: 20px;
}

.announcement-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-footer {
  margin-top: 10px;
  color: #999;
  font-size: 12px;
}
</style>