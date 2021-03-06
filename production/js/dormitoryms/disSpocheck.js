$(function(){
	disList();
	getDor_ztree();
	
})

function disList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
					var nodes = $.fn.zTree.getZTreeObj('treeDemo');
					if(nodes != null){
						var node = nodes.getCheckedNodes(true);
						if(node.length>0){
							var str =  node[0].id;
							var str_id = str.substring(0,str.indexOf("_"))
							var id = str.substring(str.indexOf("_")+1);
							if("cam" == str_id){
								data.a_subcampus = id;
							}else if("apart" == str_id){
								data.apart_id = id;
							}else if("amang" == str_id){
								data.manag_id = id;
							}else if("floor" == str_id){
								data.floor_id = id;
							}
						}
					}
					data.begin_time = $("#beginTime").val();
					data.end_time = $("#endTime").val();
                    /*查询参数*/
                    data.appName = "dsc_findDscCheckDis";
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
							return '<a href="#" title="点击查看详情" onclick="jump_down(\''+full.dor_id+'\',\''+full.type_id+'\')">'+full.perNum+'</a>';
						}
					}
                ]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

function jump_down(deptid,typeid){
	window.location.href = 'disSpocheckItem.html?dorid='+deptid+'&type_id='+typeid+'';
}

function uploaddishs(){
	var  msg = {};
	var nodes = $.fn.zTree.getZTreeObj('treeDemo');
	if(nodes != null){
		var node = nodes.getCheckedNodes(true);
		if(node.length>0){
			var str =  node[0].id;
			var str_id = str.substring(0,str.indexOf("_"))
			var id = str.substring(str.indexOf("_")+1);
			if("cam" == str_id){
				msg.a_subcampus = id;
			}else if("apart" == str_id){
				msg.apart_id = id;
			}else if("amang" == str_id){
				msg.manag_id = id;
			}else if("floor" == str_id){
				msg.floor_id = id;
			}
		}
	}
	msg.begin_time = $("#beginTime").val();
	msg.end_time = $("#endTime").val();
	msg.appName="dsc_findDscCheckDisUpload";//
	serverFromJSONData(msg,true).then(function (success) {
			if(success.msgState == 200){
				var item = success.data;
				var jsonDome = [];
				for (var i = 0; i < item.length; i++) {
					jsonDome[i] = {
						"寝室": item[i].dor_name,
						"考核类型": item[i].type_name,
						"违纪人数": item[i].perNum+"/人",
					};
				}
				downloadExl(jsonDome,"dishs",true);
			}else{
				informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
			}
	}),function (error) {
			console.log("访问服务器发生错误，请稍后再试!",error);
	};
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------

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

/*获取班级*/
function getDor_ztree(){
    var msg = {};
	msg.nocheck = false;
    msg.appName = "floor_floorZtree";
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
	var cityObj = $("#dorTree");
	cityObj.val(v2);
}

function showMenu() {
	var cityObj = $("#dorTree");
	var cityOffset = $("#dorTree").offset();
	$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
	$("body").bind("mousedown", onBodyDown);
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "dorTree" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
		hideMenu();
	}
}