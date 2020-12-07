"use strict";

import Vue from "vue";
import Router from "vue-router";
import routes from "./routes";

import axios from "axios";

Vue.use(Router);
const router = new Router({
    mode : "history",
    routes : routes,
    linkActiveClass : "on",
    linkExactActiveClass : "on",
    scrollBehavior(to, from, savedPosition){
        if(to.hash){
            return {
                selector : to.hash
            };
        }else{
            return {
                x : 0,
                y : 0
            };
        };
    }
});
router.beforeEach((to, from, next) => {
    if(to.meta.requiresAuth){
        Vue.loginCheck()
        .then(responseData => {
            if(responseData.data.loginState){
                next();
            }else{
                alert("로그인이 필요합니다.");
                next({
                    path : "/login"
                });
            };
        })
        .catch(err => {
            console.log("Login Check Error!");
            next(-1);
        });
    }else{
        next();
    };
});
export default router;