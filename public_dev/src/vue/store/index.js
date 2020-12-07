"use strict";

import Vue from "vue";
import Vuex from "vuex";
import post from "./modules/post";
import category from "./modules/category";
Vue.use(Vuex);

export default new Vuex.Store({
    modules : {
        post,
        category
    },
    state : {
        gnb : false
    },
    getters : {
        getGnb : state => () => {
            return state.gnb;
        }
    },
    mutations : {
        setGnb(state, gnbState){
            return state.gnb = gnbState;
        }
    }
});