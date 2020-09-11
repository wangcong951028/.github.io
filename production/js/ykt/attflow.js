var deptid = '';
var areaTable;

$(function(){
	findAttRules();
	findDeptNode();
	findSub();
})

function common(msg){
    var param = {};
    // 1、公共参数组装
    param.appKey = "aGFuZHlDYW1wdXM=";
    param.appSecret ="1234567890abcedefgh";
    var time = new Date().getTime();
    param.time = time;

    /*msg.index = 1;*/
    var paramJsonMsg = JSON.stringify(msg);
    param.param =  paramJsonMsg;
    // 3、生成签名
    var temp = 'appKey=aGFuZHlDYW1wdXM=&appSecret=1234567890abcedefgh&param='+paramJsonMsg+'&time=' + time;
    param.sign = hex_md5(temp);
    // 4、对整个参数进行加密
    var jsonStr = JSON.stringify(param);
    return jsonStr;
}


/*获取班级*/
function findDeptNode() {
    // 2、接口请求参数组装
    var msg = {};
    msg.appName="origaniza_listOriganizaTree";
    
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var node = success.data;
			 var zTreeObj;
			var setting = {
				/* check: {
					nocheck: true,
					enable: true,
					chkStyle: "radio",
					radioType: "all"
				}, */
				data: {
					simpleData: {
						enable: true
					}
				},
				view: {
					dblClickExpand: false
				},
				callback: {
					onClick: zTreeOnCheck
				}
			};
			$(document).ready(function(){
				$.fn.zTree.init($("#treeDemo"), setting, node);
			});
			
			
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

function zTreeOnCheck(event, treeId, treeNode) {
    deptid = treeNode.id;
};

var rules_id =  -1;
var dosclockTime =  "";
var deptid = '';
var status_id = -1

function findSub(){
	$(function () {
	//添加额外的参数传给服务器
	areaTable = $('#datatable').dataTable({
		"ajax": {
			"url": serverBaseUrl,
			"data": function (data) {
				data.rulesid = $("#rules_id").val();
				status_id = $("#status_id").val();
				data.type = $("#status_id").val();
				//添加额外的参数传给服务器
				if(deptid != ''){
					data.clzid = deptid;
				}
				if(dosclockTime != ''){
					data.ctime = dosclockTime;
				}else{
					data.ctime = $("#dosclockTime").val();
				}
				data.appName="dos_findSubByTime";
				var paramJsonMsg = JSON.stringify(data);

				//配置基本参数
				data.param = paramJsonMsg;
				data.appKey = "aGFuZHlDYW1wdXM=";
				data.appSecret = "1234567890abcedefgh";
				var time = new Date().getTime();
				data.time = time;
				var temp = 'appKey=aGFuZHlDYW1wdXM=&appSecret=1234567890abcedefgh&param=' + paramJsonMsg + '&time=' + time;
				data.sign = hex_md5(temp);
				return JSON.stringify(data);
			},
			"dataSrc": function (json) {
				//自定义格式
				json.iTotalRecords = json.data.recordsTotal;
				json.recordsFiltered = json.data.recordsTotal;
				json.error = json.data.error;
				json.draw = json.data.draw;
				return json.data.data;
			},
			"beforeSend": function (xhr) {
				xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
				xhr.setRequestHeader("token", static_token);
			}
		},
		"columnDefs": [
			{
				"targets": 4,
				render: function (data, type, full, meta) {
					if(full.subOrType == 1){
						return "学生";
					}else if(full.subOrType == 2){
						return "教师";
					}
				}
			},{
				"targets": 5,
				render: function (data, type, full, meta) {
					if(full.status == 0){
						return "住校";
					}else if(full.status == 1){
						return "走读";
					}else if(full.status == 2){
						return "--";
					}
				}
			},{
				"targets": -1,
				render: function (data, type, full, meta) {
					if(status_id == 1){
						return "正常打卡";
					}else if(status_id == 2){
						return "迟到打卡";
					}else if(status_id == 3){
						return "异常打卡";
					}else if(status_id == 4){
						return "请假";
					}
				}
			}
			]
	});
		$("#myButton").click(function () {
			rules_id =  $("#rules_id").val();
			if(rules_id == -1){
				informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择考勤类型！");
				return;
			} 
			status_id =  $("#status_id").val();
			if(status_id == -1){
				informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择考勤状态！");
				return;
			} 
			dosclockTime = $("#dosclockTime").val();
			if(dosclockTime == '' || dosclockTime == null){
				informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择所需查询时间！");
				return;
			}
			areaTable.api().ajax.reload();
		}); 
	});
}

var map = {};
/*获取考勤规则*/
function findAttRules() {
    // 2、接口请求参数组装
    var msg = {};
	msg.start = 0;
	msg.length = 9999999
    msg.appName="attrules_findAttRules";
    
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var data = success.data.data;
			map = {};
			var html = '';
			if(data != null && data.length > 0){
				for(var i=0;i<data.length;i++){
					if(i == 0){
						html += '<option value="'+data[i].id+'" selected="selected">'+data[i].attName+'</option>'
					}else{
						html += '<option value="'+data[i].id+'">'+data[i].attName+'</option>'
					}
					map["lateTime_"+data[i].id] = data[i].lateTime;
					map["beginTime_"+data[i].id] = data[i].beginTime;
					map["endTime_"+data[i].id] = data[i].endTime;
					map["lateTime_"+data[i].id] = data[i].lateTime;
					map["type_"+data[i].id] = data[i].type;
					map["deptName_"+data[i].id] = data[i].deptName;
					if(i == 0){
						$("#dept_html").html("考勤部门：" + data[i].deptName);
						$("#beginTime_html").html("开始时间：" + data[i].beginTime);
						$("#endTime_html").html("结束时间：" + data[i].endTime);
						$("#lataTime_html").html("刷卡截止时间：" + data[i].lateTime);
						if(data[i].type == 1){
							$("#perType_html").html("考勤人员类型：" + "教师");
						}else if(data[i].type == 2){
							$("#perType_html").html("考勤人员类型：" + "学生");
						}else if(data[i].type == 3){
							$("#perType_html").html("考勤人员类型：" + "教师/学生");
						}
					}
				}
				$("#rules_id").html('<option value="-1">----- 请选择 -----</option>' + html)
			}
			
		},
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

function set_rules_items(value){
	if(value == -1){
		$("#dept_html").html("考勤部门：" + "- -");
		$("#beginTime_html").html("开始时间：" + "- -");
		$("#endTime_html").html("结束时间：" + "- -");
		$("#lataTime_html").html("刷卡截止时间：" + "- -");
		$("#perType_html").html("考勤人员类型：" + "- -");
	}else{
		var dept_html = map["deptName_"+value];
		var beginTime_html = map["beginTime_"+value];
		var endTime_html = map["endTime_"+value];
		var lataTime_html = map["lateTime_"+value];
		var perType_html = map["type_"+value];
		$("#dept_html").html("考勤部门：" + dept_html);
		$("#beginTime_html").html("开始时间：" + beginTime_html);
		$("#endTime_html").html("结束时间：" + endTime_html);
		$("#lataTime_html").html("刷卡截止时间：" + lataTime_html);
		if(perType_html == 1){
			$("#perType_html").html("考勤人员类型：" + "教师");
		}else if(perType_html == 2){
			$("#perType_html").html("考勤人员类型：" + "学生");
		}else if(perType_html == 3){
			$("#perType_html").html("考勤人员类型：" + "教师/学生");
		}
	}
}