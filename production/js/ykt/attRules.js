var deptName = '';
var deptId = '';
var areaTable;

function multiselect_add() {
    $('#termInfo_car').multiselect({
        enableClickableOptGroups:true ,
        enableCollapsibleOptGroups:true,
        maxHeight:200,
        buttonWidth: '100%',
        nonSelectedText: '---- 请选择 ----',
        numberDisplayed: 5,
        nSelectedText: '已选择',
        filterPlaceholder: '请输入考勤机名称',
        allSelectedText:'全选'
    });
}
function multiselect_update() {
	$('#update_termInfo_car').multiselect({
		enableClickableOptGroups:true ,
		enableCollapsibleOptGroups:true,
		maxHeight:200,
		buttonWidth: '100%',
		nonSelectedText: '---- 请选择 ----',
		numberDisplayed: 5,
		nSelectedText: '已选择',
		filterPlaceholder: '请输入考勤机名称',
		allSelectedText:'全选'
	});
}

$(function(){
	findDeptNode();
	findattRules();
	resetTime();
//	findTermInfo();
})

function findattRules(){
	$(function () {
	//添加额外的参数传给服务器
	areaTable = $('#datatable').dataTable({
		"ajax": {
			"url": serverBaseUrl,
			"data": function (data) {
				//添加额外的参数传给服务器
// 				data.deptid = deptid;
				data.appName="attrules_findAttRules";
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
				"targets": 6,
				render: function (data, type, full, meta) {
					if(full.type == 1){
						return "教师";
					}else if(full.type == 2){
						return "学生";
					}else if(full.type == 3){
						return "所有";
					}
				}
			}, {
                    "targets": -1,
                    render: function (data, type, full, meta) {
                        return '<a class="btn btn-info btn-xs" href="javascript:;"  data-key="' + 10000 + '"  onclick="updateRules(' + full.id + ')"><i class="fa fa-pencil"></i>修改</a>' +
                            '<a class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + 10000 + '"  onclick="delete_modal(' + full.id + ')"><i class="fa fa-trash-o"></i>删除</a>';
                    }
                }
			]
	});
		/* $("#myButton").click(function () {
			areaTable.api().ajax.reload();
		}); */
	});
}

function cleanModal(){
	document.getElementById('rulesForm').reset();
	resetTime();
}

function show_madel(){
	if(deptId == null || deptId == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择部门！");
		return;
	}
	findTermInfo();
	$("#deptname").html(deptName);
	$("#deptid").val(deptId);
	$("#myModal").modal("show");
}

/*新增*/
function addAttRules(){
	var deptid = $("#deptid").val();
	var att_name = $("#att_name").val();
	var begin_time = $("#begin_time").val();
	var end_time = $("#end_time").val();
	var lata_time = $("#lata_time").val();
	var vheckedvalue = $('input[type="radio"][name="pero_type"]');
	var pero_type = "";
	for(var i=0;i<vheckedvalue.length;i++){
			if(vheckedvalue[i].checked){
				if(i<vheckedvalue.length){
						pero_type += vheckedvalue[i].value;
				}
			}
	}
	var send_type = $('input[type="radio"][name="send_type"]');
	var sendType = "";
	for(var i=0;i<send_type.length;i++){
			if(send_type[i].checked){
				if(i<send_type.length){
						sendType += send_type[i].value;
				}
			}
	}
	
	var termInfo_car = $("#termInfo_car").val();
	var infoList = new Array();
	if(termInfo_car != null){
		for(var i=0;i<termInfo_car.length;i++){
			var info_obj = new Object();
			info_obj.attInfoNo = termInfo_car[i];
			info_obj.attInfoName = $("#info_"+termInfo_car[i]).html();
			infoList[i] = info_obj;
		}
	}
	
	var sendTime = $("#send_time").val();
	var msg = {};
	if(att_name == null || att_name == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("考勤名称不能为空！");
		return;
	}
	if(begin_time == null || begin_time == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("开始时间不能为空！");
		return;
	}
	if(end_time == null || end_time == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("结束时间不能为空！");
		return;
	}
	if(infoList == null || infoList.length == 0){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择考勤机！");
		return;
	}
	if(pero_type == null || pero_type == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择考核人员！");
		return;
	}
	if(sendType == 1){
		if(sendTime == null || sendTime == ''){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("请设置推送时间！");
			return;
		}else{
			msg.sendTime = sendTime;
		}
		msg.sendType = sendType;
	}else{
		msg.sendType = 2;
	}
	
	msg.deptid = deptid;
	msg.attName = att_name;
	msg.beginTime = begin_time;
	msg.endTime = end_time;
	msg.lateTime = lata_time;
	msg.type = pero_type;
	msg.infoList = infoList;
	
	msg.appName="attrules_insertAttRules";//
	var jsonStr = common(msg);
	$.ajax({
		type: 'POST',
		url: serverBaseUrl,
		data: jsonStr,
		dataType: "json",
		async:false,
		success: function (success) {
			if(success.msgState == 200){
				$("#myModal").modal("hide");
				informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功！");
				areaTable.api().ajax.reload();
			}else{
				informationAlert_OnlyConfirmButton_NOT_REFRESH("添加失败：" + success.msg);
			}
		},
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
			xhr.setRequestHeader("token", static_token);
		}
	});
}

