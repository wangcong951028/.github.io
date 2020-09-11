/**
 * Created by ricardo on 2018-01-15.
 */
var areaTable;
var leaveTable;
var pageSize = 10; // ，每页显示个数
var pageNo = 1; // 页码
var totalPage = 0; // 总页数
var leaveId = 0;
var xgh = "1";
var isShut;
var xghValidate;
var flag = true; //刷新页面显示模态框
var flag_2 = true;
var quickFlag = true; //快捷键
var isshuttle = 0; //是否接送
var isNotExist = false;
var sub_name = 'aa';
var areaTable_sub;
var flag_=true;
var flag_3 = false;

$(function() {
	/*** 1、页面初始化时，将光标定位到指定的输入框 ***/
	$("#xgh").focus();
	checkIsExistLeave();
	if (isNotExist) {
		document.getElementById("html_3").style.display = 'none';
		document.getElementById("html_2").style.display = "none";
		document.getElementById("html_1").style.display = "";
		queryUserBaseList();
	} else {
		document.getElementById("html_3").style.display = 'none';
		document.getElementById("html_2").style.display = "";
		document.getElementById("html_1").style.display = "none";
		queryNonresident();
	}
	$('#xgh').bind('keypress', function(event) {
		if (event.keyCode == "13") {
			checkIsExistLeave();
			if (isNotExist) {
				if (areaTable != undefined) {
					refreshAreaTable();
				} else {
					queryUserBaseList();
				}
				document.getElementById("html_3").style.display = 'none';
				document.getElementById("html_2").style.display = 'none';
				document.getElementById("html_1").style.display = "";

			} else {
				flag_3 = true;
				leaveTable.api().ajax.reload();
				document.getElementById("html_2").style.display = "";
				document.getElementById("html_1").style.display = "none";
				document.getElementById("html_3").style.display = 'none';

			}
			$("#xgh").val("");
		}
	});
	
	$('#sub_name').bind('keypress', function(event) {
			if (event.keyCode == "13") {
				var xgh_2 = $("#sub_name").val();
				document.getElementById("html_1").style.display = 'none';
				document.getElementById("html_2").style.display = 'none';
				document.getElementById("html_3").style.display = "";
				// if(xgh_2 != null && xgh_2 != ''){
					if(areaTable_sub != undefined){
						refreshareaTable_sub();
					}else{
						findBySubName();
					}
				// }
				$("#sub_name").val("");
			}
		});
})

function search_leave() {
	var subName = $("#sub_name").val("");
	if(subName!= null && subName != ''){
			// findBySubName();
			areaTable_sub.api().ajax.reload();
	}else{
		if (isNotExist) {
			//		queryUserBaseList();
			areaTable.api().ajax.reload();
		} else {
			//		queryNonresident();
			leaveTable.api().ajax.reload();
		}
	}
}

function refreshAreaTable() {
	areaTable.api().ajax.reload();
}

function refreshareaTable_sub() {
	areaTable_sub.api().ajax.reload();
}
/**
 * 1、查询人员列表
 */

