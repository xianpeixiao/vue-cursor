import { reactive } from "vue";

// 创建一个简单的状态管理服务
export const messageStore = reactive({
  pendingFeatureMessage: "", // 存储未完成功能的提示信息
  currentStep: -1, // 当前要设置的步骤，-1表示不设置

  // 设置未完成功能的消息
  setPendingFeatureMessage(message) {
    this.pendingFeatureMessage = message;
  },

  // 清除消息
  clearPendingFeatureMessage() {
    this.pendingFeatureMessage = "";
  },

  // 设置步骤
  setStep(step) {
    this.currentStep = step;
  },

  // 获取并清除步骤
  getAndClearStep() {
    const step = this.currentStep;
    this.currentStep = -1;
    return step;
  },
});
