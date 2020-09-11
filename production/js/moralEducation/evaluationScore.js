
$(function (){
    getProjectName();//获取模块名称
    findDeptNode();//获取班级
    getManagement();//获取节次
    getDormitory();//获取寝室
    getStudent();//获取学生
});
var deptID;
var projectID;
var modelid;
var setting = {
    callback: {
        onClick: zTreeOnClick
    },
    data: {
        simpleData: {
            enable: true
        }
    }
};

var dorInformation;//寝室信息
var dorList;
var classInformation;//班级信息
var classList;
var subInformation;//学生信息
var subList;
var statisticsInformation;//打分信息

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

/*获取考核规则*/
function getRules(){
    var msg = {};
    msg.start = 0;
    msg.length = 2147483647;
    msg.modelID = projectID;
    msg.appName = "rules_findInspectionRulesPC";
    
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var rules = success.data.data;
	        var html = '<div  style="overflow:scroll;height: 300px;">';
	        var classHtml = '';
	        var dormitoryHtml = '';
	        statisticsInformation = new Array();
	        for (var i = 0; i < rules.length; i++) {
	            var id = rules[i].pk_id;
	            var name = rules[i].m_name;
	            var classscoring = rules[i].m_classscoring;
	            var individualscoring = rules[i].m_individualscoring;
	            var pClass = rules[i].pClass;//班级：1不考核，2考核
	            var pDormitory = rules[i].pDormitory;//寝室：1不考核，2考核
	            var pIndividual = rules[i].pIndividual;//个人：1不考核，2考核
	            var mScoringway = rules[i].m_scoringway;//加减分操作：1加分操作，2减分操作
	            statisticsInformation[i] = id;
	            /*隐藏div*/
	            if(pClass == 1){
	                document.getElementById("classHtml").style.display="none";
	            }else{
	                document.getElementById("classHtml").style.display="";
	            }
	            if(pDormitory == 1){
	                document.getElementById("dormitoryHtml").style.display="none";
	            }else{
	                document.getElementById("dormitoryHtml").style.display="";
	            }
	            if(pIndividual == 1){
	                document.getElementById("individualHtml").style.display="none";
	            }else{
	                document.getElementById("individualHtml").style.display="";
	            }
	
	            if(mScoringway == 1){
	                html += '<label class="control-label col-md-3 col-sm-3 col-xs-12" style="width: 100%;text-align: left">' +
	                    '<input id="pkid_'+id+'" type="text" hidden value="'+id+'">' +
	                    '<input id="type_'+id+'" type="text" hidden value="'+mScoringway+'">' +
	                    '<span id="name_'+id+'">' + name + '</span>。' +
	                    '<span style="margin-left: 10px;">班级加分:</span>' +
	                    '<span id="class_'+id+'" style="margin-left: 5px;color: #FF0202">' + classscoring + '</span>' +
	                    '<span style="margin-left: 5px;">分，</span>' +
	                    '<span style="margin-left: 10px;">个人加分:</span>' +
	                    '<span id="individual_'+id+'" style="margin-left: 5px;color: #FF0202">' + individualscoring + '</span>' +
	                    '<span style="margin-left: 5px;">分，</span>' +
	                    '<span style="margin-left: 10px;">共计</span>' +
	                    '<a id="addBtn-min" href="#" style="margin-left: 10px" onclick="addNumberqq(' + id + ')">-</a>' +
	                    '<input id="join-money' + id + '" style="margin-left: 10px;width: 30px" ' +
	                    'onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,\'\')}else{this.value=this.value.replace(/\\D/g,\'\')}"' +
	                    'onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,\'1\')}else{this.value=this.value.replace(/\\D/g,\'\')}"' +
	                    ' type="text"  value="0">' +
	                    '<a id="addBtn-add"  style="margin-left: 10px" onclick="addNumber(' + id + ')">+</a>' +
	                    '<span style="margin-left: 10px;">次。</span>' +
	                    '</label>';
	            }else if(mScoringway == 2){
	                html += '<label class="control-label col-md-3 col-sm-3 col-xs-12" style="width: 100%;text-align: left">' +
	                    '<input id="pkid_'+id+'" type="text" hidden value="'+id+'">' +
	                    '<input id="type_'+id+'" type="text" hidden value="'+mScoringway+'">' +
	                    '<span id="name_'+id+'">' + name + '</span>。' +
	                    '<span style="margin-left: 10px;">班级扣分:</span>' +
	                    '<span id="class_'+id+'" style="margin-left: 5px;color: #FF0202">' + classscoring + '</span>' +
	                    '<span style="margin-left: 5px;">分，</span>' +
	                    '<span style="margin-left: 10px;">个人扣分:</span>' +
	                    '<span id="individual_'+id+'" style="margin-left: 5px;color: #FF0202">' + individualscoring + '</span>' +
	                    '<span style="margin-left: 5px;">分，</span>' +
	                    '<span style="margin-left: 10px;">共计</span>' +
	                    '<a id="addBtn-min" href="#" style="margin-left: 10px" onclick="addNumberqq(' + id + ')">-</a>' +
	                    '<input id="join-money' + id + '" style="margin-left: 10px;width: 30px" ' +
	                    'onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,\'\')}else{this.value=this.value.replace(/\\D/g,\'\')}"' +
	                    'onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,\'1\')}else{this.value=this.value.replace(/\\D/g,\'\')}"' +
	                    ' type="text"  value="0">' +
	                    '<a id="addBtn-add"  style="margin-left: 10px" onclick="addNumber(' + id + ')">+</a>' +
	                    '<span style="margin-left: 10px;">次。</span>' +
	                    '</label>';
	            }
	        }
	        html+='</div>';
	        $("#rulesName").html(html);
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*获取节次信息*/
function getManagement(){
    var msg = {};
    msg.start = 0;
    msg.length = 2147483647;
    msg.modelID = projectID;
    msg.orderbyName = "w_time";
    msg.orderbyType = "asc";
    msg.appName = "what_findManagementPC";
    
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var management = success.data.data;
	        var html = '';
	        for(var i=0;i<management.length;i++){
	            html += '<option value="'+management[i].pk_id+'">'+management[i].w_name+'</option>';
	        }
	        $("#management").html(html);
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

/*获取寝室信息*/
function getDormitory(){
    var msg = {};
//  msg.start = 0;
//  msg.length = 2147483647;
//  msg.modelID = projectID;
//  msg.status = 2;
    msg.appName = "dor_getDorZtree";//dor_getDorZtree//dormitory_getDormitoryZtree
    
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var node = success.data;
	        function oncheckCalbask(Nodelist) {
	            dorList = Nodelist;
	            dorInformation = new Array();
	            for(var i = 0;i<Nodelist.length;i++){
	                var dor = new Object();
	                var dor_id = Nodelist[i].id;
	                var str_id = dor_id.substring(dor_id.indexOf("_")+1);
	                dor.dormitoryid = str_id;
	                dor.dormitoryname = Nodelist[i].name;
	                dorInformation.push(dor);
	            }
	        }
	        if(dorList != null && dorList.length>0){
	            var defaults = {
	                textLabel: "jasontext",
	                zNodes: dorList,
	                height:200,
	                callback:{
	                    onCheck: oncheckCalbask
	                }
	            }
	        }else{
	            var defaults = {
	                textLabel: "jasontext",
	                zNodes: node,
	                height:200,
	                callback:{
	                    onCheck: oncheckCalbask
	                }
	            }
	        }
	        $(document).ready(function () {
	            $("#dormitoryZtree").drawMultipleTree(defaults);
	        });
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
    
}

/*获取学生信息*/
function getStudent(){
    var msg = {};
    msg.appName = "dormitory_getStudentZtree";
    
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var node = success.data;
	        function oncheckCalbask(Nodelist) {
	            subList = Nodelist;
	            subInformation = new Array();
	            for(var i=0;i<Nodelist.length;i++){
	                var sub = new Object();
	                var r = /^\+?[1-9][0-9]*$/　//正整数
	                var flag = r.test(Nodelist[i].id);
	                if(flag){
	                    sub.studentid = Nodelist[i].id;
	                    sub.studentname = Nodelist[i].name;
	                    subInformation.push(sub);
	                }
	            }
	
	        }
	        if(subList != null && subList.length > 0){
	            var defaults = {
	                textLabel: "jasontext",
	                zNodes: subList,
	                height:200,
	                callback:{
	                    onCheck: oncheckCalbask
	                }
	            }
	        }else{
	            var defaults = {
	                textLabel: "jasontext",
	                zNodes: node,
	                height:200,
	                callback:{
	                    onCheck: oncheckCalbask
	                }
	            }
	        }
	        $(document).ready(function () {
	            $("#studentZtree").drawMultipleTree(defaults);
	        });
        
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

function addNumber(status) {
    var t = $("#join-money"+status+"");
    t.val(parseInt(t.val()) + 1); //点击加号输入框数值加1
}
function addNumberqq(status) {
    var t = $("#join-money"+status+"");
    t.val(parseInt(t.val())-1); //点击减号输入框数值减1
    if(t.val()<=0){
        t.val(parseInt(0)); //最小值为1
    }
}

//------------------------------------------------------------------------------------------------------------------------------
/*获取模块名称和id*/
function getProjectName(){
    var msg = {};
    msg.id = getUrlParam('modelID');
//  msg.projectID = "91_modelID";
    msg.appName = "rules_getZtree";
    
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        if (success.msgState == 200) {
	            var node = success.data;
	            var zTreeObj;
	            $(document).ready(function () {
	                zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, node);
	            });
	            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
	            /*var nodes = treeObj.getNodes();
	            if (nodes.length > 0) {
	                for (var i = 0; i < nodes.length; i++) {
	                    treeObj.expandNode(nodes[i], true, false, false);
	                }
	            }*/
	        } else {
	            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
	        }
	        getManagement();
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}
/*根据左边菜单树获取有伴展示数据*/
function zTreeOnClick(event, treeId, treeNode) {
    projectID = treeNode.id;
    modelid = treeNode.pId
    getRules();
    $("#pName").html(treeNode.name);
}


/*获取班级*/
function findDeptNode() {
    // 2、接口请求参数组装
    var msg = {};
    msg.deptTypeID = 1;
    msg.appName="respondents_findDeptNode";
    
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
	        var node = success.data;
	        function oncheckCalbask(Nodelist) {
	            classList = Nodelist;
	            classInformation = new Array();
	            for(var i=0;i<Nodelist.length;i++){
	                var clz = new Object();
                    clz.classid = Nodelist[i].id;
                    clz.classname = Nodelist[i].name;
                    classInformation.push(clz);
	            }
	        }
	        if(classList != null && classList.length>0){
	            var defaults = {
	                textLabel: "jasontext",
	                zNodes: classList,
	                height:200,
	                
	                callback:{
	                    onCheck: oncheckCalbask
	                }
	            }
	        }else{
	            var defaults = {
	                textLabel: "jasontext",
	                zNodes: node,
	                height:200,
	                callback:{
	                    onCheck: oncheckCalbask
	                }
	            }
	        }
	
	        $(document).ready(function () {
	            $("#classZtree").drawMultipleTree(defaults);
	        });
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

//------------------------------------------------------------------------------------------------------------------------------

/*清理表单*/
function clearnFrom() {
	clearnClassChecked(classList);
    clearnSubChecked(subList);
    clearnDorChecked(dorList);
    document.getElementById("workForm").reset();
}

/*添加打分结果*/
function saveStatistics() {
	var class_type = document.getElementById("classHtml").style.display;
	var dormitory_type = document.getElementById("dormitoryHtml").style.display;
	var individual_type = document.getElementById("individualHtml").style.display;
	
	if(statisticsInformation == null || statisticsInformation.length==0){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择考核项 ");
	}else if(class_type == "" && classInformation.length==0){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择班级");
	}else if(dormitory_type == "" && dorInformation.length==0){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择寝室");
	}else if(individual_type == "" && subInformation.length==0){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择学生");
	}else{
	    var msg = {};
	    msg.classResult = classInformation;//班级
	    msg.dormitoryResult = dorInformation;//寝室
	    msg.studentResult = subInformation;//学生
	    msg.s_remark = $("#remark").val();//备注信息
	    var statistics = new Array();
	    var numbers = new Array();
	    for(var i=0;i<statisticsInformation.length;i++){
	        var result = Object();
	        result.modelid = modelid;
	        result.projectid = projectID;
	        result.pName = $("#pName").html();
	        result.statisticsName = $("#name_"+statisticsInformation[i]+"").html();
	        result.fk_moralrules = $("#pkid_"+statisticsInformation[i]+"").val();
	        result.s_classscoring = $("#class_"+statisticsInformation[i]+"").text();
	        result.s_individualscoring = $("#individual_"+statisticsInformation[i]+"").text();
	        result.s_pointsnumber = $("#join-money"+statisticsInformation[i]+"").val();
	        result.s_scoringway = $("#type_"+statisticsInformation[i]+"").val();
	        if($("#join-money"+statisticsInformation[i]+"").val()>0){
	        	numbers.push($("#join-money"+statisticsInformation[i]+"").val());
	        }
	        statistics.push(result);
	    }
	    if(numbers.length==0){
	    	informationAlert_OnlyConfirmButton_NOT_REFRESH("请至少进行一项考核！");
	    }else{
	    	msg.statisticsRequests = statistics;//打分信息
		    msg.managementid = $("#management").val();//节次
		//  msg.s_scoringtime = $("#assessmentTime").val();//时间
		
		    msg.appName = "statistics_saveScoringStatistics";
		    serverFromJSONData(msg, true).then(function (success) {
		        if(success.msgState == 200){
		            classInformation = new Array();
		            dorInformation = new Array();
		            subInformation = new Array();
		            clearnFrom();
		            clearnClassChecked(classList);
		            clearnSubChecked(subList);
		            clearnDorChecked(dorList);
		            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功！");
		        }else{
		            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
		        }
		    }), function (error) {
		        console.log("访问服务器发生错误，请稍后再试!", error);
		    };
	    }
	   
    }
}

/*获取URL地址参数*/
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

///重置选择框
function clearnClassChecked(classList) {
	if(classList != null){
		for(var i=0;i<classList.length;i++ ){
	        var aa = classList[i];
	        aa.checked = false;
	    }
	    findDeptNode();
	}
}
function clearnSubChecked(subList) {
	if(subList != null){
	    for(var i=0;i<subList.length;i++ ){
	        var aa = subList[i];
	        aa.checked = false;
	    }
	     getStudent();
    }
}
function clearnDorChecked(dorList) {
	if(dorList != null){
		for(var i=0;i<dorList.length;i++ ){
	        var aa = dorList[i];
	        aa.checked = false;
	    }
	    getDormitory();
	}
}

