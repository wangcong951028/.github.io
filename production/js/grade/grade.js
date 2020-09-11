
$(function(){
    findParameters();
    gradeList();//成绩列表
    findInfo();
})


/*清理模态框*/
function cleanModal(){
    findParameters();
    $("#studentCode").val("");
    $("#studentName").val("");
    $("#totalScore").val("");
    $("#score").val("");
    $("#uploadFile").val("");
    $("#uploadInfo").html('<option value="-1">------------  请先选择学期  ------------</option>');
}

var areaTable;
/*列表*/
function  gradeList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    /*查询参数*/
                    data.studentCode = $("#keyWord").val();
                    data.tremID = $("#tremName").val();
                    data.infoID = $("#infoName").val();
                    data.courseID = $("#courseName").val();
                    data.classID = $("#className").val();
                    //data.iscurrentterm = 1;
                    data.appName = "grade_findTeacherGrade";
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
                        return '<input type="checkbox" name="table_records" class="flat" id="checkbox-all-' + full.pk_id + '" value="' + full.pk_id + '" />';
                    }
                },*/
                {
                    "targets": -1,
                    render: function (data, type, full, meta) {
                        return '<a class="btn btn-info btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="updateGrade('+full.pk_id+')"><i class="fa fa-pencil">修改</i></a>' +
                            '<a class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="deleteModal('+full.pk_id+','+full.fk_studentID+')"><i class="fa fa-trash-o">删除</i></a>';
                    }
                }]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

