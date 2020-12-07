<template>
    <div class="comment slave slave_write">
        <div class="comment_top">
            <span class="origin_user">{{this.prop.replyData.slave ? this.prop.replyData.slave.name : this.prop.replyData.master.name}}</span>
        </div>
        <div class="comment_bottom">
            <div class="comment_bottom_top">
                <label><span>닉네임</span><input type="text" class="reply_input" placeholder="닉네임" ref="name" :value="name" @input="inputHandler($event, 'name')"></label>
                <label><span>비밀번호</span><input type="password" class="reply_input" placeholder="비밀번호" ref="password" :value="password" @input="inputHandler($event, 'password')"></label>
                <span>
                    <button type="button" role="button" class="xi xi-close-circle-o" @click="cancel"><span>취소</span></button>
                    <button type="button" role="button" class="xi xi-check-square-o" @click="submit"><span>저장</span></button>
                </span>
            </div>
            <div class="comment_bottom_bottom">
                <textarea class="reply_input" ref="content" :value="content" @input="inputHandler($event, 'content')"></textarea>
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
                idx : this.prop.replyData.master.idx,
                originUser : this.prop.replyData.slave ? this.prop.replyData.slave.name : this.prop.replyData.master.name,
                name : this.name.replace(/\s/g,""),
                password : this.password.replace(/\s/g,""),
                content : this.content.replace(/\n/g,"\{br\}")
            };
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
            if(data.originUser === "" || data.originUser === undefined){
                alert("댓글 정보를 받아오지 못했습니다.\n다시 시도해주세요.");
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
                url : "/api/re-reply-write",
                method : "put",
                data
            })
            .then(responseData => {
                this.$store.commit("post/appendReply", {
                    _id : data._id,
                    reply : {
                        parentIdx : responseData.reply.parentIdx,
                        idx : responseData.reply.idx,
                        name : responseData.reply.name,
                        content : responseData.reply.content,
                        originUser : responseData.reply.originUser,
                        view : true,
                        date : responseData.reply.date
                    }
                });
                this.$emit("replyCancel");
            })
            .catch(e => {
                console.log(e);
                this.$router.replace("/");
            });
        },
        cancel(){
            this.$emit("replyCancel");
        },
    }
};
</script>