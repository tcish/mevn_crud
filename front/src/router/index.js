import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Cookies from 'js-cookie'

const routes = [
  {
    path: "/",
    name: "signin",
    component: function () {
      return import("../views/Signin.vue");
    },
    meta: {
      isAuth: false,
    },
  },
  {
    path: "/home",
    name: "home ",
    component: HomeView,
    meta: {
      isAuth: true,
    },
  },
  {
    path: "/create",
    name: "create",
    component: function () {
      return import("../views/Create.vue");
    },
    meta: {
      isAuth: true,
    },
  },
  {
    path: "/edit/:id",
    name: "edit",
    component: function () {
      return import("../views/Edit.vue");
    },
    meta: {
      isAuth: true,
    },
  },
  {
    path: "/signup",
    name: "signup",
    component: function () {
      return import("../views/Signup.vue");
    },
    meta: {
      isAuth: false,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, form, next) => {
  to.matched.some((data) => {
    if (data.meta.isAuth == true) {
      if (Cookies.get("jwt")) {
        return next();
      }
      return next("/");
    }

    if (data.meta.isAuth == false) {
      if (Cookies.get("jwt")) {
        return next("/home");
      }
    }
  });

  next();
});

export default router;
