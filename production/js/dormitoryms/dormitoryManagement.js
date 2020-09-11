$(function(){
	dorList();
	getAMang();
	getFloor();
	getFloor_ztree();
	getRoomStandard();
	/*$('#stu').editableSelect({ 
	    effects: 'slide' 
	});*/
	
})

/*列表*/
function dorList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.keyword = $("#keyWord").val();//关键字
                    //data.apartid = $("#apart_id").val();//区域
                    data.amangid = $("#amang_id").val();//公寓
                    data.floorid = $("#floor_id").val();//楼层
                    data.use = $("#use_id").val();//用途
                    data.gender = $("#gender_id").val();//性别
                    /*查询参数*/
                    data.appName = "dor_findADor";
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
                    	if(sessionStorage.role==6){
                    		if(full.studentName){
                    			return '<div>' +
                    			    '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="updateModal(' + full.id + ')"><i class="fa fa-pencil">修改</i></button>' +
                    			    '<button class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="deleteModal(' + full.id + ')"><i class="fa fa-trash-o">删除</i></button>' +
                    			    '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="findModal(' + full.id + ')"><i class="fa fa-pencil">详情查看</i></button>'+
                    			    '<button disabled="disabled" class="bbtn btn btn-info btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="setStudentModal(' + full.id + ')"><i class="fa fa-pencil">室长设置</i></button>'+
                    			    '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="setBed('+full.id+','+full.beds+')"><i class="fa fa-pencil">生成床位</i></button>'+
                    			    '</div>';
                    		}else{
                    			
                    			return '<div>' +
                    			    '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="updateModal(' + full.id + ')"><i class="fa fa-pencil">修改</i></button>' +
                    			    '<button class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="deleteModal(' + full.id + ')"><i class="fa fa-trash-o">删除</i></button>' +
                    			    '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="findModal(' + full.id + ')"><i class="fa fa-pencil">详情查看</i></button>'+
                    			    '<button class="bbtn btn btn-info btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="setStudentModal(' + full.id + ')"><i class="fa fa-pencil">室长设置</i></button>'+
                    			    '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="setBed('+full.id+','+full.beds+')"><i class="fa fa-pencil">生成床位</i></button>'+
                    			    '</div>';
                    		}
                    	}else{
                    		return '<div>' +
                    		    '<button disabled="disabled" class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="updateModal(' + full.id + ')"><i class="fa fa-pencil">修改</i></button>' +
                    		    '<button disabled="disabled" class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="deleteModal(' + full.id + ')"><i class="fa fa-trash-o">删除</i></button>' +
                    		    '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="findModal(' + full.id + ')"><i class="fa fa-pencil">详情查看</i></button>'+
                    		    '<button disabled="disabled" class="bbtn btn btn-info btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="setStudentModal(' + full.id + ')"><i class="fa fa-pencil">室长设置</i></button>'+
                    		    '</div>';
                    	}
                    }
                },{
                    "targets": 6,
                    render: function (data, type, full, meta) {
                    	if(full.genderRestrictions == 1){
                    		return '男';
                    	}else if(full.genderRestrictions == 2){
                    		return '女';
                    	}
                    }
                },{
                    "targets": 8,
                    render: function (data, type, full, meta) {
                    	if(full.bedroomUse == 1){
                    		return '教师用房';
                    	}else if(full.bedroomUse == 2){
                    		return '学生用房';
                    	}else if(full.bedroomUse == 3){
                    		return '管理用房';
                    	}else if(full.bedroomUse == 4){
                    		return '杂物用房';
                    	}else if(full.bedroomUse == 5){
                    		return '其它用房';
                    	}
                    }
                },{
                    "targets": 3,
                    render: function (data, type, full, meta) {
                    	if(full.ableUsed == 1){
                    		return '<span style="color:#5bc0de">有效</span>';
                    	}else{
                    		return '<span style="color:red;">无效</span>';
                    	}
                    }
                },{
                    "targets": 9,
                    render: function (data, type, full, meta) {
                    	var adname = "";
                    if (full.studentName == null) {
                        studentName = "";
                    } else {
                        studentName = full.studentName;
                    }
                    return '<span id="adnameitem" style="color:#73879C;cursor: pointer;" onmouseover="removein('+full.id+','+full.studentId+',\''+full.deptId+'\')" >' +
                        studentName + '</span>';
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
	$("#citySel").val('');
	getFloor_ztree();
}
/*新增*/
function save_dor(stats){
	var msg = {};
	var dormNumber = $("#dormNumber").val();
	var dormStandard = $("#dormStandard").val();
	var bedroomUse = $("#bedroomUse").val();
	var genderRestrictions = $("#genderRestrictions").val();
	var beds = $("#beds").val();
	var note = $("#note").val();
	var nodes = $.fn.zTree.getZTreeObj('treeDemo');
	var node = nodes.getCheckedNodes(true);
	if(dormNumber == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("寝室编号不能为空！");
	}else if(dormStandard == -1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("寝室标准不能为空！");
	}else if(bedroomUse == -1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("寝室用途不能为空！");
	}else if(genderRestrictions == -1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("性别限制不能为空！");
	}else if(node.length == 0){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("楼层不能为空！");
	}else{
		msg.dormNumber = dormNumber;
		msg.roomStandard = dormStandard;
		msg.bedroomUse = bedroomUse;
		msg.bedroomUse = bedroomUse;
		msg.genderRestrictions = genderRestrictions;
		msg.beds = beds;
		msg.note = note;
		var str = node[0].id;
		msg.ableUsed=$("#ableUse").is(':checked')?1:2;
		msg.floor = str.substring(str.indexOf("_")+1);
		msg.appName="dor_saveDor";//
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
	msg.appName="dor_findDorById";//
		    serverFromJSONData(msg,true).then(function (success) {
		    	if(success.msgState == 200){
		    		var dor = success.data;
		    		$("#update_id").val(dor.id);
		    		$("#update_dormNumber").val(dor.dormNumber);
		    		$("#update_dormStandard").val(dor.dormStandard);
		    		$("#update_bedroomUse").val(dor.bedroomUse);
		    		$("#update_genderRestrictions").val(dor.genderRestrictions);
		    		$("#update_beds").val(dor.beds);
		    		$("#update_note").val(dor.note);
		    		var nodes = $.fn.zTree.getZTreeObj('update_treeDemo');
		    		var node = nodes.getNodeByParam('id','floor_'+dor.floor)
		    		nodes.checkNode(node,true,true);
		    		$("#update_scitySel").val(node.name);
		    		
		    		if(success.data.ableUsed==1){
		    			$("#updateIsShow").html('<input type="checkbox" id="updateAbleUsed" style="display: inline;" checked="checked"/>是');
		    		}else{
		    			$("#updateIsShow").html('<input type="checkbox" id="updateAbleUsed" style="display: inline;"/>是');
		    		}
		    		$("#updateModal").modal('show');
		        }else{
		            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
		        }
		    }),function (error) {
			        console.log("访问服务器发生错误，请稍后再试!",error);
		    };
}
/*修改：获取新数据*/
function updateDor(){
	var msg = {};
	var id = $("#update_id").val();
	var dormNumber = $("#update_dormNumber").val();
	var dormStandard = $("#update_dormStandard").val();
	var bedroomUse = $("#update_bedroomUse").val();
	var genderRestrictions = $("#update_genderRestrictions").val();
	var beds = $("#update_beds").val();
	var note = $("#update_note").val();
	var nodes = $.fn.zTree.getZTreeObj('update_treeDemo');
	var node = nodes.getCheckedNodes(true);
	if(dormNumber == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("寝室编号不能为空！");
	}else if(dormStandard == -1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("寝室标准不能为空！");
	}else if(bedroomUse == -1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("寝室用途不能为空！");
	}else if(genderRestrictions == -1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("性别限制不能为空！");
	}else if(node.length == 0){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("楼层不能为空！");
	}else if(note.Length>100){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("只能输入100个字！");
	}else{
		msg.id = id;
		msg.dormNumber = dormNumber;
		msg.dormStandard = dormStandard;
		msg.bedroomUse = bedroomUse;
		msg.bedroomUse = bedroomUse;
		msg.genderRestrictions = genderRestrictions;
		msg.beds = beds;
		msg.note = note;
		msg.ableUsed=$("#updateAbleUsed").is(':checked')?1:2;
		var str = node[0].id;
		msg.floor = str.substring(str.indexOf("_")+1);
		msg.appName="dor_updateDor";//
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
	informationAlert_confirmAndCancelButton('delete_dor('+id+')','是否确认删除?');
}
/*删除*/
function delete_dor(id){
	var msg = {};
	msg.id = id;
	msg.appName="dor_deleteDor";//
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
function getFloor_ztree(){
    var msg = {};
    msg.appName = "floor_floorZtree";//dor_getDorZtree
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
//	            zTreeObj = $.fn.zTree.init($("#floor_treeDemo"), setting, node);
//	            zTreeObj = $.fn.zTree.init($("#update_floor_treeDemo"), setting, node);
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
	var cityObj = $("#update_scitySel");
	cityObj.val(v);
}
function update_showMenu() {
	var update_cityObj = $("#update_scitySel");
	var update_cityOffset = $("#update_scitySel").offset();
	$("#update_menuContent").css({left:update_cityOffset.left + "px", top:update_cityOffset.top + update_cityObj.outerHeight() + "px"}).slideDown("fast");
	$("body").bind("mousedown", update_onBodyDown);
}
function update_hideMenu() {
	$("#update_menuContent").fadeOut("fast");
	$("body").unbind("mousedown", update_onBodyDown);
}
function update_onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "update_scitySel" || event.target.id == "update_menuContent" || $(event.target).parents("#update_menuContent").length>0)) {
		update_hideMenu();
	}
}


var room_list;
//房间标准查询
function getRoomStandard(){
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
        	if(success.msgState==200){
						room_list = new Array();
        		var html="<option value='-1'>----请选择----</option>";
        		for (var i=0;i<success.data.length;i++) {
        			html+="<option  value='"+success.data[i].id+"'>"+success.data[i].name+"</option>";
        		}
        		$("#dormStandard").html(html);
        		$("#update_dormStandard").html(html);
        		$("#find_dormStandard").html(html);
						room_list.push(success.data);
        	}else{
//      		informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        	}
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

function set_beds(val){
		for (var i=0;i<room_list.length;i++) {
			console.log(room_list[i]);
			for(var j=0;j<room_list[i].length;j++){
				var id = ''+room_list[i][j].id+'';
				if(val == id){
					$("#beds").val(room_list[i][j].beds);
				}
			}
		}
	}
	
	function set_beds_update(val){
			for (var i=0;i<room_list.length;i++) {
				for(var j=0;j<room_list[i].length;j++){
					var id = ''+room_list[i][j].id+'';
					if(val == id){
						$("#update_beds").val(room_list[i][j].beds);
					}
				}
			}
		}

/**查看详情**/
function findModal(id){
	var msg = {};
	msg.id = id;
	msg.appName="dor_findDorById";//
		    serverFromJSONData(msg,true).then(function (success) {
		    	if(success.msgState == 200){
		    		var dor = success.data;
		    		$("#find_id").val(dor.id);
		    		$("#find_dormNumber").val(dor.dormNumber);
		    		$("#find_dormStandard").val(dor.dormStandard);
		    		$("#find_bedroomUse").val(dor.bedroomUse);
		    		$("#find_genderRestrictions").val(dor.genderRestrictions);
		    		$("#find_beds").val(dor.beds);
		    		$("#find_note").val(dor.note);
		    		$("#find_scitySel").val(dor.floor_name);
		    		var nodes = $.fn.zTree.getZTreeObj('update_treeDemo');
		    		var node = nodes.getNodeByParam('id','floor_'+dor.floor)
		    		nodes.checkNode(node,true,true);
		    		$("#update_scitySel").val(node.name);
		    		
		    		if(success.data.ableUsed==1){
		    			$("#findIsShow").html('有效');
		    		}else{
		    			$("#findIsShow").html('无效');
		    		}
		    		$("#findModal").modal('show');
		        }else{
		            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
		        }
		    }),function (error) {
			        console.log("访问服务器发生错误，请稍后再试!",error);
		    };
}

function setStudentModal(id){
	$("#apart_id").val(id);
	find_cm();
	$("#ADModal").modal("show");
}

/*获取校区*/
function find_cm(subCampus,studentId){
	var msg = {};
	msg.appName="cm_findCampusAll";//
    serverFromJSONData(msg,true).then(function (success) {
        var cm = success.data;
        console.debug(cm);
        html = '';
        for(var i=0;i<cm.length;i++){
        	html += '<option value="'+cm[i].id+'">'+cm[i].cmName+'</option>';
        }
		if(subCampus){
			$("#uad_cm").html('<option value="-1">----- 请选择 -----</option>'+html);
			$("#uad_cm").val(subCampus.substr(0,8));
			getClass(subCampus.substr(0,8),subCampus.substr(0,12),subCampus,studentId);
		}else{
	        $("#subCampus").html('<option value="-1">----- 请选择 -----</option>'+html);
	        $("#updatesubCampus").html('<option value="-1">----- 请选择 -----</option>'+html);
			$("#ad_cm").html('<option value="-1">----- 请选择 -----</option>'+html);
			$("#uad_cm").html('<option value="-1">----- 请选择 -----</option>'+html);
		}
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
		
}

//根据校区获取年级
function getClass(id,campuse,subCampus,studentId){
	var msg = {};
	msg.campid=id;
	msg.appName="cm_findBySchoolRegion";//
    serverFromJSONData(msg,true).then(function (success) {
        var cm = success.data;
        html = '';
        for(var i=0;i<cm.length;i++){
        	html += '<option value="'+cm[i].deptId+'">'+cm[i].deptName+'</option>';
        }
        
        if(campuse){
        	$("#ugrade").html('<option value="-1">----- 请选择 -----</option>' + html);
        	$("#ugrade").val(campuse);
        	getClassmate(subCampus.substr(0,12),subCampus.substr(0,16),subCampus,studentId)
        }else{
        	$("#grade").html('<option value="-1">----- 请选择 -----</option>' + html);
        	$("#ugrade").html('<option value="-1">----- 请选择 -----</option>' + html);
        }
        /*$("#subCampus").html('<option value="-1">----- 请选择 -----</option>'+html);
        $("#updatesubCampus").html('<option value="-1">----- 请选择 -----</option>'+html);
		$("#ad_cm").html('<option value="-1">----- 请选择 -----</option>'+html);
		$("#uad_cm").html('<option value="-1">----- 请选择 -----</option>'+html);*/
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function getClassmate(id,classMate,subCampus,studentId){
	var msg = {};
	msg.opperOriganizaCode=id;
	msg.appName="origaniza_getAllClass";//
    serverFromJSONData(msg,true).then(function (success) {
        var cm = success.data;
        html = '<option value="-1">----- 请选择 -----</option>';
        for(var i=0;i<cm.length;i++){
        	html += '<option value="'+cm[i].id+'">'+cm[i].deptName+'</option>';
        }
        
        if(classMate){
        	$("#uclassmate").html(html);
        	$("#uclassmate").val(classMate);
        	getStu(subCampus,studentId);
        }else{
        	$("#uclassmate").html(html);
        	$("#classmate").html(html);
        	
        }
       /* $("#subCampus").html('<option value="-1">----- 请选择 -----</option>'+html);
        $("#updatesubCampus").html('<option value="-1">----- 请选择 -----</option>'+html);
		$("#ad_cm").html('<option value="-1">----- 请选择 -----</option>'+html);
		$("#uad_cm").html('<option value="-1">----- 请选择 -----</option>'+html);*/
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function getStu(id,studentId){
	var msg = {};
	var deptList=new Array();
	deptList.push(id);
	msg.deptId=deptList;
	msg.appName="leave_findSubByClzidAndSubname";//
    serverFromJSONData(msg,true).then(function (success) {
        var cm = success.data;
        html = '<option value="-1">----- 请选择 -----</option>';
        for(var i=0;i<cm.length;i++){
        	html += '<option value="'+cm[i].studentId+'">'+cm[i].studentName+'</option>';
        }
        if(studentId){
        	$("#ustu").html(html);
        	$("#ustu").val(studentId);
        }else{
        	$("#ustu").html(html);
        	$("#stu").html(html);
        }
       /* $("#subCampus").html('<option value="-1">----- 请选择 -----</option>'+html);
        $("#updatesubCampus").html('<option value="-1">----- 请选择 -----</option>'+html);
				$("#ad_cm").html('<option value="-1">----- 请选择 -----</option>'+html);
				$("#uad_cm").html('<option value="-1">----- 请选择 -----</option>'+html);*/
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function setAdministrator(){
	var msg = {};
	msg.studentId=$("#stu").val();
	msg.id=$("#apart_id").val();
	msg.appName="dor_chiefofOffice";//
    serverFromJSONData(msg,true).then(function (success) {
       if(success.msgState==200){
       		$('#ADModal').modal('hide');
       		areaTable.api().ajax.reload();
       		informationAlert_OnlyConfirmButton_NOT_REFRESH("设置成功！");
       }else{
       		informationAlert_OnlyConfirmButton_NOT_REFRESH("设置失败："+success.msg);
       }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function removein(apartid,adid,subCampus){
	//findtecbycamp(subCampus,adid);
	//进行数据回显
	//getChiefofOffice(adid,subCampus);
	find_cm(subCampus,adid);
	getMousePos();
	if(sessionStorage.role == 6){
			$("#uapart_id").val(apartid);
			$("#utec").val(adid);
			$("#uad_cm").val(subCampus);
			document.getElementById('show_div').style.display = 'block';
	}
}

function getMousePos(event) {
      var e = event || window.event;
	  document.getElementById('show_div').style.position = 'fixed';
	  document.getElementById('show_div').style.left = 30+e.clientX+'px'
	  document.getElementById('show_div').style.top = e.clientY-15+'px'
}

//点击空白处隐藏隐藏
$('html').click(function(){
	 document.getElementById('show_div').style.display = 'none';
})


/*修改管理员*/
function U_dorme(){
	$("#UADModal").modal("show");
}


/*修改管理员*/
function U_dorme(){
	$("#UADModal").modal("show");
}
/*设置新管理员*/
function UDorm(){
	var msg = {};
	msg.studentId=$("#ustu").val();
	msg.id=$("#uapart_id").val();
	msg.appName="dor_chiefofOffice";//
	serverFromJSONData(msg,true).then(function (success) {
			if(success.msgState == 200){
				$('#UADModal').modal('hide');
				areaTable.api().ajax.reload();
				informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功");
			}else{
				informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
			}
	}),function (error) {
			console.log("访问服务器发生错误，请稍后再试!",error);
	};
}

/*删除宿舍管理员*/
function delete_dorm(){
		informationAlert_confirmAndCancelButton('d_dorm()','是否取消该室长身份？');
}
function d_dorm(){
	var msg = {};
	msg.studentId="";
	msg.id=$("#uapart_id").val();
	msg.appName="dor_chiefofOffice";//
	serverFromJSONData(msg,true).then(function (success) {
			if(success.msgState == 200){
				$('#UADModal').modal('hide');
				areaTable.api().ajax.reload();
				informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功");
			}else{
				informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
			}
	}),function (error) {
			console.log("访问服务器发生错误，请稍后再试!",error);
	};
}

/**根据学生id获取学生详情**/
function getChiefofOffice(adid,subCampus){
	var msg = {};
	msg.studentId=adid;
	msg.appName="amang_updateSetTec";//
	serverFromJSONData(msg,true).then(function (success) {
			if(success.msgState == 200){
			}else{
				informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
			}
	}),function (error) {
			console.log("访问服务器发生错误，请稍后再试!",error);
	};
}

/**床位生成**/
function setBed(dorId,beds){
	var msg = {};
	msg.countBed=beds;
	msg.dorid=dorId;
	msg.appName="bed_autogenerationBed";//
	serverFromJSONData(msg,true).then(function (success) {
			if(success.msgState == 200){
				informationAlert_OnlyConfirmButton_NOT_REFRESH("生成成功！");
			}else{
				informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
			}
	}),function (error) {
			console.log("访问服务器发生错误，请稍后再试!",error);
	};
}
