/**
 * Created by ricardo on 2017-08-18.
 */
var appInfoList = null; //模块权限列表
$(function () {
    var token = sessionStorage.token;
    /** 1、判断用户是否登录，防止登录后再次后退登录 **/
    if (token == null) {
        console.log("发出请求");
        window.location.href = "../production/parts/login/login.html?schoolID=2";
    }

    /*** 2、统计系统用户数 ***/
    cntSystemUserNumber();

    /*** 3、初始化用户身份***/
    iframeUserBaseInit();

    /*** 获取新闻信息 ***/
    findNews();

    /*** 获取公告信息 ***/
    message_find();
});

/***
 * 1、子页面用户信息处理
 * @param userBaseInfo
 */
function iframeUserBaseInit() {
    var identity = sessionStorage.identity;
    var userName = sessionStorage.userName;
    var lastLoginTime = sessionStorage.lastLoginTime;
    /*** 用户身份处理 ***/
    if (identity == 1) {
        $('#baseRoleName').html("基础身份：教职工");
    } else if (identity == 2) {
        $('#baseRoleName').html("基础身份：家长");
    } else if (identity == 3) {
        $('#baseRoleName').html("基础身份：学生");
    } else {
        $('#baseRoleName').html("基础身份：管理员");
    }
    /*** 用户工号处理 ***/
    if (identity == 1 || identity == 3) {
        $('#loginXgh').html("学工号：" + userName);
    } else {
        $('#loginXgh').html("登录账户：" + userName);
    }

    /*** 上次登录时间 ***/
    $('#loginTime').html("上次登录时间：" + lastLoginTime);
    appInfoList = JSON.parse(sessionStorage.appInfoList); //一级菜单
    var flags = new Array(); //申明一个数组用来存储当前入口是否已经用过
    $("#mode_div .box").each(function (index, obj) {
        flags[index] = 0;
    })
    //判断菜单和入口是否是同一个，如果是则不隐藏，否则隐藏不显示
    if (appInfoList != null) {
        for (var i = 0; i < appInfoList.length; i++) {
            var appName = appInfoList[i].appName;
            var chirdAppInfoList = appInfoList[i].privilegeList; //二级菜单
            //循环一级菜单进行匹配
            $("#mode_div .box").each(function (index, obj) {
                if (obj.innerText.trim() != appName && flags[index] != 1) {
                    obj.style.display = 'none';
                    return true;
                } else if (flags[index] == 0) {
                    obj.style.display = '';
                    flags[index] = 1;
                    return true;
                }
            });
			//循环二级菜单进行匹配
			if (chirdAppInfoList != null) {
				for (var j = 0; j < chirdAppInfoList.length; j++) {
					var appName_ = chirdAppInfoList[j].appName;
					$("#mode_div .box").each(function (index, obj) {
						if (obj.innerText.trim() != appName_ && flags[index] != 1) {
							obj.style.display = 'none';
							return true;
						} else if (flags[index] == 0) {
							obj.style.display = '';
							flags[index] = 1;
							return true;
						}
					});
				}
			}
           
        }
    }
    var flag = true; //申明一个变量，判断是否存在显示的入口
    $("#mode_div .box").each(function (index, obj) {
        if (obj.style.display != 'none') {
            flag = false;
        }
    });
    if (flag) {
        $("#mode_div").append("<div>暂无数据!</div>");
    }
}


/***
 * 2、快捷入口页面跳转
 * @param modelID
 */
function modelQuick(modelID, moduleName) {
    if (modelID == 0) {
        zebraDialog_info('[' + moduleName + ']模块工程师正在开发中，敬请期待!', 'error');
        return;
    } else {
        var param = {};
        param.moduleID = modelID;
        param.appName = "module_getModuleUrl";
        /*** 登录状态处理 ***/
        serverFromJSONData(param, true).then(function (response) {
					if(typeof(response) == "object" && 
						Object.prototype.toString.call(response).toLowerCase() == "[object object]" && !response.length){
					}else{
						response = eval('(' + response + ')');
					}
            if (!checkValueIsNull(response.data)) {
                window.location.href = "../../../../../production/" + response.data;
            } else {
                zebraDialog_info('[' + moduleName + ']模块尚未对外开放，敬请期待!', 'error');
            }
        });
    }
}

