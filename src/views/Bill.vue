<template>
  <div class="bill">
    <h3>费用中心</h3>
    <el-table :data="bills" style="width: 100%">
      <el-table-column prop="billType" label="账单类型"></el-table-column>
      <el-table-column prop="amount" label="金额"></el-table-column>
      <el-table-column prop="period" label="账期"></el-table-column>
      <el-table-column prop="dueDate" label="到期日期"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          {{ scope.row.status === 1 ? '已缴费' : '未缴费' }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMyBills } from '@/apis/bill'

const bills = ref([])

onMounted(async () => {
  const res = await getMyBills()
  if (res.code === 1) {
    bills.value = res.data
  }
})
</script>

<style scoped>
.bill {
  padding: 20px;
}
</style>