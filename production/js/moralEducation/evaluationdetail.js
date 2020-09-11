$(function () {
    detailList();
})
/*清理表单*/
function cleanModal(){
    document.getElementById("saveForm").reset();
}
/*列表*/
function detailList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.id = getUrlParam('id');
                    data.keyWords = $("#keyWords").val();
                    /*查询参数*/
                    data.appName = "detail_findDetailPC";

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
                        if(full.e_mode == 1){
                            return "等级";
                        }else{
                            return "分数";
                        }
                    }
                },{
                    "targets": -1,
                    render: function (data, type, full, meta) {
                        return '<div>' +
                            '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="updateModal(' + full.pk_id + ')"><i class="fa fa-pencil">修改</i></button>' +
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
function saveDetail(type){
    var msg = {};
    msg.e_name = $("#ename").val();
    msg.e_remark = $("#eremark").val();
    var mode = $("input[type='radio'][name='emode']");
    for(var i = 0;i < mode.length;i++){
        if(mode[i].checked){
            msg.e_mode = mode[i].value;
        }
    }
    msg.fk_evaluationid = getUrlParam('id');

    msg.appName="detail_saveDetail";
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
    msg.appName="detail_findDetailById";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            var detail = success.data;
            $("#updateID").val(detail.pk_id);
            $("#detailID").val(detail.fk_evaluationid);
            $("#updateename").val(detail.e_name);
            $("#updateeremark").val(detail.e_remark);
            var mode = detail.e_mode;
            if(mode == 1){
                $("input[type='radio'][id='radio3'][value='1']").prop('checked',true);
            }
            if(mode == 2){
                $("input[type='radio'][id='radio4'][value='2']").prop('checked',true);
            }
            $('#updateModal').modal('show');
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };

}

/*修改：添加新数据*/
function newDetail(){
    var msg = {};
    msg.pk_id = $("#updateID").val();
    msg.e_name = $("#updateename").val();
    msg.e_remark = $("#updateeremark").val();
    var mode = $("input[type='radio'][name='updateemode']");
    for(var i = 0;i < mode.length;i++){
        if(mode[i].checked){
            msg.e_mode = mode[i].value;
        }
    }
    msg.fk_evaluationid = $("#detailID").val();

    msg.appName="detail_updateDetail";
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
    informationAlert_confirmAndCancelButton("deleteDetail("+id+")","是否要删除该考核项？");
}
/*删除*/
function deleteDetail(id) {
    var msg = {};
    msg.id = id;
    msg.appName="detail_deleteDetail";
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


/*获取URL地址参数*/
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}