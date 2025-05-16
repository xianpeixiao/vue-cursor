<template>
  <div class="course-management">
    <el-steps :active="currentStep" finish-status="success" class="steps">
      <el-step title="上传课程" @click.native="setStep(0)" />
      <el-step title="编辑课程" @click.native="setStep(1)" />
      <el-step title="发布课程" @click.native="setStep(2)" />
      <el-step title="课程列表" @click.native="setStep(3)" />
    </el-steps>

    <div class="step-content">
      <!-- 聊天界面 -->
      <div class="chat-container">
        <div class="chat-messages" ref="chatMessagesRef">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="[
              'message',
              message.type === 'bot' ? 'bot-message' : 'user-message',
            ]"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="message-avatar">
              <el-avatar
                :icon="message.type === 'bot' ? 'ChatDotRound' : 'User'"
                :size="40"
                :color="message.type === 'bot' ? '#409EFF' : '#909399'"
                class="pulsing-avatar"
              />
            </div>
            <div class="message-content">
              <div class="message-text">
                <template v-if="message.isTyping">
                  <span class="typing-indicator">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                  </span>
                </template>
                <template v-else>
                  {{ message.text }}
                  <div
                    v-if="message.actions && message.actions.length"
                    class="message-actions"
                  >
                    <el-button
                      v-for="(action, actionIndex) in message.actions"
                      :key="actionIndex"
                      size="small"
                      round
                      @click="handleActionClick(action)"
                    >
                      {{ action.text }}
                    </el-button>
                  </div>
                </template>
              </div>
              <div class="message-time">{{ message.time }}</div>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <el-input
            v-model="userInput"
            placeholder="请输入消息..."
            @keyup.enter="sendMessage"
            :disabled="isTyping"
          >
            <template #prepend>
              <el-button circle type="primary" class="voice-btn">
                <el-icon><Microphone /></el-icon>
              </el-button>
            </template>
            <template #append>
              <el-button
                @click="sendMessage"
                :disabled="isTyping"
                class="send-btn"
              >
                <el-icon><Position /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
      </div>

      <!-- 步骤控制按钮 -->
      <div class="step-controls">
        <el-button v-if="currentStep > 0" @click="prevStep">上一步</el-button>
        <el-button v-if="currentStep < 3" type="primary" @click="nextStep">
          {{ currentStep === 2 ? "发布" : "下一步" }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from "vue";
import {
  UploadFilled,
  ChatDotRound,
  User,
  Position,
  Microphone,
} from "@element-plus/icons-vue";
import { messageStore } from "../store/messageStore";

const currentStep = ref(0);
const userInput = ref("");
const messages = ref([]);
const chatMessagesRef = ref(null);
const isTyping = ref(false);

// 步骤对应的引导消息
const stepGuides = {
  0: [
    {
      text: "欢迎来到课程上传环节！我是您的AI助手，您可以告诉我课程的名称是什么？",
      actions: [
        { text: "如何上传文件?", value: "howToUpload" },
        { text: "查看支持的文件格式", value: "fileFormats" },
      ],
    },
    {
      text: "接下来，请选择课程的分类，我们支持技术培训、管理培训或通用技能等多种分类，您的课程属于哪一类呢？",
      actions: [
        { text: "技术培训", value: "tech" },
        { text: "管理培训", value: "management" },
        { text: "通用技能", value: "general" },
      ],
    },
    {
      text: "请为这门课程添加一个简短的描述，这将帮助学员了解课程的主要内容和学习目标。",
    },
    {
      text: "非常好！现在，您可以上传课程文件了，支持PPT、PDF、Word等格式。您可以拖拽文件到对话框，或者点击上传按钮。",
      actions: [
        { text: "上传文件", value: "upload" },
        { text: "稍后上传", value: "later" },
      ],
    },
  ],
  1: [
    {
      text: "进入课程编辑环节！您可以编辑课程的详细内容了。需要我帮您设置课程章节结构吗？",
      actions: [
        { text: "使用默认章节结构", value: "defaultStructure" },
        { text: "自定义章节", value: "customStructure" },
      ],
    },
    {
      text: "您想如何组织这门课程的内容？可以按照主题划分章节，或者按照难度级别来组织。",
      actions: [
        { text: "按主题划分", value: "byTopic" },
        { text: "按难度级别", value: "byLevel" },
      ],
    },
    {
      text: "别忘了上传一些补充资料，如练习题、案例研究或代码示例，这些资料将帮助学员更好地掌握知识点。",
      actions: [
        { text: "上传练习题", value: "uploadExercises" },
        { text: "上传案例研究", value: "uploadCases" },
        { text: "上传代码示例", value: "uploadCode" },
      ],
    },
  ],
  2: [
    {
      text: "准备发布您的课程了！您希望什么时候发布这门课程？可以选择立即发布或设置一个未来的发布时间。",
      actions: [
        { text: "立即发布", value: "publishNow" },
        { text: "定时发布", value: "scheduledPublish" },
      ],
    },
    {
      text: "这门课程大约需要多长时间完成？请估算学习时长，这将帮助学员合理安排学习计划。",
      actions: [
        { text: "1-5小时", value: "1-5" },
        { text: "5-10小时", value: "5-10" },
        { text: "10+小时", value: "10+" },
      ],
    },
    {
      text: "您期望哪些人来学习这门课程？请选择目标学员群体，这将帮助我们向合适的用户推荐您的课程。",
      actions: [
        { text: "新员工", value: "new" },
        { text: "技术人员", value: "tech" },
        { text: "管理人员", value: "management" },
        { text: "所有人员", value: "all" },
      ],
    },
    {
      text: "最后，为课程添加一些标签，这将提高课程的可搜索性，帮助学员更容易找到您的课程。常用的标签有：入门、进阶、实战等。",
      actions: [{ text: "添加标签", value: "addTags" }],
    },
  ],
  3: [
    {
      text: "这里展示了您的所有课程，包括已发布和草稿状态的课程。您可以查看每门课程的基本信息和状态。",
      actions: [
        { text: "查看已发布课程", value: "viewPublished" },
        { text: "查看草稿课程", value: "viewDrafts" },
      ],
    },
    {
      text: "需要编辑或删除某门课程吗？点击相应的课程后面的操作按钮即可进行相应操作。您也可以复制现有课程创建新版本。",
      actions: [
        { text: "如何复制课程?", value: "howToCopy" },
        { text: "如何查看课程数据?", value: "viewStats" },
      ],
    },
    {
      text: '您可以随时返回前面的步骤创建新的课程。点击上方的"上传课程"按钮即可开始创建新课程。',
      actions: [{ text: "创建新课程", value: "createNew" }],
    },
  ],
};

// 初始化消息
onMounted(() => {
  showBotMessage(stepGuides[0][0]);
});

// 监听步骤变化，显示对应的引导消息
watch(currentStep, (newStep) => {
  if (stepGuides[newStep] && stepGuides[newStep].length > 0) {
    showBotMessage(stepGuides[newStep][0]);
  }
});

// 监听消息存储中的未完成功能消息
watch(
  () => messageStore.pendingFeatureMessage,
  (newMessage) => {
    if (newMessage) {
      // 有新消息时，通过AI机器人显示
      showPendingFeatureMessage(newMessage);
      // 清除消息
      messageStore.clearPendingFeatureMessage();

      // 检查是否需要设置步骤
      const step = messageStore.getAndClearStep();
      if (step >= 0) {
        currentStep.value = step;
      }
    }
  }
);

// 设置当前步骤
const setStep = (step) => {
  if (step >= 0 && step <= 3) {
    currentStep.value = step;
  }
};

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const showBotMessage = (messageObj) => {
  // 添加一个"正在输入"的消息
  const typingMessage = {
    type: "bot",
    isTyping: true,
    text: "",
    time: formatTime(),
  };

  messages.value.push(typingMessage);
  scrollToBottom();
  isTyping.value = true;

  // 模拟打字延迟
  setTimeout(() => {
    // 移除"正在输入"的消息
    messages.value.pop();

    // 添加实际消息
    const actualMessage = {
      type: "bot",
      isTyping: false,
      text: messageObj.text,
      actions: messageObj.actions,
      time: formatTime(),
    };

    messages.value.push(actualMessage);
    scrollToBottom();
    isTyping.value = false;
  }, 1500);
};

const addUserMessage = (text) => {
  messages.value.push({
    type: "user",
    text: text,
    time: formatTime(),
  });
  scrollToBottom();
};

const sendMessage = () => {
  if (!userInput.value.trim() || isTyping.value) return;

  addUserMessage(userInput.value);

  // 模拟AI回复
  isTyping.value = true;
  setTimeout(() => {
    const step = currentStep.value;
    const guideIndex = Math.min(
      messages.value.filter((m) => m.type === "user").length %
        stepGuides[step].length,
      stepGuides[step].length - 1
    );
    showBotMessage(stepGuides[step][guideIndex]);
  }, 1000);

  userInput.value = "";
};

const handleActionClick = (action) => {
  // 处理消息中的按钮点击
  console.log("Action clicked:", action);

  // 模拟用户点击后的操作，这里仅作示例
  let responseText = "";

  switch (action.value) {
    case "howToUpload":
      responseText = "如何上传文件";
      break;
    case "fileFormats":
      responseText = "查看支持的文件格式";
      break;
    case "upload":
      responseText = "我要上传文件";
      break;
    case "acknowledge":
      responseText = "我知道了";
      // 不需要AI回复
      addUserMessage(responseText);
      return;
    case "help":
      responseText = "我需要更多帮助";
      // 添加用户消息
      addUserMessage(responseText);
      // AI回复帮助信息
      setTimeout(() => {
        showBotMessage({
          text: "您可以通过点击顶部的步骤按钮来切换不同的课程管理环节。如果您有任何问题，请随时告诉我，我将竭诚为您服务。",
          actions: [{ text: "谢谢", value: "thanks" }],
        });
      }, 1000);
      return;
    // 可以添加更多的处理逻辑
    default:
      responseText = `我选择了: ${action.text}`;
  }

  // 添加用户消息
  addUserMessage(responseText);

  // 模拟AI回复
  isTyping.value = true;
  setTimeout(() => {
    const step = currentStep.value;
    // 这里可以基于不同的action返回不同的回复
    const nextIndex =
      messages.value.filter((m) => m.type === "user").length %
      stepGuides[step].length;
    showBotMessage(stepGuides[step][nextIndex]);
  }, 1000);
};

const formatTime = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
    }
  });
};