function queryUserBaseList() {
	//添加额外的参数传给服务器
	areaTable = $('#datatable').dataTable({
		"ajax": {
			"url": serverBaseUrl,
			"data": function(data) {
				data.appName = "leave_listByLeaveEntrance";
				if (!checkValueIsNull($('#xgh').val())) {
					data.physicalCard = $('#xgh').val();
					xgh = $('#xgh').val();
				} else {
					data.physicalCard = xgh;
				}
				flag = true;
				//添加额外的参数传给服务器
				return buildRequestParam(data);
			},
			"dataSrc": function(json) {
				json.iTotalRecords = json.data.recordsTotal;
				json.recordsFiltered = json.data.recordsTotal;
				json.error = json.data.error;
				json.draw = json.data.draw;
				var sub_list_1 = json.data.data
				if(sub_list_1.length==0){
					readOutLoud("暂无请假记录");
				}
				return json.data.data;
			},
			"beforeSend": function(xhr) {
				xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
				xhr.setRequestHeader("token", sessionStorage.token);
			}
		},
		"columnDefs": [{
			"targets": 4,
			render: function(data, type, full, meta) {
				if (full.sex == 1) {
					return "男";
				} else {
					return "女";
				}
			}
		}, {
			"targets": 9,
			render: function(data, type, full, meta) {
				if (full.status == 1) {
					return "<label style='color:#60c060'>通过</label>";
				} else {
					return "<label style='color:red'>通过</label>";
				}
			}
		}, {
			"targets": 8,
			render: function(data, type, full, meta) {
				if (full.isshuttle == 1) {
					return "<label style='color:#60c060'>是</label>";
				} else if (full.isshuttle == 0) {
					return "<label style='color:red'>否</label>";
				}
			}
		}, {
			"targets": 11,
			render: function(data, type, full, meta) {
				if (flag) {
					showLeavel(full.afLeaveID);
					flag = false;
				}
				return "<a class='bbtn btn-info btn-xs' onclick='showLeavel(" + full.afLeaveID +
					");' style='cursor:pointer;'><i class='fa fa-pencil'></i>操作</a>"
			}
		}]
	});
}

/*获取请假信息*/
function showLeavel(id) {
	quickFlag = true;
	$('#return_school').removeAttr("disabled");
	$('#leavel_school').removeAttr("disabled");
	var msg = {};
	msg.appName = "leave_listByLeave4App"; //
	msg.leaveId = id;
	serverFromJSONData(msg, true).then(function(response) {
		if(typeof(response) == "object" && 
			Object.prototype.toString.call(response).toLowerCase() == "[object object]" && !response.length){
		}else{
			response = eval('(' + response + ')');
		}
			if (response.msgState == 200) {
				var leaveitem = response.data[0];
				showsub_photo(leaveitem.curChildUserXgh, 1);
				$("#leavel_id").val(id);
				$("#leavelStudent").html(leaveitem.curChildUserName);
				$("#theApprover").html(leaveitem.approvedName);
				$("#leavelType").html(leaveitem.leaveTypeName);
				$("#parentcarno_2").val("");
				if (leaveitem.isShuttle == 1) {
					isShut = 1
					$("#pickUp").html('是');
					$("#parentcarno_2").val(leaveitem.parentcarno);
					document.getElementById("parentcarno_1").style.display = '';
				} else if (leaveitem.isShuttle == 0) {
					$("#pickUp").html('否');
				}
				isshuttle = leaveitem.isShuttle;
				$("#leavelBeginTime").html(leaveitem.beginDate);
				$("#leavelEndTime").html(leaveitem.endDate);
				//	        $("#idNumber").html(leaveitem.idNumber);
				$("#theLength").html(leaveitem.hour);
				$("#leaveTime").html(leaveitem.leaveTime);
				$("#returnTime").html(leaveitem.returnTime);
				//	        $("#sub_zjz").html('<img src="'+leaveitem.zjz+'" style="width:200px;height:260px"/>');
				
				//未到离校时间禁用按钮
				// $('#leavel_school').removeAttr("disabled");
				var nowtime = new Date();
				var leave_time = leaveitem.beginDate;
				
				//验证是否请假时间开始超过半小时未离校
				var aa = new Date(leave_time.replace(/-/g, '/'));
				aa.setMinutes(aa.getMinutes()+30)
				var ss_leave_time = leaveitem.leaveTime;
				//验证是否迟到
				var return_time = leaveitem.endDate;
				if(Date.parse(nowtime) < new Date(Date.parse(leave_time.replace(/-/g, "/")))){
					readOutLoud("未到离校时间");
						$('#leavel_school').attr({
							"disabled": "disabled"
						});
				}else if(ss_leave_time == null || ss_leave_time == '' || ss_leave_time == undefined){
					if(Date.parse(aa) < Date.parse(nowtime)){
							updateLeaveType(id);
							readOutLoud("离校超时，请重新请假");
							$('#leavel_school').attr({
								"disabled": "disabled"
							});
					}
				}else if(Date.parse(nowtime) > new Date(Date.parse(return_time.replace(/-/g, "/")))){
					readOutLoud("你已迟到，下次请注意");
				}

				/*按钮禁用*/
				if (checkValueIsNull(leaveitem.leaveTime)) {
					$('#return_school').attr({
						"disabled": "disabled"
					});
				} else {
					$('#leavel_school').attr({
						"disabled": "disabled"
					});
					if (checkValueIsNull(leaveitem.returnTime)) {
						$('#return_school').removeAttr("disabled");
					} else {
						$('#leavel_school').removeAttr("disabled");
					}
				}
				isNotExist = true;
				initRelease(id);
				$("#leavel_item").modal("show");
				$("#parentcarno_2").focus();
				rdcard.closeport();
				rdcard.openport();
				rdcard.ReadCard2();
			}

		}),
		function(error) {
			informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
		};
}

