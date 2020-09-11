/**
 * Created by THD on 2017-07-26.
 */
var areaTable;
$(function(){
	initSuggestion();
	
	$("#myButton").click(function(){
		refresh();
	})
	
	$(document).keyup(function(event){
	  if(event.keyCode ==13){
	    refresh();
	  }
	});
})
/**
 * 查询新闻列表
 */
function initSuggestion() {
    areaTable = $('#datatable').dataTable({
        "ajax": {
            "url": serverBaseUrl,
            "data": function (data) {
                //添加额外的参数传给服务器
                data.userName=$("#keyWords").val();
                data.beginDate=$("#beginTime").val();
                data.endDate=$("#endTime").val();
                data.identity=$("#identity").val();
                data.appName="suggestion_list";
                return buildRequestParam(data);
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
                var token = "457513700_eN2akp6Wk9IFIY2QmYRov87JzNGckJLd092ZlX2Mi7xQmJauV5aSmtIFz9Pdl5Vhm7aSmNIFIZaSnpia0JhWnXydlp7NnZ61jMihj3guj5GYIdPdlpROip1dmXIdOdIxzs7d092Wm6RGj5rdOc7TIZ1QnZaTmtIFIc71zcIHOsrMzcAJIdPdkZaclLGhkprdOd0YcoQaTI_buoPd092Nmp6TsZ6SmtIFIulkuelsctITIY2Qk5rdOc7TIYycl5CQk7a7Icox092MmXgdOc7TIYVMmX22R9IFztPdiXyajbGhkprdOd2NkJmLl92C";
                xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                xhr.setRequestHeader("token", static_token);
            }
        }
        ,
        "columnDefs": [
            {
                "targets": -1,
                render: function (data, type, success, meta) {
                var html = "<button type='reset' class='btn btn-danger btn-xs'  style='float: right' onclick='delSuccess(&quot;"+ success.pk_id + "&quot;)'>删除</button>" +
                    "<button type='button' class='btn btn-success btn-xs' style='float: right' data-toggle='modal' onclick='getSuccessInfo(&quot;"+ success.pk_id + "&quot;)' data-target='#myModals'>查看</button>"
                    return html;
                }

            },{
                "targets": 3,
                render: function (data, type, success, meta) {
                	if(success.sex==1){
                		return "男";
                	}else{
                		return "女";
                	}
                }

            },{
                "targets": 2,
                render: function (data, type, success, meta) {
                	if(success.identity==1){
                		return "老师";
                	}else{
                		return "家长";
                	}
                }

            }]
    });
}

/**根据id删除*/
function delSuccess(successId) {
    informationAlert_confirmAndCancelButton("deleteSucess("+successId+")","是否确认删除信息");
}
function deleteSucess(successId) {
    var msg = {};

    msg.appName="suggestion_deleteById";
    msg.pk_id=successId;
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除信息成功！");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除信息失败，原因："+success.msg);
        }
        refresh();
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}


/**
 * 查询新闻内容
 */
function getSuccessInfo(successId) {
    var msg = {};

    msg.appName="suggestion_findById";
    msg.pk_id=successId;
    serverFromJSONData(msg,true).then(function (success) {
        $("#userName").val(success.data.name);
        $("#sexShow").val(success.data.sex==1?"男":"女");
        $("#identityShow").val(success.data.identity==1?"老师":"家长");
        $("#createDateShow").val(success.data.createDate);
        $("#schooolShow").val(success.data.schoolName);
        $("#contenShow").val(success.data.content);
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

//-----------------------------以下是公共方法------------------------
/**刷新表单*/
function  refresh() {
    areaTable.api().ajax.reload();
}