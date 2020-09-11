
$(function(){
	leavew_list();
	getClz();
})


function leavew_list() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.leaveName = $("#keyWords").val();
                    data.leaveSchTime = $("#leaveSchTime").val();
                    data.clzid = $("#clz_id").val();
                    /*查询参数*/
                    data.appName = "leave_findLeavew";
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
                    "targets": 3,
                    render: function (data, type, full, meta) {
                    	return '<span style="color:#5cb85c">'+full.beginDate+'</sapn>';
                    }
                },{
                    "targets": 4,
                    render: function (data, type, full, meta) {
                    	return '<span style="color:#5cb85c">'+full.endDate+'</sapn>';
                    }
                },{
                    "targets": 6,
                    render: function (data, type, full, meta) {
                    	if(full.isShuttle == 1){
                    		return '是';
                    	}else if(full.isShuttle == 0){
                    		return '否';
                    	}
                    }
                },{
                    "targets": 7,
                    render: function (data, type, full, meta) {
                    	var leaveTime = '';
                    	if(full.status == 0){
                    		return '<span style="color:red">未通过</sapn>';
                    	}else if(full.status == 1){
                    		return '<span style="color:#1ABB9C">已通过</sapn>';
                    	}else if(full.status == 2){
                    		return '<span style="color:red">待审批</sapn>';
                    	}
                    }
                },{
                    "targets": 8,
                    render: function (data, type, full, meta) {
                    	var leaveTime = '';
                    	if(full.leaveTime == null){
                    		leaveTime = '';
                    	}else{
                    		leaveTime = full.leaveTime;
                    	}
                    	return '<span style="color:red">'+leaveTime+'</sapn>';
                    }
                },{
                    "targets": 9,
                    render: function (data, type, full, meta) {
                    	if(full.returnTime != null){
                    		return '<span style="color:red">'+full.returnTime+'</sapn>';
                    	}else{
                    		return '';
                    	}
                    }
                },{
                    "targets": 10,
                    render: function (data, type, full, meta) {
						if(full.parentcarno == null){
							return "--";
						}else{
							return full.parentcarno;
						}
                    }
                }]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

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

/*获取班级*/
function getClz(){
    var msg = {};
    msg.appName = "homeWork_findClassName";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
			if(typeof(success) == "object" && 
				Object.prototype.toString.call(success).toLowerCase() == "[object object]" && !success.length){
			}else{
				success = eval('(' + success + ')');
			}
	        var clz = success.data;
	        var html = '';
	        for(var i=0;i<clz.length;i++){
	        	html += '<option value="'+clz[i].pk_DepID+'">'+clz[i].className+'</option>';
	        }
	        $("#clz_id").html('<option value="-1">----- 请选择 -----</option>'+html);
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}