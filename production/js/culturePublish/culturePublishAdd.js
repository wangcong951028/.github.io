/**
 * Created by THD on 2017-07-25.
 */

$(function() {
	findClassAdd();

$("#files").on('change', function(){
        var fill = document.getElementById('fill');
        fill.style.width = 0;
        $("#wrapper").hide();
        $("#displayFileName").html(getFileName($("#files").val()));
        
    });

});

//获取文件路径
function getPath(obj) {
	if(obj) {

		if(window.navigator.userAgent.indexOf("MSIE") >= 1) {
			obj.select();

			return document.selection.createRange().text;
		} else if(window.navigator.userAgent.indexOf("Firefox") >= 1) {
			if(obj.files) {

				return obj.files.item(0).getAsDataURL();
			}
			return obj.value;
		}
		return obj.value;
	}
}

//验证发布文化展示参数
function publicCulture() {

	if($("#titleAdd").val() == null || $("#titleAdd").val().length == 0) {
		informationAlert_OnlyConfirmButton_NOT_REFRESH('主题不能为空');
		return;
	}
	if($("#myTxtAdd").val() == null || $("#myTxtAdd").val().length == 0) {
		informationAlert_OnlyConfirmButton_NOT_REFRESH('文化展示内容不能为空');
		return;
	}
	if($("#classNamessAdd").val() == -1 || $("#classNamessAdd").val().length == 0) {
		informationAlert_OnlyConfirmButton_NOT_REFRESH('班级名称不能为空');
		return;
	}
	if($("#intervalTimeAdd").val() == -1 || $("#intervalTimeAdd").val().length == 0) {
		informationAlert_OnlyConfirmButton_NOT_REFRESH('请设置轮播间隔时间');
		return;
	}
	if($("#imgAddLogo").attr("src") == null || $("#imgAddLogo").attr("src").length == 0) {
		informationAlert_OnlyConfirmButton_NOT_REFRESH('请选择logo图片哦');
		return;
	}
	if($("#imgAddsBottom").attr("src") == null || $("#imgAddsBottom").attr("src").length == 0) {
		informationAlert_OnlyConfirmButton_NOT_REFRESH('请选择背景图片');
		return;
	}
	if($("#editor-oneAdd").html() == null || $("#editor-oneAdd").html().length == 0) {
		informationAlert_OnlyConfirmButton_NOT_REFRESH('轮播内容不能为空');
		return;
	}
	

	var msg = {};
	msg.appName = "culture_cultureAdd";
	msg.title = $("#titleAdd").val();
	msg.myTxt = $("#myTxtAdd").val();
	msg.logoUrl = $("#imgAddLogo").attr("src");
	msg.bottomUrl = $("#imgAddsBottom").attr("src");
	msg.info = $("#editor-oneAdd").html();
	msg.intervalTime = $("#intervalTimeAdd").val();
	msg.pk_classId = $("#classNamessAdd").val();
	msg.videoUrl=resp;
	AddCulture(msg);
}

/**
 * 新增文化展示
 * @constructor
 */
function AddCulture(msg) {
	serverFromJSONData(msg, true).then(function(success) {
			if(success.msgState == 200) {
				informationAlert_OnlyConfirmButton_NOT_REFRESH('创建文化展示成功');
				reSetCulture(); //刷新当前页面
				
			} else {
				informationAlert_OnlyConfirmButton_NOT_REFRESH("创建文化展示失败");
			}
			refresh();
		}),
		function(error) {
			console.log("访问服务器发生错误，请稍后再试!", error);
		};
}
/**重置信息**/
function reSetCulture() {
	$("#titleAdd").val("");
	$("#classNamessAdd").val("-1");
	$("#myTxtAdd").val("");
	$("#editor-oneAdd").html("");
	$("#imgAddLogo").attr("src", "");
	$("#imgAddShowsBottom").attr("src", "");
	$("#imgAddShowLogo").attr("src", "");
	$("#imgAddsBottom").attr("src", "");
	$("#intervalTimeAdd").val("-1");
	resp="";
	$("#fill").html("");
}

