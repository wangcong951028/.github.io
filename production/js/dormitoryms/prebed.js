$(function(){
	pre_bed_list();
	getCM();
	getApart();
	getAMang();
	getFloor();
	getTerm();
	getDept_ztree();
})

/*列表*/
function pre_bed_list() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable-checkbox').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.keyword = $("#keyWord").val();//寝室编号
                    data.cm_id = $("#cm_id").val();//校区
                    data.apartid = $("#apart_id").val();//公寓区
                    data.amangid = $("#amang_id").val();//楼栋
                    data.floorid = $("#floor_id").val();//楼层
                    data.gender = $("#gender_id").val();//性别
                    data.termid = $("#term_id").val();//学期
                    data.pre_allocated = $("#pre_allocated").val();//是否分配
                    var nodes = $.fn.zTree.getZTreeObj('treeDemo');
                    if(nodes != null){
                    	var node = nodes.getCheckedNodes(true);
                    	if(node.length>0){
                    		data.deptid = node[0].id;
                    	}
                    }
                    /*查询参数*/
                    data.appName = "predistribution_findPDbed";
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
                {
                    "targets": 1,
                    "orderable": false,
                    "className": 'select-checkbox',
                    render: function (data, type, full, meta) {
                        return '<input type="checkbox" name="table_records" class="flat" id="checkbox-all-' + full.id + '" value="' + full.id + '" />';
                    }
                },{
                    "targets": 8,
                    render: function (data, type, full, meta) {
                        if(full.dor_sex==1){
                        	return  '男';
                        }else if(full.dor_sex==2){
                        	return  '女';
                        };
                    }
                },{
                    "targets": 9,
                    render: function (data, type, full, meta) {
                        if(full.bed_enabled==1){
                        	return  ''+full.bed_bedID+'/<span style="color:#5bc0de">有效</span>';
                        }else if(full.bed_enabled==2){
                        	return  ''+full.bed_bedID+'/<span style="color:red">无效</span>';
                        };
                    }
                }/*,{
                    "targets": -1,
                    render: function (data, type, full, meta) {
                        return '<div>' +
                            '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="updateModal(' + full.id + ')"><i class="fa fa-pencil">修改</i></button>' +
                            '<button class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="deleteModal(' + full.id + ')"><i class="fa fa-trash-o">删除</i></button>' +
                            '</div>';
                    }
                }*/]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

function cleanModal(){
	$("#dept_id").val('');
	getDept_ztree();
}

var bed_id;
function show_modal(){
	bed_id = new Array();
	$("input[type='checkbox']:checked").each(function () {
        if(this.value != 'null' && this.value != 'on'){
        	bed_id.push(this.value);
        }
    });
	if(bed_id.length>0){
		$("#myModal").modal('show');
	}else{
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请勾选一条数据！");
	}
}
/*分配床位*/
function save_prebed(){
	var msg = {};
	var termid = $("#termid").val();
	var dept_id_nodes = $.fn.zTree.getZTreeObj('dept_ztree');
	var dept_id_node =dept_id_nodes.getCheckedNodes(true);
	var dept_id;
	if(dept_id_node.length>0){
		dept_id = dept_id_node[0].id;
	}
	if(dept_id == null || dept_id == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择班级！");
	}else{
		msg.bedid = bed_id;
		msg.deptid = dept_id;
		msg.appName="predistribution_savePDbed";//
		serverFromJSONData(msg,true).then(function (success) {
			if(success.msgState == 200){
				$("#myModal").modal('hide');
				cleanModal();
		        areaTable.api().ajax.reload();
		        informationAlert_OnlyConfirmButton_NOT_REFRESH("分配成功！");
		    }else{
		        informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
		    }
		}),function (error) {
		        console.log("访问服务器发生错误，请稍后再试!",error);
		};
    }
}

/*取消分配*/
var bedids
function res_pre(){
	bedids = new Array();
	$("input[type='checkbox']:checked").each(function () {
        if(this.value != 'null' && this.value != 'on'){
        	console.debug(this.value);
        	bedids.push(this.value);
        }
    });
    if(bedids.length == 0){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH('请至少选择一条记录！');
    }else{
    	console.debug("bedids="+bedids);
    	informationAlert_confirmAndCancelButton('delete_pre()','是否取消预分配方案?');
    }
}
function delete_pre(){
	var msg = {};
	console.debug("ids="+bedids);
	msg.id = bedids;
	msg.appName="predistribution_deletePDbed";//
	serverFromJSONData(msg,true).then(function (success) {
		if(success.msgState == 200){
	        areaTable.api().ajax.reload();
	        informationAlert_OnlyConfirmButton_NOT_REFRESH("取消成功！");
	    }else{
	        informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
	    }
	}),function (error) {
	        console.log("访问服务器发生错误，请稍后再试!",error);
	};
}

//---------------------------------------------------------------------------------------------------------------------------

//公共参数
function common(msg){
    var param = {};
    // 1、公共参数组装
    param.appKey = "aGFuZHlDYW1wdXM=";
    param.appSecret ="1234567890abcedefgh";
    var time = new Date().getTime();
    param.time = time;

    /*msg.index = 1;*/
    var paramJsonMsg = JSON.stringify(msg);
    param.param =  paramJsonMsg;
    // 3、生成签名
    var temp = 'appKey=aGFuZHlDYW1wdXM=&appSecret=1234567890abcedefgh&param='+paramJsonMsg+'&time=' + time;
    param.sign = hex_md5(temp);
    // 4、对整个参数进行加密
    var jsonStr = JSON.stringify(param);
    return jsonStr;
}

