var areaTable;
var floorID;//寝室楼层id
var parentid;//宿舍楼id
var parentName;//宿舍楼名称
var d_movietheater_name;//宿舍楼名称
var floor_name;//楼层名称
var pId;//用于判断是修改楼层名称还是宿舍楼名称
var floor_pId;//用于添加寝室时判断是否是选择的楼层

var setting = {
    callback: {
        onClick: zTreeOnClick,
        onRightClick: saveFloor
    },
    data: {
        simpleData: {
            enable: true
        }
    }
}

$(function () {
    dormitoryList();
    getDormitoryZtree();
    getStudentZtree();
})
/*清理表单*/
function cleanModal(){
    document.getElementById("saveForm").reset();
    document.getElementById("saveForm2").reset();
    document.getElementById("saveForm3").reset();
}

function clearn_ztree(){
	var ztree_obj = $.fn.zTree.getZTreeObj('sub_name');
	ztree_obj.checkAllNodes(false);
}

/*列表*/
function dormitoryList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.id = floorID;
                    data.keyWords = $("#keyWords").val();
                    /*查询参数*/
                    data.appName = "dormitory_findDormitoryPC";
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
                        return '<div>' +
                            '<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="updateModal(' + full.pk_id + ')"><i class="fa fa-pencil">修改</i></button>' +
                            '<button class="btn btn-danger btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="deleteModal(' + full.pk_id + ')"><i class="fa fa-trash-o">删除</i></button>' +
                            '<button class="btn btn-info btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="saveModal(\''+full.d_name+'\',' + full.pk_id + ','+full.d_dornumber+')"><i class="fa fa-pencil">添加学生</i></button>' +
                            '<button class="btn btn-info btn-xs" href="javascript:;"  data-key="' + full.pk_id + '"  onclick="findSubByDor(\''+full.d_movietheater+'\',\''+full.d_floor+'\',\''+full.d_name+'\',' + full.pk_id + ')"><i class="glyphicon glyphicon-search">查看学生</i></button>' +
                            '</div>';
                    }
                }]
        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
    });
}

/*添加提示*/
function savePrompting() {
    if(floorID == null || floor_pId == null){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择宿舍和楼层！");
    }else{
        $('#myModal').modal('show');
    }
}
/*添加寝室*/
function saveDormitory(type){
    var msg = {};
    var dname = $("#dname").val()
    var dnumbering = $("#dnumbering").val();
    var dornumber = $("#dornumber").val();
    if(dname == "" || dname.length>20){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("名称不能为空，且不能超过20个字符！");
    }else if(dnumbering == "" || dnumbering.length>20){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("编号不能为空，且不能超过20个字符！");
    }else if(dornumber == '' || dornumber>15){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("寝室人数不能为空，且不能超过15人！");
    }else {
        msg.d_name = dname;
        msg.d_numbering = dnumbering;
        msg.d_dornumber = dornumber;
        msg.parentID=floorID;
        msg.d_movietheater=d_movietheater_name;
        msg.d_floor=floor_name;
        msg.appName="dormitory_saveDormitory";//
        serverFromJSONData(msg,true).then(function (success) {
            if(success.msgState == 200){
                if(type == 2){
                    $('#myModal').modal('hide');
                }
                cleanModal();
                areaTable.api().ajax.reload();
                informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功！");
            }else{
                informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
            }
        }),function (error) {
            console.log("访问服务器发生错误，请稍后再试!",error);
        };
    }
}

/*修改：获取数据*/
function updateModal(id){
    var msg = {};
    msg.id = id;
    msg.appName="dormitory_findDormitoryById";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            var dormitory = success.data;
           $("#updateID").val(dormitory.pk_id);
           $("#updatedname").val(dormitory.d_name);
           $("#updatednumbering").val(dormitory.d_numbering);
           $("#update_dornumber").val(dormitory.d_dornumber);
           $('#updateModal').modal('show');
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}
/*修改：添加新数据*/
function newDormitory(){
	var d_dornumber = $("#update_dornumber").val();
    var msg = {};
	if(d_dornumber == '' || d_dornumber>15){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("寝室人数不能为空，且不能超过15人！");
	}else{
	    msg.pk_id = $("#updateID").val();
	    msg.d_name = $("#updatedname").val();
	    msg.d_numbering = $("#updatednumbering").val();
	    msg.d_dornumber = d_dornumber;
	    msg.d_movietheater = d_movietheater_name;
	    msg.d_floor = floor_name;
	
	    msg.appName="dormitory_updateDormitory";
	
	    serverFromJSONData(msg,true).then(function (success) {
	        if(success.msgState == 200){
	            areaTable.api().ajax.reload();
	            informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功！");
	            $('#updateModal').modal('hide');
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
	        }
	    }),function (error) {
	        console.log("访问服务器发生错误，请稍后再试!",error);
	    };
    }
}

