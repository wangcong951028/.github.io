$(function(){
	bedList();
	getApart();
	getAMang();
	getFloor();
	getDor_ztree();
})

/*列表*/
function bedList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.keyword = $("#keyWord").val();//寝室编号
                    data.apartid = $("#apart_id").val();//公寓区id
                    data.amangid = $("#amang_id").val();//楼栋id
                    data.floorid = $("#floor_id").val();//楼层id
                    data.use = $("#use_id").val();//房间用途
                    data.roomid = $("#room_id").val();//房间标准
                    data.takeUp = $("#takeUp_id").val();//入住状态
					data.enanled = $("#enanled_id").val();//是否有效
                    /*查询参数*/
                    data.appName = "bed_findBed";
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
                    "targets": -1,
                    render: function (data, type, full, meta) {
                        return '<div>' +
                            '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="updateModal(' + full.id + ')"><i class="fa fa-pencil">修改</i></button>' +
                            '<button class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="deleteModal(' + full.id + ')"><i class="fa fa-trash-o">删除</i></button>' +
							'</div>';
                    }
                },{
                    "targets": 6,
                    render: function (data, type, full, meta) {
                    	if(full.takeUp == 1){
                    		return '<span style="color:#5bc0de">已入住</span>';
                    	}else if(full.takeUp == 2){
                    		return '<span style="color:#5cb85c">未入住</span>';
                    	}
                    }
                },{
                    "targets": 7,
                    render: function (data, type, full, meta) {
                    	if(full.enanled == 1){
                    		return '<span style="color:#5bc0de">有效</span>';
                    	}else if(full.enanled == 2){
                    		return '<span style="color:red">无效</span>';
                    	}
                    }
                }]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

function cleanModal(){
	document.getElementById('saveForm').reset();
	getDor_ztree();
	$("#dorid").val('');
}

/*新增*/
function saveBed(stats){
	var radios = $('input[type="radio"][name="enanled"]');
	var enanled = "";
	for(var i=0;i<radios.length;i++){
			if(radios[i].checked){
				if(i<radios.length){
						enanled += radios[i].value;
				}
			}
	}
	var msg = {};
	var bedID = $("#bedID").val();
	var theSorting = $("#theSorting").val();
	var nodes = $.fn.zTree.getZTreeObj('treeDemo');
	var node = nodes.getCheckedNodes(true);
	if(bedID == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("床位号不能为空！");
	}else if(node.length == 0){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("所属寝室不能为空！");
	}else if(theSorting == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("排序不能为空！");
	}else{
		msg.bedID = bedID;
		var str = node[0].id;
		msg.dorid = str.substring(str.indexOf("_")+1);
		msg.theSorting = theSorting;
		msg.enanled = enanled;
		msg.appName="bed_saveBed";//
	    serverFromJSONData(msg,true).then(function (success) {
	    	if(success.msgState == 200){
	    		if(stats == 1){
	    			$("#myModal").modal('show');
	    		}else if(stats == 2){
	    			$("#myModal").modal('hide');
	    		}
	            areaTable.api().ajax.reload();
				cleanModal();
	            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功！");
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
	        }
	    }),function (error) {
		        console.log("访问服务器发生错误，请稍后再试!",error);
	    };
	}
}

