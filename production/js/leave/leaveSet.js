
$(function () {
    init();

    $("#tags_1_tag").keydown(function(event){
        event=document.all?window.event:event;
        if((event.keyCode || event.which)==13){
            addLeaveTypeName($("#tags_1_tag").val());
        }
    });

});


function deleteLeaveType(typeName) {
    var msg = {};
    msg.appName="leave_deleteLeaveType";
    msg.leaveTypeName=typeName;
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){

        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("查询请假类型失败，原因："+success.msg);
            window.location.reload();
        }

    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/**初始化查询*/
function init() {
    var msg = {};
    msg.appName="leave_listByLeaveType";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            var values="";
            var list = success.data;
            for(var i=0;i<list.length;i++){
                var type = list[i];
                $('#tags_1').addTag(type.typeName);
            }

        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("查询请假类型失败，原因："+success.msg)
        }

    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}
/**新增请假类型*/
function addLeaveTypeName(name) {

    var msg = {};
    msg.appName="leave_addLeaveType";
    msg.leaveTypeName=name;
    msg.studentAndTeacher=0;
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState!=200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("新增请假类型失败，原因："+success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}