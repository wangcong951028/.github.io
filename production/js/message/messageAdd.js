var chk_value =[];//选中的
$(function () {
   init();
});

function init() {
    var msg = {};
    msg.appName="user_userPublishMsgTagList";
    serverFromJSONData(msg,true).then(function (success) {
        var html='';
        var data = success.data;

        for(var i=0;i<data.length;i++){
            var bean = data[i];
            html += "<div class='checkbox'>" +
            "        <label>" +
            "         <input type='checkbox' class='flat' name='tagCheck' value='"+bean.tagID+"'> " +bean.tagName+
            "        </label>" +
            "    </div>";
        }

        $("#tagNames").html(html);
        //console.log(success.data)
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function setChk() {
    chk_value =[];
    $('input[name="tagCheck"]:checked').each(function(){
        chk_value.push($(this).val());
    });

}
/**发布消息*/
function publicMessage() {
    var titleAdd = $("#title").val();
    var infoAdd= $("#editor-one").text();
    if(titleAdd == null || titleAdd.length ==0){
        alert('公告标题不能为空');
        return;
    }
    if(infoAdd == null || infoAdd.length == 0){
        alert('公告内容不能为空');
        return;
    }
    if(chk_value.length==0){
        alert('请选择群组');
        return;
    }
    //alert(infoAdd)
    var msgteam = {};
    msgteam.theme=titleAdd;
    msgteam.content=infoAdd;
    msgteam.tagIDList=chk_value;
    var msg = {};
    msg.messageInfo=msgteam;
    msg.appName="message_publishMessage";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            alert("发布公告成功");
            window.location.reload();//刷新当前页面
        }else{
            alert("发布公告失败，原因："+success.msg)
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };

}