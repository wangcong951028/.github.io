var id, dormitoryNum
$(function () {
    List();
    getApart(); //获取公寓区域
    getAMang(); //获取公寓楼栋
    getFloor(); //获取楼层
    getRoom(); //获取房间标准
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
                    data.dormitoryNum = $("#keyWord").val(); //寝室编号
                    data.area = $("#apart_id").val(); //公寓区id
                    data.building = $("#amang_id").val(); //楼栋id
                    data.floor = $("#floor_id").val(); //楼层id
                    data.dormStandard = $("#room_id").val(); //房间标准
                    data.isIntake = $("#takeUp_id").val(); //入住状态
                    data.roomVaild = $("#enanled_id").val(); //是否有效
                    /*查询参数*/
                    data.appName = "tempstay_find";
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
            "columnDefs": [{
                    "targets": -1,
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
                }, {
                    "targets": 5,
                    render: function (data, type, full, meta) {
                        if (full.roomVaild == 1) {
                            return '<span style="color:#5bc0de">有效</span>';
                        } else if (full.roomVaild == 2) {
                            return '<span style="color:red">无效</span>';
                        }
                    }
                },
                {
                    "targets": 6,
                    render: function (data, type, full, meta) {
                        if (full.sexneed == 1) {
                            return '男';
                        } else if (full.sexneed == 2) {
                            return '女';
                        }
                    }
                }, {
                    "targets": 7,
                    render: function (data, type, full, meta) {
                        if (full.bedVaild == 1) {
                            return full.bedID +
                                '&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#5bc0de">有效</span>';
                        } else if (full.bedVaild == 2) {
                            return full.bedID + '&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red">无效</span>';
                        }
                    }
                }
            ]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

function cleanModal() {
    document.getElementById('saveForm').reset();
}

/*入住*/
function inStay(id, roomVaild, bedVaild, dormitoryNum) {
    this.id = id;
    this.dormitoryNum = dormitoryNum;
    if (roomVaild != 1) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择有效的房间！");
        return;
    }
    if (bedVaild != 1) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择有效的床位！");
        return;
    }
    $("#myModal").modal("show");
}
/**
 * 退房
 */
function outStay(id) {
    console.log(id);
    $.confirm({
        title: '系统消息',
        content: "<span style='color:red'>是否确认退房？</span>",
        typeAnimated: true,
        buttons: {
            tryAgain: {
                text: '确定退房',
                btnClass: 'btn-green',
                action: function () {
                    confirmOutStay(id);
                }
            },
            "取消": function () {}
        }
    });
}
/**
 * 确认退房
 */
function confirmOutStay(id){
	var msg = {};
	msg.bedId = id;
	msg.appName = "tempstay_update"; //
	serverFromJSONData(msg, true).then(function (success) {
			if (success.msgState == 200) {
				areaTable.api().ajax.reload();
				informationAlert_OnlyConfirmButton_NOT_REFRESH("退宿成功！");
			} else {
				informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
			}
		}),
		function (error) {
			console.log("访问服务器发生错误，请稍后再试!", error);
		};
}

/*保存数据*/
function saveTempStay() {
    var msg = {};
    var userName = $("#userName").val();
    var idCard = $("#idCard").val();
    var inReason = $("#inReason").val();
    var planOutTime = $("#planOutTime").val();

    if (userName == '') {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("入住人不能为空！");
        return;
    } else if (idCard == '') {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("入住人身份证不能为空！");
        return;
    } else if (planOutTime == '') {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("预计退房时间不能为空！");
        return;
    } else if (inReason == '') {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("入住原因不能为空！");
        return;
    } else {
        if (!isCardNo(idCard)) {
            informationAlert_OnlyConfirmButton_NOT_REFRESH('身份证号码格式不正确，请重新填写！');
            return;
        }

        msg.bedId = id;
        msg.dormitoryNum = dormitoryNum;
        msg.userName = userName;
        msg.idCard = idCard;
        msg.inReason = inReason;
        msg.planOutTime = planOutTime;
        msg.appName = "tempstay_save"; //
        serverFromJSONData(msg, true).then(function (success) {
                if (success.msgState == 200) {
                    $("#myModal").modal('hide');
                    areaTable.api().ajax.reload();
                    informationAlert_OnlyConfirmButton_NOT_REFRESH("入住成功！");
                } else {
                    informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
                }
            }),
            function (error) {
                console.log("访问服务器发生错误，请稍后再试!", error);
            };
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

/*获取公寓区域*/
function getApart() {
    var msg = {};
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


/*获取寝室标准*/
function getRoom() {
    var msg = {};
    msg.appName = "rsm_findRSRoomAll";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async: false,
        success: function (success) {
            var room = success.data;
            var html = '';
            for (var i = 0; i < room.length; i++) {
                html += '<option value="' + room[i].id + '">' + room[i].name + '</option>';
            }
            $("#room_id").html('<option value="-1">----- 请选择 -----</option>' + html);

        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}
