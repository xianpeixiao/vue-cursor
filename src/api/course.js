import api from "./index";

// 课程相关的 API 调用
export const courseApi = {
  // 获取课程列表
  getCourseList(params) {
    return api.get("/courses", { params });
  },

  // 获取课程详情
  getCourseDetail(id) {
    return api.get(`/courses/${id}`);
  },

  // 创建课程
  createCourse(data) {
    return api.post("/courses", data);
  },

  // 更新课程
  updateCourse(id, data) {
    return api.put(`/courses/${id}`, data);
  },

  // 删除课程
  deleteCourse(id) {
    return api.delete(`/courses/${id}`);
  },
};
