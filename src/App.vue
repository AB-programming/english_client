<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";

const active = ref(0);

const router = useRouter();

const home = () => {
  router.replace({
    name: "home",
    path: "/home",
  });
};

const note = () => {
  router.replace({
    name: "note",
    path: "/note",
  });
};

const me = () => {
  router.replace({
    name: "mine",
    path: "/mine",
  });
};
</script>

<template>
  <router-view></router-view>

  <van-tabbar v-model="active">
    <van-tabbar-item icon="home-o" @click="home">首页</van-tabbar-item>
    <van-tabbar-item icon="todo-list-o" @click="note">笔记</van-tabbar-item>
    <van-tabbar-item icon="friends-o" @click="me">我的</van-tabbar-item>
  </van-tabbar>
</template>

<style scoped></style>
