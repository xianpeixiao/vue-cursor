<template>
  <div class="main-layout">
    <!-- 左侧菜单 -->
    <div class="sidebar">
      <div class="menu-switch">
        <div
          class="menu-item"
          :class="{ active: currentMainMenu === 'smart' }"
          @click="switchMainMenu('smart')"
        >
          <el-icon><Monitor /></el-icon>
          <span class="menu-text">智能驻场</span>
        </div>
        <div
          class="menu-item"
          :class="{ active: currentMainMenu === 'workspace' }"
          @click="switchMainMenu('workspace')"
        >
          <el-icon><Platform /></el-icon>
          <span class="menu-text">我的工作台</span>
        </div>
      </div>

      <!-- 智能驻场菜单 -->
      <transition name="slide-fade">
        <div v-show="currentMainMenu === 'smart'" class="sub-menu">
          <el-scrollbar>
            <el-menu
              :collapse="isCollapsed"
              :collapse-transition="false"
              background-color="#1a1a1a"
              text-color="#fff"
              active-text-color="#409EFF"
            >
              <el-menu-item index="1">
                <el-icon><User /></el-icon>
                <template #title>客户成功</template>
              </el-menu-item>
              <el-menu-item index="2">
                <el-icon><Service /></el-icon>
                <template #title>在线客服</template>
              </el-menu-item>
              <el-menu-item index="3">
                <el-icon><Tools /></el-icon>
                <template #title>运维工程师</template>
              </el-menu-item>
            </el-menu>
          </el-scrollbar>
        </div>
      </transition>

      <!-- 工作台菜单 -->
      <transition name="slide-fade">
        <div v-show="currentMainMenu === 'workspace'" class="sub-menu">
          <el-scrollbar>
            <el-menu
              :collapse="isCollapsed"
              :collapse-transition="false"
              background-color="#1a1a1a"
              text-color="#fff"
              active-text-color="#409EFF"
              @select="handleWorkspaceMenuSelect"
            >
              <template v-if="currentRole === 'manager'">
                <el-sub-menu index="user">
                  <template #title>
                    <el-icon><User /></el-icon>
                    <span>用户管理</span>
                  </template>
                  <el-menu-item index="user-add">添加用户</el-menu-item>
                  <el-menu-item index="user-list">用户列表</el-menu-item>
                  <el-menu-item index="user-edit">修改用户</el-menu-item>
                </el-sub-menu>

                <el-sub-menu index="course">
                  <template #title>
                    <div @click.stop="router.push('/course-management')">
                      <el-icon><Reading /></el-icon>
                      <span>课程管理</span>
                    </div>
                  </template>
                  <el-menu-item index="course-upload">上传课程</el-menu-item>
                  <el-menu-item index="course-edit">编辑课程</el-menu-item>
                  <el-menu-item index="course-list">课程列表</el-menu-item>
                </el-sub-menu>

                <el-sub-menu index="learning">
                  <template #title>
                    <el-icon><Document /></el-icon>
                    <span>学习记录</span>
                  </template>
                  <el-menu-item index="learning-query">查询记录</el-menu-item>
                  <el-menu-item index="learning-export">导出记录</el-menu-item>
                </el-sub-menu>

                <el-sub-menu index="statistics">
                  <template #title>
                    <el-icon><DataLine /></el-icon>
                    <span>数据统计</span>
                  </template>
                  <el-menu-item index="statistics-report"
                    >学习数据报表</el-menu-item
                  >
                </el-sub-menu>

                <el-sub-menu index="maintenance">
                  <template #title>
                    <el-icon><Setting /></el-icon>
                    <span>系统维护</span>
                  </template>
                  <el-menu-item index="maintenance-logs">系统日志</el-menu-item>
                  <el-menu-item index="maintenance-backup"
                    >数据备份</el-menu-item
                  >
                </el-sub-menu>
              </template>

              <template v-else-if="currentRole === 'director'">
                <el-sub-menu index="training">
                  <template #title>
                    <el-icon><Calendar /></el-icon>
                    <span>培训计划</span>
                  </template>
                  <el-menu-item index="training-create">制定计划</el-menu-item>
                  <el-menu-item index="training-publish">发布计划</el-menu-item>
                  <el-menu-item index="training-track">跟踪计划</el-menu-item>
                </el-sub-menu>

                <el-sub-menu index="lecturer">
                  <template #title>
                    <el-icon><User /></el-icon>
                    <span>讲师管理</span>
                  </template>
                  <el-menu-item index="lecturer-info">内训师信息</el-menu-item>
                  <el-menu-item index="lecturer-schedule"
                    >课程安排</el-menu-item
                  >
                </el-sub-menu>

                <el-sub-menu index="analysis">
                  <template #title>
                    <el-icon><DataAnalysis /></el-icon>
                    <span>数据分析</span>
                  </template>
                  <el-menu-item index="analysis-effect"
                    >培训效果分析</el-menu-item
                  >
                  <el-menu-item index="analysis-behavior"
                    >学习行为分析</el-menu-item
                  >
                </el-sub-menu>
              </template>
            </el-menu>
          </el-scrollbar>
        </div>
      </transition>

      <!-- 角色切换 - 只在工作台显示 -->
      <transition name="fade">
        <div v-if="currentMainMenu === 'workspace'" class="role-switch">
          <el-radio-group v-model="currentRole" size="large">
            <el-radio-button label="manager">
              <el-icon><User /></el-icon>
              <span class="role-text">培训经理</span>
            </el-radio-button>
            <el-radio-button label="director">
              <el-icon><UserFilled /></el-icon>
              <span class="role-text">培训总监</span>
            </el-radio-button>
          </el-radio-group>
        </div>
      </transition>
    </div>

    <!-- 右侧内容区 -->
    <div class="main-content" :class="{ 'is-expanded': isCollapsed }">
      <router-view v-slot="{ Component }">
        <transition name="slide-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  User,
  UserFilled,
  Service,
  Tools,
  Reading,
  Document,
  DataLine,
  Setting,
  Calendar,
  DataAnalysis,
  Fold,
  Expand,
  Monitor,
  Platform,
  Search,
  Upload,
  TrendCharts,
  Files,
} from "@element-plus/icons-vue";
import { messageStore } from "../store/messageStore";