/*添加*/
function  saveGrade() {
	
    /*获取参数*/
    var studentName = $("#studentName").val();
    var studentCode = $("#studentCode").val();
    var cousreid = $("#cousreSelect").val();
    var score = $("#score").val();
    var totalScore = $("#totalScore").val();
    var infoSelect = $("#infoSelect").val();
	var cousrename = $("#course_"+cousreid).html();
	var infoname = $("#info_"+infoSelect).html();
	
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
    msg.s_StudentName = studentName;
    msg.studentCode = studentCode;
    msg.s_CourseID = cousreid;
    msg.s_Score = score;
    msg.s_totalScore = totalScore;
    msg.fk_examInfoID = infoSelect;
	msg.coursename = cousrename;
	msg.infoname = infoname;
	msg.type = type_mesg;

    msg.appName="grade_saveGrade";

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

/*修改成绩：查询到当前数据*/
function  updateGrade(id) {

    // 2、接口请求参数组装
    var msg = {};
    msg.id = id
    msg.appName="grade_findGradeById";

    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            var grade = success.data;
            $("#updateID").val(grade[0].pk_id);
            $("#updateStudentID").val(grade[0].fk_studentID);
            $("#updateStudentName").val(grade[0].s_StudentName);
            $("#updateStudentCode").val(grade[0].s_xgh);
            $("#updateCousreSelect").html('<option value="'+grade[0].s_CourseID+'">'+grade[0].courseName+'</option>');
            $("#updateScore").val(grade[0].s_Score);
            $("#updateTotalScore").val(grade[0].s_totalScore);
            $("#updateInfoSelect").html('<option value="'+grade[0].fk_examInfoID+'">'+grade[0].infoName+'</option>');

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

/*修改成绩：把新数据添加进去*/
 function newGrade() {

     // 2、接口请求参数组装
     var msg = {};
     var updateID = $("#updateID").val();
     var updateStudentID = $("#updateStudentID").val();
     var updateStudentName = $("#updateStudentName").val();
     var updateCousreSelect = $("#updateCousreSelect").val();
     var updateScore = $("#updateScore").val();
     var updateTotalScore = $("#updateTotalScore").val();
     var updateInfoSelect = $("#updateInfoSelect").val();

     msg.pk_id = updateID;
     msg.fk_studentID = updateStudentID;
     msg.s_StudentName = updateStudentName;
     msg.s_CourseID = updateCousreSelect;
     msg.s_Score = updateScore;
     msg.s_totalScore = updateTotalScore;
     msg.fk_examInfoID = updateInfoSelect;

     msg.appName="grade_updateGrade";

     serverFromJSONData(msg,true).then(function (success) {
         if(success.msgState == 200){
             $('#updateModal').modal('hide');
             areaTable.api().ajax.reload();
             informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功!");
         }else{
             informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
         }
     }),function (error) {
         console.log("访问服务器发生错误，请稍后再试!",error);
     };
}

/*删除提示*/
function deleteModal(id,sub_id){
    informationAlert_confirmAndCancelButton("deleteGrade("+id+","+sub_id+")","是否要删除该条成绩记录？");
}

/*删除*/
function  deleteGrade(id,sub_id) {
    // 2、接口请求参数组装
    var msg = {};
    var list = new Array();
    list[0] = id;
    msg.ids = list;
	msg.subid = sub_id;
    msg.appName="grade_deleteGrade";

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
//-----------------------------------------------------------------------------------------------------------

var selectInfoName;
/**获取：班级、考试场次、学期、科目信息*/
function  findParameters() {
    var param = {};
    // 1、公共参数组装
    param.appKey = "aGFuZHlDYW1wdXM=";
    param.appSecret ="1234567890abcedefgh";
    var time = new Date().getTime();
    param.time = time;
    // 2、接口请求参数组装
    var msg = {};
    msg.appName="grade_findParameters";
    /*msg.index = 1;*/
    var paramJsonMsg = JSON.stringify(msg);
    param.param =  paramJsonMsg;
    // 3、生成签名
    var temp = 'appKey=aGFuZHlDYW1wdXM=&appSecret=1234567890abcedefgh&param='+paramJsonMsg+'&time=' + time;
    param.sign = hex_md5(temp);
    // 4、对整个参数进行加密
    var jsonStr = JSON.stringify(param);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        success: function (success) {
            if(success.msgState == 200){
                var htmlTerm = '';
                var htmlClass = '';
                var htmlCourse_1 = '';
				var htmlCourse_2 = '';
                var htmlInfo = '';
                var selectTermName = success.data[0];
                selectInfoName = success.data[1];
                var selectClassName = success.data[2];
                var selectCourseName = success.data[3];

                for(var i=0;i<selectTermName.length;i++){
                    htmlTerm += "<option value='" + selectTermName[i].pk_ID + "'>" + selectTermName[i].t_term + "</option>";
                }
                for(var i=0;i<selectClassName.length;i++){
                    htmlClass += "<option value='" + selectClassName[i].pk_DepID + "'>" + selectClassName[i].className + "</option>";
                }
                for(var i=0;i<selectCourseName.length;i++){
                    htmlCourse_1 += "<option value='" + selectCourseName[i].pk_id + "'>" + selectCourseName[i].c_name + "</option>";
					htmlCourse_2 += "<option value='" + selectCourseName[i].pk_id + "' id='course_"+selectCourseName[i].pk_id+"'>" + selectCourseName[i].c_name + "</option>";
                }for(var i=0;i<selectInfoName.length;i++){
                    htmlInfo += "<option value='" + selectInfoName[i].pk_ID + "'>" + selectInfoName[i].i_ExamName + "</option>";
                }
                $("#tremName").html('<option value="-1">----- 请选择学期 -----</option>'+htmlTerm);
                $("#className").html('<option value="-1">----- 请选择班级 -----</option>'+htmlClass);
                $("#courseName").html('<option value="-1">----- 请选择科目 -----</option>'+htmlCourse_1);

                $("#cousreSelect").html('<option value="-1">----------------  请选择科目  ----------------</option>'+htmlCourse_2);

            }
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*考试场次*/
function  findInfo() {
    var param = {};
    // 1、公共参数组装
    param.appKey = "aGFuZHlDYW1wdXM=";
    param.appSecret ="1234567890abcedefgh";
    var time = new Date().getTime();
    param.time = time;
    // 2、接口请求参数组装
    var msg = {};
    msg.appName="examInfo_findExamInfo";
    msg.index = 999999999
    msg.length = 0;
    msg.flag = 1;
    var paramJsonMsg = JSON.stringify(msg);
    param.param =  paramJsonMsg;
    // 3、生成签名
    var temp = 'appKey=aGFuZHlDYW1wdXM=&appSecret=1234567890abcedefgh&param='+paramJsonMsg+'&time=' + time;
    param.sign = hex_md5(temp);
    // 4、对整个参数进行加密
    var jsonStr = JSON.stringify(param);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        success: function (success) {
        	var info = success.data.data;
        	var htmlInfo = '';
            if(success.msgState == 200){
            	if(info.length > 0){
            		for(var i=0;i<info.length;i++){
            			htmlInfo += '<option value="'+info[i].pk_ID+'" id="info_'+info[i].pk_ID+'">'+info[i].i_ExamName+'</option>';
            		}
            	}
            }
            $("#infoSelect").html('<option value="-1">----------------  请选择考试场次  ----------------</option>'+htmlInfo);
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

function ChangeExampleSelect(index) {
    var html='';
    for (var i = 0; i < selectInfoName.length; i++) {
        if(index==selectInfoName[i].fk_TermID) {
            html += '<option value="' + selectInfoName[i].pk_ID + '">' + selectInfoName[i].i_ExamName + '</option>';
        }
    }
    $("#infoName").html(html+"<option value=\"-1\">----- 请先选择学期 -----</option>");
}


