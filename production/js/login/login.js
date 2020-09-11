/**
 * Created by ricardo on 2017-08-18.
 */
var sid = "-1";// 从index首页传过来的schoolid
var schoolData=[];
$(function () {
    $("main").css("height",$(window).height());

    if (window.history && window.history.pushState) {
        $(window).on('popstate', function () {
            window.history.pushState('forward', null, '#');
            window.history.forward(1);
        });
    }
    
    window.history.pushState('forward', null, '#'); //在IE中必须得有这两行
    window.history.forward(1);
    
    /*** 接收并处理来自index.js转发过来的请求 ***/
    getSid();
    
    /*** 设置学校名称 ***/
//  $("#loginSchoolName").text(sessionStorage.schoolName);
	console.log(sessionStorage);
    
    /*判断是否设置了背景图片或者水印图片*/
    console.log(schoolData);
//	if(schoolData.schoolBgPicture!=''&&schoolData.hasOwnProperty('schoolBgPicture')){
//		$(".login-main").css("background","url("+schoolData.schoolBgPicture+") no-repeat ");
//	}
//	if(schoolData.schoolAspjpeg!='' && schoolData.hasOwnProperty('schoolAspjpeg')){
//		$(".login-main .login-bottom-logo").css("background","url("+schoolData.schoolAspjpeg+")");
//	}
	if(schoolData.schoolLogo == null || schoolData.schoolLogo == ''){
		$("#schlogo").html('<img src="../../images/img/login-icon04.png"  alt="">');
	}else{
		$("#schlogo").html('<img style="width: 300px;height:200px" src="'+schoolData.schoolLogo+'"  alt="">');
//		$("#schlogo").html('<img src="../../images/img/login-icon04.png"  alt="">');
	}
	//学校名称和英文名称
	if(schoolData.schoolName!='' || schoolData.schoolName!=null){
		$(".schoolName").html(schoolData.schoolName);
	}
	if(schoolData.enSchoolName!='' || schoolData.enSchoolName!=null){
		$(".enSchoolName").html(schoolData.enSchoolName);
	}
	
    /*** 监听登录账户框的输入值***/
    $("#loginName").bind("input propertychange change",function(event){
        var loginName = $("#loginName").val();
        if(checkValueIsNull(loginName)){
            $("#login-info-tips").html("请输入登录账户!");
        }else{
            $("#login-info-tips").html("");
        }
    });

    /*** 监听登录密码框的输入值***/
    $("#loginPas").bind("input propertychange change",function(event){
        var loginPas = $("#loginPas").val();
        if(checkValueIsNull(loginPas)){
            $("#login-info-tips").html("请输入登录密码!");
        }else{
            $("#login-info-tips").html("");
        }
    });
    
    /***回车事件 ***/
    $(document).keydown(function(event){  
        if(event.keyCode==13){ 
           checkLogin();
        } 
    }); 

    /** 登录相关业务 **/
    $("#login_userLogin").on("click",function(){
        checkLogin();
    });
})

/***
 * 验证登录
 */
function checkLogin(){
	
	var loginName = $('#loginName').val();
        if (checkValueIsNull(loginName)){
            $("#login-info-tips").html("请输入登录账户!");
            return;
        }
        var loginPas = $("#loginPas").val();
        if (checkValueIsNull(loginPas)){
            $("#login-info-tips").html("请输入登录密码!");
            return;
        }

        if (sid == "-1" || checkValueIsNull(sid)){
            $("#login-info-tips").html("连接"+sessionStorage.schoolName+"服务器失败!");
            return;
        }

        /*** 发起登录请求 ***/
        var param = {};
        param.userName = loginName;
        param.password = loginPas;
        param.loginFromMan = 1;
        param.sid = sid;
        param.appName = "login_login";
        serverFromJSONData(param,false).then(function (response){
					if(typeof(response) == "object" && 
						Object.prototype.toString.call(response).toLowerCase() == "[object object]" && !response.length){
					}else{
						response = eval('(' + response + ')');
					}
					console.log(response);
            var resultData = response.data;
            if (resultData == null || response.msgState != 200){
                if(checkValueIsNull(response.msg)){
                    $("#login-info-tips").html("连接"+sessionStorage.schoolName+"服务器发生错误，请稍后再试!");
                }else{
                    var msgState = response.msgState;
                    if(msgState == 404 || msgState == 405 || msgState == 403){
                        $("#login-info-tips").html(response.msg);
                        return;
                    }else if(msgState == 900){
                        $("#login-info-tips").html(response.msg);
                        return;
                    }else{
                        if(msgState == 200){
                            $("#login-info-tips").html("登录成功!");
                        }else {
                            $("#login-info-tips").html(response.msg);
                            return;
                        }
                    }
                }
            }
            sessionStorage.token = resultData.token[0] + "_" + resultData.token[1];
            if(sessionStorage.token){
                window.location.href = "../../index.html";
            }
        }),function (error) {
            $("#login-info-tips").html("连接"+sessionStorage.schoolName+"服务器发生错误，请稍后再试!");
        };
}

function getSid(){
    debugger
    /*** 获取nginx配置传的学校固定的id值，为安全考虑，后续再考虑将url后的参数进行加密处理 ***/
    sid = matchSchoolIDFromHost("hdszx.czxypt.com"); //window.location.hostname
    if(sid == "-1"){
        /*** 如果未获取到请求的schoolid，则弹出提示框，不再进行任何的跳转，后续再考虑优化页面提示 ***/
        window.location.href = "../../production/schoolNotExists.html";
        return;
    }
    /***刷新一次***/
    if(checkValueIsNull(sid)){
        getSid();
    }
    getBaiDuToken();
}

/*获取百度语音播报token*/
function getBaiDuToken(){
    /*** 发起登录请求 ***/
    var param = {};
    param.appName = "login_getBaiDuYuYinBoBaoToken";
    serverFromJSONData(param,false).then(function (response){
    	if(typeof(response) == "object" && 
			Object.prototype.toString.call(response).toLowerCase() == "[object object]" && !response.length){
		}else{
			response = eval('(' + response + ')');
		}
//  	alert(response);
    	var str = response.data;
		sessionStorage.setItem('baiduyuyin', str);
		console.log(response.data);    	
    }),function (error) {
        $("#login-info-tips").html("连接"+sessionStorage.schoolName+"服务器发生错误，请稍后再试!");
    };
}