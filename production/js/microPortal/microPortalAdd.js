/**
 * Created by THD on 2017-07-25.
 */
$(function() {
    initModulesTypeOne();
    //进行新闻类型重复的验证
      /*$("#addNewsType").blur(function(){
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
	    
		});*/
    
});

/**
 * 查询一级模块
 * @constructor
 */
function  initModulesTypeOne() {
    var msg = {};
    msg.appName="modules_findAllOnemodules";
    serverFromJSONData(msg,true).then(function (success) {
    	var html = '';
    	//填充select
    	var data = "<option value='-1'>-------请选择-------</option>";
        for(var i=0;i<success.data.data.length;i++){
            var type = success.data.data[i];
            html += "<label onclick='showTwoModuls("+type.pk_id+")' class='btn btn-default' data-toggle-class='btn-primary' " +
                "data-toggle-passive-class='btn-default'><input  type='radio' name='modulesTypeOne' " +
                "value='"+type.pk_id+"'> &nbsp; "+type.name+" &nbsp; </label>";
        	
        	data +="<option value='"+type.pk_id+"'>"+type.name+"</option>";
        }
        $("#genderAdd").html(html);
        $("#twoModules").html(data);
        $("#twoModulesUpdate").html(data);
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

//根据一级模块名称的选择显示二级模块
function showTwoModuls(id){
	
	var msg = {};
	msg.pk_id=id;
    msg.appName="modules_showTwoModuls";
    serverFromJSONData(msg,true).then(function (success) {
    	var html = '';
        for(var i=0;i<success.data.data.length;i++){
            var type = success.data.data[i];
            html += "<label  class='btn btn-default' data-toggle-class='btn-primary' " +
                "data-toggle-passive-class='btn-default'><input  type='radio' name='modulesType' " +
                "value='"+type.pk_id+"'> &nbsp; "+type.name+" &nbsp; </label>";
        	
        }
        $("#twoModulesShow").html(html);
        
        if(success.data.data.length==0){
        	$("#ModulesShow").css('display','none');
        }else{
	        $("#ModulesShow").css('display','inline');
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
	
	
}

//进行编辑页面的初始化
function  FinModuleTypeAjaxs() {
	var msg = {};
    msg.appName = "modules_findAllOnemodules";
    var jsonStr = buildRequestParam(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
            var html = '';
	        for(var i=0;i<success.data.data.length;i++){
	            var type = success.data.data[i];
	            	
	            html += "<tr><td>"+type.name+"</td><td><input class='btn btn-primary' type='button' onclick='delModule("+type.pk_id+")' value='删除'/>"
				+"<input class='btn btn-primary' type='button' onclick='updateModule("+type.pk_id+")' value='修改'/></td><tr>";
	        $("#tbodyUpdateType").html(html);
	        }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

//进行一级模块的添加
function  addOneModules() {
    var msg = {};
	msg.name=$("#addMicroPortalType").val();
	if(msg.name ==null || msg.name ==''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("添加类型名称不能为空！");
		return;
	}
	//1代表要置顶，0代表不置顶
	msg.isUp=$('#isUp').is(':checked')?1:0;
    msg.appName="modules_addOnemodules";
    serverFromJSONData(msg,true).then(function (success) {
		if(success.msgState==200){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功!");
			initModules();
			reSetModules();
			initModulesTypeOne();
			initModuleChange();
		}else{
			informationAlert_OnlyConfirmButton_NOT_REFRESH("添加失败!");
		}
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}


//进行一级模块的修改（回显查看）
function updateModule(moduleId){
	var msg = {};
	msg.name=$("#addMicroPortalType").val();
	msg.pk_id=moduleId;
    msg.appName="modules_findModuleById";
    serverFromJSONData(msg,true).then(function (success) {
    	$("#updateMicroPortalTypeName").val(success.data.name);
    	$("#microPortalTypeIdUpdate").val(success.data.pk_id);
    	var isChecked = success.data.isUp == 1?"checked":"";
        $("#isUpShow").html('<input id="isUpUpdate" name="isUp" type="checkbox" '+isChecked+' class="js-switch" /> 是否置顶');
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
    
    //弹出模态狂进行修改
	$("#updateMicroPortalType").modal("show");
}

//进行修改确认操作
function updateConfirm(){
	informationAlert_confirmAndCancelButton("update("+$("#microPortalTypeIdUpdate").val()+")","是否确认修改新闻类型");
}

//进行修改
function update(id){
	var msg = {};
	msg.name=$("#updateMicroPortalTypeName").val();
	msg.pk_id=id;
    msg.appName="modules_updateOneModules";
    msg.isUp=$("#isUpShow").is(':checked')?1:0;
    serverFromJSONData(msg,true).then(function (success) {
    	if(success.msgState==200){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功!");
			FinModuleTypeAjaxs();//刷新当前页面、
		}else{
			informationAlert_OnlyConfirmButton_NOT_REFRESH("修改失败!");
		}
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
    
}

function delModule(id){
	informationAlert_confirmAndCancelButton("deletOneModules("+id+")","是否确认删除该名称(可能会删除掉相应的发布信息哦)？");
}

//进行一级模块的删除
function deletOneModules(id){
	var msg = {};
	msg.pk_id=id;
    msg.appName="modules_deleteOneModules";
    serverFromJSONData(msg,true).then(function (success) {
    	if(success.msgState==200){
    		FinModuleTypeAjaxs();
			informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功!");
			initModulesTypeOne();
		}else{
			informationAlert_OnlyConfirmButton_NOT_REFRESH("删除失败!");
		}
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

//进行添加成功信息重置
function reSetModules(){
	$("#addMicroPortalType").val("");
}

/*-----------------二级模块的处理---------------------*/
function addTwoModules(){
	var msg = {};
	msg.name=$("#twoModuleText").val();
	msg.parentId=$("#twoModules").val();
    msg.appName="modules_addTwoModules";
    serverFromJSONData(msg,true).then(function (success) {
    	if(success.msgState==200){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功!");
			refreshTwo();
		}else{
			informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功!");
		}
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function FinTwoModule(){
	var msg = {};
    msg.appName="modules_listTwoModules";
    serverFromJSONData(msg,true).then(function (success) {
    	var html = '';
        for(var i=0;i<success.data.data.length;i++){
            var type = success.data.data[i];
           
            html += "<tr><td>"+type.name+"</td><td>"+type.parentName+"</td><td><input class='btn btn-primary' type='button' onclick='deleteConfirmTwo("+type.pk_id+")' value='删除'/>"
			+"<input class='btn btn-primary' type='button' onclick='updateTwoModule("+type.pk_id+")' value='修改'/></td><tr>";
        $("#tbodyTwo").html(html);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

//二级模块进行刷新
function refreshTwo(){
	$("#twoModuleText").val("");
	$("#twoModules").val(-1);
}

function updateTwoModule(id){
	var msg = {};
	msg.pk_id=id;
    msg.appName="modules_findTwoModuleById";
    serverFromJSONData(msg,true).then(function (success) {
    	if(success.msgState==200){
    		microPortalTwoIdUpdate
    		$("#microPortalTwoIdUpdate").val(success.data.pk_id);
    		$("#updateMicroPortalTwoName").val(success.data.name);
    		$("#twoModulesUpdate").val(success.data.parentId);
    	}else{
    		informationAlert_OnlyConfirmButton_NOT_REFRESH("查询失败!");
    	}
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
    //模态框弹出
    $("#updateTwoMicroPortal").modal("show");
}


//进行修改操作（进行确认）
function updateConfirmTwo(){
	informationAlert_confirmAndCancelButton("updateTwoModules("+$("#microPortalTwoIdUpdate").val()+")","是否确认删除该名称？");
}
//进行修改二级模块
function updateTwoModules(id){
	var msg = {};
	msg.pk_id=id;
	msg.name=$("#updateMicroPortalTwoName").val();
	msg.parentId=$("#twoModulesUpdate").val();
    msg.appName="modules_updateTwoModule";
    serverFromJSONData(msg,true).then(function (success) {
    	if(success.msgState==200){
    		informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功!");
    		FinTwoModule();
    	}else{
    		informationAlert_OnlyConfirmButton_NOT_REFRESH("修改失败!");
    	}
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

//进行删除操作，二级模块(确认)
function deleteConfirmTwo(id){
	informationAlert_confirmAndCancelButton("deleteTwoModules("+id+")","是否确认删除该名称？");
}

function deleteTwoModules(id){
	var msg = {};
	msg.pk_id=id;
    msg.appName="modules_deleteTwoModule";
    serverFromJSONData(msg,true).then(function (success) {
    	if(success.msgState==200){
    		informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功!");
    		FinTwoModule();
    	}else{
    		informationAlert_OnlyConfirmButton_NOT_REFRESH("删除失败!");
    	}
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/****************************进行微门户数据的处理******************************/
/*微门户信息添加*/
function addMicroprotal(){
	var msg = {};
	msg.m_name=$("#titleAdd").val();
	msg.m_info=$("#editor-oneAdd").html();
	msg.deptName=$("#deptNameAdd").val();
	msg.m_parentId=$("input[name='modulesTypeOne']:checked").val();
	//msg.m_childId=$("input[name='modulesType']:checked").val();
    msg.appName="microprotal_addMicroprotal";
    //1代表要置顶，0代表不置顶
    msg.isUp=$('#isUpAddMrop').is(':checked')?1:0;
    //进行信息验证
    if(msg.m_name ==null || msg.m_name ==""){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("标题名称不能为空");
    	return;
    }
    if(msg.deptName ==null || msg.deptName ==""){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("部门名称不能为空");
    	return;
    }
    if(msg.m_info ==null || msg.m_info ==""){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("发布内容不能为空");
    	return;
    }
    if(msg.m_parentId ==null || msg.m_parentId ==""){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("所属菜单不能为空");
    	return;
    }
    serverFromJSONData(msg,true).then(function (success) {
    	if(success.msgState==200){
    		informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功!");
    		refreshs();
    		FinTwoModule();
    		refresh();
    	}else{
    		informationAlert_OnlyConfirmButton_NOT_REFRESH("添加失败!");
    	}
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function refreshs(){
	$("#titleAdd").val("");
	$("#editor-oneAdd").html("");
	$("#deptNameAdd").val("");
	$("input[name='modulesTypeOne']").each(function(index,element){
		   	$(this).parent().attr("class","btn btn-default");
		   	$(this).attr("checked",false);
        });
    
}
