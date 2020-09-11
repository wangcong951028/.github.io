/**
 * Created by ricardo on 2018-01-15.
 */
var areaTable;
var leaveId = 0;
var flag = true;//刷新页面显示模态框
var type = 1; //默认年级

$(function(){
    queryUserBaseList();
		$("#searchUserList").click(function(){
			 refreshAreaTable();
		});
		//根据选择类型判断
		$("#setType").change(function(){
				if($(this).val()==1){
					type = 1;
					$("#grade_type").css("display","block");
					$("#stu_type").css("display","none");
				}if($(this).val()==0){
					type = 0;
					$("#grade_type").css("display","none");
					$("#stu_type").css("display","block");
				}
		});
})
function refreshAreaTable(){
    areaTable.api().ajax.reload();
}

/**
 * 1、查询人员列表
 */

function queryUserBaseList() {
    //添加额外的参数传给服务器
    areaTable = $('#datatable').dataTable({
        "ajax": {
            "url": serverBaseUrl,
            "data": function (data) {
                data.appName = "leave_listLeaveSetting";
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
                "targets": 1,
                render: function (data, type, full, meta) {
									if(full.type==1){
										return full.grade;
									}else{
										return full.stuName;
									}
                }
            },{
                "targets": 2,
                render: function (data, type, full, meta) {
                    return full.endTime;
                }
            
            },
            {
                "targets": 3,
                render: function (data, type, full, meta) {
                    return full.startTime;
                }
            },
            {
                "targets": 4,
                render: function (data, type, full, meta) {
                    return full.lastTime;
                }
            },
            {
                "targets": -1,
                render: function (data, type, full, meta) {
                	
                   return "<a class='bbtn btn-info btn-xs' onclick='showData("+full.leaveId+")' style='cursor:pointer;'><i class='fa fa-pencil'></i>编辑</a>"+
                   		  "<a class='bbtn btn-danger btn-xs' onclick='deleteData("+full.leaveId+")' style='cursor:pointer;'><i class='fa fa-trash-o'></i>删除</a>";
                }
            }
        ]
    });
}

