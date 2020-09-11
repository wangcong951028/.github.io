var areaTable;
var newProjectID ;
$(function () {
    projectList();
    getProjectName();
})
/*清理表单*/
function cleanModal(){
    document.getElementById("saveForm").reset();
}
/*列表*/
function projectList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    if(newProjectID == null){
                        data.modelID = getUrlParam("modelID")+"_modelID";
                    }else{
                        data.modelID = newProjectID;
                    }
                    data.keyWords = $("#keyWords").val();
                    /*查询参数*/
                    data.appName = "project_findAssessmentProjectPC";
                    var paramJsonMsg = JSON.stringify(data);

                    //配置基本参数
                    data.param = paramJsonMsg;
                    data.appKey = "aGFuZHlDYW1wdXM=";
                    data.appSecret = "1234567890abcedefgh";
                    var time = new Date().getTime();
                    data.time = time;
                    var temp = 'appKey=aGFuZHlDYW1wdXM=&appSecret=1234567890abcedefgh&param=' + paramJsonMsg + '&time=' + time;
                    data.sign = hex_md5(temp);
                    return JSON.stringify(data);
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
                    "targets": 2,
                    render: function (data, type, full, meta) {
                        if (full.p_class == 1) {
                            return '<span style="color: red" class="glyphicon glyphicon-remove"></span>';
                        }
                        else if (full.p_class == 2) {
                            return '<span style="color: darkturquoise" class="glyphicon glyphicon-ok"></span>';
                        }
                    }
                },
                {
                    "targets": 3,
                    render: function (data, type, full, meta) {
                        if (full.p_dormitory == 1) {
                            return '<span style="color: red" class="glyphicon glyphicon-remove"></span>';
                        }
                        else if (full.p_dormitory == 2) {
                            return '<span style="color: darkturquoise" class="glyphicon glyphicon-ok"></span>';
                        }
                    }
                },
                {
                    "targets": 4,
                    render: function (data, type, full, meta) {
                        if (full.p_individual == 1) {
                            return '<span style="color: red" class="glyphicon glyphicon-remove"></span>';
                        }
                        else if (full.p_individual == 2) {
                            return '<span style="color: darkturquoise" class="glyphicon glyphicon-ok"></span>';
                        }
                    }
                },
                {
                    "targets": 5,
                    render: function (data, type, full, meta) {

                        if (full.p_scoringway == 1) {
                            return '<span style="color: #42C7DB">加分操作</span>';
                        }
                        else if (full.p_scoringway == 2) {
                            return '<span style="color: #FF0202">减分操作</span>';
                        }
                    }
                },
                {
                    "targets": -1,
                    render: function (data, type, full, meta) {
                    	var modelid = getUrlParam('modelID')+"_modelID";
                        if(full.fk_modelid == modelid){
                            return '<div>' +
                                /*'<button class="btn btn-primary btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="lookProject(' + full.pk_id + ')"><i class="glyphicon glyphicon-search">查看</i></button>' +*/
                                '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="updateProject(' + full.pk_id + ')"><i class="fa fa-pencil">修改</i></button>' +
                                '<button class="btn btn-info btn-xs" href="#"  data-key="' + full.pk_id + '"  onclick="saveChild(' + full.pk_id + ','+full.p_class+','+full.p_dormitory+','+full.p_individual+','+full.p_scoringway+')"><i class="fa fa-pencil">添加下级</i></button>' +
                                '<button class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="deleteModal(' + full.pk_id + ','+full.delete_model_id+')"><i class="fa fa-trash-o">删除</i></button>' +
                                '</div>';
                        }else{
                            return '<div>' +
                                /*'<button class="btn btn-primary btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="lookProject(' + full.pk_id + ')"><i class="glyphicon glyphicon-search">查看</i></button>' +*/
                                '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="updateProject(' + full.pk_id + ')"><i class="fa fa-pencil">修改</i></button>' +
                                '<button class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="deleteModal(' + full.pk_id + ')"><i class="fa fa-trash-o">删除</i></button>'+
                                '</div>';
                        }

                    }
                }]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