/***
 * 显示模态框
 * @param {Object} modalID
 */
function showModal(modalID, afleaveID) {
	$("#" + modalID).modal("show");
	leaveId = afleaveID;
	if ('userDetail_div' == modalID) {
		initUserDetailInfo(afleaveID);
	}
	if ('userLeave_div' == modalID) {
		initRelease(leaveId);
	}
}

/***
 * 关闭模态框
 * @param {Object} modalID
 */
function closeModal(modalID) {
	$("#" + modalID).modal("hide");
}

/***
 * 初始化用户基础信息
 */
function initUserDetailInfo(afleaveID) {
	/*** 当前用户对象 ***/
	var curobj = $("#afleave_" + afleaveID).data('info');
	$("#xm").html(curobj.xm);
	$("#xh").html(curobj.xh);
	if (!checkValueIsNull(curobj.cn)) {
		$("#className").html(curobj.cn);
	} else {
		$("#className").html("-");
	}

	$(":radio[name='sex'][value='" + curobj.sex + "']").prop("checked", "checked");
	if (!checkValueIsNull(curobj.zjz)) {
		$("#userHeadImg").attr("src", curobj.zjz);
	} else {
		$("#userHeadImg").removeAttr("src");
	}

	if (!checkValueIsNull(curobj.jg)) {
		$("#jg").html(curobj.jg);
	} else {
		$("#jg").html("------");
	}

	if (!checkValueIsNull(curobj.ad)) {
		$("#address").html(curobj.ad);
	} else {
		$("#address").html("------");
	}

	if (!checkValueIsNull(curobj.bd)) {
		$("#birthday").html(curobj.bd);
	} else {
		$("#birthday").html("------");
	}

}

/***
 * 刷新数据
 */
function closeBuildModal(modalID) {
	$('#' + modalID).modal('hide');
	refreshAreaTable();
}

function closeBuildModalNotRefresh(modalID) {
	$('#' + modalID).modal('hide');
}

/***
 * 学生进出校门(1出  2进)
 */
function confirmLeaveReturn(lrFlag, modalID) {
	var msg = {};
	if(isShut==1 && lrFlag==1){
		var parentcarno = $("#parentcarno_2").val();
		// msg.xghValidate=xghValidate;
		if(parentcarno==null || parentcarno=='' || parentcarno.length != 18){
			msg.idNumberVa="1";
		}else{
			msg.idNumberVa=parentcarno;
		}
	}
	msg.appName = "leave_confireLeaveReturn";//
	msg.lrFlag = lrFlag;
	msg.leaveId = $("#leavel_id").val();;
	serverFromJSONData(msg, true).then(function(response) {
			if(typeof(response) == "object" && 
				Object.prototype.toString.call(response).toLowerCase() == "[object object]" && !response.length){
			}else{
				response = eval('(' + response + ')');
			}
			var flag = response.data;
			if (flag == 1) {
				// refreshareaTable_sub();
				window.location.reload();
				//          informationAlert_OnlyCancelButton_REFRESH('closeBuildModal("'+modalID+'")',"放行成功!");
			} else {
				informationAlert_OnlyCancelButton_REFRESH('closeBuildModalNotRefresh("' + modalID + '")', "放行失败，失败原因：" + response.msg);
			}
			$("#leavel_item").modal("hide");
		}),
		function(error) {
			informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
		};
}

