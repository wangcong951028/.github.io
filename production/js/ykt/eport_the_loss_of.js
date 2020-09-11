var areaTable;
$(function () {
    eport_the_loss_of();
})

/*列表*/
function eport_the_loss_of() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.studentName = $("#studentName").val();
                    /*查询参数*/
                    data.appName = "ykt_findStudentItems";
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
                    "targets": -1,
                    render: function (data, type, full, meta) {
                        return '<a class="btn btn-info btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="updateCar_prompt(\''+ full.studentCode +'\')"><i class="fa fa-pencil">一卡通挂失</i></a>';
                        /* +'<a class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="deleteModal(' + full.pk_id + ')"><i class="fa fa-trash-o">删除</i></a>';*/
                    }
                },
                {
                    "targets": 3,
                    render: function (data, type, full, meta) {
                    	if(full.note == 40){
                    		return "<span style='color:#5bc0de'>正常</span>";
                    	}else if(full.note == 70){
                    		return "<span style='color:green'>挂失</span>";
                    	}else{
                    		return "<span style='color:red'>异常</span>";
                    	}
                    }
                }]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

function common(msg){
    var param = {};
    // 1、公共参数组装
    param.appKey = "aGFuZHlDYW1wdXM=";
    param.appSecret ="1234567890abcedefgh";
    var time = new Date().getTime();
    param.time = time;

    /*msg.index = 1;*/
    var paramJsonMsg = JSON.stringify(msg);
    param.param =  paramJsonMsg;
    // 3、生成签名
    var temp = 'appKey=aGFuZHlDYW1wdXM=&appSecret=1234567890abcedefgh&param='+paramJsonMsg+'&time=' + time;
    param.sign = hex_md5(temp);
    // 4、对整个参数进行加密
    var jsonStr = JSON.stringify(param);
    return jsonStr;
}

function updateCar_prompt(xgh){
	$("#student_code").val(xgh);
	$("#myModal").modal("show");
}

/*挂失*/
function updateCar(){
    // 2、接口请求参数组装
    var msg = {};
    msg.studentCode = $("#student_code").val();
    msg.appName="ykt_reportTheLossOfTheCard";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        success: function (success) {
            if(success.msgState == 200){
            	if(success.data == 1){
            		informationAlert_OnlyConfirmButton_NOT_REFRESH("挂失成功！");
            	}else{
            		informationAlert_OnlyConfirmButton_NOT_REFRESH("挂失失败！");
            	}
                $('#myModal').modal('hide');
                cleanModal();
                areaTable.api().ajax.reload();
            }else{
                informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
            }
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*导出*/
function upload_rtlow(){
	// 2、接口请求参数组装
    var msg = {};
    msg.beginTime = $("#beginTime").val();
    msg.endTime = $("#endTime").val();
    msg.appName="ykt_uploadRtlow";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        success: function (success) {
            if(success.msgState == 200){
            	var rtlow_item = success.data;
            	if(rtlow_item != null || rtlow_item.length>0){
            		var rtlow_json = [];
            		for(var i=0;i<rtlow_item.length;i++){
            			if(rtlow_item[i].deptName == null){
            				rtlow_item[i].deptName = '-'
            			}
            			rtlow_json[i] = {
            				'备注':rtlow_item[i].r_name,
            				'学号':rtlow_item[i].r_xgh,
            				'班级':rtlow_item[i].deptName,
            				'操作人':rtlow_item[i].r_operation,
            				'挂失时间':rtlow_item[i].r_time
            			}
            		}
            		downloadExl(rtlow_json,"rtlow",true);
            		$('#uploadModal').modal('hide');
                	cleanModal();
            	}else{
            		informationAlert_OnlyConfirmButton_NOT_REFRESH("暂无挂失信息!");
            	}
            }else{
                informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
            }
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}
/*清空*/
function cleanModal(){
	document.getElementById("uploadForm").reset();
}
