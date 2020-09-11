

$(function () {
    questionnaire();
})

/*清理模态框*/
function cleanModal(){
    $("#createBy").val("");
    $("#createTime").val("");
    $("#intro").val("");
    $("#sdate").val("");
    $("#edate").val("");
    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
	treeObj.checkAllNodes(false);
}
/*下拉多选*/
$(document).ready(function() {
    $('#selectDept').multiselect({
        enableClickableOptGroups:true ,
        enableCollapsibleOptGroups:true,
        maxHeight:400,
        buttonWidth: '100%',
        nonSelectedText: '------------------------请选择部门/班级------------------------',
        numberDisplayed: 5,
        nSelectedText: '已选择',
        filterPlaceholder: '请输入部门/班级名称',
        allSelectedText:'全选',
        includeSelectAllOption:true,
        selectAllText: '全选'//全选的checkbox名称

    });
});

var areaTable;
/*列表*/
function questionnaire() {
        //添加额外的参数传给服务器
        areaTable = $('#questionnaireTabl').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    /*查询参数*/
                    data.keyWord = $("#keyword").val();
                    data.appName = "questionnaireInstance_findQuestionnaireInstance";
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
                        if(full.q_State === 1 || full.q_State === 2){
                            return '<div>' +
                                '<button class="btn btn-primary btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="lookInstance(' + full.pk_id + ')"><i class="glyphicon glyphicon-search">预览</i></button>' +
                                '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="updateQuestionnaire(' + full.pk_id + ')"><i class="fa fa-pencil">发布</i></button>' +
                                '<a disabled style="text-decoration:none" class="btn btn-info btn-xs" href="#"  data-key="' + full.pk_id + '" ><i class="fa fa-pencil">设置答题</i></a>' +
                                '<button disabled class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="deleteModal(' + full.pk_id + ')"><i class="fa fa-trash-o">删除</i></button>' +
                                '</div>';
                        }else{
                            return '<div>' +
                                '<button class="btn btn-primary btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="lookInstance(' + full.pk_id + ')"><i class="glyphicon glyphicon-search">预览</i></button>' +
                                '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="updateQuestionnaire(' + full.pk_id + ')"><i class="fa fa-pencil">发布</i></button>' +
                                '<a style="text-decoration:none" class="btn btn-info btn-xs" href="questionBankSave.html?id='+full.pk_id+'"  data-key="' + full.pk_id + '" ><i class="fa fa-pencil">设置答题</i></a>' +
                                '<button class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="deleteModal(' + full.pk_id + ')"><i class="fa fa-trash-o">删除</i></button>' +
                                '</div>';
                        }

                    }
                },
                /*{
                    "targets": 1,
                    "orderable": false,
                    "className": 'select-checkbox',
                    render: function (data, type, full, meta) {
                        return '<input type="checkbox" name="table_records" class="flat" id="checkbox-all-' + full.pk_id + '" value="' + full.pk_id + '" />';
                    }
                },*/
                {
                    "targets": 2,
                    render: function (data, type, full, meta) {
                        if (full.q_State == 2) {
                            return "<span style='color: #46b8da'>已结束</span>";
                        }
                        else if (full.q_State == 1) {
                            return "<span style='color: #4cae4c'>进行中</span>";
                        }
                        else if (full.q_State == 0) {
                            return "<span style='color: #2e6da4'>未发布</span>";
                        }
                    }
                }]
        });
    $("#myButton").click(function () {
        areaTable.api().ajax.reload();
    });
}

/*添加*/
function saveQuestionnaire() {
    // 2、接口请求参数组装
    var msg = {};
    msg.q_CreateBy = $("#createBy").val();
    msg.q_CreateTime = $("#createTime").val();
    msg.q_Sdate = $("#sdate").val();
    msg.q_Edate = $("#edate").val();
    msg.q_Intro = $("#intro").val();
    var state = $("input[type='radio'][name='state']");
    for(var i=0;i<state.length;i++){
        if(state[i].checked){
            msg.q_State = state[i].value;
        }
    };
    msg.appName="questionnaireInstance_saveQuestionnaireInstance";

    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            $('#saveModal').modal('hide');
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

/*修改：先拿到数据*/
function updateQuestionnaire(id) {
    // 2、接口请求参数组装
    var msg = {};
    msg.id = id;
    msg.appName = "questionnaireInstance_findQuestionnaireInstanceById";

    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
        var instance = success.data[0];
        $("#updateID").val(instance.pk_id);
        $("#updateSchoolID").val(instance.fk_SchoolID);
        $("#updateCreateBy").val(instance.q_CreateBy);
        $("#updateCreateTime").val(instance.q_CreateTime);
        $("#updateIntro").val(instance.q_Intro);
        $("#updateSdate").val(instance.q_Sdate);
        $("#updateEdate").val(instance.q_Edate);
        var state = instance.q_State;
        $("#radio3").val(1);
        $("#radio4").val(2);
        if (state === 1) {
            $("input[type='radio'][id='radio3'][value='1']").prop('checked',true);
        }else if (state === 2) {
            $("input[type='radio'][id='radio4'][value='2']").prop('checked',true);
        } else if (state === 0) {
            $("input[type='radio'][id='radio5'][value='0']").prop('checked',true);
        }
        if(state != 2){
            $('#updateModal').modal({
                backdrop: false,//false:模式对话框，就是没有关闭模式对话框后面页面都不能点击。
                keyboard: true,//当按下 esc键时关闭模态框，设置为 false 时则按键无效。默认为true
                show: true
            });
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("该问卷已结束！");
        }
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}
/*修改：添加新数据*/
function newQuestionnaire() {

    // 2、接口请求参数组装
    var msg = {};
    var id = $("#updateID").val();
    msg.pk_id = id;
    msg.fk_SchoolID = $("#updateSchoolID").val();
    msg.q_CreateBy = $("#updateCreateBy").val();
    msg.q_CreateTime = $("#updateCreateTime").val();
    msg.q_Sdate = $("#updateSdate").val();
    msg.q_Edate = $("#updateEdate").val();
    msg.q_Intro = $("#updateIntro").val();
    var state = $("input[type='radio'][name='updateState']");
    for(var i=0;i<state.length;i++){
        if(state[i].checked){
            msg.q_State = state[i].value;
        }
    };
    msg.appName="questionnaireInstance_updateQuestionnaireInstance";

    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            publishQuestionnaire(id);
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("请修改问卷状态！");
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };

}
//-------------------------------------------------------------------------------------------------------------------------------------
$(function(){
    ChangeExampleSelect();
})
function ChangeExampleSelect(index) {
    console.debug(index);
    if(index == undefined){
        index =0;

    }
    deptTypeID = index;
    findDeptNode(index);
}
//----------------------------------------------------------------------------------------------------------------------------------------

