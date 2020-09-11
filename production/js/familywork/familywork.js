$(function(){
    ajax();
    findCourse();
    findOriganiza();
})
/*下拉多选*/
$(document).ready(function() {
    $('#selectClass').multiselect({
        enableClickableOptGroups:true ,
        enableCollapsibleOptGroups:true,
        maxHeight:200,
        buttonWidth: '100%',
        nonSelectedText: '------------------------请选择班级------------------------',
        numberDisplayed: 5,
        nSelectedText: '已选择',
        filterPlaceholder: '请输入班级名称',
        allSelectedText:'全选'
    });
});

/*清理模态框*/
function cleanModal(){
    $("#title").val("");
    $("#content").val("");
    $("#beginTime").val("");
    $("#endTime").val("");
    findCourse();
    findOriganiza();
}

var areaTable;
/*列表*/
function ajax() {
        //添加额外的参数传给服务器
        areaTable = $('#datatable-checkbox').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    /*查询参数*/
                    data.keyWord = $("#teacherName").val();
                    data.className = $("#className").val();
                    data.appName = "homeWork_findTeacherHomeWork";
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
                /*{
                    "targets": 1,
                    "orderable": false,
                    "className": 'select-checkbox',
                    render: function (data, type, full, meta) {
                        return '<input type="checkbox" name="table_records" class="flat" id="checkbox-all-' + full.pk_ID + '" value="' + full.pk_ID + '" />';
                    }
                },*/
                {
                    "targets": -1,
                    render: function (data, type, full, meta) {
                        return '<button class="btn btn-primary btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="lookwork(' + full.pk_ID + ')"><i class="glyphicon glyphicon-search">查看</i></button>' +
                                '<a class="btn btn-info btn-xs" href="javascript:;"  data-key="' + full.pk_ID + '"  onclick="updateModal(' + full.pk_ID + ')"><i class="fa fa-pencil">修改</i></a>'+
                                '<a class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.pk_ID + '"  onclick="deleteModal(' + full.pk_ID + ')"><i class="fa fa-trash-o">删除</i></a>';
                    }
                }]
        });
        $("#search").click(function () {
            areaTable.api().ajax.reload();
        });
}

