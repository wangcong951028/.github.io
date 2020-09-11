/**
 * Created by THD on 2017-07-26.
 */
var modulesType=0;
var areaTable;
var twoModuleInnit;
var oneModuleInnit;
var refeshId;

var upDateParentId;
//新闻类型数据储存
var newTypeShow;
$(function () {


//  initModules();
//  initModulesType();
    initModules();
    initModuleChange();
    
});


/**
 * 查询新闻列表
 */
function initModules() {
    areaTable = $('#datatable').dataTable({
        "ajax": {
            "url": serverBaseUrl,
            "data": function (data) {
            	data.m_parentId=refeshId;
                //添加额外的参数传给服务器
                data.appName="microprotal_listMicroprotal";
                //data.modulesTypeID=modulesType;
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
                render: function (data, type, modules, meta) {
                var html = "<button type='reset' class='btn btn-primary'  style='float: right' onclick='delModules(&quot;"+ modules.pk_id + "&quot;)'>删除</button>" +
                    "<button type='button' class='btn btn-primary' style='float: right' data-toggle='modal' data-target='#myModals2' onclick='updateModules(&quot;"+ modules.pk_id + "&quot;)'>修改</button>" +
                    "<button type='button' class='btn btn-success' style='float: right' data-toggle='modal' onclick='getModulesInfo(&quot;"+ modules.pk_id + "&quot;)' data-target='#myModals'>查看</button>"
                    return html;
                }

            }]
    });
}



/**
 * 修改微门户信息（查询数据）
 *
 */
