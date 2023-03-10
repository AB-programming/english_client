<template>
  <van-nav-bar
    left-text="退出登录"
    title="个人中心"
    right-text="修改个人信息"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  />

  <van-dialog v-model:show="modify" title="修改信息">
    <van-form @submit="onModify">
      <van-cell-group inset>
        <van-field v-model="name" name="name" label="网名" placeholder="网名" />
        <van-field
          v-model="signature"
          name="signature"
          label="个性签名"
          placeholder="个性签名"
        />
        <van-uploader v-model="file" multiple :max-count="1" />
        <label> 上传头像 </label></van-cell-group
      >
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </van-dialog>

  <van-dialog v-model:show="login" title="登录">
    <van-form @submit="onLogin">
      <van-cell-group inset>
        <van-field
          v-model="username"
          name="username"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </van-dialog>

  <van-dialog v-model:show="enroll" title="注册">
    <van-form @submit="onEnroll">
      <van-cell-group inset>
        <van-field
          v-model="username"
          name="username"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          v-model="password2"
          type="password"
          name="password2"
          label="再次输入密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </van-dialog>

  <div v-show="!loginStatus" class="notLogin">
    <van-button
      color="linear-gradient(to right, #00FFFF, #00FF00)"
      @click="
        login = !login;
        username = password = password2 = '';
      "
    >
      登录 </van-button
    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <van-button
      color="linear-gradient(to right, #ff6034, #ee0a24)"
      @click="
        enroll = !enroll;
        username = password = password2 = '';
      "
    >
      注册
    </van-button>
  </div>

  <div v-show="loginStatus">
    <van-sticky>
      <van-image
        round
        width="10rem"
        height="10rem"
        :src="store.user.image + '?' + Date.now()"
      />
      <van-cell-group inset>
        <van-cell
          :title="store.user.name"
          value=""
          style="font-size: 30px; color: brown"
        />
        <van-cell
          title="个性签名"
          :value="store.user.signature"
          label="signature"
        />
      </van-cell-group>
    </van-sticky>
    <div>
      <van-collapse v-model="activeNames">
        <van-collapse-item title="我的关注">
          <van-cell-group inset v-for="target in targets" :key="target.id">
            <van-cell :title="target.name" :value="target.signature" />
          </van-cell-group>
        </van-collapse-item>
        <van-collapse-item title="我的粉丝"> </van-collapse-item>
      </van-collapse>
    </div>
  </div>
  <!--分享操作-->
  <van-sticky :offset-bottom="0" position="bottom">
    <van-cell title="分享" @click="showShare = true" />
    <van-share-sheet
      v-model:show="showShare"
      title="立即分享给好友"
      :options="options"
    />
  </van-sticky>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import axios from "axios";
import Qs from "qs";
import { Notify } from "vant";
import { nanoid } from "nanoid";
import { useStore } from "../store";
import { Dialog } from "vant";

const modify = ref<boolean>(false);

const name = ref("");
const signature = ref("");

const file = ref<any>([]);

const onModify = (values: any) => {
  axios
    .post(
      "/api/user/updateUserById",
      Qs.stringify({
        id: window.localStorage.getItem("user"),
        name: values.name,
        signature: values.signature,
      })
    )
    .then(
      (response) => {
        if (response.data === 1) {
          Notify({ type: "primary", message: "更新成功" });
          setTimeout(() => {
            history.go(0);
          }, 2000);
        }
      },
      (_) => {
        Notify({ type: "danger", message: "更新失败,后台错误" });
      }
    );
  axios
    .post(
      "/api/user/uploadPic",
      { img: file.value[0].file, id: window.localStorage.getItem("user") },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then(
      (_) => {},
      (_) => {
        Notify({ type: "danger", message: "头像上传失败，后台发生错误" });
      }
    );
};

defineProps({
  title: String,
  left: String,
  right: String,
});

const onClickLeft = () => {
  if (window.localStorage.getItem("user") != null) {
    Dialog({
      title: "退出登录",
      message: "是否要退出登录",
    }).then(() => {
      window.localStorage.removeItem("user");
      Notify({ type: "primary", message: "退出成功" });
      setTimeout(() => {
        history.go(0);
      }, 2000);
    });
  } else {
    Notify({ type: "danger", message: "请先登录" });
  }
};
const onClickRight = () => {
  if (window.localStorage.getItem("user") != null) {
    name.value = store.user.name;
    signature.value = store.user.signature;
    modify.value = true;
  } else {
    Notify({ type: "danger", message: "请先登录" });
  }
};

const store = useStore();

const activeNames = ref(["1"]);

const login = ref<boolean>(false);

const username = ref("");
const password = ref("");
const password2 = ref("");

const onLogin = (values: any) => {
  axios
    .post(
      "/api/login/selectLoginByUsernameAndPassword",
      Qs.stringify({
        username: values.username,
        password: values.password,
      })
    )
    .then(
      (response) => {
        if (response.data !== "") {
          window.localStorage.setItem("user", response.data.lid);
          Notify({ type: "primary", message: "登录成功" });
          setTimeout(() => {
            history.go(0);
          }, 2000);
        } else {
          Notify({
            type: "danger",
            message: "登录失败，请检查用户名密码是否正确",
          });
        }
      },
      (error) => {
        Notify({ type: "danger", message: error });
      }
    );
};

const onEnroll = (values: any) => {
  const id = nanoid();
  if (values.password == values.password2) {
    axios
      .post(
        "/api/login/createLogin",
        Qs.stringify({
          username: values.username,
          password: values.password,
          lid: id,
        })
      )
      .then(
        (response) => {
          if (response.data === 1) {
            Notify({ type: "primary", message: "注册成功" });
            window.localStorage.setItem("user", id);
            setTimeout(() => {
              history.go(0);
            }, 2000);
          }
        },
        (_) => {
          Notify({ type: "danger", message: "该账户已存在" });
        }
      );
  } else {
    Notify({ type: "danger", message: "请检查两次输入密码是否一致" });
  }
};

const enroll = ref<boolean>(false);

const loginStatus = ref<boolean>(false);

if (window.localStorage.getItem("user") != null) {
  loginStatus.value = !loginStatus.value;
  axios
    .post(
      "/api/user/selectUserById",
      Qs.stringify({ id: window.localStorage.getItem("user") })
    )
    .then((response) => {
      store.user = response.data;
    });
}

//关注

const targets = reactive<any>([]);

if (window.localStorage.getItem("user") != null) {
  axios
    .post(
      "/api/concern/selectTargetByFan",
      Qs.stringify({ fan: window.localStorage.getItem("user") })
    )
    .then((response) => {
      targets.unshift(...response.data);
    });
}

//分享操作
const showShare = ref(false);
const options = [
  [
    { name: "微信", icon: "wechat" },
    { name: "朋友圈", icon: "wechat-moments" },
    { name: "微博", icon: "weibo" },
    { name: "QQ", icon: "qq" },
  ],
  [
    { name: "复制链接", icon: "link" },
    { name: "分享海报", icon: "poster" },
    { name: "二维码", icon: "qrcode" },
    { name: "小程序码", icon: "weapp-qrcode" },
  ],
];
</script>

<style scoped>
.notLogin {
  margin: 20px 30%;
}
</style>