/***************公共的方法*******************/
$("#imgTestLogo").change(function() {
	runs(this, function(data) {
		$("#imgAddLogo").attr('src', data);
		$("#imgAddShowLogo").attr('src', data);
	});

});

function runs(input_file, get_data) {
	/*input_file：文件按钮对象*/
	/*get_data: 转换成功后执行的方法*/
	if(typeof(FileReader) === 'undefined') {
		informationAlert_OnlyConfirmButton_NOT_REFRESH("抱歉，你的浏览器不支持 FileReader，不能将图片转换为Base64，请使用现代浏览器操作！");
	} else {
		try {
			/*图片转Base64 核心代码*/
			var file = input_file.files[0];
			//这里我们判断下类型如果不是图片就返回 去掉就可以上传任意文件
			if(file != undefined){
				if(!/image\/\w+/.test(file.type)) {
					informationAlert_OnlyConfirmButton_NOT_REFRESH("请确保文件为图像类型");
					return false;
				}
				var reader = new FileReader();
				reader.onload = function() {
					get_data(this.result);
				}
				return reader.readAsDataURL(file);
			}
			
		} catch(e) {
			informationAlert_OnlyConfirmButton_NOT_REFRESH('图片转Base64出错啦！' + e.toString())
		}
	}
}

/*背景图片使用*/
$("#imgTestsBottom").change(function() {
	run(this, function(data) {
		$("#imgAddsBottom").attr('src', data);
		$("#imgAddShowsBottom").attr('src', data);
	});

});

function run(input_file, get_data) {
	/*input_file：文件按钮对象*/
	/*get_data: 转换成功后执行的方法*/
	if(typeof(FileReader) === 'undefined') {
		informationAlert_OnlyConfirmButton_NOT_REFRESH("抱歉，你的浏览器不支持 FileReader，不能将图片转换为Base64，请使用现代浏览器操作！");
	} else {
		try {
			/*图片转Base64 核心代码*/
			var file = input_file.files[0];
			//这里我们判断下类型如果不是图片就返回 去掉就可以上传任意文件
			if(file != undefined){
				if(!/image\/\w+/.test(file.type)) {
					informationAlert_OnlyConfirmButton_NOT_REFRESH("请确保文件为图像类型");
					return false;
				}
				var reader = new FileReader();
				reader.onload = function() {
					get_data(this.result);
				}
				return reader.readAsDataURL(file);
			}
			
		} catch(e) {
			informationAlert_OnlyConfirmButton_NOT_REFRESH('图片转Base64出错啦！' + e.toString())
		}
	}
}

/*查找班级*/
function findClassAdd(value) {
	var msg = {};
	msg.appName = "homeWork_findClassName";
	serverFromJSONData(msg, true).then(function(success) {
			var html = '<option value="-1">----- 请选择班级 -----</option>';
			var course = success.data;
			for(var i = 0; i < course.length; i++) {
				html += "<option value='" + course[i].pk_DepID + "'>" + course[i].className + "</option>";
			}
			$("#classNamessAdd").html(html);
		}),
		function(error) {
			console.log("访问服务器发生错误，请稍后再试!", error);
		};
}
//视频上传
function uploadUser(){
	//前端大小验证判定
	var f = document.getElementById("files").files[0].size;
    if(f>104857600){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("请上传小于100M的视频！");
		return;
    }
    //验证是否是mp4格式的视频
    var nam=$("#files").val().lastIndexOf(".");
	var na =$("#files").val().substring(nam+1);
    if(na!="mp4"){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("请上传MP4格式的视频！");
		return;
    }
	/*** 查询请求的接口对应的服务器信息 ***/
    var param = {};
    param.appName="interface_queryInterfaceServerInfo";
    param.interfaceName = 'culture/addVedio.do';
    serverFromJSONData(param,true).then(function (response) {
    	
        if (response.msgState == 200){
            /***点击上传且返回正确的数据时，开始显示进度条 ***/
            $("#wrapper").show();
            uploadFile("/apis/SC/"+param.interfaceName);
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("获取上传文件接口对应的服务器数据失败，请稍后再试!");
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}

//获取文件名字
function getFileName(o){
    var pos=o.lastIndexOf("\\");
    return o.substring(pos+1);
}
//file.length()