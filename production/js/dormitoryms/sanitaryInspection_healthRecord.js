function jump_page(){
	window.location.href = "sanitaryInspection.html";
}

var areaTable;
var name;//任务名称

$(function(){
	find_inspection();
	getApart();
})

/*获取考核任务*/
function find_inspection(){
	var msg = {};
	// msg.id = delete_id;
	msg.id = getUrlParam("id");
	msg.appName="ins_findInspectionById";//
    serverFromJSONData(msg,true).then(function (success) {
    	if(success.msgState == 200){
			var inspection = success.data;
			name = inspection.name;
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
		dor_List();
    }),function (error) {
	        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/*列表*/
function dor_List() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
					data.florid = $("#floor_id").val();
					data.amangid = $("#amang_id").val();
					data.apartid = $("#apart_id").val();
					data.dorname = $("#keyWords").val();
					data.status = $("#status_id").val();
					data.sanspectionid = getUrlParam("id");
                    /*查询参数*/
                    data.appName = "san_findDorsan";
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
					"targets": 1,
					"orderable": false,
					"className": 'select-checkbox',
					render: function (data, type, full, meta) {
						return '<input type="checkbox" name="table_records" class="flat" id="checkbox-all-' + full.dorid + '" value="' + full.dorid + '" />'+
						'<input type="type" hidden="hidden" name="table_records" class="flat" id="dor_id_' + full.dorid + '" value="' + full.dorid + '" />';
					}
				},{
						"targets": 3,
						render: function (data, type, full, meta) {
								return "<span type='text' value='' id='dor_name_"+full.dorid+"'>"+full.dorname+"</span>";
						}
				},{
						"targets": 4,
						render: function (data, type, full, meta) {
								return name;
						}
				},{
						"targets": 5,
						render: function (data, type, full, meta) {
							if(full.ds_grade == 0){
								return "<input type='text' value='' placeholder='"+full.ds_grade+"' id='grade_"+full.dorid+"' class='form-control' onkeyup='onlyNumber(this)' onblur='onlyNumber(this)'/>";
							}else{
								return "<input type='text' value='"+full.ds_grade+"' placeholder='' id='grade_"+full.dorid+"' class='form-control' onkeyup='onlyNumber(this)' onblur='onlyNumber(this)'/>";
							}
						}
				},{
						"targets": 6,
						render: function (data, type, full, meta) {
							if(full.ds_note == "-"){
								return "<textarea rows='1' style='resize:none' placeholder='"+full.ds_note+"' id='note_"+full.dorid+"' class='form-control'></textarea>";
							}else{
								return "<textarea rows='1' style='resize:none' id='note_"+full.dorid+"' class='form-control'>"+full.ds_note+"</textarea>";
							}
						}
				}
                ]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

/*添加卫生检查成绩*/
var save_dorid;
function hint_msg(){
	save_dorid = new Array();
	$("input[type='checkbox']:checked").each(function () {
			if(this.value != 'null' && this.value != 'on'){
				 var grade = $("#grade_"+this.value+"").val();
				 var note = $("#note_"+this.value+"").val();
				 if(grade != '' || note != ''){
					 save_dorid.push(this.value);
				 }
			}
	});
	if(save_dorid.length<1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请至少选择一条数据！");
	}else{
		saveDorsan();
	}
			
}
function saveDorsan(){
	var list = new Array();
	for(var i=0;i<save_dorid.length;i++){
		var item = new Object();
		item.fk_sanspectionid = getUrlParam("id");
		item.ds_sanapectionname = name;
		
		item.fk_dorid = save_dorid[i];
		item.ds_dorname = $("#dor_name_"+save_dorid[i]+"").html();
		
		item.ds_grade = $("#grade_"+save_dorid[i]+"").val();
		item.ds_note = $("#note_"+save_dorid[i]+"").val();
		list.push(item);
	}
	var msg = {};
	msg.list = list;
	msg.appName="san_saveDorsan";//
	serverFromJSONData(msg,true).then(function (success) {
		if(success.msgState == 200){
			find_inspection();
			informationAlert_OnlyConfirmButton_NOT_REFRESH("保存成功!");
		}else{
			informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
		}
		dor_List();
	}),function (error) {
			console.log("访问服务器发生错误，请稍后再试!",error);
	};
}

//----------------------------------------------------------------------------------------------------------------

/*获取URL地址参数*/
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

//公共参数
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

/*获取公寓区域*/
function getApart(){
    var msg = {};
    msg.appName = "apart_findAparMangAll";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var apart = success.data;
	        var html = '';
	        for(var i=0;i<apart.length;i++){
	        	html += '<option value="'+apart[i].id+'">'+apart[i].name+'</option>';
	        }
	        $("#apart_id").html('<option value="-1">----- 请选择 -----</option>'+html);
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*获取公寓楼*/
function getAMang(apartid){
    var msg = {};
    msg.area = apartid;
    msg.appName = "amang_findAMangAll";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var amang = success.data;
	        var html = '';
	        for(var i=0;i<amang.length;i++){
	        	html += '<option value="'+amang[i].id+'">'+amang[i].apartmentName+'</option>';
	        }
	        if(apartid == -1){
	        	$("#amang_id").html('<option value="-1">----- 请选择 -----</option>');
	        	$("#floor_id").html('<option value="-1">----- 请选择 -----</option>');
	        }else{
	        	$("#amang_id").html('<option value="-1">----- 请选择 -----</option>'+html);
	        }
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*获取楼层*/
function getFloor(amangid){
    var msg = {};
    msg.sttaid = amangid;
    msg.appName = "floor_findFloorAll";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var floor = success.data;
	        var html = '';
	        for(var i=0;i<floor.length;i++){
	        	html += '<option value="'+floor[i].id+'">'+floor[i].floorName+'</option>';
	        }
	        if(amangid == -1){
	        	$("#floor_id").html('<option value="-1">----- 请选择 -----</option>');
	        }else{
	        	$("#floor_id").html('<option value="-1">----- 请选择 -----</option>'+html);
	        }
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

