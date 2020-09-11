/**
 * Created by THD on 2017-07-26.
 */
var newsType=0;
var areaTable;
//新闻类型数据储存
var newTypeShow;
$(function () {


    initNews();
    initNewsType();
});


/**
 * 查询新闻列表
 */
function initNews() {
    areaTable = $('#datatable').dataTable({
        "ajax": {
            "url": serverBaseUrl,
            "data": function (data) {
                //添加额外的参数传给服务器
                data.appName="news_listNews";
                data.newsTypeID=newsType;
                return buildRequestParam(data);
            },
            "dataSrc": function (json) {
                //自定义格式
                json.iTotalRecords = json.data.recordsTotal;
                json.recordsFiltered = json.data.recordsTotal;
                json.error = json.data.error;
                json.draw = json.data.draw;
                if(json.data.data==null){
                	return "";
                }
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
                render: function (data, type, news, meta) {
                var html = "<button type='reset' class='btn btn-primary'  style='float: right' onclick='delNews(&quot;"+ news.newsId + "&quot;)'>删除</button>" +
                    "<button type='button' class='btn btn-primary' style='float: right' data-toggle='modal' data-target='#myModals2' onclick='updateNews(&quot;"+ news.newsId + "&quot;)'>修改</button>" +
                    "<button type='button' class='btn btn-success' style='float: right' data-toggle='modal' onclick='getNewsInfo(&quot;"+ news.newsId + "&quot;)' data-target='#myModals'>查看</button>"
                    return html;
                }

            }]
    });
}



/**
 * 修改新闻1（查询数据）
 *
 */
function updateNews(newsId) {
    var msg = {};

    msg.appName="news_newsById";
    msg.newsId=newsId;
    serverFromJSONData(msg,true).then(function (success) {
        $("#editor-one").html(success.data.info);
        $("#deptName").val(success.data.deptName);
        $("#title").val(success.data.title);
        var isChecked = success.data.isUp == 1?"checked":"";
        $("#isUpCheckBox").html('<input id="isUp" name="isUp" type="checkbox" '+isChecked+' class="js-switch" /> 是否置顶');
        //$("#isUp").attr("checked",success.data.isUp == 1?true:false);
        $("#newsId").val(success.data.newsId);
        
        var html = '';
        for(var i=0;i<newTypeShow.data.length;i++){
            var type = newTypeShow.data[i];
            html += "<label  class='btn btn-default' data-toggle-class='btn-primary' " +
                "data-toggle-passive-class='btn-default'><input  type='radio' name='newsTypes' " +
                "value='"+type.newsTypeID+"'> &nbsp; "+type.name+" &nbsp; </label>";
        }
        $("#genderShow").html(html);
        
        $("input[name='newsTypes']").each(function(){
		   if($(this).val()==success.data.newsTypeID){
		   	console.log($(this).parent());
		   	$(this).parent().attr("class","btn btn-default active");
		   }
		  
        });
        
        //
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/**
 * 修改新闻（确认修改）
 */

function updateClick() {
    var bischecked=$('#isUp').is(':checked');
    var msg = {};
    msg.newsId=$("#newsId").val();
    msg.appName="news_updateNews";
    msg.isUp=bischecked?1:0;
    msg.title=$("#title").val();
    msg.deptName=$("#deptName").val();
    msg.info=$("#editor-one").html();

    $("input[name='newsTypes']").each(function () {
        if($(this).parent().hasClass("active")){
            msg.newsTypeID= $(this).val();
        }
    })
    

    if($("#title").val() == null || $("#title").val().length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('新闻标题不能为空');
        return;
    }
    if($("#deptName").val() == null || $("#deptName").val().length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('部门名称不能为空');
        return;
    }
    if($("#editor-one").html() == null || $("#editor-one").html().length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('新闻内容不能为空');
        return;
    }

    updateSubmit(msg);
}

/**根据id删除新闻*/
function delNews(newsId) {
    informationAlert_confirmAndCancelButton("deleteNews("+newsId+")","是否确认删除新闻");
}
function deleteNews(newsId) {
    var msg = {};

    msg.appName="news_deleteNews";
    msg.newsId=newsId;
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("新闻删除成功");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除新闻失败，原因："+success.msg);
        }
        refresh();
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function updateSubmit(msg) {
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH('修改新闻成功');
            $("#myModals2").modal('hide');
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("修改新闻失败，原因："+success.msg);
        }
        refresh();
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}




/**
 * 查询新闻内容
 */
function getNewsInfo(newsId) {
    var msg = {};

    msg.appName="news_newsById";
    msg.newsId=newsId;
    serverFromJSONData(msg,true).then(function (success) {
        $("#editor-one").html(success.data.info);
        $("#newsInfo").html(success.data.info);
        $("#createName").html("发布人："+success.data.createName);
        $("#createDept").html("发布部门："+success.data.deptName);
        $("#createTime").html("发布时间："+success.data.createTime);
        $("#myModalLabel").html(success.data.title);
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/**
 * 查询新闻类型
 * @constructor
 */
function  initNewsType() {
    var msg = {};

    msg.appName="news_listNewsType";
    serverFromJSONData(msg,true).then(function (success) {
    	newTypeShow=success;
        var html = '';
        for(var i=0;i<success.data.length;i++){
            var type = success.data[i];
            html += "<label onclick='setNewsTypeId("+type.newsTypeID+")' class='btn btn-default' data-toggle-class='btn-primary' " +
                "data-toggle-passive-class='btn-default'><input  type='radio' name='newsType' " +
                "value='"+type.newsTypeID+"'> &nbsp; "+type.name+" &nbsp; </label>";
        }
        $("#gender").html(html);
        $("#genderShow").html(html);
        FinNewsTypeAjax();
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}
/**设置新闻类型id*/
function setNewsTypeId(id) {
    newsType = id;
    refresh();
}

//-----------------------------以下是公共方法------------------------
/**刷新表单*/
function  refresh() {
    areaTable.api().ajax.reload();
}



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
            //FinNewsTypeAjax();
            initNewsType();
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
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH('创建新闻成功');
            reSetNews();//刷新当前页面
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
	$("#editor-oneAdd").html("");
	$("#deptNameAdd").val("");
	$("input[name='newsTypeAdd']").each(function(index,element){
		   	$(this).parent().attr("class","btn btn-default");
		   	$(this).attr("checked",false);
        });
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
            FinNewsTypeAjaxs();
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
            FinNewsTypeAjaxs();
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("修改失败，原因："+success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function  refreshs() {
    window.location.reload();
}

$.fn.modal.Constructor.prototype.hideModal = function () {
                var that = this
                this.$element.hide()
                this.backdrop(function () {
                    //判断当前页面所有的模态框都已经隐藏了之后body移除.modal-open，即body出现滚动条。
                    $('.modal.fade.in').length === 0 && that.$body.removeClass('modal-open')
                    that.resetAdjustments()
                    that.resetScrollbar()
                    that.$element.trigger('hidden.bs.modal')
                })
            }