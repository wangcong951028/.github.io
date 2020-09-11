/**
 * Created by THD on 2017-07-26.
 */
var newsType=0;
var areaTable;
$(function () {
    initWeixinInfoList();
    initAddOrUpdateInfo();
    initSchool();
});


/**
 * 查询新闻列表
 */
function initWeixinInfoList() {
    areaTable = $('#datatable').dataTable({
        "ajax": {
            "url": serverBaseUrl,
            "data": function (data) {
                //添加额外的参数传给服务器
                data.appName="weixininfo_list";
                data.newsTypeID=newsType;
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
                var token = "457513700_eN2akp6Wk9IFIY2QmYRov87JzNGckJLd092ZlX2Mi7xQmJauV5aSmtIFz9Pdl5Vhm7aSmNIFIZaSnpia0JhWnXydlp7NnZ61jMihj3guj5GYIdPdlpROip1dmXIdOdIxzs7d092Wm6RGj5rdOc7TIZ1QnZaTmtIFIc71zcIHOsrMzcAJIdPdkZaclLGhkprdOd0YcoQaTI_buoPd092Nmp6TsZ6SmtIFIulkuelsctITIY2Qk5rdOc7TIYycl5CQk7a7Icox092MmXgdOc7TIYVMmX22R9IFztPdiXyajbGhkprdOd2NkJmLl92C";
                xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                xhr.setRequestHeader("token", static_token);
            }
        }
        ,
        "columnDefs": [
            {
                "targets": -1,
                render: function (data, type, info, meta) {
                var html = "<button type='reset' class='btn btn-primary'  style='float: right' onclick='delInfo(&quot;"+ info.id + "&quot;)'>删除</button>" +
                    "<button type='button' class='btn btn-primary' style='float: right' data-toggle='modal' data-target='#myModals2' onclick='initUpdateInfo(&quot;"+ info.id + "&quot;)'>修改</button>" +
                    "<button type='button' class='btn btn-success' style='float: right' data-toggle='modal' onclick='showInfo(&quot;"+ info.id+ "&quot;)' data-target='#myModals2'>查看</button>"
                    return html;
                }

            }]
    });
}

function cleanFrom() {
    $("#id").val('');
    $("#select_schoolList").val('');
    $("#appID").val('');
    $("#appSecret").val('');
}

function initSchool(){
    var msg = {};
    /** 获取学校列表 **/
    msg.appName = "login_schoollist";
    serverFromJSONData(msg,false).then(function (response) {
        var schoolist = response.data;
        if(schoolist != null && schoolist.length != 0){
            $.each(schoolist,function (index,school) {
                $("#select_schoolList").append("<option value='"+school.schoolID+"'>"+school.schoolName+"</option>");
            });
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
    };
}

/**
 * 初始化点击事件
 */
function initAddOrUpdateInfo(){
    $("#addInfo").click(function () {
        addOrUpdateInfo();
    })
}

/**
 * 新增或修改执行方法
 */
function addOrUpdateInfo() {

    if ($("#select_schoolList").val() === undefined) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择学校!");
        return;
    }

    if($("#appID").val() == '' || $("#appID").val() === undefined || $("#appID").val().length > 255){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("appID必须在255个字符内!");
        return;
    }

    if($("#appSecret").val() == '' || $("#appSecret").val() === undefined || $("#appSecret").val().length > 255){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("appSecret必须在255个字符内!");
        return;
    }

    var msg = {};

    msg.appName="weixininfo_addOrUpdate";
    msg.id=$("#id").val();
    msg.schoolId=$("#select_schoolList").val();
    msg.appID=$("#appID").val();
    msg.appSecret=$("#appSecret").val();
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
            refresh();
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}

/**
 * 获取某个学校的微信配置信息
 * @param id
 * @returns {*}
 */
function getInfo(id){
    var info;
    var msg = {};
    msg.appName = "weixininfo_getInfo";
    msg.id = id;
    // 4、对整个参数进行加密
    var jsonStr = buildRequestParam(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
            if(success.msgState == 200){
                info = success.data;
            }else{
                informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
            }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
    return info;
}

/*初始化表单数据*/
function initUpdateInfo(id) {
    $("#select_schoolList").attr("disabled",false);
    $("#appID").attr("disabled",false);
    $("#appSecret").attr("disabled",false);
    $("#addInfo").show();
    $("#closeInfo").hide();
    var info = getInfo(id);
    if(info == null || info === undefined){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("获取微信配置数据失败！");
        return;
    }
    $("#id").val(info.id);
    $("#select_schoolList").val(info.fk_schoolId);
    $("#appID").val(info.appID);
    $("#appSecret").val(info.appSecret);
}

/**
 * 显示查看详情数据，并把表单设置为disabled
 * @param id
 */
function showInfo(id) {
    initUpdateInfo(id);
    $("#select_schoolList").attr("disabled","disabled");
    $("#appID").attr("disabled","disabled");
    $("#appSecret").attr("disabled","disabled");
    $("#addInfo").hide();
    $("#closeInfo").show();
}


/**根据id删除微信配置*/
function delInfo(id) {
    informationAlert_confirmAndCancelButton("deleteWeixinInfo("+id+")","是否确认删除");
}

/**
 * 执行删除
 * @param id
 */
function deleteWeixinInfo(id) {
    var msg = {};

    msg.appName="weixininfo_delete";
    msg.id=id;
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功");
            refresh();
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除失败，原因："+success.msg);
        }
        refresh();
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}




//-----------------------------以下是公共方法------------------------
/**刷新表单*/
function  refresh() {
    areaTable.api().ajax.reload();
}