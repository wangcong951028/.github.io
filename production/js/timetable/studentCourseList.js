var areaTable;

var chk_value =[];//选中的
$(function () {
    init();//初始化表单
    initElective();//初始化选课详情
});


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
                data.appName="timetableInfo_studentCourse";
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
            },
            "columnDefs": [
                {
                    "targets": 4,
                    render: function (data, type, full, meta) {
                        return "<a class='btn btn-info btn-xs' id='showField' onclick='showFieldDiv("+full.userID+")' data-toggle='myModals'><i class='fa fa-pencil'></i>详情</a>" +
                            "<a class='btn btn-danger btn-xs' id='updateField' onclick='updateFieldDiv("+full.userID+","+full.identity+")' data-toggle='myModals'><i class='fa fa-trash-o'></i>编辑</a>"+
                            "<a class='btn btn-danger btn-xs' id='delField' onclick='delFieldDiv("+full.userID+","+full.identity+")'><i class='fa fa-trash-o'></i>删除</a>";
                    }
                }
            ]
        }
    });

}


function initElective(){
// 2、接口请求参数组装
    var msg = {};
    msg.start=0;
    msg.length=999999999;
    msg.appName="timetableInfo_elective";

    var jsonStr = buildRequestParam(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
            if(success.msgState == 200){
                var electiveList = success.data.data;
                var html = '';
                $.each(electiveList, function (index, course) {
                    //获取课程信息，并且按照id去重
                    html += '<span><input type="checkbox" name="courseId" value="'+course+'"  required="required" >'+course+'</span>';
                    if(index == 5){
                        html+='</br>';
                    }
                })
                $("#course").html(html);
            }
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}


/**新增场地*/
function addStudentCourse() {

    var checkedCourse = $("input:checkbox[name=courseId]:checked"); //通过Jquery获取指定name的选中checkbox
    if(checkedCourse.length <=0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('必须选');
        return;
    }
    var electiveId = '';
    var elective = '';
    $.each(checkedCourse,function (key,course) {   //循环遍历获取到的checkboxs
       /* if ($(course).val() != ""){                  //当前checkbox的value不为空时执行以下操作
            electiveId+=$(course).val()+',';
        }*/
        if ($(course).parent().text() != ""){                  //当前checkbox的value不为空时执行以下操作
            elective+=$(course).parent().text()+',';
        }
    })
    //electiveId = electiveId.substr(0, electiveId.length-1);
    elective = elective.substr(0, elective.length-1);
    var msg = {};
   // msg.electiveId=electiveId;
    msg.elective=elective;
    msg.appName="timetableInfo_studentCourseAdd";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功");
            $('#myModals').modal('hide');//关闭窗口
            reSet();//重置
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加失败，原因："+success.msg)
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