// 显示未完成功能的消息
const showPendingFeatureMessage = (message) => {
  // 添加一个"正在输入"的消息
  const typingMessage = {
    type: "bot",
    isTyping: true,
    text: "",
    time: formatTime(),
  };

  messages.value.push(typingMessage);
  scrollToBottom();
  isTyping.value = true;

  // 模拟打字延迟
  setTimeout(() => {
    // 移除"正在输入"的消息
    messages.value.pop();

    // 添加实际消息
    const actualMessage = {
      type: "bot",
      isTyping: false,
      text: message,
      actions: [
        { text: "我知道了", value: "acknowledge" },
        { text: "查看更多帮助", value: "help" },
      ],
      time: formatTime(),
    };

    messages.value.push(actualMessage);
    scrollToBottom();
    isTyping.value = false;
  }, 1500);
};
</script>

<style lang="scss" scoped>
.course-management {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  position: relative;
  font-size: 1em;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      var(--primary-color),
      var(--success-color)
    );
  }

  .steps {
    margin-bottom: 24px;
    padding: 20px 0;
    cursor: pointer;

    :deep(.el-step__title) {
      font-size: 1em;
      line-height: 1.4;
      transition: color 0.3s, transform 0.3s;

      &:hover {
        transform: translateY(-2px);
        color: var(--primary-color);
      }
    }

    :deep(.el-step__description) {
      font-size: 0.9em;
    }

    @media screen and (max-width: 768px) {
      :deep(.el-step__main) {
        text-align: center;
      }
    }
  }

  .step-content {
    flex: 1;
    min-height: 0;
    padding: 24px;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    position: relative;
    background-color: #fff;
    overflow: auto;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.05);
    }
  }

  .chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 400px;
    background-color: #f9f9f9;
    border-radius: 8px;
    overflow: hidden;
    background-image: radial-gradient(
        circle at 10% 20%,
        rgba(0, 123, 255, 0.03) 0%,
        transparent 20%
      ),
      radial-gradient(
        circle at 90% 80%,
        rgba(0, 200, 83, 0.03) 0%,
        transparent 20%
      );
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.03);
    transition: all 0.3s ease;
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    scroll-behavior: smooth;
  }

  .message {
    display: flex;
    margin-bottom: 16px;
    max-width: 80%;
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      filter: brightness(1.03);
    }
  }

  .bot-message {
    align-self: flex-start;
  }

  .user-message {
    align-self: flex-end;
    flex-direction: row-reverse;
  }

  .message-avatar {
    margin: 0 12px;

    .pulsing-avatar {
      transition: all 0.3s ease;
      animation: pulse 2s infinite;
      box-shadow: 0 0 0 rgba(64, 158, 255, 0.4);

      &:hover {
        animation: none;
        transform: scale(1.1);
      }
    }
  }

  .message-content {
    padding: 12px 16px;
    border-radius: 10px;
    position: relative;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
  }

  .bot-message .message-content {
    background-color: #e6f7ff;
    border-top-left-radius: 0;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: -10px;
      width: 0;
      height: 0;
      border-top: 10px solid #e6f7ff;
      border-left: 10px solid transparent;
    }
  }

  .user-message .message-content {
    background-color: #d8f5d8;
    border-top-right-radius: 0;
    text-align: right;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      right: -10px;
      width: 0;
      height: 0;
      border-top: 10px solid #d8f5d8;
      border-right: 10px solid transparent;
    }
  }

  .message-text {
    font-size: 1em;
    line-height: 1.5;
    word-break: break-word;
  }

  .message-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;

    .el-button {
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }

  .message-time {
    font-size: 0.7em;
    color: #999;
    margin-top: 4px;
  }

  .typing-indicator {
    display: inline-flex;
    align-items: center;

    .dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #5c5c5c;
      margin: 0 2px;
      animation: typingAnimation 1.2s infinite ease-in-out;

      &:nth-child(1) {
        animation-delay: 0s;
      }

      &:nth-child(2) {
        animation-delay: 0.2s;
      }

      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
  }

  .chat-input {
    padding: 16px;
    background-color: #fff;
    border-top: 1px solid #ebeef5;
    transition: all 0.3s ease;

    .el-input {
      .el-input__wrapper {
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

        &:focus-within {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
      }
    }

    .voice-btn,
    .send-btn {
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.1);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }

  .step-controls {
    margin-top: clamp(24px, 6vw, 40px);
    padding: clamp(16px, 4vw, 24px) 0;
    display: flex;
    justify-content: center;
    gap: clamp(12px, 3vw, 20px);

    .el-button {
      min-width: clamp(100px, 25vw, 120px);
      font-size: 1em;
      height: clamp(36px, 8vh, 40px);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      &:active {
        transform: translateY(-1px);
      }
    }
  }

  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes typingAnimation {
    from {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-6px);
    }
    60% {
      transform: translateY(0);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(64, 158, 255, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(64, 158, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(64, 158, 255, 0);
    }
  }

  @media screen and (max-width: 768px) {
    .message {
      max-width: 90%;
    }
  }
}

.main-content {
  flex: 1;
  min-width: 0;
  padding: 32px;
  overflow: auto;
  transition: margin-left var(--transition-duration) ease;

  &.is-expanded {
    margin-left: calc(var(--collapsed-width) - var(--sidebar-width));
  }
}
</style>
