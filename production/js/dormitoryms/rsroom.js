var areaTable;

$(function(){
	rsroomList();
})

/*列表*/
function rsroomList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable-checkbox').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.keyword = $("#keyWords").val();
                    /*查询参数*/
                    data.appName = "rsm_findRSRoom";
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
               /*  {
                	"targets": 1,
                	"orderable": false,
                	"className": 'select-checkbox',
                	render: function (data, type, full, meta) {
                		return '<input type="checkbox" name="table_records" class="flat" id="checkbox-all-' + full.id + '" value="' + full.id + '" />';
                	}
                }, */{
                    "targets": -1,
                    render: function (data, type, full, meta) {
                        return '<div>' +
                            '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="updateModal(' + full.id + ')"><i class="fa fa-pencil">修改</i></button>' +
                            '<button class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="deleteModal(' + full.id + ')"><i class="fa fa-trash-o">删除</i></button>' +
                            '</div>';
                    }
                }]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

function cleanModal(){
	document.getElementById('saveForm').reset();
}

/*新增*/
function save_rsroom(stats){
	var msg = {};
	var name = $("#name").val();
	var beds = $("#beds").val();
	var amount = $("#amount").val();
	if(name == ""){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("名称不能为空！");
	}else if(beds == ""){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("床位数不能为空！");
	}else if(amount == ""){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("金额不能为空！");
	}else{
		msg.name = name;
		msg.beds = beds;
		msg.amount = amount;
		msg.appName="rsm_saveRSRoom";//
		serverFromJSONData(msg,true).then(function (success) {
			if(success.msgState == 200){
				if(stats == 1){
					$("#myModal").modal('show');
				}else if(stats == 2){
					$("#myModal").modal('hide');
				}
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

/*修改：获取原有数据*/
function updateModal(id){
	var msg = {};
	msg.id = id;
	msg.appName="rsm_findRSRoomById";//
	serverFromJSONData(msg,true).then(function (success) {
		if(success.msgState == 200){
			var rsroom = success.data;
			$("#uid").val(rsroom.id);
			$("#uname").val(rsroom.name);
			$("#ubeds").val(rsroom.beds);
			$("#uamount").val(rsroom.amount);
			$("#updateModal").modal("show");
		}else{
				informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
		}
	}),function (error) {
				console.log("访问服务器发生错误，请稍后再试!",error);
	};
}

/*修改：添加新数据*/
function updatersroom(){
	var msg = {};
	var id = $("#uid").val();
	var name = $("#uname").val();
	var beds = $("#ubeds").val();
	var amount = $("#uamount").val();
	if(name == ""){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("名称不能为空！");
	}else if(beds == ""){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("床位数不能为空！");
	}else if(amount == ""){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("金额不能为空！");
	}else{
		msg.id = id;
		msg.name = name;
		msg.beds = beds;
		msg.amount = amount;
		msg.appName="rsm_updateRSRoom";//
		serverFromJSONData(msg,true).then(function (success) {
			if(success.msgState == 200){
				$("#updateModal").modal('hide');
				areaTable.api().ajax.reload();
				informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功！");
			}else{
					informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
			}
		}),function (error) {
					console.log("访问服务器发生错误，请稍后再试!",error);
		};
	}
}

function deleteModal(id){
		informationAlert_confirmAndCancelButton('deletersroom('+id+')','是否确认删除？');
}

function deletersroom(id){
		var msg = {};
		msg.id = id;
		msg.appName="rsm_deleteRSRoom";//
		serverFromJSONData(msg,true).then(function (success) {
			if(success.msgState == 200){
				areaTable.api().ajax.reload();
				informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功！");
			}else{
					informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
			}
		}),function (error) {
					console.log("访问服务器发生错误，请稍后再试!",error);
		};
}