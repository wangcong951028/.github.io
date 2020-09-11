
var areaTable_amang;
var areaTable_flor;
var areaTable_dor;
$(function(){
	findDorAttStatis_amang();
	findDorAttStatis_flor();
	findDorAttStatis_dor();
	findRules();
	document.getElementById('datatable_amang_html').style.display = '';
})

$("#myButton").click(function () {
	var type_id = $("#type_id").val();
	if(type_id == 1){
		areaTable_amang.api().ajax.reload();
		document.getElementById('datatable_amang_html').style.display = '';
		document.getElementById('datatable_flor_html').style.display = 'none';
		document.getElementById('datatable_dor_html').style.display = 'none';
	}else if(type_id == 2){
		areaTable_flor.api().ajax.reload();
		document.getElementById('datatable_amang_html').style.display = 'none';
		document.getElementById('datatable_flor_html').style.display = '';
		document.getElementById('datatable_dor_html').style.display = 'none';
	}else if(type_id == 3){
		areaTable_dor.api().ajax.reload();
		document.getElementById('datatable_amang_html').style.display = 'none';
		document.getElementById('datatable_flor_html').style.display = 'none';
		document.getElementById('datatable_dor_html').style.display = '';
	}
});

function findDorAttStatis_amang(){
	$(function () {
	//添加额外的参数传给服务器
	areaTable_amang = $('#datatable_amang').dataTable({
		"ajax": {
			"url": serverBaseUrl,
			"data": function (data) {
				//添加额外的参数传给服务器
				data.appName="das_findCountDorNum";
				data.type = $("#type_id").val();
				data.rulesid = $("#rules_id").val();
				data.serchTime = $("#searchTime").val();
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
                    "targets": 2,
                    render: function (data, type, full, meta) {
                    	if(full.countPerNum != 0){
                    		return '<span style="color: #5bc0de;">'+full.countPerNum+'</span>';
                    	}else{
                    		return full.countPerNum;
                    	}
                    }
              },{
                    "targets": 3,
                    render: function (data, type, full, meta) {
                    	if(full.tolayPerNum != 0){
                    		return '<span style="color: #169F85;cursor: pointer" onclick="showItem_back('+full.amangId+')"  title="点击查看详情">'+full.tolayPerNum+'</span>';
                    	}else{
                    		return full.tolayPerNum;
                    	}
                    }
                },{
                    "targets": 4,
                    render: function (data, type, full, meta) {
                    	if(full.notBackPerNum != 0){
                    		return '<span style="color: red;cursor: pointer" onclick="showItem('+full.amangId+')"  title="点击查看详情">'+full.notBackPerNum+'</span>';
                    	}else{
                    		return full.notBackPerNum;
                    	}
                    }
                },{
                    "targets": 5,
                    render: function (data, type, full, meta) {
                    	if(full.leavelPerNum != 0){
                    		return '<span style="color: #2c7;cursor: pointer" onclick="showItem_leavel('+full.amangId+')"  title="点击查看详情">'+full.leavelPerNum+'</span>';
                    	}else{
                    		return full.leavelPerNum;
                    	}
                    }
                }
			]
	});
	});
}

function findDorAttStatis_flor(){
	$(function () {
	//添加额外的参数传给服务器
	areaTable_flor = $('#datatable_flor').dataTable({
		"ajax": {
			"url": serverBaseUrl,
			"data": function (data) {
				//添加额外的参数传给服务器
				data.appName="das_findCountDorNum";
				data.type = $("#type_id").val();
				data.rulesid = $("#rules_id").val();
				data.serchTime = $("#searchTime").val();
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
                    	if(full.countPerNum != 0){
                    		return '<span style="color: #5bc0de;">'+full.countPerNum+'</span>';
                    	}else{
                    		return full.countPerNum;
                    	}
                    }
              },{
                    "targets": 4,
                    render: function (data, type, full, meta) {
                    	if(full.tolayPerNum != 0){
                    		return '<span style="color: #169F85;cursor: pointer" onclick="showItem_back('+full.florId+')"  title="点击查看详情">'+full.tolayPerNum+'</span>';
                    	}else{
                    		return full.tolayPerNum;
                    	}
                    }
                },{
                    "targets": 5,
                    render: function (data, type, full, meta) {
                    	if(full.notBackPerNum != 0){
                    		return '<span style="color: red;cursor: pointer" onclick="showItem('+full.florId+')"  title="点击查看详情">'+full.notBackPerNum+'</span>';
                    	}else{
                    		return full.notBackPerNum;
                    	}
                    }
                },{
                    "targets": 6,
                    render: function (data, type, full, meta) {
                    	if(full.leavelPerNum != 0){
                    		return '<span style="color: #2c7;cursor: pointer" onclick="showItem_leavel('+full.florId+')"  title="点击查看详情">'+full.leavelPerNum+'</span>';
                    	}else{
                    		return full.leavelPerNum;
                    	}
                    }
                }
			]
	});
	});
}

