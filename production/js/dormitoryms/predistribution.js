var areaTable;
var listDorm;
var proejctInfo;
var classInfo;
var organizationCode;
var classList;
var projectList;
var deptId;
$(function () {
    init();
    getFloor_ztree();
    findSchoolYear();
    $("#myButton").click(function () {
    	var zTree= $.fn.zTree.getZTreeObj("treeDemo")
		var id= zTree.getCheckedNodes(true);
		if(id.length!=0){
			deptId=id[0].id;
		}
        init();
    });
    
    //导出excel按钮
    $("#export").click(function () {
        $("#table").table2excel({
            // 不被导出的表格行的CSS class类
            exclude: ".noExl",
            // 导出的Excel文档的名称，（没看到作用）
            name: "Excel Document Name",
            // Excel文件的名称
            filename: $("#searchTime").val()+"考核日统计"
        });
    });

    //打印按钮
    $("#print").click(function () {
        $("#table").print();
    });
    
    
    
});


/**
 * 初始化列表
 */
function init() {
	
	var msg = {};
	msg.deptid=deptId;
	msg.createTimeId=$("#comeDate").val();
    msg.appName="predistribution_findForReport";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState === 200){
        	var html = '<thead style="text-align:center;" class="coltitle"><td >统计级别</td>'
                            + '<td>总床位数</td>'
                            + '<td  >男生床位数</td>'
                            + '<td  >女生床位数</td>'
                            +'<td  >剩余床位数</td>'
                            +'<td  >剩余男生床位数</td>'
                            +'<td  >剩余女生床位数</td>'
                            +'<td  >入住床位数</td>'
                            + '<td  >总入住比例</td>';
        	
        	var element = success.data;
	        	html+="<tbody style='text-align:center;'><td>"+element.dept_name+"</td><td>"+element.totalBed+"</td><td>"+element.totalBoyBed+"</td><td>"+element.totalGirlBed+"</td><td>"+element.surplusBed+"</td><td>"+element.surplusBedBoy+"</td><td>"+element.surplusBedGirl+"</td><td>"+element.totalIsUsing+"</td><td>"+element.isUsingRatio*100+"%</td></tbody>";
        		
        	$("#table").html(html);
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加或修改失败："+success.msg);
        }
    });
	
}

function oncheckProjectCalbask(treeNode) {
        proejctInfo = new Array();
        for(var i = 0;i<treeNode.length;i++){
            proejctInfo.push(treeNode[i].id);
        }
    }
    function oncheckDeptCalbask(treeNode) {
        classInfo = new Array();
        for(var i = 0;i<treeNode.length;i++){
            classInfo.push(treeNode[i].id);
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


/*获取班级树形结构*/
function getFloor_ztree(){
    var msg = {};
    msg.deptTypeID = 0;
    msg.appName = "respondents_findDeptNode";
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
	        
	        $(document).ready(function(){
	            $.fn.zTree.init($("#treeDemo"), setting, node);
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
	var cityObj = $("#classTree");
	cityObj.val(v2);
}

function showMenu() {
	var cityObj = $("#classTree");
	var cityOffset = $("#classTree").offset();
	$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
	$("body").bind("mousedown", onBodyDown);
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "classTree" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
		hideMenu();
	}
}

//学年查询
function findSchoolYear(){
    var msg = {};
    msg.appName="term_findTerm";
    var html="<option selected='selected' value=''>----- 请选择 -----</option>"
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var node=success.data.data;
        	$.each(node,function(index,element){
        		html+="<option value='"+element.pk_ID+"'>"+element.t_term+"</option>"
        	})
        	$("#comeDate").html(html);
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}