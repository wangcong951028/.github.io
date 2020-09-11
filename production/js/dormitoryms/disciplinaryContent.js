$(function(){
	contentList();
	getDistype();
})

/*列表*/
function contentList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.keyword = $("#keyWords").val();
                    data.type_id = $("#type_id").val();
                    /*查询参数*/
                    data.appName = "content_findContent";
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

function saveContent(stats){
	var msg = {};
	var content_name = $("#content_name").val();
	var dis_type_id = $("#dis_type_id").val();
	var note = $("#note").val();
	if(content_name == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("内容不能为空！");
	}else if(dis_type_id == -1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("类型不能为空！");
	}else{
		msg.content_name = content_name;
		msg.type_id = dis_type_id;
		msg.note = note;
		msg.appName="content_saveContent";//
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
	msg.appName="content_findContentById";//
    serverFromJSONData(msg,true).then(function (success) {
    	if(success.msgState == 200){
    		var discontent = success.data;
    		$("#update_content_name").val(discontent.content_name);
    		$("#update_type_id").val(discontent.type_id);
    		$("#update_note").val(discontent.note);
    		$("#update_id").val(discontent.id);
			$("#updateModal").modal('show');
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
	        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/*修改：添加新数据*/
function updateContent(){
	var msg = {};
	var id = $("#update_id").val();
	var content_name = $("#update_content_name").val();
	var dis_type_id = $("#update_type_id").val();
	var note = $("#update_note").val();
	if(content_name == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("内容不能为空！");
	}else if(dis_type_id == -1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("类型不能为空！");
	}else{
		msg.id = id;
		msg.content_name = content_name;
		msg.type_id = dis_type_id;
		msg.note = note;
		msg.appName="content_updateContent";//
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
	informationAlert_confirmAndCancelButton('deleteContent('+id+')','是否删除该考核内容？');
}

/*删除*/
function deleteContent(id){
	var msg = {};
	msg.id = id;
	msg.appName="content_deleteContent";//
    serverFromJSONData(msg,true).then(function (success) {
    	if(success.msgState == 200){
    		$("#updateModal").modal('hide');
            areaTable.api().ajax.reload();
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功！");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
	        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}
//--------------------------------------------------------------------

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

/*获取类型*/
function getDistype(){
    var msg = {};
    msg.appName = "type_findTypeAll";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var distype = success.data;
	        var html = '';
	        var html2 = '';
	        var html3 = '';
	        for(var i=0;i<distype.length;i++){
	        	html += '<option value="'+distype[i].id+'">'+distype[i].type_name+'</option>';
	        	html2 += '<option value="'+distype[i].id+'">'+distype[i].type_name+'</option>';
	        	html3 += '<option value="'+distype[i].id+'">'+distype[i].type_name+'</option>';
	        }
	        $("#type_id").html('<option value="-1">----- 请选择 -----</option>'+html);
	        $("#dis_type_id").html('<option value="-1">----- 请选择 -----</option>'+html2);
	        $("#update_type_id").html('<option value="-1">----- 请选择 -----</option>'+html3);
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}