<template>
    <div id="editor_wrap">
        <textarea name="content" ref="textarea"></textarea>
        <div class="editor_option_wrap" :class="{on : fixedState}">
            <div class="editor_option_inner">
                <ul class="editor_option">
                    <li class="fsize">
                        <button type="button" class="xi xi-text-size" title="글자크기"><span class="ir">글자크기</span></button>
                        <ul>
                            <li><button type="button" class="exec_btn size12" title="12px" @click="execcommand('fontSize', false, 1)"><span class="ir">12px</span></button></li>
                            <li><button type="button" class="exec_btn size14" title="14px" @click="execcommand('fontSize', false, 2)"><span class="ir">14px</span></button></li>
                            <li><button type="button" class="exec_btn size16" title="16px" @click="execcommand('fontSize', false, 3)"><span class="ir">16px</span></button></li>
                            <li><button type="button" class="exec_btn size18" title="18px" @click="execcommand('fontSize', false, 4)"><span class="ir">18px</span></button></li>
                            <li><button type="button" class="exec_btn size20" title="20px" @click="execcommand('fontSize', false, 5)"><span class="ir">20px</span></button></li>
                        </ul>
                    </li>
                    <li><button type="button" class="exec_btn xi xi-bold" title="볼드" @click="execcommand('bold', false, null)"><span class="ir">볼드</span></button></li>
                    <li><button type="button" class="exec_btn xi xi-italic" title="이탤릭" @click="execcommand('italic', false, null)"><span class="ir">이탤릭</span></button></li>
                    <li><button type="button" class="exec_btn xi xi-underline" title="언더라인" @click="execcommand('underline', false, null)"><span class="ir">언더라인</span></button></li>
                    <li><button type="button" class="exec_btn del" title="삭제선" @click="execcommand('strikeThrough', false, null)"><span class="ir">삭제선</span></button></li>
                    <li class="fcolor">
                        <button type="button" class="exec_btn color xi xi-text-color" title="글자색"><span class="ir">글자색</span></button>
                        <ul>
                            <li v-for="(color, index) in colors" :key="index">
                                <button type="button" :style="`background-color:${color.value}`" :value="color.value" @click="colorHandler($event)"><span class="ir">{{color.label}}</span></button>
                            </li>
                        </ul>
                    </li>
                    <li><button type="button" class="exec_btn super" title="윗첨자" @click="execcommand('superscript', false, null)"><span class="ir">윗첨자</span><sup>T</sup></button></li>
                    <li><button type="button" class="exec_btn sub" title="아래첨자" @click="execcommand('subscript', false, null)"><span class="ir">아래첨자</span><sub>T</sub></button></li>
                    <li><button type="button" class="exec_btn xi xi-align-left" title="왼쪽정렬" @click="execcommand('justifyleft', false, null)"><span class="ir">왼쪽정렬</span></button></li>
                    <li><button type="button" class="exec_btn xi xi-align-center" title="가운데정렬" @click="execcommand('justifycenter', false, null)"><span class="ir">가운데정렬</span></button></li>
                    <li><button type="button" class="exec_btn xi xi-align-right" title="오른쪽정렬" @click="execcommand('justifyright', false, null)"><span class="ir">오른쪽정렬</span></button></li>
                    <li><button type="button" class="exec_btn xi xi-undo red" title="스타일 삭제" @click="execcommand('removeFormat', false, null)"><span class="ir">스타일 삭제</span></button></li>
                    <li><button type="button" class="xi xi-link-insert" title="링크 입력" @click="replaceNode('link')"><span class="ir">링크 입력</span></button></li>
                    <li><button type="button" class="exec_btn xi xi-link-broken" title="링크 삭제" @click="execcommand('unlink', false, null)"><span class="ir">링크 삭제</span></button></li>
                    <li><button type="button" class="link_code" title="링크 코드" @click="replaceNode('linkCode')"><span class="ir">링크 코드</span></button></li>
                    <li><button type="button" class="code_node" title="코드" @click="replaceNode('codeNode')"><span class="ir">코드</span></button></li>
                    <li><button type="button" class="box_btn xi xi-code" title="skycode box" @click="createBox('codeBox')"><span class="ir">skycode box</span></button></li>
                    <li><button type="button" class="box_btn xi xi-layout-full" title="배경색 박스" @click="createBox('background_box')"><span class="ir">배경색 박스</span></button></li>
                    <li><button type="button" class="box_btn xi xi-layout-full-o" title="테두리 박스" @click="createBox('border_box')"><span class="ir">테두리 박스</span></button></li>
                    <li><button type="button" class="open_btn xi xi-image-o" title="이미지 추가" @click="$refs.inputImg.click()"><span class="ir">이미지 추가</span></button></li>
                    <li><button type="button" class="open_btn xi xi-save" title="파일 첨부(최대10MB)" @click="$refs.inputFile.click()"><span class="ir">파일 첨부</span></button></li>
                    <li><button type="button" id="iframe_url" class="xi xi-browser-text" title="iframe URL" @click="createIframe"><span class="ir">iframe URL</span></button></li>
                </ul>
            </div>
        </div>
        <div class="editor" contenteditable="true" ref="editor" v-html="content"></div>
        <div class="editor_file" v-if="files.length > 0">
            <table class="file">
                <caption>업로드 파일 목록</caption>
                <colgroup>
                    <col width="50%">
                    <col width="20%">
                    <col width="15%">
                    <col width="15%">
                </colgroup>
                <thead>
                    <tr>
                        <th>파일명</th>
                        <th>용량</th>
                        <th>상태</th>
                        <th>업로드</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in files" ref="file" :key="index">
                        <td><a :href="'/upload/' + item.fileName" :download="item.fileOriginName">{{item.fileOriginName}}</a></td>
                        <td>{{fileSize(item.size)}}</td>
                        <td>200</td>
                        <td>
                            <input type="checkbox" class="file_check" :value="index" checked>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="editor_img" v-if="imgs.length > 0" ref="img">
            <span v-for="(item, index) in imgs" @click="imgDel(item, index)" :key="index">
                <img :src="item.registered == 'true' ? '/upload/' + item.imgName : '/temp/' + item.imgName" alt="">
            </span>
        </div>
        <input type="file" id="file-input" class="ir_file upload_input" accept="text/plain, text/html, text/css, application/javascript, application/json, application/xml, application/x-zip-compressed, application/x-rar-compressed, application/pdf, application/vnd.ms-powerpoint, application/x-mspowerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/haansofthwp, application/octet-stream" data-type="file" data-url="fileUpload" @change="fileUpload" ref="inputFile">
        <input type="file" class="ir_file upload_input" accept="image/*" data-type="img" data-url="imgUpload" @change="fileUpload" ref="inputImg">
    </div>