/*添加*/
function saveFamilywork(){
    var title = $("#title").val();
    var content = $("#content").val();
    var course_id = $("#cousreName").val();
    var beginTime = $("#beginTime").val();
    var endTime = $("#endTime").val();
    var className = $("#selectClass").val();
		var vheckedvalue = $('input[type="checkbox"][name="state"]');
		var type_mesg = "";
		for(var i=0;i<vheckedvalue.length;i++){
				if(vheckedvalue[i].checked){
					if(i<vheckedvalue.length){
							type_mesg += vheckedvalue[i].value;
					}
				}
		}
		var course_name = $("#course_"+course_id).html();
		if(content.length>100){
				$.alert({
						title: '系统消息',
						content: '不能超过100字符!',
						buttons: {
								"确定": function () {
								}
						}
				});
				return;
		}
    // 2、接口请求参数组装
    var msg = {};

    var classNameList = new Array();
    if(className != null){
        for(var i=0;i<className.length;i++){
            classNameList[i] = className[i];
        }
    }
		msg.coursename = course_name
		msg.type = type_mesg;
    msg.fk_ClassID = classNameList;
    msg.h_Title = title;
    msg.h_Content = content;
    msg.h_CousreID = course_id;
    msg.h_FinishTime = beginTime;
    msg.h_PublishTime = endTime;
    msg.appName="homeWork_saveHomeWork";

    serverFromJSONData(msg,true).then(function (success) {
        var msg = success.msg;

      if (success.msgState == 200){
            $('#myModal').modal('hide');
//             $("#cousreName").html("<option value=\"-1\">--------------请选择课程------------</option>");
//             $("input").val("");
//             $("textarea").val("");
// 						$("checkbox1").attr("checked","checked");
            findCourse();
            findOriganiza();
            areaTable.api().ajax.reload();
						document.getElementById('workForm').reset();
          $.alert({
              title: '系统消息',
              content: '作业发布成功!',
              buttons: {
                  "确定": function () {
                  }
              }
          });
        }else{
          $.alert({
              title: '系统消息',
              content: msg,
              buttons: {
                  "确定": function () {
                  }
              }
          });
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };

}

/*删除提示*/
function deleteModal(id){
    $.confirm({
        title: '系统消息',
        content: '是否需要删除该条作业信息？',
        typeAnimated: true,
        buttons: {
            tryAgain: {
                text: '确定',
                btnClass: 'btn-green',
                action: function(){
                    deleteFamiywork(id);
                }
            },
            "取消": function () {
            }
        }
    });
}

/*删除*/
function deleteFamiywork(id) {
    // 2、接口请求参数组装
    var msg = {};
    var list = new Array();
    list[0] = id;
    msg.ids = list;
    msg.appName="homeWork_deleteFamilyWork";
    serverFromJSONData(msg,true).then(function (success) {
        var msg = success.msg;
        if(success.msgState == 200){
            $.alert({
                title: '系统消息',
                content: '删除成功!',
                buttons: {
                    "确定": function () {
                    }
                }
            });
            areaTable.api().ajax.reload();
        }else{
            $.alert({
                title: '系统消息',
                content: msg,
                buttons: {
                    "确定": function () {
                    }
                }
            });
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/*查找课程*/
function findCourse(value) {
    var msg = {};
    msg.appName = "course_findCourse";
    serverFromJSONData(msg,true).then(function (success) {
        var html = '<option value="-1">------------------------  请选择课程  ----------------------</option>';
				var html_2= '<option value="-1">------------------------  请选择课程  ----------------------</option>';
        var course = success.data.data;
        for (var i = 0; i < course.length; i++) {
            if(value === course[i].pk_id){
                html_2 += "<option value='" + course[i].pk_id + "' selected>" + course[i].c_name + "</option>";
            }else{
                html += "<option value='" + course[i].pk_id + "' id='course_"+course[i].pk_id+"'>" + course[i].c_name + "</option>";
								html_2 += "<option value='" + course[i].pk_id + "'>" + course[i].c_name + "</option>";
            }
        }
        $("#cousreName").html(html);
        $("#updatecousreName").html(html_2);
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/*查找班级*/
function findOriganiza(){

    // 1、公共参数组装
    var param = {};
    param.appKey = "aGFuZHlDYW1wdXM=";
    param.appSecret = "1234567890abcedefgh";
    var time = new Date().getTime();
    param.time = time;
    // 2、接口请求参数组装
    var msg = {};

    msg.appName = "homeWork_findClassName";

    /*msg.index = 1;*/
    var paramJsonMsg = JSON.stringify(msg);
    param.param = paramJsonMsg;
    // 3、生成签名
    var temp = 'appKey=aGFuZHlDYW1wdXM=&appSecret=1234567890abcedefgh&param=' + paramJsonMsg + '&time=' + time;
    param.sign = hex_md5(temp);
    // 4、对整个参数进行加密
    var jsonStr = JSON.stringify(param);

    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        success: function (success) {

            var qriganiza = success.data;

            var newQriganiza = new Array();
            var obj = new Object();
            $.each(qriganiza, function(index, html) {
                obj = {
                    label : html.className,
                    value : html.pk_DepID
                };
                newQriganiza.push(obj);
            });
            $("#selectClass").multiselect('dataprovider', newQriganiza);

        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}

function updateModal(id){
    // 2、接口请求参数组装
    var msg = {};
    msg.id = id;
    msg.appName="homeWork_findFamilyById";

    serverFromJSONData(msg,true).then(function (success) {
        var familyWork = success.data;

        $('#updateModal').modal({
            backdrop:false,//false:模式对话框，就是没有关闭模式对话框后面页面都不能点击。
            keyboard:true,//当按下 esc键时关闭模态框，设置为 false 时则按键无效。默认为true
            show:true
        });
        $("#updateID").val(familyWork.pk_ID);
        $("#updatetitle").val(familyWork.h_Title);
        $("#updatecontent").val(familyWork.h_Content);
        $("#updatecousreName").html('<option value="'+familyWork.h_CousreID+'">'+familyWork.cousreName+'</option>');
        $("#updateselectClass").html('<option value="'+familyWork.fk_ClassID+'">'+familyWork.fk_ClassName+'</option>');
        $("#updatebeginTime").val(familyWork.h_PublishTime);
        $("#updateendTime").val(familyWork.h_FinishTime);

    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function newFamilywork() {
    // 2、接口请求参数组装
    var msg = {};
    msg.pk_ID = $("#updateID").val();

    var className = $("#updateselectClass").val();
    var classNameList = new Array();
    classNameList[0] = className;

    msg.fk_ClassID = classNameList;
    msg.h_Title = $("#updatetitle").val();
    msg.h_Content = $("#updatecontent").val();
    msg.h_CousreID = $("#updatecousreName").val();
    msg.h_FinishTime = $("#updatebeginTime").val();
    msg.h_PublishTime = $("#updateendTime").val();

    msg.appName="homeWork_updateFamilyWork";

    serverFromJSONData(msg,true).then(function (success) {

        if (success.msgState == 200){
            $('#updateModal').modal('hide');
            areaTable.api().ajax.reload();
            $.alert({
                title: '系统消息',
                content: '修改成功!',
                buttons: {
                    "确定": function () {
                    }
                }
            });
        }else{
            $.alert({
                title: '系统消息',
                content: msg,
                buttons: {
                    "确定": function () {
                    }
                }
            });
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

var imgArray;

function lookwork(id) {
    // 2、接口请求参数组装
    var msg = {};
    msg.id = id;

    msg.appName="homeWork_findFamilyById";

    serverFromJSONData(msg,true).then(function (success) {

        var familyWork = success.data;
        $("#looktitle").text(familyWork.h_Title);
        $("#lookcontent").val(familyWork.h_Content);
        $("#lookcousreName").text(familyWork.cousreName);
        $("#lookbeginTime").text(familyWork.h_FinishTime);
        $("#lookendTime").text(familyWork.h_PublishTime);
        $("#lookselectClass").text(familyWork.fk_ClassName);

        var html = '';
        var workImg = familyWork.imgList;
        if(workImg.length > 0 ){
            imgArray = new Array();
            for(var i = 0; i < workImg.length; i++){
                imgArray.push(workImg[i].picture);
                html += '<div class="col-md-55" style="height: 100px;width: 110px">' +
                    '<div class="thumbnail" style="height: 100px;width: 110px">' +
                    '<div class="image view view-first"  style="height: 100%;width: 100%;cursor: pointer" title="点击查看更多">' +
                    '<img style="width: 110px;height: 100px; display: block;" src="'+workImg[i].picture+'" alt="暂无图片"/>' +
                    '<div class="mask no-caption" style="height: 100%">' +
                    '<a class="haha" href="#" data-toggle="modal" data-target="#myModals1" onclick="showImgs(&quot;'+ workImg[i].pk_id + '&quot;)">' +
                    '<i class="fa fa-link"></i>' +
                    '</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
        }else{
            html = '<label class="control-label col-md-3 col-sm-3 col-xs-12" ' +
                'id="looktreephone" style="width: 100%;text-align: left">' +
                '暂无图片' +
                '</label>';
        }
        $("#lookpictrure").html(html);

        $("#lookModal").modal('show');
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function showImgs(src) {
    var slides='';
    var navdots='';
    for(var i=0;i<imgArray.length;i++){
        //alert(imgArray[i]);
        slides+='<input type="radio" name="radio-btn" id="img-'+(i+1)+'" checked />' +
            '<li class="slide-container">' +
            '<div class="slide">' +
            '<img src="'+imgArray[i]+'" />' +
            '</div>' +
            '<div class="nav">' +
            '<label for="img-'+(i==0?imgArray.length:i)+'" class="prev">&#x2039;</label>' +
            '<label for="img-'+(i+1==imgArray.length?1:i+2)+'" class="next">&#x203a;</label>' +
            '</div>' +
            '</li>';
        navdots+='<label for="img-'+(i+1)+'" class="nav-dot" id="img-dot'+(i+1)+'"></label>';
    }
    slides += '<li class="nav-dots" id="nav-dots">'+navdots+'</li>';
    $("#slides").html(slides);

    $("#img-dot"+($.inArray(src, imgArray)+1)+"").click();//默认点击第几个
}



