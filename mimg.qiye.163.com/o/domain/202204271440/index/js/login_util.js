//string wrapper
String.prototype.replaceAll = function(search, replace){
	var regex = new RegExp(search, "g");
	return this.replace(regex, replace);
};
String.prototype.trim = function() {
	return this.replace(/(^\s+)|(\s+$)/g, "");
};

// 高TLS 用shz节点域名前缀
domainType = window.highTls === 'true' ? 'shz' : domainType;

var cookie = function(key, value, options){
	if(typeof value=="undefined"){
		value=null;
		if(document.cookie && document.cookie!=''){
			var arr = document.cookie.split(";");
			for(var i=0;i<arr.length;i++){
				var c = arr[i].trim();
				if (c.substring(0, key.length + 1) == (key + '=')) {
					value = decodeURIComponent(c.substring(key.length + 1));
					break;
				}
			}
		}
		return value;
	}
	options = options || {};
	if(value===null){
		value="";
		options.expires=-1;
	}
	var expires="";
	if(options.expires && (typeof options.expires=="number" || options.expires.toUTCString)){
		var date;
		if(typeof options.expires=="number"){
			date = new Date();
			date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
		}else{
			date = options.expires;
		}
		expires = "; expires=" + date.toUTCString();
	}
	var path = options.path ? '; path=' + (options.path) : '';
	var domain = options.domain ? '; domain=' + (options.domain) : '';
	var secure = options.secure ? '; secure' : '';
	document.cookie = [key, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
}
var msgMap ={
	"input.account_name":"请输入登录帐号",
	"input.verifyCodeMsg":"请输入验证码",
	"input.codeError":"验证码错误",
	"input.email":"请输入完整的邮箱地址",
	"input.password":"请你输入密码",
	"input.noat":"请使用不包括@部分帐号登录",
	"input.accountlocked":"密码输入错误次数过多，请稍候再试",
	
	"input.account_name.en_US":"please enter your account",
	"input.verifyCodeMsg.en_US":"please input verification code",
	"input.codeError.en_US":"Verification code error",
	"input.email.en_US":"please enter your email address",
	"input.password.en_US":"please enter your password",
	"input.noat.en_US":"please enter your account without '@'",
	"input.accountlocked.en_US":"wrong password too many times, please try again later",
	
	"input.account_name.zh_TW":"請輸入登錄帳號",
	"input.verifyCodeMsg.zh_TW":"请输入驗證碼",
	"input.codeError.zh_TW":"驗證碼錯誤",
	"input.email.zh_TW":"請輸入完整的郵箱地址",
	"input.password.zh_TW":"請你輸入密碼",
	"input.noat.zh_TW":"請使用不包括@部分的帐号登录",
	"input.accountlocked.zh_TW":"錯誤密碼輸入次數過多，請稍後再試"
}
function showTips(){
	var oTxt = document.getElementById("divText");
	if(oTxt){
		var max = oTxt.getElementsByTagName("p").length;
		var i=1;
		setInterval(function fnChangeText(){
			i=i<max?i+1:1;
			oTxt.className = "mod text-mod text-mod-"+i;
		},5000);
	}
}
var defaultClass = "ipt-t";
var isClassDefault = false;
var code = "input.account_name";
var hl = getHl();
function getHl(){
	var hl = getParam("hl");
	if(!hl){
		hl = cookie("hl");
	}
	if(hl == "en")hl = "en_US";
	if(hl == "zh-TW")hl = "zh_TW";
	if(hl == "zh-cn")hl = "zh_CN";
	return hl || "zh_CN";
}
function getId(id){
	return document.getElementById(id);
}
function getParam(key){
	var str = decodeURI(location.search.substring(1));
	if(str=="")return null;
	var arr = str.split("&");
	for(var i=0;i<arr.length;i++){
		if(arr[i].indexOf(key+"=")==0){
			return arr[i].substring(key.length+1);
		}
	}
	return null;
}
function getMsg(code){
	var value = msgMap[code + "." + hl];
	if(!value){
		value = msgMap[code];
	}
	return value;
}
function setMsgpid (msg) {
	$("#app-download-wrapper").hide();
    $("#err-wrapper").show();
    $("#msgpid").text(msg)
}
function showError(code, element){
	var msg = getMsg(code);
	var msgpid = getId("msgpid");
	if(msgpid){
		setMsgpid(msg);
	}else{
		alert(msg);
	}
	if(element){
		element.focus();
	}
}
function setMsg(){
	var msgpid = getId("msgpid");
	if(!msgpid || msgpid.innerHTML.trim() == ""){
		var msg = cookie("ex_msg");
		if(!msg)return;
		msg = msg.replaceAll("\\+", " ");
		if(msgpid){
			setMsgpid(msg);
		}else{
			alert(msg);
		}
		cookie("ex_msg", "");
	}
}
/* 获取url参数 */
function getQueryString(e) {
    var t = new RegExp("(^|&)"+e+"=([^&]*)(&|$)","i");
    var paramStr = window.location.hash || window.location.search;
    var n = paramStr.substr(1).match(t);
    if( n != null) {
        return unescape( n[2] );
    }
    return "";
}
//新增验证码
function changeVerifyCode() {
	if(verifyCode !== 'true'){
        return;
    };
    var entryHost = 'entry.qiye.163.com';
    if(domainType === 'qiyehz' || domainType === 'hz'){
        entryHost = 'entryhz.qiye.163.com';
    }
	if(domainType === 'shz'){
        entryHost = 'entryshz.qiye.163.com';
	}
    var url = 'https://' + entryHost +'/domain/getverifycode.jsp?all_secure=1&rnd=' + new Date().getTime();
	// var url = verifyCodeUrl + '?_searchtime=' + new Date().getTime();
	$('#codeImgWrap').find('img').attr('src',url);
}
window.onload=function(){
	//检查是否有异常信息
	setMsg();
	//显示背景提示信息
	showTips();
	var domain = getId("domain").value;
	var host=location.hostname;
	var pos = host.indexOf("mail.");
	if(pos == 0){
		domain = host.substring(5);		
	}
	pos = host.indexOf("mail.qiye.");
	if(pos == 0 && host != "mail.qiye.163.com"){
		domain = host.substring(10);
		var msgpid = getId("msgpid");
		var msg = getParam("msg");
		if(msgpid){
			setMsgpid("");
		}
		if(msg){
			setMsgpid("登录失败，请重新尝试");
		}
	}
	//getId("domain").value = domain;
	//设置提示信息
	if(domain==""){
		code="input.email";
	}
	account = getId("account_name");
	isClassDefault = (account.className.indexOf(defaultClass) > -1);
	account.onfocus=function(){
		if(this.value==getMsg(code)){
			this.value="";
			if(isClassDefault)this.className = "ipt-t";
		}
	};
	account.onblur=function(){
		if(this.value==""){
			this.value=getMsg(code);
			if(isClassDefault)this.className = "ipt-t ipt-sample";
		}
	};
	//获得cookie中记住的用户名
	var remUserName=cookie("qiye_account");
	var postfix = "@" + domain;
	if(remUserName && (remUserName.indexOf(postfix) == remUserName.length - postfix.length)){
		if(isClassDefault)account.className = "ipt-t";
		if(domain==""){
			account.value=remUserName;
		}else{
			account.value=remUserName.replace("@" + domain, "");
		}
		getId("remUsername").checked="checked";
		getId("password").focus();
	}else{
		if(domain!=""){
			account.value="";
			account.focus();
		}else{
			account.value=getMsg(code);
		}
	};
    getId("codeImgWrap").onclick=function(){
		changeVerifyCode();
    };
	if(verifyCode === 'true'){
    	$("#verifyCodeWrap").show();
    	changeVerifyCode();
    };
	var verifyCodeInputEle = getId("verify_code");
	verifyCodeInputEle.value=getMsg("input.verifyCodeMsg");
	verifyCodeInputEle.onfocus=function(){
		if(this.value==getMsg("input.verifyCodeMsg")){
			this.value="";
			this.className = "";
		}
	};
	verifyCodeInputEle.onblur=function(){
		if(this.value==""){
			this.value=getMsg("input.verifyCodeMsg");
			this.className = "ipt-sample";
		}
	};
	
};
function frmvalidator(){
	account = getId("account_name");
	p = getId("password");
	var account_name=account.value;
	var password=p.value;
	var domain = getId("domain").value;
	if(account_name=="" || account_name==getMsg(code)){
		showError(code, account);
		return false;
	}
	if(password==""){
		showError("input.password", p);
		return false;
	}
	var pos = account_name.indexOf("@");
	if(pos > 0){
		var ndomain=account_name.substring(pos + 1);
		if(domain == "" || domain == "qiye.163.com"){
			getId("domain").value = ndomain;
		}else if(ndomain != domain){			
			showError("input.noat");
			return false;
		}
		account.value=account_name.substring(0,pos);
	}else if(domain == ""){
		showError("input.email", account);
		return false;
	};
	if($("#verifyCodeWrap").length > 0){
		if($("#verifyCodeWrap").is(":hidden")){
			$("#verify_code").val('');
		}
		else{
			if( isEmpty($("#verify_code").val()) || $("#verify_code").val()==getMsg("input.verifyCodeMsg") ){
				showError("input.verifyCodeMsg",getId("verify_code"));
				return false;
			}
			else{
				//allow submit
			}
		};
	};
	//禁止再次点击提交按钮
	$("#submit-btn").attr("disabled", true);
	var form = getId("loginform");
	var url = form.action;
	if(!url){
		url = "https://entry.qiye.163.com/domain/domainEntLogin";
	}
	form.action = url;
	
	//是否记住用户名
	var host=location.hostname;
	if(getId("remUsername").checked){		
   		var acc = account.value+"@" + domain;
   		cookie("qiye_account", acc, {domain:host,path:"/",expires:4});		
	}else{
		cookie("qiye_account", "" ,{domain:host,path:"/",expires:0});
	}
	//记住所选语言
	cookie("hl", hl, {domain:host,path:"/",expires:4});

	//如果线路选择正常显示，则记住选择线路
	cookie("ch", getId('ch').value, {domain:host,path:"/",expires:4});

	prelogin();
	return false;
	// 2017-5-22 与后端（jinshan@corp.netease.com）和产品（hzyujianlong@corp.netease.com）确定，不管是标准自定义登录页还是用户自定义登录页都进行预登录
	// if(pageType){
	// 	//标准自定义登录页
	// 	prelogin();
	// 	return false;
	// }
	// else{
	// 	//用户自定义登录页
	// 	return true;
	// }
}
function isEmpty(val){
	if(typeof val ==="undefined" || val===null || val ===""){
		return true;
	}
	else{
		return false;
	}
}
function prelogin(node){
    var userNode = node || domainType || 'bj';
	if(userNode === 'ym'){
        that.doSubmitForm($("#loginform"),userNode);
    }
    else{
    	var exchgKeyUrl;
        if(userNode == 'hz' || userNode == 'qiyehz'){
            exchgKeyUrl = 'https://entryhz.qiye.163.com/domain/prelogin.jsp';
        }else if(userNode === 'shz'){
            exchgKeyUrl = 'https://entryshz.qiye.163.com/domain/prelogin.jsp';
		}
        else{
            exchgKeyUrl = 'https://entry.qiye.163.com/domain/prelogin.jsp';
		}
		exchgKeyUrl = exchgKeyUrl.replace('https:///','https://'+getId('ch').value);
    	var uid = $("#account_name").val() + "@" + $("#domain").val();
		var code = '';
		if(!$("#verifyCodeWrap").is(":hidden")){
			code = $("#verify_code").val();
		};
		exchgKeyUrl = exchgKeyUrl + "?uid=" + uid + '&code=' + code;
		$.jsonp({
			url: exchgKeyUrl,
			callbackParameter: "callback",
	        success: function(json){
	            if(json && json.code == 200){
	            	if(json.data.locked === true){
	            		if(window.isCommonPage === true){
	        				//域名是qiye.163.com统一的登录页面，还原帐号全名
		        			var fullAccountName = getId("account_name").value + '@' + getId("domain").value;
							getId("account_name").value = fullAccountName;
							getId("domain").value = 'qiye.163.com';
	        			}
						if(userNode){
							//保存用户节点信息
	        				domainType = userNode;
						}
						showError("input.accountlocked");
	            	}
	        		else if(json.data.verify_code === true){
	        			if(window.isCommonPage === true){
	        				//域名是qiye.163.com统一的登录页面，还原帐号全名
		        			var fullAccountName = getId("account_name").value + '@' + getId("domain").value;
							getId("account_name").value = fullAccountName;
							getId("domain").value = 'qiye.163.com';
	        			}
						if(userNode){
							//保存用户节点信息
	        				domainType = userNode;
						}
	                    if(verifyCode !== 'true'){
        					verifyCode = 'true';
							$("#verifyCodeWrap").show();
							changeVerifyCode();
							showError("input.verifyCodeMsg",getId("verify_code"));
						}
						else{
							$("#verifyCodeWrap").show();
							changeVerifyCode();
							showError("input.codeError",getId("verify_code"));
						}
						$("#verify_code").val('');
						$("#submit-btn").removeAttr("disabled");
	                    return;
	                }
	                else{
		            	try{
							var rsaKey = json.data;
							var rsa = new RSAKey();
							rsa.setPublic(rsaKey.modulus,rsaKey.exponent);
							var res = rsa.encrypt($("#password").val() + "#" + rsaKey.rand);
							if(!isEmpty(res) && !isEmpty(rsaKey.pubid)){
								$("#password").val(res);
								$("#pubid").val(rsaKey.pubid);
								$("#passtype").val("3");
							};
		            	}catch(e){
		            		console.log(e);
		            	}finally{
							doSubmitForm($("#loginform"),userNode);
		            	}
	            	}
				}
				else if(json && json.code == 404){
					$("#verifyCodeWrap").hide();
                    $("#verify_code").val('');
					prelogin(json.data.node);
				}
				else{
					doSubmitForm($("#loginform"),userNode);
				};
	        },
	        error:function(){
	        	doSubmitForm($("#loginform"),userNode);
	        }
	    });
    }
}
//提交表单
function doSubmitForm($form,userNode){
	if(pageType === 'normal'){
		//加密后判断账号节点后再提交
		if(userNode == 'bj'){
			$form.attr('action','https://entry.qiye.163.com/domain/domainEntLogin');
		}else if(userNode === 'shz'){
            exchgKeyUrl = 'https://entryshz.qiye.163.com/domain/domainEntLogin';
		}
		else if(userNode == 'hz'){
			$form.attr('action','https://entryhz.qiye.163.com/domain/domainEntLogin');
		}
		else if(userNode == 'ym'){
			$form.attr('action','https://entry.ym.163.com/login/login');
		}
	}
	else if(pageType === 'admin'){
		if(userNode == 'bj'){
			$form.attr('action','https://entry.qiye.163.com/domain/domainAdminLogin');
		}
		else if(userNode == 'hz'){
			$form.attr('action','https://entryhz.qiye.163.com/domain/domainAdminLogin');
		}else if(userNode == 'shz'){
			$form.attr('action','https://entryshz.qiye.163.com/domain/domainAdminLogin');
		}
	}
	if(userNode!='ym'&&getId('ch').value=='hw'){
		var action = $form.attr('action').replace('https:///','https://hw/');
		$form.attr('action',action);
	}
	var paramP = getQueryString('p');
	if(paramP){
		var inputP = $('<input type="hidden" name="p" />');
		$form.append(inputP);
		inputP.val(paramP);
	}
	//防止再次触发 onsubmit 事件
	$form.removeAttr('onsubmit');
	$form[0].onsubmit = null;
	$form[0].submit();
	return true;
}
function DrawImage(ImgD,iwidth,iheight){
	if(ImgD==null||ImgD.src==null)
		return;
	var image=new Image();
	image.src=ImgD.src;
	if(image.width>0 && image.height>0){
		if(image.width/image.height>= iwidth/iheight){
			if(image.width>iwidth){ 
				ImgD.width=iwidth;
				ImgD.height=(image.height*iwidth)/image.width;
			}else{
				ImgD.width=image.width; 
				ImgD.height=image.height;
			}
		}else{
			if(image.height>iheight){ 
				ImgD.height=iheight;
				ImgD.width=(image.width*iheight)/image.height; 
			}else{
				ImgD.width=image.width; 
				ImgD.height=image.height;
			}			
		}
	}
}