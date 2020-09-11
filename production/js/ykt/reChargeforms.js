var startTime;//充值开始时间
var endTime;//充值结束时间
var xgh;// 学工号
var xm;//姓名
var payStatus = "-1";//支付状态
var yktPayStatus = "-1";//一卡通支付状态
var areaTable;

$(function () {
       
    //打印按钮
    $("#print").click(function () {
    	if(datatable_paginate){
    		
    		$("#datatable_paginate").hide();
    	}
    	if(datatable_info){
    		$("#datatable_info").hide();
    	}
        $("#tables").print();
        if(datatable_paginate){
    		$("#datatable_paginate").show();
    	}
    	if(datatable_info){
    		$("#datatable_info").show();
    	}
    });
    
    // 显示时间
    $('#stime').datetimepicker({
        format: 'YYYY-MM-DD'//设置时间格式
    });
    $('#etime').datetimepicker({
        format: 'YYYY-MM-DD'//设置时间格式
    });
    
   queryUserPayWaterList();
   
   /***搜索按钮点击事件***/
   $('#searchBtn').click(function(){
       startTime = $("#stime").val();
       endTime = $("#etime").val();
       xgh = $("#xgh").val();
       xm = $("#xm").val();
       payStatus = $("#payStatus").val();
       yktPayStatus = $("#yktPayStatus").val();
       
       if(!checkValueIsNull(startTime)){
       	  if(checkValueIsNull(endTime)){
       	  	 informationAlert_OnlyConfirmButton_NOT_REFRESH("充值结束时间栏不能为空!");
       	  	 return;
       	  }else{
       	  	 if(judgeTimeDiff(startTime,endTime) < 0){
       	  	 	informationAlert_OnlyConfirmButton_NOT_REFRESH("充值结束时间不能小于充值开始时间，请重新选择!");
       	  	    return;
       	  	 }else if(judgeTimeDiffDay(startTime,endTime) > 30){
       	  	 	informationAlert_OnlyConfirmButton_NOT_REFRESH("一次只能查询30天的充值记录，请重新选择!");
       	  	    return;
       	  	 }
       	  }
       }else{
       	  if(!checkValueIsNull(endTime)){
       	  	 informationAlert_OnlyConfirmButton_NOT_REFRESH("充值开始时间栏不能为空!");
       	  	 return;
       	  }
       }
       areaTable.api().ajax.reload();
   });
});

function queryUserPayWaterList() {
    //添加额外的参数传给服务器
    areaTable = $('#datatable').dataTable({
        "ajax": {
            "url": serverBaseUrl,
            "data": function (data) {
                data.appName = "ykt_wxRechargeDetail";
                data.startTime = startTime;
                data.endTime = endTime;
                data.xm = xm;
                data.xgh = xgh;
                data.payStatus = payStatus;
                data.yktPayStatus = yktPayStatus;
                return buildRequestParam(data);
            },
            "dataSrc": function (json) {
                json.iTotalRecords = json.data.recordsTotal;
                $('#payTotalNumber').text(json.data.recordsTotal+"/笔");
                $('#payTotalAmount').text(json.data.extra + "/元");
                json.recordsFiltered = json.data.recordsTotal;
                json.error = json.data.error;
                json.draw = json.data.draw;
                return json.data.data;
            },
            "beforeSend": function (xhr) {
                xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                xhr.setRequestHeader("token", sessionStorage.token);
            }
        }
    });
}


/***
 * 下载充值流水报表
 */
function downPayWaterDetail(){
	var param = {};
    param.appName = "ykt_downloadRechargeDetail";
    param.startTime = startTime;
    param.endTime = endTime;
    param.xm = xm;
    param.xgh = xgh;
    param.payStatus = payStatus;
    param.yktPayStatus = yktPayStatus;
    
    serverFromJSONData(param,true).then(function (response) {
      var resultData = response.data;
      if(resultData != null && resultData.length > 0){
      	    var userJson = new Array();
            for (var i = 0; i < resultData.length; i++) {
                 userJson[i] = {
					"充值流水号": resultData[i].outTradeNo,
					"充值人姓名": resultData[i].payUserRealName,
					"充值人学工号": resultData[i].payXgh,
					"充值金额（元）": resultData[i].payAmount,
					"被充值人姓名": resultData[i].receiveUserRealName,
					"被充值人学工号": resultData[i].receiveXgh,
					"充值状态": resultData[i].payStatus,
					"一卡通充值状态": resultData[i].yktPayStatus,
					"交易时间": resultData[i].tradeTime
                   };
                }
            downloadExl_onlyJson(userJson);
      }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
    };
}






