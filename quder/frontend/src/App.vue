<template>
  <div id="app">
    <el-container>
      <el-header>
        <h1>全栈项目示例 - Vue 3 + Spring Boot</h1>
      </el-header>
      <el-main>
        <UserList />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import UserList from './views/UserList.vue'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}

.el-header {
  background-color: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-header h1 {
  margin: 0;
  font-size: 24px;
}

.el-main {
  padding: 20px;
  background-color: #f5f7fa;
}
</style>
