var proArray = new Array();//把项目id顺序存入数组
var timeShow;
var beginDormitoryShow;
var beginNoonShow;
var globalIndex = 1;// 全局序号
var orderNosList;//集合
var endNoonShow;
var detailsShowLate;//迟到列表详情
var detallsShowLeave;//请假列表详情
var areaTable;
    $(function () {
        addRowToTimeList("a");
        findAllgGade();
        
        $("#gradeSelect").change(function(){
        	findTime();
        });
        
        $("#gradeSelectTo").change(function(){
        	findAllClassByGrade();
        });
        
        $("#export").click(function () {
        	//downLoadOrPrint();
            $("#datatable").table2excel({
                // 不被导出的表格行的CSS class类
                exclude: ".noExl",
                // 导出的Excel文档的名称，（没看到作用）
                name: "Excel Document Name",
                // Excel文件的名称
                filename: "宿舍考勤统计"
            });
        });

        //打印按钮
        $("#print").click(function () {
        	//downLoadOrPrint();
        	//隐藏分页栏
        	$("table").css("border-color","black");
	    	$("th").css("border-color","black");
	    	$("td").css("border-color","black");
	    	$("tr").css("border-color","black");
        	if(datatable_paginate){
        		
        		$("#datatable_paginate").hide();
        	}
        	if(datatable_info){
        		$("#datatable_info").hide();
        	}
            $("#miTable").print();
            //显示分页栏
            if(datatable_paginate){
        		$("#datatable_paginate").show();
        	}
        	if(datatable_info){
        		$("#datatable_info").show();
        	}
        	
        	$("table").css("border-color","#DDDDDD");
	    	$("th").css("border-color","#DDDDDD");
	    	$("td").css("border-color","#DDDDDD");
	    	$("tr").css("border-color","#DDDDDD");
        });

        $("#search").click(function () {
        	if($("#beginTime").val()==null||$("#beginTime").val()==""){
            	informationAlert_OnlyConfirmButton_NOT_REFRESH("请填写开始时间!");
            	return;
            }
            if($("#endTime").val()==null||$("#endTime").val()==""){
            	informationAlert_OnlyConfirmButton_NOT_REFRESH("请填写结束时间!");
            	return;
            }
            var beginTimeCom=new Date($("#beginTime").val());
            var endTimeCom=new Date($("#endTime").val());
            if(beginTimeCom>endTimeCom){
            	informationAlert_OnlyConfirmButton_NOT_REFRESH("开始时间不能大于结束时间!");
            	return;
            }
            if($("#gradeSelectTo").val()==null ||$("#gradeSelectTo").val()==''){
            	informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择年级!");
            	return;
            }
            isExsitTime();
            
        	
        	
        	
        	
            
        });	
      })  	

    
function addDormitoryTime(){
	var msg = {};
    msg.appName="ykt_addDormitoryTime";
    //创建集合
    orderNosList = new Array(); 
    //获取所有的时间设置id
    $("#addTime").children().children().each(function(index,element){
	    if($(element).attr("type")=="text"){
	    	var id=$(element).attr("id");
	    	//进行时间插件的设置
	    	var schoolTimeSet=$('#'+id).val();
	    	orderNosList.push(schoolTimeSet);
	    }
    })
    msg.schoolTimeSet=orderNosList;
    
    msg.deptId=$("#gradeSelect").val();
    if(msg.deptId==null || msg.deptId==""){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("年级不能为空!");
    	return;
    }
    
    //添加时间进行时间的大小验证
    if(msg.dormitoryTime<msg.beginDormitoryTime||msg.beginNoon>msg.endNoon){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("开始时间能大于结束时间!");
    	return;
    }
    
    msg.pk_id=$("#updateID").val();
    msg.notComeName=$("#notComeName").val();
    msg.notComeTime=$("#notComeTime").val();
    
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState === 200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加或者修改成功");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加或修改失败："+success.msg);
        }
    });
}

