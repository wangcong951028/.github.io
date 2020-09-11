var areaTable;
var listDorm;
$(function () {
    init();
    innitDormNumber();
    
    $("#dormNoSelect").change(function(){
    	changeDormNum();
    })
    
    $("#dormNumNoSelect").change(function(){
    	changeBedNum($("#dormNumNoSelect").val());
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
                    //添加额外的参数传给服务器
                    data.appName="queryResultQuery_findAllApply";
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
                "targets": -1,
                render: function (data, type, full, meta) {
                var html = "<button type='reset' class='btn btn-primary'  style='float: right' onclick='delQueryResultQuery(&quot;"+ full.queryResultId+ "&quot;)'>删除</button>" +
                    "<button type='button' class='btn btn-success' style='float: right' data-toggle='modal' onclick='getCultureInfo(&quot;"+ full.queryResultId + "&quot;)' data-target='#myModalsf'>状态查看</button>"
                    return html;
                }

            },{
                "targets": -3,
                render: function (data, type, full, meta) {
               		if(full.auditingStatu==1){
               			return "<div style='color:blue;'>通过</div>";
               		}
               		if(full.auditingStatu==0){
               			return "<div style='color:blue;'>待审</div>";
               		}
               		if(full.auditingStatu==-1){
               			return "<div style='color:red;'>未通过</div>";
               		}
                }

            }]
    });
}

function delQueryResultQuery(queryResultId){
	informationAlert_confirmAndCancelButton("deleteQueryResultQuery("+queryResultId+")","是否确认删除该条信息？");
}

function deleteQueryResultQuery(queryResultId) {
    var msg = {};
    msg.appName="queryResultQuery_deleteApply";
    msg.queryResultId=queryResultId;
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除展示失败，原因："+success.msg);
        }
        refresh();
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function refresh(){
	areaTable.api().ajax.reload();
}

function submitApplyType(){
	alert();
}

//获取寝室楼层和寝室号
function innitDormNumber(){
	var msg = {};
    msg.appName="queryResultQuery_getDormNumber";
    var html="<option selected='selected'>------请选择------</option>";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
        	var list =success.data.data;
        	for (var i=0;i<list.length;i++) {
        		html+="<option value="+list[i].id+">"+list[i].apartmentName+"</option>";
        	}
            $("#dormNoSelect").html(html);
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("获取数据失败，原因："+success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

//获取寝室的楼号
function changeDormNum(){
	var msg = {};
    msg.appName="queryResultQuery_changeDormNum";
    msg.apartmentId=$("#dormNoSelect").val();
    var html="<option selected='selected'>------请选择------</option>";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
			listDorm =success.data.data;
        	for (var i=0;i<listDorm.length;i++) {
        		html+="<option value="+listDorm[i].dormId+">"+listDorm[i].d_dormnumber+"</option>";
        	}
            $("#dormNumNoSelect").html(html);
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("获取数据失败，原因："+success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

//显示可选择的床铺号
function changeBedNum(dormids){
	var html="<option selected='selected'>------请选择------</option>";
	for (var i=0;i<listDorm.length;i++) {
		console.log(listDorm.dormId);
		if(listDorm[i].dormId==dormids){
			html+="<option value="+listDorm[i].bedId+">"+listDorm[i].b_bedNum+"</option>";
		}
		
	}
	$("#bedNumNoSelect").html(html);
}
