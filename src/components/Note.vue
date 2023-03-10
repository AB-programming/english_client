<template>
  <van-nav-bar
    title="笔记"
    right-text="添加"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  />

  <van-search
    v-model="keyword"
    shape="round"
    background="#4fc08d"
    placeholder="请输入搜索关键词"
    v-show="loginStatus"
  />
  <van-swipe-cell
    style="height: 60px"
    v-for="word in processedWords"
    :key="word.id"
    v-show="loginStatus"
  >
    <van-cell
      :border="false"
      :title="word.eng"
      :value="word.chi"
      :style="{ color: word.color }"
    />
    <template #right>
      <van-button square type="danger" text="删除" @click="erase(word.eng)" />
    </template>
  </van-swipe-cell>

  <!--添加-->
  <van-dialog v-model:show="showAddWord" title="添加word">
    <van-form @submit="addWordSubmit">
      <van-cell-group inset>
        <van-field
          v-model="addEng"
          name="addEng"
          label="单词"
          placeholder="单词"
          :rules="[{ required: true, message: '请填写单词' }]"
        />
        <van-field
          v-model="addChi"
          name="addChi"
          label="汉译"
          placeholder="汉译"
          :rules="[{ required: true, message: '请填写汉译' }]"
        />
        <br />
        <van-radio-group v-model="addColor" direction="horizontal">
          <van-radio name="red">红色</van-radio>
          <van-radio name="orange">橙色</van-radio>
          <van-radio name="green">绿色</van-radio>
        </van-radio-group>
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </van-dialog>
</template>

<script lang="ts" setup>
import { Notify } from "vant";
import { reactive, ref, computed } from "vue";
import axios from "axios";
import Qs from "qs";

const loginStatus = ref<Boolean>(false);

defineProps({
  title: String,
  left: String,
  right: String,
});

const onClickLeft = () => history.back();
const onClickRight = () => {
  if (window.localStorage.getItem("user") != null) {
    showAddWord.value = true;
  } else {
    Notify({ type: "danger", message: "请先登录" });
  }
};

let words = reactive<any>([]);

if (window.localStorage.getItem("user") != null) {
  loginStatus.value = !loginStatus.value;

  axios
    .post(
      "/api/word/selectWord",
      Qs.stringify({ wid: window.localStorage.getItem("user") })
    )
    .then((response) => {
      words.unshift(...response.data);
    });
}

let processedWords = computed(() => {
  return words.filter((word: any) => {
    return (
      word.eng.indexOf(keyword.value) !== -1 ||
      word.chi.indexOf(keyword.value) !== -1
    );
  });
});

//删除word
const erase = (eng: String) => {
  axios
    .post(
      "/api/word/deleteWordByEngAndWid",
      Qs.stringify({
        eng: eng,
        wid: window.localStorage.getItem("user"),
      })
    )
    .then(
      (response) => {
        if (response.data === 1) {
          Notify({ type: "primary", message: "删除成功" });
          setTimeout(() => {
            history.go(0);
          }, 1000);
        }
      },
      (_) => {
        Notify({ type: "danger", message: "删除失败" });
      }
    );
};

//联想查询
const keyword = ref<string>("");

//添加word
const showAddWord = ref<boolean>(false);
const addEng = ref<string>("");
const addChi = ref<string>("");
const addColor = ref<string>("");

const addWordSubmit = () => {
  axios
    .post(
      "/api/word/addWord",
      Qs.stringify({
        eng: addEng.value,
        chi: addChi.value,
        color: addColor.value,
        wid: window.localStorage.getItem("user"),
      })
    )
    .then(
      (response) => {
        if (response.data === 1) {
          Notify({ type: "primary", message: "添加成功" });
          setTimeout(() => {
            history.go(0);
          }, 1500);
        }
      },
      (_) => {
        Notify({ type: "danger", message: "添加失败，单词重复添加" });
      }
    );
  addEng.value = addChi.value = addColor.value = "";
};
</script>

<style scoped></style>
