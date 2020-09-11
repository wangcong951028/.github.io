/**
 * Created by ricardo on 2017-08-18.
 */
var userBaseInfo = null;
var tempMenuID = 0;// 临时的模块id
var isCarrier = 0;// 是否运营商登录
var sid = "-1";// 临时的学校id
var btnType = 1;// 按钮类型, 1：短信验证码校验

$(function() {
	var token = sessionStorage.token;
	var userLoginInfo = null;
	var schoolInfo = null;
	var appInfoList = null;
	var pageSize = 10;// ，每页显示个数
	var pageNo = 1;// 页码
	var totalPage = 0;// 总页数

	/** * 禁止浏览器后退 ** */
	if (window.history && window.history.pushState) {
		$(window).on('popstate', function() {
			window.history.pushState('forward', null, '#');
			window.history.forward(1);
		});
	}
	window.history.pushState('forward', null, '#'); // 在IE中必须得有这两行
	window.history.forward(1);

	/** ** 域名判断 * */
	getSid();

	/** 判断用户是否登录，防止登录后再次后退登录 * */
	if (token == null) {
		/* 如果用户token为空，判定用户尚未登录或者需要再次登录 */
		sessionStorage.sid = sid;
		window.location.href = "../production/parts/login/login.html";
	} else {

		var param = {};
		param.loginFromMan = 1;
		param.appName = "login_skipLogin";
				/** * 登录状态处理 ** */
				serverFromJSONData(param, true)
						.then(
								function(response) {
									if(typeof(response) == "object" && 
										Object.prototype.toString.call(response).toLowerCase() == "[object object]" &&!response.length){
									}else{
										response = eval('(' + response + ')');
									}
									userBaseInfo = response.data.userBaseInfo;// 人员基本数据
									userLoginInfo = response.data.userLoginInfo;// 人员登录数据
									if (userBaseInfo.identity != system_user_identity_carrier) {// 学校数据
										schoolInfo = response.data.schoolInfo;
									}
									appInfoList = response.data.appInfoList;// 人员权限数据
									var rolelist = userBaseInfo.groupList;
									if(rolelist != null){
										for(var i=0;i<rolelist.length;i++){
											if(rolelist[i].roleID == 6){
												sessionStorage.role = rolelist[i].roleID;//人员角色列表
											}
										}
									}
									
									$("#loginUserRealName").val(
											userBaseInfo.realName);

									/** *存储数据到localStore** */
									sessionStorage.identity = userBaseInfo.identity;
									sessionStorage.userName = userBaseInfo.userName;
									sessionStorage.appInfoList = JSON.stringify(appInfoList);
									sessionStorage.lastLoginTime = buildStandardTime(userLoginInfo.lastLoginTime);

									$("#userId").val(userBaseInfo.userID);
									/** 基础信息数据赋值 * */
									$("#loginRealName").html( '您好，' + userBaseInfo.realName);
									$("#loginxgh").html("学工号："+userBaseInfo.userName)
									if (userBaseInfo.identity != system_user_identity_carrier) {// 学校数据
										$("#manName").html("成长校园平台");
										$("#loginSchoolName").html( schoolInfo.schoolName);
									} else {
										$("#manName").html("运营控制台");
										$("#loginSchoolName").html("系统运营中心");
									}
									if (checkValueIsNull(userBaseInfo.zjz)) {
										$("#userHeadImg").attr("src", "images/userPic.jpg");
										$("#userHeadImgMin").attr("src", "images/userPic.jpg");
									} else {
										$("#userHeadImg").attr("src", userBaseInfo.zjz);
										$("#userHeadImgMin").attr("src", userBaseInfo.zjz);
									}
									$("#loginUserRealName").html( userBaseInfo.realName);

									/** * 首页右边数据展示 ** */

									/** 权限模块数据 * */
									if (appInfoList != null) {
										/** 获取首页应用列表 * */
										var appInfoFirstList = pagination(
												pageNo, pageSize, appInfoList);
										getTotalPage();
										if (totalPage <= 1) {
											$("#page_div").hide();
										}else{
											$("#page_div").show();
										}
										buildIndexAppList(appInfoList, "");
									}
									// $("#rightIframe").attr("src","../production/index-right.html");
									$("#rightIframe").attr("src",
											"../production/index2_2.html");
								}),
				function(error) {
					informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
				};
	}
	
	
	$("#upper-page").click(function() {
		if (pageNo == 1) {
			return;
		} else {
			buildIndexAppList(appInfoList, "-");
		}
	});
	$("#next-page").click(function() {
		if (pageNo == totalPage) {
			return;
		} else {
			buildIndexAppList(appInfoList, "+");
		}
	});

	/**
	 * 分页函数
	 * 
	 * @param pageNo
	 * @param pageSize
	 * @param array
	 * @returns {*}
	 */
	function pagination(pageNo, pageSize, array) {
		var offset = (pageNo - 1) * pageSize;
		return (offset + pageSize >= array.length) ? array.slice(offset,
				array.length) : array.slice(offset, offset + pageSize);
	}

	/***************************************************************************
	 * 计算总页码
	 */
	function getTotalPage() {
		if (appInfoList == null || appInfoList.length == 0) {
			totalPage = 0;
		} else {
			var appInfoListLength = appInfoList.length;
			totalPage = appInfoListLength % pageSize != 0 ? (parseInt(appInfoListLength
					/ pageSize)) + 1
					: Math.ceil(appInfoListLength / pageSize);
		}
	}

	/**
	 * 通用循环
	 * 
	 * @param array
	 *            循环数组
	 * @param flag
	 *            翻页标识
	 */
	function buildIndexAppList(array, flag) {
		$("#appInfoList").html("");
		if (flag == "+") {
			pageNo = pageNo + 1;
		} else if (flag == '-') {
			pageNo = pageNo - 1;
		} else {
			pageNo = pageNo;
		}
		var appInfoFirstList = pagination(pageNo, pageSize, appInfoList);
		$
				.each(
						appInfoFirstList,
						function(index, appInfo) {
							/* if (appInfo.privilegeList.length > 7) {
								var appInfoLi = "<li>"
										+ "<a><i class='"
										+ appInfo.icon
										+ "'></i> "
										+ appInfo.appName
										+ " <span class='fa fa-chevron-down'></span></a>"
										+ "   <ul class='nav child_menu' style='height: 260px;overflow-y: auto'>"
										+ buildChildAppList(appInfo.privilegeList)
										+ "   </ul>" + "</li>";
								$("#appInfoList").append(appInfoLi);
							} else { */
								var appInfoLi = "<li>"
										+ "<a><i class='"
										+ appInfo.icon
										+ "'></i> "
										+ appInfo.appName
										+ " <span class='fa fa-chevron-down'></span></a>"
										+ "   <ul class='nav child_menu'>"
										+ buildChildAppList(appInfo.privilegeList)
										+ "   </ul>" + "</li>";
								$("#appInfoList").append(appInfoLi);
							/* } */

						});
	}
	;

	/** * 遍历二级菜单元素 ** */
	function buildChildAppList(childArray) {
		var childAppInfo = "";
		$.each(childArray, function(childIndex, child) {
			var appID = child.appID;
			var expandModuleList = child.expandMenuList;
			var visiturl = "";
			/** * 如果当前第二级有第三季菜单数据，则取消第二级的点击链接，否则加上点击链接 ** */
			if (expandModuleList != null && expandModuleList.length != 0) {
				childAppInfo += "<li><a onmouseover='childMenuClick(" + appID
						+ ")' target='iframe'>" + child.appName + "</a>"
						+ buildPopupMenu(appID, expandModuleList) + "</li>";
			} else {
				childAppInfo += "<li><a href='" + child.visiturl
						+ "' onclick='childMenuClick(" + appID
						+ ")' target='iframe'>" + child.appName + "</a></li>";
			}

		});
		return childAppInfo;
	}

	/** * 获取侧边栏的弹出框 ** */
	function buildPopupMenu(parentID, expandModuleList) {
		var childMenu = "";
		var chilMenuList = "";
		$
				.each(
						expandModuleList,
						function(childMenuIndex, childMenu) {
							chilMenuList += "<tr onmousemove=javascript:cmove(this) onmouseout=javascript:cout(this)><td><a href='"
									+ childMenu.visiturl
									+ "' target='iframe'>"
									+ childMenu.appName + "</a></td></tr>";
						});

		childMenu += "<div class='childMenu' onmouseleave=javascript:removeMenu(this) id='expandMenu_" + parentID + "'>"
				+ "<div class='border'></div>" + "<div><table>" + chilMenuList
				+ "</table></div>" + "</div>";
		return childMenu;
	}

	/***************************************************************************
	 * 监听验证码输入框值改变事件
	 */
	$("#u_code").focus(function() {
		$("#infoMsg").html("");
	});

	/***************************************************************************
	 * 输入密码处值改变事件
	 */
	$("#u_oldpwd").focus(function() {
		$("#oldPwdMsg").html("");
	});
	$("#u_newpwd").focus(function() {
		$("#newPwdMsg").html("");
	});
	$("#u_confirmPwd").focus(function() {
		$("#confirmPwdMsg").html("");
	});
	// 点击查看用户基本信息
	$("#baseInfo_div").click(function() {
		var userId = $("#userId").val();
		queryUserInfo(userId);
		$('#userInfo_div').modal('show');
	});

})

