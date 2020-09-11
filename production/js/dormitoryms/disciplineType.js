$(function(){
	typeList();
})

/*列表*/
function typeList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.keyword = $("#keyWords").val();
                    /*查询参数*/
                    data.appName = "type_findType";
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
                        return '<div>' +
                            '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="updateModal(' + full.id + ')"><i class="fa fa-pencil">修改</i></button>' +
                            '<button class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="deleteModal(' + full.id + ')"><i class="fa fa-trash-o">删除</i></button>' +
                            '</div>';
                    }
                }]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

function cleanModal(){
	document.getElementById('saveForm').reset();
}

/*新增*/
function saveType(stats){
	var msg = {};
	var type_name = $("#type_name").val();
	var note = $("#note").val();
	if(type_name == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("类型不能为空！");
	}else{
		msg.type_name = type_name;
		msg.note = note;
		msg.appName="type_saveType";//
	    serverFromJSONData(msg,true).then(function (success) {
	    	if(success.msgState == 200){
	    		if(stats == 1){
	    			$("#myModal").modal('show');
	    		}else if(stats == 2){
	    			$("#myModal").modal('hide');
	    		}
	    		cleanModal();
	            areaTable.api().ajax.reload();
	            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功！");
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
	        }
	    }),function (error) {
		        console.log("访问服务器发生错误，请稍后再试!",error);
	    };
	}
}

/*修改：获取原有数据*/
function updateModal(id){
	var msg = {};
	msg.id = id;
	msg.appName="type_findTypeById";//
    serverFromJSONData(msg,true).then(function (success) {
    	if(success.msgState == 200){
    		var distype = success.data;
    		$("#update_id").val(distype.id);
    		$("#update_type_name").val(distype.type_name);
    		$("#update_note").val(distype.note);
    		$("#updateModal").modal('show');
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
	        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/*修改：添加新数据*/
function updateType(){
	var msg = {};
	var update_id = $("#update_id").val();
	var update_type_name = $("#update_type_name").val();
	var update_note = $("#update_note").val();
	if(update_type_name == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("类型不能为空！");
	}else{
		msg.id = update_id;
		msg.type_name = update_type_name;
		msg.note = update_note;
		msg.appName="type_updateType";//
	    serverFromJSONData(msg,true).then(function (success) {
	    	if(success.msgState == 200){
	    		$("#updateModal").modal('hide');
	            areaTable.api().ajax.reload();
	            informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功！");
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
	        }
	    }),function (error) {
		        console.log("访问服务器发生错误，请稍后再试!",error);
	    };
	}
}

/*删除：提示*/
function deleteModal(id){
	informationAlert_confirmAndCancelButton('delete_distype('+id+')','是否需要删除该类型？');
}

function delete_distype(id){
	var msg = {};
	msg.id = id;
	msg.appName="type_deleteType";//
    serverFromJSONData(msg,true).then(function (success) {
    	if(success.msgState == 200){
            areaTable.api().ajax.reload();
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功！");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
	        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