/*发布问卷*/
function publishQuestionnaire(id) {
    // 2、接口请求参数组装
    var msg = {};
    msg.qusertionnnaireInstanceId=id;
    var messageType = $("input[type='radio'][name='myDiv']");
    var deptTypeID;
    for(var i=0;i<messageType.length;i++){
        if(messageType[i].checked){
            deptTypeID = messageType[i].value;
        }
    }
    if(deptTypeID == undefined){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择发布对象！");
    }else{
        msg.deptTypeID = deptTypeID;
        msg.info = $("#updateIntro").val();
        var arr = new Array();
        var treeObj=$.fn.zTree.getZTreeObj("treeDemo"),
            nodes=treeObj.getCheckedNodes(true),
            v="";
        for(var i=0;i<nodes.length;i++){
            v+=nodes[i].name + ",";
            arr[i] = nodes[i].id;
        }
        msg.deptId = arr;
        msg.appName="respondents_saveRespondents";
        $('#pubishButton').attr({"disabled":"disabled"});
        $('#pubishMessage').modal('show');
        serverFromJSONData(msg,true).then(function (success) {
            if(success.msgState == 200){
                areaTable.api().ajax.reload();
                $('#updateModal').modal('hide');
                cleanModal();
                informationAlert_OnlyConfirmButton_NOT_REFRESH("发布成功！");
            }else{
                informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
            }
            $('#pubishButton').removeAttr("disabled");
            $('#pubishMessage').modal('hide');
        }),function (error) {
            console.log("访问服务器发生错误，请稍后再试!",error);
        };
    }
}
/*获取部门列表*/
function findDeptNode(index) {
    // 2、接口请求参数组装
    var msg = {};
    msg.deptTypeID = 0;
    msg.appName="respondents_findDeptNode";
    serverFromJSONData(msg,true).then(function (success) {
        var node = success.data;
        var zTreeObj;
        var setting = {
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            }
        };
        $(document).ready(function(){
            zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, node);
        });
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/*删除提示*/
function deleteModal(id){
    informationAlert_confirmAndCancelButton("deleteInstance("+id+")","是否要删除该问卷？");
}

/*删除*/
function deleteInstance(id) {

    // 2、接口请求参数组装
    var msg = {};
    msg.id = id;
    msg.appName="questionnaireInstance_deleteQuestionnaireInstance";

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

/*问卷预览*/
function lookInstance(id) {
    // 2、接口请求参数组装
    var msg = {};
    msg.id = id;
    msg.appName="questionnaireInstance_findQuestionnaireInstanceById";

    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
        var bank = success.data;
        var html = '';
        var a = 1;
        for (var i = 0; i < bank.length; i++) {
            var data = bank[i].questionBankData;
            for (var j = 0; j < data.length; j++) {
                $("#bankTime").html('<div style="margin-left:20px;text-align: left;word-wrap: break-word;width: 100%;text-indent: 2em"><h4>'+bank[i].q_Intro+'</h4></div>' +
                                     '<hr/>' +
                                     '<div  style="float: left;margin-left:10px"><h4>开始时间:'+bank[i].q_Sdate+'</h4></div>' +
                                     '<div  style="float: left;margin-left:30px"><h4>结束时间:'+bank[i].q_Edate+'</h4></div>');
                var items = data[j].itemData;
                html += '<br/>' +
                    '<label style="width: 100%;margin-left:30px">' +
                    '&nbsp;&nbsp; ' + data[j].q_title + '' +
                    '</label>';

                for (var k = 0; k < items.length; k++) {
                    if(items[k].q_type == 1 ){
                        html += '<br/>' +
                            '<label style="width: 100%;margin-left:60px">' +
                            '<input type="checkbox" value="" style="display: inherit" disabled="disabled">&nbsp;' + items[k].q_info + '' +
                            '</label>';
                    }else{
                        html += '<br/>' +
                            '<label style="width: 100%;margin-left:60px">' +
                            '<input type="radio" value="" style="display: inherit" disabled="disabled">&nbsp;' + items[k].q_info + '' +
                            '</label>';
                    }
                }
                a++;
            }
        }
        $("#lockBank").html(html);
        $('#lockModal').modal({
            backdrop: false,//false:模式对话框，就是没有关闭模式对话框后面页面都不能点击。
            keyboard: true,//当按下 esc键时关闭模态框，设置为 false 时则按键无效。默认为true
            show: true
        });
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}



