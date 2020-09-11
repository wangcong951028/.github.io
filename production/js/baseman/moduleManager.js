/**
 * Created by ricardo on 2017-09-08.
*/
var areaTable;
var pageSize = 10;// ，每页显示个数
var pageNo = 1;// 页码
var totalPage = 1;// 总页数
/*** 搜索条件字段 ***/
var moduleName = "";// 模块名称
var terminalType = "1";// 终端类型 默认是查询app端模块列表
var moduleType;// 模块类型
var moduleid = 0;// 临时模块id（一般是指一级模块id）
var d_moduleid = 0;//删除应用临时id
var c_moduleid = 0;// 子级模块id

$(function(){

   /*** 1、查询模块列表 ***/
   queryModuleManagerList();
   /*** 2、查询页面模块类型 ***/
   queryModuleTypeList("moduleType",0);
   /*** 2、搜索按钮 ***/
   $("#searchModuleList").on("click",function(){
        moduleName = $("#moduleName").val();
        terminalType = $("#terminalType").val();
        moduleType = $("#moduleType").val();
        refreshAreaTable();
   });
   /** 3、点击新建应用，新建应用div显示 **/
    $("#buildModule").on("click",function () {
        $('#buildModule_div').modal('show');
        queryModuleTypeList("a_moduleType",0);
    });
    
    /** 4、点击管理子权限，弹出div **/
    $("#mchildPrivilege").sidebar({side: "right"});
    $(document).delegate('.managerPri', 'click', function () {     
        $("#mchildPrivilege").trigger("sidebar:toggle");
        $("#mchildPrivilege").css("box-shadow","0px 0px 99px 1px #c0c0c0");
        getChildModuleList(moduleid);
        return false;
    });
    
    /** 5、监听管理子权限div，点击关闭 **/
    $("#mchildPrivilege-close").on("click",function () {
        $("#mchildPrivilege-close").trigger("sidebar:close");
        $("#mchildPrivilege-close").css("box-shadow","");
    });
    
    /** 6、监听管理二级div，点击关闭 **/
    $("#mchildPrivilege-close").on("click",function () {
        $("#mchildPrivilege-close").trigger("sidebar:close");
        $("#mchildPrivilege-close").css("box-shadow","");
    });
    
    /*** 7、增加应用弹出div ***/
    $("#addModule").on("click",function () {
        $("#updateModule_div").modal("hide");
	    $("#addChildModule_div").modal('show');
    });

})

/**
 * 1、刷新table
 */
function refreshAreaTable(){
    areaTable.api().ajax.reload();
}

/**
 * 2、初始化模块列表
 */
function queryModuleManagerList() {
    //添加额外的参数传给服务器
    areaTable = $('#datatable').dataTable({
        "ajax": {
            "url": serverBaseUrl,
            "data": function (data) {
                data.appName = "module_moduleList";
                data.terminalType = terminalType;
                data.moduleType = moduleType;
                data.moduleName = moduleName;
                //添加额外的参数传给服务器
                return buildRequestParam(data);
            },
            "dataSrc": function (json) {
                json.iTotalRecords = json.data.recordsTotal;
                json.recordsFiltered = json.data.recordsTotal;
                json.error = json.data.error;
                json.draw = json.data.draw;
                return json.data.data;
            },
            "beforeSend": function (xhr) {
                xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                xhr.setRequestHeader("token", sessionStorage.token);
            }
        },
        "columnDefs": [
            {
                "targets":4,
                render:function (data,type,full,meta) {
                	if(checkValueIsNull(full.operateUserName)){
                		return "-";
                	}else{
                		return full.operateUserName;
                	}
                }
            },{
                "targets":3,
                render:function (data,type,full,meta) {
                	var result = "";
                	if(full.isOpen == 1){
                		result = "<span style='color:#60c060;'>已启用</span>";
                	}
                	if(full.isOpen == 0){
                		result = "<span style='color:red;'>未启用</span>";
                	}
                    return result;
                }
            },{
                "targets":2,
                render:function (data,type,full,meta) {
                	var result = "";
                	if(full.terminalType == 1){
                		result = "APP移动端";
                	}
                	if(full.terminalType == 2){
                		result = "平台控制台";
                	}
                    return result;
                }
            },{
                "targets":7,
                render:function (data,type,full,meta) {
                    return "<a class='bbtn btn-info btn-xs rm ah' onclick='showModelDiv(\"updateModule_div\","+full.moduleID+")'><i class='fa fa-pencil'></i>编辑应用</a>" +
                           "<a class='bbtn btn-info btn-xs ah' onclick='showModelDiv(\"delModule_div\","+full.moduleID+")'><i class='fa fa-trash-o'></i>删除应用</a>";
                }
            }
        ]
    });
}

