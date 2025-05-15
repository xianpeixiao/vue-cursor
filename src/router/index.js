import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../layouts/MainLayout.vue";
import CourseManagement from "../views/CourseManagement.vue";

const router = createRouter({
  history: createWebHistory("/vue-cursor/"),
  routes: [
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "",
          redirect: "/course-management",
        },
        // 智能驻场路由
        {
          path: "customer-success",
          name: "CustomerSuccess",
          component: () => import("../views/CustomerSuccess.vue"),
        },
        // 培训经理路由
        {
          path: "user",
          children: [
            {
              path: "add",
              name: "UserAdd",
              component: () => import("../views/user/UserAdd.vue"),
            },
            {
              path: "list",
              name: "UserList",
              component: () => import("../views/user/UserList.vue"),
            },
            {
              path: "edit",
              name: "UserEdit",
              component: () => import("../views/user/UserEdit.vue"),
            },
          ],
        },
        {
          path: "course-management",
          name: "CourseManagement",
          component: CourseManagement,
        },
        // 培训总监路由
        {
          path: "training-plan",
          name: "TrainingPlan",
          component: () => import("../views/TrainingPlan.vue"),
        },
      ],
    },
    // 处理 404
    {
      path: "/:pathMatch(.*)*",
      redirect: "/course-management",
    },
  ],
});

export default router;