const router = useRouter();
const currentMainMenu = ref("workspace");
const currentRole = ref("manager");
let autoSwitchTimer = null;

// 监听主菜单变化
watch(currentMainMenu, (newMenu) => {
  if (newMenu === "smart") {
    // 设置3秒后自动切换到工作台
    autoSwitchTimer = setTimeout(() => {
      switchMainMenu("workspace");
    }, 3000);
  } else {
    // 清除定时器
    if (autoSwitchTimer) {
      clearTimeout(autoSwitchTimer);
      autoSwitchTimer = null;
    }
  }
});

// 组件卸载时清除定时器
onMounted(() => {
  return () => {
    if (autoSwitchTimer) {
      clearTimeout(autoSwitchTimer);
    }
  };
});

// 监听角色变化
watch(currentRole, (newRole) => {
  // 根据角色切换到对应的默认页面
  if (newRole === "manager") {
    router.push("/course-management");
  } else {
    router.push("/training-plan");
  }
});

// 切换主菜单
const switchMainMenu = (menu) => {
  currentMainMenu.value = menu;
  if (menu === "smart") {
    router.push("/customer-success");
  } else {
    // 根据当前角色跳转到对应的默认页面
    if (currentRole.value === "manager") {
      router.push("/course-management");
    } else {
      router.push("/training-plan");
    }
  }
};

// 处理工作台菜单选择
const handleWorkspaceMenuSelect = (index) => {
  // 根据选择的菜单项进行相应的路由跳转
  switch (index) {
    // 培训经理菜单
    case "user-add":
      router.push("/user/add");
      break;
    case "user-list":
      router.push("/user/list");
      break;
    case "user-edit":
      router.push("/user/edit");
      break;
    case "course":
      router.push("/course-management");
      break;
    case "course-upload":
      // 重定向到课程管理并设置步骤为0
      router.push("/course-management");
      messageStore.setPendingFeatureMessage(
        "您点击了「上传课程」功能。请在此处完成课程上传操作。"
      );
      // 设置一个延时，等待路由完成后设置步骤
      setTimeout(() => {
        messageStore.setStep(0);
      }, 300);
      break;
    case "course-edit":
      // 重定向到课程管理并设置步骤为1
      router.push("/course-management");
      messageStore.setPendingFeatureMessage(
        "您点击了「编辑课程」功能。请在此处编辑您的课程内容。"
      );
      // 设置一个延时，等待路由完成后设置步骤
      setTimeout(() => {
        messageStore.setStep(1);
      }, 300);
      break;
    case "course-list":
      // 重定向到课程管理并设置步骤为3
      router.push("/course-management");
      messageStore.setPendingFeatureMessage(
        "您点击了「课程列表」功能。您可以在此查看和管理所有课程。"
      );
      // 设置一个延时，等待路由完成后设置步骤
      setTimeout(() => {
        messageStore.setStep(3);
      }, 300);
      break;
    default:
      // 对于未实现的路由，不再显示弹窗提示，而是通过消息存储传递信息
      router.push("/course-management");
      messageStore.setPendingFeatureMessage(
        `您点击的「${getMenuName(
          index
        )}」功能尚未开发完成。系统将在后续版本中推出此功能，请耐心等待。`
      );
      break;
  }
};

