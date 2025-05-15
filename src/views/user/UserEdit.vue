<template>
  <div class="user-edit">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <h3>编辑用户</h3>
        </div>
      </template>
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="rules"
        label-width="100px"
        class="user-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" disabled />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="userForm.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="userForm.department" placeholder="请选择部门">
            <el-option label="技术部" value="tech" />
            <el-option label="市场部" value="marketing" />
            <el-option label="销售部" value="sales" />
            <el-option label="人事部" value="hr" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="重置密码">
          <el-button type="warning" @click="resetPassword">重置密码</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(userFormRef)">
            保存
          </el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";

const route = useRoute();
const router = useRouter();
const userFormRef = ref();

const userForm = reactive({
  username: "",
  realName: "",
  email: "",
  phone: "",
  department: "",
  role: "",
});

const rules = {
  realName: [{ required: true, message: "请输入真实姓名", trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱地址", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
  ],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
  department: [{ required: true, message: "请选择部门", trigger: "change" }],
  role: [{ required: true, message: "请选择角色", trigger: "change" }],
};

onMounted(() => {
  const userId = route.query.id;
  if (userId) {
    // TODO: 根据用户ID获取用户信息
    // 这里模拟获取用户数据
    Object.assign(userForm, {
      username: "admin",
      realName: "管理员",
      email: "admin@example.com",
      phone: "13800138000",
      department: "tech",
      role: "admin",
    });
  }
});

const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      // TODO: 实现保存用户信息的逻辑
      ElMessage.success("保存成功");
      goBack();
    }
  });
};

const resetPassword = () => {
  ElMessageBox.confirm("确定要重置该用户的密码吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // TODO: 实现密码重置逻辑
      ElMessage.success("密码重置成功");
    })
    .catch(() => {});
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.user-edit {
  padding: 20px;
}

.form-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.user-form {
  margin-top: 20px;
}

:deep(.el-select) {
  width: 100%;
}
</style>