/*修改:获取原有数据*/
function updateModal(id){
	var msg = {};
	msg.id = id;
	msg.appName="bed_findBedById";//
	    serverFromJSONData(msg,true).then(function (success) {
	    	if(success.msgState == 200){
	    		var bed = success.data;
	    		$("#update_id").val(id);
	    		$("#update_bedID").val(bed.bedID);
	    		$("#update_theSorting").val(bed.theSorting);
	    		var nodes = $.fn.zTree.getZTreeObj('update_treeDemo');
	    		var node = nodes.getNodeByParam('id',"dor_"+bed.dorid);
	    		nodes.checkNode(node,true,true);
	    		$("#update_dorid").val(node.name);
				var enanled = bed.enanled;
				if(enanled == 1){
					$("input[type='radio'][id='uradio1'][value='1']").prop('checked',true);
				}else if(enanled == 2){
					$("input[type='radio'][id='uradio2'][value='2']").prop('checked',true);
				}
				
	    		$("#updateModal").modal('show');
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
	        }
	    }),function (error) {
		        console.log("访问服务器发生错误，请稍后再试!",error);
	    };
}
/*修改：添加新数据*/
function updateBed(){
	var uradios = $('input[type="radio"][name="uenanled"]');
	var uenanled = "";
	for(var i=0;i<uradios.length;i++){
			if(uradios[i].checked){
				if(i<uradios.length){
						uenanled += uradios[i].value;
				}
			}
	}
	var msg = {};
	var update_id = $("#update_id").val();
	var update_bedID = $("#update_bedID").val();
	var update_theSorting = $("#update_theSorting").val();
	var nodes = $.fn.zTree.getZTreeObj('update_treeDemo');
	var node = nodes.getCheckedNodes(true);
	if(bedID == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("床位号不能为空！");
	}else if(node.length == 0){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("所属寝室不能为空！");
	}else if(theSorting == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("排序不能为空！");
	}else{
		msg.id = update_id;
		msg.bedID = update_bedID;
		var str = node[0].id;
		msg.dorid = str.substring(str.indexOf("_")+1);
		msg.theSorting = update_theSorting;
		msg.enanled = uenanled;
		msg.appName="bed_updateBed";//
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
function deleteModal(id){
	informationAlert_confirmAndCancelButton("deleteBed("+id+")","是否确认删除？");
}
/*删除*/
function deleteBed(id){
	var msg = {};
	msg.id = id;
	msg.appName="bed_deleteBed";//
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

/*获取公寓楼树形结构*/
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
					onClick: onClick,
					onCheck: onCheck
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
					onClick: update_onClick,
					onCheck: update_onCheck
				}
	        };
	        $(document).ready(function(){
	            $.fn.zTree.init($("#treeDemo"), setting, node);
	            $.fn.zTree.init($("#update_treeDemo"), update_setting, node);
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
	v = "";
	for (var i=0, l=nodes.length; i<l; i++) {
		v += nodes[i].name + ",";
	}
	if (v.length > 0 ) v = v.substring(0, v.length-1);
	var doridObj = $("#dorid");
	doridObj.val(v);
}

function showMenu() {
	var doridObj = $("#dorid");
	var doridOffset = $("#dorid").offset();
	$("#menuContent").css({left:doridOffset.left + "px", top:doridOffset.top + doridObj.outerHeight() + "px"}).slideDown("fast");
	$("body").bind("mousedown", onBodyDown);
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "dorid" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
		hideMenu();
	}
}


function update_onClick(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("update_treeDemo");
	zTree.checkNode(treeNode, !treeNode.checked, null, true);
	return false;
}

function update_onCheck(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("update_treeDemo"),
	nodes = zTree.getCheckedNodes(true),
	v = "";
	for (var i=0, l=nodes.length; i<l; i++) {
		v += nodes[i].name + ",";
	}
	if (v.length > 0 ) v = v.substring(0, v.length-1);
	var cityObj = $("#update_dorid");
	cityObj.val(v);
}
function update_showMenu() {
	var update_doridObj = $("#update_dorid");
	var update_doridOffset = $("#update_dorid").offset();
	$("#update_menuContent").css({left:update_doridOffset.left + "px", top:update_doridOffset.top + update_doridObj.outerHeight() + "px"}).slideDown("fast");
	$("body").bind("mousedown", update_onBodyDown);
}
function update_hideMenu() {
	$("#update_menuContent").fadeOut("fast");
	$("body").unbind("mousedown", update_onBodyDown);
}
function update_onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "update_dorid" || event.target.id == "update_menuContent" || $(event.target).parents("#update_menuContent").length>0)) {
		update_hideMenu();
	}
}

/*获取寝室标准*/
function getApart(){
    var msg = {};
    msg.appName = "rsm_findRSRoomAll";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var room = success.data;
	        var html = '';
	        for(var i=0;i<room.length;i++){
	        	html += '<option value="'+room[i].id+'">'+room[i].name+'</option>';
	        }
	        $("#room_id").html('<option value="-1">----- 请选择 -----</option>'+html);
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}