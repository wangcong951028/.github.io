$(function(){
	getApart();
	amangList();
})

/*列表*/
function amangList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable-checkbox').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.keyword = $("#apartRegion").val();
                    data.area = $("#seacrh_area").val();
                    var dept_id_nodes = $.fn.zTree.getZTreeObj('scRegionOrDoR');
					var dept_id_node =dept_id_nodes.getCheckedNodes(true);
					if(dept_id_node && dept_id_node.length>0){
						if(dept_id_node[0].level==1){
							var area_id = dept_id_node[0].id.substring(6);
							data.area=area_id;
						}
						//代表选择的校区
						if(dept_id_node[0].level==0){
							var area_id = dept_id_node[0].id.substring(4);
							data.schoolArea=area_id;
						}
					}
                    /*查询参数*/
                    data.appName = "amang_findAMang";
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
	                "targets": 5,
	                render: function (data, type, full, meta) {
	                    var adname = "";
	                    if (full.teacherName == null) {
	                        teacherName = "";
	                    } else {
	                        teacherName = full.teacherName;
	                    }
	                    return '<span id="adnameitem" style="color:#73879C;cursor: pointer;" onmouseover="removein('+full.id+','+full.teacherId+',\''+full.schoolRegionId+'\')" onmouseout="removeout()">' +
	                        teacherName + '</span>';
	                }
           	 	},
           	 	{
	                "targets": 6,
	                render: function (data, type, full, meta) {
	                    var info_list = full.infoCars;
	                    if (info_list.length == 0) {
	                        return "";
	                    } else {
	                    	var info_name = '';
	                        for(var i=0;i<info_list.length;i++){
	                        	if(i == info_list.length-1){
	                        		info_name += info_list[i].termInfoName
	                        	}else{
	                        		info_name += info_list[i].termInfoName + ','
	                        	}
	                        }
	                        return info_name;
	                    }
	                }
           	 	},
                {
                    "targets": -1,
                    render: function (data, type, full, meta) {
                    	if(sessionStorage.role==6){
                    		if(full.teacherName==null){
                    			return '<div>' +
                    		    '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="updateModal(' + full.id + ')"><i class="fa fa-pencil">修改</i></button>' +
                    		    '<button class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="deleteModal(' + full.id + ')"><i class="fa fa-trash-o">删除</i></button>' +
                    		    '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="ADModal(' + full.id + ')"><i class="fa fa-pencil">设置管理员</i></button>'+
                    		    '<button class="bbtn btn btn-info btn-xs" data-key="' + full.id + '" data-toggle="modal" onclick="floorNumAddShow(' + full.id + ')"><i class="fa fa-pencil">生成楼层数</i></button>'+
                    		    '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="setTermInfo(' + full.id + ',\''+full.apartmentName+'\')"><i class="fa fa-pencil">设置考勤机</i></button>' +
                    		    '</div>';
                    		}else{
                    			return '<div>' +
                    			    '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="updateModal(' + full.id + ')"><i class="fa fa-pencil">修改</i></button>' +
                    			    '<button class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="deleteModal(' + full.id + ')"><i class="fa fa-trash-o">删除</i></button>' +
                    			    '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="ADModal(' + full.id + ')" disabled="disabled"><i class="fa fa-pencil">设置管理员</i></button>'+
                    			    '<button class="bbtn btn btn-info btn-xs" data-key="' + full.id + '" data-toggle="modal" onclick="floorNumAddShow(' + full.id + ')"><i class="fa fa-pencil">生成楼层数</i></button>'+
                    			    '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="setTermInfo(' + full.id + ',\''+full.apartmentName+'\')"><i class="fa fa-pencil">设置考勤机</i></button>' +
                    			    '</div>';
                    		}
                    		
                    	}else{
                    		return '<div>' +
                    		    '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="updateModal(' + full.id + ')" disabled="disabled"><i class="fa fa-pencil">修改</i></button>' +
                    		    '<button class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="deleteModal(' + full.id + ')" disabled="disabled"><i class="fa fa-trash-o">删除</i></button>' +
                    		    '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="ADModal(' + full.id + ')" disabled="disabled"><i class="fa fa-pencil">设置管理员</i></button>'+
                    		    '<button class="bbtn btn btn-info btn-xs" data-key="' + full.id + '" data-toggle="modal" onclick="floorNumAddShow(' + full.id + ')" disabled="disabled"><i class="fa fa-pencil">生成楼层数</i></button>' + 
                    		    '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="setTermInfo(' + full.id + ',\''+full.apartmentName+'\')"><i class="fa fa-pencil">设置考勤机</i></button>' +
                    		    '</div>';
                    	}
                    }
                }]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
        find_cm();
    });
}

