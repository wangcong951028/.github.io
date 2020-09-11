var id, dormitoryNum
$(function () {
    List();
    getCampus();
    getApart(); //获取公寓区域
    getAMang(); //获取公寓楼栋
    getFloor(); //获取楼层
    getAMangZtree();
})

/*列表*/
function List() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.keyword = $("#keyWord").val(); //姓名或身份证
                    data.startTime = $("#beginTime").val(); //开始时间
                    data.endtTime = $("#endTime").val(); //结束时间
                    data.visitorType = $("#visitorType").val(); //访客类型
                    data.houseBuilding = $("#amang_id").val(); //公寓楼栋
                    data.houseArea = $("#apart_id").val(); //公寓区域
                    data.schoolArea = $("#campus_id").val(); //校区
                    /*查询参数*/
                    data.appName = "visitors_findVisitors";
                    var paramJsonMsg = JSON.stringify(data);

                    //配置基本参数
                    data.param = paramJsonMsg;
                    data.appKey = "aGFuZHlDYW1wdXM=";
                    data.appSecret = "1234567890abcedefgh";
                    var time = new Date().getTime();
                    data.time = time;
                    var temp = 'appKey=aGFuZHlDYW1wdXM=&appSecret=1234567890abcedefgh&param=' +
                        paramJsonMsg + '&time=' + time;
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
                /* targets": -1,
                    render: function (data, type, full, meta) {
                        if (full.inTime != null&&full.outTime==null) {
                            return '<div >' +
                                '<button style="background:red" class="btn btn-success btn-xs" href="javascript:;"  data-key="' +
                                full.id + '"  onclick="outStay(' + full.id +
                                ')"><i class="fa fa-pencil" >退宿</i></button>' +
                                '</div>';
                        } else {
                            return '<div>' +
                                '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' +
                                full.id + '"  onclick="inStay(' + full.id + ',' + full.roomVaild +
                                ',' + full.bedVaild + ',\'' + full.dormitoryNum +
                                '\')"><i class="fa fa-pencil">入住</i></button>' +
                                '</div>';
                        }

                    } 
                },*/
                {
                    "targets": 1,
                    "orderable": false,
                    "className": 'select-checkbox',
                    render: function (data, type, full, meta) {
                        return '<input type="checkbox" name="table_records" class="flat" id="checkbox-all-' +
                            full.id + '" value="' + full.id + '" />' +
                            '<input type="type" hidden="hidden" name="table_records" class="flat" id="bed_id_' +
                            full.id + '" value="' + full.id + '" />';
                    }
                },
                {
                    targets: 3,
                    render: function (data, type, full, meta) {
                        if (full.visitorType == 1) {
                            return '教师';
                        }
                        if (full.visitorType == 2) {
                            return '学生';
                        }
                        if (full.visitorType == 3) {
                            return '其他人员';
                        }
                    }
                },
                /* {
                    targets: 10,
                    render: function (data, type, full, meta) {
                        return '<div onclick="lookDetail(' + full.inReason + ')">查看</div>';
                    }
                }, */

            ]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

function lookDetail(obj) {
    informationAlert_OnlyConfirmButton_NOT_REFRESH(obj);
}

function cleanModal() {
    document.getElementById('saveForm').reset();
}


/*入住*/
function addVisitor() {
	emptyData();
    $("#myModal").modal("show");
}
/**
 * 清楚数据
 */
function emptyData(){
	document.getElementById("saveForm").reset();
	document.getElementById("usaveForm").reset();
	getAMangZtree();

}

/**
 * 保存数据
 */