/*******************************************************************************
 * 28、查询人员的基础信息
 * 
 * @param userID
 */
function queryUserInfo(userID) {

	$("#organizationNameList").empty();
	$("#u_childList").empty();
	globalIndex = 1;

	organizationNameList = "";
	// 2、接口请求参数组装
	var msg = {};
	msg.userID = userID;
	msg.appName = "user_getUserBaseInfo";

			serverFromJSONData(msg, true)
					.then(
							function(success) {
								if(typeof(success) == "object" && 
									Object.prototype.toString.call(success).toLowerCase() == "[object object]" && !success.length){
								}else{
									success = eval('(' + success + ')');
								}
								var userBaseInfo = success.data;
								$("#u_userName").val(userBaseInfo.realName);
								cityCode = userBaseInfo.cityCode;
								proviceCode = userBaseInfo.proviceCode;
								/**
								 * ****************************** 判断用户的身份类别
								 * ********************************
								 */
								/** 28.1如果身份是教师和学生* */
								if (userBaseInfo.identity == 1
										|| userBaseInfo.identity == 3) {
									$("#u_userPrimaryKey").text("学工号");
									$("#u_xh").attr("placeholder",
											"请填写增加用户的学工号");
									/** * 显示选择部门的div ** */
									$("#u_checkedDepartDiv").show();
									$("#u_uncheckedDepartDiv").show();
									/** * 隐藏填写当前用户孩子的信息** */
									$("#u_parentChildName").hide();
									$("#u_parentChildXgh").hide();
									$("#u_parentChildRelation").hide();
									$("#u_xjh_div").hide();
									$("#u_jg_div").show();
									$("#s_u_idtype_div").hide();
									$("#u_idType_div").show();
									$("#u_address_div").hide();
									$("#u_stu_p_div").hide();
									$("#organ").text("隶属部门");
									$("#u_userMobile_div").show();
									$("#u_userMobile_clz").val(userBaseInfo.mobile);

								} else {
									return;
								}
								$("#u_xh").val(userBaseInfo.userName);
								if (!checkValueIsNull(userBaseInfo.zjz)) {
									$(".zjz").attr("src",
											userBaseInfo.zjz);
								} else {
									$(".zjz").removeAttr("src");
								}

								/** * 用户民族 ** */
								initUserMz(userBaseInfo.mz, "u_mz");

								/** * 查找下拉列表中的值和用户本身的值进行匹配 ** */
								$('#u_divselect_ul')
										.find('li')
										.each(
												function() {
													var aobj = $(this)
															.find("a");
													if (aobj.attr("selectid") == userBaseInfo.idType) {
														idType = userBaseInfo.idType;
														$("#u_citeClick").html(
																aobj.text());
														$("#u_citeClick").css(
																"color",
																"black");
													}
												});

								/* $("#u_zjlx").find("option[value='"+userBaseInfo.idType+"']").attr("selected",true); */
								if (userBaseInfo.idNumber == null
										|| userBaseInfo.idNumber == '') {
									$("#u_zjhm").attr("placeholder",
											"暂无该用户的证件号码，请及时更新")
								} else {
									$("#u_zjhm").val(userBaseInfo.idNumber);
									$("#u_s_zjhm").val(userBaseInfo.idNumber);
								}

								$(
										":radio[name='sex'][value='"
												+ userBaseInfo.sex + "']")
										.prop("checked", "checked");
								$(
										":radio[name='identity'][value='"
												+ userBaseInfo.identity + "']")
										.prop("checked", "checked");
								if (userBaseInfo.brithday == null
										|| userBaseInfo.brithday == '') {
									$("#u_birthday").attr("placeholder",
											"暂无该用户的出生日期信息，请及时更新")
								} else {
									$("#u_birthday").val(userBaseInfo.brithday);
								}

								/** * 获取当前人员加入的部门 ** */
								if (userBaseInfo.identity != 2) {
									var organizaList = userBaseInfo.organizaList;
									if (organizaList != null) {
										$
												.each(
														organizaList,
														function(n, obj) {
															var organizationName = obj.organizationName;
															var organizationCode = obj.organizationCode;
															organizationNameList += buildDepartTag(
																	organizationCode,
																	organizationName,
																	obj.isLead,
																	userBaseInfo.identity);
														});
										$("#organizationNameList").append(
												organizationNameList);
									}
									// queryDeptList(userBaseInfo.identity);
									getuProviceList();
								} else {
									/** * 获取当前人员的孩子列表 ** */
									$("#u_childList")
											.append(
													buildChildList(
															userBaseInfo.childList,
															'u'));
									getuProviceList();
								}
							}),
			function(error) {
				informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
			};

}