// 样式 style="ime-mode:disabled" 禁止中文输入     
function noPermitInput(e) {
	var evt = window.event || e;
	if (isIE()) {
		evt.returnValue = false; //ie 禁止键盘输入     
	} else {
		evt.preventDefault(); //fire fox 禁止键盘输入     
	}
}

function isIE() {
	if (window.navigator.userAgent.toLowerCase().indexOf("msie") >= 1)
		return true;
	else
		return false;
}


function initRelease(leaveIds) {
	var msg = {};
	//	if(isShut==1 && lrFlag==1){
	//		msg.idNumberVa=$("#idNumValidate").val();
	//		msg.xghValidate=xghValidate;
	//		if(msg.idNumberVa==null || msg.idNumberVa==''){
	//			informationAlert_OnlyConfirmButton_NOT_REFRESH("请填写身份证信息!");
	//			return;
	//		}
	//	}
	msg.appName = "leave_getIdNum";
	msg.leaveId = leaveIds;
	serverFromJSONData(msg, true).then(function(response) {
			if(typeof(response) == "object" && 
				Object.prototype.toString.call(response).toLowerCase() == "[object object]" && !response.length){
			}else{
				response = eval('(' + response + ')');
			}
			var flag = response.data;
			if (response.msgState == 200) {
				if (isshuttle == 1) {
					var html = "";
					for (var i = 0; i < response.data.length; i++) {
						if (i < 2) {
							html += "<span>" + response.data[i].idNumber + "</span></br>";
						} else {
							html += "<span >" + response.data[i].idNumber + "</span></br>";
						}
					}
					//      		$("#isIdNumber").html(html)
					$("#idNumber").html(html);
					//xghValidate=curobj.xh;
				} else {
					//      		$("#isIdNumber").html("");
					isShut = 0;
					$("#idNumber").html("——")
				}
			}
		}),
		function(error) {
			informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
		};



}

/*获取请假信息*/

function showsub_photo(xgh, obj) {
	var param = {};
	// 1、公共参数组装
	param.appKey = "aGFuZHlDYW1wdXM=";
	param.appSecret = "1234567890abcedefgh";
	var time = new Date().getTime();
	param.time = time;
	// 2、接口请求参数组装
	var msg = {};
	msg.appName = "ykt_giveHeadPhoto";
	msg.xgh = xgh;
	var paramJsonMsg = JSON.stringify(msg);
	param.param = paramJsonMsg;
	// 3、生成签名
	var temp = 'appKey=aGFuZHlDYW1wdXM=&appSecret=1234567890abcedefgh&param=' + paramJsonMsg + '&time=' + time;
	param.sign = hex_md5(temp);
	// 4、对整个参数进行加密
	var jsonStr = JSON.stringify(param);
	$.ajax({
		type: 'POST',
		url: serverBaseUrl,
		data: jsonStr,
		dataType: "json",
		success: function(success) {
			if(typeof(success) == "object" && 
				Object.prototype.toString.call(success).toLowerCase() == "[object object]" && !success.length){
			}else{
				success = eval('(' + success + ')');
			}
			if (success.msgState == 200) {
				if(success.data != null){
					var photo = success.data.photo;
					if (obj == 1) {
						$("#sub_zjz").html('<img src="' + photo + '" style="width:200px;height:260px"/>');
					} else {
						$("#sub_zjz1").html('<img src="' + photo + '" style="width:200px;height:260px"/>');
					}
			}
			}
		},
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
			xhr.setRequestHeader("token", static_token);
		}
	});
}

/*对离校时间进行判定*/
function decide_leavetime(lrFlag, modalID) {
	var leaveTime = $("#leavelBeginTime").html();
	var nowtime = new Date();
	if (Date.parse(nowtime) < Date.parse(leaveTime)) {
		$.confirm({
			title: '系统消息',
			content: "<span style='color:red'>是否确认放行离校？</span>",
			typeAnimated: true,
			buttons: {
				tryAgain: {
					text: '确定放行',
					btnClass: 'btn-green',
					action: function() {
						confirmLeaveReturn(1, 'userReturn_div');
					}
				},
				"取消": function() {}
			}
		});
	} else {
		confirmLeaveReturn(lrFlag, modalID);
	}
}

