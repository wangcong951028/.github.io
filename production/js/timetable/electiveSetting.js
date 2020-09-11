var areaTable;

$(function () {
    init();//初始化
});


/**
 * 初始化列表
 */
function init() {
    // 2、接口请求参数组装
    var msg = {};
    msg.appName = "timetableInfo_electiveSetting";
    // 4、对整个参数进行加密
    var jsonStr = buildRequestParam(msg);

    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
            if(success.msgState == 200){
                var periods = success.data.periods;
                var conditions = success.data.conditions;

                $.each(periods.split(','), function(index, obj) {
                    var periodsCheckbox = $("input:checkbox[name=period]");
                    $.each(periodsCheckbox, function(index, item){
                        if (obj == $(item).val()) {
                            $(this).attr("checked","checked");
                        }
                    });
                });

                $.each(conditions.split(','), function(index, obj) {
                    var conditionsCheckbox = $("input:checkbox[name=condition]");
                    $.each(conditionsCheckbox, function(index, item){
                        if (obj == $(item).val()) {
                            $(this).attr("checked","checked");
                        }
                    });
                });
            }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });

}
/**增加必修课计划*/
function addElectiveSetting() {
    var periods = $("input:checkbox[name=period]:checked"); //通过Jquery获取指定name的选中checkbox
    var conditions = $("input:checkbox[name=condition]:checked");
    if(periods.length <=0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('必须选');
        return;
    }
    if(conditions.length <=0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('必须选');
        return;
    }

    var periodIds = '';
    var conditionIds = '';
    $.each(periods,function (key,item) {   //循环遍历获取到的checkboxs
        if ($(item).val() != ""){                  //当前checkbox的value不为空时执行以下操作
            periodIds+=$(item).val()+',';
        }
    })
    $.each(conditions,function (key,item) {   //循环遍历获取到的checkboxs
        if ($(conditions).val() != ""){                  //当前checkbox的value不为空时执行以下操作
            conditionIds+=$(conditions).val()+',';
        }
    })
    periodIds = periodIds.substr(0, periodIds.length-1);
    conditionIds = conditionIds.substr(0, conditionIds.length-1);
    var msg = {};
    msg.periods=periodIds;
    msg.conditions=conditionIds;

    msg.appName="timetableInfo_electiveSettingAdd";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功");
            $('#myModals').modal('hide');//关闭窗口
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("发布公告失败，原因："+success.msg)
        }
        refresh();
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };

}

function doElective(){
// 2、接口请求参数组装
    var msg = {};
    msg.appName = "timetableInfo_electiveSetting";
    // 4、对整个参数进行加密
    var jsonStr = buildRequestParam(msg);

    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
            if(success.msgState == 200){
                var periods = success.data.periods;
                var conditions = success.data.conditions;

                $.each(periods.split(','), function(index, obj) {
                    var periodsCheckbox = $("input:checkbox[name=period]");
                    $.each(periodsCheckbox, function(index, item){
                        if (obj == $(item).val()) {
                            $(this).attr("checked","checked");
                        }
                    });
                });

                $.each(conditions.split(','), function(index, obj) {
                    var conditionsCheckbox = $("input:checkbox[name=condition]");
                    $.each(conditionsCheckbox, function(index, item){
                        if (obj == $(item).val()) {
                            $(this).attr("checked","checked");
                        }
                    });
                });
            }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });


}






