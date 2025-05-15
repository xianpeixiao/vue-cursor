<template>
  <el-menu
    class="workspace-sidebar"
    :default-active="activeMenu"
    :collapse="isCollapse"
    @select="handleSelect"
  >
    <el-sub-menu index="learning">
      <template #title>
        <Icon icon="mdi:book-open-page-variant" class="menu-icon" />
        <span>学习记录</span>
      </template>
      <el-menu-item index="learning-query">
        <Icon icon="mdi:magnify" class="menu-icon" />
        <span>查询记录</span>
      </el-menu-item>
      <el-menu-item index="learning-export">
        <Icon icon="mdi:file-export" class="menu-icon" />
        <span>导出记录</span>
      </el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="statistics">
      <template #title>
        <Icon icon="mdi:chart-box" class="menu-icon" />
        <span>数据统计</span>
      </template>
      <el-menu-item index="statistics-report">
        <Icon icon="mdi:file-chart" class="menu-icon" />
        <span>学习数据报表</span>
      </el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="maintenance">
      <template #title>
        <Icon icon="mdi:cog" class="menu-icon" />
        <span>系统维护</span>
      </template>
      <el-menu-item index="maintenance-logs">
        <Icon icon="mdi:text-box-search" class="menu-icon" />
        <span>系统日志</span>
      </el-menu-item>
      <el-menu-item index="maintenance-backup">
        <Icon icon="mdi:backup-restore" class="menu-icon" />
        <span>数据备份</span>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { Icon } from "@iconify/vue";

const emit = defineEmits(["select"]);

const activeMenu = ref("learning-query");
const isCollapse = ref(false);

const handleSelect = (index) => {
  activeMenu.value = index;
  emit("select", index);
};
</script>

<style scoped>
.workspace-sidebar {
  height: 100%;
  border-right: none;
}

.workspace-sidebar:not(.el-menu--collapse) {
  width: 240px;
}

.menu-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  vertical-align: middle;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  display: flex;
  align-items: center;
}

:deep(.el-sub-menu .el-menu-item) {
  min-width: auto;
  margin: 0 4px;
  border-radius: 4px;
}

:deep(.el-menu-item.is-active) {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>
