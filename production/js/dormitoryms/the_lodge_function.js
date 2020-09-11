var dor_sex;//寝室性别
var sub_sex;//学生性别

$(function(){
	getDor_ztree();
})

function cleanModal(){
	getDor_ztree();
	$("#dorid").val('');
	$("#note_del").val('');
	$("#new_dorid").val('');
	document.getElementById('saveForm').reset();
	document.getElementById('update_form').reset();
}

/*单独入住：提示*/
var save_subid;
function stay_alone_prompt(stats){
	save_subid = new Array();
	$("input[type='checkbox']:checked").each(function () {
        if(this.value != 'null' && this.value != 'on'){
        	save_subid.push(this.value);
        	$("#sub_id").val(this.value);
        	$("#sub_name").val($("#name_"+this.value).html());
        	$("#sub_xgh").val($("#xgh_"+this.value).html());
        	$("#change_stats").val(stats);
        	var str_sex = $("#sex_"+this.value).html()
        	if("男" == str_sex){
        		sub_sex = 1;
        	}else if("女" == str_sex){
        		sub_sex = 2;
        	}
        }
    });
    if(save_subid.length>1 || save_subid.length == 0){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择一条数据！");
    }else{
    	$('#myModal').modal('show');
    }
}
/**单独入住：添加*/
function stay_alone(){
	var msg = {};
	var bed_id = $("#bed_id").val();//床位id
	var student_id = $("#sub_id").val();;//学生id
	var change_stats = $("#change_stats").val();//变更类型
	var subname = $("#sub_name").val();//学生姓名
	var subxgh = $("#sub_xgh").val();//学生学号
	var bedname = $("#bed_id_"+bed_id).html();//床位号
	var dorname = $("#dorid").val();//寝室编号
	var dor_id_nodes = $.fn.zTree.getZTreeObj('treeDemo');
	var dor_id_node = dor_id_nodes.getCheckedNodes(true);
	var dor_id;
	var roomid = $("#room_id").val();//房间标准id
	var roomname = $("#room_name").val();//房间标准名称
	if(dor_id_node.length != 0){
		dor_id = dor_id_node[0].id
	}
	if(dorname == ' '){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择入住寝室！");
	}else if(dor_id == undefined){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择入住寝室！");
	}else if(bed_id == -1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择入住床位！");
	}else{
		if(dor_sex != sub_sex || dor_sex == ''){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("性别不符合！");
			return;
		}
		msg.bed_id = bed_id;
		msg.student_id = student_id;
		msg.change_stats = change_stats;
		msg.subname = subname;
		msg.subxgh = subxgh;
		msg.bedname = bedname.substring(0,1);
		msg.dorname = dorname;
		msg.roomid = roomid;
		msg.roomname = roomname;
		msg.appName="acction_saveAcction";//
	    serverFromJSONData(msg,true).then(function (success) {
	        if(success.msgState == 200){
	            $('#myModal').modal('hide');
	            cleanModal();
	            areaTable.api().ajax.reload();
	            informationAlert_OnlyConfirmButton_NOT_REFRESH("入住成功！");
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
	        }
	    }),function (error) {
	        console.log("访问服务器发生错误，请稍后再试!",error);
	    };
    }
}

