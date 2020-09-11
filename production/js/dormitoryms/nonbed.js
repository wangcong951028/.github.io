var areaTable;

$(function(){
	nonList();
	getDor_ztree();
})

/*列表*/
function nonList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.subname = $("#keyWords").val();
                    data.notdate = $("#leaveSchTime").val();
                    /*查询参数*/
                    data.appName = "non_findNonBed";
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
                ]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

function cleanModal(){
	getDor_ztree();
	$("#dorid").val('');
	$("#bed_id").html('<option value="-1">---- 请选择 -----</option>');
	$("#nottolay").val('');
}

function saveNon(status){
	var bedid = $("#bed_id").val();
	var nottolay = $("#nottolay").val();
	if(bedid == -1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择学生!");
	}else{
		var msg = {};
		msg.bedid = bedid;
		msg.nottolay = nottolay;
		msg.appName="non_nonsService";//
	    serverFromJSONData(msg,true).then(function (success) {
	        if(success.msgState == 200){
//	            informationAlert_OnlyConfirmButton_NOT_REFRESH("调寝成功！");
				if(status == 1){
//					$("#myModal").modal("show");
				}else if(status == 2){
					$("#myModal").modal("hide");
				}
				cleanModal();
				areaTable.api().ajax.reload();
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
	        }
	    }),function (error) {
	        console.log("访问服务器发生错误，请稍后再试!",error);
	    };
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
	bed_list(treeNode.id)
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	zTree.checkNode(treeNode, !treeNode.checked, null, true);
	return false;
}

function onCheck(e, treeId, treeNode) {
		bed_list(treeNode.id)
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

/*获取床位信息*/
function bed_list(id){
	var msg = {};
	var dorid = id.substring(id.indexOf('_')+1);
	msg.dorid = dorid;
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
	        var html2 = '';
	        if(bed.length>0){
	        	dor_sex = bed[0].sex
	        	for(var i=0;i<bed.length;i++){
	        		var subname = "——";
	        		if(bed[i].s_name == null){
	        			subname = "——";
	        		}else{
	        			subname = bed[i].s_name;
	        		}
		        	html += '<option value="'+bed[i].id+'" id="bed_id_'+bed[i].id+'">'+bed[i].bedID+'/'+subname+'</option>';
		        }
	        }
	        $("#bed_id").html('<option value="-1">---- 请选择 -----</option>'+html);
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}