/*******************************************************************************
 * 获取省份列表
 * 
 * @param proviceCode
 */
function getuProviceList() {
	var msg = {};
	msg.appName = "city_getProviceList";
			serverFromJSONData(msg, true)
					.then(
							function(success) {
								if(typeof(success) == "object" && 
									Object.prototype.toString.call(success).toLowerCase() == "[object object]" && !success.length){
								}else{
									success = eval('(' + success + ')');
								}
								var provice = $("#u_prov");
								provice.empty();
								var proviceListStr = "";
								var proviceList = success.data.list;

								if (proviceList != null
										&& proviceList.length != 0) {
									$
											.each(
													proviceList,
													function(name, value) {
														if (value.CODE == proviceCode) {
															proviceListStr += "<option value="
																	+ value.CODE
																	+ " selected='selected'>&nbsp;&nbsp;&nbsp;"
																	+ value.NAME
																	+ "&nbsp;&nbsp;&nbsp;</option>";
														} else {
															proviceListStr += "<option value="
																	+ value.CODE
																	+ ">&nbsp;&nbsp;&nbsp;"
																	+ value.NAME
																	+ "&nbsp;&nbsp;&nbsp;</option>";
														}
													});
									provice.append(proviceListStr);
									/** * 获取城市列表 ** */
									getuCityList();
								} else {
									informationAlert_OnlyConfirmButton_NOT_REFRESH("获取省份数据列表失败，请稍后再试!");
								}
							}),
			function(error) {
				informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
			};
}

