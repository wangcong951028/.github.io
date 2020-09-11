$(function(){
	dorattList();
	getDor_ztree();
})

/*列表*/
function dorattList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
//                  data.areaid = $("#areaid").val();
					var nodes = $.fn.zTree.getZTreeObj('treeDemo');
					if(nodes != null){
						var node = nodes.getCheckedNodes(true);
						if(node.length != 0){
							var str = node[0].id;
							data.find_id = str.substring(str.indexOf('_')+1);
							console.debug(str.substring(str.indexOf('_')+1));
						}
					}
					data.beginTime = $("#beginTime").val();
					data.endTime = $("#endTime").val();
                    /*查询参数*/
                    data.appName = "doratt_findDorAtt";
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
                   /* "targets": -1,
                    render: function (data, type, full, meta) {
                        return '<div>' +
                            '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="updateModal(' + full.id + ')"><i class="fa fa-pencil">修改</i></button>' +
                            '<button class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.id + '"  onclick="deleteModal(' + full.id + ')"><i class="fa fa-trash-o">删除</i></button>' +
                            '</div>';
                    }*/
                }]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

/*导出Excel*/
function upload_doratt(){
	// 2、接口请求参数组装
    var msg = {};
//  msg.studentCode = $("#keyWord").val();
    msg.length = 999999;
    msg.start = 0;

    msg.appName="doratt_findDorAtt";

    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            var doratt = success.data.data;
            var jsonDome = []
            for (var i = 0; i < doratt.length; i++) {
                jsonDome[i] = {
                    "校区": doratt[i].cpName,
                    "违纪类型": doratt[i].type_name,
                    "违纪内容": doratt[i].content_name,
                    "学生人数": doratt[i].sub_number+'/人',
                    "违纪次数": doratt[i].dis_number+'/次',
                    "寝室数量": doratt[i].dor_number+'/间'
                };
            }
            downloadExl(jsonDome,'hf',true,);
            informationAlert_OnlyConfirmButton_NOT_REFRESH("导出成功！");
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

/*获取公寓楼树形结构*/
function getDor_ztree(){
    var msg = {};
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
	v = "";
	for (var i=0, l=nodes.length; i<l; i++) {
		v += nodes[i].name + ",";
	}
	if (v.length > 0 ) v = v.substring(0, v.length-1);
	var doridObj = $("#dorid");
	doridObj.val(v);
}

function showMenu() {
	var doridObj = $("#dorid");
	var doridOffset = $("#dorid").offset();
	$("#menuContent").css({left:doridOffset.left + "px", top:doridOffset.top + doridObj.outerHeight() + "px"}).slideDown("fast");
	$("body").bind("mousedown", onBodyDown);
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "dorid" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
		hideMenu();
	}
}