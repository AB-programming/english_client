import { createApp } from "vue";
import vant, { Dialog } from "vant";
import "vant/lib/index.css";
import router from "./router";
import { createPinia } from "pinia";
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();
app.use(router);
app.use(pinia);
app.use(vant);
app.use(Dialog);
app.mount("#app");
