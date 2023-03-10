<template>
  <van-nav-bar
    title="首页"
    right-text="搜索"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  />

  <van-pull-refresh v-model="loading" @refresh="onRefresh">
    <van-notice-bar
      left-icon="volume-o"
      text="本网站致力于为同学们提供四级帮助，为同学提供各种功能，备考四级，我们与你一起战斗！！！"
    />

    <van-swipe
      class="my-swipe"
      :width="470"
      :height="200"
      :autoplay="3000"
      indicator-color="white"
    >
      <van-swipe-item>
        <a
          :href="
            Config.address +
            ':' +
            Config.port +
            '/#/' +
            Config.path +
            '/' +
            Config.user
          "
        >
          <img
            :src="
              Config.address +
              ':' +
              Config.serverPort +
              '/static/images/home1.png'
            "
          />
        </a>
      </van-swipe-item>
      <van-swipe-item
        ><img
          :src="
            Config.address +
            ':' +
            Config.serverPort +
            '/static/images/home2.png'
          "
        />
      </van-swipe-item>
      <van-swipe-item
        ><img
          :src="
            Config.address +
            ':' +
            Config.serverPort +
            '/static/images/home3.png'
          "
        />
      </van-swipe-item>
      <van-swipe-item
        ><img
          :src="
            Config.address +
            ':' +
            Config.serverPort +
            '/static/images/home4.png'
          "
        />
      </van-swipe-item>
    </van-swipe>
  </van-pull-refresh>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Toast } from "vant";
import Config from "../config/config";

const user = window.localStorage.getItem("user");

defineProps({
  title: String,
  left: String,
  right: String,
});

const loading = ref(false);
const onRefresh = () => {
  setTimeout(() => {
    loading.value = false;
    history.go(0);
  }, 1000);
};

const onClickLeft = () => history.back();
const onClickRight = () => Toast("按钮");
</script>

<style scoped>
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #39a9ed;
}
</style>
