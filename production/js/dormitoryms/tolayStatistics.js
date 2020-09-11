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
    $("#myButton").click(function () {
        areaTable.api().ajax.reload();
    });
	$("#restButton").click(function(){
		$("#salaryType").val("");
		$("#beginTime").val("");
		$("#endTime").val("");
		
	});
    
});


function zLeftTreeOnClick(event, treeId, treeNode) {
	if(treeNode.level==0){
		organizationCode = '';
	}else{
		organizationCode = treeNode.id;
	}
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
                    data.status=$("#salaryType").val();
                    data.beginTime=$("#beginTime").val();
                    data.endTime=$("#endTime").val();
                    data.appName="goToBed_statistics";
                    data.deptId=organizationCode;
                    
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
	                "targets": 4,
	                render: function (data, type, full, meta) {
	               		if(full.goToBedStatue==4){
	               			return '<span >'+full.sumcount+'</span>';
	               		}else{
							return '0';
						}
					}

	            },{
	                "targets": 5,
	                render: function (data, type, full, meta) {
						if(full.goToBedStatue==1){
							return '<span >'+full.sumcount+'</span>';
						}else{
							return '0';
						}
					}

	            },{
	                "targets": 6,
	                render: function (data, type, full, meta) {
						if(full.goToBedStatue==3){
							return '<span >'+full.sumcount+'</span>';
						}else{
							return '0';
						}
					}
	            },{
	                "targets": 7,
	                render: function (data, type, full, meta) {
						if(full.goToBedStatue==2){
							return '<span >'+full.sumcount+'</span>';
						}else{
							return '0';
						}
					}

	            }
				
				]
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
    });
}

function oncheckDeptCalbask(treeNode) {
    classInfo = new Array();
    for(var i = 0;i<treeNode.length;i++){
        classInfo.push(treeNode[i].id);
    }
}
//导出数据
function exportData(){
	var msg = {};
	msg.status=$("#salaryType").val();
	msg.beginTime=$("#beginTime").val();
	msg.endTime=$("#endTime").val();
	msg.appName="goToBed_export";
	msg.deptId=organizationCode;
	serverFromJSONData(msg,true).then(function (success) {
		if(success.msgState == 200){
				var nle = success.data;
				var jsonDome = []
				for (var i = 0; i < nle.length; i++) {
					jsonDome[i] = {
								"所属组织": nle[i].deptName,
								"归寝时间": nle[i].attendanceTime,
								"未归人数": totalCount(4,nle[i].goToBedStatue,nle[i].sumcount),
								"正常归寝人数": totalCount(1,nle[i].goToBedStatue,nle[i].sumcount),
								"晚归人数": totalCount(3,nle[i].goToBedStatue,nle[i].sumcount),
								"归寝未知人数": totalCount(2,nle[i].goToBedStatue,nle[i].sumcount)
						};
				}
				downloadExl(jsonDome,'tolay',true);
				informationAlert_OnlyConfirmButton_NOT_REFRESH("导出成功！");
		}else{
				informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
		}
	});
}
/**
 * 返回人数
 */
function totalCount(num,status,count){
	if(status==4 && num==4){
		return count;
	}else if(status==3 && num==3){
		return count;
	}else if( status==2 && num==2){
		return count;
	}else if( status==1 && num==1){
		return count;
	}else{
		return 0;
	}
}