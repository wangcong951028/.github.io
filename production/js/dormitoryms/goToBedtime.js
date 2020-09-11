var areaTable;
var organizationCode;
var deptId;
var dormId;
var schoolId;
var setting = {
    view:{showLine: false,dblClickExpand: false},
    data: {simpleData: {enable: true}},
    callback: {onRightClick: onRightClick,onClick: zLeftTreeOnClick}
};


$(function(){
	init();
	initDeptTree();
	getAllBuilding();
	
	$("#myButton").click(function () {
        areaTable.api().ajax.reload();
    });
    $("#myButtonSet").click(function (){
    	getOneBySchoolId();
    	$("#myModal_time").modal("show");
    })
    
})

function init(){
	$(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    /*查询参数*/
                    data.name=$("#stuName").val();
                    data.xgh=$("#keyWord").val();
                    data.status=$("#isStake").val();
                    data.beginTime=$("#beginTime").val();
                    data.endTime=$("#endTime").val();
                    
                    var dept_id_nodes = $.fn.zTree.getZTreeObj('scRegionOrDoR');
                    var buildingId;
                    if(dept_id_nodes){
                    	var dept_id_node =dept_id_nodes.getCheckedNodes(true);
                    	if(dept_id_node[0]){
                    		buildingId = dept_id_node[0].id.substring(6);
                    	}
                    }
                    
                    data.building=buildingId;
                   	data.deptId= organizationCode;
                    data.appName = "goToBed_listGoToBed";
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
            "columnDefs": [{
                    "targets": -3,
                    render: function (data, type, full, meta) {
                    	var str = full.attendanceTime;
						var date=(new Date(str).getTime());
                    	var dep= ''+full.deptId;
                    	var dorm=full.buildName;
                    	if(full.goToBedStatue == 1){
                    		return '<button disabled="disabled" id="statue_'+full.studentId+'" class="btn btn-info btn-xs" onclick="changeStatue('+full.studentId+','+date+',\''+dep+'\',\''+dorm+'\')">正常</button>';
                    	}else if(full.goToBedStatue == 2){
                    		return '<button id="statue_'+full.studentId+'" class="btn btn-info btn-xs" onclick="changeStatue('+full.studentId+','+date+',\''+dep+'\',\''+dorm+'\')">未知</button>';
                    	}else if(full.goToBedStatue == 3){
                    		return '<button id="statue_'+full.studentId+'" class="btn btn-success btn-xs" onclick="changeStatue('+full.studentId+','+date+',\''+dep+'\',\''+dorm+'\')">迟到</button>';
                    	}else{
                    		return '<button id="statue_'+full.studentId+'" class="btn btn-danger btn-xs" onclick="changeStatue('+full.studentId+','+date+',\''+dep+'\',\''+dorm+'\')">未归</button>';
                    	}
                    }
                }]
        });
    });
}

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

function initDeptTree(){
	var msg = {};
    msg.appName="origaniza_listOriganizaTree";
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
            informationAlert_OnlyConfirmButton_NOT_REFRESH("初始化部门列表失败："+success.msg);
        }
    });
}

//确认时间设置
function confirmPush(){
	var msg = {};
	msg.cron=$("#timeSet").val();
	msg.schoolId=schoolId;
    msg.appName="quartz_saveQuartz";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState === 200){
        	informationAlert_OnlyConfirmButton_NOT_REFRESH("操作成功！");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("操作失败："+success.msg);
        }
    });
}

//修改状态（将学生的非正常状态改为正常）
function changeStatue(id,attendanceDate,deptIds,dorm){
	dormId='';
	$("#myModal_updateStatue").modal("show");
	$("#change_stats_del").val(id);
	$("#attendanceTime").val(attendanceDate);
	deptId=deptIds;
	dormId=dorm;
}

