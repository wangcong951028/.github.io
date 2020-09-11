var areaTable;
var head="";
$(function () {
    infoList();
    findTerm();
	
	$("input:radio[name='export']").change(function (){
		var md=$("input:radio[name='export']:checked").val();
		console.log(md);
		if($("input:radio[name='export']:checked").val()==1){
			exportModalByClass();
		}else{
			exportModalByGrade();
		}
           
    });
	
	
})

/*清理模态框*/
function cleanModal(){
    findTerm();
    $("#endTime").val("");
    $("#info_Name").val("");
    $("#beginTime").val("");
}

/*列表*/
function infoList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable-checkbox').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    /*查询参数*/
                    data.infoName = $("#infoName").val()
                    data.termName = $("#tremName").val();

                    data.appName = "examInfo_findExamInfo";
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
                /*{
                    "targets": 1,
                    "orderable": false,
                    "className": 'select-checkbox',
                    render: function (data, type, full, meta) {
                        return '<input type="checkbox" name="table_records" class="flat" id="checkbox-all-' + full.pk_ID + '" value="' + full.pk_ID + '" />';
                    }
                },*/
                {
                    "targets": -1,
                    render: function (data, type, full, meta) {
                        return '<a class="btn btn-info btn-xs" href="javascript:;"  data-key="' + 10000 + '"  onclick="updateInfo(' + full.pk_ID + ')"><i class="fa fa-pencil"></i>修改</a>' +
                            '<a class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + 10000 + '"  onclick="exportModalShow()"><i class="fa fa-pencil"></i>模板导出</a>' +
                         '<a class="btn btn-info btn-xs" href="javascript:;"  data-key="' + 10000 + '"  onclick="uploadModel(' + full.pk_ID + ',\''+full.i_ExamName+'\')"><i class="fa fa-pencil"></i>导入成绩</a>' ;
                    }
                }]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

