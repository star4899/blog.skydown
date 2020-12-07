<template>
    <section id="gnb-wrap">
        <nav-component></nav-component>
        <section class="sns">
            <h2>Skydown Channel</h2>
            <ul>
                <li><a href="https://github.com/star4899" class="xi xi-github" target="_blank"><span class="ir">GitHub</span></a></li>
                <li><a href="https://www.facebook.com/profile.php?id=100001307904091" class="xi xi-facebook-official" target="_blank"><span class="ir">facebook</span></a></li>
                <li><a href="https://www.instagram.com/skydown_/" class="xi xi-instagram" target="_blank"><span class="ir">instagram</span></a></li>
            </ul>
        </section>
    </section>
</template>
<script>
import navComponent from "./nav.vue";
export default {
    components : {
        navComponent
    }
};
</script>
<style lang="scss" scoped>
#gnb-wrap{position:fixed; bottom:0; z-index:100; background:#fff; border-right:2px solid #3f87a6; box-sizing:border-box; box-shadow:0 5px 5px rgba(0,0,0,.3); transform:translate3D(0,0,0); transition:transform .5s; will-change:transform;
    #wrap.gnb_open &{transform:translate3D(100%,0,0);}
}
.sns{position:absolute; left:0; right:0; bottom:30px; padding:0 40px;
    h2{margin-bottom:10px; font-size:14px;}
    ul{overflow:hidden;
        li{float:left; margin-left:5px;
            &:first-child{margin-left:0;}
            a{font-size:20px;
                &::after{content:"";}
            }
        }
    }
    .google_ad{display:none;}
}
@media screen and (min-width:1024px){
    #gnb-wrap{left:-300px; top:60px; width:300px; padding:30px 0 100px 30px;}
}
@media screen and (max-width:1023px){
    #gnb-wrap{left:-220px; top:110px; width:220px; padding:30px 10px 100px;}
}
</style>