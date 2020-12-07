<template>
    <div>
        <!-- <div class="google_ad">
            <Adsense data-ad-client="ca-pub-5455820399422481" data-ad-slot="1390865301" data-ad-format="auto" data-full-width-responsive="true"></Adsense>
            <Adsense data-ad-client="ca-pub-5455820399422481" data-ad-slot="8119925188" data-ad-format="auto" data-full-width-responsive="true"></Adsense>
        </div> -->
        <template v-if="post !== null">
            <div class="view" :class="{not_complete : !post.complete}">
                <h3>{{post.title}}</h3>
                <div class="author_info">
                    <span>{{post.author}}</span>
                    <span><time :datetime="dateFormat(post.date)">{{dateFormat(post.date)}}</time></span>
                </div>
                <div class="category_info">
                    <span><router-link :to="'/' + (post.subCategory !== '' ? post.category + '/' + post.subCategory : post.category)" role="link">{{post.subCategory !== '' ? post.subCategory : post.category}}</router-link></span>
                    <span :class="{auth_true : post.auth}">{{post.auth ? '비공개' : '전체공개'}}</span>
                </div>
                <div id="view_body" class="view_body" v-html="post.content"></div>
                <template v-if="post.files.length > 0">
                    <div class="file">
                        <table>
                            <caption>업로드 파일 목록</caption>
                            <colgroup>
                                <col style="width:70%">
                                <col style="width:30%">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>첨부파일</th>
                                    <th>첨부파일 용량</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in post.files" :key="index">
                                    <td>
                                        <a :href="'/upload/' + item.fileName" :download="item.fileOriginName" role="button">{{item.fileOriginName}}</a>
                                    </td>
                                    <td>{{fileSize(item.size)}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>
                <div class="btn_area">
                    <template v-if="$store.state.post.data.loginState">
                        <button type="button" role="button" class="xi xi-trash-o" @click="del">삭제</button>
                        <router-link :to="'/modify/' + post.idx" role="link" class="xi xi-file-text-o">수정</router-link>
                    </template>
                    <button type="button" role="button" class="xi xi-undo" @click="back">목록</button>
                </div>
                <comment-component :prop="{_id : post._id}"></comment-component>
            </div>
        </template>
        <!-- <div class="google_ad">
            <Adsense data-ad-client="ca-pub-5455820399422481" data-ad-slot="6423700135" data-ad-format="auto" data-full-width-responsive="true"></Adsense>
            <Adsense data-ad-client="ca-pub-5455820399422481" data-ad-slot="4727475083" data-ad-format="auto" data-full-width-responsive="true"></Adsense>
        </div> -->
    </div>
</template>
<script>
import comment from "@/component/view/comment.vue";
import skycode from "@/lib/skycode";
export default {
    data(){
        return {
            post : null
        };
    },
    created(){
        this.getData();
        this.$store.watch(this.$store.getters["post/getPost"] , post => {
            return this.post = post[0];
        });
    },
    updated(){
        skycode(".code_box");
    },
    watch: {
        "$route" : "getData"
    },
    methods : {
        getData(){
            this.request({
                url : `/api${this.$route.path}`,
                params : {},
                timeout : 7000
            })
            .then(responseData => {
                this.$store.commit("post/setData", responseData);
            })
            .catch(e => {
                console.log(e);
            });
        },
        back(){
            this.$router.go(-1);
        },
        del(){
            if(confirm("게시물을 삭제 하시겠습니까?")){
                if(this.post._id.replace(/\s/g, "").length === 0){
                    alert("게시물 ID가 잘 못 되었습니다.\n다시 시도해주세요!");
                    return false;
                };
                this.request({
                    url : "/api/delete",
                    method : "delete",
                    data : {
                        _id : this.post._id
                    }
                })
                .then(responseData => {
                    this.$router.replace("/");
                })
                .catch(e => {
                    console.log(e);
                });
            };
        }
    },
    components : {
        "comment-component" : comment
    }
};
</script>
<style lang="scss">
.view{
    h3{font-weight:bold; font-size:2em; color:#444; word-break:break-all;
        span{margin-left:10px; font-size:11px; color:#999;}
    }
    .author_info{overflow:hidden; padding:15px 0 10px; border:0;
        span{float:right;
            &:first-child{overflow:hidden; float:left; width:50%; color:#428bca; white-space:nowrap; text-overflow:ellipsis;
                &::before{margin-right:5px; content:"By"; color:#666;}
            }
        }
    }
    .category_info{overflow:hidden; margin-bottom:30px;
        & a{color:#428bca; transition:color .5s;
            &:hover{color:#da4848;}
        }
        span{float:right; color:#666;
            &.auth_true{color:#da4848;}
            &:first-child{overflow:hidden; float:left; width:50%; color:#428bca; white-space:nowrap; text-overflow:ellipsis;
                &::before{margin-right:10px; content:"category"; color:#666;}
            }
        }
    }
    .view_body{overflow:hidden; min-height:-webkit-calc(100vh - 424px); padding:30px 0; margin-bottom:30px; border-top:2px dotted #dcdcdc; border-bottom:2px dotted #dcdcdc; box-sizing:border-box; font-size:14px;
        a{color:#428bca; transition:color .5s;
            &:hover{color:#da4848;}
        }
        p{line-height:180%; word-break:break-all;}
        img{max-width:100%; cursor:pointer;}
        table{margin:0;}
    }
    .file{padding:10px 20px; margin-top:20px; border:1px dashed #ddd;
        table{width:100%;}
        th{padding:5px 0;}
        td{padding:5px 0; border-top:1px solid #dedede; text-align:center;}
        a{color:blue;
            &:hover{text-decoration:underline;}
        }
    }
    &.not_complete{
        &::before{position:fixed; left:50%; top:130px; transform:translate3D(-50%,0,0); font: {weight:bold; size:25px;}; color:#f5f5f5; content:"작성이 완료되지 않은 포스팅입니다."}
    }
}
.code_box{overflow:hidden; margin:20px 0; color:#333;
    & > pre{overflow-x:auto; overflow-y:hidden; padding:10px 30px 10px 70px; background:#eee; border-left:5px solid #3f87a6; counter-reset:skycode;}
    code{font-family:Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
        & > p{position:relative; color:#333;
            &::before{position:absolute; left:-70px; top:0; width:40px; padding-right:10px; border-right:1px solid #999; text-align:right; color:#999; counter-increment:skycode; content:counter(skycode);}
        }
    }
    .skycode_comment{color:#708090;}
    .skycode_punctuation{color:#999;}
    .skycode_operator{color:#a67f59;}
    .skycode_doc{color:#ccc;}
    .skycode_tag_name{color:#905;}
    .skycode_attr_name{color:#690;}
    .skycode_attr_value{color:#07a;}
    .skycode_keyword{color:#07a;}
    .skycode_function{color:#dd4a68;}
    .skycode_string{color:#690;
        .skycode_number{color:#690;}
    }
    .skycode_number{color:#905;}
}
@media screen and (max-width:1023px){
    .view{
        .view_body{margin-bottom:0;}
    }
}
</style>