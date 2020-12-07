<template>
    <nav role="navigation" id="pagination" v-if="prop.data !== null && maxPage > 1">
        <router-link :to="{path : $route.path, query : {page : prevPage}}" :role="'link'" :class="'page_btn xi xi-angle-left-min'" v-if="prop.data.page && prop.data.page > 1">
            <span class="ir">이전 페이지</span>
        </router-link>
        <span class="page_btn xi xi-angle-left-min" v-else><span class="ir">이전 페이지</span></span>
        <span>
            <input type="number" min="1" :max="maxPage" :value="currentPage" @input="input" @blur="blur" ref="input">/<span id="total-page">{{maxPage}}</span>
            <button type="button" role="button" class="btn_default xi xi-search" @click.stop="pageBtn" ><span class="ir">이동</span></button>
        </span>
        <router-link :to="{path : $route.path, query : {page : nextPage}}" :role="'link'" :class="'page_btn xi xi-angle-right-min'" v-if="currentPage < maxPage">
            <span class="ir">다음 페이지</span>
        </router-link>
        <span class="page_btn xi xi-angle-right-min" v-else><span class="ir">다음 페이지</span></span>
    </nav>
</template>
<script>
export default {
    props : ["prop"],
    computed : {
        maxPage(){
            return Math.ceil(this.prop.data.total / 10);
        },
        currentPage(){
            return this.prop.data.page;
        },
        nextPage(){
            return Number(this.prop.data.page) + 1;
        },
        prevPage(){
            return Number(this.prop.data.page) - 1;
        }
    },
    methods : {
        input(e){
            if(this.$refs.input.value !== "" && this.$refs.input.value < 1){
                this.$refs.input.value = this.currentPage;
            }else if(this.$refs.input.value > Number(this.$refs.input.max)){
                this.$refs.input.value = this.$refs.input.max;
            };
        },
        blur(){
            if(this.$refs.input.value === ""){
                this.$refs.input.value = this.currentPage;
            };
        },
        pageBtn(e){
            this.$router.push({
                path : this.$router.path,
                query : {
                    page : this.$refs.input.value
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
#pagination{display:flex; padding-top:30px; justify-content:center; line-height:40px;
    .page_btn{display:inline-block; width:40px; min-width:40px; height:40px; margin:0 30px; background:#3f87a6; font-size:20px; text-align:center; color:#fff;}
    span.page_btn{opacity:.5;}
    & > span{display:flex; font-size:16px; color:#000; vertical-align:middle;
        & > *{margin:0 5px;}
        & > input, & > span{font-family:'Noto Sans';}
    }
    input{width:60px; height:40px; border:1px solid #36738e; box-sizing:border-box; font-size:16px; text-align:center; color:#36738e;
        &::-webkit-inner-spin-button{display:none;}
    }
    button{width:60px; height:40px; background:#36738e; font-size:16px;
        &::before{color:#fff;}
        &:disabled{opacity:.5;}
    }
}
</style>