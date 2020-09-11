/**
 * Created by THD on 2017-07-26.
 */
/*var newsType=0;*/
//设定全局变量
var xgh;
var beginTime;
var endTime;

var areaTable;
$(function () {
    initClsPublishCulture();
    
});


/**
 * 初始化宿舍管理列表
 */
function initClsPublishCulture() {
areaTable = $('#datatable').dataTable({
        "ajax": {
            "url": serverBaseUrl,
            "data": function (data) {
                //添加额外的参数传给服务器
                data.appName="ykt_getAttList";
                data.xgh = xgh;
                data.beginTime=beginTime;
                data.endTime=endTime;
                return buildRequestParam(data);
            },
            "dataSrc": function (json) {
            	if(json.msgState!=200){
            		informationAlert_OnlyConfirmButton_NOT_REFRESH(json.msg);
            	}
            	
                //自定义格式
                json.iTotalRecords = json.data.total;
                json.recordsFiltered = json.data.totalpage;
                json.error = json.data.error;
                json.draw = json.data.draw;
                var jsonArray=json.data.body;
                
                return jsonArray;
            },
            "beforeSend": function (xhr) {
                xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                xhr.setRequestHeader("token", static_token);
            }
        }
        
    });
}



/**刷新表单*/
function  refresh() {
    areaTable.api().ajax.reload();
}

/**根据条件进行查询**/
function searchInf(){

	//获取查询条件
	beginTime=$("#beginTime").val();
	endTime=$("#endTime").val();
	xgh=$("#xgh").val();
	
	refresh();
}
