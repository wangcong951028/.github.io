var areaTable;
var listDorm;
var proejctInfo;
var classInfo;
var organizationCode;
var setting = {
    view:{showLine: false,dblClickExpand: false},
    data: {simpleData: {enable: true}},
    callback: {onRightClick: onRightClick,onClick: zLeftTreeOnClick}
};

$(function () {
    init();
    initDormTree();
    findAllDorm();
    
    $("#myButton").click(function () {
        areaTable.api().ajax.reload();
    });
    
    $("#dormBuiding").change(function(){
    	findFloor();
    });
    
    $("#floorNum").change(function(){
    	findDormNum();
    })
    
});


function zLeftTreeOnClick(event, treeId, treeNode) {
    organizationCode = treeNode.id;
    areaTable.api().ajax.reload();
}

function onRightClick(event, treeId, treeNode) {
    if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
    } else if (treeNode && !treeNode.noR) {
        zTree.selectNode(treeNode);
        showRMenu("node", event.clientX, event.clientY);
    }
}
/**
 * 初始化列表
 */
function init() {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.name=$("#stuName").val();
                    data.xgh=$("#keyWord").val();
                    data.isUsing=$("#isStake").val();
                    data.sex=$("#stuSex").val();
                    data.dormBuldingId=$("#dormBuiding").val();
					data.regionId=$("#dormRegion").val();
					data.floorId=$("#floorNum").val();
					data.roomId=$("#dormSelect").val();
                    data.appName="dor_dromMessageList";
                    data.classId=organizationCode;
                    
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
                    "targets": 1,
                    "orderable": false,
                    "className": 'select-checkbox',
                    render: function (data, type, full, meta) {
                        return '<input type="checkbox" name="table_records" class="flat" id="checkbox-all-' + full.pk_id + '" value="' + full.pk_id + '" />'+
                        '<input type="type" hidden="hidden" name="table_records" class="flat" id="bed_id_' + full.pk_id + '" value="' + full.bed_id + '" />';
                    }
                },{
	                "targets": 2,
	                render: function (data, type, full, meta) {
	               		return '<span id="name_'+full.pk_id+'">'+full.name+'</span>';
                	}
                },{
	                "targets": 3,
	                render: function (data, type, full, meta) {
	               		return '<span id="xgh_'+full.pk_id+'">'+full.xgh+'</span>';
                	}
                },{
	                "targets": 4,
	                render: function (data, type, full, meta) {
	               		if(full.sex==1){
	               			return '<span id="sex_'+full.pk_id+'">男</span>';
	               		}else{
	               			return '<span id="sex_'+full.pk_id+'">女</span>';
	               		}
					}

	            },{
	                "targets": 5,
	                render: function (data, type, full, meta) {
						var roomname = '';
						if(full.roomname == null){
							roomname = '';
						}else{
							roomname = full.roomname;
						}
						return '<span id="room_'+full.pk_id+'">'+roomname+'</span>';
					}

	            },{
		                "targets": 9,
		                render: function (data, type, full, meta) {
		                	if(full.dormNum == null){
		                		full.dormNum = '';
		                	}
	               			return '<span id="dor_'+full.pk_id+'">'+full.dormNum+'</span>';
	                }
	
	            },{
		                "targets": 10,
		                render: function (data, type, full, meta) {
		                	if(full.bedNum == null){
		                		full.bedNum = '';
		                	}
	               			return '<input type="text" id="bed_id_'+full.pk_id+'" hidden="hidden" value="'+full.bed_id+'"/><span id="bed_'+full.pk_id+'">'+full.bedNum+'</span>';
	                }

            }]
    });
}

//寝室树形结构处理
function initDormTree(){
	var msg = {};
    msg.deptTypeID = 0;
    msg.appName="respondents_findDeptNode";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState === 200){
        	var node = success.data;
        	zNodes = node;
        	$.fn.zTree.init($("#tree"), setting, zNodes);
            zTree = $.fn.zTree.getZTreeObj("tree");
            rMenu = $("#rMenu");
            if (node != null){
                $("#dataLoadIng").css("display","none");
            }
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加或修改失败："+success.msg);
        }
        findDormBuilding();
    });
}

function oncheckDeptCalbask(treeNode) {
    classInfo = new Array();
    for(var i = 0;i<treeNode.length;i++){
        classInfo.push(treeNode[i].id);
    }
}

//进行公寓区的查询
function findAllDorm(){
    var msg = {};
    msg.appName = "apart_findAparMangAll";
    // 4、对整个参数进行加密
    var jsonStr = buildRequestParam(msg);

    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
            if(success.msgState == 200){
            	var html="<option selected='selected' value='-1'>---- 请选择 -----</option>"
            	$.each(success.data,function(index,element){
            		html+="<option value="+element.id+">"+element.name+"</option>";
            	})
            	$("#dormRegion").html(html);
            }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

//进行楼栋的查询
function findDormBuilding(){
	var msg = {};
    msg.area=$("#dormRegion").val();
    msg.appName="amang_findAMangAll";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState === 200){
        	var html="<option selected='selected' value='-1'>---- 请选择 -----</option>"
            	$.each(success.data,function(index,element){
            		html+="<option value="+element.id+">"+element.apartmentName+"</option>";
            	})
            	$("#dormBuiding").html(html);
        }else{
//          informationAlert_OnlyConfirmButton_NOT_REFRESH("查询失败："+success.msg);
        }
    });
}

//进行楼层的查询
function findFloor(){
	var msg = {};
    msg.sttaid=$("#dormBuiding").val();
    msg.appName="floor_findFloorAll";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState === 200){
        	var flor = success.data;
        	var html="<option selected='selected' value='-1'>---- 请选择 -----</option>"
            	for(var i=0;i<flor.length;i++){
            		html+="<option value="+flor[i].id+">"+flor[i].floorName+"</option>";
            	}
            	$("#floorNum").html(html);
        }else{
//          informationAlert_OnlyConfirmButton_NOT_REFRESH("查询失败："+success.msg);
        }
    });
}

//进行宿舍楼的查询
function findDormNum(){
	var msg = {};
    msg.floorid=$("#floorNum").val();
    msg.appName="dor_findDorAll";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState === 200){
        	var html="<option selected='selected' value='-1'>---- 请选择 -----</option>"
            	$.each(success.data,function(index,element){
            		html+="<option value="+element.id+">"+element.dormNumber+"</option>";
            	})
            	$("#dormSelect").html(html);
        }else{
//          informationAlert_OnlyConfirmButton_NOT_REFRESH("查询失败："+success.msg);
        }
    });
}