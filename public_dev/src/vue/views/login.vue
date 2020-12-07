<template>
    <div>
        <section class="login">
            <h3>관리자 로그인</h3>
            <div>
                <input type="text" placeholder="아이디" ref="id" autofocus :value="id" @input="inputHandler($event, 'id')"><input type="password" placeholder="비밀번호" ref="password" :value="password" @input="inputHandler($event, 'password')"><button type="button" role="button" class="xi xi-unlock-o" @click="login"><span>로그인</span></button>
            </div>
            <div id="recaptcha"></div>
        </section>
    </div>
</template>
<script>
import axios from "axios";
export default {
    data(){
        return {
            id : "",
            password : ""
        };
    },
    created(){
        this.loginCheck();
    },
    mounted(){
        if(window.grecaptcha && window.grecaptcha.render){
            this.$nextTick(window.onloadCallback);
        };
    },
    updated(){
        if(window.grecaptcha && window.grecaptcha.render){
            this.$nextTick(window.onloadCallback);
        };
    },
    methods : {
        login(){
            const data = {
                id : this.id,
                password : this.password,
                grecaptcha : grecaptcha && grecaptcha.getResponse(grecaptchaOBJ)
            };
            if(data.id === ""){
                alert("아이디를 입력해주세요!");
                this.$refs.id.focus();
                return false;
            };
            if(data.password === ""){
                alert("비밀번호를 입력해주세요!");
                this.$refs.password.focus();
                return false;
            };
            if(typeof data.grecaptcha === "undefined"){
                alert("자동 로그인 방지 코드 생성에 오류가 있습니다.\n다시 시도해주세요!");
                this.$route.replace("/login");
                return false;
            };
            if(data.grecaptcha === ""){
                alert("자동 로그인 방지 코드를 확인해주세요!");
                return false;
            };
            this.request({
                url : "/api/login",
                method : "post",
                data
            })
            .then(responseData => {
                this.$store.commit("post/setLogin", responseData);
                this.$router.go(-1);
            })
            .catch(e => {
                console.log(e);
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.login{padding:50px 0; text-align:center;
    h3{margin-bottom:30px; font-size:25px; color:#3f87a6;}
    p{margin-bottom:30px; color:red;}
    & > div{display:flex; justify-content:center; margin-bottom:20px;}
    input{width:50%; max-width:250px; height:45px; padding-left:10px; margin-right:5px; background:rgba(63,135,166,.2); box-sizing:border-box; border:2px solid rgba(54,115,142,1); color:rgba(0,0,0,1);
        &:focus{background:rgba(63,135,166,1); color:rgba(255,255,255,1);
            &::-webkit-input-placeholder{color:rgba(255,255,255,1);}
        }
        &::-webkit-input-placeholder{line-height:28px; color:rgba(0,0,0,.6);}
    }
    button{width:80px; height:45px; background:#3f87a6; font-size:12px; text-align:center; color:#fff;}
    #recaptcha:empty::before{display:block; height:48px; padding-left:58px; background:url(~src/images/recaptcha.png) 0 center no-repeat; font-size:20px; color:#3f87a6; line-height:48px; content:"reCAPTCHA 보안문자를 불러오고 있습니다.";}
}
</style>