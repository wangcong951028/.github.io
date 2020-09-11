$(function () {
    curriculum();
    findDeptNode();
    findTerm();
    /*隐藏分页*/
    var div =document.getElementsByClassName('col-sm-12 text-center');
    div[0].style.display = "none";

    if(window.innerHeight){
        var windowHeight = window.innerHeight;
        var treeHeight =document.getElementsByClassName('form-group');
        treeHeight[0].style.height = ""+windowHeight+"px";
    }


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
var deptid;
var deptName;
var areaTable;

/*清理模态框*/
function cleanModal(){
    document.getElementById("uploadForm").reset();
    document.getElementById("uploadForm2").reset();
}

/*列表*/
function curriculum() {
    //添加额外的参数传给服务器
    areaTable = $('#datatable').dataTable({
        "ajax": {
            "url": serverBaseUrl,
            "data": function (data) {
                data.deptid = deptid;
                data.termid = $("#termSelect").val();
                data.appName = "curriculum_findCurriculumSchedule";

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
        }
    });
    $("#myButton").click(function () {
        areaTable.api().ajax.reload();
    });
}

/*获取部门列表*/
function findDeptNode() {
    // 2、接口请求参数组装
    var msg = {};
    msg.deptTypeID = 1;
    msg.appName="respondents_findDeptNode";
    serverFromJSONData(msg,true).then(function (success) {
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

    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function zTreeOnClick(event, treeId, treeNode) {
    deptid = treeNode.id;
    deptName = treeNode.name;
    areaTable.api().ajax.reload();
}

/*查看学期信息*/
function findTerm(){
    // 1、公共参数组装
    var param = {};
    param.appKey = "aGFuZHlDYW1wdXM=";
    param.appSecret = "1234567890abcedefgh";
    var time = new Date().getTime();
    param.time = time;
    // 2、接口请求参数组装
    var msg = {};

    msg.appName = "term_findTerm";

    /*msg.index = 1;*/
    var paramJsonMsg = JSON.stringify(msg);
    param.param = paramJsonMsg;
    // 3、生成签名
    var temp = 'appKey=aGFuZHlDYW1wdXM=&appSecret=1234567890abcedefgh&param=' + paramJsonMsg + '&time=' + time;
    param.sign = hex_md5(temp);
    // 4、对整个参数进行加密
    var jsonStr = JSON.stringify(param);

    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        success: function (success) {
            var html = '<option value="-1">----------  请选择学期  ----------</option>';
            var term = success.data.data;
            for (var i = 0; i < term.length; i++) {
                html += "<option value='" + term[i].pk_ID + "'>" + term[i].t_term + "</option>";
            }
            $("#termSelect").html(html);
            $("#termSelect1").html(html);
            $("#termSelect12").html(html);
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*导入提示*/
function updateModal(){
    $('#uploadModel').modal({
        backdrop:false,//false:模式对话框，就是没有关闭模式对话框后面页面都不能点击。
        keyboard:true,//当按下 esc键时关闭模态框，设置为 false 时则按键无效。默认为true
        show:true
    });
}

function uploadCurriculum(){
    var msg = {};
    var array = new Array();
    for(var i = 0;i<jsonObj.length;i++){
        var items = new Object();
        items.c_name = jsonObj[i].课程名称;
        items.c_time = jsonObj[i].时间;
        items.c_week = jsonObj[i].星期;
        items.className = jsonObj[i].班级;
        array.push(items);
    }
    msg.items = array;
    msg.deptid = deptid;
    msg.termid = $("#termSelect1").val();
    if(array.length == 0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择需要导入的课程表！");
    }else{
        msg.appName="curriculum_saveCurriculumSchedule";
        $("#uploadButton1").attr({"disabled":"disabled"});

        serverFromJSONData(msg,true).then(function (success) {
            if(success.msgState === 500){
                informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
            }else{
                var jsonDome = success.data;
                if(jsonDome.length === 0){
                    informationAlert_OnlyConfirmButton_NOT_REFRESH("导入成功！");
                }else {
                   var jsonDome1 = [];
                    for (var i = 0; i < jsonDome.length; i++) {
                        jsonDome1[i] = {
                            "课程名称": jsonDome[i].c_name,
                            "时间": jsonDome[i].c_time,
                            "星期": jsonDome[i].c_week,
                            "班级": jsonDome[i].className,
                            "备注": jsonDome[i].remark
                        };
                    }
                    downloadExl(jsonDome1,"hf");
                    $(".modal-body").html("<h4>有错误数据，请重新导入错误数据！请查看错误信息！<h4>");
                    informationAlert_OnlyConfirmButton_NOT_REFRESH("有错误数据，请重新导入错误数据！请查看错误信息！");
                }
            }
            jsonObj = null;
            $("#uploadButton1").removeAttr("disabled");
            $('#uploadModel').modal('hide');
            cleanModal();
            areaTable.api().ajax.reload();//刷新成绩列表
        }),function (error) {
            console.log("访问服务器发生错误，请稍后再试!",error);
        };
    }
}

/*重新导入提示*/
function newUpload(){
    if(deptName == undefined){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择班级！");
    }else{
        informationAlert_confirmAndCancelButton("updateModal2()","重新导入<span style='color: red;font-size: initial'>"+deptName+"</span>课程会覆盖之前的课程，是否导入!");
    }
}

/*重新导入提示*/
function updateModal2(){
    $('#uploadModel2').modal({
        backdrop:false,//false:模式对话框，就是没有关闭模式对话框后面页面都不能点击。
        keyboard:true,//当按下 esc键时关闭模态框，设置为 false 时则按键无效。默认为true
        show:true
    });
}

function uploadCurriculum2(){

    var msg = {};
    var array = new Array();
    for(var i = 0;i<jsonObj.length;i++){
        var items = new Object();
        items.c_name = jsonObj[i].课程名称;
        items.c_time = jsonObj[i].时间;
        items.c_week = jsonObj[i].星期;
        array.push(items);
    }
    msg.items = array;
    msg.classid = deptid;
    msg.termid = $("#termSelect12").val();
    if(array.length == 0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择需要导入的课程表！");
    }else{
        msg.appName="curriculum_updateCurriculumSchedule";
        $("#uploadButton12").attr({"disabled":"disabled"});

        serverFromJSONData(msg,true).then(function (success) {
            if(success.msgState === 500){
                informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
            }else{
                var jsonDome = success.data;
                if(jsonDome.length === 0){
                    informationAlert_OnlyConfirmButton_NOT_REFRESH("导入成功！");
                }else {
                    var jsonDome1 = [];
                    for (var i = 0; i < jsonDome.length; i++) {
                        jsonDome1[i] = {
                            "课程名称": jsonDome[i].c_name,
                            "时间": jsonDome[i].c_time,
                            "星期": jsonDome[i].c_week,
                            "班级": jsonDome[i].className,
                            "备注": jsonDome[i].remark
                        };
                    }
                    downloadExl(jsonDome1,"hf");
                    $(".modal-body").html("<h4>有错误数据，请重新导入错误数据！请查看错误信息！<h4>");
                    informationAlert_OnlyConfirmButton_NOT_REFRESH("有错误数据，请重新导入错误数据！请查看错误信息！");
                }
            }
            jsonObj = null;
            $("#uploadButton12").removeAttr("disabled");
            $('#uploadModel2').modal('hide');
            cleanModal();
            areaTable.api().ajax.reload();//刷新成绩列表
        }),function (error) {
            console.log("访问服务器发生错误，请稍后再试!",error);
        };
    }
}

/*导出模板*/
function excelTemplet(){
    var templetJSON = [
        {
            "课程名称":"语文",
            "时间":"08:00",
            "星期":"星期一",
            "班级":"小2017级3班",
        }
    ];
    downloadExl(templetJSON,"templet");
}

/*获取浏览器高度*/
//var windowHeight;
function getWidth() {
    console.debug("---");
    if(window.innerHeight){
        var windowHeight = window.innerHeight;
        console.debug(windowHeight);
    }else if(document.body && document.body.clientHeight){
       var  windowHeight1 = document.body.clientHeight;
        console.debug(windowHeight1);
    }
}