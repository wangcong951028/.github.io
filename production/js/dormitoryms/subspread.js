var areaTable;

$(function(){
	subspread();
})

/*列表*/
function subspread() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.keyword = $("#keyword").val();
                    /*查询参数*/
                    data.appName = "spread_findSubSpread";
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
                }, */ {
                    "targets": 5,
                    render: function (data, type, full, meta) {
                        return full.after_rsrname+'/'+full.after_rsrprice;
                    }
                } , {
                    "targets": 8,
                    render: function (data, type, full, meta) {
                        return full.before_rsrname+'/'+full.before_rsrprice;
                    }
                } ]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

function uploadsubspread(){
		var  msg = {};
		msg.keyword = $("#keyword").val();
		msg.appName="spread_findSubSpreadUpload";//
		serverFromJSONData(msg,true).then(function (success) {
				if(success.msgState == 200){
					var spread = success.data;
					var jsonDome = [];
					for (var i = 0; i < spread.length; i++) {
						jsonDome[i] = {
							"姓名": spread[i].subname,
							"学号": spread[i].subxgh,
							"班级": spread[i].subdept,
							"调寝前住宿": spread[i].after_dorname,
							"调寝前标准/价格": spread[i].after_rsrname+"/"+spread[i].after_rsrprice,
							"调寝前入住时间": spread[i].after_time,
							"调寝后住宿": spread[i].before_dorname,
							"调寝后标准/价格": spread[i].before_rsrname+"/"+spread[i].before_rsrprice,
							"调寝后入住时间": spread[i].before_time,
							"差价": spread[i].price_spread,
							"记录人": spread[i].record_name,
							"记录时间": spread[i].record_time
							};
					}
					downloadExl(jsonDome,"spread",true);
				}else{
					informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
				}
		}),function (error) {
				console.log("访问服务器发生错误，请稍后再试!",error);
		};
}