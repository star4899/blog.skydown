import "src/images/blog-192.png";
import "src/images/blog-256.png";
import "src/images/blog-feed.png";
import "src/images/favicon-32.png";
import "src/images/favicon-152.png";
import "src/images/favicon.ico";


import "src/style/common.scss";

import Vue from "vue";
import store from "@/store/index";
import plugin from "@/plugin/index";

// import Ads from "vue-google-adsense";
// Vue.use(Ads.Adsense);
// Vue.use(Ads.InArticleAdsense);
// Vue.use(Ads.InFeedAdsense);


Vue.use(plugin);
import main from "@/main.vue";
import router from "@/router/index";
Vue.prototype.$EventBus = new Vue();
new Vue({
    el : "#wrap",
    store,
    router,
    render : createElement => createElement(main)
});