$(function(){
	disManagList();
	getApart();
	getDept_ztree();
	getDor_ztree();
	getType();
//	getBed();
//	getContent();
})

/*列表*/
function disManagList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.dor_name = $("#dorname").val();
                    data.apart_id = $("#apart_id").val();
                    data.manag_id = $("#amang_id").val();
                    data.floor_id = $("#floor_id").val();
                    data.begin_time = $("#beginTime").val();
                    data.end_time = $("#endTime").val();
                    var nodes = $.fn.zTree.getZTreeObj('deptDemo');
                    if(nodes != null){
                    	var node = nodes.getCheckedNodes(true);
                    	if(node.length>0){
                    		data.dept_id = node[0].id;
                    	}
                    }
                    /*查询参数*/
                    data.appName = "dismanag_findDisManag";
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
                }]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

function cleanModal(){
	document.getElementById("saveForm").reset();
	getDor_ztree();
	$("#bed_id").html('<option value="-1">----- 请选择 -----</option>');
}

/*新增违纪*/
function saveDisManag(){
	var msg = {};
	var type_id = $("#type_id").val();
	var content_id = $("#content_id").val();
	var bed_id = $("#bed_id").val();
	var att_time = $("#att_time").val();
	var note = $("#note").val();
	
	var str = $("#bed_id_"+bed_id).html();
	if(str != undefined){
		var inType = str.substring(str.indexOf('/')+1);
	}

	var dor_id;
	var dorNodes = $.fn.zTree.getZTreeObj('dorDemo');
	if(dorNodes != null){
		var dorNode = dorNodes.getCheckedNodes(true);
		if(dorNode.length>0){
			var dorStr = dorNode[0].id;
			if(dorStr != undefined){
				dor_id = dorStr.substring(dorStr.indexOf("_")+1);
			}
		}
	}
	if(type_id == -1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择违纪类型！");
	}else if(content_id == -1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择违纪原因！");
	}else if(dor_id == undefined){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择违纪寝室！");
	}else if(bed_id == -1 || inType == '未入住'){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择有学生入住的床位！");
	}else if(att_time == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请填写违纪时间！");
	}else{
		msg.type_id = type_id;
		msg.content_id = content_id;
		msg.dor_id = dor_id;
		msg.bed_id = bed_id;
		msg.att_time = att_time;
		msg.note = note;
		msg.appName="dismanag_saveDisManag";//
	    serverFromJSONData(msg,true).then(function (success) {
	    	if(success.msgState == 200){
				$("#myModal").modal('hide');
	    		cleanModal();
	            areaTable.api().ajax.reload();
	            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功！");
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
	        }
	    }),function (error) {
		        console.log("访问服务器发生错误，请稍后再试!",error);
	    };
	}
}

/*修改：获取原有数据*/
var update_id;
function update_disManag_prompt(){
	update_id = new Array();
	$("input[type='checkbox']:checked").each(function () {
        if(this.value != 'null' && this.value != 'on'){
        	update_id.push(this.value);
        }
    });
    if(update_id.length == 1){
    	var msg = {}
		msg.id = update_id[0];
		msg.appName="dismanag_findDisManagById";//
	    serverFromJSONData(msg,true).then(function (success) {
	    	if(success.msgState == 200){
	    		var disMang = success.data;
	    		$("#update_id").val(disMang.id);
	    		$("#update_type_id").val(disMang.type_id);
	    		$("#update_content_id").html('<option value="'+disMang.content_id+'">'+ disMang.content_name +'</option>');
	    		$("#update_bed_id").html('<option value="'+disMang.bed_id+'" id="update_bed_id_'+disMang.bed_id+'">'+ disMang.bed_name +'/已入住</option>');
	    		$("#update_att_time").val(disMang.dis_time);
	    		$("#update_note").val(disMang.note);
	    		
	    		var nodes = $.fn.zTree.getZTreeObj('update_dorDemo');
	    		var node = nodes.getNodeByParam('id','dor_'+disMang.dor_id);
	    		nodes.checkNode(node,true,true);
	    		$("#update_dor_id").val(disMang.dor_name);
	    		
	    		$("#updateModal").modal('show');
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
	        }
	    }),function (error) {
		        console.log("访问服务器发生错误，请稍后再试!",error);
	    };
    }else{
    	informationAlert_OnlyConfirmButton_NOT_REFRESH('请选择一条数据!');
    }
	
}
/*修改:添加新数据*/
function update_disManag(){
	var msg = {};
	var update_id = $("#update_id").val();
	var update_type_id = $("#update_type_id").val();
	var update_content_id = $("#update_content_id").val();
	var update_bed_id = $("#update_bed_id").val();
	var update_att_time = $("#update_att_time").val();
	var update_note = $("#update_note").val();
	var str = $("#update_bed_id_"+update_bed_id).html();
	if(str != undefined){
		var inType = str.substring(str.indexOf('/')+1);
	}

	var dor_id;
	var dorNodes = $.fn.zTree.getZTreeObj('update_dorDemo');
	if(dorNodes != null){
		var dorNode = dorNodes.getCheckedNodes(true);
		if(dorNode.length>0){
			var dorStr = dorNode[0].id;
			if(dorStr != undefined){
				dor_id = dorStr.substring(dorStr.indexOf("_")+1);
			}
		}
	}
	if(update_type_id == -1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择违纪类型！");
	}else if(update_content_id == -1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择违纪原因！");
	}else if(dor_id == undefined){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择违纪寝室！");
	}else if(update_bed_id == -1 || inType == '未入住'){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择有学生入住的床位！");
	}else if(update_att_time == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请填写违纪时间！");
	}else{
		msg.id = update_id;
		msg.type_id = update_type_id;
		msg.content_id = update_content_id;
		msg.dor_id = dor_id;
		msg.bed_id = update_bed_id;
		msg.att_time = update_att_time;
		msg.note = update_note;
		msg.appName="dismanag_updateDisManag";//
	    serverFromJSONData(msg,true).then(function (success) {
	    	if(success.msgState == 200){
				$("#updateModal").modal('hide');
	            areaTable.api().ajax.reload();
	            informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功！");
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
	        }
	    }),function (error) {
		        console.log("访问服务器发生错误，请稍后再试!",error);
	    };
	}
}

