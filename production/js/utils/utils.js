/**
 * Created by ricardo on 2017-08-05.
 */
//公共变量
var resp;
var xmlhttp;
var percent = 0;// 进度数
var msg_accept_type = 1;// 可接收通知类型
var msg_publish_type = 2;// 可发送通知类型
var system_user_identity_carrier = 9;//运营商用户，含公司管理员以及代理商用户
var baseSystemDir = "/colud/production/";
/***民族***/
var mzArray = new Array("汉族","阿昌族","鄂温克族","傈僳族","水族","白族","高山族","珞巴族","塔吉克族","保安族","仡佬族","满族",
              "塔塔尔族","布朗族","哈尼族","毛南族","土家族","布依族","哈萨克族","门巴族","朝鲜族","土族","蒙古族",
              "佤族","达斡尔族","赫哲族","苗族","维吾尔族","傣族","回族","仫佬族","乌孜别克族","德昂族","基诺族","纳西族",
              "锡伯族","东乡族","京族","怒族","瑶族","侗族","景颇族","普米族","彝族","独龙族","柯尔克孜族","羌族","裕固族",
              "俄罗斯族","拉祜族","撒拉族","藏族","鄂伦春族","黎族","畲族","壮族");


if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
} else {// code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}
// 授权服务器请求路径
var serverBaseUrl = "http://192.168.2.56:8888/oauth/auth/oauth.do";
var appKey = "aGFuZHlDYW1wdXM=";
var appSecret = "1234567890abcedefgh";
var countdown = 0; // 倒计时

/**
 * 2、异步函数封装
 * @param msg
 * @param istoken 是否传token
 */
function serverFromJSONData(msg,istoken) {

    return new Promise(function (resolve,reject) {

        xmlhttp.open("POST",serverBaseUrl);
        xmlhttp.setRequestHeader("Content-type","application/json;charset=UTF-8");
        xmlhttp.setRequestHeader("token", buildRequestToken(istoken));
        xmlhttp.onreadystatechange = handler;
        xmlhttp.responseType = "json";
        xmlhttp.setRequestHeader("Accept","application/json");

        /* 发出请求 */
        xmlhttp.send(buildRequestParam(msg));

        /* handler封装开始 */
        function handler() {
            if (this.readyState != 4){
                return;
            }
            if (this.status == 200 && this.status != 0){
                /***已完成***/
                resolve(this.response);
            }else{
                /***已失败***/
                reject(new Error(this.statusText));
            }
        };
        /* handler封装结束 */
    });
}

/* 3、组装请求后端接口参数 */
function buildRequestParam(msg){
    // 请求参数组装
    var param = {};
    // 1、公共参数组装
    param.appKey = appKey;
    param.appSecret = appSecret;
    var time = new Date().getTime();
    param.time = time;
    // 2、接口请求参数组装
    var paramJsonMsg = JSON.stringify(msg);
    param.param = paramJsonMsg;
    // 3、生成签名
    var temp = 'appKey=' + appKey + '&appSecret=' + appSecret + '&param=' + paramJsonMsg + '&time=' + time;
    param.sign = hex_md5(temp);
    // 4、再对整个对象进行json格式
    var jsonStr = JSON.stringify(param);
    return jsonStr;
}

/**
 * 4、构建token
 */
function buildRequestToken(istoken){
    var token = "";
    if(istoken){
        token = sessionStorage.token;
        if(token == "" || token == null){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("信息有误，请重新登录!");
        }
    }else{
        token = ".";
    }
    return token;
}

/***
 * 5、对外提供上传文件接口，参数对应的请求接口名，接口名示例：http://xxx.xx.x:8080/xxx/xxx/xxx.do
 * @param interfaceName
 */
function uploadFile(interfaceName){
    /*** 1、判断请求路径是否完整 ***/
    if (interfaceName == null || interfaceName == ''){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('请求参数缺失，请稍后再试!');
        return;
    }

    var uploadFileObject = $("#files");

    if(uploadFileObject == null || uploadFileObject.get(0) == null || uploadFileObject.get(0).files[0] == null){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('上传文件对象不存在，请稍后再试!');
        return;
    }

    var formdata = new FormData();
    formdata.append("files",uploadFileObject.get(0).files[0]);

    progressbar.init();

    $.ajax({
        type : 'POST',
        url : interfaceName,
        data : formdata,
        cache : false,
        dataType: 'json',
        contentType : 'application/json',
        processData : false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
        contentType : false, // 不设置Content-type请求头
        beforeSend: function(request) {
            request.setRequestHeader("token", buildRequestToken(true));
        },xhr : xhrOnProgress(function (e) {
            percent = e.loaded / e.total; // 计算百分比
        }),success : function(response){
            var timer = setTimeout(function () {
                if(response.msgState == 200){
                    fill.innerHTML="<label style='font-weight:bold;color:green'>数据导入成功!</label>";
                    /*** 说明有失败的数据 ***/
                    if(response.data != null){
                        downloadExl(response.data,"failImportUserList",true);
                    }
                }else{
                    fill.innerHTML="<label style='font-weight:bold;color:red'>数据导入失败!，失败原因:"+response.msg+"</label>";
                }
                clearInterval(timer);
            },2000);
			resp=response.data;
        },error : function(){
            var timer = setTimeout(function () {
                fill.innerHTML='<label style="font-weight:bold;color:red">服务器发生错误!</label>';
                clearInterval(timer);
            },2000);
        }
    });
    /*** 上传文件input框重新绑定一次 ***/
    $('#files').replaceWith('<input id="files" tabindex="3" size="5" name="files" class="file-prew" type="file"/>');
    $("#displayFileName").html("");
}

/**
 * 6、上传文件进度监控
 * @param fun
 * @returns {Function}
 */
var xhrOnProgress = function(fun) {
    xhrOnProgress.onprogress = fun; //绑定监听
    //使用闭包实现监听绑
    return function() {
        //通过$.ajaxSettings.xhr();获得XMLHttpRequest对象
        var xhr = $.ajaxSettings.xhr();
        //判断监听函数是否为函数
        if (typeof xhrOnProgress.onprogress !== 'function')
            return xhr;
        //如果有监听函数并且xhr对象支持绑定时就把监听函数绑定上去
        if (xhrOnProgress.onprogress && xhr.upload) {
            xhr.upload.onprogress = xhrOnProgress.onprogress;
        }
        return xhr;
    }
}

/***
 * 7、进度条控制
 * @type {{init: progressbar.init}}
 */
var progressbar = {
    init:function(){
        var fill = document.getElementById('fill');
        //通过间隔定时器实现百分比文字效果,通过计算CSS动画持续时间进行间隔设置
        var timer = setInterval(function(e){
            var processPercent = Math.floor(percent) * 100;
            fill.innerHTML='<label style="font-weight:bold;color:green;margin-left: 10px;">'+processPercent+'%</label>';
            fill.style.width = processPercent +"%";
            if(processPercent == 100){
                clearInterval(timer);
                fill.innerHTML='<label style="font-weight:bold;color:green;margin-left: 10px;">文件上传完成，导入中......</label>';
            }
        },1);
    }
};

/***
 * 8、分页函数
 * @param pageNo 页码
 * @param pageSize 每页显示个数
 * @param array 待处理的数组
 * @returns {*}
 */
function pagination(pageNo, pageSize, array) {
    var offset = (pageNo - 1) * pageSize;
    return (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize);
}

/***
 *  9、检查字符串是否为空或空字符串
 * @param obj
 */
function checkValueIsNull(obj){
    if(obj == null || obj == ''){
        return true;
    }else{
        return false;
    }
}

/***
 *  10、检查字符串是否为空字符串
 * @param obj
 */
function checkValueIsEmptyString(obj){
    if(obj == ''){
        return true;
    }else{
        return false;
    }
}

/***
 *  11、检查手机号码是否为空
 * @param obj
 */
function checkSubmitMobil(mobile) {

    if (checkValueIsNull(mobile)) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("用户手机号码栏不能为空!");
        return false;
    }

    if(!(/^1[34578]\d{9}$/.test(mobile))){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("用户手机号码栏格式不正确，请重新输入!");
        return false;
    }

    return true;
}

