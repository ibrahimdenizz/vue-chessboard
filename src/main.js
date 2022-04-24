import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import chess from "./services/chess";
import store from "./store";

createApp(App).use(store).use(chess).use(router).mount("#app");
