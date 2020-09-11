var areaTable;

$(function(){
	weixinList();
})

function weixinList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
					data.schoolID = getUrlParam("schoolid");
					data.typeId = $("#type_id").val();
                    /*查询参数*/
                    data.appName = "weixinmodule_list";
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
						"targets":2,
						render:function (data,type,full,meta) {
								var result = "";
								if(full.type == 1){
										result = "门禁考勤";
								}else if(full.type == 2){
										result = "宿舍考勤";
								}else if(full.type == 3){
										result = "家庭作业";
								}else if(full.type == 4){
										result = "考试成绩";
								}
								return result;
						}
					},{
						"targets":-1,
						render:function (data,type,full,meta) {
								return '<div>' +
									'<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="updateModal(' + full.pk_id + ')"><i class="fa fa-pencil">修改</i></button>' +
									'<button class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="deleteModal(' + full.pk_id + ')"><i class="fa fa-trash-o">删除</i></button>' +
									'</div>';
						}
					}
                ]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

function jump_down(){
	window.location.href = 'dissta.html';
}

function clearn(){
	document.getElementById("addForm").reset();
}

function add_weixinmodel(){
	var  msg = {};
	
	var template_id = $("#template_id").val();
	var typeId = $("#typeid").val();
	if(template_id == null || template_id == ""){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("模板id不能为空!");
		return;
	}
	if(typeId == -1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择模板类型!");
		return;
	}
	msg.schoolid = getUrlParam("schoolid");
	msg.typeId = typeId;
	msg.template_id = template_id;
	
	msg.appName="weixinmodule_add";//
	serverFromJSONData(msg,true).then(function (success) {
			if(success.msgState == 200){
				$("#weixin_model").modal("hide");
				clearn();
				areaTable.api().ajax.reload();
				informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功!");
			}else{
				informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
			}
	}),function (error) {
			console.log("访问服务器发生错误，请稍后再试!",error);
	};
}

function updateModal(id){
	var  msg = {};
	msg.pk_id = id
	msg.appName="weixinmodule_findById";//
	serverFromJSONData(msg,true).then(function (success) {
			if(success.msgState == 200){
				var weixin = success.data;
				$("#update_id").val(weixin.pk_id);
				$("#update_template_id").val(weixin.template_id);
				$("#update_typeid").val(weixin.type);
				
				$("#update_weixin_model").modal("show");
			}else{
				informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
			}
	}),function (error) {
			console.log("访问服务器发生错误，请稍后再试!",error);
	};
}

function new_weixin(){
	var  msg = {};
	
	var template_id = $("#update_template_id").val();
	var typeId = $("#update_typeid").val();
	if(template_id == null || template_id == ""){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("模板id不能为空!");
		return;
	}
	if(typeId == -1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择模板类型!");
		return;
	}
	msg.pk_id = $("#update_id").val();
	msg.template_id = template_id;
	msg.typeId = typeId;
	msg.appName="weixinmodule_update";//
	serverFromJSONData(msg,true).then(function (success) {
			if(success.msgState == 200){
				$("#update_weixin_model").modal("hide");
				areaTable.api().ajax.reload();
				informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功!");
			}else{
				informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
			}
	}),function (error) {
			console.log("访问服务器发生错误，请稍后再试!",error);
	};
}

function deleteModal(id){
	informationAlert_confirmAndCancelButton("delete_weixin("+id+")","是否确认删除？");
}

function delete_weixin(id){
	var  msg = {};
	msg.pk_id = id;
	msg.appName="weixinmodule_delete";//
	serverFromJSONData(msg,true).then(function (success) {
			if(success.msgState == 200){
				areaTable.api().ajax.reload();
				informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功!");
			}else{
				informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
			}
	}),function (error) {
			console.log("访问服务器发生错误，请稍后再试!",error);
	};
}


//----------------------------------------------------------------------------------------------------------------------------------------

/*获取URL地址参数*/
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

function jump_page(){
	window.location.href = "schoolManager.html";
}