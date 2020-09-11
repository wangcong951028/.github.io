var areaTable;

$(function () {
    init();
    
     $("#myButton").click(function(){
    	areaTable.api().ajax.reload();
    })
});


/**
 * 初始化列表
 */
function init() {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                	
                	data.name=$("#name").val();
                	data.xgh=$("#xgh").val();
                    //添加额外的参数传给服务器
                    data.appName="teacherCheckIn_getAll";
                    
                    return buildRequestParam(data);
                },
                "dataSrc": function (json) {
                    //自定义格式
                    json.iTotalRecords = json.data.recordsTotal;
                    json.recordsFiltered = json.data.recordsTotal;
                    json.error = json.data.error;
                    json.draw = json.data.draw;

                    tocken=json.data.data;
                    return json.data.data;
                },
                "beforeSend": function (xhr) {
                    xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                    xhr.setRequestHeader("token", static_token);
                }
            }
            ,
            "columnDefs": [
            	{
		                "targets": -1,
		                render: function (data, type, full, meta) {
		                	if(full.bedId){
		                		return '<div>' +
	                            '<button disabled="disabled" disabl class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.teacherId + '"  onclick="addModal(' + full.teacherId + ')"><i class="fa fa-pencil">入住</i></button>' +
	                            '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.teacherId + '"  onclick="updateModal(' + full.teacherId + ')"><i class="fa fa-pencil">调寝</i></button>' +
	                            '<button  class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.teacherId + '"  onclick="deleteModal(' + full.teacherId+","+ full.bedId + ')"><i class="fa fa-trash-o">退宿</i></button>' +
	                            '</div>';
		                	}else{
		               			return '<div>' +
	                            '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.teacherId + '"  onclick="addModal(' + full.teacherId + ')"><i class="fa fa-pencil">入住</i></button>' +
	                            '<button disabled="disabled" class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.teacherId + '"  onclick="updateModal(' + full.teacherId + ')"><i class="fa fa-pencil">调寝</i></button>' +
	                            '<button disabled="disabled" class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.teacherId + '"  onclick="deleteModal(' + full.teacherId+","+ full.bedId + ')"><i class="fa fa-trash-o">退宿</i></button>' +
	                            '</div>';
		                	}
	                }

            }]
    });
}

function checkIn(){
	var msg = {};
	msg.bedId = $("#bedSelect").val();
	if(msg.bedId==null || msg.bedId=='' || msg.bedId==-1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择床位号！");
		return;
	}
	msg.teacherId = $("#teacherId").val();
	msg.appName="teacherCheckIn_addteaCheckIn";//
	serverFromJSONData(msg,true).then(function (success) {
		if(success.msgState == 200){
			cleanModal();
			areaTable.api().ajax.reload();
			informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功！");
			refresh();
		}else{
			informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
		}
	}),function (error) {
		console.log("访问服务器发生错误，请稍后再试!",error);
	};
}

function addModal(teacherId){
	$("#teacherId").val(teacherId);
	getDormRoom();
	$("#myModal").modal("show");
}

