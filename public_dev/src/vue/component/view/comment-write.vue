<template>
    <div class="comment_write">
        <div class="comment">
            <div class="comment_bottom">
                <div class="comment_bottom_top">
                    <label><span>닉네임</span><input type="text" class="reply_input" placeholder="닉네임" ref="name" :value="name" @input="inputHandler($event, 'name')"></label>
                    <label><span>비밀번호</span><input type="password" class="reply_input" placeholder="비밀번호" ref="password" :value="password" @input="inputHandler($event, 'password')"></label>
                    <span>
                        <button type="button" role="button" class="xi xi-check-square-o" @click="submit"><span>저장</span></button>
                    </span>
                </div>
                <div class="comment_bottom_bottom">
                    <textarea class="reply_input" ref="content" :value="content" @input="inputHandler($event, 'content')"></textarea>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props : ["prop"],
    data(){
        return {
            name : "",
            password : "",
            content : ""
        };
    },
    methods : {
        submit(){
            const data = {
                _id : this.prop.postID,
                name : this.name.replace(/\s/g,""),
                password : this.password.replace(/\s/g,""),
                content : this.content.replace(/\n/g, "\{br\}")
            };
            if(data._id === "" || data._id === undefined){
                alert("게시물 ID가 잘못 되었습니다.\n다시 시도해주세요.");
                location.reload();
                return false;
            };
            if(data.name === ""){
                alert("댓글 닉네임을 입력해주세요.");
                this.name = "";
                this.$refs.name.focus();
                return false;
            };
            if(data.password === ""){
                alert("댓글 비밀번호를 입력해주세요.");
                this.password = "";
                this.$refs.password.focus();
                return false;
            };
            if(data.content === ""){
                alert("댓글 내용을 입력해주세요.");
                this.content = "";
                this.$refs.content.focus();
                return false;
            };
            this.request({
                url : "/api/reply-write",
                method : "put",
                data
            })
            .then(responseData => {
                this.$store.commit("post/appendReply", {
                    _id : data._id,
                    reply : {
                        idx : responseData.reply.idx,
                        name : responseData.reply.name,
                        content : responseData.reply.content,
                        slave : responseData.reply.slave,
                        view : true,
                        date : responseData.reply.date
                    }
                });
                this.name = "";
                this.password = "";
                this.content = "";
            })
            .catch(e => {
                console.log(e);
                this.$router.replace("/");
            });
        }
    }
};
</script>
<style lang="scss" scoped>
@import "~src/style/comment.scss";
@include comment{
    .comment_write{padding-top:10px; border-top:1px solid #666;
        .comment{position:relative; padding:10px 0;}
    }
}
</style>