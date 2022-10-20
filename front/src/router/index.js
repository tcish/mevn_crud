import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/create",
    name: "create",
    component: function () {
      return import("../views/Create.vue");
    },
  },
  {
    path: "/edit/:id",
    name: "edit",
    component: function () {
      return import("../views/Edit.vue");
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
