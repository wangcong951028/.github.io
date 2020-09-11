var static_beginDate;//开始时间
var static_endDate;//结束时间
var static_title;//标题
var areaTable;

var chk_value =[];//选中的
$(function () {
    init();//初始化表单
    //init1();
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
                data.appName="timetableInfo_field";
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
                    "targets": 3,
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

function showFieldDiv(){
    var msg = {};
    msg.name=name;
    msg.maxPeople=maxPeople;
    var msg = {};
    msg.appName="message_publishMessage";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
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
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加失败，原因："+success.msg)
        }
        refresh();
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function updateFieldDiv(){

}

function delFieldDiv(){

}

/**新增场地*/
function addField() {
    var name = $("#name").val();
    var maxPeople= $("#maxPeople").val();
    if(name == null || name.length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('名称不能为空');
        return;
    }
    if(maxPeople == null || maxPeople.length == 0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('最大人数不能为空');
        return;
    }
    var msg = {};
    msg.name=name;
    msg.maxPeople=maxPeople;
    msg.appName="timetableInfo_fieldAdd";
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

function showUpdate(){

}

/**重置模态框内容*/
function reSet() {
    chk_value=[];
    $("#name").val("");
    $("#maxPeople").html("");
}
//-----------------------------以下是公共方法------------------------

/**刷新表单*/
function  refresh() {
    areaTable.api().ajax.reload();
}