/**
 * 3、查询应用类型列表
 */
function queryModuleTypeList(moduleTypeEle,moduleTypeid){
	var param = {};
	param.appName = "module_moduleTypeList";
	serverFromJSONData(param,true).then(function (response) {
        var moduleType = $("#"+moduleTypeEle);
        moduleType.empty();
        var moduleListStr = "";
        if(moduleTypeEle == 'moduleType'){
        	moduleListStr = "<option value='0'>全部类型</option>";
        }
        var moduleTypeList = response.data;

        if (moduleTypeList != null && moduleTypeList.length != 0){
            $.each(moduleTypeList,function(name,value) {
            	if(moduleTypeid !=0 && moduleTypeid == value.MODULETYPEID){
            		moduleListStr += "<option value="+value.MODULETYPEID+" selected>"+value.MODULETYPENAME+"</option>";
            	}else{
            		moduleListStr += "<option value="+value.MODULETYPEID+">"+value.MODULETYPENAME+"</option>";
            	}
            });
            moduleType.append(moduleListStr);
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("获取模块类型数据列表失败，请稍后再试!");
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}

/***
 * 4、增加应用（一级模块）
 */
function addModuleInfo(){
	var amoduleName = $("#amoduleName").val();// 应用名称
	var terminalType = $("input[name='terminalType']:checked").val();//终端类型
	var activeState = $("input[name='activeState']:checked").val();// 是否激活
	var moduleIcon = $("#moduleIcon").val();// 应用图标
	var moduleType = $("#a_moduleType").val();// 应用分类
	var summary = $("#moduleSummary").val();// 模块简介
    
    if(checkValueIsNull(amoduleName)){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("应用名称栏不能为空!");
    	return;
    }
    
    var param = {};
	param.appName = "module_addModuleInfo";
	param.moduleName = amoduleName;
	param.terminalType = terminalType;
	param.activeState = activeState;
	param.icon = moduleIcon;
	param.moduleType = moduleType;
	param.summary = summary;
	
	serverFromJSONData(param,true).then(function (response) {
        var flag = response.data;
        if (flag != 0){
        	informationAlert_OnlyCancelButton_REFRESH("closeModelDiv('buildModule_div')","添加应用成功!");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("增加模块失败，失败原因："+response.msg);
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}


/***
 * 5、显示模态框
 */
function showModelDiv(modalid,moduleid){
	if('updateModule_div' == modalid){
		getModuleInfo(moduleid);
	}else if('updateChildModule_div' == modalid){
		/*** 暂时关闭更新一级模态框，查询子应用信息  ***/
		$("#updateModule_div").modal("hide");
		getChildModuleInfo(moduleid);
	}else if('addChildModule_div' == modalid){
		$("#updateModule_div").modal("hide");
		c_moduleid = moduleid;// 增加第三级模块的父级模块id
	}else if('delModule_div' == modalid){
		d_moduleid = moduleid;
	}else if('delChildModule_div' == modalid){
		$("#updateModule_div").modal("hide");
		d_moduleid = moduleid;
	}
	
	$("#"+modalid).modal('show');
}

/***
 * 关闭模态框(通用)
 */
function closeModelDiv(modalid){
	if('delModule_div' == modalid){
		refreshAreaTable();
	}else if('buildModule_div' == modalid){
		refreshAreaTable();
	}else if('delChildModule_div' == modalid){
		$("#updateModule_div").modal("show");
		getChildModuleList(moduleid);// 刷新
	}
	$("#"+modalid).modal('hide');
}

/***
 * 6、获取应用详情
 */
function getModuleInfo(moduleID){
	var param = {};
	param.appName = "module_getModuleInfo";
	param.moduleID = moduleID;
	serverFromJSONData(param,true).then(function (response) {
        var module = response.data;
        if (module != null){
            moduleid = module.moduleID;
            if(module.terminalType == 1){
            	$("#managerChildModule").hide();
            }else{
            	$("#managerChildModule").show();
            }
        	$("#umoduleName").val(module.moduleName);
        	$(":radio[name='uterminalType'][value='" + module.terminalType + "']").prop("checked", "checked");
        	$(":radio[name='uactiveState'][value='" + module.isOpen + "']").prop("checked", "checked");
        	$("#umoduleIcon").val(module.icon);
        	$("#usummary").val(module.summary);
        	queryModuleTypeList('u_moduleType',module.moduleType);
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("获取模块信息失败，请稍后再试!");
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}

/***
 *  获取子应用列表
 */
function getChildModuleList(moduleid){
	$("#childModuleList").empty();
	var param = {};
	param.appName = "module_getChildModuleList";
	param.moduleID = moduleid;
	serverFromJSONData(param,true).then(function (response) {
        var moduleList = response.data;
        var contents = "<div style='margin:50px 0 10px 10px;height: 20px;color: #2494f2;font-weight: bold'>子应用列表</div>";
            contents +="<div class='other_underline'></div>";
        	contents += "<table class='module-table table-tr-border'>";
            
        /** 循环权限列表 **/
        if(moduleList !=null && moduleList.length !=0){
        	$.each(moduleList,function(n,obj) {
        		
        		var childList = obj.list;// 当前模块的子模块
        		var isHaveChildModuleList = 0;
        		/*** 判断当前模块是否有子级应用 ***/
        		//if(childList != null && childList.length != 0){
        			if(obj.moduleID != 91){
        				isHaveChildModuleList = 1;
        			}
        		//}
        		
        	    contents += "<tr class='table-tr-border'>" +
                                "<td class='table-td-h'>"+obj.moduleName+"</td>" +
                                "<td class='table-td-btn'>"+buildAddBtn(obj.moduleID,isHaveChildModuleList)+"</td>"
                                "</tr>";
                    
        		if(isHaveChildModuleList == 1){
        		   /* contents += "<table class='module-table table-tr-border'>";*/
                    $.each(childList,function (nn,oobj) {
                        contents += "<tr class='table-tr-border'>" +
                                    "<td class='table-td-h' style='padding-left:30px'>"+oobj.moduleName+"</td>" +
                                    "<td class='table-td-btn'>"+buildAddBtn(oobj.moduleID,0)+"</td>"
                                    "</tr>";
                    });
        		}
           });
        }
        contents += "</table>";
        contents += "<div style='margin-top: 50px;'></div>";
        $("#childModuleList").append(contents);
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}


/** 16、构建按钮 **/
function buildAddBtn(modelid,flag){
	var srturn = "<a class='bbtn btn-info btn-xs rm ah' onclick='showModelDiv(\"updateChildModule_div\","+modelid+")'>"+
	             "<i class='fa fa-pencil'></i>编辑</a>";
	if(flag == 1){
		srturn += "<a class='bbtn btn-info btn-xs ah'onclick='showModelDiv(\"addChildModule_div\","+modelid+")'>"+
		          "<i class='fa fa-pencil'></i>增加</a>";
	}
           
    srturn += "<a class='bbtn btn-info btn-xs ah' onclick='showModelDiv(\"delChildModule_div\","+modelid+")'><i class='fa fa-trash-o'></i>删除</a>";
    return srturn;
}

/***
 * 17、关闭二级应用编辑div
 */
function  modalRightClose(){
	$("#updateChildModule_div").modal("hide");
	$("#updateModule_div").modal("show");
}

/***
 * 点击关闭
 */
function modalRightClose_a(){
	$("#addChildModule_div").modal("hide");
	$("#updateModule_div").modal("show");
	/*** 刷新右侧弹出框 ***/
	/*getChildModuleList(moduleid);*/
}

/***
 * 子应用增加成功后自动处理
 */
function addChildModule_success_close(){
	$("#addChildModule_div").modal("hide");
	$("#updateModule_div").modal("show");
	/*** 刷新右侧弹出框 ***/
	getChildModuleList(moduleid);
}

/***
 * 点击关闭
 */
function modalRightClose_d(){
	$("#delChildModule_div").modal("hide");
	$("#updateModule_div").modal("show");
}

/***
 * 18、关闭一级应用右上角时，关闭右侧滑动div
 */
function updateModuleDivClose(modalid,flag){
	$("#mchildPrivilege-close").trigger("sidebar:close");
    $("#mchildPrivilege-close").css("box-shadow","");
    if(!checkValueIsNull(modalid)){
    	$("#"+modalid).modal("hide");
    	if(flag == 1){
    		refreshAreaTable();
    	}
    }
}

/***
 * 19、编辑一级应用
 */
function updateModuleInfo(){
	var umoduleName = $("#umoduleName").val();// 应用名称
	var activeState = $("input[name='uactiveState']:checked").val();// 是否激活
	var moduleIcon = $("#umoduleIcon").val();// 应用图标
	var moduleType = $("#u_moduleType").val();// 应用分类
	var summary = $("#usummary").val();// 模块简介
    
    if(checkValueIsNull(umoduleName)){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("应用名称栏不能为空!");
    	return;
    }
    
    var param = {};
    param.moduleID = moduleid;
    param.appName = "module_updateModule";
    param.activeState = activeState;
    param.icon = moduleIcon;
    param.moduleType = moduleType;
    param.summary = summary;
    param.moduleName = umoduleName;
    
    serverFromJSONData(param,true).then(function (response) {
    	if(response.data == 1){
    		informationAlert_OnlyCancelButton_REFRESH("updateModuleDivClose('updateModule_div',1)","更新成功!");
    	}else{
    		informationAlert_OnlyConfirmButton_NOT_REFRESH("更新失败，失败原因："+response.msg);
    	}
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}

/***
 * 20、编辑子级应用
 */
function updateChildModuleInfo(){
	var moduleName = $("#ucmoduleName").val();// 应用名称
	var activeState = $("input[name='ucactiveState']:checked").val();// 是否激活
	var url = $("#ucurl").val();// 应用路径
	var summary = $("#ucsummary").val();// 模块简介
    
    if(checkValueIsNull(moduleName)){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("应用名称栏不能为空!");
    	return;
    }
    
    var param = {};
    param.moduleID = moduleid;
    param.appName = "module_updateModule";
    param.activeState = activeState;
    param.url = url;
    param.summary = summary;
    param.moduleName = moduleName;
    
    serverFromJSONData(param,true).then(function (response) {
    	if(response.data == 1){
    		informationAlert_OnlyCancelButton_REFRESH("modalRightClose()","更新成功!");
    	}else{
    		informationAlert_OnlyConfirmButton_NOT_REFRESH("更新失败，失败原因："+response.msg);
    	}
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}

/***
 * 21、获取子应用详情
 */
function getChildModuleInfo(moduleID){
	var param = {};
	param.appName = "module_getModuleInfo";
	param.moduleID = moduleID;
	serverFromJSONData(param,true).then(function (response) {
        var module = response.data;
        if (module != null){
            moduleid = module.moduleID;
        	$("#ucmoduleName").val(module.moduleName);
        	$(":radio[name='ucactiveState'][value='" + module.isOpen + "']").prop("checked", "checked");
        	$("#ucurl").val(module.visiturl);
        	$("#ucsummary").val(module.summary);
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("获取模块信息失败，请稍后再试!");
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}

/***
 * 22、增加子应用
 */
function addChildModuleInfo(){
	
    var moduleName = $("#acmoduleName").val();// 应用名称
	var activeState = $("input[name='acactiveState']:checked").val();// 是否激活
	var url = $("#acurl").val();// 应用路径
	var summary = $("#acsummary").val();// 模块简介
	var terminalType = $("#terminalType").val();// 模块终端类型
    
    if(checkValueIsNull(moduleName)){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("应用名称栏不能为空!");
    	return;
    }
    
    var param = {};
    param.appName = "module_addModuleInfo";
    param.activeState = activeState;
    param.url = url;
    param.summary = summary;
    param.moduleName = moduleName;
    if(c_moduleid == 0){
    	param.parentID = moduleid;
    }else{
    	param.parentID = c_moduleid;
    }
    param.terminalType = terminalType;
    
    serverFromJSONData(param,true).then(function (response) {
    	if(response.data == 1){
    		informationAlert_OnlyCancelButton_REFRESH("addChildModule_success_close()","添加成功!");
    	}else{
    		informationAlert_OnlyConfirmButton_NOT_REFRESH("添加失败，失败原因："+response.msg);
    	}
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
    c_moduleid = 0;
}

/***
 * 删除应用
 */
function delModule() {
   var param = {};
   param.appName = "module_deleteModule";
   param.moduleID = d_moduleid;
   serverFromJSONData(param,true).then(function (response) {
    	if(response.data == 1){
    		informationAlert_OnlyCancelButton_REFRESH("closeModelDiv('delModule_div')","删除成功!");
    	}else{
    		informationAlert_OnlyConfirmButton_NOT_REFRESH("删除失败，失败原因："+response.msg);
    	}
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}


/***
 * 删除子应用
 */
function delChildModule() {
   var param = {};
   param.appName = "module_deleteModule";
   param.moduleID = d_moduleid;
   serverFromJSONData(param,true).then(function (response) {
    	if(response.data == 1){
    		informationAlert_OnlyCancelButton_REFRESH("closeModelDiv('delChildModule_div')","删除成功!");
    	}else{
    		informationAlert_OnlyConfirmButton_NOT_REFRESH("删除失败，失败原因："+response.msg);
    	}
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}