/***
 * 12、验证身份证
 * @param card
 * @returns {boolean}
 */
function isCardNo(card) {
    var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return pattern.test(card);
}

/***
 * 13、验证中文名称
 * @param name
 * @returns {boolean}
 */
function isChinaName(name) {
    if(checkValueIsNull(name)){
        return false;
    }
    var pattern = /[\u4E00-\u9FA5]{2,10}/;
    return pattern.test(name);
}

/***
 * 14、时间戳时间转换为标准的字符串时间
 * @param times
 * @returns {string}
 */
function buildStandardTime(times){
    var now = new Date(parseInt(times) * 1000);
    var yy = now.getFullYear();      //年
    var mm = now.getMonth() + 1;     //月
    var dd = now.getDate();          //日
    var hh = now.getHours();         //时
    var ii = now.getMinutes();       //分
    var ss = now.getSeconds();       //秒
    var clock = yy + "-";
    if(mm < 10) clock += "0";
    clock += mm + "-";
    if(dd < 10) clock += "0";
    clock += dd + " ";
    if(hh < 10) clock += "0";
    clock += hh + ":";
    if (ii < 10) clock += '0';
    clock += ii + ":";
    if (ss < 10) clock += '0';
    clock += ss;
    return clock;
}

/***
 * 15、判断字符串是否为数字
 */