function deleteData(id){
	informationAlert_confirmAndCancelButton('deleteLeaveById('+id+')','是否删除该条记录？');
}
/*删除*/
function deleteLeaveById(id){
	var msg = {};
    msg.appName="leave_deleteLeaveTime";
    msg.leaveId = id;
    serverFromJSONData(msg,true).then(function (response) {
    	if(response.msgState == 200){
    		informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功！");
    		areaTable.api().ajax.reload();
    	}
	}),function (error) {
	        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}




/**
 * 修改
 * @param {Object} id
 */
function showData(id){
	flush();
	findGrade()
	findClassAdd();
	if(g_flag){
		showLeavel(id);
	}

}


/*获取信息*/
function showLeavel(id){
	$("#residentTime").modal("show");
	$("#gradeList").attr("disabled","disabled");
	$("#classList").attr("disabled","disabled");
	$("#studentList").attr("disabled","disabled");
	$("#setType").attr("disabled","disabled");

	var msg = {};
    msg.appName="leave_findById";
    msg.leaveId = id;
    serverFromJSONData(msg,true).then(function (response) {
    	if(response.msgState == 200){
    		var leaveitem = response.data;
	        $("#leave_id").val(leaveitem.leaveId);
	        var grades = $("#gradeList option");
					var classList = $("#classList option");
				  var studentList = $("#studentList");
				  var setType = $("#setType option");
					
					setType.each(function(index,obj){
						if(obj.value == leaveitem.type){
							obj.selected=true;type
						}
					});
					if(leaveitem.type==1){
						type = 1;
						$("#grade_type").css("display","block");
						$("#stu_type").css("display","none");
					}else{
						type = 0;
						$("#grade_type").css("display","none");
						$("#stu_type").css("display","block");
					}
					grades.each(function(index,obj){
						if(obj.value == leaveitem.deptId){
							obj.selected=true;
						}
					});
				  classList.each(function(index,obj){
						if(obj.value == leaveitem.classId){
							obj.selected=true;
						}
					}); 
					studentList.html('<option value="'+leaveitem.stuId+'">'+leaveitem.stuName+'</option>');
	        $("#beginTimeAdd").val(leaveitem.startTime);
	        $("#endTimeAdd").val(leaveitem.endTime);
	        $("#lastTimeAdd").val(leaveitem.lastTime);
    	}
	}),function (error) {
	        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}

/***
 * 显示模态框
 * @param {Object} modalID
 */
function showModal(modalID,afleaveID){
	$("#"+modalID).modal("show");
	leaveId = afleaveID;
	if('userDetail_div' == modalID){
		initUserDetailInfo(afleaveID);
	}
	if('userLeave_div'==modalID){
		initRelease(leaveId);
	}
}

/***
 * 关闭模态框
 * @param {Object} modalID
 */
function closeModal(modalID){
	$("#"+modalID).modal("hide");
}


/***
 * 刷新数据
 */
function closeBuildModal(modalID){
    $('#'+modalID).modal('hide');
    refreshAreaTable();
}

function closeBuildModalNotRefresh(modalID){
    $('#'+modalID).modal('hide');
}



// 样式 style="ime-mode:disabled" 禁止中文输入     
function noPermitInput(e){       
       var evt = window.event || e ;     
        if(isIE()){     
            evt.returnValue=false; //ie 禁止键盘输入     
        }else{     
            evt.preventDefault(); //fire fox 禁止键盘输入     
        }        
}

function isIE() {     
    if (window.navigator.userAgent.toLowerCase().indexOf("msie") >= 1)     
        return true;     
    else     
        return false;     
}      


//新增走读时间规则
function  addLeaveTime(){
	$("#residentTime").modal("show");
	$("#gradeList").removeAttr("disabled");
	$("#classList").removeAttr("disabled","disabled");
	$("#studentList").removeAttr("disabled","disabled");
	$("#setType").removeAttr("disabled","disabled");

	flush();
	findGrade();
	findClassAdd();
	initOrgClass();
}

var g_flag = false;
function findGrade(){
	//查询年级
	var msg = {};
    msg.appName="leave_findGradeList";
	var html="<option value=''>----- 请选择年级 -----</option>";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
        	for(var i=0;i<success.data.length;i++){
        		html+="<option value='"+success.data[i].PK_DEPID+"'>"+success.data[i].D_NAME+"</option>";
        	}
        	$("#gradeList").html(html);
        	g_flag = true;
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("查询请假类型错误"+success.msg);
        }
        
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

//获取班级
function findClassAdd(){
	//查询请假类型
	// 2、接口请求参数组装
    var msg = {};
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
                var html = "<option value='-1'>----- 请选择班级 -----</option>";
                html+="<option value=''>全部</option>";
                $.each(qriganiza, function(index, obj) {
                    html+='<option value="'+obj.pk_DepID+'">'+obj.className+'</option>'
                });
                $("#classList").html(html);
            }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}
var clz_id_2;
function initOrgClass() {

  	var deptId = $("#classList").find("option:selected").val();
    clz_id_2 = new Array();
    clz_id_2.push(deptId);
    fillStudent(clz_id_2);
    //使用同步请求
    $("#classList").change(function () {
        // 2、接口请求参数组装
        var deptId = $(this).find("option[value='"+$(this).val()+"']").val();
        clz_id_2 = new Array();
    	clz_id_2.push(deptId);
        fillStudent(clz_id_2);
    })
}
var dept_id;
function fillStudent(deptId){
    // 2、接口请求参数组装
    var msg = {};
    msg.appName = "leave_findSubByClzidAndSubname";
    if(deptId[0] == -1){
    	if(dept_id == undefined){
    		var dept = new Array();
    		if(deptId != null || deptId.length>0){
					for(var i=0;i<deptId.length>0;i++){
						dept.push(deptId[i].pk_DepID);
					}
				}
    		msg.deptId = dept;
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
                $("#studentList").html('<input type="text" />'+html);
                $('#studentList').searchableSelect();
                var aa = $(".searchable-select");
								$(".searchable-select").css('min-width','171px');
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


//设置走读生年级时间
function addSetting(){
		 var gradeList=$("#gradeList").val();//年级id
		 var grade = $("#gradeList").find("option:selected").text();//年级
		 var beginTimeAdd = $("#beginTimeAdd").val();//开始时间
		 var endTimeAdd = $("#endTimeAdd").val();//结束时间
		 var lastTimeAdd  = $("#lastTimeAdd").val();//最晚离校时间
		 var leaveId = $("#leave_id").val();
		 var stuId = $('#studentList').val();
		 var stuName = $('#studentList').find("option:selected").text();//姓名
		 var classId = $('#classList').val();
	   var nowDate = new Date();
	   var nowtime = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();//当前日期年月日
			if(type==1){
				if(gradeList=='' ||gradeList==null){
				 alert("请选择年级");
					 return;
				}
			}
			if(type==0){
				if(stuId=='' ||stuId==null){
					alert("请选择学生");
						return;
				}
			}
       if(beginTimeAdd.length==0){
           alert("请选择时间");
           return;
       }
       if(endTimeAdd.length==0){
           alert("请选择时间");
           return;
       }
       var b_time = nowtime+' '+beginTimeAdd;//离校时间
       var j_time = nowtime+' '+endTimeAdd;//进校时间
       if(new Date(Date.parse(j_time.replace(/-/g,   "/"))).getTime()>new Date(Date.parse(b_time.replace(/-/g,   "/"))).getTime()){
       	   alert("晚上考勤时间必须大于早上考勤时间");
           return;
       }
       if(lastTimeAdd.length==0){
   		 	alert("请选择时间");
            return;
       }
       var last_time = nowtime+' '+lastTimeAdd;//最晚离校时间
       if(new Date(Date.parse(last_time.replace(/-/g,   "/"))).getTime()<new Date(Date.parse(b_time.replace(/-/g,   "/"))).getTime()){
       	   alert("晚上最晚考勤时间必须大于晚上考勤时间");
           return;
       }
    
       var msg = {};
			 if(type==1){
					msg.deptId = gradeList;
					msg.grade = grade;
				}
				if(type==0){
					msg.stuId = stuId;
					msg.stuName = stuName;
					msg.classId = classId;
				}
			  msg.type = type; 
        msg.startTime = beginTimeAdd;
        msg.endTime = endTimeAdd;
        msg.lastTime = lastTimeAdd;
        msg.leaveId = leaveId;
        msg.appName="leave_addLeaveSetting";
        serverFromJSONData(msg,true).then(function (success) {
           if(success.msgState==200){
               informationAlert_OnlyConfirmButton_NOT_REFRESH("设置成功！");
               $("#residentTime").modal("hide");
              refreshAreaTable();
           }else{
               informationAlert_OnlyConfirmButton_NOT_REFRESH("设置失败，原因："+success.msg)
           }
       }),function (error) {
           console.log("访问服务器发生错误，请稍后再试!",error);
       };
}

/**清空信息*/
function flush() {
  	$("#gradeList").val("");
	  $("#beginTimeAdd").val("");
    $("#endTimeAdd").val("");
    $("#lastTimeAdd").val("");
		$("#studentList").html("");
		$("#classList").val("");
		$("#setType").val("");
		$(".searchable-select").remove();
		$("#studentList").css("display","block");
		
}