function updateModules(modulesId) {
    var msg = {};

    msg.appName="microprotal_findMicroprotalById";
    msg.pk_id=modulesId;
    serverFromJSONData(msg,true).then(function (success) {
        $("#editor-update").html(success.data.m_info);
        $("#title").val(success.data.m_name);
        $("#microPortalId").val(success.data.pk_id);
        var isChecked = success.data.isUp == 1?"checked":"";
        $("#isUpCheckBox").html('<input id="isUpModulesUpdate" name="isUpModulesUpdate" type="checkbox" '+isChecked+' class="js-switch" /> 是否置顶');
        $("#deptName").val(success.data.deptName);
        var html = '';
        for(var i=0;i<oneModuleInnit.data.length;i++){
            var type = oneModuleInnit.data[i];
             //onclick='showTwoModulss("+type.pk_id+",1)'
            html += "<label  class='btn btn-default' data-toggle-class='btn-primary' " +
                "data-toggle-passive-class='btn-default'><input  type='radio' name='modulesTypes' " +
                "value='"+type.pk_id+"'> &nbsp; "+type.name+" &nbsp; </label>";
        }
        $("#genderUpdate").html(html);
        //进行一级模块的回显操作
        $("input[name='modulesTypes']").each(function(index,element){
		   if($(this).val()==success.data.m_parentId){
		   	$(this).parent().attr("class","btn btn-default active");
		   	upDateParentId=$(this).val();
		   }
        });
        
        //二级菜单栏处理
        if(success.data.m_childId){
        	showTwoModulss(success.data.m_parentId,1,success.data.m_childId);
	        
        }else{
        	$("#ModulesShow").css('display','none');
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/**
 * 修改微门户信息（确认修改）
 */

function updateClick() {
    var msg = {};
    msg.m_name=$("#title").val();
    msg.pk_id=$("#microPortalId").val();
    msg.m_info=$("#editor-update").html();
    msg.deptName=$("#deptName").val();
    if($("input[name='modulesTypes']:checked").val()){
	    msg.m_parentId=$("input[name='modulesTypes']:checked").val();
    }else{
    	msg.m_parentId=upDateParentId;
    }
//  msg.m_childId=$("input[name='modulesTypeTwo']:checked").val();
    msg.isUp=$("#isUpModulesUpdate").is(":checked")?1:0;
    msg.appName="microprotal_updateMicroprotal";
    if($("#title").val() == null || $("#title").val().length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('标题不能为空');
        return;
    }
    if($("#editor-update").html() == null || $("#editor-update").html().length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('展示内容不能为空');
        return;
    }

    updateSubmit(msg);
}

/**根据id删除微门户信息*/
function delModules(modulesId) {
    informationAlert_confirmAndCancelButton("deleteModules("+modulesId+")","是否确认删除新闻");
}
function deleteModules(modulesId) {
    var msg = {};

    msg.pk_id=modulesId;
    msg.appName="microprotal_deleteMicroprotal";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("微门户信息删除成功");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除微门户信息失败，原因："+success.msg);
        }
        refresh();
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

//进行修改提交操作
function updateSubmit(msg) {
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH('修改成功');
            $("#myModals2").modal('hide');
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("修改失败，原因："+success.msg);
        }
        refresh();
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}




/**
 * 查询微门户详细信息
 */
function getModulesInfo(modulesId) {
    var msg = {};

    msg.appName="microprotal_findMicroprotalById";
    msg.pk_id=modulesId;
    serverFromJSONData(msg,true).then(function (success) {
        $("#m_name").html("标题："+success.data.m_name);
        $("#createName").html("创建人："+success.data.createName);
        $("#createTime").html("发布时间："+success.data.createTime);
        $("#parentName").html("一级模块名称："+success.data.parentName);
        //$("#childName").html("二级模块名称："+success.data.childName);
        var mi=success.data.isUp==1?"是":"否";
        $("#isUpShowModal").html("是否置顶："+mi);
        $("#microPortalInfo").html(success.data.m_info)
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/**
 * 查询一级模块信息
 * @constructor
 */
function  initModulesType() {
    var msg = {};

    msg.appName="modules_listModulesType";
    serverFromJSONData(msg,true).then(function (success) {
    	newTypeShow=success;
        var html = '';
        for(var i=0;i<success.data.length;i++){
            var type = success.data[i];
            html += "<label onclick='setModulesTypeId("+type.modulesTypeID+")' class='btn btn-default' data-toggle-class='btn-primary' " +
                "data-toggle-passive-class='btn-default'><input  type='radio' name='modulesType' " +
                "value='"+type.modulesTypeID+"'> &nbsp; "+type.name+" &nbsp; </label>";
        }
        $("#gender").html(html);
        $("#genderShow").html(html);
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}
/**设置新闻类型id*/
function setModulesTypeId(id) {
    modulesType = id;
    refresh();
}

//-----------------------------以下是公共方法------------------------

function  initModuleChange() {
    var msg = {};
    msg.appName="modules_findAllOnemodules";
    serverFromJSONData(msg,true).then(function (success) {
    	oneModuleInnit=success.data;
    	var html="";
        for(var i=0;i<oneModuleInnit.data.length;i++){
            var type = success.data.data[i];
            html += "<label onclick='showTwoModulss("+type.pk_id+")' class='btn btn-default' data-toggle-class='btn-primary' " +
                "data-toggle-passive-class='btn-default'><input  type='radio' name='modulesTypeOne' " +
                "value='"+type.pk_id+"'> &nbsp; "+type.name+" &nbsp; </label>";
        	
        }
        $("#gender").html(html);
        initModulesTypeOne();
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

//根据一级模块名称的选择显示二级模块(state=1表示是回显操作,表示的在修改页面的操作)
function showTwoModulss(id,state,child){
	refeshId = id;
    refresh();
	/*var msg = {};
	msg.pk_id=id;
    msg.appName="modules_showTwoModulss";
    serverFromJSONData(msg,true).then(function (success) {
    	var html = '';
    	twoModuleInnit=success.data;
        for(var i=0;i<twoModuleInnit.data.length;i++){
            var type = success.data.data[i];
            html += "<label  class='btn btn-default' data-toggle-class='btn-primary' " +
                "data-toggle-passive-class='btn-default'><input  type='radio' name='modulesTypeTwo' " +
                "value='"+type.pk_id+"'> &nbsp; "+type.name+" &nbsp; </label>";
        	
        }
        
        if(state==1){
        	$("#twoModulesShow").html(html);
        	$("input[name='modulesTypeTwo']").each(function(){
			   if($(this).val()==child){
			   	$(this).parent().attr("class","btn btn-default active");
			   }
	        });
	        if(success.data.data.length==0){
	        	$("#ModulesShow").css('display','none');
	        }else{
		        $("#ModulesShow").css('display','inline');
	        }
        }else{
	        $("#twoModulesFind").html(html);
	        if(success.data.data.length==0){
	        	$("#ModulesFind").css('display','none');
	        }else{
		        $("#ModulesFind").css('display','inline');
	        }
        	
        }
        
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };*/
	
	
}

function refresh(){
	areaTable.api().ajax.reload();
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
			//initModulesTypeOne();
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
			//initModulesTypeOne();
			initModuleChange();
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