/*获取校区*/
function getCM(){
    var msg = {};
    msg.appName = "cm_findCampusAll";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var cm = success.data;
	        var html = '';
	        for(var i=0;i<cm.length;i++){
	        	html += '<option value="'+cm[i].id+'">'+cm[i].cmName+'</option>';
	        }
	        $("#cm_id").html('<option value="-1">----- 请选择 -----</option>'+html);
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*获取公寓区域*/
function getApart(cmid){
    var msg = {};
    msg.id = cmid
    msg.appName = "apart_findAparMangAll";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var apart = success.data;
	        var html = '';
	        for(var i=0;i<apart.length;i++){
	        	html += '<option value="'+apart[i].id+'">'+apart[i].name+'</option>';
	        }
	        $("#apart_id").html('<option value="-1">----- 请选择 -----</option>'+html);
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*获取公寓楼*/
function getAMang(apartid){
    var msg = {};
    msg.area = apartid;
    msg.appName = "amang_findAMangAll";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var amang = success.data;
	        var html = '';
	        for(var i=0;i<amang.length;i++){
	        	html += '<option value="'+amang[i].id+'">'+amang[i].apartmentName+'</option>';
	        }
	        $("#amang_id").html('<option value="-1">----- 请选择 -----</option>'+html);
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*获取楼层*/
function getFloor(amangid){
    var msg = {};
    msg.sttaid = amangid;
    msg.appName = "floor_findFloorAll";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var floor = success.data;
	        var html = '';
	        for(var i=0;i<floor.length;i++){
	        	html += '<option value="'+floor[i].id+'">'+floor[i].floorName+'</option>';
	        }
	        $("#floor_id").html('<option value="-1">----- 请选择 -----</option>'+html);
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*获取学期*/
function getTerm(){
    var msg = {};
    msg.appName = "term_findTerm";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var term = success.data.data;
	        var html = '';
	        for(var i=0;i<term.length;i++){
	        	html += '<option value="'+term[i].pk_ID+'">'+term[i].t_term+'</option>';
	        }
	        $("#term_id").html('<option value="-1">----- 请选择 -----</option>'+html);
	        $("#termid").html('<option value="-1">----- 请选择 -----</option>'+html);
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*获取班级树形结构*/
function getDept_ztree(){
    var msg = {};
    msg.deptTypeID = 0;
    msg.appName="respondents_findDeptNode";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var apart = success.data;
	        var node = success.data;
	        var zTreeObj;
	        var setting = {
	            check: {
	                enable: true,
	                chkStyle: "radio",
					radioType: "all"

	            },
	            data: {
	                simpleData: {
	                    enable: true
	                }
	            },
	            view: {
					dblClickExpand: false
				},
				callback: {
					onClick: onClick,
					onCheck: onCheck
				}
	        };
	        var setting_dept = {
	            check: {
	                enable: true,
	                chkStyle: "radio",
					radioType: "all"

	            },
	            data: {
	                simpleData: {
	                    enable: true
	                }
	            },
	            view: {
					dblClickExpand: false
				},
				callback: {
					onClick: onClick_dept,
					onCheck: onCheck_dept
				}
	        };
	        
	        $(document).ready(function(){
	            $.fn.zTree.init($("#treeDemo"), setting, node);
	            $.fn.zTree.init($("#dept_ztree"), setting_dept, node);
	        });
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

function onClick(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	zTree.checkNode(treeNode, !treeNode.checked, null, true);
	return false;
}

function onCheck(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
	nodes = zTree.getCheckedNodes(true),
	v2 = "";
	for (var i=0, l=nodes.length; i<l; i++) {
		v2 += nodes[i].name + ",";
	}
	if (v2.length > 0 ) v2 = v2.substring(0, v2.length-1);
	var cityObj = $("#citySel");
	cityObj.val(v2);
}

function showMenu() {
	var cityObj = $("#citySel");
	var cityOffset = $("#citySel").offset();
	$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
	$("body").bind("mousedown", onBodyDown);
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "citySel" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
		hideMenu();
	}
}

function onClick_dept(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("dept_ztree");
	zTree.checkNode(treeNode, !treeNode.checked, null, true);
	return false;
}

function onCheck_dept(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("dept_ztree"),
	nodes = zTree.getCheckedNodes(true),
	v2 = "";
	for (var i=0, l=nodes.length; i<l; i++) {
		v2 += nodes[i].name + ",";
	}
	if (v2.length > 0 ) v2 = v2.substring(0, v2.length-1);
	var deptObj = $("#dept_id");
	deptObj.val(v2);
}

function showMenu_dept() {
	var deptObj = $("#dept_id");
	var deptOffset = $("#dept_id").offset();
	$("#menuContent_dept").css({left:deptOffset.left + "px", top:deptOffset.top + deptObj.outerHeight() + "px"}).slideDown("fast");
	$("body").bind("mousedown", onBodyDown_dept);
}
function hideMenu_dept() {
	$("#menuContent_dept").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown_dept);
}
function onBodyDown_dept(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "dept_id" || event.target.id == "menuContent_dept" || $(event.target).parents("#menuContent_dept").length>0)) {
		hideMenu_dept();
	}
}