var map = {};
function updateRules(id){
//	$("input[type='radio']").removeAttr('checked');
	var msg = {};
	msg.id = id;
	msg.appName="attrules_findAttRulesById";//
	var jsonStr = common(msg);
	$.ajax({
		type: 'POST',
		url: serverBaseUrl,
		data: jsonStr,
		dataType: "json",
		async:false,
		success: function (success) {
			if(success.msgState == 200){
				var data = success.data;
				$("#update_id").val(data.id);
				$("#update_deptid").val(data.deptid);
				$("#update_deptname").html(data.deptName);
				$("#update_att_name").val(data.attName);
				$("#update_begin_time").val(data.beginTime);
				$("#update_end_time").val(data.endTime);
				$("#update_lata_time").val(data.lateTime);
				var update_type = data.type;
				if(update_type == 1){
					$("input[type='radio'][name='update_pero_type'][value='1']").attr("checked","checked")
				}else if(update_type == 2){
					$("input[type='radio'][name='update_pero_type'][value='2']").attr("checked","checked")
				}else if(update_type == 3){
					$("input[type='radio'][name='update_pero_type'][value='3']").attr("checked","checked")
				}
				var update_sendType = data.sendType;
				if(update_sendType == 1){
					$("input[type='radio'][name='update_send_type'][value='1']").attr("checked","checked");
					document.getElementById('update_send_time_html').style.display = '';
				}else if(update_sendType == 2){
					document.getElementById('update_send_time_html').style.display = 'none';
					$("input[type='radio'][name='update_send_type'][value='2']").attr("checked","checked");
				}else{
					document.getElementById('update_send_time_html').style.display = 'none';
				}
				$("#update_send_time").val(data.sendTime);
				var str = data.termInfoName;
				if(str != null){
					console.log(str.split(","));
				}
				var info = data.info;
				map = {};
				if(info != null && info.length>0){
					for(var k=0;k<info.length;k++){
						map["termInfo_"+info[k].termNo] = info[k].termNo;
					}
				}
				findTermInfo(map);
				$("#update_myModal").modal("show");
			}else{
				
			}
		},
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
			xhr.setRequestHeader("token", static_token);
		}
	});
}

function update_addAttRules(){
	var id = $("#update_id").val();
	var deptid = $("#update_deptid").val();
	var att_name = $("#update_att_name").val();
	var begin_time = $("#update_begin_time").val();
	var end_time = $("#update_end_time").val();
	var lata_time = $("#update_lata_time").val();
	var vheckedvalue = $('input[type="radio"][name="update_pero_type"]');
	var pero_type = "";
	for(var i=0;i<vheckedvalue.length;i++){
			if(vheckedvalue[i].checked){
				if(i<vheckedvalue.length){
						pero_type += vheckedvalue[i].value;
				}
			}
	}
	var termInfo_car_1 = $("#update_termInfo_car option").html();
	var termInfo_car = $("#update_termInfo_car").val();
	var infoList = new Array();
	if(termInfo_car != null){
		for(var i=0;i<termInfo_car.length;i++){
			var info_obj = new Object();
			info_obj.attInfoNo = termInfo_car[i];
			info_obj.attInfoName = $("#update_info_"+termInfo_car[i]).html();
			infoList[i] = info_obj;
		}
	}
	var update_send_type = $('input[type="radio"][name="update_send_type"]');
	var sendType = "";
	for(var i=0;i<update_send_type.length;i++){
			if(update_send_type[i].checked){
				if(i<update_send_type.length){
						sendType += update_send_type[i].value;
				}
			}
	}
	var sendTime = $("#update_send_time").val();
	var msg = {};
	if(att_name == null || att_name == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("考勤名称不能为空！");
		return;
	}
	if(begin_time == null || begin_time == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("开始时间不能为空！");
		return;
	}
	if(end_time == null || end_time == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("结束时间不能为空！");
		return;
	}
	if(infoList == null || infoList.length == 0){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择考勤机！");
		return;
	}
	if(pero_type == null || pero_type == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择考核人员！");
		return;
	}
	if(sendType == 1){
		if(sendTime == null || sendTime == ''){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("请设置推送时间！");
			return;
		}else{
			msg.sendTime = sendTime;
		}
		msg.sendType = sendType;
	}else{
		msg.sendType = 2;
	}
	msg.id = id;
	msg.deptid = deptid;
	msg.attName = att_name;
	msg.beginTime = begin_time;
	msg.endTime = end_time;
	msg.lateTime = lata_time;
	msg.type = pero_type;
	msg.infoList = infoList;
	
	msg.appName="attrules_updateAttRulesById";//
	var jsonStr = common(msg);
	$.ajax({
		type: 'POST',
		url: serverBaseUrl,
		data: jsonStr,
		dataType: "json",
		async:false,
		success: function (success) {
			if(success.msgState == 200){
				$("#update_myModal").modal("hide");
				informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功！");
				areaTable.api().ajax.reload();
			}else{
				informationAlert_OnlyConfirmButton_NOT_REFRESH("修改失败：" + success.msg);
			}
		},
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
			xhr.setRequestHeader("token", static_token);
		}
	});
}

