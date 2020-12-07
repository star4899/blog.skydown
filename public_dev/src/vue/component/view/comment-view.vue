<template>
    <div class="comment_view">
        <div class="comment_group" v-for="(item, index) in $store.state.post.data.post[0].reply" :key="index">
            <template v-if="item.view">
                <comment-modify v-if="modifyTarget === 'reply-modify' + item.idx" :prop="{postID : $store.state.post.data.post[0]._id, master : item}" @modifyCancel="modify(null)"></comment-modify>
                <div class="comment" v-else>
                    <div class="comment_top">
                        <span class="author">{{item.name}}</span><time datetime="dateFormat(item.date)">{{dateFormat(item.date)}}</time>
                    </div>
                    <div class="comment_bottom">
                        <div class="comment_bottom_top">
                            <span>
                                <button type="button" role="button" class="xi xi-pen-o" @click="modify('reply-modify' + item.idx)"><span>수정</span></button>
                                <button type="button" role="button" class="xi xi-trash-o" @click="del(item.idx, '0')"><span>삭제</span></button>
                                <button type="button" role="button" class="xi xi-comment" @click="reply('reply' + item.idx, item)"><span>답글</span></button>
                            </span>
                        </div>
                        <div class="comment_bottom_bottom">
                            <p class="comment_body" v-html="comfileBr(item.content)"></p>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="comment">
                    <div class="comment_top">
                        <span class="author">{{item.name}}</span><time datetime="dateFormat(item.date)">{{dateFormat(item.date)}}</time>
                    </div>
                    <div class="comment_bottom deleted">
                        <p class="deleted">삭제 된 댓글입니다.</p>
                    </div>
                </div>
            </template>
            <template v-for="(t, i) in item.slave">
                <template v-if="t.view">
                    <comment-modify v-if="modifyTarget === 'slave-modify' + item.idx + '-' + t.idx" :prop="{postID : $store.state.post.data.post[0]._id, master : item, slave : t}" :key="i" @modifyCancel="modify(null)"></comment-modify>
                    <div v-else class="comment slave" :key="i">
                        <div class="comment_top">
                            <span class="origin_user">{{t.originUser}}</span><span class="author">{{t.name}}</span><time datetime="dateFormat(t.date)">{{dateFormat(t.date)}}</time>
                        </div>
                        <div class="comment_bottom">
                            <div class="comment_bottom_top">
                                <span>
                                    <button type="button" role="button" class="xi xi-pen-o" @click="modify('slave-modify' + item.idx + '-' + t.idx)"><span>수정</span></button>
                                    <button type="button" role="button" class="xi xi-trash-o" @click="del(item.idx, t.idx)"><span>삭제</span></button>
                                    <button type="button" role="button" class="xi xi-comment" @click="reply('reply' + item.idx + '-' + t.idx, item, t)"><span>답글</span></button>
                                </span>
                            </div>
                            <div class="comment_bottom_bottom">
                                <p class="comment_body" v-html="comfileBr(t.content)"></p>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="comment slave" :key="i">
                        <div class="comment_top">
                            <span class="origin_user">{{t.originUser}}</span><span class="author"></span><time datetime="dateFormat(t.date)">{{dateFormat(t.date)}}</time>
                        </div>
                        <div class="comment_bottom deleted">
                            <p class="deleted">삭제 된 답글입니다.</p>
                        </div>
                    </div>
                </template>
            </template>
            <comment-reply v-if="item.idx === replyState" :prop="{postID : $store.state.post.data.post[0]._id, replyData}" @replyCancel="reply(null)"></comment-reply>
        </div>
    </div>
</template>
<script>
import commentModify from "@/component/view/comment-modify.vue";
import commentReply from "@/component/view/comment-reply.vue";

export default {
    data(){
        return {
            modifyTarget : null,
            replyTarget : null,
            replyData : null
        };
    },
    computed : {
        replyState(){
            return Number(this.replyTarget && this.replyTarget.replace(/^reply([\d]+)(\-[\d]+)?$/, "$1"));
        }
    },
    methods : {
        modify(target){
            this.modifyTarget = target;
        },
        reply(target, master, slave){
            this.replyTarget = target;
            this.replyData = {
                master,
                slave
            };
        },
        del(master, slave){
            const data = {
                _id : this.$store.state.post.data.post[0]._id,
                idx : master,
                slaveIdx : slave
            };
            data.password = prompt(`${slave === "0" ? "답글" : "댓글"}을 삭제하기 위해 비밀번호를 입력해주세요.`);
            if(data.password){
                if(data._id === "" || data._id === undefined){
                    alert("게시물 ID가 잘못 되었습니다.\n다시 시도해주세요.");
                    location.reload();
                    return false;
                };
                if(data.idx === "" || data.idx === undefined){
                    alert("댓글 ID를 받아오지 못했습니다.\n다시 시도해주세요.");
                    location.reload();
                    return false;
                };
                if(data.slaveIdx === "" || data.slaveIdx === undefined){
                    alert("답글 ID를 받아오지 못했습니다.\n다시 시도해주세요.");
                    location.reload();
                    return false;
                };
                this.request({
                    url : "/api/reply-delete",
                    method : "delete",
                    data
                })
                .then(responseData => {
                    this.$store.commit("post/delReply", {
                        _id : data._id,
                        reply : {
                            parentIdx : responseData.reply.parentIdx,
                            slaveIdx : responseData.reply.slaveIdx,
                            name : responseData.reply.name,
                            view : responseData.reply.view,
                            date : responseData.reply.date
                        }
                    });
                })
                .catch(e => {
                    console.log(e);
                });
            };
        }
    },
    components : {
        commentModify,
        commentReply
    }
};
</script>
<style lang="scss" scoped>
@import "~src/style/comment.scss";
@include comment{
    .comment_view{
        .comment{position:relative; padding:10px 0; border-top:1px dashed #ccc;
            &.slave{margin-top:10px;
                &::before{position:absolute; left:0; top:0; width:30px; padding-top:21px; font-family:xeicon; text-align:center; content:"\e981";}
                .comment_top{padding-left:30px;}
            }
            &.comment.slave_write{border-top:1px solid #666;}
        }
        @media screen and (min-width:1024px){
            .comment{
                &.slave .comment_bottom{padding-left:30px;}
            }
        }
        @media screen and (max-width:1023px){
            .comment{padding-top:50px;}
        }
    }
}
</style>