function getDormitoryZtree(){
    var msg = {};
    msg.status = 1;
    msg.appName="dormitory_getDormitoryZtree";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            var node = success.data;
            var zTreeObj;
            $(document).ready(function(){
                zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, node);
            });
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");

            var nodes = treeObj.getNodes();
            if (nodes.length>0) {
                for(var i=0;i<nodes.length;i++){
                    treeObj.expandNode(nodes[i], true, false, false);
                }
            }
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function zTreeOnClick(event, treeId, treeNode) {
	
	var parent_ztree =  treeNode.getParentNode()
	if(parent_ztree != null){
		d_movietheater_name = parent_ztree.name;
	}
	floor_pId = treeNode.pId;
    floor_name = treeNode.name;
    floorID = treeNode.id;
    areaTable.api().ajax.reload();
}

/*鼠标右键事件*/
function saveFloor(event, treeId, treeNode) {
    parentid = treeNode.id;
    pId = treeNode.pId;
    parentName = treeNode.name;
    /*点击右键出现弹框*/
    var a = getMousePos(event);
    document.getElementById("testDor").style.display = '';
    document.getElementById("testDor").style.left = 10+a.x+'px';
    document.getElementById("testDor").style.top = 5+a.y+'px';
    document.getElementById("hidesDor").style.display = 'none';
    if(treeNode.pId == null){
        document.getElementById("hidesDor").style.display = '';
    }
}
/*获取鼠标当前点击位置*/
function getMousePos(event) {
    var e = event || window.event;
    return {'x':e.clientX,'y':e.clientY};
}
/*添加宿舍楼*/
function saveDormitory2(type){
    var msg = {};
    var d_movietheater = $("#dmovietheater").val();
    if(d_movietheater == "" || d_movietheater.length>20){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("名称不能为空，且不能超过20个字符！");
    }else{
	    msg.d_movietheater = d_movietheater;
	    msg.appName="dormitory_saveDormitory";
	    serverFromJSONData(msg,true).then(function (success) {
	        if(success.msgState == 200){
	            if(type == 2){
	                $('#myModal2').modal('hide');
	            }
	            cleanModal();
	            getDormitoryZtree();
	            areaTable.api().ajax.reload();
	            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功！");
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
	        }
	    }),function (error) {
	        console.log("访问服务器发生错误，请稍后再试!",error);
	    };
    }
}

/*添加楼层*/
function saveTreeNode() {
    $('#myModal3').modal('show');
}
function saveDormitory3(type){
    var msg = {};
    var d_floor = $("#dfloor").val();
	if(d_floor == "" || d_floor.length>20){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("名称不能为空，且不能超过20个字符！");
	}else{
		msg.parentID=parentid;
	    msg.d_movietheater = parentName;
	    msg.d_floor = d_floor;
	    msg.appName="dormitory_saveDormitory";
	    serverFromJSONData(msg,true).then(function (success) {
	        if(success.msgState == 200){
	            if(type == 2){
	                $('#myModal3').modal('hide');
	            }
	            cleanModal();
	            getDormitoryZtree();
	            areaTable.api().ajax.reload();
	            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功！");
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
	        }
	    }),function (error) {
	        console.log("访问服务器发生错误，请稍后再试!",error);
	    };
    }
}

//----------------------------------------------------------------------------------------------------------------------
/*点击空白处弹框消失*/
$(function($) {
    $("html").click( function() {
        document.getElementById("testDor").style.display = 'none';
    });
});

/*判断修改楼层还是宿舍楼*/
function updateTreeNode() {
    if(pId == null){
        updateMovietheater(parentid);
    }else{
        updateFloor(parentid);
    }
}