//公共参数
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

//判断有没有请假人员
function checkIsExistLeave() {
	var msg = {};
	if (!checkValueIsNull($('#xgh').val())) {
		msg.physicalCard = $('#xgh').val();
		xgh = $('#xgh').val();
	} else {
		msg.physicalCard = xgh;
	}
	msg.appName = "leave_isExistLeave";
	var jsonStr = common(msg);
	$.ajax({
		type: 'POST',
		url: serverBaseUrl,
		data: jsonStr,
		dataType: "json",
		async: false,
		success: function(success) {
			if(typeof(success) == "object" && 
				Object.prototype.toString.call(success).toLowerCase() == "[object object]" && !success.length){
			}else{
				success = eval('(' + success + ')');
			}
			var flag = success.data;
			if (success.msgState == 200) {
				isNotExist = flag.isExist;
			}
		},
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
			xhr.setRequestHeader("token", static_token);
		},
		error:function(error) {
			informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
		}
	});
}
//查询走读生信息

function queryNonresident(){
	 leaveTable = $('#datatable1').dataTable({
        "ajax": {
            "url": serverBaseUrl,
            "data": function (data) {
                data.appName = "leave_listByLeaveEntrance";
                if(!checkValueIsNull($('#xgh').val())){
                	data.physicalCard = $('#xgh').val();
                	xgh = $('#xgh').val();
                }else{
                	data.physicalCard = xgh;
                }
                flag_2 = true;
								flag_ = true;
                //添加额外的参数传给服务器
                return buildRequestParam(data);
            },
            "dataSrc": function (json) {
                json.iTotalRecords = json.data.recordsTotal;
                json.recordsFiltered = json.data.recordsTotal;
                json.error = json.data.error;
                json.draw = json.data.draw;
								var sub_list_2 = json.data.data
								if(flag_3){
										if(sub_list_2.length==0){
											readOutLoud("暂无请假记录");
										}
										flag_3 = false;
								}
                return json.data.data;
            },
            "beforeSend": function (xhr) {
                xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                xhr.setRequestHeader("token", sessionStorage.token);
            }
        },
        "columnDefs": [
      		 {
                "targets": 1,
                render: function (data, type, full, meta) {
                    return full.XM;
                }
            },
            {
                "targets": 2,
                render: function (data, type, full, meta) {
                    return full.XH;
                }
            },
            {
                "targets": 3,
                render: function (data, type, full, meta) {
                    if(full.SEX == 1){
                        return "男";
                    }else{
                        return "女";
                    }
                }
            },
            {
                "targets": 4,
                render: function (data, type, full, meta) {
                    return full.D_NAME;
                }
            },
            {
                "targets": 5,
                render: function (data, type, flag, meta) {
			       if(flag.ENDTIME==undefined){
			       		return '';	
			       }else{
                   		return flag.ENDTIME;
			       }
	          	}
           	} ,
            {
                "targets": 6,
                render: function (data, type, flag, meta) {
			       if(flag.STARTTIME==undefined){
			       		return '';	
			       }else{
                   		return flag.STARTTIME;
			       }
	          	}
          },
            {
                "targets": 7,
                render: function (data, type, flag, meta) {
									if(flag_){
											flag_ = false;
											clearLeave();
											showsub_photo(flag.XH,2);
											$("#studentName").html(flag.XM);
											if(flag.SEX==1){
												$("#studentSex").html('男');
											}else{
												$("#studentSex").html('女');
											}
											$("#studentNo").html(flag.XH);
											$("#studentClass").html(flag.D_NAME);
											$("#startTime").html(flag.STARTTIME);
											$("#endTime").html(flag.ENDTIME);
											$("#stuLeaveTime").html(flag.LEAVE_TIME);
											$("#stuJoinTime").html(flag.JOIN_TIME);
											$("#lastTime").html(flag.LASTTIME);
											$("#p_idCard").html(flag.IDCARD);
											var nowDate = new Date();
											var nowtime = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();//当前日期年月日
											var joinTime = nowtime+' '+flag.ENDTIME;//进校时间
											var leaveTime = nowtime+' '+flag.STARTTIME;//离校时间
											var lastTime = nowtime+' '+flag.LASTTIME;//最后离校时间
											
											if(flag.STARTTIME==null||
												flag.STARTTIME=='undefined'||
												flag.ENDTIME==null||
												flag.ENDTIME=='undefined'||
												flag.LASTTIME==null||
												flag.LASTTIME=='undefined'){
												readOutLoud("请设置走读生进出校时间！");
												$('#resident_leavel_school').attr({"disabled":"disabled"});
												$('#resident_join_school').attr({"disabled":"disabled"});
												informationAlert_OnlyConfirmButton_NOT_REFRESH("请设置走读生进出校时间!");
												
											}
											//离校判断
											else if(!checkValueIsNull(flag.LEAVE_TIME)){
												$('#resident_leavel_school').attr({"disabled":"disabled"});
											}else if(Date.parse(new Date())<new Date(Date.parse(leaveTime.replace(/-/g, "/")))){
												if(!checkValueIsNull(flag.JOIN_TIME)){
													readOutLoud("未到离校时间，不能放行！");
												}
												$('#resident_leavel_school').attr({"disabled":"disabled"});
											}else if(Date.parse(new Date())>new Date(Date.parse(lastTime.replace(/-/g, "/")))){
												if(!checkValueIsNull(flag.JOIN_TIME)){
													readOutLoud("已经过了离校的最后时间，不能放行！请联系班主任或者家长！");
												}
												$('#resident_leavel_school').attr({"disabled":"disabled"});
											}else{
												$('#resident_leavel_school').removeAttr("disabled");
											}
											
											//进校判断
											if(!checkValueIsNull(flag.JOIN_TIME)){
												$('#resident_join_school').attr({"disabled":"disabled"});
											}else if(Date.parse(new Date())>new Date(Date.parse(joinTime.replace(/-/g, "/")))&&flag.JOIN_TIME!='undefined'){
												readOutLoud("你已迟到，下次请准时进校！");
											}else{
												$('#resident_join_school').removeAttr("disabled");
											}
											if(flag_2){
												$("#jsr_idCard").val('');
												$("#resident").modal("show");
												$("#jsr_idCard").focus();
												rdcard.closeport();
												rdcard.openport();
												rdcard.ReadCard2();
												flag_2 = false;
											}
											if(flag.LASTTIME==undefined){
												return '';	
											}else{
															return flag.LASTTIME;
											}
									}
	          	}
           }
        ]
    });
	}



