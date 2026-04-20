<template>
  <div class="bill">
    <div class="header">
      <h3>{{ userStore.isOwner() ? '我的账单' : '账单管理' }}</h3>
      <div v-if="userStore.isPropertyManager() || userStore.isSystemAdmin()">
        <el-button type="primary" @click="showAddDialog">添加账单</el-button>
      </div>
    </div>

    <!-- 筛选条件 -->
    <el-form :inline="true" class="filter-form">
      <el-form-item label="账单类型">
        <el-select v-model="filterForm.billType" placeholder="请选择类型" clearable>
          <el-option label="物业费" value="物业费"></el-option>
          <el-option label="水费" value="水费"></el-option>
          <el-option label="电费" value="电费"></el-option>
          <el-option label="其他" value="其他"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
          <el-option label="未缴费" :value="0"></el-option>
          <el-option label="已缴费" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loadBills">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="bills" style="width: 100%">
      <el-table-column prop="propertyId" label="房产ID" v-if="!userStore.isOwner()"></el-table-column>
      <el-table-column prop="billType" label="账单类型"></el-table-column>
      <el-table-column prop="amount" label="金额(元)">
        <template #default="scope">
          ¥{{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column prop="period" label="账期"></el-table-column>
      <el-table-column prop="dueDate" label="到期日期"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">
            {{ scope.row.status === 1 ? '已缴费' : '未缴费' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="payTime" label="缴费时间" v-if="userStore.isPropertyManager() || userStore.isSystemAdmin()"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 0 && userStore.isOwner()"
            size="small"
            type="success"
            @click="payBillItem(scope.row)"
          >
            缴费
          </el-button>
          <el-button
            v-if="userStore.isPropertyManager() || userStore.isSystemAdmin()"
            size="small"
            @click="editBill(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="userStore.isPropertyManager() || userStore.isSystemAdmin()"
            size="small"
            type="danger"
            @click="deleteBillItem(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑账单对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑账单' : '添加账单'" width="500px">
      <el-form :model="billForm" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="房产ID" prop="propertyId" v-if="!userStore.isOwner()">
          <el-select v-model="billForm.propertyId" placeholder="请选择房产">
            <el-option
              v-for="property in properties"
              :key="property.id"
              :label="`${property.buildingNo}-${property.unitNo}-${property.roomNo}`"
              :value="property.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账单类型" prop="billType">
          <el-select v-model="billForm.billType">
            <el-option label="物业费" value="物业费"></el-option>
            <el-option label="水费" value="水费"></el-option>
            <el-option label="电费" value="电费"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input-number v-model="billForm.amount" :precision="2" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="账期" prop="period">
          <el-input v-model="billForm.period" placeholder="例如：2024-01"></el-input>
        </el-form-item>
        <el-form-item label="到期日期" prop="dueDate">
          <el-date-picker v-model="billForm.dueDate" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="billForm.status">
            <el-option label="未缴费" :value="0"></el-option>
            <el-option label="已缴费" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitBill">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMyBills, getAllBills, addBill, updateBill, deleteBill, payBill } from '@/apis/bill'
import { getAllProperties } from '@/apis/property'
import { useUserStore } from '@/stores/modules/user'
import type { BillItem, PropertyItem } from '@/types/models'

const userStore = useUserStore()
const bills = ref<BillItem[]>([])
const properties = ref<PropertyItem[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()

const filterForm = reactive({
  billType: '',
  status: null as number | null
})

const billForm = reactive({
  id: null as number | null,
  propertyId: null as number | null,
  billType: '',
  amount: null as number | null,
  period: '',
  dueDate: null as string | Date | null,
  status: 0
})

const rules = {
  propertyId: [{ required: true, message: '请选择房产', trigger: 'change' }],
  billType: [{ required: true, message: '请选择账单类型', trigger: 'change' }],
  amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
  period: [{ required: true, message: '请输入账期', trigger: 'blur' }],
  dueDate: [{ required: true, message: '请选择到期日期', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const loadBills = async () => {
  try {
    let res
    if (userStore.isPropertyManager() || userStore.isSystemAdmin()) {
      res = await getAllBills(filterForm)
    } else {
      res = await getMyBills()
    }
    if (res.code === 200) {
      bills.value = res.data
    }
  } catch (error) {
    console.error(error)
  }
}

const loadProperties = async () => {
  const res = await getAllProperties()
  if (res.code === 200) {
    properties.value = res.data
  }
}

const showAddDialog = () => {
  isEdit.value = false
  Object.assign(billForm, {
    id: null,
    propertyId: null,
    billType: '',
    amount: null,
    period: '',
    dueDate: null,
    status: 0
  })
  dialogVisible.value = true
}

const editBill = (bill: BillItem) => {
  isEdit.value = true
  Object.assign(billForm, bill)
  dialogVisible.value = true
}

const submitBill = async () => {
  try {
    await formRef.value.validate()
    const payload = {
      ...billForm,
      id: billForm.id ?? undefined,
      propertyId: billForm.propertyId ?? undefined,
      amount: billForm.amount ?? undefined,
      dueDate:
        typeof billForm.dueDate === 'string'
          ? billForm.dueDate
          : billForm.dueDate?.toISOString().slice(0, 10)
    }
    if (isEdit.value) {
      await updateBill(payload)
      ElMessage.success('更新成功')
    } else {
      await addBill(payload)
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    loadBills()
  } catch (error) {
    console.error(error)
  }
}

const deleteBillItem = async (bill: BillItem) => {
  try {
    await ElMessageBox.confirm('确定删除此账单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteBill(bill.id)
    ElMessage.success('删除成功')
    loadBills()
  } catch (error) {
    console.error(error)
  }
}

const payBillItem = async (bill: BillItem) => {
  try {
    await ElMessageBox.confirm(`确定支付 ¥${bill.amount} 吗？`, '确认缴费', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await payBill(bill.id)
    ElMessage.success('缴费成功')
    loadBills()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  loadBills()
  if (userStore.isPropertyManager() || userStore.isSystemAdmin()) {
    loadProperties()
  }
})
</script>

<style scoped>
.bill {
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

.bill :deep(.el-dialog .el-select),
.bill :deep(.el-dialog .el-date-editor) {
  width: 100%;
  min-width: 220px;
}
</style>
