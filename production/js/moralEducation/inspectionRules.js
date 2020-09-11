var areaTable;
var projectID;
$(function () {
    rulesList();
    getProjectName();
})
var setting = {
    callback: {
        onClick: zTreeOnClick
    },
    data: {
        simpleData: {
            enable: true
        }
    }
}
/*清理表单*/
function cleanModal(){
    document.getElementById("saveForm").reset();
}
/*列表*/
function rulesList() {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.modelID = projectID;
                    data.keyWords = $("#keyWords").val();
                    /*查询参数*/
                    data.appName = "rules_findInspectionRulesPC";
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
                    "targets": 3,
                    render: function (data, type, full, meta) {
                        if (full.m_scoringway == 1) {
                            return '<span style="color: #42C7DB">加分操作</span>';
                        }
                        else if (full.m_scoringway == 2) {
                            return '<span style="color: #FF0202">减分操作</span>';
                        }
                    }
                },
                {
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
}

/*添加提示*/
function savePrompting() {
    if(projectID == null){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择类别！");
    }else{
        $('#myModal').modal('show');
    }
}
/*添加*/
function saveRules(type){
    var msg = {};
    msg.fk_projectid = projectID
    msg.m_name = $("#mname").val();
    msg.m_classscoring = $("#mclassscoring").val();
    msg.m_individualscoring = $("#mindividualscoring").val();
    msg.m_remark = $("#mremark").val();
    var mscoringway = $("input[type='radio'][name='mscoringway']");
    for(var i=0;i<mscoringway.length;i++){
        if(mscoringway[i].checked){
            msg.m_scoringway = mscoringway[i].value;
        }
    };

    msg.appName="rules_saveInspectionRules";
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
function updateModal(id) {
    var msg = {};
    msg.id = id;
    msg.appName="rules_findInspectionRulesByID";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            var rules = success.data;
            $("#updateID").val(rules.pk_id);
            $("#updatemname").val(rules.m_name);
            $("#updatemclassscoring").val(rules.m_classscoring);
            $("#updatemindividualscoring").val(rules.m_individualscoring);
            $("#updatemremark").val(rules.m_remark);
            if(rules.m_scoringway == 1){
                $("input[type='radio'][id='updatemscoringway1'][value='1']").prop("checked",'checked');
            }else{
                $("input[type='radio'][id='updatemscoringway2'][value='2']").prop("checked",'checked');
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
function updateRules() {
    var msg = {};
    msg.pk_id = $("#updateID").val();
    msg.m_name = $("#updatemname").val();
    msg.m_classscoring = $("#updatemclassscoring").val();
    msg.m_individualscoring = $("#updatemindividualscoring").val();
    msg.m_remark = $("#updatemremark").val();
    var updatemscoringway = $("input[type='radio'][name='updatemscoringway']");
    for(var i=0;i<updatemscoringway.length;i++){
        if(updatemscoringway[i].checked){
            msg.m_scoringway = updatemscoringway[i].value;
        }
    };

    msg.appName="rules_updateInspectionRules";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            $('#updateModal').modal('hide');
            cleanModal();
            areaTable.api().ajax.reload();
            informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功！");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/*删除提示*/
function deleteModal(id) {
    informationAlert_confirmAndCancelButton("deleteRules("+id+")","是否要删除该考核项？");
}
/*删除*/
function deleteRules(id) {
    var msg = {};
    msg.id = id;
    msg.appName="rules_deleteInspectionRules";
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


//------------------------------------------------------------------------------------------------------------------------------
/*获取模块名称和id*/
function getProjectName(){
    var msg = {};
    msg.projectID = getUrlParam('modelID')+"_modelID"
    msg.appName="rules_getZtree";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            var node = success.data;
            var zTreeObj;

            $(document).ready(function(){
                zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, node);
            });
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");

            var nodes = treeObj.getNodes();
            if (nodes.length>0) {
                for(var i=0;i<nodes.length;i++){
                    treeObj.expandNode(nodes[i], true, false, false);
                }
            }
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function zTreeOnClick(event, treeId, treeNode) {
    projectID = treeNode.id;
    areaTable.api().ajax.reload();
}

/*获取URL地址参数*/
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}