function findDorAttStatis_dor(){
	$(function () {
	//添加额外的参数传给服务器
	areaTable_dor = $('#datatable_dor').dataTable({
		"ajax": {
			"url": serverBaseUrl,
			"data": function (data) {
				//添加额外的参数传给服务器
				data.appName="das_findCountDorNum";
				data.type = $("#type_id").val();
				data.rulesid = $("#rules_id").val();
				data.serchTime = $("#searchTime").val();
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
                    	if(full.countPerNum != 0){
                    		return '<span style="color: #5bc0de;">'+full.countPerNum+'</span>';
                    	}else{
                    		return full.countPerNum;
                    	}
                    }
              },{
                    "targets": 5,
                    render: function (data, type, full, meta) {
                    	if(full.tolayPerNum != 0){
                    		return '<span style="color: #169F85;cursor: pointer" onclick="showItem_back('+full.dorId+')"  title="点击查看详情">'+full.tolayPerNum+'</span>';
                    	}else{
                    		return full.tolayPerNum;
                    	}
                    }
                },{
                    "targets": 6,
                    render: function (data, type, full, meta) {
                    	if(full.notBackPerNum != 0){
                    		return '<span style="color: red;cursor: pointer" onclick="showItem('+full.dorId+')"  title="点击查看详情">'+full.notBackPerNum+'</span>';
                    	}else{
                    		return full.notBackPerNum;
                    	}
                    }
                },{
                    "targets": 7,
                    render: function (data, type, full, meta) {
                    	if(full.leavelPerNum != 0){
                    		return '<span style="color: #2c7;cursor: pointer" onclick="showItem_leavel('+full.dorId+')"  title="点击查看详情">'+full.leavelPerNum+'</span>';
                    	}else{
                    		return full.leavelPerNum;
                    	}
                    }
                }
			]
	});
	});
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

var map = {};
/*获取考核规则*/
function findRules() {
    // 2、接口请求参数组装
    var msg = {};
    msg.start = 0;
    msg.length = 99999;
    msg.appName="doratt_findDorAttRulesSetting";//
    
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var rules = success.data.data;
//	        console.log(rules);
			var html = '';
			map = {};
			if(rules != null && rules.length>0){
				for(var i=0;i<rules.length;i++){
					if(i==0){
						html += '<option value="'+rules[i].id+'" selected="selected">'+rules[i].name+'</option>'
						$("#rules_name_html").html('考勤规则：' + rules[i].name);
						$("#rules_beginTime_html").html('开始时间：' + rules[i].beginTime);
						$("#rules_endTime_html").html('结束时间：' + rules[i].endTime);
						$("#rules_lataTime_html").html('截止时间：' + rules[i].lataTime);
						$("#rules_deptName_html").html('考核部门：' + rules[i].deptName);
					}else{
						html += '<option value="'+rules[i].id+'">'+rules[i].name+'</option>'
					}
					map['name_'+rules[i].id] = rules[i].name;
					map['beginTime_'+rules[i].id] = rules[i].beginTime;
					map['endTime_'+rules[i].id] = rules[i].endTime;
					map['lataTime_'+rules[i].id] = rules[i].lataTime;
					map['deptName_'+rules[i].id] = rules[i].deptName;
				}
			}
			$("#rules_id").html('<option value="-1">----- 请选择 -----</option>' + html);
    	},
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

function setTypeName(value){
	var typeName = $("#type_"+value).html();
	$("#type_html").html('查询类型：' + typeName + '查询');
}

