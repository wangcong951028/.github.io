var areaTable;

$(function(){
	attmentList();
})

/*列表*/
function attmentList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
//                  data.keyword = $("#apartRegion").val();
//                  data.area = $("#seacrh_area").val();
                    /*查询参数*/
                    data.appName = "att_findAttMentAll";
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
                    var str = "";
                    if (full.status == 1) {
                        str = "<span style='color:#31b0d5'>已启用</span>";
                    }else if(full.status == 2) {
                        str = "<span style='color:red;'>未启用</span>";
                    }
                    return str;
                }
            },{
                "targets": 3,
                render: function (data, type, full, meta) {
                    var str = "";
                    if (full.type == 1) {
                        str = "学校大门门禁";
                    }else if(full.type == 2) {
                        str = "宿舍考勤";
                    }
                    return str;
                }
            },
            {
                "targets": -1,
                render: function (data, type, full, meta) {
        			return '<div>' +
        		    '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="updateModal(' + full.id + ')"><i class="fa fa-pencil">修改</i></button>'+
        		    '<button type="button" class="btn btn-danger btn-xs" data-key="' + full.id + '" data-toggle="modal" onclick="deleteModel(' + full.id + ')"><i class="fa fa-pencil">删除</i></button></div></div>';
                }
            }]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

function cleanModal(){
	document.getElementById("saveForm").reset();
}

function saveAtt(stats){
	var radios = $('input[type="radio"][name="state"]');
	var status = "";
	for(var i=0;i<radios.length;i++){
			if(radios[i].checked){
				if(i<radios.length){
						status += radios[i].value;
				}
			}
	}
	var msg = {};
	var tremNo_str = $("#tremNo").val();
	var termNo = tremNo_str.trim()
	var att_type = $("#att_type").val();
	if(termNo == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("机号不能为空！");
	}else if(att_type == -1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择类型！");
	}else{
		msg.termNo = termNo;
		msg.status = status;
		msg.type = att_type;
		msg.appName="att_saveAttManagement";//
	    serverFromJSONData(msg,true).then(function (success) {
	    	if(success.msgState == 200){
	    		if(stats == 1){
	    			$("#myModal").modal('show');
	    		}else if(stats == 2){
	    			$("#myModal").modal('hide');
	    		}
	            areaTable.api().ajax.reload();
				cleanModal();
	            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功！");
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
	        }
	    }),function (error) {
		        console.log("访问服务器发生错误，请稍后再试!",error);
	    };
	}
}

function updateModal(id){
	
	var msg = {};
	msg.id = id;
	msg.appName="att_findAttMentById";//
	serverFromJSONData(msg,true).then(function (success) {
		if(success.msgState == 200){
			var attment = success.data;
			$("#update_id").val(attment.id);
			$("#update_tremNo").val(attment.termNo);
			$("#update_att_type").val(attment.type);
			var status = attment.status;
			if(status == 1){
				$("input[type='radio'][id='update_status1'][value='1']").prop("checked",true);
			}else if(status == 2){
				$("input[type='radio'][id='update_status2'][value='2']").prop("checked",true);
			}
			$("#updateModal").modal('show');
		}else{
			informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
		}
	}),function (error) {
			console.log("访问服务器发生错误，请稍后再试!",error);
	};
}

function update_Att(){
	var radios = $('input[type="radio"][name="update_state"]');
	var status = "";
	for(var i=0;i<radios.length;i++){
			if(radios[i].checked){
				if(i<radios.length){
						status += radios[i].value;
				}
			}
	}
	var msg = {};
	var update_tremNo = $("#update_tremNo").val();
	var termNo = update_tremNo.trim()
	var update_att_type = $("#update_att_type").val();
	var id = $("#update_id").val();
	if(termNo == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("机号不能为空！");
	}else if(update_att_type == -1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择类型！");
	}else{
		msg.id = id;
		msg.termNo = termNo;
		msg.status = status;
		msg.type = update_att_type;
		msg.appName="att_updateAttManagement";//
		serverFromJSONData(msg,true).then(function (success) {
			if(success.msgState == 200){
				$("#updateModal").modal('hide');
				areaTable.api().ajax.reload();
				informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功!");
			}else{
				informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
			}
		}),function (error) {
				console.log("访问服务器发生错误，请稍后再试!",error);
		};
	}
}

function deleteModel(id){
	informationAlert_confirmAndCancelButton("delete_attment("+id+")","是否确认删除？");
}

function delete_attment(id){
	var msg = {};
	msg.id = id;
	msg.appName="att_deleteAttManagement";//
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
