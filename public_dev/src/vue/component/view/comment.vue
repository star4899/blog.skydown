<template>
    <div id="comment_wrap">
        <h4 class="xi xi-comment-o"><span>댓글</span></h4>
        <comment-view></comment-view>
        <comment-write :prop="{postID : prop._id}"></comment-write>
    </div>
</template>
<script>
import commentView from "@/component/view/comment-view.vue";
import commentWrite from "@/component/view/comment-write.vue";

export default {
    props : ["prop"],
    components : {
        commentView,
        commentWrite
    }
};
</script>
<style lang="scss" scoped>
#comment_wrap{padding:10px; margin-top:30px; border:3px solid #ddd;
    h4{padding-bottom:10px; font-weight:bold; font-size:16px; color:#444; word-break:break-all;
        &::before{color:#36738e;}
        span{margin-left:10px; font-weight:bold; font-size:11px; color:#999; vertical-align:top;}
    }
}
</style>