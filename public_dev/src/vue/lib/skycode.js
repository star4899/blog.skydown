"use strict";

const skycode = async function(select){
	var attrReg = /( [a-z\-]+)\=\"(.*?)\"/gi;
	var tagOpen = /&lt;(\/)?([a-z0-9]*)/gi;
	var tagClose = /(&gt;)/gi;
	var selectObj = document.querySelectorAll(select);
	var selectObjLength = selectObj.length;
	/*
	var multiLineCommentStart = /(.*)(\&lt;!--.*|\/\*.*)/gi;
	var multiLineCommentEnd = /(.*--&gt;|\*\/)(.*)/gi;
	*/
	var multiLineCommentStart = /^(\&lt;!--.*|\/\*.*)/gi;
	var multiLineCommentEnd = /(.*--&gt;|\*\/)$/gi;
	//var singleLineComment = /(.*)(\/{2,2}.*)/g;
	var singleLineComment = /(^\/{2}.*)\n?/g;
	var htmlLine = /(&lt;\/?[a-z].*[^\-]&gt;)( *\<)?/gi;
	var docType = /(^&lt;\!doctype.*&gt;$)/gi
	var scriptNumber = /(\d+|NaN)/g;
	var scriptString = /(\"([^\"]*?)\")/g;
	var scriptBloolean = /( |\=|\()(true|false)( |\)|\;)?/gi;
	var scriptKeyword = /(var |function|let |const |if|forEach|for|\$|new |return |get |set |extends |class |typeof|else|undefined)/gi;
	var scriptFunction = /( |\.)?([a-zA-Z0-9]*)(\(.*?)|(\.on[a-z]*)( ?\=)/gi;
	var scriptPunctuation = /(\{|\}|\(|\)|\[|\]|\,|\.|\:|\;)/g;
	var scriptOperator = /( \={1,3} | \&{2} | \|{2} | (\<\=?){1} | (\>\=?){1} |\+{1,2}\=?|\-{1,2}\=?|\?{1}|\=\>{1})/g;
	for(var n = 0; n < selectObjLength; n++){
		var isComment = false, mcs = false, mce = false, sc = false;
		var targetObj = selectObj[n].querySelector("code");
		if(targetObj){
			var childObj = targetObj.childNodes;
			var childObjLength = childObj.length;
			for(var i = 0; i < childObjLength; i++){
				if(childObj[i].nodeType == 1){
					childObj[i].className = childObj[i].className.length > 0 ? childObj[i].className + " skycode_tag" : "skycode_tag";
					//mcs = multiLineCommentStart.test(childObj[i].innerHTML);
					//mce = multiLineCommentEnd.test(childObj[i].innerHTML);
					//sc = singleLineComment.test(childObj[i].innerHTML);
					if(docType.test(childObj[i].innerHTML)){
						childObj[i].innerHTML = childObj[i].innerHTML.replace(docType,"<span class=\"skycode_doc\">$1</span>");
					}else if(htmlLine.test(childObj[i].innerHTML) && !isComment){
						childObj[i].innerHTML = childObj[i].innerHTML.replace(htmlLine,"<span class=\"skycode_html\">$1</span>$2");
						var skycodeHtml = childObj[i].querySelector(".skycode_html");
						skycodeHtml.innerHTML = skycodeHtml.innerHTML.replace(attrReg,"<span class=\"skycode_attr_name\">$1</span><span class=\"skycode_punctuation\">=</span><span class=\"skycode_punctuation\">\"</span><span class=\"skycode_attr_value\">$2</span><span class=\"skycode_punctuation\">\"</span>");
						skycodeHtml.innerHTML = skycodeHtml.innerHTML.replace(tagOpen,"<span class=\"skycode_punctuation\">&lt;$1<span class=\"skycode_tag_name\">$2</span></span>");
						skycodeHtml.innerHTML = skycodeHtml.innerHTML.replace(tagClose,"<span class=\"skycode_punctuation\">$1</span>");
					}else{
						childObj[i].innerHTML = "<span class=\"skycode_script\">" + childObj[i].innerHTML + "</span>";
						var skycodeScript = childObj[i].querySelector(".skycode_script");
						var t = "";

						t = "";
						// comment
						for(var a = 0; a < skycodeScript.childNodes.length; a++){
							singleLineComment.lastIndex = 0;
							if(skycodeScript.childNodes[a].nodeName == "#text"){
								if(singleLineComment.test(skycodeScript.childNodes[a].textContent)){
									t += skycodeScript.childNodes[a].textContent.replace(singleLineComment,"<span class=\"skycode_comment\">$1</span>");
								}else{
									t += skycodeScript.childNodes[a].textContent;
								};
							}else{
								t += skycodeScript.childNodes[a].outerHTML;
							};
						};
						skycodeScript.innerHTML = t;

						t = "";
						// string
						for(var a = 0; a < skycodeScript.childNodes.length; a++){
							if(skycodeScript.childNodes[a].nodeName == "#text"){
								if(scriptString.test(skycodeScript.childNodes[a].textContent) && !singleLineComment.test(skycodeScript.childNodes[a].textContent)){
									scriptString.lastIndex = 0;
									t += skycodeScript.childNodes[a].textContent.replace(scriptString,"<span class=\"skycode_string\">$1</span>");
								}else{
									t += skycodeScript.childNodes[a].textContent;
								};
							}else{
								t += skycodeScript.childNodes[a].outerHTML;
							};
						};
						skycodeScript.innerHTML = t;
						
						t = "";
						// number
						for(var a = 0; a < skycodeScript.childNodes.length; a++){
							if(skycodeScript.childNodes[a].nodeName == "#text"){
								if(scriptNumber.test(skycodeScript.childNodes[a].textContent) && !singleLineComment.test(skycodeScript.childNodes[a].textContent)){
									scriptNumber.lastIndex = 0;
									t += skycodeScript.childNodes[a].textContent.replace(scriptNumber,"<span class=\"skycode_number\">$1</span>");
								}else{
									t += skycodeScript.childNodes[a].textContent;
								};
							}else{
								t += skycodeScript.childNodes[a].outerHTML;
							};
						};
						skycodeScript.innerHTML = t;

						t = "";
						// bloolean
						for(var a = 0; a < skycodeScript.childNodes.length; a++){
							if(skycodeScript.childNodes[a].nodeName == "#text"){
								if(scriptBloolean.test(skycodeScript.childNodes[a].textContent) && !singleLineComment.test(skycodeScript.childNodes[a].textContent)){
									scriptBloolean.lastIndex = 0;
									t += skycodeScript.childNodes[a].textContent.replace(scriptBloolean,"$1<span class=\"skycode_keyword\">$2</span>$3");
								}else{
									t += skycodeScript.childNodes[a].textContent;
								};
							}else{
								t += skycodeScript.childNodes[a].outerHTML;
							};
						};
						skycodeScript.innerHTML = t;

						t = "";
						// keyword
						for(var a = 0; a < skycodeScript.childNodes.length; a++){
							if(skycodeScript.childNodes[a].nodeName == "#text"){
								if(scriptKeyword.test(skycodeScript.childNodes[a].textContent) && !singleLineComment.test(skycodeScript.childNodes[a].textContent)){
									scriptKeyword.lastIndex = 0;
									t += skycodeScript.childNodes[a].textContent.replace(scriptKeyword,"<span class=\"skycode_keyword\">$1</span>");
								}else{
									t += skycodeScript.childNodes[a].textContent;
								};
							}else{
								t += skycodeScript.childNodes[a].outerHTML;
							};
						};
						skycodeScript.innerHTML = t;

						t = "";
						// function
						for(var a = 0; a < skycodeScript.childNodes.length; a++){
							if(skycodeScript.childNodes[a].nodeName == "#text"){
								if(scriptFunction.test(skycodeScript.childNodes[a].textContent) && !singleLineComment.test(skycodeScript.childNodes[a].textContent)){
									scriptFunction.lastIndex = 0;
									t += skycodeScript.childNodes[a].textContent.replace(scriptFunction,"$1<span class=\"skycode_function\">$2$4</span>$3$5");
								}else{
									t += skycodeScript.childNodes[a].textContent;
								};
							}else{
								t += skycodeScript.childNodes[a].outerHTML;
							};
						};
						skycodeScript.innerHTML = t;

						t = "";
						// operator
						for(var a = 0; a < skycodeScript.childNodes.length; a++){
							if(skycodeScript.childNodes[a].nodeName == "#text"){
								if(scriptOperator.test(skycodeScript.childNodes[a].textContent) && !singleLineComment.test(skycodeScript.childNodes[a].textContent)){
									scriptOperator.lastIndex = 0;
									t += skycodeScript.childNodes[a].textContent.replace(scriptOperator,"<span class=\"skycode_operator\">$1</span>");
								}else{
									t += skycodeScript.childNodes[a].textContent;
								};
							}else{
								t += skycodeScript.childNodes[a].outerHTML;
							};
						};
						skycodeScript.innerHTML = t;
						
						t = "";
						// punctuation
						for(var a = 0; a < skycodeScript.childNodes.length; a++){
							if(skycodeScript.childNodes[a].nodeName == "#text"){
								if(scriptPunctuation.test(skycodeScript.childNodes[a].textContent) && !singleLineComment.test(skycodeScript.childNodes[a].textContent)){
									scriptPunctuation.lastIndex = 0;
									t += skycodeScript.childNodes[a].textContent.replace(scriptPunctuation,"<span class=\"skycode_punctuation\">$1</span>")
								}else{
									t += skycodeScript.childNodes[a].textContent;
								};
							}else{
								t += skycodeScript.childNodes[a].outerHTML;
							};
						};
						skycodeScript.innerHTML = t;
					};
					/*
					if(isComment || mcs || sc){
						if(mcs){
							isComment = true, mcs = false;
							childObj[i].innerHTML = childObj[i].innerHTML.replace(multiLineCommentStart,"$1<span class=\"skycode_comment\">$2</span>");
							if(mce) isComment = false, mce = false;
						}else if(sc){
							isComment = false, sc = false;
							childObj[i].innerHTML = childObj[i].innerHTML.replace(singleLineComment,"$1<span class=\"skycode_comment\">$2</span>");
						}else if(mce){
							isComment = false;
							childObj[i].innerHTML = childObj[i].innerHTML.replace(multiLineCommentEnd,"<span class=\"skycode_comment\">$1</span>$2");
						}else{
							if(childObj[i].childNodes[0].nodeType == 1){
								childObj[i].innerHTML = "<span class=\"skycode_comment\">" + childObj[i].childNodes[0].innerHTML + "</span>";
							}else{
								childObj[i].innerHTML = "<span class=\"skycode_comment\">" + childObj[i].innerHTML + "</span>";
							};
						};
					};
					*/
				};
				multiLineCommentStart.lastIndex = 0, multiLineCommentEnd.lastIndex = 0, singleLineComment.lastIndex = 0, htmlLine.lastIndex = 0, docType.lastIndex = 0, scriptString.lastIndex = 0, scriptBloolean.lastIndex = 0, scriptKeyword.lastIndex = 0, scriptFunction.lastIndex = 0, scriptPunctuation.lastIndex = 0;
			};
		}else{
			continue;
		};
	};
};
export default skycode;