function saveVisitors() {
    var amang = $("#amang").val();
    var amang_id = $("#a_amang_id").val();
    var visitorType = $("#a_visitorType").find("option:selected").val();
    var userName = $("#userName").val();
    var teaNo = $("#teaNo").val();
    var stuNo = $("#stuNo").val();
    var phone = $("#phone").val();
    var idCard = $("#idCard").val();
    var inReason = $("#inReason").val();
    if (amang_id == '' || amang_id == null) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("公寓楼不能为空！");
        return;
    }
    if (visitorType == '' || visitorType == null) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访客类型不能为空！");
        return;
    }
    if (userName == '' || userName == null) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("姓名不能为空！");
        return;
    }
    if (visitorType != '') {
        if (visitorType == 1) {
            if (teaNo == '' || teaNo == null) {
                informationAlert_OnlyConfirmButton_NOT_REFRESH("教工号不能为空!");
                return;
            }
        } else if (visitorType == 2) {
            if (stuNo == '' || stuNo == null) {
                informationAlert_OnlyConfirmButton_NOT_REFRESH("学号不能为空!");
                return;
            }
        } else {
            if (phone == '' || phone == null) {
                informationAlert_OnlyConfirmButton_NOT_REFRESH("手机号码不能为空!");
                return;
            }
            if (!(/^1[34578]\d{9}$/.test(phone))) {
                informationAlert_OnlyConfirmButton_NOT_REFRESH("手机号码栏格式不正确，请重新输入!");
                return;
            }

            if (idCard == '' || idCard == null) {
                informationAlert_OnlyConfirmButton_NOT_REFRESH("身份证不能为空！");
                return;
            }
            if (!isCardNo(idCard)) {
                informationAlert_OnlyConfirmButton_NOT_REFRESH("身份证格式不正确！");
                return;
            }
        }
    }
    if (inReason == '' || inReason == null) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问原因不能为空!");
        return;
    }

    var check_flag = false;
    //检查用户是否存在
    if (visitorType == 1) {
       check_flag = checkUser(userName, teaNo, visitorType)
    } else if (visitorType == 2) {
       check_flag = checkUser(userName, stuNo, visitorType)
    }
	if(check_flag){
		 //保存数据
		var msg = {};
		msg.appName = "visitors_saveVisitors";
		msg.buildingNo = amang_id.substring(6, amang_id.length);
		msg.buildingName = amang;
		msg.visitorType = visitorType;
		msg.visitor = userName;
		msg.phone = phone;
		msg.teaNo = teaNo;
		msg.stuNo = stuNo;
		msg.idCard = idCard;
		msg.inReason = inReason;
	
		var jsonStr = common(msg);
		$.ajax({
			type: 'POST',
			url: serverBaseUrl,
			data: jsonStr,
			dataType: "json",
			async: true,
			success: function (success) {
				if (success.msgState == 200) {
					informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功！");
					areaTable.api().ajax.reload();
					$("#myModal").modal("hide");
				} else {
					informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
					return;
				}
			},
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
				xhr.setRequestHeader("token", static_token);
			}
		});
	}

}
/**
 * 检查用户是否存在
 */
function checkUser(username, num, visitorType) {
	var checkStatus = false;
    var msg = {};
    msg.appName = "visitors_checkVisitors";
    msg.username = username;
    msg.num = num;
    msg.visitorType = visitorType;
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.msg == "SUCCESS") {
                checkStatus = true;
            } else {
                informationAlert_OnlyConfirmButton_NOT_REFRESH(data.msg+"请检查姓名和学工号！");
               checkStatus = false;
            }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
	return checkStatus;
}
/**
 * 修改
 */
var update_subid;

function updateVisitors() {
    update_subid = new Array();
    $("input[type='checkbox']:checked").each(function () {
        if (this.value != 'null' && this.value != 'on') {
            update_subid.push(this.value);
        }
    });
    if (update_subid.length == 0) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择数据！");
    } else if (update_subid.length > 1) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("只能选中一项记录！");
    } else {
        var msg = {};
        msg.id = update_subid[0];
        msg.appName = "visitors_findVisitorsById"; //
        serverFromJSONData(msg, true).then(function (success) {
                var visitor = success.data;
                console.log(visitor)
                $("#pk_id").val(visitor.id);
                $("#u_amang_id").val("amang_"+visitor.amang_id); 
                $("#uuserName").val(visitor.visitor);
                $("#uteaNo").val(visitor.teaNo);
                $("#ustuNo").val(visitor.stuNo);
                $("#uphone").val(visitor.phone);
                $("#uidCard").val(visitor.idCard);
                $("#uinReason").val(visitor.inReason);
                $("#u_visitorType").find("option").each(function () {
                    if (this.value == visitor.visitorType) {
                        this.selected = 'selected';
                    }
                })

                if (visitor.visitorType == 1) {
                    $("#uteaNoDiv").css("display", "block");
                    $("#ustuNoDiv").css("display", "none");
                    $("#uotherDiv").css("display", "none");
                }
                if (visitor.visitorType == 2) {
                    $("#uteaNoDiv").css("display", "none");
                    $("#ustuNoDiv").css("display", "block");
                    $("#uotherDiv").css("display", "none");
                }
                if (visitor.visitorType == 3) {
                    $("#uteaNoDiv").css("display", "none");
                    $("#ustuNoDiv").css("display", "none");
                    $("#uotherDiv").css("display", "block");
                }
                var nodes = $.fn.zTree.getZTreeObj('update_treeDemo');
                var node = nodes.getNodeByParam('id', "amang_" + visitor.amang_id);
                if (node != null) {
                    nodes.checkNode(node, true, true);
                    $("#uamang").val(node.name);
                }
                $("#updateModal").modal("show");
            }),
            function (error) {
                console.log("访问服务器发生错误，请稍后再试!", error);
            };
    }
}

