var areaTable;

$(function(){
	findDorAttStatis_leavel();
})

function findDorAttStatis_leavel(){
	//添加额外的参数传给服务器
	areaTable = $('#datatable').dataTable({
		"ajax": {
			"url": serverBaseUrl,
			"data": function (data) {
				//添加额外的参数传给服务器
				data.appName="das_findLeavelSubItem";
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
				
			]
	});
}

$("#searchButton").click(function () {
	areaTable.api().ajax.reload();
});

/*获取URL地址参数*/
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}


