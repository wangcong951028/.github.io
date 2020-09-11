$(function(){
	floorList();
	getCM();
	getAMangZtree();
	getROOM();
})

/*列表*/
function floorList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable-checkbox').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.keyword = $("#keyWords").val();
                    data.sttaid = $("#sttaid").val();
                    data.areaid = $("#areaid").val();
                    /*查询参数*/
                    data.appName = "floor_findFloor";
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
               /*  {
                	"targets": 1,
                	"orderable": false,
                	"className": 'select-checkbox',
                	render: function (data, type, full, meta) {
                		return '<input type="checkbox" name="table_records" class="flat" id="checkbox-all-' + full.id + '" value="' + full.id + '" />';
                	}
                }, */{
                    "targets": -1,
                    render: function (data, type, full, meta) {
                        return '<div>' +
                            '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="updateModal(' + full.id + ')"><i class="fa fa-pencil">修改</i></button>' +
                            '<button class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="deleteModal(' + full.id + ')"><i class="fa fa-trash-o">删除</i></button>' +
														'<button class="btn btn-info btn-xs" href="javascript:;"  data-key="' +full.id + '"  onclick="dormodal(' + full.id + ')"><i class="fa fa-pencil">生成寝室数据</i></button>' +
                            '</div>';
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
	document.getElementById('producedorform').reset();
	getAMangZtree();
}

/*新增*/
function save_floor(stats){
	var msg = {};
	var floorName = $("#floorName").val();
	var floorNumber = $("#floorNumber").val();
	var dormNumber = $("#dormNumber").val();
	var nodes = $.fn.zTree.getZTreeObj('treeDemo');
	var node = nodes.getCheckedNodes(true);
	if(floorName == ""){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("楼层名称不能为空！");
	}else if(floorNumber == ""){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("楼层编号不能为空！");
	}else if(node.length == 0){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("所属公寓不能为空！");
	}else if(dormNumber == ""){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("寝室数量不能为空！");
	}else{
		msg.floorName = floorName;
		msg.floorNumber = floorNumber;
		var amang = node[0].id;
		var str = amang.substring(0,amang.indexOf("_"));
		if(str != "amang"){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择正确的公寓楼！");
			return;
		}
		msg.stta = amang.substring(amang.indexOf("_")+1);
		msg.dormNumber = dormNumber;
	    msg.appName="floor_saveFloor";//
	    serverFromJSONData(msg,true).then(function (success) {
	    	if(success.msgState == 200){
	    		if(stats == 1){
	    			$("#myModal").modal('show');
	    		}else if(stats == 2){
	    			$("#myModal").modal('hide');
	    		}
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
function updateModal(id){
	var msg = {};
	msg.id = id;
	msg.appName="floor_findFloorById";//
	    serverFromJSONData(msg,true).then(function (success) {
	        var floor = success.data;
	        $("#update_id").val(floor.id);
	        $("#updatefloorName").val(floor.floorName);
	        $("#updatefloorNumber").val(floor.floorNumber);
	        $("#updatedormNumber").val(floor.dormNumber);
			var aa = $("#updateamang").width();
			var nodes = $.fn.zTree.getZTreeObj('update_treeDemo');
			var node = nodes.getNodeByParam('id',"amang_"+floor.stta);
			if(node != null){
				nodes.checkNode(node,true,true);
				$("#updateamang").val(node.name);
			}
	        $("#updateModal").modal('show');
	    }),function (error) {
		        console.log("访问服务器发生错误，请稍后再试!",error);
	    };
}
/*修改：获取新数据*/
function updateFloor(){
	var msg = {};
	var id = $("#update_id").val();
	var floorName = $("#updatefloorName").val();
	var floorNumber = $("#updatefloorNumber").val();
	var dormNumber = $("#updatedormNumber").val();
	// var amang = $("#updateamang").val();
	var nodes = $.fn.zTree.getZTreeObj('update_treeDemo');
	var node = nodes.getCheckedNodes(true);
	if(floorName == ""){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("楼层名称不能为空！");
	}else if(floorNumber == ""){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("楼层编号不能为空！");
	}else if(node.length == 0){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("所属公寓不能为空！");
	}else if(dormNumber == ""){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("寝室数量不能为空！");
	}else{
		msg.id  = id;
		msg.floorName = floorName;
		msg.floorNumber = floorNumber;
		
		// msg.stta = amang;
		var amang = node[0].id;
		var str = amang.substring(0,amang.indexOf("_"));
		if(str != "amang"){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择正确的公寓楼！");
			return;
		}
		msg.stta = amang.substring(amang.indexOf("_")+1);
		
		msg.dormNumber = dormNumber;
	    msg.appName="floor_updateFloor";//
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
	informationAlert_confirmAndCancelButton("delete_floor("+id+")","是否确认删除?");
}

/*删除*/
function delete_floor(id){
	var msg = {};
	msg.id = id;
	msg.appName="floor_deleteFloor";//
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

/*获取公寓楼*/
function getAMang(id){
    var msg = {};
	msg.area = id;
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
	        $("#sttaid").html('<option value="-1">----- 请选择 -----</option>'+html);
// 	        $("#amang").html('<option value="-1">----- 请选择 -----</option>'+html);
// 	        $("#updateamang").html('<option value="-1">----- 请选择 -----</option>'+html);
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*获取公寓区*/
function getApart(id){
    var msg = {};
	msg.id = id;
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
	        $("#areaid").html('<option value="-1">----- 请选择 -----</option>'+html);
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
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
	        $("#cm").html('<option value="-1">----- 请选择 -----</option>'+html);
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*获取公寓树形结构*/
function getAMangZtree(){
    var msg = {};
    msg.appName = "amang_findAMangZtree";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var amangnodes = success.data;
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
				$.fn.zTree.init($("#treeDemo"), setting, amangnodes);
				$.fn.zTree.init($("#update_treeDemo"), update_setting, amangnodes);
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
	var amangObj = $("#amang");
	amangObj.val(v);
}

function showMenu() {
	var amangObj = $("#amang");
	var amangOffset = $("#amang").offset();
	$("#menuContent").css({left:amangOffset.left + "px", top:amangOffset.top + amangObj.outerHeight() + "px"}).slideDown("fast");
	$("body").bind("mousedown", onBodyDown);
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "amang" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
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
	var amangObj = $("#updateamang");
	amangObj.val(v);
}
function update_showMenu() {
	var update_amangdObj = $("#updateamang");
	var update_amangdOffset = $("#updateamang").offset();
	$("#update_menuContent").css({left:update_amangdOffset.left + "px", top:update_amangdOffset.top + update_amangdObj.outerHeight() + "px"}).slideDown("fast");
	$("body").bind("mousedown", update_onBodyDown);
}
function update_hideMenu() {
	$("#update_menuContent").fadeOut("fast");
	$("body").unbind("mousedown", update_onBodyDown);
}
function update_onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "updateamang" || event.target.id == "update_menuContent" || $(event.target).parents("#update_menuContent").length>0)) {
		update_hideMenu();
	}
}

/*一键生成寝室数据*/
function dormodal(id){
		$("#floor_id").val(id);
		$("#dormodal").modal('show');
}
/*生成寝室*/
function producedor(){
		var floor_id = $("#floor_id").val();
		var room_beds = $("#room_beds").val();
		var sex_id = $("#sex_id").val();
		var use_id = $("#use_id").val();
		var room_id = $("#room_id").val();
		if(sex_id == -1){
				informationAlert_OnlyConfirmButton_NOT_REFRESH("请设置性别！");
				return;
		}
		if(use_id == -1){
				informationAlert_OnlyConfirmButton_NOT_REFRESH("请设置房间用途！");
				return;
		}
		if(room_id == -1){
				informationAlert_OnlyConfirmButton_NOT_REFRESH("请设置房间标准！");
				return;
		}
		var msg = {};
		msg.floorid = floor_id;
		msg.beds = room_beds;
		msg.sex = sex_id;
		msg.roomtype = use_id;
		msg.roomid = room_id;
		msg.appName = "floor_gendor";
		var jsonStr = common(msg);
		$.ajax({
				type: 'POST',
				url: serverBaseUrl,
				data: jsonStr,
				dataType: "json",
				async:false,
				success: function (success) {
						if(success.msgState == 200){
								$("#dormodal").modal('hide');
								document.getElementById("producedorform").reset();
								informationAlert_OnlyConfirmButton_NOT_REFRESH("生成成功！");
						}else{
								informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
						}
						
		},
				beforeSend: function(xhr) {
						xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
						xhr.setRequestHeader("token", static_token);
				}
		});
}
/*获取房间标准*/
function getROOM(){
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
	        $("#room_id").html('<option value="-1" >----- 请选择 -----</option>'+html);
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*获取房间详情*/
function setroombeds(id){
		console.log(id);
		var msg = {};
		msg.id = id;
		msg.appName = "rsm_findRSRoomById";
		var jsonStr = common(msg);
		$.ajax({
				type: 'POST',
				url: serverBaseUrl,
				data: jsonStr,
				dataType: "json",
				async:false,
				success: function (success) {
					var room = success.data;
					$("#room_beds").val(room.beds);
		},
				beforeSend: function(xhr) {
						xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
						xhr.setRequestHeader("token", static_token);
				}
		});
}
