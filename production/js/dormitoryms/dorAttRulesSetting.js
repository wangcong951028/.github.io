var deptName = '';
var deptId = '';
var areaTable;

$(function(){
	findDeptNode();
	findDorAttRules();
})


function findDorAttRules(){
	$(function () {
	//添加额外的参数传给服务器
	areaTable = $('#datatable').dataTable({
		"ajax": {
			"url": serverBaseUrl,
			"data": function (data) {
				//添加额外的参数传给服务器
				data.appName="doratt_findDorAttRulesSetting";
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
                    "targets": -1,
                    render: function (data, type, full, meta) {
                        return '<a class="btn btn-info btn-xs" href="javascript:;"  data-key="' + 10000 + '"  onclick="updateDorAttRules(' + full.id + ')"><i class="fa fa-pencil"></i>修改</a>' +
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


function show_madel(){
	if(deptId == null || deptId == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择部门！");
		return;
	}
	$("#deptname").html(deptName);
	$("#deptid").val(deptId);
	$("#myModal").modal("show");
}

/*公共参数*/
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


/*获取公寓楼*/
function findDeptNode() {
    // 2、接口请求参数组装
    var msg = {};
    msg.appName="origaniza_listOriganizaTree";//dor_getDorZtree//amang_findAMangZtree
    
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

function cleanModal(){
	document.getElementById('rulesForm').reset()
}

function addDorAttRules(){
	var msg = {};
	var deptid = $("#deptid").val();
	var name = $("#doratt_name").val();
	var beginTime = $("#begin_time").val();
	var endTime = $("#end_time").val();
	var lataTime = $("#lata_time").val();
	if(name == null || name == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请设置考勤规则名称！");
	}
	if(beginTime == null || beginTime == '' || endTime == null || endTime == '' ){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("开始或结束时间不能为空！");
	}
	msg.deptid = deptid;
	msg.name = name;
	msg.beginTime = beginTime;
	msg.endTime = endTime;
	msg.lataTime = lataTime;
    msg.appName="doratt_insertDorAttRulesSet";//
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
			$("#myModal").modal("hide");
			areaTable.api().ajax.reload();
			informationAlert_OnlyConfirmButton_NOT_REFRESH('添加成功');
    	},
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

function updateDorAttRules(id){
	var msg = {};
	msg.id = id;
    msg.appName="doratt_findDorAttRulesSettingById";//
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
			console.log(success.data);
			var item = success.data;
			if(item != null){
				$("#update_id").val(item.id);
				$("#update_deptname").html(item.deptName);
				$("#update_doratt_name").val(item.name);
				$("#update_begin_time").val(item.beginTime);
				$("#update_end_time").val(item.endTime);
				$("#update_lata_time").val(item.lataTime);
				$("#update_myModal").modal("show");
			}
    	},
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

function update_addDorAttRules(){
	var msg = {};
	var update_id = $("#update_id").val();
	var update_doratt_name = $("#update_doratt_name").val();
	var update_begin_time = $("#update_begin_time").val();
	var update_end_time = $("#update_end_time").val();
	var update_lata_time = $("#update_lata_time").val();
	if(update_doratt_name == null || update_doratt_name == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请设置考勤规则名称！");
	}
	if(update_begin_time == null || update_begin_time == '' || update_end_time == null || update_end_time == '' ){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("开始或结束时间不能为空！");
	}
	msg.id = update_id;
	msg.name = update_doratt_name;
	msg.beginTime = update_begin_time;
	msg.endTime = update_end_time;
	msg.lataTime = update_lata_time;
    msg.appName="doratt_updateDorAttRulesSet";//
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
			$("#update_myModal").modal("hide");
			areaTable.api().ajax.reload();
			informationAlert_OnlyConfirmButton_NOT_REFRESH('修改成功');
    	},
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

function delete_modal(id){
	informationAlert_confirmAndCancelButton('delete_doratt('+id+')','是否删除该条考勤规则？');
}

function delete_doratt(id){
	var msg = {};
	msg.id = id;
    msg.appName="doratt_deleteDorAttRulesSet";//
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
			areaTable.api().ajax.reload();
			informationAlert_OnlyConfirmButton_NOT_REFRESH('删除成功');
    	},
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}