var statu;//外键id
function saveChild(status,p_class,p_dormitory,p_individual,p_scoringway) {
	
	if(status != 0){
		document.getElementById("pclass1").disabled = true;
		document.getElementById("pclass2").disabled = true;
		
		document.getElementById("pdormitory1").disabled = true;
		document.getElementById("pdormitory2").disabled = true;
		
		document.getElementById("pindividual1").disabled = true;
		document.getElementById("pindividual2").disabled = true;
		
		document.getElementById("pscoringway1").disabled = true;
		document.getElementById("pscoringway2").disabled = true;
		
		
		document.getElementById("aaaa").style.display = 'none';
		
		if(p_class == 1){
			$("input[name='pclass']").get(1).checked = true;
		}else{
			$("input[name='pclass']").get(0).checked = true;
		}
		
		if(p_dormitory == 1){
			$("input[name='pdormitory']").get(1).checked = true;
		}else{
			$("input[name='pdormitory']").get(0).checked = true;
		}
		
		if(p_individual == 1){
			$("input[name='pindividual']").get(1).checked = true;
		}else{
			$("input[name='pindividual']").get(0).checked = true;
		}
		
		if(p_scoringway == 1){
			$("input[name='pscoringway']").get(0).checked = true;
		}else{
			$("input[name='pscoringway']").get(1).checked = true;
		}
	}else{
		document.getElementById("pclass1").disabled = false;
		document.getElementById("pclass2").disabled = false;
		
		document.getElementById("pdormitory1").disabled = false;
		document.getElementById("pdormitory2").disabled = false;
		
		document.getElementById("pindividual1").disabled = false;
		document.getElementById("pindividual2").disabled = false;
		
		document.getElementById("pscoringway1").disabled = false;
		document.getElementById("pscoringway2").disabled = false;
		
		document.getElementById("aaaa").style.display = '';
	}
	
    $('#myModal').modal('show');
    if(status == 0){
    	statu = null;
    }else{
    	statu = status;
    }
}

/*添加考核项*/
function saveProject(type){
    // 2、接口请求参数组装
    var msg = {};
    var p_name = $("#pname").val();
    if(p_name.length>6){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("请勿超过6个字符！");
    }else{
	    msg.p_name = p_name;
	    msg.p_totalscore = $("#ptotalscore").val();
//	    msg.p_classscoring = $("#pclassscoring").val();
//	    msg.p_individualscoring = $("#pindividualscoring").val();
 		msg.p_classscoring = 0;
	    msg.p_individualscoring = 0;
	    msg.p_remark = $("#premark").val();
	    if(statu == null){
	        msg.modelid = getUrlParam('modelID');
	    }else{
	        msg.fk_modelid = statu;
	    }
	    var pclass = $("input[type='radio'][name='pclass']");
	    for(var i=0;i<pclass.length;i++){
	        if(pclass[i].checked){
	            msg.p_class = pclass[i].value;
	        }
	    };
	    var pdormitory = $("input[type='radio'][name='pdormitory']");
	    for(var i=0;i<pdormitory.length;i++){
	        if(pdormitory[i].checked){
	            msg.p_dormitory = pdormitory[i].value;
	        }
	    };
	    var pindividual = $("input[type='radio'][name='pindividual']");
	    for(var i=0;i<pindividual.length;i++){
	        if(pindividual[i].checked){
	            msg.p_individual = pindividual[i].value;
	        }
	    };
	    var pscoringway = $("input[type='radio'][name='pscoringway']");
	    for(var i=0;i<pscoringway.length;i++){
	        if(pscoringway[i].checked){
	            msg.p_scoringway = pscoringway[i].value;
	        }
	    };
	    msg.appName="project_saveAssessmentProject";
	
	    serverFromJSONData(msg,true).then(function (success) {
	        if(success.msgState == 200){
	            if(type==2){
	                $('#myModal').modal('hide');
	            }
	            cleanModal();
	            getProjectName();
	            areaTable.api().ajax.reload();
	            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功！");
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
	        }
	    	
	    }),function (error) {
	        console.log("访问服务器发生错误，请稍后再试!",error);
	    };
    }
}