//确认进行修改
function confirmUpdate(){
	var msg = {};
	msg.pk_id=$("#change_stats_del").val();
	msg.comeTime=$("#comeTime").val();
	msg.cardFilling=$("#applyReason").val();
	if(msg.comeTime==null || msg.comeTime==''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请填写归来时间！");
		return;
	}
	if(msg.cardFilling==null || msg.cardFilling==''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请填写原由！");
		return;
	}
	if(dormId==null || dormId=='' ||dormId=='null'){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请先为该学生分配寝室！");
		return;
	}
	msg.attendanceTime=$("#attendanceTime").val();
	msg.deptId=deptId;
    msg.appName="goToBed_updateGoToBed";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState === 200){
        	informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功！");
        	refresh();
        	$("#comeTime").val("");
        	$("#applyReason").val("");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("修改失败："+success.msg);
        }
    });
}

//刷新
function refresh(){
	areaTable.api().ajax.reload();
}

function getOneBySchoolId(){
	var msg = {};
    msg.appName="quartz_getOne";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState === 200){
        	if(success.data.conTime){
        		$("#timeSet").val(success.data.conTime);
        	}
        	schoolId=success.data.schoolId;
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("修改失败："+success.msg);
        }
    });
	
	
}


/*导出*/
function upload_rtlow(){
	// 2、接口请求参数组装
    var msg = {};
    msg.name=$("#stuName").val();
    msg.xgh=$("#keyWord").val();
    msg.status=$("#isStake").val();
    msg.beginTime=$("#beginTime").val();
    msg.endTime=$("#endTime").val();
    msg.dormId="";
   	msg.deptId= organizationCode;
    msg.appName="goToBed_listAllNotPage";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        success: function (success) {
            if(success.msgState == 200){
            	var rtlow_item = success.data;
            	if(rtlow_item != null || rtlow_item.length>0){
            		var rtlow_json = [];
            		for(var i=0;i<rtlow_item.length;i++){
            			if(rtlow_item[i].deptName == null){
            				rtlow_item[i].deptName = '-';
            			}
            			if(rtlow_item[i].goToBedStatue==1){
            				rtlow_item[i].goToBedStatue="正常";
            			}else if(rtlow_item[i].goToBedStatue==2){
            				rtlow_item[i].goToBedStatue="未知";
            			}else if(rtlow_item[i].goToBedStatue==3){
            				rtlow_item[i].goToBedStatue="晚归";
            			}else{
            				rtlow_item[i].goToBedStatue="未归";
            			}
            			if(rtlow_item[i].reason ==null){
            				rtlow_item[i].reason="";
            			}
            			if(rtlow_item[i].goToBedTime==null){
            				rtlow_item[i].goToBedTime="";
            			}
            			rtlow_json[i] = {
            				'姓名':rtlow_item[i].name,
            				'学号':rtlow_item[i].xgh,
            				'班级':rtlow_item[i].deptName,
            				'宿舍':rtlow_item[i].buildName,
            				'考勤日期':rtlow_item[i].attendanceTime,
            				'归寝状态':rtlow_item[i].goToBedStatue,
            				'归寝时间':rtlow_item[i].goToBedTime,
            				'原因':rtlow_item[i].reason
            			};
            		}
            		//downloadExl_onlyJson(rtlow_json);
            		downloadExl(rtlow_json,'tolay',true);
            	}else{
            		informationAlert_OnlyConfirmButton_NOT_REFRESH("暂无挂失信息!");
            	}
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

//查询楼栋
function getAllBuilding(){
	// 2、接口请求参数组装
    var msg = {};
    msg.appName="amang_findAMangZtree";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        success: function (success) {
           var apart = success.data;
	        var node = success.data;
	        var zTreeObj;
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
	            $.fn.zTree.init($("#scRegionOrDoR"), region_setting, node);
	        });
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
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
	var cityObj = $("#dormId");
	cityObj.val(v);
}
function region_showMenu() {
	var update_doridObj = $("#dormId");
	var update_doridOffset = $("#dormId").offset();
	$("#regino_menuContent").css({left:update_doridOffset.left + "px", top:update_doridOffset.top + update_doridObj.outerHeight() + "px"}).slideDown("fast");
	$("body").bind("mousedown", region_onBodyDown);
}
function region_hideMenu() {
	$("#regino_menuContent").fadeOut("fast");
	$("body").unbind("mousedown", region_onBodyDown);
}
function region_onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "dormId" || event.target.id == "regino_menuContent" || $(event.target).parents("#regino_menuContent").length>0)) {
		region_hideMenu();
	}
}