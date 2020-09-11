var areaTable;
var organizationCode;
var cycleIds;
var setting = {
	check: {enable: true,chkStyle: "checkbox",chkboxType: { "Y": "", "N": "" }},
    view:{showLine: true,dblClickExpand: true},
    data: {simpleData: {enable: true}},
    callback: {onCheack:onRightClick,onClick: zLeftTreeOnClick},
    nocheack: true
};

$(function () {
    init();
    initDormTree();
    getAllCampuse();
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
                	data.deptId=$("#campuseSelect").val();
                    //添加额外的参数传给服务器
                    data.appName="timeSet_listTime";
                    
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
                    	var cycleIdBefore="";
						for(var i=0;i<full.cicleTime.length;i++){
							if(i==0){
								cycleIdBefore+=full.cicleTime[i].cicleId;
							}else{
								cycleIdBefore+=","+full.cicleTime[i].cicleId;
							}
						}
                    	
                        return '<div>' +
                            '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="updateTimeSet(' + full.pk_id + ')"><i class="fa fa-pencil">修改</i></button>' +
                            '<button class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="deleteModal(' + full.pk_id+',\''+cycleIdBefore+'\')"><i class="fa fa-trash-o">删除</i></button>' +
                            '</div>';
                    }
               },{
                    "targets": 7,
                    render: function (data, type, full, meta) {
                    	var cicleList=full.cicleTime;
                    	var html='';
                    	for(var i=0;i<cicleList.length;i++){
                    		html+='<span class="departListName" style="color:white;">'+cicleList[i].cicleName+'</span>';
                    	}
                        return html;
                    }
                },{
                    "targets": 6,
                    render: function (data, type, full, meta) {
                    	var dept=full.dept;
                    	var html='';
                    	for(var i=0;i<dept.length;i++){
                    		html+='<span class="departListName" style="color:white;">'+dept[i].deptName+'</span>';
                    	}
                        return html;
                    }
                }]
    });
}

function addTimeSet(){
	$("#myModal").modal("show");
}

//获取考勤类型
function getTimeSetType(){
	var msg = {};
    msg.appName="timeSet_listTimeSetType";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
			var html ='<option value="-1">----请选择----</option>';
			for (var i=0;i<success.data.length;i++) {
				html+='<option value="'+success.data[i].id+'">'+success.data[i].typeName+'</option>';
			}
			$("#addTimeSetType").html(html);
			$("#updateTimeSetType").html(html);
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("获取考勤类型失败，原因："+success.msg);
        }

    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

//寝室树形结构处理
function initDormTree(){
	var msg = {};
//  msg.isdepartClassFlag = 1;
    msg.isGetGrade=1;
    msg.appName="origaniza_listOriganizaTree";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState === 200){
        	var node = success.data;
        	zNodes = node;
        	var maxLenth=0;
        	//进行遍历
        	for(var i=0;i<zNodes.length;i++){
        		var mi=zNodes[i];
        		for(var j=0;j<zNodes.length;j++){
        			var mj=zNodes[j];
        			if(mi.id.length>mj.id.length){
        				maxLenth=mi.id.length;
        			}
        		}
        	}
        	
        	for(var i=0;i<zNodes.length;i++){
        		var mi=zNodes[i];
        		if(maxLenth==mi.id.length){
        			zNodes[i].nocheck=false;
        		}else{
        			zNodes[i].nocheck=true;
        		}
        	}
        	$.fn.zTree.init($("#tree"), setting, zNodes);
        	$.fn.zTree.init($("#treeUpdate"), setting, zNodes);
            zTree = $.fn.zTree.getZTreeObj("tree");
            zTree = $.fn.zTree.getZTreeObj("treeUpdate");
            rMenu = $("#rMenu");
            if (node != null){
                $("#dataLoadIng").css("display","none");
                $("#dataLoadIngUpdate").css("display","none");
            }
            getTimeSetType();
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("查询年级发生错误！");
        }
    });
}

function zLeftTreeOnClick(event, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("tree");
    zTree.checkNode(treeNode, !treeNode.checked, null, true);
	return false;
}

function onRightClick(event, treeId, treeNode) {
	if(treeNode != null){
		getAllBed(treeNode.id);
	}
	var zTree = $.fn.zTree.getZTreeObj("tree"),
	nodes = zTree.getCheckedNodes(true),
	v2 = "";
	for (var i=0, l=nodes.length; i<l; i++) {
		v2 += nodes[i].name + ",";
	}
	if (v2.length > 0 ) v2 = v2.substring(0, v2.length-1);
	var cityObj = $("#roomSelect");
	cityObj.val(v2);
}

//进行添加确认操作
function saveTimeSet(flag){
	var msg = {};
	msg.typeId=$("#addTimeSetType").val();
	msg.beginTime=$("#addBeginTime").val();
	msg.endTime=$("#addEndTime").val();
	msg.notComeTime=$("#addNotCome").val();
	
	
	obj = document.getElementsByName("addCycleTime");
    var cycleList =new Array();
    for(k in obj){
        if(obj[k].checked)
            cycleList.push(obj[k].value);
    }
	
	msg.cycleId=cycleList;
	if(msg.typeId==null || msg.typeId==-1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请设定类型！");
    	return;
	}
	if(msg.beginTime==null || msg.beginTime==""){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请设定开始时间！");
    	return;
	}
	if(msg.endTime==null || msg.endTime==""){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请设定结束时间！");
    	return;
	}
	if(msg.notComeTime==null || msg.notComeTime==""){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请设定未归时间！");
    	return;
	}
	if(msg.cycleId.length==0){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请设定考勤周期！");
    	return;
	}
	
	var mdd =$.fn.zTree.getZTreeObj("tree");
	var node = $.fn.zTree.getZTreeObj("tree").getCheckedNodes(true);
    
    var campuse=new Array();
    if(node.length>0){
    	for(var j=0;j<node.length;j++){
    		campuse.push(node[j].id);
    	}
    }else{
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择年级！");
    	return;
    }
    
    
	msg.campusId=campuse;
	msg.appName="timeSet_saveTime";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState === 200){
        	refresh();
        	informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功！");
        	if(flag==2){
        		window.location.reload();
        	}
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加失败,"+success.msg);
        }
    });
}


