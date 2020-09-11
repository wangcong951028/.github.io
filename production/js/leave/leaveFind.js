var static_serAndved=1;
var static_status=2;//0未通过 1已通过 2待审批  默认待审批
var static_beginDate;//开始时间
var static_endDate;//结束时间
var static_leaveName;//姓名
var areaTable;

$(function () {
    init();//初始化表单
    initOrgClass();//班级列表
    //findAdmin();//查询审批人
   	//如果是宿管员查看，不显示待审批
});

// /**选择请假类型*/
// function serAndveds(obj) {
//     static_serAndved = obj;
//     refresh();
// }
/**选择审批状态*/
function setStatus(obj) {
    static_status = obj;
    refresh();
}


/**选择开始时间和结束时间*/
$("#submitFind").click(function () {
    // var reDateTime = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/;
    // if(!reDateTime.test($("#beginTime").val())){
    //     informationAlert_OnlyConfirmButton_NOT_REFRESH("开始时间不正确!时间格式yyyy-mm-dd hh24:mi:ss");
    //     return;
    // }
    // if(!reDateTime.test($("#endTime").val())){
    //     informationAlert_OnlyConfirmButton_NOT_REFRESH("结束时间不正确!时间格式yyyy-mm-dd hh24:mi:ss");
    //     return;
    // }

    static_beginDate = $("#beginTime").val();
    static_endDate = $("#endTime").val();
    static_leaveName = $("#allName").val();
    refresh();
})



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
                    data.appName="leave_listByLeave";
                    data.serAndved=static_serAndved;//0：我发起的，1：我审批的
                    data.status=static_status;//审批状态
                    data.beginDate = static_beginDate;//开始时间
                    data.endDate = static_endDate;//结束时间
                    data.leaveName=static_leaveName;//名字
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
            }
            ,
            "columnDefs": [
                {
                    "targets": 3,
                    render: function (data, type, full, meta) {
                        return full.approvedName+"("+full.approvedXgh+")";
                    }
                },
                {
                    "targets": 7,
                    render: function (data, type, full, meta) {
                        return formatLeaveStatus(full.status)
                    }
                },
                {
                    "targets": 8,
                    render: function (data, type, full, meta) {
                        return formatLeaveIsShut(full.isShuttle)
                    }
                },
                {
                    "targets": -1,
                    render: function (data, type, leave, meta) {
                        var moveHtml="<button type='button' class='btn btn-primary btn-xs' style='float: right' data-toggle='modal'  data-target='#myModals2' onclick='LeaveFlow("+leave.id+")'><i class='glyphicon glyphicon-search'>查看流程</i></button>";
                        			
                        if(leave.status == 2){
                            moveHtml += "<button type='button' class='btn btn-success btn-xs' style='float: right' data-toggle='modal' onclick='leaveApproval("+JSON.stringify(leave).replace(/"/g, '&quot;')+")' data-target='#myModals'><i class='fa fa-pencil'>操作</i></button>";
                        }else{
                            moveHtml += "<button type='button' class='btn btn-success btn-xs' style='float: right' data-toggle='modal' onclick='findLeave("+JSON.stringify(leave).replace(/"/g, '&quot;')+")' data-target='#myModals'><i class='glyphicon glyphicon-search'>查询</i></button>";
                        }
                        return moveHtml+"<button type='button' class='btn btn-danger btn-xs' style='float: right' onclick='deleteLeave("+leave.id+")'><i class='fa fa-trash-o'>删除</i></button>";
                    }
                }]
        });

}

