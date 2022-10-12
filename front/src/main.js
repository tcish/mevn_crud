import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import VueFormulate from "@braid/vue-formulate";

createApp(App).use(router, VueFormulate, options).mount("#app");
