<template>
  <div class="bill-history">
    <div class="header">
      <h3>缴费历史</h3>
      <p>查看已生成账单、缴费状态与历史支付时间。</p>
    </div>

    <el-table :data="bills" style="width: 100%">
      <el-table-column prop="billItemName" label="账单名称" min-width="220" />
      <el-table-column prop="billType" label="类型" width="120" />
      <el-table-column prop="amount" label="金额" width="120" />
      <el-table-column prop="period" label="账期" width="140" />
      <el-table-column prop="status" label="状态" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">
            {{ scope.row.status === 1 ? '已缴费' : '未缴费' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="payTime" label="缴费时间" width="180" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getMyBills } from '@/apis/bill'
import type { BillItem } from '@/types/models'

const bills = ref<BillItem[]>([])

const loadBills = async () => {
  const res = await getMyBills()
  if (res.code === 200) {
    bills.value = res.data
  }
}

onMounted(() => {
  loadBills()
})
</script>

<style scoped>
.bill-history {
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