/*修改：获取原有数据*/
function updateProject(id) {
    var msg = {};
    msg.id= id;
    msg.appName="project_findAssessmentProjectByID";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
           var project = success.data;
            $("#updatepname").val(project.p_name);
            $("#updateptotalscore").val(project.p_totalscore);
//          $("#updatepclassscoring").val(project.p_classscoring);
//          $("#updatepindividualscoring").val(project.p_individualscoring);
            $("#updatepremark").val(project.p_remark);
            $("#updateID").val(project.pk_id);

            if(project.p_class == 1){
                $("input[type='radio'][id='updatepclass2'][value='1']").prop("checked",'checked');
            }else{
                $("input[type='radio'][id='updatepclass1'][value='2']").prop("checked",'checked');
            }
            if(project.p_dormitory == 1){
                $("input[type='radio'][id='updatepdormitory2'][value='1']").prop("checked",'checked');
            }else{
                $("input[type='radio'][id='updatepdormitory1'][value='2']").prop("checked",'checked');
            }
            if(project.p_individual == 1){
                $("input[type='radio'][id='updatepindividual2'][value='1']").prop("checked",'checked');
            }else{
                $("input[type='radio'][id='updatepindividual1'][value='2']").prop("checked",'checked');
            }
            if(project.p_scoringway == 1){
                $("input[type='radio'][id='updatepscoringway1'][value='1']").prop("checked",'checked');
            }else{
                $("input[type='radio'][id='updatepscoringway2'][value='2']").prop("checked",'checked');
            }

            $('#updateModal').modal("show");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

 /*修改：添加新数据*/
 function newProject(){
     var msg = {};
     msg.p_name = $("#updatepname").val();
     msg.p_totalscore = $("#updateptotalscore").val();
//   msg.p_classscoring = $("#updatepclassscoring").val();
//   msg.p_individualscoring = $("#updatepindividualscoring").val();
	 msg.p_classscoring = 0;
     msg.p_individualscoring = 0;
     msg.p_remark = $("#updatepremark").val();
     msg.pk_id = $("#updateID").val();
     var updatepclass = $("input[type='radio'][name='updatepclass']");
     for(var i=0;i<updatepclass.length;i++){
         if(updatepclass[i].checked){
             msg.p_class = updatepclass[i].value;
         }
     };
     var updatepdormitory = $("input[type='radio'][name='updatepdormitory']");
     for(var i=0;i<updatepdormitory.length;i++){
         if(updatepdormitory[i].checked){
             msg.p_dormitory = updatepdormitory[i].value;
         }
     };
     var updatepindividual = $("input[type='radio'][name='updatepindividual']");
     for(var i=0;i<updatepindividual.length;i++){
         if(updatepindividual[i].checked){
             msg.p_individual = updatepindividual[i].value;
         }
     };
     var updatepscoringway = $("input[type='radio'][name='updatepscoringway']");
     for(var i=0;i<updatepscoringway.length;i++){
         if(updatepscoringway[i].checked){
             msg.p_scoringway = updatepscoringway[i].value;
         }
     };

     msg.appName="project_updateAssessmentProject";
     serverFromJSONData(msg,true).then(function (success) {
         if(success.msgState == 200){
             areaTable.api().ajax.reload();
             getProjectName();
             informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功！");
             $('#updateModal').modal("hide");
         }else{
             informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
         }
     }),function (error) {
         console.log("访问服务器发生错误，请稍后再试!",error);
     };
 }

/*修改：添加新数据*/
function updateRules() {
    var msg = {};
    msg.pk_id = $("#updateID").val();
    msg.m_name = $("#updatemname").val();
    msg.m_classscoring = $("#updatemclassscoring").val();
    msg.m_individualscoring = $("#updatemindividualscoring").val();
    msg.m_remark = $("#updatemremark").val();
    var updatemscoringway = $("input[type='radio'][name='updatemscoringway']");
    for(var i=0;i<updatemscoringway.length;i++){
        if(updatemscoringway[i].checked){
            msg.m_scoringway = updatemscoringway[i].value;
        }
    };

    msg.appName="rules_updateInspectionRules";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            $('#updateModal').modal('hide');
            cleanModal();
            areaTable.api().ajax.reload();
            informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功！");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/*删除提示*/
function deleteModal(id,delete_model_id) {
    informationAlert_confirmAndCancelButton("deleteProject("+id+","+delete_model_id+")","是否要删除该考核项？");
}
/*删除*/
function deleteProject(id,delete_model_id) {
    var msg = {};
    msg.id = id;
    msg.delete_model_id = delete_model_id;
    msg.appName="project_deleteAssessmentProject";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            areaTable.api().ajax.reload();
            getProjectName();
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功！");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

 //--------------------------------------------------------------------------------------------------------------------------
/*获取模块名称和id*/
function getProjectName(){
	$("#gender").html('');
    var msg = {};
    msg.modelID = getUrlParam('modelID')+"_modelID";
    msg.appName="project_findAssessmentProjectByModelID";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
           var html = '';
           var projectName = success.data;
           for(var i = 0;i < projectName.length;i++){
               var modelID = projectName[i].pk_id;
               var modelName = projectName[i].p_name;
               html += '<label class="btn btn-default" data-toggle-class="btn-primary"' +
                       ' data-toggle-passive-class="btn-default" onclick="setNewProjectID('+modelID+')">'+modelName+'</label>';
           }
           var  all = '<label class="btn btn-default" data-toggle-class="btn-primary"' +
                      ' data-toggle-passive-class="btn-default" onclick="setNewProjectID()">所有</label>'
           $("#gender").html(all+html);
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function setNewProjectID(id){
    newProjectID = id;
    refresh();
}
function refresh() {
    areaTable.api().ajax.reload();
}

/*获取URL地址参数*/
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}
