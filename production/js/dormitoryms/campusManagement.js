$(function(){
	cmList();
})

/*列表*/
function cmList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.keyword = $("#keyWords").val();
                    /*查询参数*/
                    data.appName = "cm_findCampus";
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
function saveCM(stats){
	var msg = {};
    var cmName = $("#cmName").val()
    var cmNumber = $("#cmNumber").val();
    var cmAddress = $("#cmAddress").val();
    if(cmName == ''){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("校区名称不能为空！");
    }else if(cmNumber == ''){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("校区代码不能为空！");
    }else if(cmAddress == ''){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("校区地址不能为空！");
    }else{
    	msg.cmName = cmName;
    	msg.cmNumber = cmNumber;
    	msg.cmAddress = cmAddress;
	    msg.appName="cm_saveCampus";//
	    serverFromJSONData(msg,true).then(function (success) {
	        if(success.msgState == 200){
	            if(stats == 2){
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

/*修改：获取原有数据*/
function updateModal(id){
	var msg = {}
	msg.id = id;
	msg.appName="cm_findCampusById";//
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
           var cm = success.data;
           console.debug(cm);
           $("#update_id").val(cm.id);
           $("#update_cmName").val(cm.cmName);
           $("#update_cmNumber").val(cm.cmNumber);
           $("#update_cmAddress").val(cm.cmAddress);
           
           $("#updateModal").modal('show');
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}
function updateCM(){
	var msg = {};
	var id = $("#update_id").val();
    var cmName = $("#update_cmName").val()
    var cmNumber = $("#update_cmNumber").val();
    var cmAddress = $("#update_cmAddress").val();
    if(cmName == ''){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("校区名称不能为空！");
    }else if(cmNumber == ''){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("校区代码不能为空！");
    }else if(cmAddress == ''){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("校区地址不能为空！");
    }else{
    	msg.id = id;
    	msg.cmName = cmName;
    	msg.cmNumber = cmNumber;
    	msg.cmAddress = cmAddress;
	    msg.appName="cm_updateCampus";//
	    serverFromJSONData(msg,true).then(function (success) {
	        if(success.msgState == 200){
                $('#updateModal').modal('hide');
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

function deleteModal(id){
	informationAlert_confirmAndCancelButton('delete_cm('+id+')','是否确定删除？');
}

function delete_cm(id){
	var msg = {}
	msg.id = id;
	msg.appName="cm_deleteCampus";//
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
        	areaTable.api().ajax.reload();
        	informationAlert_OnlyConfirmButton_NOT_REFRESH('删除成功!');
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}
