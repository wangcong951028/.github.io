var role = 6;
var del_tecid = -1;

$(function(){
	apartList();
	
	//导出excel按钮   
    $("#export").click(function () {
        $("#datatable").table2excel({
            // 不被导出的表格行的CSS class类
            exclude: ".noExl",
            // 导出的Excel文档的名称，（没看到作用）
            name: "Excel Document Name",
            // Excel文件的名称
            filename: "公共区域管理"
        });
    });

    //打印按钮
    $("#print").click(function () {
    	if(datatable_paginate){
    		$("#datatable_paginate").hide();
    	}
    	
		$('tr').find('td:eq(4)').hide(); 
    	$('tr').find('th:eq(4)').hide();
    	if(datatable_info){
    		$("#datatable_info").hide();
    	}
    	
        $("#table").print();
        //显示分页栏
        if(datatable_paginate){
    		$("#datatable_paginate").show();
    	}
    	if(datatable_info){
    		$("#datatable_info").show();
    	}
      	$('tr').find('td:eq(4)').show(); 
    	$('tr').find('th:eq(4)').show();
    });
		// role = sessionStorage.role;
		if(role != 6){
			$('#mybutton2').attr({"disabled":"disabled"});
		}
})

/*列表*/
function apartList() {
    $(function () {
        //添加额外的参数传给服务器
        areaTable = $('#datatable').dataTable({
            "ajax": {
                "url": serverBaseUrl,
                "data": function (data) {
                    //添加额外的参数传给服务器
                    data.keyword = $("#keyWords").val();
                    /*查询参数*/
                    data.appName = "apart_findAparMang";
                    var paramJsonMsg = JSON.stringify(data);

                    //配置基本参数
                    data.param = paramJsonMsg;
                    data.appKey = "aGFuZHlDYW1wdXM=";
                    data.appSecret = "1234567890abcedefgh";
                    var time = new Date().getTime();
                    data.time = time;
                    var temp = 'appKey=aGFuZHlDYW1wdXM=&appSecret=1234567890abcedefgh&param=' +
                        paramJsonMsg + '&time=' + time;
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
            "columnDefs": [{
                "targets": 5,
                render: function (data, type, full, meta) {
                    var adname = "";
                    if (full.adname == null) {
                        adname = "";
                    } else {
                        adname = full.adname;
                    }
                    return '<span id="adnameitem" style="color:#73879C;cursor: pointer;" onmouseover="removein('+full.id+','+full.adid+',\''+full.subCampus+'\')" onmouseout="removeout()">' +
                        adname + '</span>';
                }
            }, {
                "targets": -1,
                render: function (data, type, full, meta) {
									var html = '';
										if(role != 6){
												html = '<div>' +
														'<button class="btn btn-success btn-xs" disabled="disabled" href="javascript:;"  data-key="' +
														full.id +
														'"  onclick="updateModal(' + full.id +
														')"><i class="fa fa-pencil">修改</i></button>' +
														'<button class="btn btn-danger btn-xs" disabled="disabled" href="javascript:;"  data-key="' +
														full.id +
														'"  onclick="deleteModal(' + full.id +
														')"><i class="fa fa-trash-o">删除</i></button>' +
														'<button class="btn btn-info btn-xs" disabled="disabled" href="javascript:;"  data-key="' +
														full.id + '"  onclick="ADModal(' + full.id +
														')"><i class="fa fa-pencil">设置管理员</i></button>' +
														'</div>';
										}else{
												if (full.adname == null) {
														html = '<div>' +
																'<button class="btn btn-success btn-xs"  href="javascript:;"  data-key="' +
																full.id +
																'"  onclick="updateModal(' + full.id +
																')"><i class="fa fa-pencil">修改</i></button>' +
																'<button class="btn btn-danger btn-xs" href="javascript:;"  data-key="' +
																full.id +
																'"  onclick="deleteModal(' + full.id +
																')"><i class="fa fa-trash-o">删除</i></button>' +
																'<button class="btn btn-info btn-xs" href="javascript:;"  data-key="' +
																full.id +
																'"  onclick="ADModal(' + full.id +
																')"><i class="fa fa-pencil">设置管理员</i></button>' +
																'</div>';
												} else {
														html = '<div>' +
																'<button class="btn btn-success btn-xs" href="javascript:;"  data-key="' +
																full.id +
																'"  onclick="updateModal(' + full.id +
																')"><i class="fa fa-pencil">修改</i></button>' +
																'<button class="btn btn-danger btn-xs" href="javascript:;"  data-key="' +
																full.id +
																'"  onclick="deleteModal(' + full.id +
																')"><i class="fa fa-trash-o">删除</i></button>' +
																'<button class="btn btn-info btn-xs" disabled="disabled" href="javascript:;"  data-key="' +
																full.id + '"  onclick="ADModal(' + full.id +
																')"><i class="fa fa-pencil">设置管理员</i></button>' +
																'</div>';
												}
										}
										return html;
                }
            }]

        });
        $("#myButton").click(function () {
            areaTable.api().ajax.reload();
        });
        find_cm();
    });
}

function cleanModal(){
	find_cm();
	document.getElementById('saveForm').reset();
}

function saveApart(stats){
	var msg = {};
    var name = $("#name").val()
    var sectionNumber = $("#sectionNumber").val();
    var areaAddress = $("#areaAddress").val();
    var subCampus = $("#subCampus").val().toString();
    if(name == ''){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("区域名称不能为空！");
    }else if(sectionNumber == ''){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("区域编号不能为空！");
    }else if(subCampus == -1){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("所属校区不能为空！");
    }else{
    	msg.name = name;
    	msg.sectionNumber = sectionNumber;
    	msg.areaAddress = areaAddress;
    	msg.subCampus = subCampus;
	    msg.appName="apart_saveAparMang";//
	    serverFromJSONData(msg,true).then(function (success) {
	        if(success.msgState == 200){
	            if(stats == 2){
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

/*修改：获取原有数据*/
function updateModal(id){
	var msg = {};
	msg.id = id;
	msg.appName="apart_findAparMangById";//
	    serverFromJSONData(msg,true).then(function (success) {
	        if(success.msgState == 200){
	        	
	        	var apart = success.data;
	        	$("#updateid").val(apart.id);
	        	$("#updatename").val(apart.name);
	        	$("#updatesectionNumber").val(apart.sectionNumber);
	        	$("#updateareaAddress").val(apart.areaAddress);
	        	$("#updatesubCampus").val(apart.subCampus);
	        	find_cm(""+apart.subCampus+"");
	            $('#updateModal').modal('show');
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
	        }
	    }),function (error) {
	        console.log("访问服务器发生错误，请稍后再试!",error);
	    };
}

function updateApart(){
	var msg = {};
	var id = $("#updateid").val();
	var name = $("#updatename").val();
	var sectionNumber = $("#updatesectionNumber").val();
	var areaAddress = $("#updateareaAddress").val();
	var subCampus = $("#updatesubCampus").val();
	if(name == ''){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("区域名称不能为空！");
    }else if(sectionNumber == ''){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("区域编号不能为空！");
    }else if(subCampus == -1){
    	informationAlert_OnlyConfirmButton_NOT_REFRESH("所属校区不能为空！");
    }else{
    	msg.id = id;
    	msg.name = name;
    	msg.sectionNumber = sectionNumber;
    	msg.areaAddress = areaAddress;
    	msg.subCampus = subCampus;
		msg.appName="apart_updateAparMang";//
		    serverFromJSONData(msg,true).then(function (success) {
		        if(success.msgState == 200){
		            $('#updateModal').modal('hide');
		            areaTable.api().ajax.reload();
		            cleanModal();
		            informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功");
		        }else{
		            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
		        }
		    }),function (error) {
		        console.log("访问服务器发生错误，请稍后再试!",error);
		    };
    }
}

function deleteModal(id){
	informationAlert_confirmAndCancelButton("delete_apart("+id+")","是否确认删除？");
}

function delete_apart(id){
	var msg = {};
	msg.id  = id
	msg.appName="apart_deleteAparMang";//
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            areaTable.api().ajax.reload();
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/*获取校区*/
function find_cm(deptid){
	var msg = {};
	msg.appName="cm_findCampusAll";//
    serverFromJSONData(msg,true).then(function (success) {
        var cm = success.data;
        html = '';
        for(var i=0;i<cm.length;i++){
        	if(deptid == cm[i].id){
        		html += '<option value="'+cm[i].id+'" selected="selected">'+cm[i].cmName+'</option>';
        	}else{
        		html += '<option value="'+cm[i].id+'">'+cm[i].cmName+'</option>';
        	}
        }
        $("#subCampus").html('<option value="-1">----- 请选择 -----</option>'+html);
        $("#updatesubCampus").html('<option value="-1">----- 请选择 -----</option>'+html);
		$("#ad_cm").html('<option value="-1">----- 请选择 -----</option>'+html);
		$("#uad_cm").html('<option value="-1">----- 请选择 -----</option>'+html);
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
		
}

//显示设置管理员模态框
function ADModal(id,adid){
//	findtecbycamp(adid);
	$("#apart_id").val(id);
	$("#ADModal").modal('show');
}

/*根据校区获取教师*/
function findtecbycamp(id,adid){
	var msg = {};
	msg.campid = id;
	msg.appName="cm_findTecByCamp";//
	serverFromJSONData(msg,true).then(function (success) {
		var tec = success.data;
		html = '';
		for(var i=0;i<tec.length;i++){
			if(adid == tec[i].teacherid){
					html += '<option value="'+tec[i].teacherid+'" selected="selected">'+tec[i].teachername+'</option>';
			}else{
					html += '<option value="'+tec[i].teacherid+'">'+tec[i].teachername+'</option>';
			}
		}
		$("#tec").html('<option value="-1">----- 请选择 -----</option>'+html);
		$("#utec").html('<option value="-1">----- 请选择 -----</option>'+html);
	}),function (error) {
		console.log("访问服务器发生错误，请稍后再试!",error);
	}; 
}

/*新增宿管*/
function saveDorm(){
	var dormid = $("#apart_id").val();
	var tecid = $("#tec").val();
	var msg = {};
	if(tecid == null || tecid == -1){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("教师不能为空");
		return;
	}
	msg.dormid = dormid;
	msg.teacherid = tecid;
	msg.appName="dorm_savetecDorm";//
	serverFromJSONData(msg,true).then(function (success) {
		if(success.msgState == 200){
			$('#ADModal').modal('hide');
			areaTable.api().ajax.reload();
			document.getElementById('ADModal_html').reset();
			informationAlert_OnlyConfirmButton_NOT_REFRESH("设置成功");
		}else{
			informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
		}
	}),function (error) {
		console.log("访问服务器发生错误，请稍后再试!",error);
	};
}

function removein(apartid,adid,subCampus){
	findtecbycamp(subCampus,adid);
	del_tecid = adid;
	getMousePos();
	if(role == 6){
			$("#uapart_id").val(apartid);
			$("#utec").val(adid);
			$("#uad_cm").val(subCampus);
			document.getElementById('show_div').style.display = 'block';
	}
}

function removeout(){
	// console.log(sessionStorage.role)
	// console.log("移除事件。。。。");
	// document.getElementById('show_div').style.display = 'none';
}

function getMousePos(event) {
      var e = event || window.event;
	  document.getElementById('show_div').style.position = 'fixed';
	  document.getElementById('show_div').style.left = 30+e.clientX+'px'
	  document.getElementById('show_div').style.top = e.clientY-15+'px'
}

//点击空白处隐藏隐藏
$('html').click(function(){
	 document.getElementById('show_div').style.display = 'none';
})

/*修改管理员*/
function U_dorme(){
	$("#UADModal").modal("show");
}

/*设置新管理员*/
function UDorm(){
		var dormid = $("#uapart_id").val();
		var tecid = $("#utec").val();
		var msg = {};
		if(tecid == null || tecid == -1){
				informationAlert_OnlyConfirmButton_NOT_REFRESH("教师不能为空");
				return;
		}
		msg.dormid = dormid;
		msg.teacherid = tecid;
		msg.appName="dorm_updateDorm";//
		serverFromJSONData(msg,true).then(function (success) {
				if(success.msgState == 200){
					$('#UADModal').modal('hide');
					areaTable.api().ajax.reload();
					document.getElementById('UADModal_html').reset();
					informationAlert_OnlyConfirmButton_NOT_REFRESH("修改成功");
				}else{
					informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
				}
		}),function (error) {
				console.log("访问服务器发生错误，请稍后再试!",error);
		};
}

/*删除宿舍管理员*/
function delete_dorm(){
		informationAlert_confirmAndCancelButton('d_dorm()','是否取消该管理员身份？');
}

/*删除管理员*/
function d_dorm(){
		var msg = {};
		var dormid = $("#uapart_id").val();
		var tecid = $("#utec").val();
		msg.dormid = dormid;
		msg.tecid = del_tecid;
		msg.appName="dorm_deletetecDorm";//
		serverFromJSONData(msg,true).then(function (success) {
				if(success.msgState == 200){
					del_tecid = -1;
					$('#UADModal').modal('hide');
					areaTable.api().ajax.reload();
					informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功");
				}else{
					informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
				}
		}),function (error) {
				console.log("访问服务器发生错误，请稍后再试!",error);
		};
}
