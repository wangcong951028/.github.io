
$(function(){
	hsList();
	term_list();
})

/*列表*/
function hsList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
					data.termid = $("#term_list").val();
					var str = $("#quarter_id").val();
					data.quarter = $("#quarter_"+str+"").html();
					data.month = $("#month_id").val();
					var title = $("#quarter_"+str+"").html();
					if(title != undefined){
						$("#title_id").html("卫生评比统计："+title);
					}
                    /*查询参数*/
                    data.appName = "san_healthStatistics";
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

/*导出统计结果*/
function uploadhs(){
	var  msg = {};
	msg.termid = $("#term_list").val();
	var str = $("#quarter_id").val();
	msg.quarter = $("#quarter_"+str+"").html();
	msg.month = $("#month_id").val();
	msg.appName="san_uploadhealthStatistics";//
	serverFromJSONData(msg,true).then(function (success) {
			if(success.msgState == 200){
				var hs = success.data;
				var jsonDome = [];
				for (var i = 0; i < hs.length; i++) {
					jsonDome[i] = {
						"任务名称": hs[i].ds_sanapectionname,
						"季度": hs[i].s_quarter,
						"月份": hs[i].s_month,
						"寝室": hs[i].ds_dorname,
						"成绩": hs[i].ds_grade,
						"排序": hs[i].ranking,
					};
				}
				downloadExl(jsonDome,"hs",true);
			}else{
				informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
			}
	}),function (error) {
			console.log("访问服务器发生错误，请稍后再试!",error);
	};
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
                $("#term_id").html('<option value="-1">---- 请选择 -----</option>' + html);
			},
			beforeSend: function (xhr) {
					xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
					xhr.setRequestHeader("token", static_token);
			}
    });
}