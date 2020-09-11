$(function() {
	initeBeInvited();
	$("#reportShow").click(function(){
		reportShows();
	})
	
	$("#myButton").click(function(){
		areaTable.api().ajax.reload();
	})
})
	
/**
 * 查询文化展示列表
 */
function initeBeInvited() {
    areaTable = $('#datatable').dataTable({
        "ajax": {
            "url": serverBaseUrl,
            "data": function (data) {
                //添加额外的参数传给服务器
                data.name=$("#name").val();
                data.phone=$("#phone").val();
                if(data.phone!="" && data.phone.length!=11){
                	informationAlert_OnlyConfirmButton_NOT_REFRESH("请确认手机号是否输入正确！");
                	return;
                }
                data.isPlan=$("#isPlaned").val();
                data.pk_id=$("#number").val();
                data.appName="invitation_findAll";
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
                //var token = "457513700_eN2akp6Wk9IFIY2QmYRov87JzNGckJLd092ZlX2Mi7xQmJauV5aSmtIFz9Pdl5Vhm7aSmNIFIZaSnpia0JhWnXydlp7NnZ61jMihj3guj5GYIdPdlpROip1dmXIdOdIxzs7d092Wm6RGj5rdOc7TIZ1QnZaTmtIFIc71zcIHOsrMzcAJIdPdkZaclLGhkprdOd0YcoQaTI_buoPd092Nmp6TsZ6SmtIFIulkuelsctITIY2Qk5rdOc7TIYycl5CQk7a7Icox092MmXgdOc7TIYVMmX22R9IFztPdiXyajbGhkprdOd2NkJmLl92C";
                xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                xhr.setRequestHeader("token", static_token);
            }
        }
        ,
        "columnDefs": [
            {
                "targets": -5,
                render: function (data, type, ClsPublishCulture, meta) {
                	if(ClsPublishCulture.studyStatue==1){
                		return "初中";
                	}else if(ClsPublishCulture.studyStatue==2){
                		return "高中";
                	}else{
                		return "初，高中";
                	}
                }

            },
        {
                "targets": -2,
                render: function (data, type, ClsPublishCulture, meta) {
                	if(ClsPublishCulture.isPlan==1){
                		return "是";
                	}else{
                		return "否";
                	}
                }

            },
        {
                "targets": -1,
                render: function (data, type, ClsPublishCulture, meta) {
                var html = "<button type='reset' class='btn btn-primary'  style='float: right' onclick='confirmDeleteBeInvited(&quot;"+ ClsPublishCulture.pk_id+ "&quot;)'>删除</button>";
                    return html;
                }

            }]
    });
}

function reportShows(){
    var msg = {};

    msg.appName="invitation_reportShow";

    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
           var html="";
           html+="<tr style='font-size:20px;'><td>总计录入邀请函条数："+success.data.total+"</td></tr><tr style='font-size:20px;'><td>参会人员总数："+success.data.persoTotal+"</td></tr>";
           $("#reportShowThere").html(html);
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };

}

//进行确认删除
function confirmDeleteBeInvited(id){
	informationAlert_confirmAndCancelButton("deleteBeInvited("+id+")","是否要删除该条记录？");
}

function deleteBeInvited(id){
	var msg = {};

	msg.pk_id=id;
    msg.appName="invitation_deleteBeInvited";

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
