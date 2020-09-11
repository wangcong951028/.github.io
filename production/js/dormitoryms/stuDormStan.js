var areaTable;
var organizationCode;
var setting = {
    view:{showLine: false,dblClickExpand: false},
    data: {simpleData: {enable: true}},
    callback: {onRightClick: onRightClick,onClick: zLeftTreeOnClick}
};

$(function(){
	stuDormStanList();
	
	initDormTree();
})

/*列表*/
function stuDormStanList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.name = $("#stuName").val();
                    data.sex = $("#stuSex").val();
                    data.isSetted = $("#isStake").val();
                    data.xgh = $("#keyWord").val();
					data.deptId=organizationCode;

                    /*查询参数*/
                    data.appName = "StuDormStan_getAll";
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
                	"targets": 4,
                	render: function (data, type, full, meta) {
                		return full.sex==1?"男":"女";
                	}
                }, {
                    "targets": -1,
                    render: function (data, type, full, meta) {
                        return '<div>' +
                            '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.lodgeId + '"  onclick="updateModal(' + full.lodgeId + ')"><i class="fa fa-pencil">修改</i></button>' +
                            '</div>';
                    }
                }]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}


function updateModal(id){
	getRoomStan();
	$("#change_stats_del").val(id)
	$("#myModal_del").modal("show");
}


//查询宿舍标准类型
function getRoomStan(){
	var msg = {};
	msg.appName="rsm_findRSRoom";//
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
        	var html="<option value='-1'>----请选择----</option>";
            for(var i=0;i<success.data.data.length;i++){
            	html+="<option value='"+success.data.data[i].id+"'>"+success.data.data[i].name+"</option>";
            }
            $("#note_del").html(html);
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}


//确认修改
function updateConfirm(){
	var msg = {};
	msg.lodgeId=$("#change_stats_del").val();
	msg.roomStanId=$("#note_del").val();
	if(msg.roomStanId==-1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择住宿标准！");
		return;
	}
	msg.appName="StuDormStan_addOrUpdate";//
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
        	refresh();
        	$("#myModal_del").modal("hide");
        	informationAlert_OnlyConfirmButton_NOT_REFRESH("设置成功！");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function cleanModal(){
	$("#myModal_del").modal("hide");
}

/*进行刷新*/
function refresh(){
	areaTable.api().ajax.reload();
}

//寝室树形结构处理
function initDormTree(){
	var msg = {};
    msg.deptTypeID = 0;
    msg.appName="respondents_findDeptNode";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState === 200){
        	var node = success.data;
        	zNodes = node;
        	$.fn.zTree.init($("#tree"), setting, zNodes);
            zTree = $.fn.zTree.getZTreeObj("tree");
            rMenu = $("#rMenu");
            if (node != null){
                $("#dataLoadIng").css("display","none");
            }
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加或修改失败："+success.msg);
        }
    });
}

function zLeftTreeOnClick(event, treeId, treeNode) {
    organizationCode = treeNode.id;
    areaTable.api().ajax.reload();
}

function onRightClick(event, treeId, treeNode) {
    if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
    } else if (treeNode && !treeNode.noR) {
        zTree.selectNode(treeNode);
        showRMenu("node", event.clientX, event.clientY);
    }
}