<template>
  <div class="course-management">
    <el-steps :active="currentStep" finish-status="success" class="steps">
      <el-step title="上传课程" />
      <el-step title="编辑课程" />
      <el-step title="发布课程" />
      <el-step title="课程列表" />
    </el-steps>

    <div class="step-content">
      <!-- 上传课程 -->
      <div v-if="currentStep === 0" class="upload-section">
        <el-upload
          class="upload-area"
          drag
          action="#"
          :auto-upload="false"
          :on-change="handleFileChange"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">拖拽文件到此处或 <em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">支持上传PPT、PDF、Word等格式文件</div>
          </template>
        </el-upload>

        <div class="course-info">
          <el-form :model="courseForm" label-width="100px">
            <el-form-item label="课程名称">
              <el-input
                v-model="courseForm.name"
                placeholder="请输入课程名称"
              />
            </el-form-item>
            <el-form-item label="课程分类">
              <el-select
                v-model="courseForm.category"
                placeholder="请选择课程分类"
              >
                <el-option label="技术培训" value="tech" />
                <el-option label="管理培训" value="management" />
                <el-option label="通用技能" value="general" />
              </el-select>
            </el-form-item>
            <el-form-item label="课程简介">
              <el-input
                v-model="courseForm.description"
                type="textarea"
                rows="4"
                placeholder="请输入课程简介"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 编辑课程 -->
      <div v-if="currentStep === 1" class="edit-section">
        <el-tabs v-model="editTab" class="edit-tabs">
          <el-tab-pane label="课程内容" name="content">
            <div class="content-editor">
              <el-input
                v-model="courseForm.content"
                type="textarea"
                rows="15"
                placeholder="请输入课程内容"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="课程资料" name="materials">
            <el-upload
              class="material-upload"
              action="#"
              :auto-upload="false"
              :on-change="handleMaterialChange"
              multiple
            >
              <el-button type="primary">添加课程资料</el-button>
              <template #tip>
                <div class="el-upload__tip">可上传补充资料、练习题等</div>
              </template>
            </el-upload>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 发布课程 -->
      <div v-if="currentStep === 2" class="publish-section">
        <el-form :model="publishForm" label-width="100px">
          <el-form-item label="发布时间">
            <el-date-picker
              v-model="publishForm.publishDate"
              type="datetime"
              placeholder="选择发布时间"
            />
          </el-form-item>
          <el-form-item label="学习时长">
            <el-input-number
              v-model="publishForm.duration"
              :min="1"
              :max="100"
            />
            小时
          </el-form-item>
          <el-form-item label="目标学员">
            <el-select
              v-model="publishForm.targetUsers"
              multiple
              placeholder="选择目标学员"
            >
              <el-option label="新员工" value="new" />
              <el-option label="初级员工" value="junior" />
              <el-option label="中级员工" value="intermediate" />
              <el-option label="高级员工" value="senior" />
            </el-select>
          </el-form-item>
          <el-form-item label="课程标签">
            <el-tag
              v-for="tag in publishForm.tags"
              :key="tag"
              closable
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="InputRef"
              v-model="inputValue"
              class="input-new-tag"
              @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm"
            />
            <el-button v-else class="button-new-tag" @click="showInput">
              + 新标签
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 课程列表 -->
      <div v-if="currentStep === 3" class="list-section">
        <el-table :data="courseList" style="width: 100%">
          <el-table-column prop="name" label="课程名称" />
          <el-table-column prop="category" label="分类">
            <template #default="scope">
              <el-tag>{{ scope.row.category }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="publishDate" label="发布时间" />
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag
                :type="scope.row.status === 'published' ? 'success' : 'info'"
              >
                {{ scope.row.status === "published" ? "已发布" : "草稿" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button-group>
                <el-button type="primary" link @click="editCourse(row)"
                  >编辑</el-button
                >
                <el-button type="danger" link @click="deleteCourse(row)"
                  >删除</el-button
                >
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
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
import { ref } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";

const currentStep = ref(0);
const editTab = ref("content");
const inputVisible = ref(false);
const inputValue = ref("");
const InputRef = ref();

const courseForm = ref({
  name: "",
  category: "",
  description: "",
  content: "",
  materials: [],
});

const publishForm = ref({
  publishDate: "",
  duration: 1,
  targetUsers: [],
  tags: [],
});

const courseList = ref([
  {
    name: "示例课程1",
    category: "技术培训",
    publishDate: "2024-03-20",
    status: "published",
  },
  {
    name: "示例课程2",
    category: "管理培训",
    publishDate: "2024-03-19",
    status: "draft",
  },
]);

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

const handleFileChange = (file) => {
  console.log("Selected file:", file);
};

const handleMaterialChange = (file) => {
  console.log("Added material:", file);
};

const handleClose = (tag) => {
  publishForm.value.tags = publishForm.value.tags.filter((t) => t !== tag);
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    publishForm.value.tags.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = "";
};

const editCourse = (course) => {
  console.log("Edit course:", course);
  // TODO: 实现编辑课程功能
};

const deleteCourse = (course) => {
  console.log("Delete course:", course);
  // TODO: 实现删除课程功能
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

    :deep(.el-step__title) {
      font-size: 1em;
      line-height: 1.4;
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

    &:hover {
      box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.05);
    }
  }

  .upload-section {
    display: grid;
    grid-template-columns: 45% 55%;
    gap: clamp(16px, 4vw, 30px);
    animation: fadeIn 0.5s ease-out;

    @media screen and (max-width: 1200px) {
      grid-template-columns: 1fr;
    }

    .upload-area {
      height: clamp(200px, 40vh, 300px);
      padding: clamp(12px, 3vw, 20px);

      .el-icon--upload {
        font-size: clamp(32px, 6vw, 48px);
      }

      .el-upload__text {
        font-size: 1em;
        margin-top: 1em;
      }

      .el-upload__tip {
        font-size: 0.9em;
      }
    }

    .course-info {
      padding: clamp(16px, 4vw, 24px);

      :deep(.el-form-item__label) {
        font-size: 1em;
        line-height: 1.4;
      }

      :deep(.el-input__wrapper),
      :deep(.el-textarea__wrapper) {
        font-size: 1em;
      }
    }
  }

  .edit-section {
    animation: slideIn 0.5s ease-out;

    .edit-tabs {
      height: 100%;

      :deep(.el-tabs__nav-wrap) {
        padding: 0 20px;
      }

      :deep(.el-tabs__item) {
        transition: all 0.3s;
        font-size: 1em;
        padding: 0 clamp(12px, 3vw, 20px);

        &:hover {
          transform: translateY(-2px);
        }
      }
    }

    .content-editor {
      margin-top: clamp(16px, 4vw, 24px);
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
      }

      :deep(.el-textarea__wrapper) {
        font-size: 1em;
      }
    }

    .material-upload {
      margin-top: clamp(16px, 4vw, 24px);
      padding: clamp(16px, 4vw, 24px);
      border: 1px dashed #dcdfe6;
      border-radius: 8px;
      transition: all 0.3s;

      &:hover {
        border-color: var(--primary-color);
        transform: translateY(-2px);
      }
    }
  }

  .publish-section {
    max-width: min(1000px, 90%);
    margin: 0 auto;
    padding: clamp(20px, 5vw, 30px);
    animation: slideUp 0.5s ease-out;

    :deep(.el-form-item) {
      margin-bottom: clamp(16px, 4vw, 24px);
    }

    :deep(.el-form-item__label) {
      font-size: 1em;
      line-height: 1.4;
    }

    :deep(.el-input__wrapper),
    :deep(.el-select),
    :deep(.el-date-editor) {
      font-size: 1em;
      width: 100%;
    }

    .el-tag {
      margin: clamp(4px, 1vw, 8px);
      font-size: 0.9em;
    }

    .input-new-tag {
      width: clamp(80px, 20vw, 120px);
      margin: clamp(4px, 1vw, 8px);
    }
  }

  .list-section {
    margin-top: clamp(16px, 4vw, 24px);
    animation: fadeIn 0.5s ease-out;
    overflow-x: auto;

    .el-table {
      min-width: 800px;
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.05);
      }

      th {
        font-size: 1em;
        padding: clamp(8px, 2vw, 12px);
        background-color: #f5f7fa;
      }

      td {
        padding: clamp(8px, 2vw, 12px);
      }
    }

    :deep(.el-table__header-wrapper) {
      .el-table__cell {
        &:nth-child(1) {
          min-width: 200px;
        }
        &:nth-child(2) {
          min-width: 120px;
        }
        &:nth-child(3) {
          min-width: 160px;
        }
        &:nth-child(4) {
          min-width: 100px;
        }
        &:nth-child(5) {
          min-width: 120px;
        }
      }
    }

    @media screen and (max-width: 768px) {
      :deep(.el-table) {
        .el-button {
          padding: 8px;
          min-height: 32px;
        }
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
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media screen and (max-width: 1440px) {
    .upload-section {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .publish-section {
      max-width: 800px;
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
