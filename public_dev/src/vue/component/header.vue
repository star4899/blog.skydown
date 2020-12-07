<template>
    <header>
        <h1><router-link to="/" role="link">blog.skydown</router-link></h1>
        <section id="search" class="search">
            <span>
                <button type="button" role="button" class="btn_default xi xi-search" @click.stop="search"><span class="ir">검색</span></button><label><input type="search" placeholder="게시물 검색" value="" ref="search" @keyup.enter="search"></label>
            </span>
        </section>
        <section id="util">
            <template v-if="$store.state.post.data.loginState">
                <button type="button" role="button" title="로그아웃" class="xi xi-unlock" @click.stop="logout">
                    <span class="ir">logout</span>
                </button>
                <router-link to="/write" role="link" title="글 쓰기" class="xi xi-pen">
                    <span class="ir">post write</span>
                </router-link>
            </template>
            <template v-else>
                <router-link to="/login" role="link" title="로그인" class="xi xi-lock">
                    <span class="ir">login</span>
                </router-link>
            </template>
            <router-link to="/search/complete" role="link" title="작성중인 게시물" class="xi xi-lightbulb">
                <span class="ir">작성중</span>
            </router-link>
        </section>
        <a href="#gnb" id="gnb-btn" role="button" :aria-pressed="$store.state.gnb ? 'true' : 'false'" @click.prevent="gnb"><span>nav</span></a>
    </header>
</template>
<script>
import axios from "axios";
export default {
    methods : {
        logout(){
            axios({
                url : "/api/logout",
                method : "post",
                headers : {
                    "x-xsrf-token" : this.$store.state.post.data.csrfToken
                }
            }).then(response => {
                if(response.status === 200 && !response.data.loginState){
                    this.$store.commit("post/setLogin", response);
                    location.reload(true);
                };
            }).catch(e => {
                if(e.response.status > 200){
                    alert("로그아웃 중 오류가 발생했습니다.\n다시 시도해주세요!");
                    this.$router.replace("/");
                };
            });
        },
        search(){
            if(this.$refs.search.value.replace(/\s/g, "").length > 0){
                const routePath = `/search/${this.$refs.search.value}`;
                if(this.$route.fullPath !== routePath){
                    this.$router.push({
                        path : routePath
                    });
                };
            }else{
                this.$refs.search.value = "";
                this.$refs.search.focus();
            };
        },
        gnb(e){
            if(this.$store.state.gnb){
                this.$store.commit("setGnb", false);
            }else{
                this.$store.commit("setGnb", true);
            };
        }
    }
};
</script>
<style lang="scss" scoped>
header{display:flex; justify-content:space-between; position:fixed; left:0; right:0; top:0; z-index:100; padding:10px 30px; background:#3f87a6;
    h1{flex:1; margin-left:50px;
        a{font-family:'Noto Sans'; color:#fff;}
    }
}
#search{flex:1; height:28px; padding:6px; margin:0 auto; background-color:#36738e;
    & > span{display:block; position:relative; padding-left:40px;}
    button{position:absolute; left:0; top:0; width:28px; height:28px;
        &:focus{outline:0;
            &::before{color:rgba(255,255,255,1);}
        }
        &::before{position:absolute; left:5px; top:5px; z-index:10; font-size:18px; color:rgba(255,255,255,.6);}
    }
    input{width:100%; height:28px; background-color:transparent; font-size:14px; line-height:28px; color:#fff;
        &:focus{outline:0;
            &::-webkit-input-placeholder{color:rgba(255,255,255,1);}
        }
        &::-webkit-input-placeholder{line-height:28px; color:rgba(255,255,255,.6);}
    }
}
#util{flex:1; width:100px; padding-top:8px; text-align:right;
    & a, & button{margin-left:15px;
        &::before{font-size:24px; color:#fff;}
    }
}
#gnb-btn{position:absolute; left:30px; top:18px; width:24px; height:24px;
    &::before{position:absolute; left:3px; right:3px; top:4px; height:2px; background:#fff; transition:transform .3s; content:"";}
    &::after{position:absolute; left:3px; right:3px; bottom:4px; height:2px; background:#fff; transition:transform .3s; content:"";}
    span{overflow:hidden; position:absolute; left:3px; right:3px; top:11px; height:2px; background:#fff; text-indent:-10000em;}
    &[aria-pressed="true"]::before{transform:translate3D(0,7px,0) rotate(-45deg);}
    &[aria-pressed="true"]::after{transform:translate3D(0,-7px,0) rotate(45deg);}
    &[aria-pressed="true"]{
        span{display:none;}
    }
}
@media screen and (min-width:1024px){
    header{height:40px;
        h1 a{font-size:25px;}
        #search{max-width:500px; min-width:400px;}
    }
}
@media screen and (max-width:1023px){
    header{height:90px;
        h1 a{font-size:20px; line-height:40px;}
        #search{position:absolute; left:30px; right:30px; bottom:10px;}
    }
}
</style>