/*******************************************************************************
 * 获取市列表
 * 
 * @param proviceCode
 */
function getuCityList() {
	var msg = {};
	msg.appName = "city_getCityList";
	msg.proviceCode = proviceCode;
			serverFromJSONData(msg, true)
					.then(
							function(success) {
								if(typeof(success) == "object" && 
									Object.prototype.toString.call(success).toLowerCase() == "[object object]" && !success.length){
								}else{
									success = eval('(' + success + ')');
								}
								var city = $("#u_city");
								city.empty();
								var cityListStr = "";
								var cityList = success.data.list;

								if (cityList != null && cityList.length != 0) {
									$
											.each(
													cityList,
													function(name, value) {
														if (value.CODE == cityCode) {
															cityListStr += "<option value="
																	+ value.CODE
																	+ " selected='selected'>&nbsp;&nbsp;&nbsp;"
																	+ value.NAME
																	+ "&nbsp;&nbsp;&nbsp;</option>";
														} else {
															cityListStr += "<option value="
																	+ value.CODE
																	+ ">&nbsp;&nbsp;&nbsp;"
																	+ value.NAME
																	+ "&nbsp;&nbsp;&nbsp;</option>";
														}
													});
									city.append(cityListStr);
								} else {
									informationAlert_OnlyConfirmButton_NOT_REFRESH("获取城市数据列表失败，请稍后再试!");
								}
							}),
			function(error) {
				informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
			};
}

/*******************************************************************************
 * 生成标签，用于查询数据时根据用户已有的生成标签，flag：是否选中
 * 
 * @param organizationCode
 * @param organizationName
 * @param flag
 * @param userType
 * @returns {string}
 */
function buildDepartTag(organizationCode, organizationName, flag, userTtype) {
	var isLeadFlag = "";
	if (flag == 1) {
		isLeadFlag = "<label id='isLead_"
				+ organizationCode
				+ "'><input type='checkbox' disabled name='isLeader' value='isLead_"
				+ organizationCode + "' checked><i>✓</i>领导</label>";
	} else {
		isLeadFlag = "<label  id='isLead_"
				+ organizationCode
				+ "'><input type='checkbox' disabled onclick='judgeDepartIsHaveLeader(&quot;"
				+ organizationCode + "&quot;)' name='isLeader' value='isLead_"
				+ organizationCode + "'><i>✓</i>领导</label>";
	}
	if (userTtype != 1) {
		isLeadFlag = "";
	}
	return "<div id='"
			+ organizationCode
			+ "' class='tagator_tag'>"
			+ organizationName
			+ "<div class='tagator_tag_remove' onclick='organizationClick(&quot;"
			+ organizationCode + "&quot;)'>×</div>" + "</div>" + isLeadFlag;
}