//查询数据库中有没有时间值
function findTime(){
	var msg = {};
	msg.deptId=$("#gradeSelect").val()
    msg.appName="ykt_findTime";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState === 200){
        	
        	if(success.data!=null){
        		
	        	if(success.data.eveningTime!=null&&success.data.afternoonTime!=null&&(beginNoonShow==null||beginDormitoryShow==null)){
	        		addRowToTimeList("a");
	        	}
	        	$("#updateID").val(success.data.pk_id);
	            orderNosList=new Array();
	            $("#addTime").children().children().each(function(index,element){
				    if($(element).attr("type")=="text"){
				    	var id=$(element).attr("id");
				    	//进行时间插件的设置
				    	orderNosList.push(id);
				    }
			    })
	        	if(success.data.eveningTime!=null&&success.data.afternoonTime==null){
	            	var mi =$("div[name=timesSet]").attr("id");
	        		var pt=mi.substring(11,12);
	        		var ppd=cntTimeDivNum('addTime');
	        		if(cntTimeDivNum('addTime')>2){
	        			deleteRowToTimeList(pt,"");
	        		}
	            	$("#"+orderNosList[0]).val(success.data.eveningTime);
	            	$("#"+orderNosList[1]).val(success.data.beginDormitoryTime);
	            	$("#"+orderNosList[2]).val(success.data.dormitoryTime);
	        	}
	        	if(success.data.eveningTime==null&&success.data.afternoonTime!=null){
	        		var mi =$("div[name=timesSet]").attr("id");
	        		var pt=mi.substring(11,12);
	        		var ppd=cntTimeDivNum('addTime');
	        		if(cntTimeDivNum('addTime')>2){
	        			deleteRowToTimeList(pt,"");
	        		}
	        		$("#"+orderNosList[0]).val(success.data.afternoonTime);
	            	$("#"+orderNosList[1]).val(success.data.beginNoon);
	            	$("#"+orderNosList[2]).val(success.data.endNoon);
	        	}
	            if(success.data.eveningTime!=null&&success.data.afternoonTime!=null){
	            	$("#"+orderNosList[3]).val(success.data.eveningTime);
	            	$("#"+orderNosList[4]).val(success.data.beginDormitoryTime);
	            	$("#"+orderNosList[5]).val(success.data.dormitoryTime);
	            	$("#"+orderNosList[0]).val(success.data.afternoonTime);
	            	$("#"+orderNosList[1]).val(success.data.beginNoon);
	            	$("#"+orderNosList[2]).val(success.data.endNoon);
	            }
	            $("#notComeName").val(success.data.notComeName);
	            $("#notComeTime").val(success.data.notComeTime);
	            
	            beginDormitoryShow=success.data.beginDormitoryTime;
	            beginNoonShow=success.data.beginNoon;
	            endNoonShow=success.data.endNoon;
	            timeShow=success.data.dormitoryTime;
        	}else{
        		var mi =$("div[name=timesSet]").attr("id");
        		var pt=mi.substring(11,12);
        		var ppd=cntTimeDivNum('addTime');
        		if(cntTimeDivNum('addTime')>2){
        			deleteRowToTimeList(pt,"");
        		}
        		$("#notComeName").val("");
	            $("#notComeTime").val("");
	            
	            var list=new Array();
	            //统计标签，获取id
	            var inputCount=$("#addTime").children().children();
	            for(var i=0;i<inputCount.length;i++){
	            	if($(inputCount[i]).attr("type")=="text"){
				    	var id=$(inputCount[i]).attr("id");
				    	//进行时间插件的设置
				    	list.push(id);
				    }
	            }
				$("#updateID").val("");
	            $("#"+list[0]).val("");
            	$("#"+list[1]).val("");
            	$("#"+list[2]).val("");
        	}
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("查询失败："+success.msg);
        }
    });
}

function coloseRefresh(){
	$('#myModalsf').modal('hide');
}

//删除时间信息
function deleteRowToTimeList(index,adFlag){
    if(cntTimeDivNum('addTime')<=2){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("考勤时间至少需要一个，请重新再试!");
        return;
    }
    /*** 删除指定id的div ***/
    $("#"+adFlag+"_timeNames_"+index).remove();
}

//增加时间的相关信息
function addRowToTimeList(adFlag){
    if (cntTimeDivNum('addTime')>2){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("考勤时间最多增加至两条，请重新再试!");
        return;
    }else{
        globalIndex ++;
    }
    var timeListStr = "";
    timeListStr += buildTimeDiv('','','',adFlag);
    //$("#addTime").empty();
    $("#addTime").append(timeListStr);
    
    //获取所有的时间设置id
    $("#addTime").children().children().each(function(index,element){
	    if($(element).attr("type")=="text"&&$(element).attr("name")!="setAttandence"){
	    	var id=$(element).attr("id");
	    	//进行时间插件的设置
	    	 $('#'+id).datetimepicker({
	            format: 'HH:mm:ss'
	        });
	    }
    })
}
//判断栏添加的个数
function cntTimeDivNum(parentDivId){
    var cnt = $("#"+parentDivId).children().size();
    return cnt;
}