//查询房间
function getDormRoom(){
	var msg = {};
	msg.use="1,3";
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
	        /*var region_setting = {
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
	        };*/
	        $(document).ready(function(){
	            $.fn.zTree.init($("#treeDemo"), setting, node);
	            $.fn.zTree.init($("#update_treeDemo"), update_setting, node);
//	            $.fn.zTree.init($("#scRegionOrDoR"), region_setting, node);
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
	if(treeNode != null){
		getAllBed(treeNode.id);
	}
	var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
	nodes = zTree.getCheckedNodes(true),
	v2 = "";
	for (var i=0, l=nodes.length; i<l; i++) {
		v2 += nodes[i].name + ",";
	}
	if (v2.length > 0 ) v2 = v2.substring(0, v2.length-1);
	var cityObj = $("#roomSelect");
	cityObj.val(v2);
}

function showMenu() {
	var cityObj = $("#roomSelect");
	var cityOffset = $("#roomSelect").offset();
	$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
	$("body").bind("mousedown", onBodyDown);
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "roomSelect" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
		hideMenu();
	}
}


function update_onClick(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("update_treeDemo");
	zTree.checkNode(treeNode, !treeNode.checked, null, true);
	return false;
}

function update_onCheck(e, treeId, treeNode) {
	if(treeNode != null){
		getAllBed(treeNode.id);
	}
	var zTree = $.fn.zTree.getZTreeObj("update_treeDemo"),
	nodes = zTree.getCheckedNodes(true),
	v = "";
	for (var i=0, l=nodes.length; i<l; i++) {
		v += nodes[i].name + ",";
	}
	if (v.length > 0 ) v = v.substring(0, v.length-1);
	var cityObj = $("#uroomSelect");
	cityObj.val(v);
}
function update_showMenu() {
	var update_doridObj = $("#uroomSelect");
	var update_doridOffset = $("#uroomSelect").offset();
	$("#update_menuContent").css({left:update_doridOffset.left + "px", top:update_doridOffset.top + update_doridObj.outerHeight() + "px"}).slideDown("fast");
	$("body").bind("mousedown", update_onBodyDown);
}
function update_hideMenu() {
	$("#update_menuContent").fadeOut("fast");
	$("body").unbind("mousedown", update_onBodyDown);
}
function update_onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "uroomSelect" || event.target.id == "update_menuContent" || $(event.target).parents("#update_menuContent").length>0)) {
		update_hideMenu();
	}
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


function getAllBed(dorid){
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
						if(bed[i].teachername == null){
							subname = '';
						}else{
							subname = bed[i].teachername;
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
        	$("#bedSelect").html('<option value="-1">----- 请选择 -----</option>'+html);
        	$("#ubedSelect").html('<option value="-1">----- 请选择 -----</option>'+update_html);
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}


function cleanModal(){
	$("#myModal").modal("hide");
}

function deleteModal(teacherId,bedId){
	informationAlert_confirmAndCancelButton("deleteBed("+teacherId+","+bedId+")","是否确认退宿?!");
}

//进行退宿操作
function deleteBed(teacherId,bedId){
	var msg = {};
	msg.bedId = bedId;
	msg.teacherId=teacherId;
	msg.appName="teacherCheckIn_deleteteaCheckIn";//
	serverFromJSONData(msg,true).then(function (success) {
		if(success.msgState == 200){
			cleanModal();
			areaTable.api().ajax.reload();
			informationAlert_OnlyConfirmButton_NOT_REFRESH("退宿成功！");
		}else{
			informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
		}
	}),function (error) {
		console.log("访问服务器发生错误，请稍后再试!",error);
	};
}

function updateModal(teacherId){
	$("#uteacherId").val(teacherId);
	getDormRoom();
	$("#myModalUpdate").modal("show");
}

//进行调宿
function ucheckIn(){
	var msg = {};
	msg.bedId = $("#ubedSelect").val();
	msg.teacherId=$("#uteacherId").val();;
	msg.appName="teacherCheckIn_updateteaCheckIn";//
	serverFromJSONData(msg,true).then(function (success) {
		if(success.msgState == 200){
			cleanModal();
			areaTable.api().ajax.reload();
			$("#myModalUpdate").modal("hide");
			informationAlert_OnlyConfirmButton_NOT_REFRESH("调宿成功！");
			urefresh();
		}else{
			informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
		}
	}),function (error) {
		console.log("访问服务器发生错误，请稍后再试!",error);
	};
}

function refresh(){
	$("#roomSelect").val("");
	
	$("#bedSelect").html('<option value="-1">----- 请选择 -----</option>');
}

function urefresh(){
	$("#uroomSelect").val("");
	
	$("#ubedSelect").html('<option value="-1">----- 请选择 -----</option>');
}
