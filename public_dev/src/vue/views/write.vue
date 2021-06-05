<template>
    <div>
        <div class="write">
            <input type="hidden" value="skydown" ref="author">
            <table>
                <caption>{{post ? '포스트 수정' : '포스트 작성'}}</caption>
                <colgroup>
                    <col style="width:15%;">
                    <col style="width:35%;">
                    <col style="width:15%;">
                    <col style="width:35%;">
                </colgroup>
                <tbody>
                    <tr>
                        <th><label for="category">카테고리</label></th>
                        <td>
                            <select id="category" v-model="category" @change="change" ref="category">
                                <option value="">카테고리 선택</option>
                                <option v-for="(item, index) in $store.state.category.data" :value="replaceComma(item.text)" :data-index="index" :key="index">{{item.text}}</option>
                            </select>
                        </td>
                        <th><label for="sub-category">서브 카테고리</label></th>
                        <td>
                            <select id="sub-category" ref="subCategory" v-model="subCategory" :disabled="subCategoryItem.length === 0">
                                <option v-for="(item, index) in subCategoryItem" :key="index" :value="replaceComma(item.text)">{{item.text}}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th><span>등록된 작성일</span></th>
                        <td>
                            <time v-if="post" :datetime="dateFormat(post.date)">{{dateFormat(post.date)}}</time>
                        </td>
                        <th>공개여부</th>
                        <td><label class="auth"><input type="checkbox" v-model="isAuth"></label></td>
                    </tr>
                    <tr>
                        <th><label for="write-time">작성일</label></th>
                        <td colspan="3"><input type="datetime-local" v-model="writeTime"></td>
                    </tr>
                    <tr>
                        <th><label for="title">제목</label></th>
                        <td colspan="3"><input type="text" placeholder="제목 입력" :value="title" @input="inputHandler($event, 'title')"></td>
                    </tr>
                    <tr>
                        <th>상단고정</th>
                        <td><label class="fixed"><input type="checkbox" v-model="isFixed"></label></td>
                        <th>작성완료</th>
                        <td><label class="complete"><input type="checkbox" v-model="isComplete"></label></td>
                    </tr>
                    <tr>
                    <td colspan="4">
                        <editor-component :prop="editorProp" @setEditorContent="setEditorContent"></editor-component>
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
import editorComponent from "@/component/editor.vue";
export default {
    data(){
        return {
            post : null,
            subCategoryItem : [],
            editorProp : null,
            isModify : false,

            category : "",
            subCategory : "",
            isAuth : false,
            writeTime : null,
            title : "",
            isFixed : false,
            isComplete : false,
        }
    },
    created(){
        this.getData();
    },
    watch: {
        $route(){
            this.getData();
        }
    },
    methods : {
        resetData(){
            this.post = null;
            this.editorProp = null;
            this.category = "";
            this.subCategory = "";
            this.change();
        },
        getData(){
            this.isModify = this.$route.params.category === "modify" && this.$route.params.idx;
            if(this.isModify){
                this.request({
                    url : `/api${this.$route.path}`,
                    timeout : 7000
                })
                .then(responseData => {
                    this.$store.commit("post/setData", responseData);
                    this.post = responseData.post[0];
                    this.setData();
                })
                .catch(e => {
                    console.log(e);
                });
            }else{
                this.resetData();
            };
        },
        setData(){
            this.editorProp = {
                content : this.post.content,
                files : this.post.files,
                images : this.post.images
            };
            this.category = this.post.category;
            this.subCategory = this.post.subCategory;
            this.isAuth = this.post.auth;
            this.title = this.post.title;
            this.isFixed = this.post.fixed;
            this.isComplete = this.post.complete;
            this.change();
        },
        change(){
            const findCategory = this.$store.state.category.data.find(val => this.replaceComma(val.text) === this.category);
            if(findCategory){
                this.subCategoryItem = [...findCategory.sub];
                if(this.subCategoryItem.length > 0){
                    const findSubCategory = this.subCategoryItem.find(item => this.replaceComma(item.text) === this.subCategory);
                    if(this.subCategory && findSubCategory){
                        this.subCategory = this.replaceComma(findSubCategory.text);
                    }else{
                        this.subCategory = this.replaceComma(this.subCategoryItem[0].text);
                    };
                }else{
                    this.subCategory = "";
                };
            };
        },
        back(){
            this.$router.go(-1);
        },
        setEditorContent(editorData){
            const data = {
                ...editorData
            };
            data.author = this.$refs.author.value;
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
            data.subCategory = this.subCategory;
            if(this.subCategoryItem.length > 0 && data.subCategory.replace(/\s/g, "").length === 0){
                alert("서브 카테고리는 필수 값 입니다.");
                this.$refs.subCategory.focus();
                return false;
            };
            data.auth = this.isAuth;
            data.date = this.writeTime;
            data.title = this.title;
            if(data.title.replace(/\s/g, "").length === 0){
                alert("제목을 입력해 주세요.");
                this.$refs.title.focus();
                return false;
            };
            data.fixed = this.isFixed;
            data.complete = this.isComplete;
            data.view = true;

            if(this.isModify){
                data._id = this.post._id;
                this.request({
                    url : "/api/update",
                    method : "put",
                    data
                })
                .then(responseData => {
                    const subCategory = responseData.post[0].subCategory ? `/${responseData.post[0].subCategory}` : "";
                    const url = `/${responseData.post[0].category}${subCategory}/${responseData.post[0].idx}`
                    this.$router.replace(url);
                })
                .catch(e => {
                    console.log(e);
                    this.$router.replace("/");
                });
            }else{
                this.request({
                    url : "/api/write",
                    method : "post",
                    data
                })
                .then(responseData => {
                    const subCategory = responseData.post[0].subCategory ? `/${responseData.post[0].subCategory}` : "";
                    const url = `/${responseData.post[0].category}${subCategory}/${responseData.post[0].idx}`
                    this.$router.replace(url);
                })
                .catch(e => {
                    console.log(e);
                    this.$router.replace("/");
                });
            };
        },
        submit(){
            this.$EventBus.$emit("submit");
        }
    },
    components : {
        editorComponent
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
    select{width:100%; height:40px; background:#efefef; border:0;
        &:disabled{opacity:.5; cursor:not-allowed;}
    }
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