function buildTimeDiv(adFlag){
     return '<div id="'+adFlag+'_timeNames_'+globalIndex+'" name="timesSet"><input type="text" name="setAttandence" id="'+adFlag+'_attendanceName_'+globalIndex+'" align="center" style="width: 150px;" placeholder="请输入宿舍考情名称"/>：'
     +'<input type="text" id="'+adFlag+'_beginDormitoryTime_'+globalIndex+'" align="center" style="width: 100px;" placeholder="请点击选择">至：'
    +'<input type="text" id="'+adFlag+'_dormitoryTime_'+globalIndex+'" align="center" style="width: 100px;" placeholder="请点击选择">'
    +'<label style="font-weight: bold;color: red;cursor: hand;font-size: 2.4rem;" onclick="deleteRowToTimeList(\''+globalIndex+'\',\''+adFlag+'\')">-</label>'
    +'<label style="font-weight: bold;color: #2f8325;cursor: hand;font-size: 2.4rem;" onclick="addRowToTimeList(\''+adFlag+'\')">＋</label></div>';
    
}

//请假列表详情页查看
function detailsFindLeave(custnoLeave){
	$("#datatableModel").html("");
	var data="<tr style='background-color:#405467;'><th>学工号</th><th>姓名</th><th>请假时长（小时）</th><th>开始时间</th><th>结束时间</th></tr>";
	for(var i=0;i<detallsShowLeave.length;i++){
		var oneData=detallsShowLeave[i];
		var custno=oneData.xgh;
		if(custnoLeave==custno){
			data+="<tr><td>"+oneData.xgh+"</td><td>"+oneData.curChildUserName+"</td><td>"+oneData.hour+"</td><td>"+oneData.beginDate+"</td><td>"+oneData.endDate+"</td></tr>"
		}
	}
	$("#datatableModel").html(data);
	$("#deletedType").modal("show");
}

//迟到列表详情页查看
function detailsFindLate(custnoLate){
	$("#datatableModel").html("");
	var data="<tr style='background-color:#405467;'><th>学工号</th><th>卡号</th><th>姓名</th><th>账号</th><th>签到时间</th></tr>";
	$.each(detailsShowLate,function(index,oneData){
		var custno=oneData.custno;
		//如果是相等，就进行数据的显示
		if(custnoLate==custno){
			data+="<tr><td>"+oneData.custno+"</td><td>"+oneData.cardno+"</td><td>"+oneData.name+"</td><td>"+oneData.account+"</td><td>"+oneData.rectime+"</td></tr>"
		}
	})
	$("#datatableModel").html(data);
	$("#deletedType").modal("show");
}


/**清空表中数据*/
function  refresh() {
    var  labelItemListDataTable =$("#datatable").dataTable();
	labelItemListDataTable.fnClearTable();
	labelItemListDataTable.fnDestroy();
	findTable();
}


