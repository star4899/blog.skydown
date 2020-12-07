<template>
    <nav role="navigation">
        <ul>
            <template v-for="(item, index) in $store.state.category.data">
                <router-link tag="li" :to="item.link" :key="index">
                    <a role="link">{{item.text}}</a>
                    <template v-if="item.sub !== null">
                        <a :href="'#' + item.text + '-sub'" role="button" aria-pressed="false" class="sub_btn btn_default xi xi-caret-down-min" @click.prevent="sub"><span class="ir">{{item.text + '-sub'}}</span></a>
                        <ul :id="item.text + '-sub'">
                            <template v-for="(t, i) in item.sub">
                                <router-link tag="li" :to="t.link" :key="i"><a role="link">{{t.text}}</a></router-link>
                            </template>
                        </ul>
                    </template>
                </router-link>
            </template>
        </ul>
    </nav>
</template>
<script>
export default {
    methods : {
        sub(e){
            if(e.currentTarget.getAttribute("aria-pressed") === "false"){
                e.currentTarget.setAttribute("aria-pressed", "true");
            }else{
                e.currentTarget.setAttribute("aria-pressed", "false");
            };
        }
    }
};
</script>
<style lang="scss" scoped>
nav{overflow-y:auto; height:100%; -webkit-overflow-scrolling:touch;
    & > ul > li{position:relative; padding-left:45px;}
    li{
        a{display:block; height:40px; font-weight:normal; font-size:16px; line-height:40px;}
        a:nth-child(1){padding-left:30px; background:url(~src/images/folder.svg) 0 center no-repeat; background-size:20px auto;}
        &.on > a:nth-child(1){background-image:url(~src/images/folder_open.svg);}
        a[role=button]{position:absolute; left:10px; top:5px; width:30px; height:30px; padding-left:0; font-size:14px; text-align:center; color:#747474; line-height:30px;
            &::before{display:block; transform:rotate(-90deg);}
            &[aria-pressed=true]{
                &::before{display:block; transform:rotate(0);}
                & + ul{display:block;}
            }
        }
        ul{display:none;
            li{padding-left:30px;}
            a{font-size:12px;}
        }
    }
}
</style>