/*退宿：提示*/
var del_subid;
function sub_check_out(type){
	del_subid = new Array();
	$("input[type='checkbox']:checked").each(function () {
        if(this.value != 'null' && this.value != 'on'){
        	del_subid.push(this.value);
        	$("#change_stats_del").val(type);
        }
    });
    if(del_subid.length == 0){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择数据！");
    }else{
    	$('#myModal_del').modal('show');
    }
}
/*退宿：提示*/
function chech_out_prompt(){
	var note = $("#note_del").val();
	if(note == null || note == ''){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("退宿原因不能为空！");
	}else{
		informationAlert_confirmAndCancelButton("chech_out()","是否确实该学生退宿？");
	}
}
/*退宿*/
function chech_out(){
	var msg = {};
	var note = $("#note_del").val();
	var change_stats = $("#change_stats_del").val();
	var actionRequests = new Array();
	for(var i=0;i<del_subid.length;i++){
		var action = new Object();
		action.subid = del_subid[i];
		action.subname = $("#name_"+del_subid[i]).html();
		action.subxgh = $("#xgh_"+del_subid[i]).html();
		action.dorname = $("#dor_"+del_subid[i]).html();
		action.bedname = $("#bed_"+del_subid[i]).html();
		action.bedid = $("#bed_id_"+del_subid[i]).val();
		action.roomname = $("#room_"+del_subid[i]).html();
		action.change_stats = change_stats;
		action.note = note;
		actionRequests.push(action);
	}
	msg.actionRequests = actionRequests;
	msg.appName="acction_deleteAcction";//
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            $('#myModal_del').modal('hide');
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

/*单独调寝:提示*/
var update_subid;
function separate_bedtime_tips(status){
	var msg = {};
	update_subid = new Array();
	var subid;
	$("input[type='checkbox']:checked").each(function () {
        if(this.value != 'null' && this.value != 'on'){
        	subid = this.value;
        	update_subid.push(this.value);
        	var str_sex = $("#sex_"+this.value).html()
        	if("男" == str_sex){
        		sub_sex = 1;
        	}else if("女" == str_sex){
        		sub_sex = 2;
        	}
        	$("#update_change_stats").val(status);
        }
    });
    if(update_subid.length == 0 || update_subid.length > 1){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择一条数据！");
    }else{
    	msg.sub_id = subid;
    	msg.appName="acction_findAcctionBySubId";//
	    serverFromJSONData(msg,true).then(function (success) {
	        if(success.msgState == 200){
	        	var acction = success.data
	        	$("#update_sub_id").val(acction.pk_id);
	        	$("#update_sub_name").val(acction.name);
	        	$("#update_sub_xgh").val(acction.xgh);
	        	$("#update_dorid").val(acction.dormNum);
	        	$("#update_bed_id").val(acction.bedNum);
	        	$("#old_bed_id").val(acction.bed_id);
	        	$("#update_room_id").val(acction.roomid);
						$("#update_room_name").val(acction.roomname);
						if(acction.bed_id == null){
								informationAlert_OnlyConfirmButton_NOT_REFRESH('当前学生没有入住！');
						}else{
								$('#update_myModal').modal('show');
						}
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
	        }
	    }),function (error) {
	        console.log("访问服务器发生错误，请稍后再试!",error);
	    };
    }
}
/*单独调寝*/
function adjustable_bed_alone(){
	var msg = {}
	var update_sub_id = $("#update_sub_id").val();
	var update_sub_name = $("#update_sub_name").val();
	var update_sub_xgh = $("#update_sub_xgh").val();
	var old_bed_id = $("#old_bed_id").val();
	var new_dorid = $("#new_dorid").val();
	var new_bed_id = $("#new_bed_id").val();
	var new_bed_name = $("#new_bed_id_"+new_bed_id).html();
	var update_change_stats = $("#update_change_stats").val();
	var new_room_name = $("#new_room_name").val();
	var new_room_id = $("#new_room_id").val();
	if(new_dorid == null || new_dorid == ' '){
		informationAlert_OnlyConfirmButton_NOT_REFRESH('请选择寝室！');
	}else if(new_bed_id == -1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH('请选择床位！');
	}else{
		if(dor_sex != sub_sex || dor_sex == ''){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("性别不符合！");
			return;
		}
		msg.bed_id = new_bed_id;
		msg.bed_id2 = old_bed_id;
		msg.student_id = update_sub_id;
		
		msg.subname = update_sub_name;
		msg.subxgh = update_sub_xgh;
		msg.dorname = new_dorid;
		msg.bedname = new_bed_name.substring(0,1);
		msg.change_stats = update_change_stats;
		msg.roomname = new_room_name;
		msg.roomid = new_room_id;
		
		msg.before_rsrid = $("#new_room_id").val();
		msg.before_dorid = $("#before_dorid").val();
		msg.before_rsrprice = $("#before_rsrprice").val();
		
		msg.appName="acction_adjustableBedAlone";//
	    serverFromJSONData(msg,true).then(function (success) {
	        if(success.msgState == 200){
	           $('#update_myModal').modal('hide');
	           cleanModal();
	            areaTable.api().ajax.reload();
	            informationAlert_OnlyConfirmButton_NOT_REFRESH("调寝成功！");
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
	        }
	    }),function (error) {
	        console.log("访问服务器发生错误，请稍后再试!",error);
	    };
    }
}

/*一键分配*/
function distribution_prompt(status){
	informationAlert_confirmAndCancelButton('AKeyDistribution('+status+')','是否要为所有未分配床位的学生按照预分配床位方案分配床位？（该操作比较耗时，请耐心等待！）');
}
function AKeyDistribution(typ){
	var msg = {};
	msg.change_stats = typ;
	msg.appName="acction_AKeyDistribution";//
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("调寝成功！");
						areaTable.api().ajax.reload();
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}
//---------------------------------------------------------------------------------------------------------------------------

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
								var sub_name = "未入住";
								if(bed[i].s_name == null || bed[i].s_name == ''){
										sub_name = "未入住";
								}else{
										sub_name = bed[i].s_name;
								}
								var enanled = '有效'
								if(bed[i].enanled == 1){
										enanled = '有效'
								}else if(bed[i].enanled == 2){
										enanled = '无效'
								}
								html += '<option value="'+bed[i].id+'" id="bed_id_'+bed[i].id+'">'+bed[i].bedID+'/'+enanled+'/'+sub_name+'</option>';
								html2 += '<option value="'+bed[i].id+'" id="new_bed_id_'+bed[i].id+'">'+bed[i].bedID+'/'+enanled+'/'+sub_name+'</option>';
		        }
	        }
	        
	        $("#bed_id").html('<option value="-1">---- 请选择 -----</option>'+html);
	         $("#new_bed_id").html('<option value="-1">---- 请选择 -----</option>'+html2);
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
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
	        $(document).ready(function(){
	            $.fn.zTree.init($("#treeDemo"), setting, node);
	            $.fn.zTree.init($("#update_treeDemo"), update_setting, node);
	        });
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