//根据学校查询出所有年级
function findAllgGade(){
	var msg = {};
    msg.appName="origaniza_getAllGrade";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState === 200){
        	var html ="<option value=''>--请选择--</option>";
        	for(var i=0;i<success.data.length;i++){
        		html+="<option value='"+success.data[i].id+"'>"+success.data[i].deptName+"</option>";
        	}
        	$("#gradeSelect").html(html);
        	$("#gradeSelectTo").html(html);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

//根据年级查询所有的班级
function findAllClassByGrade(){
	var msg = {};
    msg.appName="origaniza_getAllClass";
    msg.opperOriganizaCode=$("#gradeSelectTo").val();
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState === 200){
        	var html ="<option value=''>--请选择--</option>";
        	for(var i=0;i<success.data.length;i++){
        		html+="<option value='"+success.data[i].id+"'>"+success.data[i].deptName+"</option>";
        	}
        	$("#classShowSelect").html(html);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

//进行年级时间设定验证
function isExsitTime(){
	var msg = {};
	msg.deptId=$("#gradeSelectTo").val()
    msg.appName="ykt_findTime";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState === 200){
        	if(success.data==null){
        		informationAlert_OnlyConfirmButton_NOT_REFRESH("请设定相应年级的考核时间！");
        	}else{
        		refresh();
        	}
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function findTable(){
	$("#datatable").dataTable({
        "ajax": {
            "url": serverBaseUrl,
            "data": function (data) {
                //添加额外的参数传给服务器
                data.appName="leave_reportFind";
        		data.beginTime=$("#beginTime").val();
        		data.endTime=$("#endTime").val();
        		data.deptId=$("#gradeSelectTo").val();
        		data.classId=$("#classShowSelect  option:selected").val();
                return buildRequestParam(data);
            },
            "dataSrc": function (success) {
            	if(success.msgState === 500){
            		informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
            	}
            	
                //自定义格式
                success.iTotalRecords = success.data.total;
                success.recordsFiltered = success.data.total;
                success.error = success.data.error;
                success.draw = success.data.draw;
                var jsonArray=success.data.body;
                detailsShowLate=success.data.data;
				detallsShowLeave=success.data.dataUserLeave;
                
                return jsonArray;
            },
            "beforeSend": function (xhr) {
                xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                xhr.setRequestHeader("token", static_token);
        	}
        },
        "columnDefs": [
            {
               "targets": -1,
                render: function (data, type, full, meta) {
                    return '<a href="#" style="color:blue;" onclick="detailsFindLate(\''+full.custno+'\')">'+full.lateCome;
                }
                

            },{
            "targets": -2,
            render: function (data, type, full, meta) {
                return '<a href="#" style="color:red;" onclick="detailsFindLeave(\''+full.custno+'\')">'+full.leaveNotCome;
            }
            }]
    
	});
}

//数据打印或者导出
//function downLoadOrPrint(){
//	var msg = {};
//  msg.appName="leave_reportFindPrintOrDownload";
//  msg.beginTime=$("#beginTime").val();
//  msg.endTime=$("#endTime").val();
//  serverFromJSONData(msg,true).then(function (success) {
//      if(success.msgState === 500){
//          informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
//      }else{
//          var jsonDome = success.data;
//          if(jsonDome === undefined){
//              informationAlert_OnlyConfirmButton_NOT_REFRESH("有错误数据，请重新导入错误数据！请查看错误信息！");
//          }else {
//              var scnl = jsonDome.body;
//				detailsShowLate=jsonDome.data;
//				detallsShowLeave=jsonDome.dataUserLeave;
//				
//              /***拼接table头**/
//              var title = '';
//              var data = '';
//              var tplTitle1 = '';
//              var tplTitle2 = '';
//              var trHtmlBegin = '<tr>';
//              var trHtmlEnd = '</tr>';
//              proArray = new Array();
//
//				var row1 = '<td rowspan="2">姓名</td>'
//                  + '<td  rowspan="2">学号</td>'
//                  + '<td  rowspan="2">班级</td>'
//                  + '<td  rowspan="2">宿舍楼号</td>'
//                  + '<td  rowspan="2">宿舍号</td>'
//                  + '<td  rowspan="2">正常考勤次数</td>'
//                  + '<td  rowspan="2">请假次数</td>'
//                  + '<td  rowspan="2">晚归次数</td>';
//              var row2 = tplTitle2;
//              title += trHtmlBegin + row1 + trHtmlEnd;
//              title += trHtmlBegin + row2 + trHtmlEnd;
//              /***拼接table头end**/
//
//              /***拼接table数据***/
//              for(var key in scnl){
//              	console.log(key);
//              	console.log(scnl[key].name);
//                  //for(var i = 0; i < scnl[key].length; i++ ){
//                      data += '<td>'+scnl[key].name+'</td>';
//                      data += '<td>'+scnl[key].custno+'</td>';
//                      data += '<td>'+(scnl[key].locationDorm==null?"":scnl[key].locationDorm)+'</td>';
//                      data += '<td>'+(scnl[key].building==null?"":scnl[key].building)+'</td>';
//                      data += '<td>'+(scnl[key].lcationClass==null?"":scnl[key].lcationClass)+'</td>';
//                      data += '<td>'+scnl[key].normalAttendance+'</td>';
//                      data += '<td><a href="#" style="color:red;" onclick="detailsFindLeave('+scnl[key].custno+')">'+scnl[key].leaveNotCome+'</td>';
//                      data += '<td><a href="#" style="color:blue;" onclick="detailsFindLate('+scnl[key].custno+')">'+scnl[key].lateCome+'</td>';
//
//                      data += trHtmlEnd;
//              }
//
//              /***拼接table数据end***/
//              $("#table").html('');
//              $("#table").html(title+data);
//          }
//      }
//  }),function (error) {
//      console.log("访问服务器发生错误，请稍后再试!",error);
//  };
//}