function updateVisitors_() {
    var id = $("#pk_id").val();
    var amang = $("#uamang").val();
    var amang_id = $("#u_amang_id").val();
    var visitorType = $("#u_visitorType").find("option:selected").val();
    var userName = $("#uuserName").val();
    var teaNo = $("#uteaNo").val();
    var stuNo = $("#ustuNo").val();
    var phone = $("#uphone").val();
    var idCard = $("#uidCard").val();
    var inReason = $("#uinReason").val();
    if (amang_id == '' || amang_id == null) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("公寓楼不能为空！");
        return;
    }
    if (visitorType == '' || visitorType == null) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访客类型不能为空！");
        return;
    }
    if (userName == '' || userName == null) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("姓名不能为空！");
        return;
    }
    if (visitorType != '') {
        if (visitorType == 1) {
            if (teaNo == '' || teaNo == null) {
                informationAlert_OnlyConfirmButton_NOT_REFRESH("教工号不能为空!");
                return;
            }
        } else if (visitorType == 2) {
            if (stuNo == '' || stuNo == null) {
                informationAlert_OnlyConfirmButton_NOT_REFRESH("学号不能为空!");
                return;
            }
        } else {
            if (phone == '' || phone == null) {
                informationAlert_OnlyConfirmButton_NOT_REFRESH("手机号码不能为空!");
                return;
            }
            if (!(/^1[34578]\d{9}$/.test(phone))) {
                informationAlert_OnlyConfirmButton_NOT_REFRESH("手机号码栏格式不正确，请重新输入!");
                return;
            }

            if (idCard == '' || idCard == null) {
                informationAlert_OnlyConfirmButton_NOT_REFRESH("身份证不能为空！");
                return;
            }
            if (!isCardNo(idCard)) {
                informationAlert_OnlyConfirmButton_NOT_REFRESH("身份证格式不正确！");
                return;
            }
        }
    }
    if (inReason == '' || inReason == null) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问原因不能为空!");
        return;
    }

    var check_flag;
    //检查用户是否存在
    if (visitorType == 1) {
        check_flag = checkUser(userName, teaNo, visitorType)
    } else if (visitorType == 2) {
        check_flag = checkUser(userName, stuNo, visitorType)
    }
	
	if(check_flag){
		 //保存数据
		var msg = {};
		msg.appName = "visitors_updateVisitors";
		msg.buildingNo = amang_id.substring(6, amang_id.length);
		msg.buildingName = amang;
		msg.visitorType = visitorType;
		msg.visitor = userName;
		msg.phone = phone;
		msg.teaNo = teaNo;
		msg.stuNo = stuNo;
		msg.idCard = idCard;
		msg.inReason = inReason;
		msg.id = id;
	
		var jsonStr = common(msg);
		$.ajax({
			type: 'POST',
			url: serverBaseUrl,
			data: jsonStr,
			dataType: "json",
			async: true,
			success: function (success) {
				if (success.msgState == 200) {
					informationAlert_OnlyConfirmButton_NOT_REFRESH("更新成功！");
					areaTable.api().ajax.reload();
					$("#updateModal").modal("hide");
				} else {
					informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
					return;
				}
			},
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
				xhr.setRequestHeader("token", static_token);
			}
		});
	}
   
}

/**
 * 删除
 */
var del_subid;

