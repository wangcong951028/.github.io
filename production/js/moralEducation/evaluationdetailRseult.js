$(function () {
    getStudent();
})

/*清理表单*/
function clearnFrom() {
	clearnSubChecked();
    clearnDateChecked();
    document.getElementById("workForm").reset();
}

var subInformation;//学生信息
var subList;
var detailNode;
/*获取学生信息*/
function getStudent(){
    var msg = {};
    msg.appName = "dormitory_getStudentZtree";
    serverFromJSONData(msg, true).then(function (success) {
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
        if(node != null && node.length > 0){
            var defaults = {
                textLabel: "jasontext",
                zNodes: node,
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
        projectAndDetail()
    }), function (error) {
        console.log("访问服务器发生错误，请稍后再试!", error);
    };
}
var detail;
/*获取考核信息*/
function projectAndDetail() {
    var msg = {};
    msg.appName = "result_findProjectDetail";
    serverFromJSONData(msg, true).then(function (success) {
        var project = success.data[0];
        detail = success.data[1];
        function oncheckCalbask(Nodelist) {
            detailNode = Nodelist;
            detailHtml(Nodelist);
        }
        var defaults = {
            textLabel: "jasontext",
            zNodes: project,
            height:200,
            callback:{
                onCheck: oncheckCalbask
            }
        }
        $(document).ready(function () {
            $("#prodetail").drawMultipleTree(defaults);
        });
    }), function (error) {
        console.log("访问服务器发生错误，请稍后再试!", error);
    };
}

var detailID;
function detailHtml(Nodelist) {
    detailID = new Array();
    var html = '';
    for(var i=0;i<Nodelist.length;i++){
        html += '<label class="control-label col-md-3 col-sm-3 col-xs-12"' +
                 'id="projectHtml" style="width: 100%;background-color: #a2faff">' +
                 '<span style="float: left;font-size: large">'+Nodelist[i].name+'</span>' +
                 '</label>';
        for(var j=0;j<detail.length;j++){
            if(Nodelist[i].id == detail[j].fk_evaluationid){
                detailID[j] = detail[j].pk_id;
                    html += '<input type="text" hidden id="detailID_'+detail[j].pk_id+'" value="'+detail[j].pk_id+'">' +
                            '<input type="text" hidden id="modeStatus_'+detail[j].pk_id+'" value="'+detail[j].e_mode+'">';
                if(detail[j].e_mode == 1){
                    html += '<label class="control-label col-md-3 col-sm-3 col-xs-12"' +
                        'id="detailHtml" style="width: 100%">' +
                        '<span style="float: left" id="name_'+detail[j].pk_id+'">'+detail[j].e_name+'</span>' +
                        '<label style="margin-left: 5px"><input type="radio" checked class="flat"  name="emode_'+detail[j].pk_id+'" value="1"><i>✓</i> <span>优</span> </input></label>' +
                        '<label style="margin-left: 5px"><input type="radio" class="flat" name="emode_'+detail[j].pk_id+'" value="2"><i>✓</i> <span>良</span> </label>' +
                        '<label style="margin-left: 5px"><input type="radio" class="flat" name="emode_'+detail[j].pk_id+'" value="3"><i>✓</i> <span>中</span> </label>' +
                        '<label style="margin-left: 5px"><input type="radio" class="flat" name="emode_'+detail[j].pk_id+'" value="4"><i>✓</i> <span>差</span> </label>' +
                        '</label>';
                }else if(detail[j].e_mode == 2){
                    html += '<label class="control-label col-md-3 col-sm-3 col-xs-12"' +
                        'id="detailHtml" style="width: 100%">' +
                        '<span style="float: left" id="name_'+detail[j].pk_id+'">'+detail[j].e_name+'</span>' +
                        '<input id="join-money_'+detail[j].pk_id+'" style="margin-left: 10px;width: 30px" ' +
	                    'onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,\'\')}else{this.value=this.value.replace(/\\D/g,\'\')}"' +
	                    'onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,\'1\')}else{this.value=this.value.replace(/\\D/g,\'\')}"' +
	                    ' type="text"  value="0"> 分' +
                        '</label>';
                }
            }
        }
    }
    $("#resultHtml").html(html);
}

function saveResult() {
    var msg = {};
    msg.e_remark = $("#remark").val();
    /*学生*/
    var list = new Array();
    for(var i=0;i<subInformation.length;i++){
        var student = new Object();
       student.studentname = subInformation[i].studentname;
       student.studentid = subInformation[i].studentid;
       list.push(student);
    }
    msg.studentList = list;
    /*考核规则*/
    var detailListq = new Array();
    for(var j=0;j<detailID.length;j++){
    	
        var newdetail = new Object();
        newdetail.detailNmae = $("#name_"+detailID[j]).text();
        newdetail.detailid =  $("#detailID_"+detailID[j]).val();
        var modeStatus = $("#modeStatus_"+detailID[j]).val();
        if(modeStatus == 1){
            var mode = $("input[type='radio'][name='emode_"+detailID[j]+"']");
            for(var k=0;k<mode.length;k++){
                if(mode[k].checked){
                    if(mode[k].value == 1){
                        newdetail.e_grade = "优";
                    }else if(mode[k].value == 2){
                        newdetail.e_grade = "良";
                    }else if(mode[k].value == 3){
                        newdetail.e_grade = "中";
                    }else if(mode[k].value == 4){
                        newdetail.e_grade = "差";
                    }
                    detailListq.push(newdetail);
                }
            }
        }else if(modeStatus == 2){
            newdetail.e_grade = $("#join-money_"+detailID[j]).val();
            detailListq.push(newdetail);
        }
    }
    msg.detailList = detailListq;
    msg.appName = "result_saveResult";
    serverFromJSONData(msg, true).then(function (success) {
        if(success.msgState == 200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功！");
            clearnFrom();
            $("#resultHtml").html("");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }), function (error) {
        console.log("访问服务器发生错误，请稍后再试!", error);
    };
}

function clearnSubChecked() {
    for(var i=0;i<subList.length;i++ ){
        var aa = subList[i];
        aa.checked = false;
        getStudent();
    }
}
function clearnDateChecked() {
    for(var i=0;i<detailNode.length;i++ ){
        var aa = detailNode[i];
        aa.checked = false;
        getStudent();
    }
}