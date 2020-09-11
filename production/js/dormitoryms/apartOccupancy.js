var areaTable;
var listDorm;
var proejctInfo;
var classInfo;
var organizationCode;

$(function () {
    init();
    findAllDorm();
    
    $("#myButton").click(function () {
        init();
    });
    
    $("#dormRegion").change(function(){
    	findDormBuilding();
    });
    
    $("#dormBuiding").change(function(){
    	findFloor();
    });
    
    $("#floorNum").change(function(){
    	findDormNum();
    });
    
    //导出excel按钮
    $("#export").click(function () {
        $("#table").table2excel({
            // 不被导出的表格行的CSS class类
            exclude: ".noExl",
            // 导出的Excel文档的名称，（没看到作用）
            name: "Excel Document Name",
            // Excel文件的名称
            filename: $("#searchTime").val()+"考核日统计"
        });
    });

    //打印按钮
    $("#print").click(function () {
        $("#table").print();
    });
    
});


/**
 * 初始化列表
 */
function init() {
	
	var msg = {};
	
	msg.reginId=$("#dormRegion").val();
	msg.dormBuiding=$("#dormBuiding").val();
	msg.floorId=$("#floorNum").val();
	msg.sex=$("#stuSex").val();
	msg.bedRoomUse=$("#isStake").val();
	msg.dormSelect=$("#dormSelect").val();
	msg.appName="apartOccupancy_findForReport";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState === 200){
        	
        	var html = '<thead style="text-align:center;"><td>房间用途</td>'
                            + '<td>总床位数</td>'
                            + '<td>男生床位数</td>'
                            + '<td>女生床位数</td>'
                            +'<td>总空床位数</td>'
                            +'<td>男生空床位数</td>'
                            +'<td>女生空床位数</td>'
                            + '<td>总空床率</td>'
                            +'<td>入住床位数</td>'
                            +'<td>预分床位数</td></thead>';
        	
        	var node = success.data;
        	for(var i=0;i<node.length;i++){
        		var element=node[i];
	        	html+="<tbody style='text-align:center;'><tr><td>"+element.bedRoomUseName+"</td><td>"+element.totalBed+"</td><td>"+element.totalBedBoy+"</td><td>"+element.totalBedGirl+"</td><td>"+element.totalNoUsing+"</td><td>"+element.totalNoUsingBoy+"</td><td>"+element.totalNoUsingGirl+"</td><td>"+element.notUseEfficiency+"</td><td>"+element.isUsedBed+"</td><td>"+element.totalBedBoy+"</td></tr></tbody>";
        	}
        		
        	$("#table").html(html);
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加或修改失败："+success.msg);
        }
    });
}



//查询所有的寝室
function findAllDorm(){
    var msg = {};
    msg.appName = "amang_findAMangAll";
    // 4、对整个参数进行加密
    var jsonStr = buildRequestParam(msg);

    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
            if(success.msgState === 200){
	        	var html="<option selected='selected' value=''>---- 请选择 -----</option>"
	            	$.each(success.data,function(index,element){
	            		html+="<option value="+element.id+">"+element.apartmentName+"</option>";
	            	})
	            	$("#dormBuiding").html(html);
	        }else{
//	            informationAlert_OnlyConfirmButton_NOT_REFRESH("查询失败："+success.msg);
	        }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}


//进行楼层的查询
function findFloor(){
	var msg = {};
    msg.sttaid=$("#dormBuiding").val();
    msg.appName="floor_findFloorAll";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState === 200){
        	var html="<option selected='selected' value=''>---- 请选择 -----</option>"
            	$.each(success.data,function(index,element){
            		html+="<option value="+element.id+">"+element.name+"</option>";
            	})
            	$("#floorNum").html(html);
        }else{
//          informationAlert_OnlyConfirmButton_NOT_REFRESH("查询失败："+success.msg);
        }
    });
}

//进行宿舍楼的查询
function findDormNum(){
	var msg = {};
    msg.floorid=$("#floorNum").val();
    msg.appName="dor_findDorAll";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState === 200){
        	var html="<option selected='selected' value=''>---- 请选择 -----</option>"
            	$.each(success.data,function(index,element){
            		html+="<option value="+element.id+">"+element.dormNumber+"</option>";
            	})
            	$("#dormSelect").html(html);
        }
    });
}


