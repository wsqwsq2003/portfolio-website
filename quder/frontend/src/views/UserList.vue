<template>
  <div class="user-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <el-button type="primary" @click="showAddDialog">添加用户</el-button>
        </div>
      </template>
      
      <el-table :data="users" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" width="180" />
        <el-table-column prop="email" label="邮箱" />
      </el-table>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog v-model="dialogVisible" title="添加用户" width="30%">
      <el-form :model="newUser" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="newUser.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="newUser.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddUser">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { userApi, type User } from '../api/user'

const users = ref<User[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const newUser = ref<User>({ name: '', email: '' })

// 加载用户列表
const loadUsers = async () => {
  loading.value = true
  try {
    const response = await userApi.getUsers()
    users.value = response.data
  } catch (error) {
    ElMessage.error('加载用户列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 显示添加对话框
const showAddDialog = () => {
  newUser.value = { name: '', email: '' }
  dialogVisible.value = true
}

// 添加用户
const handleAddUser = async () => {
  if (!newUser.value.name || !newUser.value.email) {
    ElMessage.warning('请填写完整信息')
    return
  }
  
  try {
    await userApi.addUser(newUser.value)
    ElMessage.success('添加成功')
    dialogVisible.value = false
    await loadUsers()
  } catch (error) {
    ElMessage.error('添加用户失败')
    console.error(error)
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-list {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