function onClick(e, treeId, treeNode) {
	var id = treeNode.id;
	var str = id.substring(0,3)
	if('dor' == str){
			bed_list(treeNode.id);
	}
	// if(dor_sex == sub_sex && dor_sex != ''){
		findroom(treeNode.id);
		var zTree = $.fn.zTree.getZTreeObj("treeDemo");
		zTree.checkNode(treeNode, !treeNode.checked, null, true);
		// dor_sex = '';
		return false;
	// }
}

function onCheck(e, treeId, treeNode) {
	bed_list(treeNode.id);
	// if(dor_sex == sub_sex && dor_sex != ''){
		findroom(treeNode.id);
		var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
		nodes = zTree.getCheckedNodes(true),
		v = "";
		for (var i=0, l=nodes.length; i<l; i++) {
			v += nodes[i].name + ",";
		}
		if (v.length > 0 ) v = v.substring(0, v.length-1);
		var doridObj = $("#dorid");
		doridObj.val(v);
// 		dor_sex = '';
// 	}
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


function update_onClick(e, treeId, treeNode) {
	var id = treeNode.id;
	var str = id.substring(0,3)
	if('dor' == str){
		bed_list(treeNode.id);
	}
	findroom(treeNode.id);
	// if(dor_sex == sub_sex && dor_sex != ''){
		var zTree = $.fn.zTree.getZTreeObj("update_treeDemo");
		zTree.checkNode(treeNode, !treeNode.checked, null, true);
		// dor_sex = '';
		return false;
	// }
}

function update_onCheck(e, treeId, treeNode) {
	bed_list(treeNode.id);
	findroom(treeNode.id);
	// if(dor_sex == sub_sex && dor_sex != ''){
		var zTree = $.fn.zTree.getZTreeObj("update_treeDemo"),
		nodes = zTree.getCheckedNodes(true),
		v = "";
		for (var i=0, l=nodes.length; i<l; i++) {
			v += nodes[i].name + ",";
		}
		if (v.length > 0 ) v = v.substring(0, v.length-1);
		var doridObj = $("#new_dorid");
		doridObj.val(v);
// 		dor_sex = '';
// 	}
}

function update_showMenu() {
	var doridObj = $("#new_dorid");
	var doridOffset = $("#new_dorid").offset();
	$("#update_menuContent").css({left:doridOffset.left + "px", top:doridOffset.top + doridObj.outerHeight() + "px"}).slideDown("fast");
	$("body").bind("mousedown", update_onBodyDown);
}
function update_hideMenu() {
	$("#update_menuContent").fadeOut("fast");
	$("body").unbind("mousedown", update_onBodyDown);
}
function update_onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "new_dorid" || event.target.id == "update_menuContent" || $(event.target).parents("#update_menuContent").length>0)) {
		update_hideMenu();
	}
}

/*获取房间标准*/
function findroom(dorid){
		var msg = {};
		var dor_id = dorid.substring(dorid.indexOf('_')+1);
		msg.id = dor_id;
		msg.appName = "dor_findDorById";
		var jsonStr = common(msg);
		$.ajax({
				type: 'POST',
				url: serverBaseUrl,
				data: jsonStr,
				dataType: "json",
				async:false,
				success: function (success) {
					var room = success.data;
					if(room!= null){
							$("#room_id").val(room.dormStandard);
							$("#room_name").val(room.standardName);
							$("#new_room_id").val(room.dormStandard);
							$("#new_room_name").val(room.standardName);
							$("#before_dorid").val(room.id);
							$("#before_rsrprice").val(room.r_amount);
					}else{
							$("#room_id").val('');
							$("#room_name").val('');
							$("#new_room_id").val('');
							$("#new_room_name").val('');
					}
					
		},
				beforeSend: function(xhr) {
						xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
						xhr.setRequestHeader("token", static_token);
				}
		});
}
