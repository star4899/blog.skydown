<template>
    <section id="wrap" :class="{gnb_open : $store.state.gnb}">
        <a id="skip-nav" href="#content">Skip to Content</a>
        <input type="hidden" :value="csrf" ref="csrf">
        <div>
            <header-component></header-component>
            <gnb-component></gnb-component>
            <main role="main">
                <router-view></router-view>
            </main>
            <footer>
                <p>Copyright &copy; 2018 by skydown  All Rights Reserved.<a href="mailto:star4899@naver.com" title="관리자에게 메일 보내기" class="xi xi-mail"><span class="ir">mailto</span></a></p>
            </footer>
        </div>
    </section>
</template>
<script>
import headerComponent from "@/component/header.vue";
import gnbComponent from "@/component/gnb/gnb.vue";
export default {
    computed : {
        csrf(){
            return this.$store.state.post.data.csrfToken;
        }
    },
    components : {
        headerComponent,
        gnbComponent
    }
};
</script>
<style lang="scss" scoped>
#skip-nav{position:absolute; left:0; right:0; top:-60px; z-index:1000; height:56px; background:#fff3d4; border:2px solid #f6b73c; font-size:16px; line-height:56px; text-align:center;
    &:focus{top:0;}
}
main{min-height:calc(100vh - 160px); margin-bottom:30px; background:#fff; box-sizing:border-box; box-shadow:0 0 5px rgba(0,0,0,.3);}
footer{height:50px; padding:15px 0; background:#fff; box-sizing:border-box; box-shadow:0 0 5px rgba(0,0,0,.3); text-align:center;
    & a{margin-left:10px; font-size:19px; color:#3f87a6; vertical-align:middle; transition:color .2s linear;
        &:hover{color:#000;}
    }
}
@media screen and (min-width:1024px){
    #wrap{
        & > div{padding:80px 30px 0; transition:padding .5s;}
        &.gnb_open > div{padding-left:330px;}
    }
    main{padding:30px;}
}
@media screen and (max-width:1023px){
    #wrap{
        &.gnb_open main::after{position:fixed; left:0; right:0; top:0; bottom:0; z-index:50; background:rgba(255,255,255,.5); content:"";}
        & > div{padding:0 0 0;}
    }
    main{min-height:-webkit-calc(100vh - 50px); padding:140px 20px 30px; margin-bottom:0;}
}
</style>