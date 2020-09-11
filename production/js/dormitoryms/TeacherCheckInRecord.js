var areaTable;

$(function () {
    init();
    
    $("#myButton").click(function(){
    	areaTable.api().ajax.reload();
    })
});


/**
 * 初始化列表
 */
function init() {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                	data.name=$("#teacherName").val();
                	data.xgh=$("#teacherXgh").val();
                	
                    //添加额外的参数传给服务器
                    data.appName="teacherCheckIn_getCheckInRecord";
                    
                    return buildRequestParam(data);
                },
                "dataSrc": function (json) {
                    //自定义格式
                    json.iTotalRecords = json.data.recordsTotal;
                    json.recordsFiltered = json.data.recordsTotal;
                    json.error = json.data.error;
                    json.draw = json.data.draw;

                    tocken=json.data.data;
                    return json.data.data;
                },
                "beforeSend": function (xhr) {
                    xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                    xhr.setRequestHeader("token", static_token);
                }
            }
            ,
            "columnDefs": [
            	{
                    "targets": -2,
                    render: function (data, type, full, meta) {
                    	if(full.type==1){
                    		return '<span style="color:blue;">入住</span>';
                    	}else if(full.type==2){
                    		return '<span style="color:green;">调宿</span>';
                    	}else{
                    		return '<span style="color:red;">退宿</span>';
                    	}
                    	
                    }
                },/*{
	                "targets": 2,
	                render: function (data, type, full, meta) {
	               		return '<span id="name_'+full.pk_id+'">'+full.name+'</span>';
                	}
                },{
	                "targets": 3,
	                render: function (data, type, full, meta) {
	               		return '<span id="xgh_'+full.pk_id+'">'+full.xgh+'</span>';
                	}
                },{
	                "targets": 4,
	                render: function (data, type, full, meta) {
	               		if(full.sex==1){
	               			return '<span id="sex_'+full.pk_id+'">男</span>';
	               		}else{
	               			return '<span id="sex_'+full.pk_id+'">女</span>';
	               		}
					}

	            },{
	                "targets": 5,
	                render: function (data, type, full, meta) {
						var roomname = '';
						if(full.roomname == null){
							roomname = '';
						}else{
							roomname = full.roomname;
						}
						return '<span id="room_'+full.pk_id+'">'+roomname+'</span>';
					}

	            },{
		                "targets": 9,
		                render: function (data, type, full, meta) {
		                	if(full.dormNum == null){
		                		full.dormNum = '';
		                	}
	               			return '<span id="dor_'+full.pk_id+'">'+full.dormNum+'</span>';
	                }
	
	            },{
		                "targets": 10,
		                render: function (data, type, full, meta) {
		                	if(full.bedNum == null){
		                		full.bedNum = '';
		                	}
	               			return '<input type="text" id="bed_id_'+full.pk_id+'" hidden="hidden" value="'+full.bed_id+'"/><span id="bed_'+full.pk_id+'">'+full.bedNum+'</span>';
	                }

            }*/]
    });
}

