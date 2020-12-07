import axios from "axios";

export default {
    install(Vue, option){
        Vue.request = function(option){
            return axios(option);
        };
        Vue.loginCheck = function(){
            return Vue.request({
                url : "/loginCheck",
                method : "get",
                timeout : 5000
            });
        };
        Vue.prototype.loginCheck = function(){
            Vue.loginCheck()
            .then(response => {
                this.$store.commit("post/setLogin", response.data);
            })
            .catch(e => {
                if(e.response.data.msg){
                    alert(e.response.data.msg);
                };
            });
        };
        Vue.prototype.request = function(config, callback){
            return new Promise((resolve, reject) => {
                const requestConfig = {
                    timeout : 10000
                };
                if(config.method && config.method.toLowerCase() !== "get"){
                    requestConfig.headers = {
                        "x-xsrf-token" : this.$store.state.post.data.csrfToken
                    };
                };
                Vue.request(Object.assign({}, requestConfig, config))
                .then(response => {
                    resolve(response.data);
                })
                .catch(e => {
                    if(e.response && e.response.data.msg){
                        alert(e.response.data.msg);
                    };
                    reject(e);
                });
            });
        };
        Vue.prototype.dateFormat = function(datetime){
            let date = new Date(datetime);
            let y = String(date.getFullYear());
            let m = String(date.getMonth() + 1);
            if(m.length === 1) m = "0" + m;
            let d = String(date.getDate());
            if(d.length === 1) d = "0" + d;
            let hh = String(date.getHours());
            if(hh.length === 1) hh = "0" + hh;
            let mm = String(date.getMinutes());
            if(mm.length === 1) mm = "0" + mm;
            let ss = String(date.getSeconds());
            if(ss.length === 1) ss = "0" + ss;
            return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
        };
        Vue.prototype.numberComma = function(number){
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };
        Vue.prototype.fileSize = function(size){
            const isMB = Number(size) <= 10240;
            return this.numberComma((isMB ? size / 1024 : size / 1024 / 1024).toFixed(2)) + (isMB ? "KB" : "MB");
        };
        Vue.prototype.replaceBr = function(text){
            return text.replace(/\{br\}/g, "\n");
        };
        Vue.prototype.comfileBr = function(text){
            return text.replace(/\{br\}/g, "<br>");
        };
        Vue.prototype.replaceComma = function(text){
            return text.replace(/\./g, "");
        };
        Vue.prototype.upload = async function(self){
            try{
                const formData = new FormData();
                formData.append(self.dataset.type, self.files[0]);
                const data = await Vue.request({
                    url : "/api/" + self.dataset.url,
                    method : "post",
                    headers : {
                        "Content-Type" : "multipart/form-data",
                        "x-xsrf-token" : this.$store.state.post.data.csrfToken,
                        "content-type" : false
                    },
                    data : formData,
                    onUploadProgress : function(progress){

                    }
                });
                return data;
            }catch(e){
                console.log(e)
            };
        };
        Vue.mixin({
            methods : {
                inputHandler(e, targetName){
                    this[targetName] = e.target.value;
                },
            }
        });
    }
};