/**查询请假流程*/
function LeaveFlow(id) {
    var msg = {};
    msg.appName="leave_listByLeaveFlow";
    msg.leaveId=id;
    serverFromJSONData(msg,true).then(function (success) {
        var html='';
        if(success.msgState==200){
            var data = success.data;
            for(var i=0;i<data.length;i++){
                var bean = data[i];
                var istags=bean.color==0?"tags":"tags_red"
                var istag=bean.color==0?"tag":"tag_red"
                html += '<li>' +
                    '                            <div class="block">' +
                    '                                <div class="'+istags+'">' +
                    '                                    <a href="" class="'+istag+'">' +
                    '                                        <span>'+bean.title+'</span>' +
                    '                                    </a>' +
                    '                                </div>' +
                    '                                <div class="block_content">' +
                    '                                    <h2 class="title">' +
                    '                                        <a>'+bean.info1+'</a>' +
                    '                                    </h2>' +
                    '                                    <div class="byline">' +
                    '                                        <span>'+bean.info2+'</span>' +
                    '                                    </div>' +
                    '                                    <p class="excerpt" style="word-wrap: break-word">'+bean.info3+'' +
                    '                                    </p>' +
                    '                                </div>' +
                    '                            </div>' +
                    '                        </li>';
            }
            $("#flowLi").html(html);
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("查询请假流程失败！原因："+success.msg);
            //让请假申请按钮失效
            $("#addLeaveButton").attr("disabled", true);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/**
 * 查询请假信息
 * @param obj 请假对象信息
 */
function findLeave(obj) {
    $("#buttons").html('<input type="button" class="btn btn-primary" data-dismiss="modal" onclick="flush()" value="关闭"/>');
    setValues(obj);

}

/**
 * 修改（审批）请假信息(查询)
 * @param obj 请假信息对象
 */
function leaveApproval(obj) {
    $("#buttons")
        .html('<input type="button" class="btn btn-success btn-xs" onclick="executLeaveApproval(&quot;'+ obj.id + '&quot;,&quot;1&quot;)" data-dismiss="modal" value="通过"/>' +
            '<input type="button" class="btn btn-danger btn-xs" onclick="executLeaveApproval(&quot;'+ obj.id + '&quot;,&quot;0&quot;)" data-dismiss="modal" value="拒绝"/>' +
            '<input type="button" class="btn btn-primary btn-xs" data-dismiss="modal" onclick="flush()" value="关闭"/>');
    setValues(obj);

}

/**
 * 执行ajax进行请假审批
 * @param leaveId 请假主键id
 * @param status  审批状态 0：未通过 1：通过
 */
function executLeaveApproval(leaveId,status) {
    var theResponse = "";

    //如果请假被拒绝 输入拒绝原因
    if(status == 0){
        for(;;){
            theResponse = window.prompt("拒绝原因(不可超过25个汉字):","");
            if(theResponse.length<25){
                break;
            }
        }
	if(!theResponse){
	    	informationAlert_OnlyConfirmButton_NOT_REFRESH("请填写拒绝理由！");
	    	return;
    	}
    }

    var msg = {};
    msg.appName="leave_approval";
    msg.id=leaveId;
    msg.status=status;
    
    msg.remark=theResponse;
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("请假审批成功！");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("请假审批失败，原因："+success.msg);
        }
        refresh();
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}
/**添加请假信息，参数验证*/
   function AddLeaveSetParameter() {
       var leaveTypeAdd = $("#leaveTypeAdd").find("option:selected").text();//请假类型
       var beginTimeAdd = $("#beginTimeAdd").val();//开始时间
       var endTimeAdd = $("#endTimeAdd").val();//结束时间
       var hourAdd = $("#hourAdd").val();//小时
       var reasonAdd = $("#reasonAdd").val();//请假事由
       var imgAdd = $("#imgAddHtml").html();//base64图片
       var studentId= $("#leavePerson2").val();//学生id
       var isShuttle=$("#a_isShuttle").val();//是否接送
	   console.log("studentId="+studentId);
		
	   if(studentId=='' ||studentId==null){
		   alert("请选择请假人");
	       return;
		}
       if(leaveTypeAdd.length==0){
           alert("请选择请假类型");
           return;
       }
       if(isShuttle =='' ||isShuttle==null){
           alert("请选择是否接送");
           return;
       }
       if(beginTimeAdd.length==0){
           alert("请选择请假开始时间");
           return;
       }
       if(endTimeAdd.length==0){
           alert("请选择请假结束时间");
           return;
       }
       if(hourAdd.length==0){
           alert("请输入请假小时（工作时间）");
           return;
       }
       /*if(reasonAdd.length==0){
           alert("请输入请假事由");
           return;
       }*/
    
       var msg = {};
       msg.type = leaveTypeAdd;
       msg.beginDate = beginTimeAdd;
       msg.endDate = endTimeAdd;
       msg.hour = hourAdd;
       msg.img = imgAdd;
       msg.info = reasonAdd;
       msg.studentId = studentId;
	   msg.isShuttle = isShuttle;
       initNewsType(msg);

   }

/**
 * 执行添加请假信息
 * @constructor
 */
   function  initNewsType(msg) {
       msg.appName="leave_addLeave";
       serverFromJSONData(msg,true).then(function (success) {
           if(success.msgState==200){
               informationAlert_OnlyConfirmButton_NOT_REFRESH("请假申请成功！");
               resetting();
               $("#close").click();
           }else{
               informationAlert_OnlyConfirmButton_NOT_REFRESH("请假申请失败，原因："+success.msg)
           }
           refresh();
       }),function (error) {
           console.log("访问服务器发生错误，请稍后再试!",error);
       };
   }

//-----------------------------以下是公共方法------------------------
/**
 * set请假信息值
 * @param obj
 */
function setValues(obj) {
    $("#proposerName").val(obj.proposerName);
    $("#curChildUserName").val(obj.curChildUserName);
    $("#approvedName").val(obj.approvedName);
    $("#leaveType").val(obj.leaveTypeName);
    $("#beginDate").val(obj.beginDate);
    $("#endDate").val(obj.endDate);
    $("#hour").val(obj.hour);

    if(obj.isShuttle==1){
    	$("#isShuttle").val("是");
    }
    if(obj.isShuttle==0){
    	$("#isShuttle").val("否");
    }
    if(obj.idNumber == "null"){
    	$("#idNumber").val("");
    }else{
    	$("#idNumber").val(obj.idNumber);
    }
    var tempImg = '<img width="100px" height="100px" src="'+obj.img+'"/>';

    var tempImg = '';
    $.each(obj.leaveImgList,function (index, item) {
        var img = item.leaveImg;
        tempImg += '<img style="height:100px;width:100px" src="'+img+'"/>&emsp;';
    })
	
    $("#img").html("图片："+tempImg);//将隐藏的图片显示出来
    //$("#img").html("图片："+tempImg.replace("id","name"));
    if(obj.reason==null || obj.reason==""){
    	$("#reason").html("请假事由：");
    }else{
    	$("#reason").html("请假事由："+obj.reason);
    }
    $("#submitTime").html("请假提交时间："+obj.submitTime);
    $("#status").html("请假审批状态："+formatLeaveStatus(obj.status));
    if(obj.approvedTime != null){
        $("#approvedTime").html("请假审批时间："+obj.approvedTime);
    }
	if(obj.leaveTime == null || obj.leaveTime == ""){
		$("#leavesTime").html("离校时间：");
	}else{
		$("#leavesTime").html("离校时间："+obj.leaveTime);
	}
	if(obj.returnTime == null || obj.returnTime == ""){
		$("#returnsTime").html("返校时间：");
	}else{
		$("#returnsTime").html("返校时间："+obj.returnTime);
	}
    if(obj.status==0){//如果请假未通过 显示拒绝理由
    	if(obj.remark==null){
    		$("#remark").html("请假拒绝理由：无");
    	}else{
	        $("#remark").html("请假拒绝理由："+obj.remark);
    	}
    }
}

/**清空信息*/
function flush() {
    $("#proposerName").html("");
    $("#curChildUserName").html("");
    $("#approvedName").html("");
    $("#leaveType").html("");
    $("#beginDate").html("");
    $("#endDate").html("");
    $("#hour").html("");
    $("#img").html("");
    $("#reason").html("");
    $("#submitTime").html("");
    $("#status").html("");
    $("#approvedTime").html("");
    $("#remark").html("");
    $("#leavesTime").html("");
    $("#returnsTime").html("");

}

/**
 * 重置请假信息
 */
function resetting() {
    $("#leaveTypeAdd").val("");
    $("#beginTimeAdd").val("");
    $("#endTimeAdd").val("");
    $("#hourAdd").val("");
    $("#reasonAdd").val("");
    $("#imgAdd").attr("src","");
    $("#imgTest").val("");

}

/**刷新表单*/
function  refresh() {
    areaTable.api().ajax.reload();
}

/**
 * 转换请假审批状态
 * @param status
 * 审批状态：0未通过 1已审批 2待审批
 * @returns {*}
 */
function formatLeaveStatus(status) {
    var statuss;
    switch (status){
        case 0:statuss = '<span style="color: red">未通过</span>';break;
        case 1:statuss = '<span style="color: green">已通过</span>';break;
        case 2:statuss = '<span style="color: blue">待审批</span>';break;
        default: break;
    }
    return statuss
}
/**格式化是否接送*/
function formatLeaveIsShut(status) {
    var statuss;
    switch (status){
        case 0:statuss = '<span style="color: red">否</span>';break;
        case 1:statuss = '<span style="color: blue">是</span>';break;
        default: break;
    }
    return statuss
}


$("#imgTest").change(function () {
    run(this, function (data) {
        $("#imgAdd").attr('src',data);
    });

});

function run(input_file, get_data) {
    /*input_file：文件按钮对象*/
    /*get_data: 转换成功后执行的方法*/
    if (typeof (FileReader) === 'undefined') {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("抱歉，你的浏览器不支持 FileReader，不能将图片转换为Base64，请使用现代浏览器操作！");
    } else {
        try {
            /*图片转Base64 核心代码*/
            var file = input_file.files[0];
            //这里我们判断下类型如果不是图片就返回 去掉就可以上传任意文件
            if (!/image\/\w+/.test(file.type)) {
                informationAlert_OnlyConfirmButton_NOT_REFRESH("请确保文件为图像类型");
                return false;
            }
            var reader = new FileReader();
            reader.onload = function () {
                get_data(this.result);
            }
            return reader.readAsDataURL(file);
        } catch (e) {
            informationAlert_OnlyConfirmButton_NOT_REFRESH('图片转Base64出错啦！' + e.toString())
        }
    }
}

	
function deleteLeave(id){
	informationAlert_confirmAndCancelButton('deleteLeaveById('+id+')','是否删除该条请假记录？');
}
function deleteLeaveById(id){
	// 2、接口请求参数组装
    var msg = {};
    msg.leaveId = id
    msg.appName="leave_deleteLeave";

    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH('删除成功！');
            areaTable.api().ajax.reload();
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/**申请请假**/
function applyLeave(){
	//弹出模态框
	$("#myModals1").modal("show");
	//查询请假类型
	var msg = {};
    msg.appName="leave_listByLeaveType";
	var html="<option value=''>---------  请选择  ---------</option>";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
        	for(var i=0;i<success.data.length;i++){
        		html+="<option value='"+success.data[i].id+"'>"+success.data[i].typeName+"</option>";
        	}
        	$("#leaveTypeAdd").html(html);
        	
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("查询请假类型错误"+success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
    //获取请假人
    getApplyPerson();
}

//获取请假人
function getApplyPerson(){
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
                var html = "<option value=''>---------  请选择  ---------</option>";
                html+="<option value=''>全部</option>";
                $.each(qriganiza, function(index, obj) {
                    html+='<option value="'+obj.pk_DepID+'">'+obj.className+'</option>'
                });
                $("#leavePerson1").html(html);
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

  	var deptId = $("#leavePerson1").find("option:selected").val();
    clz_id_2 = new Array();
    clz_id_2.push(deptId);
    fillStudent(clz_id_2);
    //使用同步请求
    $("#leavePerson1").change(function () {
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
                $("#leavePerson2").html('<input type="text" />'+html);
                $('#leavePerson2').searchableSelect();
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
/*自动计算时间差*/
function showTimeHour(){
	var beginTime=$("#beginTimeAdd").val();
    var endTime=$("#endTimeAdd").val();
    var beginDate=new Date(beginTime);
    var endDate=new Date(endTime);
    if(beginTime!=null && beginTime!='' && endTime!=null && endTime!=''){
		var u = navigator.userAgent;
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		if(isiOS){
			var beginT = new Date(beginTime.replace(/-/g,'/')).getTime();
			var endT = new Date(endTime.replace(/-/g,'/')).getTime();
			var mi=parseInt(endT - beginT) / 1000 / 60/60;
	    	if(mi<0){
//	    		informationAlert_OnlyConfirmButton_NOT_REFRESH("开始时间应小于结束时间！");
	    		return;
	    	}
	    	var showTime=parseFloat(mi.toFixed(2));
	    	$("#hourAdd").val(showTime);
		  }else{
	    	var mi=parseInt(endDate.getTime() - beginDate.getTime()) / 1000 / 60/60;
	    	if(mi<0){
//	    		informationAlert_OnlyConfirmButton_NOT_REFRESH("开始时间应小于结束时间！");
	    		return;
	    	}
	    	var showTime=parseFloat(mi.toFixed(2));
	    	$("#hourAdd").val(showTime);
		  }
    }
}

