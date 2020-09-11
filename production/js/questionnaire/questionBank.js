var i = 1;
$(function () {
    $(document).on("click", "#pmfa", function () {
        $(".pmft").append("<div class=\"input-group\">" +
            "<span class=\"input-group-addon\">" + i + "</span>" +
            "<input type=\"text\" id=" + i + " class=\"form-control col-md-9\" placeholder=\"请输入选项\">" +
            "</div>");
        i++;
    });
    $(document).on("click", "#cleanText", function () {
        $(this).parents(".input-group").remove();
    });
});

function addDivHtml() {
    i = 1;
    $("#myDiv").html("");
    $("#myDiv").html('<hr/><div style="width: 100%">' +
        '<button type="button" class="btn btn-info" id="pmfa">添加选项</button>' +
        '<div class="pmft">' +
        '</div>');
}

/*获取URL地址参数*/
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

/*清理模态框*/
function cleanModal() {
    $("#q_title").val("");
    $("#typeSelect").html('<option value="-1">------------------------  类型  ----------------------</option>' +
        '<option value="0">单选</option>' +
        '<option value="1">多选</option>' +
        '<option value="2">是非</option>');
    $("#myDiv").html("");
}
$(function () {
    questionList();
})

var areaTable;
/*列表*/
function questionList() {
    var id = getUrlParam('id');
        //添加额外的参数传给服务器
        areaTable = $('#questionTabl').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    /*查询参数*/
                    data.wenjuanID = id;
                    data.appName = "questionBank_findQuestionBank";
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
                {
                    "targets": -1,
                    render: function (data, type, full, meta) {
                        return '<a class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="deleteModal(' + full.pk_id + ')"><i class="fa fa-trash-o">删除</i></a>';
                    }
                },
                /*{
                    "targets": 1,
                    "orderable": false,
                    "className": 'select-checkbox',
                    render: function (data, type, full, meta) {
                        return '<input type="checkbox" name="table_records" class="flat" id="checkbox-all-' + full.pk_id + '" value="' + full.pk_id + '" />';
                    }
                },*/
                {
                    "targets": 2,
                    render: function (data, type, full, meta) {
                        if (full.q_type == 0) {
                            return "单选";
                        }
                        else if (full.q_type == 1) {
                            return "多选";
                        }
                        else if (full.q_type == 2) {
                            return "是非";
                        }
                    }
                }]
        });
}

/*添加问卷题目*/
function Save(status) {
    //获取URL带的问卷id
    var id = getUrlParam('id');

    // 2、接口请求参数组装
    var msg = {};
    var cnt = $("#myDiv input[type=text]").length; //获取文本数量
    var array = new Array();
    for (i = 1; i <= cnt; i++) {
        var items = new Object();
        items.q_info=$("#"+i).val();
        items.q_optionList=i;
        array.push(items);
    }
    msg.q_title = $("#q_title").val();
    msg.q_type = $("#typeSelect").val();
    msg.items = array;
    msg.wenjuanID = id;
    msg.appName="questionBank_saveQuestionBank";

    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功！");
            if(status=='01'){
                cleanModal();
                areaTable.api().ajax.reload();
            }else if(status=='02'){
                $('#myModal').modal('hide');
                cleanModal();
                areaTable.api().ajax.reload();
            }
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/*删除问卷题目*/
/*删除提示*/
function deleteModal(id){
    informationAlert_confirmAndCancelButton("deleteBank("+id+")","是否需要删除该题目？");
}

/*删除*/
function deleteBank(id) {
    // 2、接口请求参数组装
    var msg = {};
    var list = new Array();
    list[0] = id;
    msg.ids = list;
    msg.appName="questionBank_deleteQuestionBank";

    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            areaTable.api().ajax.reload();
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功！");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}