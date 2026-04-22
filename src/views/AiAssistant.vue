<template>
  <div class="ai-assistant">
    <section class="hero-card">
      <div>
        <p class="eyebrow">业主智能客服</p>
        <h2>快速查询你的房产、账单、报修和公告</h2>
        <p class="hero-text">
          适合毕业设计演示的简化版客服。它会结合你当前账号的数据回答物业系统相关问题。
        </p>
      </div>
      <el-tag type="success" size="large">仅支持业主个人数据</el-tag>
    </section>

    <el-row :gutter="20">
      <el-col :xs="24" :lg="16">
        <el-card class="chat-card">
          <template #header>
            <div class="section-header">
              <span>智能问答</span>
              <span class="header-note">问题越具体，回答越稳定</span>
            </div>
          </template>

          <el-input
            v-model="question"
            type="textarea"
            :rows="5"
            maxlength="200"
            show-word-limit
            resize="none"
            placeholder="例如：我最近有未缴费账单吗？"
          />

          <div class="action-row">
            <el-button type="primary" :loading="loading" @click="submitQuestion">发送问题</el-button>
            <el-button :disabled="loading" @click="clearChat">清空</el-button>
          </div>

          <div class="answer-panel">
            <div class="answer-label">回答结果</div>
            <el-empty v-if="!answer" description="提交问题后，这里会显示系统回答" />
            <template v-else>
              <div class="category-chip">问题分类：{{ categoryLabel }}</div>
              <div class="answer-text">{{ answer }}</div>
            </template>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card class="tips-card">
          <template #header>
            <div class="section-header">
              <span>示例问题</span>
            </div>
          </template>

          <div class="question-list">
            <el-button
              v-for="item in suggestedQuestions"
              :key="item"
              class="question-button"
              text
              bg
              @click="fillQuestion(item)"
            >
              {{ item }}
            </el-button>
          </div>

          <div class="tips-block">
            <div class="tips-title">支持范围</div>
            <ul>
              <li>我的房产绑定情况</li>
              <li>我的账单和缴费状态</li>
              <li>我的报修进度</li>
              <li>最近公告和业务流程说明</li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { chatWithAi } from '@/apis/ai'

const suggestedQuestions = [
  '我名下有哪些房产？',
  '我有没有未缴费账单？',
  '我最近的报修进度怎么样？',
  '最近有哪些公告？',
  '怎么提交报修？'
]

const question = ref('')
const answer = ref('')
const category = ref('')
const loading = ref(false)

const categoryLabelMap: Record<string, string> = {
  PROPERTY: '房产',
  BILL: '账单',
  REPAIR: '报修',
  ANNOUNCEMENT: '公告',
  GENERAL: '通用说明'
}

const categoryLabel = computed(() => categoryLabelMap[category.value] || '未知')

const fillQuestion = (value: string) => {
  question.value = value
}

const clearChat = () => {
  question.value = ''
  answer.value = ''
  category.value = ''
}

const submitQuestion = async () => {
  const message = question.value.trim()
  if (!message) {
    ElMessage.warning('请输入问题')
    return
  }

  loading.value = true
  try {
    const res = await chatWithAi(message)
    if (res.code === 200) {
      answer.value = res.data.answer
      category.value = res.data.category
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.ai-assistant {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero-card {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 28px;
  border-radius: 24px;
  color: #fff;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.25), transparent 30%),
    linear-gradient(135deg, #14532d 0%, #0f766e 100%);
  box-shadow: 0 24px 48px rgba(15, 118, 110, 0.18);
}

.eyebrow {
  margin: 0 0 8px;
  opacity: 0.82;
  letter-spacing: 0.08em;
}

.hero-card h2 {
  margin: 0;
  font-size: 30px;
}

.hero-text {
  max-width: 640px;
  margin: 12px 0 0;
  line-height: 1.7;
  opacity: 0.92;
}

.chat-card,
.tips-card {
  border-radius: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.header-note {
  color: #94a3b8;
  font-size: 12px;
}

.action-row {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.answer-panel {
  margin-top: 20px;
  padding: 18px;
  border-radius: 18px;
  background: linear-gradient(180deg, #f8fafc 0%, #eef6f3 100%);
  min-height: 200px;
}

.answer-label {
  margin-bottom: 12px;
  font-weight: 600;
  color: #0f172a;
}

.category-chip {
  display: inline-flex;
  margin-bottom: 12px;
  padding: 6px 12px;
  border-radius: 999px;
  background: #dcfce7;
  color: #166534;
  font-size: 13px;
}

.answer-text {
  white-space: pre-wrap;
  line-height: 1.8;
  color: #334155;
}

.question-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.question-button {
  justify-content: flex-start;
  white-space: normal;
  height: auto;
  padding: 12px 14px;
}

.tips-block {
  margin-top: 20px;
  padding: 18px;
  border-radius: 18px;
  background: #f8fafc;
}

.tips-title {
  margin-bottom: 10px;
  font-weight: 600;
  color: #0f172a;
}

.tips-block ul {
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
