var areaTable;

$(function () {
    init();
    initOrgClass();
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
                    data.name=$("#name").val();
                    data.xgh=$("#xgh").val();
                    data.beginTime=$("#beginTime").val();
                    data.endTime=$("#endTime").val();
                    
                    if(data.beginTime>data.endTime){
                    	informationAlert_OnlyConfirmButton_NOT_REFRESH("开始时间不能大于结束时间！");
                    	return;
                    }
                    data.appName="weekendStay_getAllWeekendStay";
                    
                    return buildRequestParam(data);
                },
                "dataSrc": function (json) {
                    //自定义格式
                    json.iTotalRecords = json.data.recordsTotal;
                    json.recordsFiltered = json.data.recordsTotal;
                    json.error = json.data.error;
                    json.draw = json.data.draw;

                    tocken=json.data.data;
                    return json.data.data;
                },
                "beforeSend": function (xhr) {
                    xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                    xhr.setRequestHeader("token", static_token);
                }
            }
            ,
            "columnDefs": [
            	{
		                "targets": -1,
		                render: function (data, type, full, meta) {
		                		return '<div>' +
	                            '<button disabl class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.teacherId + '"  onclick="updateModal(' + full.pk_id+","+full.studentId+ ')"><i class="fa fa-pencil">修改</i></button>' +
	                            '<button  class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="deleteModal(' + full.pk_id + ')"><i class="fa fa-trash-o">删除</i></button>' +
	                            '</div>';
		                	}
	                }	
            ]
    });
}

function initOrgClass() {

  	var deptId = $("#person1").find("option:selected").val();
    clz_id_2 = new Array();
    clz_id_2.push(deptId);
    fillStudent(clz_id_2);
    //使用同步请求
    $("#person1").change(function () {
        // 2、接口请求参数组装
        var deptId = $(this).find("option[value='"+$(this).val()+"']").val();
        clz_id_2 = new Array();
    	clz_id_2.push(deptId);
        fillStudent(clz_id_2);
    })
}

//获取请假人
function getApplyPerson(){
	//查询请假类型
	// 2、接口请求参数组装
    var msg = {};
    $("#myModal").modal("show");
    msg.appName = "homeWork_findClassName";
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
                var qriganiza = success.data;
                var html = "<option value=''>---------  请选择  ---------</option>";
                html+="<option value=''>全部</option>";
                $.each(qriganiza, function(index, obj) {
                    html+='<option value="'+obj.pk_DepID+'">'+obj.className+'</option>'
                });
                $("#person1").html(html);
            }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

var dept_id;
function fillStudent(deptId){
    // 2、接口请求参数组装
    var msg = {};
    msg.appName = "leave_findSubByClzidAndSubname";
    if(deptId[0] == -1){
    	if(dept_id == undefined){
    		var deptId = new Array();
    		if(dept != null || dept.length>0){
				for(var i=0;i<dept.length>0;i++){
					deptId.push(dept[i].pk_DepID);
				}
			}
    		msg.deptId = deptId;
    	}else{
    		msg.deptId = dept_id;
    	}
    }else{
    	msg.deptId = deptId;    
    }
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
                var qriganiza = success.data;
                var html = '';
                if(qriganiza.length==0){
//              	html+="<option value=''>暂无数据！</option>";
                }else{
                	$.each(qriganiza, function(index, obj) {
                    	html+='<option value="'+obj.studentId+'">'+obj.studentName+'</option>'
                	});
                }
                $("#person2").html('<input type="text" />'+html);
                $('#person2').searchableSelect();
                var aa = $(".searchable-select");
                for(var i=0;i<aa.length;i++){
                	if(i==0){
                		aa[i].style.display = "";
                	}else{
                		aa[i].style.display = "none";
                	}
                }
            }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

//关闭保存的模态框
function cleanModal(){
	$("#myModal").modal("hide");
}

//进行添加
function saveWeekendStay(flag){
	//弹出模态框
	$("#myModals1").modal("show");
	//查询请假类型
	var msg = {};
	msg.studentId=$("#person2").val();
	msg.beginTime=$("#addBeginTime").val();
	msg.endTime=$("#addEndTime").val();
	msg.remarke=$("#addRemark").val();
	
	if(!msg.studentId){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择学生！");
		return;
	}
	if(!msg.beginTime){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择开始时间！");
		return;
	}
	if(!msg.endTime){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择结束时间！");
		return;
	}
	if(msg.endTime<msg.beginTime){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("开始时间应小于或等于结束时间！");
		return;
	}
	
	
    msg.appName="weekendStay_saveWeekendStay";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
        	refresh();
        	//如果是1不关闭模态框继续添加，否则关闭模态框
        	if(flag==2){
        		resetInformation();
        		$("#myModal").modal("hide");
        	}
        	informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功！");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加失败！");
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

//进行列表刷新
function refresh(){
	areaTable.api().ajax.reload();
}

//修改（原数据展示）
function updateModal(id,studentId){
	var msg={};
	msg.pk_id=id;
	msg.appName="weekendStay_getWeekendStay";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
        	$("#updateId").val(id);
        	$("#updateStudentId").val(studentId);
        	$("#updatename").val(success.data.name);
        	$("#updateBeginTime").val(success.data.beginTime);
        	$("#updateEndTime").val(success.data.endTime);
        	$("#updateRemark").val(success.data.remarks);
        	$("#myModalUpdate").modal("show");
        	
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加失败！");
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}


//确认修改
function updateWeekendStay(){
	var msg={};
	msg.pk_id=$("#updateId").val();
	msg.studentId=$("#updateStudentId").val();
	msg.beginTime=$("#updateBeginTime").val();
	msg.endTime=$("#updateEndTime").val();
	msg.remarke=$("#updateRemark").val();
	
	if(!msg.beginTime){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择开始时间！");
		return;
	}
	if(!msg.endTime){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择结束时间！");
		return;
	}
	if(msg.endTime<msg.beginTime){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("开始时间应小于或等于结束时间！");
		return;
	}
	
	msg.appName="weekendStay_updateWeekendStay";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
        	refresh();
        	informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功！");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("修改失败！");
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

//删除
function deleteModal(id){
	informationAlert_confirmAndCancelButton("deleteConfirm("+id+")","是否确认删除该记录！？");
}

function deleteConfirm(id){
	var msg={};
	msg.pk_id=id;
	msg.appName="weekendStay_deleteAllWeekendStay";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
        	informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功！");
        	refresh();
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加失败！");
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

//添加过后重置信息
function resetInformation(){
	$("#person1").val("");
	$("#person2").val(-1);
	$("#addBeginTime").val("");
	$("#addEndTime").val("");
	$("#addRemark").val("");
}
