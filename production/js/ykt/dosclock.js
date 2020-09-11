var deptid = '';
var areaTable;

$(function(){
	findDeptNode();
	findSub(1);
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
var noonid =  -1;
var nightid =  -1;
var dosclockTime =  "";

function findSub(){
	$(function () {
	//添加额外的参数传给服务器
	areaTable = $('#datatable').dataTable({
		"ajax": {
			"url": serverBaseUrl,
			"data": function (data) {
				if(noonid != -1){
					data.type = noonid;
				}
				if(nightid != -1){
					data.type = nightid;
				}
				//添加额外的参数传给服务器
				data.deptid = deptid;
				
				data.ctime = dosclockTime;
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
				"targets": 3,
				render: function (data, type, full, meta) {
					if(noonid == 3 || nightid == 6){
						return "--";
					}else {
						return full.ctime;
					}
				}
			}
			]
	});
		$("#myButton").click(function () {
			if(deptid == ''){
				informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择班级！");
				return;
			}
			noonid =  $("#noonid").val();
			nightid =  $("#nightid").val();
			dosclockTime =  $("#dosclockTime").val();
			if(noonid == -1 && nightid == -1){
				informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择打卡类型！");
				return;
			}
			if(dosclockTime == null || dosclockTime == ''){
				informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择时间！");
				return;
			}
			areaTable.api().ajax.reload();
		}); 
	});
}

function zTreeOnCheck(event, treeId, treeNode) {
    deptid = treeNode.id;
};