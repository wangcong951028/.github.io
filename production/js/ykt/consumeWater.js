var username = "";
var jobNum = "";
var startTime = "";
var endTime = "";
var deptid = '';
var type = -1;
var areaTable;
$(function(){
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
    areaTable.api().ajax.reload();
};

//列表
function findSub(){
	$(function () {
	//添加额外的参数传给服务器
	areaTable = $('#datatable').dataTable({
		"ajax": {
			"url": serverBaseUrl,
			"data": function (data) {
				//添加额外的参数传给服务器
				data.username = username;
				data.type = type;
				data.classId = deptid;
				data.jobNum = jobNum;
				data.startDate = startTime;
				data.endDate = endTime;
				
				data.appName="ykt_getConsumeWater";
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
					if(full.userType == 1){
						return "学生";
					}else if(full.userType == 2){
						return "教师";
					}
				}
			},{
				"targets": 5,
				render: function (data, type, full, meta) {
				    return getType(full.tradeType.trim());
				}
			}
			]
	});
		$("#myButton").click(function () {
			username = $("#username").val();
			jobNum = $("#jobNum").val();
			startTime = $("#startTime").val();
			endTime = $("#endTime").val();
			areaTable.api().ajax.reload();
		}); 
	});
}
//交易类型
function setType(){
	type = $("#type_id").val();
	areaTable.api().ajax.reload();
}

function getType(typeKey){
	if(typeKey=='100'){
		return '<span style="color:green;">现金充值</span>';
	}
	if(typeKey=='101'){
		return '<span style="color:green;">支付宝充值</span>';
	}
	if(typeKey=='102'){
		return '<span style="color:green;">微信充值</span>';
	}
	if(typeKey=='103'){
		return '<span style="color:green;">补助充值</span>';
	}
	if(typeKey=='104'){
		return '<span style="color:red;">现金消费</span>';
	}
	if(typeKey=='105'){
		return '<span style="color:red;">补助消费</span>';
	}
	if(typeKey=='106'){
		return '<span style="color:red;">支付宝代扣</span>';
	}
	if(typeKey=='107'){
		return '<span style="color:red;">红冲</span>';
	}
	if(typeKey=='108'){
		return '<span style="color:red;">取款</span>';
	}
	
}