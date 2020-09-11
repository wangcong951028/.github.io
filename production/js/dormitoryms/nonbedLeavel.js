var areaTable;

$(function(){
	nonlelList();
	getClz();
})

/*列表*/
function nonlelList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.deptid = $("#clz_id").val();
                    data.notdate = $("#nottolay").val();
                    /*查询参数*/
                    data.appName = "non_findNonbedLeavel";
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
function getClz(){
    var msg = {};
    msg.appName = "homeWork_findClassName";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var clz = success.data;
	        var html = '';
	        for(var i=0;i<clz.length;i++){
	        	html += '<option value="'+clz[i].pk_DepID+'">'+clz[i].className+'</option>';
	        }
	        $("#clz_id").html('<option value="-1">----- 请选择 -----</option>'+html);
	        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

function uploadExcel(){
	// 2、接口请求参数组装
    var msg = {};
    msg.deptid = $("#clz_id").val();
    msg.notdate = $("#nottolay").val();
    msg.appName="non_findNonbedLeavelExcel";

    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            var nle = success.data;
            var jsonDome = []
            for (var i = 0; i < nle.length; i++) {
               jsonDome[i] = {
                    "姓名": nle[i].subname,
                    "学号": nle[i].subxgh,
                    "班级": nle[i].deptname,
                    "楼栋": nle[i].amangname,
                    "寝室号": nle[i].dornum,
                    "床位号": nle[i].bednum,
                    "未归寝时间": nle[i].nottolay,
                    "记录人": nle[i].recordpeo
                };
            }
            downloadExl(jsonDome,'nonlel',true);
            informationAlert_OnlyConfirmButton_NOT_REFRESH("导出成功！");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }

    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}