/*修改楼层：获取数据*/
function updateFloor(id) {
    var msg = {};
    msg.id = id;
    msg.appName="dormitory_findDormitoryById";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            var dormitory = success.data;
            $("#floorID").val(dormitory.pk_id);
            $("#updatedfloor").val(dormitory.d_floor);
            $('#updateModal3').modal('show');
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/*修改楼层：添加新数据*/
function newFloor() {
    var msg = {};
    msg.pk_id = $("#floorID").val();
    msg.d_floor = $("#updatedfloor").val();
    msg.d_movietheater = parentName;

    msg.appName="dormitory_updateDormitory";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
        	getDormitoryZtree();
            areaTable.api().ajax.reload();
            informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功！");
            $('#updateModal3').modal('hide');
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/*修改宿舍楼：获取数据*/
function updateMovietheater(id) {
    var msg = {};
    msg.id = id;
    msg.appName="dormitory_findDormitoryById";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            var dormitory = success.data;
            $("#theaterID").val(dormitory.pk_id);
            $("#updatedmovietheater").val(dormitory.d_movietheater);
            $('#updateModal2').modal('show');
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/*修改宿舍楼：添加新数据*/
function newMovietheater() {
    var msg = {};
    msg.pk_id = $("#theaterID").val();
    msg.d_movietheater = $("#updatedmovietheater").val();

    msg.appName="dormitory_updateDormitory";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            areaTable.api().ajax.reload();
            getDormitoryZtree();
            informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功！");
            $('#updateModal2').modal('hide');
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/*删除提示*/
function deleteModal(id) {
    if(id == undefined){
        informationAlert_confirmAndCancelButton("deleteDormitory("+parentid+")","删除会同时删除寝室学生信息，是否确认删除？");
    }else{
        informationAlert_confirmAndCancelButton("deleteDormitory("+id+")","删除会同时删除寝室学生信息，是否确认删除？");
    }

}
/*删除*/
function deleteDormitory(id) {
    var msg = {};
    msg.id = id;
    msg.appName="dormitory_deleteDormitory";
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            getDormitoryZtree();
            areaTable.api().ajax.reload();
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功！");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

//----------------------------------------------------------------------------------------------------

/*绑定寝室与学生关系*/
function saveModal(dorName,dorid,dornumb){
	$("#dor_name").html(dorName);
	$("#dor_id").val(dorid);
	if(dornumb == null){
		dornumb = '0'
	}
	$("#dor_number").html(dornumb+"/人");
	$("#subdor_modal").modal("show");
}
function saveSubDor(){
	
	//寝室可入住总人数
	var occupancy_rate = $("#dor_number").html();
	var occupancy_rate_2 = occupancy_rate.substring(0,occupancy_rate.indexOf('/'));
	
	var dor_id = $("#dor_id").val();
	var subObject = $.fn.zTree.getZTreeObj("sub_name");
	var nodes = subObject.getCheckedNodes(true);
	//寝室现有人数
	var sub_dor_number_list =  findSubNumberByDor(dor_id);
	var dor_now_subnumber = sub_dor_number_list.length;
	var msg = {};
	if(nodes.length==0){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择学生！");
	}else{
		
		//对新增学生的性别进行判断
		var sex = determine_gender_new(nodes);
		//把新增学生的性别与寝室原有学生的性别进行判断
		var sub_sex = determine_gender_old(sex,sub_dor_number_list);
		
		var list = new Array();
		for(var i=0;i<nodes.length;i++){
			var subDor = new Object();
			subDor.studentid = nodes[i].id;
			subDor.studentName = nodes[i].name;
			list.push(subDor);
		}
		
		/*判断入住人数是否超过入住寝室入住人数上线*/
		var all_number = dor_now_subnumber+list.length;//新增和寝室原有总人数
		var occupancy_rate_3 = parseInt(occupancy_rate_2);//寝室课入住人数
		if(all_number>occupancy_rate_3){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("人数超过寝室可入住人数上限！");
		}else if(sex == -1){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("请勿男、女学生混合添加！");
		}else if(sub_sex != ''){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("该寝室已有"+sub_sex+"生入住！");
		}else{
			msg.dormitoryid = dor_id;
			msg.studentidList = list;
		    msg.appName="dormitory_saveSubDor";//
		    serverFromJSONData(msg,true).then(function (success) {
		        if(success.msgState == 200){
	                $('#subdor_modal').modal('hide');
		            getStudentZtree();
		            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加成功！");
		        }else{
		            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
		        }
		        clearn_ztree();
		    }),function (error) {
		        console.log("访问服务器发生错误，请稍后再试!",error);
		    };
	    }
    }
	
}

/*根据寝室现有学生人数*/
function findSubNumberByDor(dorid){
	var sub_dor_number_list = Array();
	var msg = {};
	msg.id=dorid;
    msg.appName = "dormitory_findStudentByDorId";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
        	if(success.msgState == 200){
        		var sublist = success.data;
    			sub_dor_number_list = sublist;
        	}else{
        		informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        	}
	    },
	        beforeSend: function(xhr) {
	            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
	            xhr.setRequestHeader("token", static_token);
	        }
	    });
	    return sub_dor_number_list;
}

//对新增学生的性别进行判断
function determine_gender_new(nodes){
	var sex_list = new Array();
	for(var k=0;k<nodes.length;k++){
		var name = nodes[k].name;
		var sex = name.substring(name.indexOf('(')+1,name.indexOf(')'));
		sex_list.push(sex);
	}
	if(sex_list.indexOf('男')<0){
		return 2;
	}
	if(sex_list.indexOf('女')<0){
		return 1;
	}
	if(sex_list.indexOf('女')>=0 && sex_list.indexOf('男')>=0){
		return -1;
	}
	
}

//把新增学生与寝室原有学生的性别进行对比
function determine_gender_old(sub_sex,list){
	var sex_list = new Array();
	if(list.length==0){
		return '';
	}else{
		for(var n=0;n<list.length;n++){
			var sex_ = list[n].sex;
			sex_list.push(sex_);
		}
	}
	
	var sex_index = sex_list.indexOf(sub_sex);
	if(sex_index>=0){
		return '';
	}else{
		if(sub_sex == 1){
			return '女';
		}else{
			return '男';
		}
	}
}

//---------------------------------------------------------------------------------------------

var jsonObj;
/*导入*/
function upload_SubDor(){
	var msg = {};
	var sub_dor_item = new Array();
	if(jsonObj.length>0){
		for(var i=0;i<jsonObj.length;i++){
			var sub_dor_obj = new Object();
			sub_dor_obj.studentName = jsonObj[i].姓名;
			sub_dor_obj.studentCode = jsonObj[i].学号;
			sub_dor_obj.movietheater = jsonObj[i].公寓名称;
			sub_dor_obj.floor = jsonObj[i].楼层;
			sub_dor_obj.dorname = jsonObj[i].寝室名称;
			sub_dor_item.push(sub_dor_obj);
		}
	}
	var error_sub_dor_msg = $(".fileerrorTip1").html();
	if("您未上传文件，或者您上传文件类型有误！" == error_sub_dor_msg || sub_dor_item.length==0){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择需要导入的Excel文件！");
	}else{
		$("#butt").attr({"disabled":"disabled"});
		msg.studentidList = sub_dor_item;
	    msg.appName="dormitory_uploadSubDor";
	    serverFromJSONData(msg,true).then(function (success) {
	        if(success.msgState == 200){
	        	var download_json = success.data;
	        	if(download_json == 0){
	            	informationAlert_OnlyConfirmButton_NOT_REFRESH("导入成功！");
	        	}else{
	        		var error_json = [];
	        		for(var j=0;j<download_json.length;j++){
	        			error_json[j] = {
	        				"姓名":download_json[j].studentName,
	        				"学号":download_json[j].studentCode,
	        				"公寓名称":download_json[j].movietheater,
	        				"楼层":download_json[j].floor,
	        				"寝室名称":download_json[j].dorname,
	        				"备注":download_json[j].note
	        			};
	        		}
	        		downloadExl(error_json,"hf_sub_dor",true);
	        		informationAlert_OnlyConfirmButton_NOT_REFRESH("有错误数据请查看！");
	        	}
                
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
	        }
	        $("#butt").removeAttr("disabled");
	        clean_file();
	        $('#sub_dor_upload').modal('hide');
	    }),function (error) {
	        console.log("访问服务器发生错误，请稍后再试!",error);
	    };
    } 
}

function clean_file(){
	var file = $('#upload_sub_dor');
	file.after(file.clone().val("")); 
	file.remove(); 
	var file2 = $('#upload_sub_dor');
	importf(file2); 
	document.getElementById("download_type").style.display="";
	$(".showFileName1").html('');
	$(".fileerrorTip1").html('');
}

/*下载模板文件*/
function download_template(){
	var templetJSON = [
        {
            "姓名":"蔡文姬",
            "学号":"09924",
            "公寓名称":"一号公寓",
            "楼层":"一层",
            "寝室名称":"1-1-1"
        }
    ];
    downloadExl(templetJSON,"sub_dor_template");
}

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
/*获取学生数据*/
function getStudentZtree(){
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
        if(success.msgState == 200){
            var node = success.data;
            var zTreeObj;
            var setting = {
            check: {
                enable: true,
                chkboxType: { 
	            	"Y" : "s",
	            	"N" : "ps"
	            	}
            },
            data: {
                simpleData: {
                    enable: true
                }
            }
        };
            $(document).ready(function(){
                zTreeObj = $.fn.zTree.init($("#sub_name"), setting, node);
            });
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
}
var dor_m_name_1;
var dor_f_name_1;
var dor_name_1;
var dorid_1;
/*根据寝室获取学生数据*/
function findSubByDor(dor_m_name,dor_f_name,dor_name,dorid){
	
	dor_m_name_1 = dor_m_name;
	dor_f_name_1 = dor_f_name;
	dor_name_1 = dor_name;
	dorid_1 = dorid;
	
	$("#dor_d_name").html(dor_m_name_1);
	$("#dor_f_name").html(dor_f_name_1);
	$("#dor_n_name").html(dor_name_1);
	var msg = {};
	msg.id=dorid;
    msg.appName = "dormitory_findStudentByDorId";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:true,
        success: function (success) {
        	if(success.msgState == 200){
        		var subHtml = '';
        		var sublist = success.data;
        		if(sublist.length>0){
        			for(var i=0;i<sublist.length;i++){
        				var sub_name_sex = '';
        				if(sublist[i].s_sex == 1){
        					sub_name_sex = sublist[i].studentName+"(男)"
        				}else if(sublist[i].s_sex == 2){
        					sub_name_sex = sublist[i].studentName+"(女)"
        				}
        				subHtml += '<div class="form-group">'+
	                               '<label class="control-label col-md-2 col-sm-3 col-xs-12">学生姓名<span class="required">:</span></label>'+
                            	   '<label class="control-label col-md-2 col-sm-3 col-xs-12" style="text-align: -webkit-left;">'+sub_name_sex+'</label>'+
                            	   '<label class="control-label col-md-2 col-sm-3 col-xs-12">班级名称<span class="required">:</span></label>'+
                            	   '<label class="control-label col-md-4 col-sm-3 col-xs-12" style="text-align: -webkit-left;">'+sublist[i].deptName+'</label>'+
                        		   '<label class="control-label col-md-2 col-sm-3 col-xs-12" style="text-align: -webkit-left; color:red" onclick="delete_sub_prompt('+sublist[i].studentId+')">删除</label>'+
                        		   '</div>';
        			}
        		}
          		$("#subItem").html(subHtml);
        	}else{
        		informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        	}
        	$("#find_sub_dor").modal("show");
	    },
	        beforeSend: function(xhr) {
	            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
	            xhr.setRequestHeader("token", static_token);
	        }
	    });
}
//删除提示
function delete_sub_prompt(sub_id){
	informationAlert_confirmAndCancelButton('delete_sub('+sub_id+')','是否把该学生从该寝室删除？');
}
function delete_sub(id){
	var msg = {};
	msg.id=id;
    msg.appName = "dormitory_deleteSubDorBySubId";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:true,
        success: function (success) {
        	if(success.msgState == 200){
        		informationAlert_OnlyConfirmButton_NOT_REFRESH('删除成功!');
        	}else{
        		informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        	}
        	findSubByDor(dor_m_name_1,dor_f_name_1,dor_name_1,dorid_1);
	    },
	        beforeSend: function(xhr) {
	            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
	            xhr.setRequestHeader("token", static_token);
	        }
	    });
}

