<template>
    <div v-if="post !== null">
        <div class="write">
            <table>
                <caption></caption>
                <colgroup>
                    <col style="width:15%;">
                    <col style="width:35%;">
                    <col style="width:15%;">
                    <col style="width:35%;">
                </colgroup>
                <tbody>
                    <tr>
                        <th><label for="category">Category1</label></th>
                        <td>
                            <select id="category" @change="change" v-model="category" ref="category">
                                <option value="">Category1</option>
                                <option v-for="(item, index) in $store.state.category.data" :value="replaceComma(item.text)" :data-index="index" :key="index">{{item.text}}</option>
                            </select>
                        </td>
                        <th><label for="sub-category">Category2</label></th>
                        <td>
                            <select id="sub-category" v-model="subCategory" ref="subCategory">
                                <option value="">Category2</option>
                                <option v-for="(item, index) in subCategoryItem" :value="replaceComma(item.text)" :key="index">{{item.text}}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th><span>등록된 작성일</span></th>
                        <td><time :datetime="dateFormat(post.date)">{{dateFormat(post.date)}}</time></td>
                        <th>공개여부</th>
                        <td><label class="auth"><input type="checkbox" :checked="post.auth" ref="auth"></label></td>
                    </tr>
                    <tr>
                        <th><label for="write-time">작성일</label></th>
                        <td colspan="3"><input id="write-time" type="datetime-local" value="" ref="writeTime"></td>
                    </tr>
                    <tr>
                        <th><label for="title">제목</label></th>
                        <td colspan="3"><input type="text" id="title" placeholder="제목 입력" :value="post.title" ref="title"></td>
                    </tr>
                    <tr>
                        <th>상단고정</th>
                        <td><label class="fixed"><input type="checkbox" :checked="post.fixed" ref="fixed"></label></td>
                        <th>작성완료</th>
                        <td><label class="complete"><input type="checkbox" :checked="post.complete" ref="complete"></label></td>
                    </tr>
                    <tr>
                    <td colspan="4">
                        <editor-component :prop="{content : post.content, files : post.files, images : post.images}" @setEditorContent="setEditorContent"></editor-component>
                    </td>
                    </tr>
                </tbody>
            </table>
            <div class="btn_area">
                <button type="button" role="button" @click="submit">저장</button><button type="button" role="button" @click="back">취소</button>
            </div>
        </div>
    </div>
</template>
<script>
import editor from "./editor/editor.vue";
export default {
    data(){
        return {
            post : null,
            category : "",
            subCategory : "",
            subCategoryItem : []
        }
    },
    created(){
        return this.getData();
    },
    watch: {
        "$route" : "getData"
    },
    methods : {
        getData(){
            this.getRequest({
                url : this.$route.path,
                query : {},
                timeout : 7000
            }, postData => {
                this.$store.commit("post/setData", postData);
                this.post = this.$store.state.post.data.post.find(val => val.idx == this.$route.params.idx);
                this.category = this.$store.state.post.data.post.find(val => val.idx == this.$route.params.idx).category;
                this.subCategory = this.$store.state.post.data.post.find(val => val.idx == this.$route.params.idx).subCategory;
                return this.change();
            });
        },
        change(){
            const findCategory = this.$store.state.category.data.find(val => this.replaceComma(val.text) === this.category);
            if(findCategory && findCategory.sub){
                this.subCategoryItem = findCategory.sub;
            }else{
                this.subCategoryItem = [];
            };
        },
        back(){
            this.$router.go(-1);
        },
        setEditorContent(editorData){
            if(!this.post) return;
            const data = {};
            data = editorData;
            data._id = this.post._id;
            if(data._id.replace(/\s/g, "").length === 0){
                alert("게시물 ID가 잘못되었습니다.\n다시 시도해주세요!");
                return false;
            };
            data.author = this.post.author;
            if(data.author.replace(/\s/g, "").length === 0){
                alert("작성자가 잘못되었습니다.\n다시 시도해주세요!");
                return false;
            };
            data.category = this.category === ("" || null) ? "" : this.category;
            if(data.category.replace(/\s/g, "").length === 0){
                alert("카테고리를 선택해 주세요.");
                this.$refs.category.focus();
                return false;
            };
            data.subCategory = this.subCategory === ("" || null) ? "" : this.subCategory;
            if(data.subCategory.replace(/\s/g, "").length === 0 && !confirm("서브 카테고리가 선택되지 않았습니다.\n저장 하시겠습니까?")){
                this.$refs.subCategory.focus();
                return false;
            };
            data.auth = this.$refs.auth.checked;
            data.date = this.$refs.writeTime.value;
            data.title = this.$refs.title.value;
            if(data.title.replace(/\s/g, "").length === 0){
                alert("제목을 입력해 주세요.");
                this.$refs.title.focus();
                return false;
            };
            data.fixed = this.$refs.fixed.checked;
            data.complete = this.$refs.complete.checked;
            data.view = true;
            this.request({
                url : "/api/update",
                method : "put",
                data
            })
            .then(responseData => {
                const url = this.$route.path.replace("/modify", "");
                this.$router.replace(uri);
            })
            .catch(e => {
                console.log(e);
                this.$router.replace("/");
            });
        },
        submit(){
            this.$EventBus.$emit("submit");
        }
    },
    components : {
        "editor-component" : editor
    }
};
</script>
<style lang="scss" scoped>
.write{overflow:hidden;
    table{width:100%;}
    th, td{height:40px; padding-top:10px; border-bottom:1px solid #efefef;}
    th span{word-break:keep-all;
        &.input{display:block; height:40px; padding:0 10px; background:#efefef; line-height:40px;}
    }
    td.txt{height:auto;}
    select{width:100%; height:40px; background:#efefef; border:0;}
    input[type=text], input[type=datetime-local]{width:100%; height:40px; padding:0 10px; background:#efefef; border:0; box-sizing:border-box;}
    input[type=datetime-local]::-webkit-inner-spin-button{display:none;}
    input[type=checkbox]{position:relative; width:100%; max-width:100px; height:30px; margin:0; background:rgb(238, 238, 238); border:1px solid #ccc; border-radius:20px; box-sizing:border-box; transition:background-color .18s linear; -webkit-appearance:none;
        &::before{position:absolute; left:0; top:0; z-index:10; width:28px; height:28px; background-color:#fff; border-radius:50%; box-shadow:1px 1px 3px rgba(50,50,50,.5); transition:left .18s linear, background-color 5s linear; content:"";}
        &::after{position:absolute; right:8%; top:0; font-size:11px; color:#aaa; line-height:28px; content:"전체공개";}
        &:focus{outline:0;}
        &:checked{background-color:rgb(235, 30, 60);
            &::before{left:-webkit-calc(100% - 28px); left:calc(100% - 28px); box-shadow:-1px 1px 3px rgba(50,50,50,.5);}
            &::after{left:10px; color:#fff; content:"비공개";}
        }
    }
    .fixed input[type=checkbox]{
        &::after{content:"고정해제";}
        &:checked::after{content:"상단고정";}
    }
    .complete input[type=checkbox]{
        &::after{content:"미완료";}
        &:checked::after{content:"작성완료";}
    }
}
</style>