function deleteVisitors() {
    del_subid = new Array();
    $("input[type='checkbox']:checked").each(function () {
        if (this.value != 'null' && this.value != 'on') {
            del_subid.push(this.value);
        }
    });
    if (del_subid.length == 0) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择数据！");
    } else {
        $.confirm({
            title: '系统消息',
            content: "<span style='color:red'>是否确认删除选中记录？</span>",
            typeAnimated: true,
            buttons: {
                tryAgain: {
                    text: '确定',
                    btnClass: 'btn-green',
                    action: function () {
                        deleteVisitors_(del_subid);
                    }
                },
                "取消": function () {}
            }
        });
    }
}

/**
 * 确认删除数据
 */
function deleteVisitors_(del_subid) {
    var msg = {};
    msg.appName = "visitors_deleteVisitors";
    msg.ids = del_subid;
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async: true,
        success: function (success) {
            if (success.msgState == 200) {
                informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功！");
                areaTable.api().ajax.reload();
            } else {
                informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
                return;
            }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}
/**
 * 离开
 */
var leave_subid;

function leaveVisitors() {
    leave_subid = new Array();
    $("input[type='checkbox']:checked").each(function () {
        if (this.value != 'null' && this.value != 'on') {
            leave_subid.push(this.value);
        }
    });
    if (leave_subid.length == 0) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择数据！");
    } else {
        $.confirm({
            title: '系统消息',
            content: "<span style='color:red'>选中访客是否确认离开？</span>",
            typeAnimated: true,
            buttons: {
                tryAgain: {
                    text: '确定',
                    btnClass: 'btn-green',
                    action: function () {
                        leaveVisitors_(leave_subid);
                    }
                },
                "取消": function () {}
            }
        });
    }
}
/**
 * 确认离开
 */
