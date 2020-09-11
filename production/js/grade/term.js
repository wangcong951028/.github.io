$(function(){
    termList();//成绩列表
})

/*清理模态框*/
function cleanModal(){
    $("#termName").val("");
    $("#termYear").val("");
    $("#beginTime").val("");
    $("#endTime").val("");
    $("input[type='radio'][id='myRadio'][value='1']").prop("checked",'checked');
}

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
var areaTable;
/*列表*/
function termList() {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    /*查询参数*/
                    data.keyWord = $("#tremName").val();
                    data.appName = "term_findTerm";
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
                /*{
                    "targets": 1,
                    "orderable": false,
                    "className": 'select-checkbox',
                    render: function (data, type, full, meta) {
                        return '<input type="checkbox" name="table_records" class="flat" id="checkbox-all-' + full.pk_ID + '" value="' + full.pk_ID + '" />';
                    }
                },*/
                {
                    "targets": 2,
                    render: function (data, type, full, meta) {

                        if (full.t_IsCurrentTerm == 0) {
                            return '<span style="color: red" class="glyphicon glyphicon-remove"></span>';
                        }
                        else if (full.t_IsCurrentTerm == 1) {
                            return '<span style="color: darkturquoise" class="glyphicon glyphicon-ok"></span>';
                        }
                    }
                },
                {
                    "targets": -1,
                    render: function (data, type, full, meta) {
                        return '<a class="btn btn-info btn-xs" href="javascript:;"  data-key="' + full.pk_ID + '"  onclick="updateTerm(' + full.pk_ID + ')"><i class="fa fa-pencil">修改</i></a>';
                            /*+'<a class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.pk_ID + '"  onclick="deleteModal(' + full.pk_ID + ')"><i class="fa fa-trash-o">删除</i></a>';*/
                    }
                }]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
}

/*添加*/
function saveTerm() {
    // 2、接口请求参数组装
    var msg = {};
    msg.t_term = $("#termName").val();
    msg.t_SDate = $("#beginTime").val();
    msg.t_EDate = $("#endTime").val();
    msg.t_Year = $("#termYear").val();
    var t_IsCurrentTerm = $("input[type='radio'][name='myDiv']");
    for(var i=0;i<t_IsCurrentTerm.length;i++){
        if(t_IsCurrentTerm[i].checked){
            msg.t_IsCurrentTerm = t_IsCurrentTerm[i].value;
        }
    };

    msg.appName="term_saveTerm";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        success: function (success) {
            if(success.msgState == 200){
                $('#myModal').modal('hide');
                cleanModal();
                areaTable.api().ajax.reload();
                informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功！");
            }else{
                informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
            }
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*修改：先拿到数据*/
function updateTerm(id) {
    // 2、接口请求参数组装
    var msg = {};
    msg.id = id;
    msg.appName="term_findTermById";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        success: function (success) {
            if(success.msgState == 200){
                var term = success.data;
                $("#updateID").val(term.pk_ID);
                $("#updateSchoolID").val(term.fk_SchoolID);
                $("#updateTermName").val(term.t_term);
                $("#updateTermYear").val(term.t_Year);
                $("#updateBeginTime").val(term.t_SDate);
                $("#updateEndTime").val(term.t_EDate);
                if(term.t_IsCurrentTerm == 1){

                    $("input[type='radio'][id='radio1'][value='1']").prop("checked",'checked');
                }
                if(term.t_IsCurrentTerm == 0){

                    $("input[type='radio'][id='radio2'][value='0']").prop("checked",'checked');
                }
                $('#updateModal').modal({
                    backdrop:false,//false:模式对话框，就是没有关闭模式对话框后面页面都不能点击。
                    keyboard:true,//当按下 esc键时关闭模态框，设置为 false 时则按键无效。默认为true
                    show:true
                });
            }else{
                informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
            }
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*修改：添加新数据*/
function newTerm() {
    // 2、接口请求参数组装
    var msg = {};
    msg.pk_ID = $("#updateID").val();
    msg.fk_SchoolID = $("#updateSchoolID").val();
    msg.t_term = $("#updateTermName").val();
    msg.t_Year = $("#updateTermYear").val();
    msg.t_SDate = $("#updateBeginTime").val();
    msg.t_EDate = $("#updateEndTime").val();
    var t_IsCurrentTerm = $("input[type='radio'][name='updateMyDiv']");
    for(var i=0;i<t_IsCurrentTerm.length;i++){
        if(t_IsCurrentTerm[i].checked){
            msg.t_IsCurrentTerm = t_IsCurrentTerm[i].value;
        }
    };

    msg.appName="term_updateTerm";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        success: function (success) {
            if(success.msgState == 200){
                $('#updateModal').modal('hide');
                areaTable.api().ajax.reload();
                informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功！");
            }else{
                informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
            }
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*删除提示*/
function deleteModal(id){
    informationAlert_confirmAndCancelButton("deleteTerm("+id+")","删除该条记录会导致该条记录的成绩一起删除，是否确认删除？");
}

/*删除*/
function deleteTerm(id) {
    // 2、接口请求参数组装
    var msg = {};
    var list = new Array();
    list[0] = id;
    msg.ids = list;
    msg.appName="term_deleteTerm";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        success: function (success) {
            if(success.msgState == 200){
                areaTable.api().ajax.reload();
                informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功！");
            }else{
                informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
            }
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}