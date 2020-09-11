var static_beginDate;//开始时间
var static_endDate;//结束时间
var static_title;//标题
var areaTable;

var chk_value =[];//选中的
$(function () {
    init();//初始化表单
    init1();
});


/**选择开始时间和结束时间*/
$("#submitFind").click(function () {
    var reDateTime = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/;


    if(compareDate($("#beginTime").val(), $("#endTime").val())){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("结束时间必须大于开始时间");
        return;
    }

    static_beginDate = $("#beginTime").val();
    static_endDate = $("#endTime").val();
    static_title = $("#title").val();
    refresh();
})

//比较两个日期大小
function compareDate(d1,d2){
    return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
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
                data.appName="message_messageList";
                data.theme=static_title;

                data.beginDate=static_beginDate;
                data.endDate=static_endDate;


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
        },
        "columnDefs": [
            {
                "targets": 3,
                render: function (data, type, full, meta) {

                    return formatDateTime(full.createTime);

                }
            },
            {
                "targets": 1,
                render: function (data, type, full, meta) {
					var confShow;
                	if(full.content.length>6){
                		var mi=full.content;
                		confShow=mi.substring(0,6);
                		confShow+="<span style='color:blue;'>......</span>"
                    	return confShow;
                	}else{
                		return full.content;
                	}
                    return formatDateTime(full.createTime);

                }
            },
        	{
                "targets": -2,
                render: function (data, type, full, meta) {
                	var confShow;
                	if(full.content.length>22){
                		var mi=full.content;
                		confShow=mi.substring(0,22);
                		confShow+="<span style='color:red;'>......</span>"
                    	return confShow;
                	}else{
                		return full.content;
                	}

                }
            },
        	{
                "targets": -1,
                render: function (data, type, full, meta) {
                    return  '<button class="btn btn-primary btn-xs" href="#;" data-target="findModalShow"  onclick="lookwork(' + full.sendNo + ')"><i class="glyphicon glyphicon-search">查看</i></button>'
                    +'<button class="btn btn-danger btn-xs" href="#;" data-target="findModalShow"  onclick="deleteMessageConfir(' + full.sendNo + ')"><i class="fa fa-trash-o">删除</i></button>';

                }
            }]
    });

}

function formatDateTime(inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
};


function init1() {
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
    $("#myModals2").modal("hide");
    chk_value =[];
    $('input[name="tagCheck"]:checked').each(function(){
        chk_value.push($(this).val());
    });

}
/**发布消息*/
function publicMessage() {
    var titleAdd = $("#title1").val();
    var infoAdd= $("#editor-one").text();
    if(titleAdd == null || titleAdd.length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('公告标题不能为空');
        return;
    }
    if(infoAdd == null || infoAdd.length == 0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('公告内容不能为空');
        return;
    }

    chk_value =[];
    $('input[name="tagCheck"]:checked').each(function(){//选中的群组
        chk_value.push($(this).val());
    });

    if(chk_value.length==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('请选择群组');
        return;
    }



    var msgteam = {};
    msgteam.theme=titleAdd;
    msgteam.content=infoAdd;
    msgteam.tagIDList=chk_value;
    var msg = {};
    msg.messageInfo=msgteam;
    msg.appName="message_publishMessage";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("发布公告成功");
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
    chk_value=[];
    $("#title1").val("");
    $("#editor-one").html("");
    $("[name='tagCheck']").removeAttr("checked");
}
//-----------------------------以下是公共方法------------------------

/**刷新表单*/
function  refresh() {
    areaTable.api().ajax.reload();
}

//进行单条查看
function lookwork(messageIdFind){
	var msg = {};
    msg.messageId=messageIdFind;
    msg.appName="message_messageFindById";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
        	var mi=success.data;
        	$("#themShow").val(mi.theme);
        	$("#sendShow").val(mi.sendName);
        	$("#createTimeShow").val(formatDateTime(mi.createTime));
        	$("#contentShow").val(mi.content);
            $('#findModalShow').modal({
                show:true
            });
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("获取公告失败，原因："+success.msg)
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

//进行删除操作
function deleteMessageConfir(deleteId){
	informationAlert_confirmAndCancelButton("deleteMessage("+deleteId+")","你确定删除该条信息？")
}

function deleteMessage(deleteId){
	var msg = {};
	var mi=new Array();
	mi.push(deleteId);
    msg.sendNo=mi;
    msg.appName="message_delMessage";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
        	informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功!");
        	//进行表格刷新
        	refresh();
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除失败"+success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