function checkIsNumber(str){
   if(!$.isNumeric(str)){
       return false;
   }else{
       return true;
   }
}

/***
 * 16、通用动态生成表格数据
 * @param tableID
 * @param dataList
 */
function buildTableTrData(tableID,dataList){
    if(checkValueIsNull(tableID)){
        return;
    }
    var tb = $('#'+tableID+' tbody');// table tbody对象
    $(tb).empty();// 每次重新加载的时候清空tbody中的数据
    if(dataList != null && dataList.length > 0){
        $.each(dataList,function(i,row){
            var tr = $('<tr>');
            /*** 查询table绑定的字段 ***/
            $('#'+tableID+' thead tr').find('th').each(function(){
                var fieldName = $(this).attr('bindField');
                $(tr).append('<td style="text-align: center">'+row[""+fieldName+""]+'</td>');
            });
            $(tb).append(tr);
        });
    }
}

/***
 * 17、获取学校id
 * @returns {boolean}
 */
function matchSchoolIDFromHost(host) {
    var sid = "-1";
    // 2、接口请求参数组装
    var param = {};
    param.appName="school_getSchoolInfo";
    param.requestHost = host;
    var jsonStr = buildRequestParam(param);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (response) {
            var result = response.data;
            schoolData = result;//获取学校信息
            if(result != null && !checkValueIsNull(result.sid)){
                sid = result.sid;
                sessionStorage.sid = sid;
                sessionStorage.schoolName = result.schoolName;// 学校名称
            }
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", buildRequestToken(false));
        }
    });
    return sid;
}

/***
 * 18、建立一個可存取到該file的url
 * @param {Object} file
 */
function getObjectURL(file) {
    var url = null ;
    if (window.createObjectURL!=undefined) { // basic
        url = window.createObjectURL(file) ;
    } else if (window.URL!=undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
    } else if (window.webkitURL!=undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
    }
    return url ;
}

/***
 * 19、判断数组是否存在数据
 * @param {Object} array
 */
function checkArrayIsEmpty(array){
	if(array != null && array.length != 0){
		return false;
	}else{
		return true;
	}
}

/***
 * 20、时间倒计时
 * @param {Object} timeElement
 * @param {Object} btnElement
 */
function settime(timeElement,btnElement) { //发送验证码倒计时
    if (countdown == 0) {// 倒计时时间结束
    	$("#"+timeElement).hide();
    	$("#"+btnElement).show();
        countdown = 300; 
        return;
    } else { 
    	$("#"+timeElement).text(countdown+"s后重新获取");
        countdown--; 
    } 
    setTimeout(function() { settime(timeElement,btnElement) },1000) 
}

/***
 * 停止计时器
 */
function stopSetTime(){
	countdown = 0;
}

/***
 * 开始定时器运行
 */
function startSetTime(){
	countdown = 300;
}

/***
 * 判断etime和stime两个时间的时间差
 * @param {Object} stime
 * @param {Object} etime
 */
function judgeTimeDiff(stime,etime){
	var isTimeOut = 0;
	var d1 = new Date(stime); 
	var d2 = new Date(etime);
	isTimeOut = parseInt(d2-d1)/1000/60/60;
	return isTimeOut;
}

/***
 * 获取两个时间之间的天数差
 * @param {Object} stime
 * @param {Object} etime
 */
function judgeTimeDiffDay(stime,etime){
	var isTimeOut = 0;
	var d1 = new Date(stime); 
	var d2 = new Date(etime);
	isTimeOut = parseInt(d2-d1)/1000/60/60/24;
	return isTimeOut;
}
























