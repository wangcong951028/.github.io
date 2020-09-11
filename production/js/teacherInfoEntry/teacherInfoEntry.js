$(function(){
	init();
	$("#search").click(function(){
		refresh();
	})
})

//进行初始化列表操作
function init(){
	areaTable = $('#datatable').dataTable({
        "ajax": {
            "url": serverBaseUrl,
            "data": function (data) {
                //添加额外的参数传给服务器
                data.name=$("#teacherName").val();
                data.schoolName=$("#schoolName").val();
                data.appName="teacherInfo_findInfrom";
                return buildRequestParam(data);
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
        }
        ,
        "columnDefs": [
            {
                "targets": -1,
                render: function (data, type, fill, meta) {
                var html = "<button type='reset' class='btn btn-primary btn-xs' onclick='deletes(&quot;"+ fill.pk_id+ "&quot;)'>删除</button>";
                    return html;
                }

            }]
    });
}


//进行信息删除
function deletes(pk_id) {
	informationAlert_confirmAndCancelButton("deleteTeacherLinkMan("+pk_id+")","是否确认删除联系人信息？");
}

function deleteTeacherLinkMan(pk_id) {
    var msg = {};

    msg.appName="teacherInfo_deleteInfrom";
    msg.pk_id=pk_id;
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除展示失败!");
        }
        refresh();
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/**刷新表单*/
function  refresh() {
    areaTable.api().ajax.reload();
}