function setRulesType(value){
//	console.log(map);
	var rules_name_html = map['name_'+value];
	var rules_beginTime_html = map['beginTime_'+value];
	var rules_endTime_html = map['endTime_'+value];
	var rules_lataTime_html = map['lataTime_'+value];
	var rules_deptName_html = map['deptName_'+value];
	$("#rules_name_html").html('考勤规则：' + rules_name_html);
	$("#rules_beginTime_html").html('开始时间：' + rules_beginTime_html);
	$("#rules_endTime_html").html('结束时间：' + rules_endTime_html);
	$("#rules_lataTime_html").html('截止时间：' + rules_lataTime_html);
	$("#rules_deptName_html").html('考核部门：' + rules_deptName_html);
}


/*function jumpage(id){
	var rules_id = $("#rules_id").val();
	var type_id = $("#type_id").val();
	var searchTime = $("#searchTime").val();
	if(type_id == 1){
		window.location.href="dorAttStatisItem.html?amangid="+id+"&rules_id="+rules_id+"&type_id="+type_id+"&searchTime="+searchTime+"";
	}else if(type_id == 2){
		window.location.href="dorAttStatisItem.html?florid="+id+"&rules_id="+rules_id+"&type_id="+type_id+"&searchTime="+searchTime+"";
	}else if(type_id == 3){
		window.location.href="dorAttStatisItem.html?dorid="+id+"&rules_id="+rules_id+"&type_id="+type_id+"&searchTime="+searchTime+"";
	}
}*/
/*未归寝详情展示页面*/
function showItem(id){
	var rules_id = $("#rules_id").val();
	var type_id = $("#type_id").val();
	var searchTime = $("#searchTime").val();
	var url_ = '';
	if(type_id == 1){
		url_="dorAttStatisItem.html?amangid="+id+"&rules_id="+rules_id+"&type_id="+type_id+"&searchTime="+searchTime+"";
	}else if(type_id == 2){
		url_="dorAttStatisItem.html?florid="+id+"&rules_id="+rules_id+"&type_id="+type_id+"&searchTime="+searchTime+"";
	}else if(type_id == 3){
		url_="dorAttStatisItem.html?dorid="+id+"&rules_id="+rules_id+"&type_id="+type_id+"&searchTime="+searchTime+"";
	}
	$("#notBackItemIframe").attr('src',url_)
	$("#not_back_item_modal").modal('show');
}

/*请假详情展示页面*/
function showItem_leavel(id){
	var rules_id = $("#rules_id").val();
	var type_id = $("#type_id").val();
	var searchTime = $("#searchTime").val();
	var url_ = '';
	if(type_id == 1){
		url_="dorAttStatisItem_leavel.html?amangid="+id+"&rules_id="+rules_id+"&type_id="+type_id+"&searchTime="+searchTime+"";
	}else if(type_id == 2){
		url_="dorAttStatisItem_leavel.html?florid="+id+"&rules_id="+rules_id+"&type_id="+type_id+"&searchTime="+searchTime+"";
	}else if(type_id == 3){
		url_="dorAttStatisItem_leavel.html?dorid="+id+"&rules_id="+rules_id+"&type_id="+type_id+"&searchTime="+searchTime+"";
	}
	$("#leavelItemIframe").attr('src',url_)
	$("#leavel_item_modal").modal('show');
}

/*归寝人员详情展示页面*/
function showItem_back(id){
	var rules_id = $("#rules_id").val();
	var type_id = $("#type_id").val();
	var searchTime = $("#searchTime").val();
	var url_ = '';
	if(type_id == 1){
		url_="dorAttStatisItem_back.html?amangid="+id+"&rules_id="+rules_id+"&type_id="+type_id+"&searchTime="+searchTime+"";
	}else if(type_id == 2){
		url_="dorAttStatisItem_back.html?florid="+id+"&rules_id="+rules_id+"&type_id="+type_id+"&searchTime="+searchTime+"";
	}else if(type_id == 3){
		url_="dorAttStatisItem_back.html?dorid="+id+"&rules_id="+rules_id+"&type_id="+type_id+"&searchTime="+searchTime+"";
	}
	$("#leavelItemIframe").attr('src',url_)
	$("#leavel_item_modal").modal('show');
}