function cleanModal(){
	document.getElementById('saveForm').reset();
	document.getElementById('saveForm2').reset();
}

/*添加公寓楼*/
function saveAMang(stats){
	var msg = {};
    var apartmentName = $("#apartmentName").val()
    var apartmentNumber = $("#apartmentNumber").val();
    var floorNumber = $("#floorNumber").val();
    var dept_id_nodes = $.fn.zTree.getZTreeObj('treeDemo');
	var dept_id_node =dept_id_nodes.getCheckedNodes(true);
	if(dept_id_node[0].id.substring(0,6)!="apart_"){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择公寓区！");
		return;
	}
    var area_id = dept_id_node[0].id.substring(6);
    var apartmentAddress = $("#apartmentAddress").val();
    if(apartmentName == ''){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("公寓名称不能为空！");
    }else if(apartmentNumber == ''){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("公寓编号不能为空！");
    }else if(floorNumber == ''){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("楼层数量不能为空！");
    }else if(area_id == -1){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("所属区域不能为空！");
    }else{
    	msg.apartmentName = apartmentName;
    	msg.apartmentNumber = apartmentNumber;
    	msg.floorNumber = floorNumber;
    	msg.apartmentAddress = apartmentAddress;
    	msg.area = area_id;
	    msg.appName="amang_saveAMang";//
	    serverFromJSONData(msg,true).then(function (success) {
	        if(success.msgState == 200){
	            if(stats == 2){
	                $('#myModal').modal('hide');
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
    msg.appName="amang_findAMangById";//
    serverFromJSONData(msg,true).then(function (success) {
    	var update_apart = success.data;
    	$("#update_id").val(update_apart.id)
        $("#update_apartmentName").val(update_apart.apartmentName)
	    $("#update_apartmentNumber").val(update_apart.apartmentNumber);
	    $("#update_apartmentAddress").val(update_apart.apartmentAddress);
	    $("#update_floorNumber").val(update_apart.floorNumber);
	    var nodes = $.fn.zTree.getZTreeObj('update_treeDemo');
		var node = nodes.getNodeByParam('id',"apart_"+update_apart.area);
		nodes.checkNode(node,true,true);
		$("#update_dorid").val(update_apart.a_name);
        $('#updateModal').modal('show');
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}
/*修改:添加新数据*/
function updateAMang(){
	var msg = {};
	var update_id = $("#update_id").val()
    var update_apartmentName = $("#update_apartmentName").val()
    var update_apartmentNumber = $("#update_apartmentNumber").val();
    var update_apartmentAddress = $("#update_apartmentAddress").val();
    var update_floorNumber = $("#update_floorNumber").val();
    var dept_id_nodes = $.fn.zTree.getZTreeObj('update_treeDemo');
	var dept_id_node =dept_id_nodes.getCheckedNodes(true);
	if(dept_id_node[0].id.substring(0,6)!="apart_"){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择公寓区！");
		return;
	}
    var area_id = dept_id_node[0].id.substring(6);
    if(update_apartmentName == ''){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("公寓名称不能为空！");
    }else if(update_apartmentNumber == ''){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("公寓编号不能为空！");
    }else if(update_floorNumber == ''){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("楼层数量不能为空！");
    }else if(area_id == -1){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("所属区域不能为空！");
    }else{
    	msg.id = update_id;
    	msg.apartmentName = update_apartmentName;
    	msg.apartmentNumber = update_apartmentNumber;
    	msg.floorNumber = update_floorNumber;
    	msg.apartmentAddress = update_apartmentAddress;
    	msg.area = area_id;
	    msg.appName="amang_updateAMang";//
	    serverFromJSONData(msg,true).then(function (success) {
	        if(success.msgState == 200){
	            $('#updateModal').modal('hide');
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

/*删除提示*/
function deleteModal(id){
	informationAlert_confirmAndCancelButton('delete_amang('+id+')','是否确认删除?');
}
function delete_amang(id){
	var msg = {};
	msg.id = id;
    msg.appName="amang_deleteAparMang";//
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

/*获取公寓区域*/
function getApart(){
    var msg = {};
    msg.appName = "apart_findAparMangTree";
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
	        var region_setting = {
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
					onClick: region_onClick,
					onCheck: region_onCheck
				}
	        };
	        $(document).ready(function(){
	            $.fn.zTree.init($("#treeDemo"), setting, node);
	            $.fn.zTree.init($("#update_treeDemo"), update_setting, node);
	            $.fn.zTree.init($("#scRegionOrDoR"), region_setting, node);
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
	var cityObj = $("#area");
	cityObj.val(v2);
}

function showMenu() {
	var cityObj = $("#area");
	var cityOffset = $("#area").offset();
	$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
	$("body").bind("mousedown", onBodyDown);
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "area" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
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


function region_onClick(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("scRegionOrDoR");
	zTree.checkNode(treeNode, !treeNode.checked, null, true);
	return false;
}

function region_onCheck(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("scRegionOrDoR"),
	nodes = zTree.getCheckedNodes(true),
	v = "";
	for (var i=0, l=nodes.length; i<l; i++) {
		v += nodes[i].name + ",";
	}
	if (v.length > 0 ) v = v.substring(0, v.length-1);
	var cityObj = $("#keyWords");
	cityObj.val(v);
}
function region_showMenu() {
	var update_doridObj = $("#keyWords");
	var update_doridOffset = $("#keyWords").offset();
	$("#regino_menuContent").css({left:update_doridOffset.left + "px", top:update_doridOffset.top + update_doridObj.outerHeight() + "px"}).slideDown("fast");
	$("body").bind("mousedown", region_onBodyDown);
}
function region_hideMenu() {
	$("#regino_menuContent").fadeOut("fast");
	$("body").unbind("mousedown", region_onBodyDown);
}
function region_onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "keyWords" || event.target.id == "regino_menuContent" || $(event.target).parents("#regino_menuContent").length>0)) {
		region_hideMenu();
	}
}

function floorNumAddShow(id){
//	var bed_id = new Array();
//	$("input[type='checkbox']:checked").each(function () {
//      if(this.value != 'null' && this.value != 'on'){
//      	bed_id.push(this.value);
//      }
//  });
//	if(bed_id.length==1){
	$("#floorIdSave").val("");
	$("#myModalAdd").modal('show');
	$("#floorIdSave").val(id);
//	}else if(bed_id.length<=0){
//		informationAlert_OnlyConfirmButton_NOT_REFRESH("请勾选一条数据！");
//	}else{
//		informationAlert_OnlyConfirmButton_NOT_REFRESH("只能选择一条数据！");
//	}
	//var mi=bed_id[0];
}

function floorNum(){
	var msg = {};
	msg.stta=$("#floorIdSave").val();
	msg.dormNumber=$("#floorNumSet").val();
	
    msg.appName = "floor_updateFloorByStta";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        if(success.msgState == 200){
							$("#myModalAdd").modal("hide");
            	informationAlert_OnlyConfirmButton_NOT_REFRESH("生成成功！");
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH("生成失败："+success.msg);
	        }
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

function setAdministrator(){
	var msg = {};
	msg.teacherId=$("#tec").val();
	msg.id=$("#apart_id").val();
	
    msg.appName = "amang_updateSetTec";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        if(success.msgState == 200){
	        	areaTable.api().ajax.reload();
            	informationAlert_OnlyConfirmButton_NOT_REFRESH("设置管理员成功！");
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH("设置失败："+success.msg);
	        }
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}


function ADModal(id){
	$("#apart_id").val(id);
	$("#ADModal").modal('show');
	
}

/*获取校区*/
function find_cm(){
	var msg = {};
	msg.appName="cm_findCampusAll";//
    serverFromJSONData(msg,true).then(function (success) {
        var cm = success.data;
        console.debug(cm);
        html = '';
        for(var i=0;i<cm.length;i++){
        	html += '<option value="'+cm[i].id+'">'+cm[i].cmName+'</option>';
        }
        $("#subCampus").html('<option value="-1">----- 请选择 -----</option>'+html);
        $("#updatesubCampus").html('<option value="-1">----- 请选择 -----</option>'+html);
				$("#ad_cm").html('<option value="-1">----- 请选择 -----</option>'+html);
				$("#uad_cm").html('<option value="-1">----- 请选择 -----</option>'+html);
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
		
}


/*根据校区获取教师*/
function findtecbycamp(id,adid){
	var msg = {};
	msg.campid = id;
	msg.appName="cm_findTecByCamp";//
	serverFromJSONData(msg,true).then(function (success) {
		var tec = success.data;
		html = '';
		for(var i=0;i<tec.length;i++){
			if(adid == tec[i].teacherid){
					html += '<option value="'+tec[i].teacherid+'" selected="selected">'+tec[i].teachername+'</option>';
			}else{
					html += '<option value="'+tec[i].teacherid+'">'+tec[i].teachername+'</option>';
			}
		}
		$("#tec").html('<option value="-1">----- 请选择 -----</option>'+html);
		$("#utec").html('<option value="-1">----- 请选择 -----</option>'+html);
	}),function (error) {
		console.log("访问服务器发生错误，请稍后再试!",error);
	}; 
}

function removein(apartid,adid,subCampus){
	findtecbycamp(subCampus,adid);
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

function removeout(){
	// console.log(sessionStorage.role)
	// console.log("移除事件。。。。");
	// document.getElementById('show_div').style.display = 'none';
	//$("#show_div").css("display","none");
}

//点击空白处隐藏隐藏
$('html').click(function(){
	 document.getElementById('show_div').style.display = 'none';
})


/*修改管理员*/
function U_dorme(){
	$("#UADModal").modal("show");
}
/*修改：设置新管理员*/
function UDorm(){
	var msg = {};
	msg.teacherId=$("#utec").val();
	msg.id=$("#uapart_id").val();
	msg.appName="amang_updateSetTec";//
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
		informationAlert_confirmAndCancelButton('d_dorm()','是否取消该管理员身份？');
}
function d_dorm(){
	var msg = {};
	msg.teacherId=-5;
	msg.id=$("#uapart_id").val();
	msg.appName="amang_updateSetTec";//
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
var map = {};
/*获取终端机*/
function findTermInfo(infoCar){
	var msg = {};
	msg.termType = 1;
	msg.appName="termInfo_findTermInfo";//
	serverFromJSONData(msg,true).then(function (success) {
			if(success.msgState == 200){
				var item = success.data;
				var html = '';
				var html_2 = '';
				if(item != null && item.length>0){
					for(var i=0;i<item.length;i++){
						if(infoCar != null){
							if(map['cars_'+item[i].termNo] == item[i].termNo){
								html_2 += '<option value="'+item[i].termNo+'" id="info_'+item[i].termNo+'" selected="selected">'+item[i].termName+'</option>';
							}else{
								html_2 += '<option value="'+item[i].termNo+'" id="info_'+item[i].termNo+'">'+item[i].termName+'</option>';
							}
						}else{
							html += '<option value="'+item[i].termNo+'" id="info_'+item[i].termNo+'">'+item[i].termName+'</option>';
						}
					}
				}
				
				if(infoCar != null){
					$("#update_info_html").html(html_2);
					$("#update_info_html").multiselect("destroy").multiselect(multiselect_update());
				}else{
					$("#info_html").html(html);
					multiselect_add('#info_html');
				}
			}else{
				informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
			}
	}),function (error) {
			console.log("访问服务器发生错误，请稍后再试!",error);
	};
}
/*设置考勤机*/
function setTermInfo(id,name){
	var msg = {};
	msg.id = id;
	msg.appName="amang_findTermInfoCarByAmangId";//
	serverFromJSONData(msg,true).then(function (success) {
			if(success.msgState == 200){
				map = {};
				var data = success.data
				if(data.length != 0){
					for(var i=0;i<data.length;i++){
						map['cars_'+data[i].termInfoCar] = data[i].termInfoCar;
					}
					findTermInfo(map);
					$("#update_amang_id").val(id);
					$("#update_amang_name").val(name);
					$("#update_infoModal").modal("show");
				}else{
					findTermInfo();
					$("#amang_id").val(id);
					$("#amang_name").val(name);
					$("#infoModal").modal("show");
				}
			}else{
				informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
			}
	}),function (error) {
			console.log("访问服务器发生错误，请稍后再试!",error);
	};
}

function setNewTermInfo(){
	var amang_id = $("#amang_id").val();
	var termInfo_car = $("#info_html").val();
	
	if(termInfo_car == null || termInfo_car.length == 0){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择终端机！");
		return;
	}
	var msg = {};
	msg.id = amang_id;
	msg.termInfoCars = termInfo_car;
	msg.appName="amang_addAmangTermInfo";//
	serverFromJSONData(msg,true).then(function (success) {
			if(success.msgState == 200){
				areaTable.api().ajax.reload();
				$("#infoModal").modal("hide");
				informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功！");
			}else{
				informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
			}
	}),function (error) {
			console.log("访问服务器发生错误，请稍后再试!",error);
	};
}

/*初始化多选下拉框*/
function multiselect_add() {
    $('#info_html').multiselect({
        enableClickableOptGroups:true ,
        enableCollapsibleOptGroups:true,
        maxHeight:200,
        buttonWidth: '100%',
        nonSelectedText: '---- 请选择 ----',
        numberDisplayed: 5,
        nSelectedText: '已选择',
        filterPlaceholder: '请输入考勤机名称',
        allSelectedText:'全选'
    });
}

function multiselect_update() {
    $('#update_info_html').multiselect({
        enableClickableOptGroups:true ,
        enableCollapsibleOptGroups:true,
        maxHeight:200,
        buttonWidth: '100%',
        nonSelectedText: '---- 请选择 ----',
        numberDisplayed: 5,
        nSelectedText: '已选择',
        filterPlaceholder: '请输入考勤机名称',
        allSelectedText:'全选'
    });
}

/*修改考勤机*/
function update_setNewTermInfo(){
	var update_amang_id = $("#update_amang_id").val();
	var termInfo_car = $("#update_info_html").val();
	
	if(termInfo_car == null || termInfo_car.length == 0){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择终端机！");
		return;
	}
	var msg = {};
	msg.id = update_amang_id;
	msg.termInfoCars = termInfo_car;
	msg.appName="amang_updateTermInfo";//
	serverFromJSONData(msg,true).then(function (success) {
			if(success.msgState == 200){
				areaTable.api().ajax.reload();
				$("#update_infoModal").modal("hide");
				informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功！");
			}else{
				informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
			}
	}),function (error) {
			console.log("访问服务器发生错误，请稍后再试!",error);
	};
}