function delete_modal(id){
	informationAlert_confirmAndCancelButton("delete_attRules("+id+")","是否确认删除！");
}

function delete_attRules(id){
	var msg = {};
	msg.id = id;
	msg.appName="attrules_deleteAttRulesById";//
	var jsonStr = common(msg);
	$.ajax({
		type: 'POST',
		url: serverBaseUrl,
		data: jsonStr,
		dataType: "json",
		async:false,
		success: function (success) {
			if(success.msgState == 200){
				informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功！");
				areaTable.api().ajax.reload();
			}else{
				informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功：" + success.msg);
			}
		},
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
			xhr.setRequestHeader("token", static_token);
		}
	});
}

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
    deptId = treeNode.id;
	deptName = treeNode.name;
};

/*获取终端机*/
function findTermInfo(carNo) {
    // 2、接口请求参数组装
    var msg = {};
    msg.termType = 1;
    msg.appName="termInfo_findTermInfo";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var item = success.data;
			var html = '';
			var html_2 = '';
			if(item != null && item.length > 0){
				for(var i=0;i<item.length;i++){
					if(carNo != null){
							if(carNo['termInfo_'+item[i].termNo] == item[i].termNo){
								html_2 += '<option value="'+item[i].termNo+'" id="update_info_'+item[i].termNo+'" selected="selected">'+item[i].termName+'</option>'
							}else{
								html_2 += '<option value="'+item[i].termNo+'" id="update_info_'+item[i].termNo+'">'+item[i].termName+'</option>'
							}
					}else{
						html += '<option value="'+item[i].termNo+'" id="info_'+item[i].termNo+'">'+item[i].termName+'</option>'
					}
				}
				
				if(carNo != null){
					$("#update_termInfo_car").html(html_2);
					$("#update_termInfo_car").multiselect("destroy").multiselect(multiselect_update());
				}else{
					$("#termInfo_car").html(html);
					multiselect_add("#termInfo_car");
				}
			}
	   	},
	        beforeSend: function(xhr) {
	            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
	            xhr.setRequestHeader("token", static_token);
	        }
	    });
}

function show_send_time(){
	document.getElementById('send_time_html').style.display = '';
}

function hide_send_time(){
	document.getElementById('send_time_html').style.display = 'none';
}

function update_show_send_time(){
	document.getElementById('update_send_time_html').style.display = '';
}

function update_hide_send_time(){
	document.getElementById('update_send_time_html').style.display = 'none';
}

function resetTime(){
	$('#begin_time').datetimepicker({
			format: 'HH:mm'
	});
	$('#end_time').datetimepicker({
			format: 'HH:mm'
	});
	$('#lata_time').datetimepicker({
			format: 'HH:mm'
	});
	$('#send_time').datetimepicker({
			format: 'HH:mm'
	});
	$('#update_begin_time').datetimepicker({
			format: 'HH:mm'
	});
	$('#update_end_time').datetimepicker({
			format: 'HH:mm'
	});
	$('#update_lata_time').datetimepicker({
			format: 'HH:mm'
	});
	$('#update_send_time').datetimepicker({
			format: 'HH:mm'
	});
}