import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "home",
    component: () => import("../components/Home.vue"),
  },
  {
    path: "/note",
    name: "note",
    component: () => import("../components/Note.vue"),
  },
  {
    path: "/mine",
    name: "mine",
    component: () => import("../components/Mine.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
