/**
 * Created by ricardo on 2017-09-08.
*/

var areaTable;
var schoolID;// 学校
var schoolName = "";// 学校名称
var pageSize = 10;// ，每页显示个数
var pageNo = 1;// 页码
var totalPage = 1;// 总页数


$(function(){

   /*** 1、查询学校使用短信列表 ***/
   querySchoolSmsList();

    /** 2、搜索学校列表 **/
    $("#searchSchoolList").on("click",function(){
        schoolName = $("#schoolName").val();
        areaTable.api().ajax.reload();
    });




})


/**
 * 1、刷新table
 */
function refreshAreaTable(){
    areaTable.api().ajax.reload();
}

/**
 * 2、初始化人员列表
 */
function querySchoolSmsList() {
    //添加额外的参数传给服务器
    areaTable = $('#datatable').dataTable({
        "ajax": {
            "url": serverBaseUrl,
            "data": function (data) {
                data.appName = "sms_getSchoolSmsList";
                data.schoolName = schoolName;
                //添加额外的参数传给服务器
                return buildRequestParam(data);
            },
            "dataSrc": function (json) {
                json.iTotalRecords = json.data.recordsTotal;
                json.recordsFiltered = json.data.recordsTotal;
                json.error = json.data.error;
                json.draw = json.data.draw;
                return json.data.data;
            },
            "beforeSend": function (xhr) {
                xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                xhr.setRequestHeader("token", sessionStorage.token);
            }
        },
        "columnDefs": [
            {
                "targets":3,
                render:function (data,type,full,meta) {
                    var result = "";
                    if(full.enable == 0){
                        result = "<label style='font-weight: bold'>未启用</label>";
                    }else if(full.enable == 1) {
                        result = "<label style='color: green;font-weight: bold'>正常</label>";
                    }else if(full.enable == 2){
                        result = "<label style='color: red;font-weight: bold'>欠费</label>";
                    }else {
                        result = "<label style='font-weight: bold'>未知</label>";
                    }
                    return result;
                }
            },{
                "targets":9,
                render:function (data,type,full,meta) {
                    return "<a class='bbtn btn-info btn-xs' onclick='showModelDiv(\"buy_div\","+full.schoolID+",\""+full.schoolName+"\")'><i class='fa fa-pencil'></i>购买短信</a>" +
                           "<a class='bbtn btn-info btn-xs' onclick='showModelDiv(\"buyRecord_div\","+full.schoolID+",\""+full.schoolName+"\")'><i class='fa fa-pencil'></i>购买记录</a>";
                }
            }
        ]
    });
}

/***
 * 3、弹出模态框
 * @param divID
 */
function showModelDiv(divID,schoolID,schoolName){
    $("#page_schoolID").val(schoolID);
    if (divID == 'buy_div'){
        $("#buyNumber").val("");
        $("#buyNumber-tips").html("");
        $("#buySchoolName").html(schoolName);
    }

    $('#'+divID).modal('show');

    if(divID == 'buyRecord_div'){
        pageNo = 1;
        totalPage = 1;
        $("#jumpPage").val("");
        queryBuySmsRecordList();
    }


}

/***
 * 4、隐藏模态框
 * @param divID
 */
function hideModelDiv(divID){
    $('#'+divID).modal('hide');
    areaTable.api().ajax.reload();
}

/***
 * 5、购买短信数据
 */
function buySms(){
    var buyNumber = $('#buyNumber').val();
    var schoolId = $("#page_schoolID").val();
    if(checkValueIsNull(buyNumber)){
        $('#buyNumber-tips').html('请填写购买数!');
        return;
    }
    if(!checkIsNumber(buyNumber)){
        $('#buyNumber-tips').html('购买数只能填写数字!');
        return;
    }

    if(schoolId == 0 || schoolId == null){
        $('#buySchoolName').html('请选择购买的学校!');
        return;
    }

    var param = {};
    param.appName = "sms_buySmsNumber";
    param.schoolID = schoolId;
    param.buyNumber = buyNumber;
    serverFromJSONData(param,true).then(function (response) {
        if(response.msgState == 200){
            informationAlert_OnlyCancelButton_REFRESH('hideModelDiv(\"buy_div\")','购买成功!');
        }else {
            informationAlert_OnlyConfirmButton_NOT_REFRESH('购买失败！原因：' + response.msg);
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH('访问服务器发生错误！' + error);
    };
}

/***
 *  6、购买记录
 */
function queryBuySmsRecordList() {
    var schoolID = $("#page_schoolID").val();
    if(schoolID == 0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('请选择查询的学校！');
        return;
    }

    var param = {};
    param.appName = "sms_queryBuyRecord";
    param.schoolID = schoolID;
    param.index = pageNo;
    param.indexSize = 5;
    serverFromJSONData(param,true).then(function (response) {
        var result = response.data;
        if(response.msgState == 200){
            totalPage = result.totalPage;
            pageNo = result.page;
            /*** 循环生成数据 ***/
            buildTableTrData('dataGridTableJson',result.list);
            Page({num:totalPage,startnum:pageNo,elem:$('#page'),callback:function(n){pageNo = n;queryBuySmsRecordList();}});
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH('访问服务器发生错误！' + error);
    };

}