function leaveVisitors_(leave_subid) {
    var msg = {};
    msg.appName = "visitors_leaveVisitors";
    msg.ids = leave_subid;
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async: true,
        success: function (success) {
            if (success.msgState == 200) {
                informationAlert_OnlyConfirmButton_NOT_REFRESH("操作成功！");
                areaTable.api().ajax.reload();
            } else {
                informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
                return;
            }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*获取公寓树形结构*/
function getAMangZtree() {
    var msg = {};
    msg.appName = "amang_findAMangZtree";
	msg.nocheck = false;
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async: false,
        success: function (success) {
            var amangnodes = success.data;
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
            $(document).ready(function () {
                $.fn.zTree.init($("#treeDemo"), setting, amangnodes);
                $.fn.zTree.init($("#update_treeDemo"), update_setting, amangnodes);
            });

        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
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
    var id = "";
    for (var i = 0, l = nodes.length; i < l; i++) {
        v += nodes[i].name + ",";
        id += nodes[i].id + ",";
    }
    if (v.length > 0) v = v.substring(0, v.length - 1);
    if (id.length > 0) id = id.substring(0, id.length - 1);

    var amangObj = $("#amang");
    amangObj.val(v);
    $("#a_amang_id").val(id);
}

function showMenu() {
    var amangObj = $("#amang");
    var amangOffset = $("#amang").offset();
    $("#menuContent").css({
        left: amangOffset.left + "px",
        top: amangOffset.top + amangObj.outerHeight() + "px"
    }).slideDown("fast");
    $("body").bind("mousedown", onBodyDown);
}

function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}

function onBodyDown(event) {
    if (!(event.target.id == "menuBtn" || event.target.id == "amang" || event.target.id == "menuContent" || $(event.target)
            .parents("#menuContent").length > 0)) {
        hideMenu();
    }
}

function update_onClick(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("update_treeDemo");
    zTree.checkNode(treeNode, !treeNode.checked, null, true);
    return false;
}

function update_onCheck(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("update_treeDemo"),
        nodes = zTree.getCheckedNodes(true),
        v = "";
	var id = "";
    for (var i = 0, l = nodes.length; i < l; i++) {
        v += nodes[i].name + ",";
		id += nodes[i].id+",";
    }
    if (v.length > 0) v = v.substring(0, v.length - 1);
    var amangObj = $("#uamang");
    amangObj.val(v);
	$("#u_amang_id").val(id);
}

function update_showMenu() {
    var update_amangdObj = $("#uamang");
    var update_amangdOffset = $("#uamang").offset();
    $("#update_menuContent").css({
        left: update_amangdOffset.left + "px",
        top: update_amangdOffset.top + update_amangdObj.outerHeight() + "px"
    }).slideDown("fast");
    $("body").bind("mousedown", update_onBodyDown);
}

function update_hideMenu() {
    $("#update_menuContent").fadeOut("fast");
    $("body").unbind("mousedown", update_onBodyDown);
}

function update_onBodyDown(event) {
    if (!(event.target.id == "menuBtn" || event.target.id == "uamang" || event.target.id == "update_menuContent" ||
            $(event.target).parents("#update_menuContent").length > 0)) {
        update_hideMenu();
    }
}
/**
 * 改变访问类型
 */
function cgvisitorsType(v) {
    if (v.value == 1) {
        $("#teaNoDiv").css("display", "block");
        $("#stuNoDiv").css("display", "none");
        $("#otherDiv").css("display", "none");
        $("#uteaNoDiv").css("display", "block");
        $("#ustuNoDiv").css("display", "none");
        $("#uotherDiv").css("display", "none");
    }
    if (v.value == 2) {
        $("#teaNoDiv").css("display", "none");
        $("#stuNoDiv").css("display", "block");
        $("#otherDiv").css("display", "none");
        $("#uteaNoDiv").css("display", "none");
        $("#ustuNoDiv").css("display", "block");
        $("#uotherDiv").css("display", "none");
    }
    if (v.value == 3) {
        $("#teaNoDiv").css("display", "none");
        $("#stuNoDiv").css("display", "none");
        $("#otherDiv").css("display", "block");
        $("#uteaNoDiv").css("display", "none");
        $("#ustuNoDiv").css("display", "none");
        $("#uotherDiv").css("display", "block");
    }
}


//公共参数
function common(msg) {
    var param = {};
    // 1、公共参数组装
    param.appKey = "aGFuZHlDYW1wdXM=";
    param.appSecret = "1234567890abcedefgh";
    var time = new Date().getTime();
    param.time = time;

    /*msg.index = 1;*/
    var paramJsonMsg = JSON.stringify(msg);
    param.param = paramJsonMsg;
    // 3、生成签名
    var temp = 'appKey=aGFuZHlDYW1wdXM=&appSecret=1234567890abcedefgh&param=' + paramJsonMsg + '&time=' + time;
    param.sign = hex_md5(temp);
    // 4、对整个参数进行加密
    var jsonStr = JSON.stringify(param);
    return jsonStr;
}

/*获取校区*/
function getCampus() {
    var msg = {};
    msg.appName = "cm_findCampusAll";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async: false,
        success: function (success) {
            var campus = success.data;
            var html = '';
            for (var i = 0; i < campus.length; i++) {
                html += '<option value="' + campus[i].id + '">' + campus[i].cmName + '</option>';
            }
            $("#campus_id").html('<option value="-1">----- 请选择 -----</option>' + html);

        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*获取公寓区域*/
function getApart(campus_id) {
    var msg = {};
    msg.id = campus_id;
    msg.appName = "apart_findAparMangAll";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async: false,
        success: function (success) {
            var apart = success.data;
            var html = '';
            for (var i = 0; i < apart.length; i++) {
                html += '<option value="' + apart[i].id + '">' + apart[i].name + '</option>';
            }
            $("#apart_id").html('<option value="-1">----- 请选择 -----</option>' + html);

        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*获取公寓楼*/
function getAMang(apartid) {
    var msg = {};
    msg.area = apartid;
    msg.appName = "amang_findAMangAll";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async: false,
        success: function (success) {
            var amang = success.data;
            var html = '';
            for (var i = 0; i < amang.length; i++) {
                html += '<option value="' + amang[i].id + '">' + amang[i].apartmentName + '</option>';
            }
            $("#amang_id").html('<option value="-1">----- 请选择 -----</option>' + html);

        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*获取楼层*/
function getFloor(amangid) {
    var msg = {};
    msg.sttaid = amangid;
    msg.appName = "floor_findFloorAll";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async: false,
        success: function (success) {
            var floor = success.data;
            var html = '';
            for (var i = 0; i < floor.length; i++) {
                html += '<option value="' + floor[i].id + '">' + floor[i].floorName + '</option>';
            }
            $("#floor_id").html('<option value="-1">----- 请选择 -----</option>' + html);

        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}
