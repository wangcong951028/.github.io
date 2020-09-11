var areaTable;

$(function(){
	spectionList();
	term_list();
})

/*列表*/
function spectionList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.keyword = $("#keyWords").val();
                    /*查询参数*/
                    data.appName = "ins_findInspection";
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
                            /* '<button class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="deleteModal(' + full.id + ')"><i class="fa fa-trash-o">删除</i></button>' + */
														'<button class="btn btn-info btn-xs" href="javascript:;"  data-key="' +full.id + '"  onclick="jump_page(' + full.id + ')"><i class="fa fa-pencil">添加考核成绩</i></button>' +
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
function saveInspection(status){
	var str_month = $('#month').val();
	var month = str_month.substring(str_month.indexOf("-")+1)
	var name = $('#name').val();
	var quarter_id = $('#quarter').val();
	var quarter_name = $('#quarter_'+quarter_id).html();
	var term = $('#term').val();
	if(name==""){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("任务名称不能为空！");
			return;
	}
	if(term==-1){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择学期！");
			return;
	}
	if(quarter_id==-1){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择季度！");
			return;
	}
	if(quarter_id==1){
		if(month!='01' && month!='02' && month!='03'){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择项对应月份！");
			return;
		}
	}
	if(quarter_id==2){
		if(month!='04' && month!='05' && month!='06'){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择项对应月份！");
			return;
		}
	}
	if(quarter_id==3){
		if(month!='07' && month!='08' && month!='09'){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择项对应月份！");
			return;
		}
	}
	if(quarter_id==4){
		if(month!='10' && month!='11' && month!='12'){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择项对应月份！");
			return;
		}
	}
	var msg = {};
	msg.name = name;
	msg.tremid = term;
	msg.quarter = quarter_name;
	msg.month = str_month;
	msg.appName="ins_saveInspection";//
		serverFromJSONData(msg,true).then(function (success) {
				if(success.msgState == 200){
						informationAlert_OnlyConfirmButton_NOT_REFRESH("新增成功！");
						if(status == 2){
							$("#myModal").modal('hide');
						}
						cleanModal();
						areaTable.api().ajax.reload();
				}else{
						informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
				}
		}),function (error) {
				console.log("访问服务器发生错误，请稍后再试!",error);
		};
}

/*修改：获取原有数据*/
function updateModal(id){
	var msg = {};
		msg.id = id;
		msg.appName="ins_findInspectionById";//
		serverFromJSONData(msg,true).then(function (success) {
				if(success.msgState == 200){
						var inspection = success.data;
						$('#uid').val(inspection.id);
						$('#umonth').val(inspection.month);
						$('#uname').val(inspection.name);
						if(" 一季度 "==inspection.quarter){
								$('#uquarter').val(1);
						}else if(" 二季度 "==inspection.quarter){
							$('#uquarter').val(2);
						}else if(" 三季度 "==inspection.quarter){
							$('#uquarter').val(3);
						}else if(" 四季度 "==inspection.quarter){
							$('#uquarter').val(4);
						}
						$('#uterm').val(inspection.tremid);
						$("#umyModal").modal('show');
				}else{
						informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
				}
		}),function (error) {
				console.log("访问服务器发生错误，请稍后再试!",error);
		};
}

/*修改：添加新数据*/
function updateInspection(){
	var uid = $('#uid').val();
	var str_umonth = $('#umonth').val();
	var umonth = str_umonth.substring(str_umonth.indexOf("-")+1)
	var uname = $('#uname').val();
	var uquarter_id = $('#uquarter').val();
	var uquarter_name = $('#quarter1_'+uquarter_id).html();
	var uterm = $('#uterm').val();
	if(uname==''){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("任务名称不能为空！");
			return;
	}
	if(uterm==-1){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择学期！");
			return;
	}
	if(uquarter_id==-1){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择季度！");
			return;
	}
	if(uquarter_id==1){
		if(umonth!='01' && umonth!='02' && umonth!='03'){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择项对应月份！");
			return;
		}
	}
	if(uquarter_id==2){
		if(umonth!='04' && umonth!='05' && umonth!='06'){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择项对应月份！");
			return;
		}
	}
	if(uquarter_id==3){
		if(umonth!='07' && umonth!='08' && umonth!='09'){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择项对应月份！");
			return;
		}
	}
	if(uquarter_id==4){
		if(umonth!='10' && umonth!='11' && umonth!='12'){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择项对应月份！");
			return;
		}
	}
	var msg = {};
	msg.id = uid;
	msg.name = uname;
	msg.tremid = uterm;
	msg.quarter = uquarter_name;
	msg.month = str_umonth;
	msg.appName="ins_updateInspection";//
		serverFromJSONData(msg,true).then(function (success) {
				if(success.msgState == 200){
						informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功！");
						$("#umyModal").modal('hide');
						areaTable.api().ajax.reload();
				}else{
						informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
				}
		}),function (error) {
				console.log("访问服务器发生错误，请稍后再试!",error);
		};
}

function deleteInspection(){
	msg.appName="";//
		serverFromJSONData(msg,true).then(function (success) {
				if(success.msgState == 200){
						informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功！");
						areaTable.api().ajax.reload();
				}else{
						informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
				}
		}),function (error) {
				console.log("访问服务器发生错误，请稍后再试!",error);
		};
}

function jump_page(id){
	window.location.href = "sanitaryInspection_healthRecord.html?id="+id+"";
}


//-----------------------------------------------------------------------------------------------------------------------
//公共参数
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

/*获取学期信息*/
function term_list() {
    var msg = {};
    msg.appName = "term_findTerm";
    var jsonStr = common(msg);
    $.ajax({
            type: 'POST',
            url: serverBaseUrl,
            data: jsonStr,
            dataType: "json",
            async: false,
            success: function (success) {
                var term = success.data.data;
                var html = '';
                if (term.length > 0) {
                    for (var i = 0; i < term.length; i++) {
                        html += '<option value="'+term[i].pk_ID+'">'+term[i].t_term+'</option>'
                    }
                }
                $("#term").html('<option value="-1">---- 请选择 -----</option>' + html);
								$("#uterm").html('<option value="-1">---- 请选择 -----</option>' + html);
						},
						beforeSend: function (xhr) {
								xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
								xhr.setRequestHeader("token", static_token);
						}
    });
}


