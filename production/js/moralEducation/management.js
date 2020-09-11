$(function () {
    managementList();
})
/*清理表单*/
function cleanModal(){
    document.getElementById("saveForm").reset();
}
/*列表*/
function managementList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    /*查询参数*/
                    data.appName = "what_findManagementPC";
                    data.keyWord = $("#keyWords").val();
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
                            '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="updateModal(' + full.pk_id + ')"><i class="fa fa-pencil">修改</i></button>' +
                            '<button class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="deleteModal(' + full.pk_id + ')"><i class="fa fa-trash-o">删除</i></button>' +
                            '</div>';
                    }
                },{
                    "targets": 2,
                    render: function (data, type, full, meta) {
                        return full.w_time+"——"+full.w_etime;
                    }
                }]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

/*添加*/
function saveManagement(type){
    var msg = {};
    var wname = $("#wname").val();
    
    var wtime = $("#wtime").val();
    var etime = $("#etime").val();
    
    if(wname == "" || wname == null || wname.length>20){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("名称不能为空，且不能超过20个字符！");
    }else if(wtime >= etime){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("开始时间不能大于等于结束时间！");
    }else{
	    msg.w_name = wname;
	    msg.w_time = wtime;
	    msg.w_etime = etime;
	    msg.appName="what_saveManagement";
	    serverFromJSONData(msg,true).then(function (success) {
	        if(success.msgState == 200){
	            if(type == 2){
	                $('#myModal').modal('hide');
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

/*修改：获取数据*/
function updateModal(id){
    var msg = {};
    msg.id = id;

    msg.appName="what_findManagementById";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            var management = success.data;

            $("#updateID").val(management.pk_id);
            $("#updatewname").val(management.w_name);
            $("#updatewtime").val(management.w_time);
            $("#updateetime").val(management.w_etime);

            $('#updateModal').modal('show');
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };

}

/*修改：添加新数据*/
function newManagement(){
    var msg = {};
    if($("#updatewtime").val()>=$("#updateetime").val()){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("开始时间不能大于等于结束时间！");
    }else{
	    msg.pk_id = $("#updateID").val();
	    msg.w_name = $("#updatewname").val();
	    msg.w_time = $("#updatewtime").val();
	    msg.w_etime = $("#updateetime").val();
	    msg.appName="what_updateManagement";
	    serverFromJSONData(msg,true).then(function (success) {
	        if(success.msgState == 200){
	            cleanModal();
	            areaTable.api().ajax.reload();
	            informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功！");
	            $('#updateModal').modal('hide');
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
	        }
	    }),function (error) {
	        console.log("访问服务器发生错误，请稍后再试!",error);
	    };
	}
}

/*删除提示*/
function deleteModal(id) {
    informationAlert_confirmAndCancelButton("deleteManagement("+id+")","是否需要删除？");
}
/*删除*/
function deleteManagement(id) {
    var msg = {};
    msg.id = id;
    msg.appName="what_deleteManagement";
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