/*******************************************************************************
 * 初始化用户民族
 */
function initUserMz(mzName, ele) {
	var mz = $("#" + ele);
	mz.empty();
	if (mzName == null) {
		var mzListStr = "<option selected='selected'>--请选择--</option>";
	}
	if (mzArray != null && mzArray.length != 0) {
		$.each(mzArray, function(name, value) {
			if (value == mzName) {
				mzListStr += "<option  selected='selected'>&nbsp;&nbsp;&nbsp;"
						+ value + "&nbsp;&nbsp;&nbsp;</option>";
			} else {
				mzListStr += "<option>&nbsp;&nbsp;&nbsp;" + value
						+ "&nbsp;&nbsp;&nbsp;</option>";
			}
		});
		mz.append(mzListStr);
	}
}

/*******************************************************************************
 * 鼠标靠上去
 */
function cmove(trObj) {
	trObj.style.fontWeight = "bold";
}

/*******************************************************************************
 * 鼠标离开
 */
function cout(trObj) {
	trObj.style.fontWeight = 'normal';
}
function removeMenu(obj){
	console.log(obj)
	obj.style.display = 'none';
}

function childMenuClick(menuID) {
	var node = $('#expandMenu_' + menuID);
	if (node.is(':hidden')) {
		 node.show();
		//node.fadeIn(1000);
	} else {
		node.hide();
	}

	/** * 判断上次弹出的div是否关闭 ** */
	if (tempMenuID != menuID) {
		$('#expandMenu_' + tempMenuID).hide();
		tempMenuID = menuID
	}

}

function logon() {
	$.Zebra_Dialog('您是否确定退出系统？', {
		'type' : 'question',
		'title' : '系统消息',
		'overlay_opacity' : 0.4,
		'buttons' : [ {
			caption : '确定',
			callback : function() {
				logoutFlag = logout();
			}
		}, {
			caption : '取消',
			callback : function() {
			}
		}, ],
		'onClose' : function() {
			if (!logoutFlag) {
				zebraDialog_info('退出系统发生错误，请联系系统管理员!', 'error');
			}
		}
	});
}

/* 退出登录发出请求 */
function logout() {
	var logoutFlag = false;// 退出标识
	var param = {};
	param.appName = "login_logout";

	var jsonStr = buildRequestParam(param);

	$.ajax({
		type : 'POST',
		url : serverBaseUrl,
		data : jsonStr,
		dataType : "json",
		async : false,
		success : function(success) {
			if(typeof(success) == "object" && 
				Object.prototype.toString.call(success).toLowerCase() == "[object object]" && !success.length){
			}else{
				success = eval('(' + success + ')');
			}
			// var serverLogoutFlag = success.data;
			sessionStorage.removeItem('token');
			logoutFlag = true;
			window.location.href = "../production/parts/login/login.html";
		},
		beforeSend : function(xhr) {
			xhr.setRequestHeader("Content-type",
					"application/json;charset=UTF-8");
			xhr.setRequestHeader("token", static_token);
		}
	});

	return logoutFlag;
}

/* 系统帮助 */
function help() {
	zebraDialog_ques_onClose("当前系统版本号：V1.1.1", "information", false);
}

function getSid() {
	/** * 获取nginx配置传的学校固定的id值，为安全考虑，后续再考虑将url后的参数进行加密处理 ** */
	sid = matchSchoolIDFromHost(window.location.hostname);
	if (sid == "-1") {
		/** * 如果未获取到请求的schoolid，则弹出提示框，不再进行任何的跳转，后续再考虑优化页面提示 ** */
		window.location.href = "production/schoolNotExists.html";
		return;
	}
	/** *刷新一次** */
	if (checkValueIsNull(sid)) {
		getSid();
	}
}

/*******************************************************************************
 * 修改密码DIV,弹出div的时候
 */
