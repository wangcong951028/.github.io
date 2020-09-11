/**
 * Created by ricardo on 2018-01-15.
 */
var areaTable;
var pageSize = 10;// ，每页显示个数
var pageNo = 1;// 页码
var totalPage = 0;// 总页数
var leaveId = 0;
var xgh = "";
var isShut;
var xghValidate;
var flag = true;//刷新页面显示模态框
var quickFlag = true;//快捷键
var isshuttle = 0;//是否接送

$(function(){
    queryUserBaseList();
	$("#submitFind").click(function(){
		refreshAreaTable();
	})
})
function refreshAreaTable(){
    areaTable.api().ajax.reload();
}

/**
 * 1、查询人员列表
 */

function queryUserBaseList() {
    //添加额外的参数传给服务器
    areaTable = $('#datatable').dataTable({
        "ajax": {
            "url": serverBaseUrl,
            "data": function (data) {
                data.appName = "leave_listLeaveCode";
                data.stuNo = $("#studentNo").val();
				data.stuName = $("#studentName").val();
				data.leaveTime = $("#leaveTime").val();
                //添加额外的参数传给服务器
                return buildRequestParam(data);
            },
            "dataSrc": function (json) {
                json.iTotalRecords = json.data.recordsTotal;
                json.recordsFiltered = json.data.recordsTotal;
                json.error = json.data.error;
                json.draw = json.data.draw;
                return json.data.data;
            },
            "beforeSend": function (xhr) {
                xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                xhr.setRequestHeader("token", sessionStorage.token);
            }
        },
        "columnDefs": [
            {
                "targets": 1,
                render: function (data, type, full, meta) {
                    return full.stuName;
                }
            },{
                "targets": 2,
                render: function (data, type, full, meta) {
                	if(full.sex == 1){
                		return "男";
                	}else{
                		return "女";
                	}
                }
            },{
                "targets": 3,
                render: function (data, type, full, meta) {
                    return full.stuNo;
                }
            
            },
            {
                "targets": 4,
                render: function (data, type, full, meta) {
                    return full.stuClass;
                }
            
            },
						{
								"targets": 5,
								render: function (data, type, full, meta) {
									return full.idCard;
								}
						
						},
            {
                "targets": 6,
                render: function (data, type, full, meta) {
                	if(full.joinDate!=null){
                		return "<a style='color:red;'>"+full.joinDate+"<a>";
                	}else{
                		return "";
                	}
                }
            
            },
            {
                "targets": 7,
                render: function (data, type, full, meta) {
                	if(full.leaveDate!=null){
                    	return "<a style='color:red;'>"+full.leaveDate+"<a>";
                	}else{
                		return "";
                	}
                }
            
            },
            {
                "targets": 8,
                render: function (data, type, full, meta) {
                    return full.leaveEndTime;
                }
            
            },
            {
                "targets": 9,
                render: function (data, type, full, meta) {
                    return full.leaveStartTime;
                }
            
            } ,
            {
                "targets": 10,
                render: function (data, type, full, meta) {
                    return full.leaveLastTime;
                }
            
            }
        ]
    });
}

/***
 * 显示模态框
 * @param {Object} modalID
 */
function showModal(modalID,afleaveID){
	$("#"+modalID).modal("show");
	leaveId = afleaveID;
	if('userDetail_div' == modalID){
		initUserDetailInfo(afleaveID);
	}
	if('userLeave_div'==modalID){
		initRelease(leaveId);
	}
}

/***
 * 关闭模态框
 * @param {Object} modalID
 */
function closeModal(modalID){
	$("#"+modalID).modal("hide");
}


/***
 * 刷新数据
 */
function closeBuildModal(modalID){
    $('#'+modalID).modal('hide');
    refreshAreaTable();
}

function closeBuildModalNotRefresh(modalID){
    $('#'+modalID).modal('hide');
}


// 样式 style="ime-mode:disabled" 禁止中文输入     
function noPermitInput(e){       
       var evt = window.event || e ;     
        if(isIE()){     
            evt.returnValue=false; //ie 禁止键盘输入     
        }else{     
            evt.preventDefault(); //fire fox 禁止键盘输入     
        }        
}
function isIE() {     
    if (window.navigator.userAgent.toLowerCase().indexOf("msie") >= 1)     
        return true;     
    else     
        return false;     
}      

