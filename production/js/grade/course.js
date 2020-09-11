var areaTable;
$(function () {
    courseList();
})

/*清理模态框*/
function cleanModal(){
    $("input").val("");
}
/*列表*/
function courseList() {

    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    /*查询参数*/
                    data.appName = "course_findCourse";
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
                        return '<a class="btn btn-info btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="updateCourse(' + full.pk_id + ')"><i class="fa fa-pencil">修改</i></a>';
                        /* +'<a class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="deleteModal(' + full.pk_id + ')"><i class="fa fa-trash-o">删除</i></a>';*/
                    }
                }]
        });
    });
}

/*添加*/
function saveCourse() {
    // 2、接口请求参数组装
    var msg = {};

    msg.c_name = $("#courseName").val();

    msg.appName="course_saveCourse";

    serverFromJSONData(msg,true).then(function (success) {
        var msg = success.msg;
        if(success.msgState == 200){
            $('#myModal').modal('hide');
            cleanModal();
            areaTable.api().ajax.reload();
            $.alert({
                title: '提示信息!',
                content: '添加成功',
                buttons: {
                    "确定": function () {
                    }
                }
            });
        }else{
            $.alert({
                title: '提示信息!',
                content: msg,
                buttons: {
                    "确定": function () {
                    }
                }
            });
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/*删除提示*/
function deleteModal(id){
    $.confirm({
        title: '提示信息',
        content: '是否需要删除该条科目信息？',
        typeAnimated: true,
        buttons: {
            tryAgain: {
                text: '确定',
                btnClass: 'btn-green',
                action: function(){
                    deleteCourse(id);
                }
            },
            "取消": function () {
            }
        }
    });
}

/*删除*/
function deleteCourse(id) {
    // 2、接口请求参数组装
    var msg = {};
    msg.id = id;
    msg.appName="course_deleteCourse";

    serverFromJSONData(msg,true).then(function (success) {
        var msg = success.msg;
        if(success.msgState == 200){
            $.alert({
                title: '提示信息!',
                content: '删除失败',
                buttons: {
                    "确定": function () {
                    }
                }
            });
            areaTable.api().ajax.reload();
        }else{
            $.alert({
                title: '提示信息!',
                content: msg,
                buttons: {
                    "确定": function () {
                    }
                }
            });
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function updateCourse(id){
    // 2、接口请求参数组装
    var msg = {};
    msg.id = id;
    msg.appName="course_findCourseById";

    serverFromJSONData(msg,true).then(function (success) {
        var course = success.data;
        $('#updateModal').modal({
            backdrop:false,//false:模式对话框，就是没有关闭模式对话框后面页面都不能点击。
            keyboard:true,//当按下 esc键时关闭模态框，设置为 false 时则按键无效。默认为true
            show:true
        });
        $("#updateID").val(course.pk_id);
        $("#updateCourseName").val(course.c_name);
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function newCourse(){
    // 2、接口请求参数组装
    var msg = {};
    msg.id = $("#updateID").val();
    msg.c_name = $("#updateCourseName").val();
    msg.appName="course_updateCourse";

    serverFromJSONData(msg,true).then(function (success) {
        var msg = success.msg;
        if(success.msgState == 200){
            $('#updateModal').modal('hide');
            cleanModal();
            areaTable.api().ajax.reload();
            $.alert({
                title: '提示信息!',
                content: '修改成功',
                buttons: {
                    "确定": function () {
                    }
                }
            });
        }else{
            $.alert({
                title: '提示信息!',
                content: msg,
                buttons: {
                    "确定": function () {
                    }
                }
            });
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}