/*删除：提示*/
var delete_id;
function delete_disManag_prompt(){
	delete_id = new Array();
	$("input[type='checkbox']:checked").each(function () {
        if(this.value != 'null' && this.value != 'on'){
        	delete_id.push(this.value);
        	
        }
    });
    if(delete_id.length>0){
    	informationAlert_confirmAndCancelButton('delete_disManag()','是否确认删除该考核记录？');
    }else{
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择数据！");
    }
	
}
/*删除*/
function delete_disManag(){
	var msg = {}
	msg.ids = delete_id;
	msg.appName="dismanag_deleteDisManag";//
    serverFromJSONData(msg,true).then(function (success) {
    	if(success.msgState == 200){
            areaTable.api().ajax.reload();
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功！");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
	        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}
//----------------------------------------------------------------------------------------------------------------

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

/*获取公寓区域*/
function getApart(){
    var msg = {};
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
	        if(apartid == -1){
	        	$("#amang_id").html('<option value="-1">----- 请选择 -----</option>');
	        	$("#floor_id").html('<option value="-1">----- 请选择 -----</option>');
	        }else{
	        	$("#amang_id").html('<option value="-1">----- 请选择 -----</option>'+html);
	        }
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
	        if(amangid == -1){
	        	$("#floor_id").html('<option value="-1">----- 请选择 -----</option>');
	        }else{
	        	$("#floor_id").html('<option value="-1">----- 请选择 -----</option>'+html);
	        }
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*获取床位*/
function getBed(dorid){
    var msg = {};
    if(dorid != undefined){
    	var dor_id = dorid.substring(dorid.indexOf("_")+1);
    }
    msg.dorid = dor_id;
    msg.appName = "bed_findBedAll";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var bed = success.data;
	        var html = '';
	        var update_html = '';
	        for(var i=0;i<bed.length;i++){
				var subname = '';
				if(bed[i].s_name == null){
					subname = '';
				}else{
					subname = bed[i].s_name;
				}
				var enanled = ''
				if(bed[i].enanled == 1){
					enanled = '有效'
				}else if(bed[i].enanled == 2){
					enanled = '无效'
				}
	        	if(bed[i].takeUp == 1){
	        		html += '<option value="'+bed[i].id+'" id="bed_id_'+bed[i].id+'">'+bed[i].bedID+'/'+enanled+'/'+subname+'</option>';
	        		update_html += '<option value="'+bed[i].id+'" id="update_bed_id_'+bed[i].id+'">'+bed[i].bedID+'/'+enanled+'/'+subname+'</option>';
	        	}else if(bed[i].takeUp == 2){
	        		html += '<option value="'+bed[i].id+'" id="bed_id_'+bed[i].id+'">'+bed[i].bedID+'/'+enanled+'/未入住</option>';
	        		update_html += '<option value="'+bed[i].id+'" id="update_bed_id_'+bed[i].id+'">'+bed[i].bedID+'/'+enanled+'/未入住</option>';
	        	}
	        	
	        }
        	$("#bed_id").html('<option value="-1">----- 请选择 -----</option>'+html);
        	$("#update_bed_id").html('<option value="-1">----- 请选择 -----</option>'+update_html);
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*获取违纪类型*/
function getType(){
    var msg = {};
    msg.appName = "type_findTypeAll";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var typ = success.data;
	        var html = '';
	        var update_html = '';
	        for(var i=0;i<typ.length;i++){
        		html += '<option value="'+typ[i].id+'">'+typ[i].type_name+'</option>';
        		update_html += '<option value="'+typ[i].id+'">'+typ[i].type_name+'</option>';
	        }
        	$("#type_id").html('<option value="-1">----- 请选择 -----</option>'+html);
        	$("#update_type_id").html('<option value="-1">----- 请选择 -----</option>'+update_html);
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*获取违纪内容*/
function getContent(id){
    var msg = {};
    msg.type_id = id;
    msg.appName = "content_findContentAll";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var content = success.data;
	        var html = '';
	        var update_html = '';
	        for(var i=0;i<content.length;i++){
        		html += '<option value="'+content[i].id+'">'+content[i].content_name+'</option>';
        		update_html += '<option value="'+content[i].id+'">'+content[i].content_name+'</option>';
	        }
        	$("#content_id").html('<option value="-1">----- 请选择 -----</option>'+html);
        	$("#update_content_id").html('<option value="-1">----- 请选择 -----</option>'+update_html);
	        
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
					onClick: onClick_dept,
					onCheck: onCheck_dept
				}
	        };
	        
	        $(document).ready(function(){
	            $.fn.zTree.init($("#deptDemo"), setting, node);
	        });
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*获取寝室树形结构*/
function getDor_ztree(){
    var msg = {};
    msg.appName = "dor_getDorZtree";
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
					onClick: onClick_dor,
					onCheck: onCheck_dor
				}
	        };
	        var update_setting = {
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
					onClick: update_onClick_dor,
					onCheck: update_onCheck_dor
				}
	        };
	        
	        $(document).ready(function(){
	            $.fn.zTree.init($("#dorDemo"), setting, node);
	            $.fn.zTree.init($("#update_dorDemo"), update_setting, node);
	        });
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

//-----------------------------------------------------
function onClick_dept(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("deptDemo");
	zTree.checkNode(treeNode, !treeNode.checked, null, true);
	return false;
}

function onCheck_dept(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("deptDemo"),
	nodes = zTree.getCheckedNodes(true),
	v2 = "";
	for (var i=0, l=nodes.length; i<l; i++) {
		v2 += nodes[i].name + ",";
	}
	if (v2.length > 0 ) v2 = v2.substring(0, v2.length-1);
	var deptObj = $("#dept_id");
	deptObj.val(v2);
}

//-----------------------------------------------------
function onClick_dor(e, treeId, treeNode) {
	if(treeNode != null){
		getBed(treeNode.id);
	}
	var zTree = $.fn.zTree.getZTreeObj("dorDemo");
	zTree.checkNode(treeNode, !treeNode.checked, null, true);
	return false;
}

function onCheck_dor(e, treeId, treeNode) {
	if(treeNode != null){
		getBed(treeNode.id);
	}
	var zTree = $.fn.zTree.getZTreeObj("dorDemo"),
	nodes = zTree.getCheckedNodes(true),
	v2 = "";
	for (var i=0, l=nodes.length; i<l; i++) {
		v2 += nodes[i].name + ",";
	}
	if (v2.length > 0 ) v2 = v2.substring(0, v2.length-1);
	var dorObj = $("#dor_id");
	dorObj.val(v2);
}
//-----------------------------------------------------
function update_onClick_dor(e, treeId, treeNode) {
	if(treeNode != null){
		getBed(treeNode.id);
	}
	var zTree = $.fn.zTree.getZTreeObj("update_dorDemo");
	zTree.checkNode(treeNode, !treeNode.checked, null, true);
	return false;
}

function update_onCheck_dor(e, treeId, treeNode) {
	if(treeNode != null){
		getBed(treeNode.id);
	}
	var zTree = $.fn.zTree.getZTreeObj("update_dorDemo"),
	nodes = zTree.getCheckedNodes(true),
	v2 = "";
	for (var i=0, l=nodes.length; i<l; i++) {
		v2 += nodes[i].name + ",";
	}
	if (v2.length > 0 ) v2 = v2.substring(0, v2.length-1);
	var dorObj = $("#update_dor_id");
	dorObj.val(v2);
}

//-----------------------------------------------------

function showMenu(type) {
	var commonObj = $("#"+type+"_id");
	var commonOffset = $("#"+type+"_id").offset();
	$("#"+type+"_Content").css({left:commonOffset.left + "px", top:commonOffset.top + commonObj.outerHeight() + "px"}).slideDown("fast");
	$("body").bind("mousedown", {data:type},onBodyDown);
}
function hideMenu(type) {
	$("#"+type+"_Content").fadeOut("fast");
	$("body").unbind("mousedown", {data:type},onBodyDown);
}
function onBodyDown(event) {
	var common_type = event.data.data;
	if (!(event.target.id == "menuBtn" || event.target.id == ""+common_type+"_id" || event.target.id == ""+common_type+"_Content" || $(event.target).parents("#"+common_type+"_Content").length>0)) {
		hideMenu(common_type);
	}
}