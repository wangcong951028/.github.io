$(function () {
    projectList();
})
/*清理表单*/
function cleanModal(){
    document.getElementById("saveForm").reset();
}
/*列表*/
function projectList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    /*查询参数*/
                    data.appName = "eva_findPorjectPC";
                    data.keyWords = $("#keyWords").val();
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
                            '<a style="text-decoration:none" class="btn btn-info btn-xs" href="evaluationdetail.html?id='+full.pk_id+'"  data-key="' + full.pk_id + '" ><i class="fa fa-pencil">添加新考核项</i></a>' +
                            '<button class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="deleteModal(' + full.pk_id + ')"><i class="fa fa-trash-o">删除</i></button>' +
                            '</div>';
                    }
                }]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

/*添加*/
function saveProject(type){
    var msg = {};
    msg.e_name = $("#ename").val();

    msg.appName="eva_savePorject";
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

/*修改：获取数据*/
function updateModal(id){
    var msg = {};
    msg.id = id;

    msg.appName="eva_findPorjectById";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            var project = success.data;

            $("#updateID").val(project.pk_id);
            $("#updateEname").val(project.e_name);

            $('#updateModal').modal('show');
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };

}

/*修改：添加新数据*/
function newProject(){
    var msg = {};
    msg.pk_id = $("#updateID").val();
    msg.e_name = $("#updateEname").val();

    msg.appName="eva_updatePorject";
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

/*删除提示*/
function deleteModal(id) {
    informationAlert_confirmAndCancelButton("deleteProject("+id+")","是否要删除该考核项？");
}
/*删除*/
function deleteProject(id) {
    var msg = {};
    msg.id = id;
    msg.appName="eva_deletePorject";
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