function clearLeave() {
	$("#studentName").html("");
	$("#studentSex").html(" ");
	$("#studentNo").html("");
	$("#studentClass").html("");
	$("#startTime").html("");
	$("#endTime").html("");
	$("#stuLeaveTime").html("");
	$("#stuJoinTime").html("");
}

// 对Date的扩展，将 Date 转化为指定格式的String  
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
Date.prototype.Format = function(fmt) { //author: meizz   
	var o = {
		"M+": this.getMonth() + 1, //月份   
		"d+": this.getDate(), //日   
		"H+": this.getHours(), //小时   
		"m+": this.getMinutes(), //分   
		"s+": this.getSeconds(), //秒   
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度   
		"S": this.getMilliseconds() //毫秒   
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[
			k]).substr(("" + o[k]).length)));
	return fmt;
}

//离校放行
function nonresident_leavetime() {
	var leaveTime = $("#startTime").html();
	var lastTime = $("#lastTime").html();
	if (leaveTime == null || leaveTime == ''||lastTime == null || lastTime == '') {
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请设置走读生离校时间!");
		return;
	}
	var nowDate = new Date();
	var nowtime = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate(); //当前日期年月日

	leaveTime = nowtime + ' ' + leaveTime; //离校时间
	lastTime = nowtime + ' ' + lastTime; //最晚离校时间
	if (nowDate.getTime() < new Date(Date.parse(leaveTime.replace(/-/g, "/"))).getTime()) {
		$.confirm({
			title: '系统消息',
			content: "<span style='color:red'>还未到放学时间，是否确认放行离校？</span>",
			typeAnimated: true,
			buttons: {
				tryAgain: {
					text: '确定放行',
					btnClass: 'btn-green',
					action: function() {
						confirmLeaveStudent(new Date().Format("yyyy-MM-dd HH:mm:ss"), 1);
					}
				},
				"取消": function() {}
			}
		});
	} else if (nowDate.getTime() > new Date(Date.parse(lastTime.replace(/-/g, "/"))).getTime()) {
		$.confirm({
			title: '系统消息',
			content: "<span style='color:bule'>已经过了离校的最晚时间，是否确认放行离校？</span>",
			typeAnimated: true,
			buttons: {
				tryAgain: {
					text: '确定放行',
					btnClass: 'btn-green',
					action: function() {
						confirmLeaveStudent(new Date().Format("yyyy-MM-dd HH:mm:ss"), 1);
					}
				},
				"取消": function() {}
			}
		});
	} else {
		confirmLeaveStudent(new Date().Format("yyyy-MM-dd HH:mm:ss"), 1);
	}
}
//进校放行
function nonresident_joinTime() {
	var joinTime = $("#endTime").html();
	if (joinTime == null || joinTime == '') {
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请设置走读生进校时间!");
		return;
	}
	var nowDate = new Date();
	var nowtime = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate(); //当前日期年月日

	joinTime = nowtime + ' ' + joinTime; //进校时间
	if (nowDate.getTime() > new Date(Date.parse(joinTime.replace(/-/g, "/"))).getTime()) {
		$.confirm({
			title: '系统消息',
			content: "<span style='color:red'>该学生已经迟到，是否确认放行进校？</span>",
			typeAnimated: true,
			buttons: {
				tryAgain: {
					text: '确定放行',
					btnClass: 'btn-green',
					action: function() {
						confirmLeaveStudent(new Date().Format("yyyy-MM-dd HH:mm:ss"), 2);
					}
				},
				"取消": function() {}
			}
		});
	} else {
		confirmLeaveStudent(new Date().Format("yyyy-MM-dd HH:mm:ss"), 2);
	}
}