/*添加*/
function  saveInfo() {
    // 2、接口请求参数组装
    var msg = {};
    var infoName = $("#info_Name").val();
    if(infoName == "" || infoName == null || infoName.length>20){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("名称不能大于20个字符!");
    }else{
	    msg.i_ExamName = infoName;
	    msg.i_Sdate = $("#beginTime").val();
	    msg.i_Edate = $("#endTime").val();
	    msg.fk_TermID = $("#termSelect").val();
	    msg.appName="examInfo_saveExamInfo";
	
	    serverFromJSONData(msg,true).then(function (success) {
	        if(success.msgState == 200){
	            $('#myModal').modal('hide');
	            cleanModal();
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

/*修改：先拿到数据*/
function updateInfo(id) {
    // 2、接口请求参数组装
    var msg = {};
    msg.id = id;
    msg.appName="examInfo_findExamInfoById";

    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            var info = success.data;
            $("#updateID").val(info.pk_ID);
            $("#updateSchoolID").val(info.fk_SchoolID);
            $("#updateInfo_Name").val(info.i_ExamName);
            $("#updateBeginTime").val(info.i_Sdate);
            $("#updateEndTime").val(info.i_Edate);
            findTerm(info.fk_TermID);

            $('#updateModal').modal({
                backdrop:false,//false:模式对话框，就是没有关闭模式对话框后面页面都不能点击。
                keyboard:true,//当按下 esc键时关闭模态框，设置为 false 时则按键无效。默认为true
                show:true
            });
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/*修改：添加新数据*/
function newInfo() {
    // 2、接口请求参数组装
    var msg = {};
    msg.pk_ID = $("#updateID").val();
    msg.fk_SchoolID = $("#updateSchoolID").val();
    msg.i_ExamName = $("#updateInfo_Name").val();
    msg.i_Sdate = $("#updateBeginTime").val();
    msg.i_Edate = $("#updateEndTime").val();
    msg.fk_TermID = $("#updateTermSelect").val();

    msg.appName="examInfo_updateExamInfo";

    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            $('#updateModal').modal('hide');
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
function deleteModal(id){

    informationAlert_confirmAndCancelButton("deleteInfo("+id+")","删除该考试信息会导致该考试的成绩一起删除，是否确认删除？");
}

/*删除*/
function deleteInfo(id) {
    $('#deleteMsg').modal('hide');
    // 2、接口请求参数组装
    var msg = {};
    var list = new Array();
    list[0] = id;
    msg.ids = list;
    msg.appName="examInfo_deleteExamInfo";

    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            areaTable.api().ajax.reload();
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功!");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/*查看学期信息*/
function  findTerm(newID) {

    // 2、接口请求参数组装
    var msg = {};
    msg.appName="term_findTerm";

    serverFromJSONData(msg,true).then(function (success) {
        var html = '<option value="-1">------------------------  请选择学期  ----------------------</option>';
        var term = success.data.data;
        for(var i=0;i<term.length;i++){
            if(newID == term[i].pk_ID){
                html += "<option value='" + newID + "' selected>" + term[i].t_term + "</option>";
            }else{
                html += "<option value='" + term[i].pk_ID + "'>" + term[i].t_term + "</option>";
            }
        }
        if(newID != null){
            $("#updateTermSelect").html(html);
        }else{
            $("#termSelect").html(html)
        }
        projectFind();
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/*批量操作*/
function deleteAll(){
    $("input[type='checkbox']:checked").each(function () {
        console.debug(this.value);
    });
}


//------------------------------------------------------导入----------------------------------------------------------------
var jsonObj;
/*导入提示*/
function uploadModel(id,name){
    $("#uploadid").val(id);
	$("#uploadname").val(name);
    $('#uploadModel').modal({
        backdrop:false,//false:模式对话框，就是没有关闭模式对话框后面页面都不能点击。
        keyboard:true,//当按下 esc键时关闭模态框，设置为 false 时则按键无效。默认为true
        show:true
    });
}

/*模板下载按照班级导出*/
function exportModalByClass (){
	//发送请求查询没有录入成绩的班级
    // 2、接口请求参数组装
    var msg = {};
    msg.appName="examInfo_findClassByTermId";

    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            var html='<option value="0">---请选择---</option>';
            
            for(var i =0;i<success.data.length;i++){
            	html+='<option value="'+success.data[i].deptId+'">'+success.data[i].detpName+'</option>';
            }
            
            $("#classShow").html(html);
            
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

//查询科目，选择需要导出的科目
function projectFind(){
	var msg = {};
    msg.appName="course_findCourse";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            var html='';
            var count=0;
            for(var i =0;i<success.data.data.length;i++){
            	if(count==4){
            		html+='</br><label style="width: 15%;margin-left:146px"><input type="checkbox" id="checkbox1"  name="state" value="'+success.data.data[i].c_name+'" style="margin-right: 12px;">'+success.data.data[i].c_name+'</label>';
            		count=1;
            	}else{
            		count++;
            		html+='<label style="width: 15%;margin-left:15px"><input type="checkbox" id="checkbox1"  name="state" value="'+success.data.data[i].c_name+'" style="margin-right: 12px;">'+success.data.data[i].c_name+'</label>';
            	}
            }
            $("#projectShow").html(html);
            
        }else{
        	if(success.msg!="暂无数据!"){
        		informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        	}
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function exportModalShow(){
	$('#exportModal').modal({
        backdrop:false,//false:模式对话框，就是没有关闭模式对话框后面页面都不能点击。
        keyboard:true,//当按下 esc键时关闭模态框，设置为 false 时则按键无效。默认为true
        show:true
    });
}


function uploadGrade() {
	
	var vheckedvalue = $('input[type="checkbox"][name="state"]');
	var type_mesg = "";
	for(var i=0;i<vheckedvalue.length;i++){
			if(vheckedvalue[i].checked){
				if(i<vheckedvalue.length){
						type_mesg += vheckedvalue[i].value;
				}
			}
	}
	
    // 2、接口请求参数组装
    var msg = {};
    var array = new Array();
    msg.file=JSON.stringify(jsonObj);
    msg.keyStr = head;
    msg.termId=$("#uploadid").val();
    var error_grade_msg = $(".fileerrorTip1").html();
    if("您未上传文件，或者您上传文件类型有误！" == error_grade_msg || head==""){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择需要导入的成绩！");
    }else{
		msg.type = type_mesg;
		msg.infoname = $("#uploadname").val();
        msg.appName="grade_upload";
        $("#jinduGIF").html('<img src="../../../production/images/jindu.gif"><br/><span>正在上传中请稍后...</span>');
        $("#uploadButton1").attr({"disabled":"disabled"});
        serverFromJSONData(msg,true).then(function (success) {
            if(success.msgState === 500){
                informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
            }else{
                var jsonDome = success.data;
                if(jsonDome ==null){
                    informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功！");
                }else {
                    var jsonDome1 = [];
                    var jsonDome2 = [];
                    var str1='[';
                    var str="";
                    for (var i = 0; i < jsonDome.length; i++) {
                    	jsonDome[i].file.备注=jsonDome[i].remark;
                        jsonDome1[i] = jsonDome[i].file;
                        str1+='{"姓名":"'+jsonDome1[i].姓名+'","学号":"'+jsonDome1[i].学号+'"';
                        for(var key in jsonDome1[i]){
                        	
                        	if(key=="姓名" || key=="学号" || key=="备注"){
                        		continue;
                        	}
                        	str1+=',"'+key+'":"'+jsonDome1[i][key]+'"';
                        	console.log(jsonDome1[i][key]);
                        }
                        if(i+1==jsonDome.length){
                        	str1+=',"备注":"'+jsonDome1[i].备注+'"}';
                        }else{
                        	
                        	str1+=',"备注":"'+jsonDome1[i].备注+'"},';
                        }
                    }
                    str1+=']';
                    var jsonExport=JSON.parse(str1);
                   
                    downloadExl(jsonExport,"hf_grade",true);
                    informationAlert_OnlyConfirmButton_NOT_REFRESH("有错误数据，请重新导入！请查看错误信息！");
                }
            }
            $("#jinduGIF").html('');
            $("#uploadButton1").removeAttr("disabled");
            $('#uploadModel').modal('hide');
            clean_file();
            head="";
            areaTable.api().ajax.reload();//刷新成绩列表
			document.getElementById("saveForm3").reset();
        }),function (error) {
            console.log("访问服务器发生错误，请稍后再试!",error);
        };
    }
}

function clean_file(){
	var file = $('#uploadGrade');
	file.after(file.clone().val("")); 
	file.remove(); 
	var file2 = $('#uploadGrade');
	importf(file2); 
	document.getElementById("download_type").style.display="";
	$(".showFileName1").html('');
}

/*导出模板*/
function excelTemplet(data){
	var exportData='';
	var qdddd={};
	var exporStr=[];
	var mi=$("#projectShow input[type='checkbox']:checked");
	var classOrGrade=$("#classShow").val()
	if($("#classShow").val()==0 || classOrGrade==null){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择班级或者年级！");
    	return;
    }
	if(mi.length==0){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("请至少选择一个科目！");
    	return;
    }
	if(data.length==0){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("请确认该班级是否已经导入了学生！");
    	return;
    }
	for(var i=0;i<data.length;i++){
		exportData+='{"姓名":"'+data[i].studentName+'","学号":"'+data[i].xgh+'"';
		qdddd.姓名=data[i].studentName;
		for(var j=0;j<mi.length;j++){
			
			exportData+=',"'+$(mi[j]).val()+'【*】":""';
		}
		exportData+=',"备注":"请将*替换成科目总分，并删除掉备注一列"}';
		var qdd=JSON.parse(exportData);
		exporStr.push(qdd);
		exportData='';
	}
    
    downloadExl(exporStr,"templete");
    document.getElementById("templete").click();
}

function downloadError(jsonError){
	//downloadExl(jsonError,"hf");
	console.debug(jsonError);
}


//按照年级去导出模板
function exportModalByGrade(){
	var msg = {};
    msg.appName="examInfo_findGradeByTermId";

    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            var html='<option value="0">---请选择---</option>';
            
            for(var i =0;i<success.data.length;i++){
            	html+='<option value="'+success.data[i].deptId+'">'+success.data[i].detpName+'</option>';
            }
            $("#classShow").html(html);
            
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/*根据部门查询人员数据并且导出模板**/
function exportModalConfirm(){
	var msg = {};
	msg.deptId=$("#classShow").val();
    msg.appName="examInfo_studentListForExam";

    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            excelTemplet(success.data);
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}
