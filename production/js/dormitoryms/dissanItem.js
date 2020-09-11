$(function(){
	disstaItem();
})

function disstaItem() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
					data.begin_time = $("#beginTime").val();
					data.end_time = $("#endTime").val();
					data.dept_id = getUrlParam('deptid');
					data.id = getUrlParam('typeid');
                    /*查询参数*/
                    data.appName = "dismanag_disstaItem";
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
					
                ]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

function jump_down(){
	window.location.href = 'dissta.html';
}

function uploaddisitemhs(){
	var  msg = {};
	msg.begin_time = $("#beginTime").val();
	msg.end_time = $("#endTime").val();
	msg.dept_id = getUrlParam('deptid');
	msg.id = getUrlParam('typeid');
	msg.appName="dismanag_disstaItemUpload";//
	serverFromJSONData(msg,true).then(function (success) {
			if(success.msgState == 200){
				var item = success.data;
				var jsonDome = [];
				for (var i = 0; i < item.length; i++) {
					jsonDome[i] = {
						"学生": item[i].sub_name,
						"班级": item[i].deptname,
						"违纪原因": item[i].type_name,
						"违纪时间": item[i].att_time,
					};
				}
				downloadExl(jsonDome,"itemhs",true);
			}else{
				informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
			}
	}),function (error) {
			console.log("访问服务器发生错误，请稍后再试!",error);
	};
}

//----------------------------------------------------------------------------------------------------------------------------------------

/*获取URL地址参数*/
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}