</template>
<script>
export default {
    props : ["prop"],
    data(){
        return {
            fixedState : false,
            unloadSta : false,
            content : "<p><br></p>",
            imgs : [],
            files : [],
            isShowColor : false,
            colors : [
                {
                    value : "#000",
                    label : "#000"
                },
                {
                    value : "#c0c0c0",
                    label : "#c0c0c0"
                },
                {
                    value : "#f00",
                    label : "#f00"
                },
            ]
        };
    },
    created(){
        // this.setData();
        this.$EventBus.$on("submit", this.submit);
    },
    mounted(){
        this.$nextTick(() => {
            window.addEventListener("beforeunload", this.beforeunloadHandler);
            window.addEventListener("scroll", this.scrollHandler);
            document.addEventListener("keyup", this.docKeyupHandler);
            this.$refs.editor.addEventListener("paste", this.pasteHandler);
            this.$refs.editor.addEventListener("click", this.clickHandler);
            this.$refs.editor.addEventListener("keydown", this.keydownHandler);
            this.$refs.editor.addEventListener("keyup", this.keyupHandler);
        });
    },
    beforeDestroy(){
        window.removeEventListener("beforeunload", this.beforeunloadHandler);
        window.removeEventListener("scroll", this.scrollHandler);
        document.removeEventListener("keyup", this.docKeyupHandler);
        this.$refs.editor.removeEventListener("paste", this.pasteHandler);
        this.$refs.editor.removeEventListener("click", this.clickHandler);
        this.$refs.editor.removeEventListener("keydown", this.keydownHandler);
        this.$EventBus.$off("submit");
    },
    watch : {
        prop(newValue){
            if(newValue){
                this.setData();
            }else{
                this.resetData();
            };
        },
    },
    methods : {
        resetData(){
            this.unloadSta = false;
            this.content = "<p><br></p>";
            this.imgs = [];
            this.files = [];
        },
        setData(){
            if(this.prop){
                this.content = this.prop.content;
                this.prop.images.forEach(val => {
                    this.imgs.push({
                        imgName : val.imgName,
                        registered : "true"
                    });
                });
                this.prop.files.forEach(val => {
                    this.files.push({
                        fileName : val.fileName,
                        fileOriginName : val.fileOriginName,
                        size : val.size,
                        registered : "true"
                    });
                });
            };
        },
        fileUpload(e){
            const self = e.target;
            this.upload(self).then(data => {
                self.value = "";
                this["set" + self.dataset.type](data.data[0]);
            }).catch(e => {
                console.log(e)
                console.log(self.dataset.type + " uplopad Error!");
            });
        },
        keyupHandler(e){
            /*
            const selection = window.getSelection();
            if(selection.rangeCount){
                var range = selection.getRangeAt(0);
                var $rangeEndContainer = $(range.endContainer);
                if(e.keyCode === 8 || e.keyCode === 46){
                    $rangeEndContainer.closest("p").find("span").each(function(index, item){
                        if(!item.className){
                            $(item.childNodes).unwrap();
                        };
                    });
                };
            };
            */
        },
        keydownHandler(e){
            const selection = window.getSelection();
            if(selection.rangeCount){
                const range = selection.getRangeAt(0),
                    rangeCollapsed = range.collapsed;
                if(e.keyCode === 8){
                    const box = this.closestParent(range.endContainer, ".code_box") || this.closestParent(range.endContainer, ".normal_box");
                    if(box){
                        const boxP = box.querySelectorAll("p");
                        if(boxP === null || boxP.length === 1 && boxP[0].innerHTML.replace(/\<br\>/g, "") === ""){
                            box.remove();
                        };
                    };
                };
                if(e.keyCode === 9 && this.closestParent(range.endContainer, ".code_box") !== null){
                    e.preventDefault();
                    const p = this.closestParent(range.endContainer, "p"),
                        p_padding = Number(p.style.paddingLeft.replace(/px/g,""));
                    if(e.shiftKey){
                        if(p_padding > 0){
                            p.style.paddingLeft = (p_padding - 20) + "px";
                        };
                    }else{
                        p.style.paddingLeft = (p_padding + 20) + "px";
                    };
                };
                if(e.keyCode === 13){
                    if(rangeCollapsed){
                        const endContainerP = this.closestParent(range.endContainer, "p");
                        if(endContainerP !== null){
                            const p = document.createElement("p"),
                                br = document.createElement("br");
                            p.appendChild(br);
                            if(range.startOffset === 0 && range.endOffset === 0){
                                e.preventDefault();
                                endContainerP.before(p);
                                selection.collapse(endContainerP, 0);
                                selection.collapseToEnd();
                                selection.removeRange(range);
                                return false;
                            };
                            if(range.startOffset !== 0 && range.startContainer.textContent.length === range.startOffset && range.endContainer.textContent.length === range.endOffset && range.endContainer.nextSibling == null){
                                e.preventDefault();
                                const endContainerP_padding = Number(endContainerP.style.paddingLeft.replace(/px/g,""));
                                if(endContainerP_padding){
                                    p.style.paddingLeft = endContainerP_padding + "px";
                                };
                                endContainerP.after(p);
                            };
                            selection.collapse(p, 0);
                            selection.collapseToEnd();
                            selection.removeRange(range);
                        };
                    };
                };
            };
            this.checkEditorEnd();
        },
        clickHandler(e){
            const _self = e.target,
                selfName = _self.nodeName.toLowerCase();
            if(selfName === "img"){
                const transform = _self.style.transform;
                let rotateValue = /rotate\((\d+)deg\)/g.exec(transform);
                if(rotateValue != null) rotateValue = Number(rotateValue[1]);
                rotateValue += 90;
                if(rotateValue >= 360) rotateValue = 0;
                _self.style.transform = "rotate(" + rotateValue + "deg)";
            };
        },
        docKeyupHandler(){
            // this.unloadSta = true;
        },
        beforeunloadHandler(e){
            if(this.unloadSta) e.returnValue = "변경사항이 저장되지 않을 수 있습니다.";
        },
        checkEditorEnd(){
            if(this.$refs.editor.lastChild.nodeName.toLowerCase() !== "p"){
                const p = document.createElement("p"),
                    br = document.createElement("br");
                p.appendChild(br);
                this.$refs.editor.appendChild(p);
            }else{
                if(this.$refs.editor.lastChild.innerHTML !== "<br>"){
                    const p = document.createElement("p"),
                        br = document.createElement("br");
                    p.appendChild(br);
                    this.$refs.editor.appendChild(p);
                };
            };
        },
        tempCopy(str){
            const el = document.createElement("textarea");
            el.className = "temp_textarea";
            el.value = str;
            el.setAttribute("readonly", "");
            document.body.appendChild(el);
            const selected = window.getSelection().rangeCount > 0 ? window.getSelection().getRangeAt(0) : false;
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            if(selected){
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(selected);
            };
        },
        pasteHandler(e){
            const cData = e.clipboardData,
                cDataText = cData.getData("text").replace(/[\t]+/g, "");
            this.tempCopy(cDataText.replace(/(\n|\r)+/g,"\n"));
            this.checkEditorEnd();
        },
        closestParent(self, parentString){
            let el = self;
            const ps = parentString.replace(/\#|\./g, "");
            do{
                if((el.nodeName.toLowerCase() === ps || (el.id && el.id === ps) || (el.className && el.className.split(" ").findIndex(val => val === ps) > -1)) && el.nodeType === 1){
                    return el;
                };
                el = el.parentElement || el.parentNode;
            }while(el !== null && el.nodeType === 1);
            return null;
        },
        colorHandler(e){
            this.execcommand("ForeColor", false, e.target.value);
            e.target.blur();
        },
        scrollHandler(){
            this.fixedState = window.scrollY >= 315;
        },
        replaceNode(type){
            const selection = window.getSelection();
            if(selection.type === "Range"){
                const range = selection.getRangeAt(0);
                const a = document.createElement("a");
                if(type === "link"){
                    let value = prompt("Link URL 입력(http/https 포함)");
                    if(value){
                        if(/^(http||https)\:\/\//gi.test(value)){
                            a.href = value;
                            a.setAttribute("target", "_blank");
                            a.innerHTML = selection.toString();
                            range.deleteContents();
                            range.insertNode(a);
                        }else{
                            alert("http 또는 https 프로토콜을 포함해주세요!");
                        };
                    };
                };
                if(type === "linkCode"){
                    let value = prompt("LinkCode URL 입력(http/https 포함)");
                    if(value){
                        if(/^(http||https)\:\/\//gi.test(value)){
                            const code = document.createElement("code");
                            a.href = value;
                            a.setAttribute("target", "_blank");
                            code.className = "code_node";
                            code.innerHTML = selection.toString().replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
                            a.appendChild(code);
                            range.deleteContents();
                            range.insertNode(a);
                        }else{
                            alert("http 또는 https 프로토콜을 포함해주세요!");
                        };
                    };
                };
                if(type === "codeNode"){
                    var code = document.createElement("code");
                    code.className = "code_node";
                    code.innerHTML = selection.toString().replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
                    range.deleteContents();
                    range.insertNode(code);
                    selection.removeAllRanges();
                };
            };
        },
        createBox(type){
            const selection = window.getSelection(),
                range = selection.getRangeAt(0);
            if(this.closestParent(range.endContainer, "#editor") !== null){
                const div = document.createElement("div"),
                    p = document.createElement("p"),
                    br = document.createElement("br");
                p.appendChild(br);
                if(type === "codeBox"){
                    const pre = document.createElement("pre"),
                        code = document.createElement("code");
                    code.appendChild(p);
                    pre.appendChild(code);
                    div.appendChild(pre);
                    div.className = "code_box box";
                    const closestP = this.closestParent(range.endContainer, "p");
                    if(closestP.nextSibling === null){
                        this.$refs.editor.appendChild(div);
                    }else{
                        this.$refs.editor.insertBefore(div, closestP.nextSibling);
                    };
                };
                if(type === "background_box" || type === "border_box"){
                    div.appendChild(p);
                    div.className = type + " box";
                    const closestP = this.closestParent(range.endContainer, "p");
                    if(closestP.nextSibling === null){
                        this.$refs.editor.appendChild(div);
                    }else{
                        this.$refs.editor.insertBefore(div, closestP.nextSibling);
                    };
                };
                this.checkEditorEnd();
            };
        },
        createIframe(){
            const selection = window.getSelection(),
                range = selection.getRangeAt(0);
            if(this.closestParent(range.endContainer, "#editor") !== null){
                const value = prompt("iframe URL 입력(http/https 포함)");
                if(value){
                    if(/^(http||https)\:\/\//gi.test(value)){
                        const div = document.createElement("div"),
                            cloneDiv = div.cloneNode(),
                            iframe = document.createElement("iframe"),
                            p = document.createElement("p"),
                            br = document.createElement("br"),
                            closestP = this.closestParent(range.endContainer, "p");
                        div.className = "iframe_wrap";
                        iframe.setAttribute("width", "100%");
                        iframe.setAttribute("allowfullscreen", "allowfullscreen");
                        iframe.setAttribute("frameborder", "0");
                        iframe.setAttribute("src", value);
                        cloneDiv.appendChild(iframe);
                        div.appendChild(cloneDiv);
                        if(closestP.nextSibling === null){
                            this.$refs.editor.appendChild(div);
                        }else{
                            this.$refs.editor.insertBefore(div, closestP.nextSibling);
                        };
                        this.checkEditorEnd();
                    }else{
                        alert("http 또는 https 프로토콜을 포함해주세요!");
                    };
                };
            };
        },
        imgDel(item, index){
            if(confirm("선택한 이미지를 삭제 하시겠습니까?")){
                const imgTag = this.$refs.editor.querySelector("img[src$='/" + item.imgName + "']");
                if(imgTag !== null){
                    imgTag.remove();
                    this.imgs.splice(index, 1);
                };
            };
        },
        setimg(data){
            var selection = window.getSelection();
            var selecterNode = selection.anchorNode;
            var filename = data.filename;
            if(selecterNode && this.closestParent(selecterNode, "#editor") !== null){
                document.execCommand("InsertImage",false,"/temp/" + filename);
            }else{
                const p = document.createElement("p");
                const img = document.createElement("img");
                img.src = "/temp/" + filename;
                img.setAttribute("alt", "");
                p.appendChild(img);
                this.$refs.editor.appendChild(p);
            };
            this.imgs.push({
                imgName : data.filename,
                registered : "false"
            });
            this.checkEditorEnd();
        },
        setfile(data){
            this.files.push({
                fileName : data.filename,
                fileOriginName : data.originalname,
                size : data.size,
                registered : "false"
            });
        },
        execcommand(t, s, o){
            const selection = window.getSelection();
            if(selection.type === "Range"){
                document.execCommand(t, s, o);
            };
        },
        setImgData(){
            const img = [];
            this.imgs.forEach(val => {
                img.push({
                    imgName : val.imgName,
                    registered : val.registered
                });
            });
            return img;
        },
        setFileData(){
            const file = [];
            if(this.$refs.file){
                this.$refs.file.forEach(val => {
                    const fileCheckbox = val.querySelector(".file_check");
                    if(fileCheckbox.checked){
                        file.push({
                            fileName : this.files[fileCheckbox.value].fileName,
                            fileOriginName : this.files[fileCheckbox.value].fileOriginName,
                            size : this.files[fileCheckbox.value].size,
                            registered : this.files[fileCheckbox.value].registered,
                        });
                    };
                });
            };
            return file;
        },
        async submit(){
            this.unloadSta = false;
            this.$refs.textarea.value = this.$refs.editor.innerHTML.replace(/\/temp\//gi,"/upload/");
            const editorData = {
                content : this.$refs.textarea.value,
                images : await this.setImgData(),
                files : await this.setFileData()
            };
            if(editorData.content.replace(/\s/g, "").length === 0){
                alert("내용을 작성해 주세요!");
                return false;
            };
            return this.$emit("setEditorContent", editorData);
        }
    },
};
</script>
<style lang="scss">
#editor_wrap{
    textarea{position:absolute; left:-10000em; top:0;}
    .ir_file{position:absolute; left:-10000em; top:0;}
}
.editor_option_wrap{margin-bottom:10px;
    .editor_option{border:1px solid #fff;
        &::after{display:block; clear:both; content:"";}
        & > li{position:relative; float:left; padding:0 3px; border-left:1px solid #ccc;
            &:first-child{border-left-color:#fff;}
            ul{display:none; position:absolute; left:0; top:100%; z-index:10; background:#fff; border:1px solid #ddd; box-shadow:2px 2px 3px rgba(0, 0, 0, 0.3);}
            &.fsize:focus-within ul, &.fsize:hover ul{display:block;}
            &.fsize ul{
                li{width:60px; border-top:1px solid #ccc;
                    &:first-child{border-top:0;}
                    button{width:100%;
                        &::before{content:attr(title);}
                        &.size12::before{font-size:12px;}
                        &.size14::before{font-size:14px; color:#eb1e3c;}
                        &.size16::before{font-size:16px;}
                        &.size18::before{font-size:18px;}
                        &.size20::before{font-size:20px;}
                    }
                }
            }
            div.flink{display:none; position:absolute; left:0; top:100%; width:300px; padding:10px; background:#fff; border:1px solid #ccc; box-shadow:2px 2px 3px rgba(0, 0, 0, 0.3);
                input[type=text]{width:250px; height:28px; background:#fff; border:1px solid #ccc; vertical-align:middle;}
                button{width:50px; background:#ccc; font-size:12px; vertical-align:middle;}
            }
            &.on div.flink{display:block;}
            &.fcolor:focus-within ul{display:flex;}
            &.fcolor ul{left:50%; align-items:center; justify-content:center; background:transparent; transform:translate3d(-50%,0,0);
                li{overflow:hidden; width:30px; height:30px;
                    button{width:100%; height:100%;}
                }
            }
        }
        button{min-width:28px; min-height:28px; font-size:14px; color:#666;
            &:hover{background:#eee; color:#000;}
            &.xi::before{font-size:15px;}
            &.super::before, &.sub::before{font-size:15px; content:"A";}
            &.del::before{text-decoration:line-through; content:"D";}
            &.link_code::before{padding:0 4px; background-color:#888; font-size:12px; color:#fff; content:"L";}
            &.code_node::before{padding:0 4px; background-color:#888; font-size:12px; color:#fff; content:"C";}
            &.red::before{color:#eb1e3c;}
        }
    }
}
.editor{overflow:hidden; min-height:500px; padding:10px; border:1px dashed #888; box-sizing:border-box; font-size:14px; line-height:180%; word-break:break-word; word-wrap:break-word;
    img{max-width:100%; vertical-align:middle;}
    ol{padding:0 0 0 20px; list-style:decimal;}
    ul{padding:0 0 0 20px; list-style:disc;}
    a{text-decoration:underline; color:#3f87a6;}
    .code_box code > p{white-space:pre-wrap;}
}
.editor_file{overflow-x:auto; max-height:190px; margin:20px 0; border:1px dashed #ddd;
    input[type=checkbox]{
        &::after{content:"미등록" !important;}
        &:checked::after{content:"등록" !important;}
    }
    .file{max-width:1160px; margin:0 auto; text-align:center; table-layout:fixed;
        th{height:20px; padding:5px 0;}
        td{height:20px; padding:5px 0; border-top:1px solid #efefef; border-bottom:0;}
        tr.red td{color:#eb1e3c;}
        a{color:blue;
            &:hover{text-decoration:underline;}
        }
    }
}
.editor_img{overflow:hidden; margin:20px 0; padding:5px; border:3px solid #ddd;
    span{display:block; float:left; position:relative; width:70px; height:50px; cursor:pointer;
        &:hover::before{position:absolute; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,.7); content:"";}
    }
    img{width:70px; height:50px;}
}
code.code_node{padding:0 2px; background-color:#eee; border-radius:2px; font-family:Consolas,'Noto Sans',Monaco,'Andale Mono','Ubuntu Mono',monospace; line-height:150%;}
a code.code_node{text-decoration:underline;}
.background_box, .normal_box{padding:10px; margin:10px 0; background:#eee;}
.border_box{padding:10px; margin:10px 0; border:5px solid #eee;}
.iframe_wrap{max-width:854px;
    & > div{position:relative; padding-top:54.3%; box-sizing:border-box;
        iframe{position:absolute; left:0; top:0; width:100%; height:100%; z-index:1;}
    }
}
@media screen and (min-width:1024px){
    .editor_option_wrap{
        &.on{height:28px;
            .editor_option_inner{position:fixed; left:0; top:60px; z-index:100; width:100%; padding:0 60px; box-sizing:border-box;}
            .editor_option{width:100%; background:#fff; border:1px solid #ccc; box-sizing:border-box;}
        }
    }
    .editor{min-height:500px;}
}
@media screen and (max-width:1023px){
    .editor{min-height:300px;}
}
</style>