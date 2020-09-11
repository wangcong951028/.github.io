/**
 * Created by THD on 2017-07-25.
 */
$(function() {
    FinNewsTypeAjax();
});
//验证发布新闻参数
function publicNews() {
    if($("#title").val() == null || $("#title").val().length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('新闻标题不能为空');
        return;
    }
    if($("#deptName").val() == null || $("#deptName").val().length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('部门名称不能为空');
        return;
    }
    if($("#editor-one").html() == null || $("#editor-one").html().length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('新闻内容不能为空');
        return;
    }
    if($("input[name='newsType']:checked").val() == null){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('请选择新闻类型');
        return;
    }

    var bischecked=$('#isUp').is(':checked');
    var msg = {};
    msg.appName="news_addNews";
    msg.isUp=bischecked?1:0;
    msg.title=$("#title").val();
    msg.deptName=$("#deptName").val();
    msg.info=$("#editor-one").html();
    msg.newsTypeID=$("input[name='newsType']:checked").val();
    AddNews(msg);
}

/**新增新闻类型*/
function AddNewsType() {
    var type = $("#addNewsType").val();
    if(type == null){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('类型名称不能为空');
        return;
    }
    var msg = {};
    msg.appName="news_addNewsType";
    msg.typeName=type;

    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH('创建新闻类型成功');
            FinNewsTypeAjax();
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("创建新闻类型失败，原因："+success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/**
 * 新增新闻
 * @constructor
 */
function AddNews(msg) {
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH('创建新闻成功');
            reSetNews()//刷新当前页面
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("创建新闻失败，原因："+success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}
/***/
function reSetNews() {
    $("#title").val("");
    $("#deptName").val("");
    $("#editor-one").html("");
}

/**
 * 查询新闻类型
 * @constructor
 */
function  FinNewsTypeAjax() {
    var msg = {};

    msg.appName="news_listNewsType";
    serverFromJSONData(msg,true).then(function (success) {
        var html = '';
        for(var i=0;i<success.data.length;i++){
            var type = success.data[i];
            html += "<label class='btn btn-default' data-toggle-class='btn-primary' " +
                "data-toggle-passive-class='btn-default'><input type='radio' name='newsType' " +
                "value='"+type.newsTypeID+"'> &nbsp; "+type.name+" &nbsp; </label>";

        }
        $("#gender").html(html);
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}