var static_beginDate;//开始时间
var static_endDate;//结束时间
var static_title;//标题
var areaTable;

$(function () {
    init();//初始
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
                data.appName="timetableInfo_course";
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
/**发布消息*/
function addCourse() {
    var name = $("#name").val();
    if(name == null || name.length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('名称不能为空');
        return;
    }


    var msg = {};
    msg.name=name;
    msg.appName="timetableInfo_courseAdd";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("新增课程成功");
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
    $("#name").val("");
}
//-----------------------------以下是公共方法------------------------

/**刷新表单*/
function  refresh() {
    areaTable.api().ajax.reload();
}








