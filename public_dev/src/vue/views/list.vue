<template>
    <div class="list" v-if="data !== null">
        <template v-if="data.post.length > 0">
            <template v-for="(item, index) in data.post">
                <article role="article" :class="{not_complete : !item.complete}" :key="index">
                    <router-link role="link" :to="item.subCategory !== '' ? `/${item.category}/${item.subCategory}/${item.idx}` : `/${item.category}/${item.idx}`" :class="{img : item.images.length > 0}">
                        <h2>{{item.title}}</h2>
                        <template v-if="item.images.length > 0">
                            <picture>
                                <div class="thumbnail" :style="{backgroundImage : `url(/upload/${item.images[0].imgName})`}">
                                    <source srcset="/media/cc0-images/surfer-240-200.jpg" media="(min-width: 800px)">
                                    <img class="ir" :src="`/upload/${item.images[0].imgName}`" width="170" alt="">
                                </div>
                            </picture>
                        </template>
                        <p>{{item.content}}</p>
                    </router-link>
                    <dl>
                        <dt class="xi xi-tags" title="카테고리" :class="{auth_true : item.auth}"><span class="ir">카테고리</span></dt>
                        <dd>{{item.subCategory !== '' ? item.subCategory : item.category}}</dd>
                        <dt class="xi xi-time-o" title="작성일"><span class="ir">작성일</span></dt>
                        <dd><time datetime="dateFormat(item.date)">{{dateFormat(item.date)}}</time></dd>
                        <dt class="xi xi-file-download-o" title="첨부파일"><span class="ir">첨부파일</span></dt>
                        <dd>{{item.files.length}}</dd>
                        <dt class="xi xi-comment-o" title="댓글수"><span class="ir">댓글수</span></dt>
                        <dd>{{item.reply.length}}</dd>
                    </dl>
                </article>
            </template>
            <page-component :prop="{data : data}"></page-component>
        </template>
        <template v-else>
            <p class="null">등록된 게시물이 없습니다.</p>
        </template>
        <!-- <div class="google_ad">
            <Adsense data-ad-client="ca-pub-5455820399422481" data-ad-slot="4184549603" data-ad-format="auto" data-full-width-responsive="true"></Adsense>
            <Adsense data-ad-client="ca-pub-5455820399422481" data-ad-slot="5274269990" data-ad-format="auto" data-full-width-responsive="true"></Adsense>
        </div> -->
    </div>
</template>
<script>
import page from "@/component/page.vue";
export default {
    data(){
        return {
            data : null
        };
    },
    created(){
        this.getData();
        this.$store.watch(this.$store.getters["post/getData"] , data => {
            return this.data = data;
        });
    },
    watch: {
        "$route" : "getData"
    },
    methods : {
        getData(){
            this.request({
                url : `/api${this.$route.path === "/" ? "" : this.$route.path}`,
                params : this.$route.query
            })
            .then(responseData => {
                this.$store.commit("post/setData", responseData);
            })
            .catch(e => {
                console.log(e);
            });
        }
    },
    components : {
        "page-component" : page
    }
};
</script>
<style lang="scss" scoped>
.list{
    article{padding:20px 0; border-bottom:1px solid #ddd;
        a{overflow:hidden; display:block;
            &:hover h2, &:hover p{text-decoration:underline;}
        }
        h2{overflow:hidden; margin-bottom:10px; font-family:"Noto Sans"; font-size:25px; text-overflow:ellipsis; white-space:nowrap; word-wrap:normal;}
        &.not_complete h2{color:#aaa;}
        .thumbnail{max-width:100%; max-height:130px; background-position:center center; background-repeat:no-repeat; background-size:cover; outline:1px solid #eee; outline-offset:-1px;}
        p{overflow:hidden; display:-webkit-box; min-height:40px; margin-bottom:10px; font-size:15px; line-height:150%; text-overflow:ellipsis; color:#333; -webkit-box-orient:vertical; word-break:break-all;}
        dl{overflow:hidden; color:#bbb}
        dt{float:left; margin-right:5px; padding-top:2px; margin-left:20px;
            &:first-child{margin-left:0;}
            &.auth_true{color:#da4848;}
            &.auth_true + dd{color:#da4848;}
        }
        dd{float:left; line-height:15px;}
    }
}
@media screen and (min-width:1024px){
    .list{
        article{
            a{margin-bottom:20px;
                &.img{position:relative; padding-left:190px; min-height:130px;}
            }
            .thumbnail{position:absolute; left:0; top:0; width:170px; height:130px; margin-right:20px;}
            p{max-height:90px; -webkit-line-clamp:4;}
        }
    }
}
@media screen and (max-width:1023px){
    .list{
        article{
            a{margin-bottom:10px;}
            .thumbnail{float:left; width:110px; height:110px; margin-right:10px;}
            p{max-height:110px; -webkit-line-clamp:5;}
        }
    }
}
</style>