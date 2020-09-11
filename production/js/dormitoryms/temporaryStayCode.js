var id, dormitoryNum
$(function () {
    List();
    getApart(); //获取公寓区域
    getAMang(); //获取公寓楼栋
    getFloor(); //获取楼层
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
                    data.appName = "tempstay_findCode";
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
           }]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

function cleanModal() {
    document.getElementById('saveForm').reset();
    getDor_ztree();
    $("#dorid").val('');
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