<template>
  <div class="user-list">
    <div class="toolbar">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="searchForm.department" placeholder="请选择部门">
            <el-option label="全部" value="" />
            <el-option label="技术部" value="tech" />
            <el-option label="市场部" value="marketing" />
            <el-option label="销售部" value="sales" />
            <el-option label="人事部" value="hr" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchUsers">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="resetSearch">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="addUser">
        <el-icon><Plus /></el-icon>
        添加用户
      </el-button>
    </div>

    <el-table :data="userList" stripe style="width: 100%">
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="realName" label="真实姓名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="department" label="部门">
        <template #default="scope">
          {{ getDepartmentLabel(scope.row.department) }}
        </template>
      </el-table-column>
      <el-table-column prop="role" label="角色">
        <template #default="scope">
          <el-tag :type="scope.row.role === 'admin' ? 'danger' : ''">
            {{ scope.row.role === "admin" ? "管理员" : "普通用户" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag :type="scope.row.status ? 'success' : 'info'">
            {{ scope.row.status ? "启用" : "禁用" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button-group>
            <el-button size="small" type="primary" @click="editUser(scope.row)">
              编辑
            </el-button>
            <el-button
              size="small"
              :type="scope.row.status ? 'warning' : 'success'"
              @click="toggleUserStatus(scope.row)"
            >
              {{ scope.row.status ? "禁用" : "启用" }}
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="deleteUser(scope.row)"
            >
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model="currentPage"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Search, Refresh, Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();

const searchForm = reactive({
  username: "",
  department: "",
});

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);

// 模拟用户数据
const userList = ref([
  {
    id: 1,
    username: "admin",
    realName: "管理员",
    email: "admin@example.com",
    phone: "13800138000",
    department: "tech",
    role: "admin",
    status: true,
  },
]);

const departmentMap = {
  tech: "技术部",
  marketing: "市场部",
  sales: "销售部",
  hr: "人事部",
};

const getDepartmentLabel = (value) => {
  return departmentMap[value] || value;
};

const searchUsers = () => {
  // TODO: 实现用户搜索逻辑
};

const resetSearch = () => {
  searchForm.username = "";
  searchForm.department = "";
  searchUsers();
};

const addUser = () => {
  router.push("/user/add");
};

const editUser = (user) => {
  router.push(`/user/edit?id=${user.id}`);
};

const toggleUserStatus = (user) => {
  ElMessageBox.confirm(
    `确定要${user.status ? "禁用" : "启用"}该用户吗？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(() => {
      // TODO: 实现用户状态切换逻辑
      user.status = !user.status;
      ElMessage.success(`${user.status ? "启用" : "禁用"}成功`);
    })
    .catch(() => {});
};

const deleteUser = (user) => {
  ElMessageBox.confirm("删除后无法恢复，是否确认删除？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // TODO: 实现用户删除逻辑
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  searchUsers();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  searchUsers();
};
</script>

<style scoped>
.user-list {
  padding: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-form {
  flex: 1;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-button-group .el-button) {
  margin-left: -1px;
}
</style>