// 根据菜单索引获取菜单名称
const getMenuName = (index) => {
  const menuMap = {
    "learning-query": "查询记录",
    "learning-export": "导出记录",
    "statistics-report": "学习数据报表",
    "maintenance-logs": "系统日志",
    "maintenance-backup": "数据备份",
    "training-create": "制定计划",
    "training-publish": "发布计划",
    "training-track": "跟踪计划",
    "lecturer-info": "内训师信息",
    "lecturer-schedule": "课程安排",
    "analysis-effect": "培训效果分析",
    "analysis-behavior": "学习行为分析",
  };

  return menuMap[index] || index;
};
</script>

<style lang="scss" scoped>
// 基础变量
:root {
  --sidebar-width: 33.333vw;
  --sidebar-min-width: 280px;
  --sidebar-max-width: 400px;
  --collapsed-width: 64px;
  --transition-duration: 0.3s;
}

.main-layout {
  display: grid;
  grid-template-columns: repeat(32, 1fr);
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #f0f2f5;
  gap: clamp(16px, 2vw, 24px);
  padding: clamp(16px, 2vw, 24px);
}

.sidebar {
  grid-column: 2 / 8;
  position: relative;
  height: 100%;
  background-color: #1a1a1a;
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: all var(--transition-duration) ease;
  border-radius: 12px;
  overflow: hidden;
  min-width: 0;
}

.main-content {
  grid-column: 9 / 31;
  min-width: 0;
  padding: clamp(24px, 3vw, 32px);
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.05);
  overflow: auto;
  transition: all var(--transition-duration) ease;
  display: flex;
  flex-direction: column;
}

.menu-switch {
  padding: clamp(12px, 1.5vw, 16px);
  display: flex;
  gap: clamp(8px, 1.5vw, 16px);
  justify-content: center;
  margin: 0 auto;
  width: 90%;

  .menu-item {
    flex: 1;
    min-width: 0;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 clamp(12px, 2vw, 20px);
    border-radius: 4px;
    cursor: pointer;
    transition: all var(--transition-duration) ease;
    white-space: nowrap;

    .el-icon {
      font-size: 18px;
    }

    .menu-text {
      font-size: 14px;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    &.active {
      background-color: var(--el-color-primary);
      color: #fff;
    }
  }
}

.sub-menu {
  flex: 1;
  overflow: hidden;
  position: relative;
  min-width: 0;

  .el-scrollbar {
    height: 100%;
  }

  :deep(.el-scrollbar__wrap) {
    overflow-x: hidden;
  }

  :deep(.el-menu) {
    border-right: none;
  }
}

.role-switch {
  padding: clamp(12px, 1.5vw, 16px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;

  .el-radio-group {
    width: 90%;
    margin: 0 auto;
    display: flex;
    gap: clamp(8px, 1.5vw, 16px);
    justify-content: center;

    .el-radio-button {
      flex: 1;
      max-width: 45%;

      :deep(.el-radio-button__inner) {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 8px 0;
      }
    }
  }
}

// 响应式布局优化
@media screen and (max-width: 1600px) {
  .sidebar {
    grid-column: 2 / 9;
  }

  .main-content {
    grid-column: 10 / 31;
  }
}

@media screen and (max-width: 1200px) {
  .main-layout {
    gap: clamp(12px, 1.5vw, 16px);
    padding: clamp(12px, 1.5vw, 16px);
  }

  .sidebar {
    grid-column: 1 / 10;
  }

  .main-content {
    grid-column: 11 / 31;
  }
}

@media screen and (max-width: 768px) {
  .main-layout {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 0;
  }

  .sidebar {
    position: fixed;
    z-index: 1000;
    width: min(280px, 80vw);
  }

  .main-content {
    flex: 1;
    margin-left: min(280px, 80vw);
    width: calc(100% - min(280px, 80vw));
    border-radius: 0;
  }

  .menu-switch {
    width: 95%;
    padding: clamp(8px, 1vw, 12px);
    gap: clamp(4px, 1vw, 8px);
  }
}

// 滚动条样式
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;

  &:hover {
    background: #555;
  }
}

// 添加滑动动画
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

// 角色切换淡入淡出动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