//确认走读生离校
function confirmLeaveStudent(time, f) {
	var msg = {};
	msg.stuNo = $("#studentNo").html();
	msg.stuName = $("#studentName").html();
	msg.stuClass = $("#studentClass").html();
	if ($("#studentSex").html() == '男') {
		msg.sex = 1;
	} else {
		msg.sex = 2
	}
	msg.leaveStartTime = $("#startTime").html();
	msg.leaveEndTime = $("#endTime").html();
	msg.leaveLastTime = $("#lastTime").html();
	// msg.idCard = $("#jsr_idCard").val();
	msg.idCard = "1";
	if (f == 1) { //设置时间
		msg.leaveDate = time;
	} else {
		msg.joinDate = time;
	}
	
	msg.appName="leave_confirmLeaveSchool";
    serverFromJSONData(msg,true).then(function (response) {
			if(typeof(response) == "object" && 
				Object.prototype.toString.call(response).toLowerCase() == "[object object]" && !response.length){
			}else{
				response = eval('(' + response + ')');
			}
        var flag = response.data;
        if (response.msgState == 200){
					readOutLoud("放行成功！");
        	$("#resident").modal("hide");
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}
/*-----------------------------
      语音合成 
------------------------------*/

/* function readOutLoud(message) {
	var speech = new SpeechSynthesisUtterance();

  // 设置朗读内容和属性
	speech.text = message;
	//声音的音量，区间范围是0到1，默认是1。
	speech.volume = 1;
	//语速，数值，默认值是1，范围是0.1到10，表示语速的倍数，例如2表示正常语速的两倍。
	speech.rate = 1;
	//表示说话的音高，数值，范围从0（最小）到2（最大）。默认值为1
	speech.pitch = 2;
  
	window.speechSynthesis.speak(speech);
} */
/**
 * 百度语音合成
 */
// 初始化变量
	var audio = null;
	// 合成按钮
	function readOutLoud(text) {
			// 调用语音合成接口
			// 参数含义请参考 https://ai.baidu.com/docs#/TTS-API/41ac79a6
			//24.88fe0da3af80322a7dc0c0c1072276e1.2592000.1545647571.282335-14556124
			audio = btts({
					tex: text,
					tok: sessionStorage.getItem('baiduyuyin'),
					spd: 5,
					pit: 5,
					vol: 15,
					per: 0
			}, {
					volume: 0.3,
					autoDestory: true,
					timeout: 10000,
					hidden: true,
					onInit: function (htmlAudioElement) {

					},
					onSuccess: function(htmlAudioElement) {
							audio = htmlAudioElement;
							audio.play();
					},
					onError: function(text) {
//							alert(text)
					},
					onTimeout: function () {
//							alert('timeout')
					}
			});
	}

/* 百度语音合成 */

function findBySubName() {
	//添加额外的参数传给服务器
	areaTable_sub = $('#datatable2').dataTable({
		"ajax": {
			"url": serverBaseUrl,
			"data": function(data) {
				data.appName = "leave_findLeavelBySubName";
				if (!checkValueIsNull($('#sub_name').val())) {
					data.leaveName = $('#sub_name').val();
					sub_name = $('.sub_name').val();
				} else {
					data.leaveName = sub_name;
				}
				flag = true;
				$("#sub_name").val("");
				//添加额外的参数传给服务器
				return buildRequestParam(data);
			},
			"dataSrc": function(json) {
				json.iTotalRecords = json.data.recordsTotal;
				json.recordsFiltered = json.data.recordsTotal;
				json.error = json.data.error;
				json.draw = json.data.draw;
				var sub_list = json.data.data
				if(sub_list.length==0){
					readOutLoud("暂无请假记录");
				}
				return json.data.data;
			},
			"beforeSend": function(xhr) {
				xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
				xhr.setRequestHeader("token", sessionStorage.token);
			}
		},
		"columnDefs": [{
			"targets": 4,
			render: function(data, type, full, meta) {
				if (full.sex == 1) {
					return "男";
				} else {
					return "女";
				}
			}
		}, {
			"targets": 9,
			render: function(data, type, full, meta) {
				if (full.status == 1) {
					return "<label style='color:#60c060'>通过</label>";
				} else {
					return "<label style='color:red'>通过</label>";
				}
			}
		}, {
			"targets": 8,
			render: function(data, type, full, meta) {
				if (full.isshuttle == 1) {
					return "<label style='color:#60c060'>是</label>";
				} else if (full.isshuttle == 0) {
					return "<label style='color:red'>否</label>";
				}
			}
		}, {
			"targets": 11,
			render: function(data, type, full, meta) {
				if (flag) {
					showLeavel(full.afLeaveID);
					flag = false;
				}
				return "<a class='bbtn btn-info btn-xs' onclick='showLeavel(" + full.afLeaveID +
					");' style='cursor:pointer;'><i class='fa fa-pencil'></i>操作</a>"
			}
		}]
	});
}

/*修改请假记录为异常*/
function updateLeaveType(leaveid) {
	var msg = {};
	msg.leaveId = leaveid;
	msg.leavetype = 2;
	msg.appName = "leave_updateLeavetype"; //
	var jsonStr = common(msg);
	$.ajax({
		type: 'POST',
		url: serverBaseUrl,
		data: jsonStr,
		dataType: "json",
		async: false,
		success: function(success) {
			if(typeof(success) == "object" && 
				Object.prototype.toString.call(success).toLowerCase() == "[object object]" && !success.length){
			}else{
				success = eval('(' + success + ')');
			}
			var flag = success.data;
			if (success.msgState == 200) {
				console.log("请假异常修改成功。。。");
			}else{
				console.log("请假异常修改失败。。。");
			}
		},
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
			xhr.setRequestHeader("token", static_token);
		},
		error:function(error) {
			informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
		}
	});
}