function updatePwd() {
	emptyPwd();
	$("#updatePwd_div").modal("show");
	/** * 初始化时，强制显示手机框和验证码框 ** */
	$("#mobileDiv").hide();
	$("#codeDiv").hide();
	/** * div初始化时，隐藏密码框 ** */
	$("#oldPwd").show();
	$("#newPwd").show();
	$("#confirmPwd").show();
 	/** * 初始化按钮类型 ** */
// 	btnType = 1;
// 	/** * 查询用户的手机号码 ** */
/* 	var param = {};
	param.appName = "user_getUserMobile";
	serverFromJSONData(param, true).then(function(response) {
		var mobile = response.data;
		if (!checkValueIsNull(mobile)) {
			$("#u_userMobile").text(mobile);
		} else {
			$("#u_userMobile").text("---");
			$("#u_userMobileMsg").text(response.msg);
		}
	}); */
}

/*******************************************************************************
 * 获取验证码
 */
function getSmsCode() {
	var param = {};
	param.appName = "sms_sendMobileValidateCode";
	param.type = 2;
	/** * 退出登录处理 ** */
	serverFromJSONData(param, true).then(function(response) {
		if(typeof(response) == "object" && 
			Object.prototype.toString.call(response).toLowerCase() == "[object object]" && !response.length){
		}else{
			response = eval('(' + response + ')');
		}
		var smsCode = response.data;
		if (!checkValueIsNull(smsCode)) {
			$("#smsCodeBtn").hide();
			$("#smsCodeTime").show();
			/** * 定时器开启 ** */
			startSetTime();
			settime("smsCodeTime", "smsCodeBtn");
		} else {
			zebraDialog_ques_onClose("退出登录失败，请稍后再试!", "information", false);
		}
	});
}

/*******************************************************************************
 * 点击确定按钮
 */
function submitBtn() {

	/* if (btnType == 1) {

		var code = $("#u_code").val();

		if (checkValueIsNull(code)) {
			$("#infoMsg").text("验证码不能为空");
			return;
		}

		var param = {};
		param.appName = "sms_validateMobileValidateCode";
		param.type = 2;
		param.code = code;

		serverFromJSONData(param, true).then(function(response) {
			var flag = response.data;
			// flag = true;
			if (flag) {// 验证通过
				$("#mobileDiv").hide();
				$("#codeDiv").hide();
				$("#oldPwd").show();
				$("#newPwd").show();
				$("#confirmPwd").show();
				btnType = 2;// 密码校验
				///** * 验证码验证通过，关闭定时器 **
				stopSetTime();
			} else {
				$("#infoMsg").text(response.msg);
			}
		});
	} else { */
		/** *定时器停止** */

		/** * 原始密码 ** */
		var oldPwd = $("#u_oldpwd").val();
		if (checkValueIsNull(oldPwd)) {
			$("#oldPwdMsg").text("旧密码不能为空");
			return;
		}
		/** * 新密码 ** */
		var newPwd = $("#u_newpwd").val();
		if (checkValueIsNull(newPwd)) {
			$("#newPwdMsg").text("新密码不能为空");
			return;
		}

		var confirmPwd = $("#u_confirmPwd").val();
		if (checkValueIsNull(confirmPwd)) {
			$("#confirmPwdMsg").text("确认密码不能为空");
			return;
		}

		if (newPwd != confirmPwd) {
			$("#confirmPwdMsg").text("与新密码不一致");
			return;
		}

		/** * 开始提交密码修改 ** */
		var param = {};
		param.appName = "pwd_updatePwd";
		param.oldPwd = oldPwd;
		param.newPwd = newPwd;

		serverFromJSONData(param, true).then(function(response) {
			if(typeof(response) == "object" && 
				Object.prototype.toString.call(response).toLowerCase() == "[object object]" && !response.length){
			}else{
				response = eval('(' + response + ')');
			}
			var flag = response.msgState;
			if (flag != 200) {
				$("#oldPwdMsg").text(response.msg);
				return;
			} else {
				$("#updatePwd_div").modal("hide");
				zebraDialog_ques_onClose("密码修改成功!", "information", false);
				emptyPwd();
				//logout();
			}
			$("#oldPwdMsg").text("");
			$("#newPwdMsg").text("");
			$("#confirmPwdMsg").text("");
		}), function(error) {
			$("#oldPwdMsg").text("");
			$("#newPwdMsg").text("修改失败，系统发生错误!");
			$("#confirmPwdMsg").text("");
		};
	// }
}

/*******************************************************************************
 * 清空输入框
 */
function emptyPwd() {
	$("#u_oldpwd").val("");
	$("#u_newpwd").val("");
	$("#u_confirmPwd").val("");
	$("#u_code").val("");
}
