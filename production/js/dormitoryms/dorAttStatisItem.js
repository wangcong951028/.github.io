var areaTable;

$(function(){
	findDorAttStatis_Item();
//	findAttRules();
})


function findDorAttStatis_Item(){
	//添加额外的参数传给服务器
	areaTable = $('#datatable').dataTable({
		"ajax": {
			"url": serverBaseUrl,
			"data": function (data) {
				//添加额外的参数传给服务器
				data.appName="das_findNotBackSubItem";
				var type_id = getUrlParam('type_id');
				if(type_id == 1){
					data.amangid = getUrlParam('amangid');
				}else if(type_id == 2){
					data.florid = getUrlParam('florid');
				}else if(type_id == 3){
					data.dorid = getUrlParam('dorid');
				}
				data.rulesid = getUrlParam('rules_id');
				data.serchTime = getUrlParam('searchTime');
				data.subName = $("#subName").val();
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
                    	return  '<div>'+
                    			'<span style="text-decoration:none" class="btn btn-info btn-xs" onclick="show_modal(\''+full.subName+'\',\''+full.subXgh+'\',\''+full.dorName+'\',\''+full.dorId+'\')" data-key="' + full.pk_id + '" ><i class="fa fa-pencil">编辑</i></span>' +
                                '</div>';
                    }
                }
			]
	});
}

$("#searchButton").click(function () {
	areaTable.api().ajax.reload();
});

$("#myButton").click(function () {
//	window.location.href="dorAttStatis.html"
 	window.history.back(-1)
});

function show_modal(subName,subXgh,dorName,Dorid){
	findAttRules();
	$("#sub_name").val(subName);
	$("#sub_xgh").val(subXgh);
	$("#dor_name").val(dorName);
	$("#dor_id").val(Dorid);
	$("#myModal").modal('show');
}

/*修改状态*/
function updateDorAttRulesItem() {
    // 2、接口请求参数组装
    var msg = {};
    
    var sub_name = $("#sub_name").val();
	var sub_xgh = $("#sub_xgh").val();
	var dor_id = $("#dor_id").val();
	var beginTime = $("#beginTime").val();
	var endTime = $("#endTime").val();
	var note = $("#note").val();
	var vheckedvalue = $('input[type="radio"][name="pero_type"]');
	var pero_type = 0;
	for(var i=0;i<vheckedvalue.length;i++){
			if(vheckedvalue[i].checked){
				if(i<vheckedvalue.length){
						pero_type += vheckedvalue[i].value;
				}
			}
	}
    msg.subName = sub_name;
    msg.subXgh = sub_xgh;
    msg.dorid = dor_id;
    msg.beginTime = beginTime;
    msg.endTime = endTime;
    msg.note = note;
    msg.status = pero_type;
    msg.appName="das_updateStudentType";//
    
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	       if(success.msgState == 200){
	       		cleanModal();
	       		$("#myModal").modal('hide');
	       		areaTable.api().ajax.reload();
	       		informationAlert_OnlyConfirmButton_NOT_REFRESH("补录登记成功！");
	       }else{
	       		informationAlert_OnlyConfirmButton_NOT_REFRESH("补录登记失败！");
	       }
    	},
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*获取考勤规则*/
function findAttRules() {
    // 2、接口请求参数组装
    var msg = {};
    var id = getUrlParam('rules_id');
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
	       var item = success.data;
	       var strTime = getUrlParam('searchTime');
	       if(item != null){
	       		$("#beginTime").val(strTime+ " " + item.beginTime);
	       		if(item.lataTime != null){
	       			$("#endTime").val(strTime+ " " + item.lataTime);
	       		}else{
	       			$("#endTime").val(strTime+ " " + item.endTime);
	       		}
	       }
    	},
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

function cleanModal(){
	document.getElementById('rulesForm').reset();
}

/*获取URL地址参数*/
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
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