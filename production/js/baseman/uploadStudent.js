$(function(){
        $(".input-fileup").on("change","input[type='file']",function(){
            var filePath=$(this).val();
            if(filePath.indexOf(".xlsx")!=-1 || filePath.indexOf(".xlsx")!=-1){
                $(".fileerrorTip1").html("").hide();
                var arr=filePath.split('\\');
                var fileName=arr[arr.length-1];
                $(".showFileName1").html(fileName);
            }else{
                $(".showFileName1").html("");
                $(".fileerrorTip1").html("您未上传文件，或者您上传文件类型有误！").show();
                return false
            }
        })
    });

function uploadModel(id,name){
    $('#uploadModel').modal({
        backdrop:false,//false:模式对话框，就是没有关闭模式对话框后面页面都不能点击。
        keyboard:true,//当按下 esc键时关闭模态框，设置为 false 时则按键无效。默认为true
        show:true
    });
}

function uploadGrade(){
	if(jsonObj.length == 0){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择需要修改的学生信息！");
		return;
	}
	var list = new Array();
	for(var i=0;i<jsonObj.length;i++){
		var obj = new Object();
		obj.xgh = jsonObj[i].学号;
		obj.name = jsonObj[i].姓名;
		obj.status = jsonObj[i].学生状态;
		obj.type = jsonObj[i].是否住校;
		obj.deptName = jsonObj[i].班级名称;
		list.push(obj);
	}
	console.log(list);
	console.log(jsonObj[0].姓名);
	$("#jinduGIF").html('<img src="../../../production/images/jindu.gif"><br/><span>正在上传中请稍后...</span>');
    $("#uploadButton1").attr({"disabled":"disabled"});
	var msg = {};
	msg.list = list;
	msg.appName="user_batchUpStudentMsg";
	serverFromJSONData(msg,true).then(function (success) {
            console.log(success);
            var datas = success.data;
            if(datas.length>0){
            	var jsonData = [];
            	for(var i=0;i<datas.length;i++){
            		jsonData[i] = {
            			"学号" : datas[i].xgh == null ? "" : datas[i].xgh,
	            		"姓名" : datas[i].name == null ? "" : datas[i].name,
	            		"班级名称" : datas[i].deptName == null ? "" : datas[i].deptName,
	            		"是否住校" : datas[i].type == null ? "" : datas[i].type,
	            		"学生状态" : datas[i].status == null ? "" : datas[i].status,
	            		"备注" : datas[i].note == null ? "" : datas[i].note
            		}
            	}
//          	console.log(jsonData);
            	downloadExl(jsonData,"hf_s_sub",true);
            }else{
            	$("#jinduGIF").html('');
	            $("#uploadButton1").removeAttr("disabled");
	            $('#uploadModel').modal('hide');
	            clean_file();
            	informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功！");
            	var areaTable = sessionStorage.getItem("areaTable");
            	window.history.go(0)
            }
            $("#jinduGIF").html('');
            $("#uploadButton1").removeAttr("disabled");
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
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

function uploadTemp(){
	var jsonData = [];
	jsonData[0] = {
            			"学号" : "123456",
	            		"姓名" : "张三",
	            		"班级名称" : "2018级2班",
	            		"是否住校" : "1",
	            		"学生状态" : "1",
	            		"备注" : "请填写正确的姓名和学号，是否住校(1走读，0住校)，学生状态(1在校,2离校,3休学)"
            		}
	downloadExl(jsonData,"hr_temp",true);
}
