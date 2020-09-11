var static_beginDate;//开始时间
var static_endDate;//结束时间
var static_title;//标题
var areaTable;




$(function () {
    init();//初始化表单
    initCourse();
    initTeacher();
    initField();
});


function initCourse() {
    // 2、接口请求参数组装
    var msg = {};
    msg.start=0;
    msg.length=999999999;
    msg.appName="timetableInfo_course";

    var jsonStr = buildRequestParam(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
            if(success.msgState == 200){
                var courseList = success.data.data;
                var html = '';
                $.each(courseList, function (index, course) {
                    html += '<option value='+course.id+'>'+course.name+'</option>';
                })
                $("#courseId").html(html);
            }
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}


function initTeacher() {

    // 2、接口请求参数组装
    var msg = {};
    msg.start=0;
    msg.length=999999999;
    msg.userType=1;
    msg.appName="user_listUserData";

    var jsonStr = buildRequestParam(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
            if(success.msgState == 200){
                var teacherList = success.data.data;
                var html = '';
                $.each(teacherList, function (index, teacher) {
                    html += '<option value='+teacher.userID+'>'+teacher.realName+'</option>';
                })
                $("#teacherId").html(html);
            }
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

function initField() {
    // 2、接口请求参数组装
    var msg = {};
    msg.start=0;
    msg.length=999999999;
    msg.appName="timetableInfo_field";

    var jsonStr = buildRequestParam(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
            if(success.msgState == 200){
                var fieldList = success.data.data;
                var html = '';
                $.each(fieldList, function (index, field) {
                    html += '<option value='+field.id+'>'+field.name+'</option>';
                })
                $("#fieldId").html(html);
            }
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/**
 * 初始化列表
 */
function init() {
    //添加额外的参数传给服务器
    areaTable = $('#datatable').dataTable({
        "ajax": {
            "url": serverBaseUrl,
            "data": function (data) {
                //添加额外的参数传给服务器
                data.appName="timetableInfo_elective";
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
    });

}
/**增加必修课计划*/
function addElective() {
    var courseId = $("#courseId").val();
    var courseCount = $("#courseCount").val();
    var teacherId = $("#teacherId").val();
    var fieldId = $("#fieldId").val();
    var times = $("#times").val();

    if(courseId == null || courseId.length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('课程必选');
        return;
    }
    if(courseCount == null || courseCount.length == 0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('周课数不能为空');
        return;
    }
    if(teacherId == null || teacherId.length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('授课教师必选');
        return;
    }
    if(fieldId == null || fieldId.length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('场地必选');
        return;
    }
    if(times == null || times.length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('班级数必选');
        return;
    }



    var msg = {};
    msg.courseId=courseId;
    msg.courseName = $("#courseId").find("option:selected").text();
    msg.courseCount=courseCount;
    msg.teacherId=teacherId;
    msg.teacherName= $("#teacherId").find("option:selected").text();
    msg.fieldId=fieldId;
    msg.fieldName= $("#fieldId").find("option:selected").text();
    msg.times = times;

    msg.appName="timetableInfo_electiveAdd";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功");
            $('#myModals').modal('hide');//关闭窗口
            reSet();//重置
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("发布公告失败，原因："+success.msg)
        }
        refresh();
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };

}
/**重置模态框内容*/
function reSet() {
}
//-----------------------------以下是公共方法------------------------

/**刷新表单*/
function  refresh() {
    areaTable.api().ajax.reload();
}