/***
 * 3、统计系统用户数
 */
function cntSystemUserNumber() {
    var param = {};
    param.appName = "user_cntSystemUserNumber";
    serverFromJSONData(param, true).then(function (response) {
			if(typeof(response) == "object" && 
				Object.prototype.toString.call(response).toLowerCase() == "[object object]" && !response.length){
			}else{
				response = eval('(' + response + ')');
			}
        var dataList = response.data;
        $.each(dataList, function (n, obj) {
            if (obj.USERTYPE == 1) {
                $("#teacherNumber").html(obj.CNT + '<label class="cntSystemNumber">人</label>');
            }
            if (obj.USERTYPE == 2) {
                $("#parentNumber").html(obj.CNT + '<label class="cntSystemNumber">人</label>');
            }
            if (obj.USERTYPE == 3) {
                $("#studentNumber").html(obj.CNT + '<label class="cntSystemNumber">人</label>');
            }
        })
    });
}

function jump_html(status) {
    if (status == 1) {
        window.location.href = "parts/ykt/reChargeforms.html";
    } else if (status == 2) {
        window.location.href = "parts/baseman/organizationStructure.html";
    } else if (status == 3) {
        window.location.href = "parts/leave/leaveFind.html";
    } else if (status == 4) {
        window.location.href = "parts/questionnaire/questionnaireList.html";
    } else if (status == 5) {
        window.location.href = "parts/statistics/assessment/scoringStatistsDetail.html";
    } else if (status == 6) {
        window.location.href = "parts/grade/gradeList.html";
    } else if (status == 7) {
        window.location.href = "parts/book/contactList.html";
    } else if (status == 8) {
        window.location.href = "parts/repair/myRepair.html";
    } else if (status == 9) {
        window.location.href = "parts/familywork/familyworkList.html";
    } else if (status == 10) {
        window.location.href = "parts/news/newsFind.html";
    } else if (status == 11) {
        window.location.href = "parts/message/messageFind.html";
    }
}


function common(msg) {
    var param = {};
    // 1、公共参数组装
    param.appKey = "aGFuZHlDYW1wdXM=";
    param.appSecret = "1234567890abcedefgh";
    var time = new Date().getTime();
    param.time = time;

    /*msg.index = 1;*/
    var paramJsonMsg = JSON.stringify(msg);
    param.param = paramJsonMsg;
    // 3、生成签名
    var temp = 'appKey=aGFuZHlDYW1wdXM=&appSecret=1234567890abcedefgh&param=' + paramJsonMsg + '&time=' + time;
    param.sign = hex_md5(temp);
    // 4、对整个参数进行加密
    var jsonStr = JSON.stringify(param);
    return jsonStr;
}

/*获取新闻信息*/
function findNews() {
    var msg = {};
    msg.appName = "news_listNews";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async: false,
        success: function (success) {
					if(typeof(success) == "object" && 
						Object.prototype.toString.call(success).toLowerCase() == "[object object]" && !success.length){
					}else{
						success = eval('(' + success + ')');
					}
            var news = success.data.data;
            var html = '';
            var count = 0;
            var news_flag = true;
            if (news != null) {
                for (var i = 0; i < news.length; i++) {
                    if (news_flag) {
                        html += '<li><span>' + news[i].createTime + '</span><a>' + news[i].title +
                            '</a></li>';
                        if (count > 4) {
                            news_flag = false;
                        }
                    }
                    count++;
                }
            }
            $("#news_html").html(html);
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*获取公告信息*/
function message_find() {
    var msg = {};
    msg.appName = "message_messageList";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async: false,
        success: function (success) {
					if(typeof(success) == "object" && 
						Object.prototype.toString.call(success).toLowerCase() == "[object object]" && !success.length){
					}else{
						success = eval('(' + success + ')');
					}
            var masg;
            if (success.data != null) {
                masg = success.data.data;
                var html = '';
                var count = 0;
                var masg_flag = true;
                for (var i = 0; i < masg.length; i++) {
                    if (masg_flag) {
                        html += '<li><span>' + formatDateTime(masg[i].createTime) + '</span><a>' + masg[i].theme +
                            '</a></li>';
                        if (count > 4) {
                            masg_flag = false;
                        }
                    }
                    count++;
                }
                $("#message_html").html(html);
            }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

function formatDateTime(inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};