function cleanModal(){
	$("#myModal").modal("hide");
}

function deleteModal(id,cicleList){
	informationAlert_confirmAndCancelButton("deleteConfirTimeSet("+id+",\""+cicleList+"\")","是否确认删除该记录？！");
}

//进行删除操作
function deleteConfirTimeSet(id,cicleList){
	var msg = {};
	msg.cycleIdBefore=cicleList;
	msg.pk_id=id;
	msg.appName="timeSet_deleteTime";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState === 200){
        	refresh();
        	informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功！");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除失败！");
        }
    });
}

//进行表格刷新操作
function refresh(){
	areaTable.api().ajax.reload();
}


//进行数据回显
function updateTimeSet(id){
	var msg = {};
	msg.pk_id=id;
	msg.appName="timeSet_getOneTime";
    serverFromJSONData(msg, true).then(function(success) {
  			if(success.msgState === 200) {
  				$("#updateTimeSetType").val(success.data.typeId);
  				$("#updateBeginTime").val(success.data.beginTime);
  				$("#updateEndTime").val(success.data.endTime);
  				$("#updateNotCome").val(success.data.notComeTime);
				$("#updateId").val(success.data.pk_id);
				
				cycleIds=new Array();
  				//获取所有的复选框值
  				var boxObj = $("input:checkbox[name='updateCycleTime']");
  				boxObj.each(function() {
  						$(this).attr("checked", false);
  					});
  				for(var i = 0; i < success.data.cicleTime.length; i++) {
  					boxObj.each(function() {
  						if($(this).val() == success.data.cicleTime[i].cicleId) {
  							$(this).prop('checked',true);
  						}
  					});
  					cycleIds.push(success.data.cicleTime[i].cicleId);
  				}
  				
  				//进行树形结构回显
  				var treeObj = $.fn.zTree.getZTreeObj("treeUpdate");
  				var inputtree = '';
  				var d="";
  				for(var i=0;i<success.data.dept.length;i++){
	  				treeObj.checkNode(treeObj.getNodesByParam("id", success.data.dept[i].deptId,null)[0],true, true);
					inputtree += treeObj.getNodesByParam("id", success.data.dept[i].deptId,null)[0].name+",";
					d = inputtree.substring(0,inputtree.length-1);
					$("#treeUpdate").val(d);
  				}
  				var zTree = treeObj.getCheckedNodes(false);
  				for (var i = 0; i < zTree.length; i++) {
  					treeObj.expandNode(zTree[i], true); //展开选中的
  				}
  				
  				$(".chek_boxs").show();
  				$("#myModalUpdate").modal("show");
  			} else {
  				informationAlert_OnlyConfirmButton_NOT_REFRESH("删除失败！");
  			}
    });
}

//进行更新确认操作
function updateWeekendStay(){
	var msg = {};
	msg.typeId=$("#updateTimeSetType").val();
	msg.beginTime=$("#updateBeginTime").val();
	msg.endTime=$("#updateEndTime").val();
	msg.notComeTime=$("#updateNotCome").val();
	msg.pk_id=$("#updateId").val();
	msg.cycleIdBefore="";
	for(var i=0;i<cycleIds.length;i++){
		if(i==0){
			msg.cycleIdBefore+=cycleIds[i];
		}else{
			msg.cycleIdBefore+=","+cycleIds[i];
		}
	}
	
	obj = document.getElementsByName("updateCycleTime");
    var cycleList =new Array();
    for(k in obj){
        if(obj[k].checked)
            cycleList.push(obj[k].value);
    }
	
	msg.cycleId=cycleList;
	if(msg.typeId==null || msg.typeId==-1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请设定类型！");
    	return;
	}
	if(msg.beginTime==null || msg.beginTime==""){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请设定开始时间！");
    	return;
	}
	if(msg.endTime==null || msg.endTime==""){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请设定结束时间！");
    	return;
	}
	if(msg.notComeTime==null || msg.notComeTime==""){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请设定未归时间！");
    	return;
	}
	if(msg.cycleId.length==0){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请设定考勤周期年级！");
    	return;
	}
	
	var mdd =$.fn.zTree.getZTreeObj("treeUpdate");
	var node = $.fn.zTree.getZTreeObj("treeUpdate").getCheckedNodes(true);
    
    var campuse=new Array();
    if(node.length>0){
    	for(var j=0;j<node.length;j++){
    		campuse.push(node[j].id);
    	}
    }else{
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择年级！");
    	return;
    }
    
    msg.campusId=campuse;
	msg.appName="timeSet_updateTime";
    serverFromJSONData(msg, true).then(function(success) {
  			if(success.msgState === 200) {
  				refresh();
  				informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功！");
  			} else {
  				informationAlert_OnlyConfirmButton_NOT_REFRESH("修改失败:"+success.msg);
  			}
    });
}

//获取所有校区
function getAllCampuse(){
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
	        var apart = success.data;
	        var html = '';
	        for(var i=0;i<apart.length;i++){
	        	html += '<option value="'+apart[i].deptid+'">'+apart[i].cmName+'</option>';
	        }
	        $("#campuseSelect").html('<option value="-1">----- 请选择 -----</option>'+html);
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
	
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