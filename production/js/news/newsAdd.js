/**
 * Created by THD on 2017-07-25.
 */
$(function() {
    //FinNewsTypeAjax();
    //进行新闻类型重复的验证
      $("#addNewsType").blur(function(){
	  		//发送ajax请求
	  		var msg = {};
		    msg.appName = "news_newsValidate";
		    msg.typeName=$("#addNewsType").val();
		    var jsonStr = buildRequestParam(msg);
		    $.ajax({
		        type: 'POST',
		        url: serverBaseUrl,
		        data: jsonStr,
		        dataType: "json",
		        async:false,
		        success: function (success) {
		            if(success.data != null){
		            		informationAlert_OnlyConfirmButton_NOT_REFRESH('新闻类型名不能重复');
		            } 
		        },
		        beforeSend: function (xhr) {
		            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
		            xhr.setRequestHeader("token", static_token);
		        }
		    });
	    
		});
    
});
//验证发布新闻参数
function publicNews() {
	debugger;
    if($("#titleAdd").val() == null || $("#titleAdd").val().length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('新闻标题不能为空');
        return;
    }
    if($("#deptNameAdd").val() == null || $("#deptNameAdd").val().length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('部门名称不能为空');
        return;
    }
    if($("#editor-oneAdd").html() == null || $("#editor-oneAdd").html().length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('新闻内容不能为空');
        return;
    }
    if($("input[name='newsTypeAdd']:checked").val() == null){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('请选择新闻类型');
        return;
    }

    var bischecked=$('#isUpAdd').is(':checked');
    var msg = {};
    msg.appName="news_addNews";
    msg.isUp=bischecked?1:0;
    msg.title=$("#titleAdd").val();
    msg.deptName=$("#deptNameAdd").val();
    msg.info=$("#editor-oneAdd").html();
    msg.newsTypeID=$("input[name='newsTypeAdd']:checked").val();
    AddNews(msg);
}

/**新增新闻类型*/
function AddNewsType() {
    var type = $("#addNewsType").val();
    if(type==null||type.length ==0){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH('类型名称不能为空');
        return;
    }
    
    var msg = {};
    msg.appName="news_addNewsType";
    msg.typeName=type;

    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH('创建新闻类型成功');
            $("#addNewsType").val("");
            FinNewsTypeAjax();
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("创建新闻类型失败，原因："+success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/**
 * 新增新闻
 * @constructor
 */
function AddNews(msg) {
	debugger;
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
        	debugger;
            informationAlert_OnlyConfirmButton_NOT_REFRESH('创建新闻成功');
            reSetNews()//刷新当前页面
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("创建新闻失败，原因："+success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}
/***/
function reSetNews() {
    $("#titleAdd").val("");
    $("#deptNameAdd").val("");
    $("#editor-oneAdd").html("");
}

/**
 * 查询新闻类型
 * @constructor
 */
function  FinNewsTypeAjax() {
    var msg = {};

    msg.appName="news_listNewsType";
    serverFromJSONData(msg,true).then(function (success) {
        var html = '';
        for(var i=0;i<success.data.length;i++){
            var type = success.data[i];
            html += "<label class='btn btn-default' data-toggle-class='btn-primary' " +
                "data-toggle-passive-class='btn-default'><input type='radio' name='newsTypeAdd' " +
                "value='"+type.newsTypeID+"'> &nbsp; "+type.name+" &nbsp; </label>";

        }
        $("#genderAdd").html(html);
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function  FinNewsTypeAjaxs() {
    var msg = {};

    msg.appName="news_listNewsType";
    serverFromJSONData(msg,true).then(function (success) {
        var html = '';
        for(var i=0;i<success.data.length;i++){
            var type = success.data[i];
            debugger;
            if(type.name!="光荣榜"){
            	
	            html += "<tr><td>"+type.name+"</td><td><input class='btn btn-primary' type='button' onclick='delNewsType("+type.newsTypeID+")' value='删除'/>"
				+"<input class='btn btn-primary' type='button' onclick='updateNewsType("+type.newsTypeID+")' value='修改'/></td><tr>";
            }
        $("#tbodyUpdateType").html(html);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function delNewsType(id){
	informationAlert_confirmAndCancelButton("deleteNewsType("+id+")","是否确认删除新闻类型");
}

//点击显示修改页面
function updateNewsType(id){
	
	var msg = {};
    msg.newsTypeId=id;
	msg.appName="news_newsTypeFindById";
	
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            $("#updateNewsTypeName").val(success.data.name);
            $("#newsTypeIdUpdate").val(success.data.newsTypeID);
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("查询失败，原因："+success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
    
	
	//弹出模态狂进行修改
	$("#updateNewsType").modal("show");
}

//进行修改确认操作
function updateNewsTypeName(){
	
	informationAlert_confirmAndCancelButton("updateNewsTypes("+$("#newsTypeId").val()+")","是否确认修改新闻类型");
}

function deleteNewsType(id){
	var msg = {};
    msg.appName="news_newsTypeDelete";
    msg.newsTypeId=id;

    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH('删除成功');
            refresh();
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除失败，原因："+success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

//进行新闻类型的修改
function updateNewsTypes(){
	var msg = {};
    msg.appName="news_updateType";
    msg.newsTypeId=$("#newsTypeIdUpdate").val();
	msg.typeName=$("#updateNewsTypeName").val();
	
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH('修改成功');
            refresh();
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("修改失败，原因："+success.msg);
    }),function (error) {
        }
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function  refresh() {
    //window.location.reload();
}