/**
 * Created by ricardo on 2017-08-21.
 */
var areaTable;
var xgh = "";// 临时学工号
var realName = "";// 临时真实姓名
var organizationCode = "";// 临时组织机构编码
var zTree;// 树形结构对象
var rMenu;
var zNodes;
var sex = 1;// 全局性别字段
var identity = 1;// 全局身份类别字段，通过点击选择来进行修改当前的默认值
var s_status = 1;//全局学生状态字段
var s_is_nonresident = 1;//全局是否住校状态字段
var addCount = 1;
var organizationNameList = "";
var curUserId;//当前操作的用户id
var globalIndex = 1;// 全局序号
var idType = 0;// 临时身份证件类型
var cityCode = "";// 城市代码
var proviceCode = "";//省份代码
var uploadImgBase64;// 临时图片的base64图片
var mz = "汉族";// 默认民族
var level = 0;//全局树等级
var isShow =0;
var setting = {
    view:{showLine: false,dblClickExpand: false},
    data: {simpleData: {enable: true}},
    callback: {onRightClick: onRightClick,onClick: zLeftTreeOnClick}
};

/**
 *  页面初始化
 */
$(function () {

    $("#wrapper").hide();

    /*** 取消组织架构设置每页显示的个数 ***/
    $("#datatable_length").css("display","none");

    /*** 页面加载时，隐藏增加用户的与孩子相关的信息框 ***/
    $("#parentChildName").hide();
    $("#parentChildXgh").hide();
    $("#parentChildRelation").hide();

    $("#a_jg_div").hide();
    $("#a_address_div").hide();

    /** 1、获取学校组织架构树形结构 **/
    initTree();

    /**增加单个人员的出生日期设置 **/
    $('#birthday').datetimepicker({
        format: 'YYYY-MM-DD'//设置时间格式
    });
    /**修改单个人员的出生日期设置 **/
    $('#u_birthday').datetimepicker({
        format: 'YYYY-MM-DD'//设置时间格式
    });

    /** 2、获取人员基础数据 **/
    var param = {};
    param.appName = "user_listUserData";
    queryUserBaseList(param);

    /** 3、点击搜索按钮**/
    $("#searchUserList").on("click",function(){
        xgh = $("#xgh").val();
        realName = $("#realName").val();
				if($('#isShow').is(':checked')){
					isShow = 1;
				}else{
					isShow = 0;
				}
        areaTable.api().ajax.reload();
   });

    /*** 4、文本框内容改变事件 ***/
    $("#files").live('change', function(){
        var fill = document.getElementById('fill');
        fill.style.width = 0;
        $("#wrapper").hide();
        $("#displayFileName").html(getFileName($("#files").val()));
    });

    /*** 5、增加用户：监听用户身份类型选择 ***/
    $(".identity").change(function() {
        addUserDivInit($(this).val());
    });

    /*** 6、增加用户：身份类别下拉点击事件 ***/
    $("#a_citeClick").on("click",function (event) {
        /******* 1、阻止事件冒泡 *********/
        event.stopPropagation();

        var ul = $("#a_divselect_ul");
        if(ul.css("display")=="none"){
            ul.slideDown("fast");
        }else{
            ul.slideUp("fast");
        }

        var a_divselect_ul = $(this).siblings('#a_divselect_ul');

        $(document).bind("click",function(e){//点击空白处，设置的弹框消失
            var target = $(e.target);
            if(target.closest(a_divselect_ul).length == 0){
                $(a_divselect_ul).hide();
            }
        });
    });
    

    /*** 7、增加用户：下拉列表的选项点击事件处理 ***/
    $("#a_divselect_ul li a").click(function(){
        var txt = $(this).text();
        $("#a_citeClick").html(txt);
        idType = $(this).attr("selectid");
        $("#a_divselect_ul").hide();
        $("#a_citeClick").css("color","black");
    });
    
   

    /*** 8、修改用户：证件类别下拉点击事件 ***/
    $("#u_citeClick").on("click",function (event) {
        /******* 1、阻止事件冒泡 *********/
        event.stopPropagation();

        var ul = $("#u_divselect_ul");
        if(ul.css("display")=="none"){
            ul.slideDown("fast");
        }else{
            ul.slideUp("fast");
        }

        var u_divselect_ul = $(this).siblings('#u_divselect_ul');

        $(document).bind("click",function(e){//点击空白处，设置的弹框消失
            var target = $(e.target);
            if(target.closest(u_divselect_ul).length == 0){
                $(u_divselect_ul).hide();
            }
        });
    });

    /*** 9、修改用户：下拉列表的选项点击事件处理 ***/
    $("#u_divselect_ul li a").click(function(){
        var txt = $(this).text();
        $("#u_citeClick").html(txt);
        idType = $(this).attr("selectid");
        $("#u_divselect_ul").hide();
        $("#u_citeClick").css("color","black");
    });

    /*** 10、省份选中事件***/
    $('#a_prov').change(function () {
        proviceCode = $("#a_prov").val();
        cityCode = "0";
        console.log("省份："+proviceCode);
        getCityList(proviceCode);
    });

    /*** 11、城市选中事件***/
    $('#a_city').change(function () {
        cityCode = $("#a_city").val();
        console.log("城市："+cityCode);
    });

    /*** 12、省份选中事件***/
    $('#u_prov').change(function () {
        proviceCode = $("#u_prov").val();
        cityCode = "0";
        getuProviceList();
    });

    /*** 13、城市选中事件***/
    $('#u_city').change(function () {
        cityCode = $("#u_city").val();
    });

    /*** 14、图片改变事件 ***/
    $("#userHeadFile").live('change', function(){
        /*** 验证图片的格式是否正确 ***/
        if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test($(this).val())){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("图片只能是gif，jpeg，jpg，png中的任意一种，请重新上传!");
            return false;
        }
        /*** 上传大小限制 ***/
        var file_size = 0;
        if ( $.browser.msie && !this.files ) {
            var file_path = this.value;
            var file_system = new ActiveXObject("Scripting.FileSystemObject");
            var file = file_system.GetFile (file_path);
            file_size = file.Size;
        } else {
            file_size = this.files[0].size;
        }
        var size = file_size/1024/1024;
        if(size > 5){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("上传的文件大小不能超过5M!");
            return false;
        }

        /*** 将上传的图片反编码为base64字符串 ***/
        var oFReader = new FileReader();
        oFReader.readAsDataURL(this.files[0]);
        oFReader.onload = function (oFREvent) {
            uploadImgBase64 = oFREvent.target.result;
        };

        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            $("#userHeadImg").attr("src", objUrl); //将图片路径存入src中，显示出图片
        }
    });

    /*** 15、图标改变事件 ***/
    $("#a_userHeadFile").live('change', function(){
        /*** 验证图片的格式是否正确 ***/
        if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test($(this).val())){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("图片只能是gif，jpeg，jpg，png中的任意一种，请重新上传!");
            return false;
        }
        /*** 上传大小限制 ***/
        var file_size = 0;
        if ( $.browser.msie && !this.files ) {
            var file_path = this.value;
            var file_system = new ActiveXObject("Scripting.FileSystemObject");
            var file = file_system.GetFile (file_path);
            file_size = file.Size;
        } else {
            file_size = this.files[0].size;
        }
        var size = file_size/1024/1024;
        if(size > 5){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("上传的文件大小不能超过5M!");
            return false;
        }

        /*** 将上传的图片反编码为base64字符串 ***/
        var oFReader = new FileReader();
        oFReader.readAsDataURL(this.files[0]);
        oFReader.onload = function (oFREvent) {
            uploadImgBase64 = oFREvent.target.result;
        };

        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            $("#a_userHeadImg").attr("src", objUrl); //将图片路径存入src中，显示出图片
        }
    });

    /*** 16、民族选择***/
    $('#a_mz').change(function () {
        mz = $("#a_mz").val();
    });
    $('#u_mz').change(function () {
        mz = $("#u_mz").val();
    });
});

/**
 * 1、刷新table
 */
function refreshAreaTable(){
    areaTable.api().ajax.reload();
}

/**
 * 2、获取文件名称
 * @param o
 * @returns {string}
 */
function getFileName(o){
    var pos=o.lastIndexOf("\\");
    return o.substring(pos+1);
}

/**
 * 3、初始化列表
 */
function queryUserBaseList() {
    //添加额外的参数传给服务器
    areaTable = $('#datatable').dataTable({
        "ajax": {
            "url": serverBaseUrl,
            "data": function (data) {
                data.appName = "user_listUserData";
                data.xgh = xgh;
                data.realName = realName;
								data.isShow = isShow;
                data.departID = organizationCode;
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
                "targets": 3,
                render: function (data, type, full, meta) {
                    if(full.sex == 1){
                        return "男";
                    }else{
                        return "女";
                    }
                }
            },{
                "targets": 4,
                render: function (data, type, full, meta) {
                    if(full.identity == 1){
                        return "教师";
                    }else if(full.identity == 2){
                        return "家长";
                    }else if(full.identity == 3){
                        return "学生";
                    }else{
                        return "未知";
                    }
                }
            },{
                "targets": 6,
                render: function (data, type, full, meta) {
                   var resultDepart = "";
                   if(!checkValueIsNull(full.departName)){
                       var departList = full.departName.split(',');
                       $.each(departList,function(i,n) {
                            resultDepart += '<span class="departListName">'+n+'</span>';
                       });
                   }else{
                       resultDepart = "-";
                   }
                    return resultDepart;
                }
            },{
                "targets": 7,
                render: function (data, type, full, meta) {
                	var account = new String();
                	account="7"+full.xgh;
                	var html="<a class='bbtn btn btn-info btn-xs' id='updateUser' onclick='updateUserDiv("+full.userID+")' data-toggle='modal'><i class='fa fa-pencil'></i>详情</a>" +
                           "<a class='bbtn btn btn-warning btn-xs' id='resetPass' onclick='resetPass(\""+account+"\","+full.userID+","+full.schoolID+")' data-toggle='modal'><i class='fa fa-repeat'></i>重置密码</a>";
                    //判断学生在校状态
                    if(full.identity==3){
                    	if(full.s_status==1){
                    		html+="<span class='btn btn-xs btn-success'>在校</span>";
                    	}
                    	if(full.s_status==2){
                    		html+="<span class='btn btn-xs btn-danger'>离校</span>";
                    	}
                    	if(full.s_status==3){
                    		html+="<span class='btn btn-xs btn-primary'>休学</span>";
                    	}
                    	if(full.s_is_nonresident==1){
                    		html+="<span class='nonresident' >（走读生）</span>";
                    	}
                    	if(full.s_is_nonresident==0){
                    		html+="<span class='resident' >（住校生）</span>";
                    	}
                    }
                	return html;
                	
                	
//              	if(account=="7006550"){
                		
//              	}else{
//              		return "<a class='btn btn-info btn-xs' id='updateUser' onclick='updateUserDiv("+full.userID+")' data-toggle='modal'><i class='fa fa-pencil'></i>详情</a>" +
//              		       "<a class='btn btn-warning btn-xs' id='resetPass' onclick='resetPass("+account+","+full.userID+","+full.schoolID+")' data-toggle='modal'><i class='fa fa-repeat'></i>重置密码</a>"+
//              		       "<a class='btn btn-danger btn-xs' id='delUser' onclick='delUserDiv("+full.userID+","+full.identity+")'><i class='fa fa-trash-o'></i>删除</a>";
//              	}
                }
            }
        ]
    });
}




/**
 * 4、树形架构___节点点击事件
 * @param event
 * @param treeId
 * @param treeNode
 */
function zLeftTreeOnClick(event, treeId, treeNode) {
    organizationCode = treeNode.id;
		if($('#isShow').is(':checked')){
			isShow = 1;
		}else{
			isShow = 0;
		}
    areaTable.api().ajax.reload();
}


/** 5、树形架构____右键点击事件 **/
function onRightClick(event, treeId, treeNode) {
    if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
      /*zTree.cancelSelectedNode();
        showRMenu("root", event.clientX, event.clientY);
       */
    } else if (treeNode && !treeNode.noR) {
        zTree.selectNode(treeNode);
				level = treeNode.level;
        showRMenu("node", event.clientX, event.clientY,treeNode.level);
    }
}

/** 6、显示菜单 **/
function showRMenu(type, x, y,level) {
		var dd=window.location.hostname;
		if (level==0 && "djyzx.czxypt.com"!=window.location.hostname) {//第一级：学校
			$("#addDepart").html("新增校区");
			$("#updateDepart").html("修改学校");
			$("#delDepart").hide();
			$("#exportUserByDepart").hide();
			
		} else if (level==1) {//第二级：校区
			$("#addDepart").html("新增部门");
			$("#updateDepart").html("修改校区");
			$("#delDepart").show();
			$("#delDepart").html("删除校区");
			$("#exportUserByDepart").hide();
		
		} else if(level==2){//第三级：部门
			$("#addDepart").html("新增部门");	
			$("#updateDepart").html("修改部门");
			$("#delDepart").show();
			$("#delDepart").html("删除部门");
			$("#exportUserByDepart").show();
		} else{
			$("#addDepart").html("新增部门");	
			$("#updateDepart").html("修改部门");
			$("#delDepart").show();
			$("#delDepart").html("删除部门");
			$("#exportUserByDepart").show();
		}
		
    $("#rMenu ul").show();
    if (type=="root") {
        $("#m_del").hide();
    } else {
        $("#m_del").show();
    }
    rMenu.css({"top":y+"px", "left":x+"px", "visibility":"visible"});

    $("body").bind("mousedown", onBodyMouseDown);
}

/*** 7、隐藏菜单 ***/
function hideRMenu() {
    if (rMenu) rMenu.css({"visibility": "hidden"});
    $("body").unbind("mousedown", onBodyMouseDown);
}

/*** 8、鼠标右键按下事件 ***/
function onBodyMouseDown(event){
    if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length>0)) {
        rMenu.css({"visibility" : "hidden"});
    }
}

/** 9、增加部门_弹出div **/
function addTreeNode() {
    hideRMenu();
    /** 弹出模态框，清空上次增加的文字信息 **/
    $("#departName").val('');
		if(level==0){
			$("#addDepart_h4").html("添加校区");
			$("#depatName_label").html("校区名称");
			$("#departType_div").hide();
			$("#div_tip").hide();
		}else {
			$("#addDepart_h4").html("添加部门");
			$("#depatName_label").html("部门名称");
			$("#departType_div").show();
			$("#div_tip").show();
		}
    $("#addDepart").attr("data-target","#addDepart_div");
}

/** 10、修改部门_弹出div **/
function updateTreeNode() {
    hideRMenu();
    /** 弹出模态框 **/
    var nodes = zTree.getSelectedNodes();
    $("#newDepartName").val(nodes[0].name);
    $(":radio[name='udepartType'][value='" + nodes[0].type + "']").prop("checked", "checked");
		if(level==0){
			$("#updateDepart_h4").html("修改学校");
			$("#udepatName_label").html("学校名称");
			$("#udepartType_div").hide();
		}else if(level==1){
			$("#updateDepart_h4").html("修改校区");
			$("#udepatName_label").html("校区名称");
			$("#udepartType_div").hide();
			$("#div_tip").hide();
		}else{
			$("#updateDepart_h4").html("修改部门");
			$("#udepatName_label").html("部门名称");
			$("#udepartType_div").show();
		}
    $("#updateDepart").attr("data-target","#updateDepart_div");
}

/** 11、删除部门 **/
function removeTreeNode() {
    hideRMenu();
    var nodes = zTree.getSelectedNodes();
    if (nodes && nodes.length>0) {
        $("#delDepart").attr("data-target","#delDepart_div");
    }
}

/**
 * 12、弹出按部门导出人员数据弹出框
 */
function exportUserByDepartNode(){
    hideRMenu();
    var nodes = zTree.getSelectedNodes();
    if (nodes && nodes.length>0) {
        $("#exportDepartName").text(nodes[0].name);
        $("#exportUserByDepart").attr("data-target","#exportUserByDepart_div");
    }
}

/**
 *  12、按部门导出人员数据
 */
function exportUserByDepart(){
    var node = $.fn.zTree.getZTreeObj("tree").getSelectedNodes();
    var nodeID =node[0].id;// 部门id
    var identity = $("input[name='identity']:checked").val();
    if(checkValueIsNull(nodeID)){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择您要操作的部门或者班级!");
        return;
    }

    if(checkValueIsNull(identity)){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("人员类别栏未选择，请重新选择!");
        return;
    }

    var param = {};
    param.appName = "user_exportUserData";
    param.userType = identity;
    param.departID = nodeID;
    serverFromJSONData(param,true).then(function (response) {
        if(response.msgState == 200){
            var result = response.data;
            if (checkValueIsNull(result)){
                informationAlert_OnlyConfirmButton_NOT_REFRESH('没有符合条件的数据下载，请变更条件再试!');
            }else {
                var userJson = new Array();
                for (var i = 0; i < result.length; i++) {
                    /*** 1、性别判断 ***/
                    var sex = "";
                    if(result[i].sex == 1){sex = "男";
                    }else if (result[i].sex == 2){sex = "女";
                    }else{sex = "未知";}
                    /*** 2、证件类型判断 ***/
                    var idType = "";
                    if(result[i].idType == 1){idType = "身份证";
                    }else if(result[i].idType == 2){idType = "护照";
                    }else if(result[i].idType == 3){idType = "军人证";
                    }else if(result[i].idType == 4){idType = "驾驶证";
                    }else if(result[i].idType == 5){idType = "教师证";
                    }else {idType = "未知证件类型"}
                    /*** 3、用户身份判断 ***/
                    var identity = "";
                    if(result[i].identity == 1){identity = "教师";
                    }else if(result[i].identity == 2){identity = "家长";
                    }else if(result[i].identity == 3){identity = "学生";
                    }else {identity = "未知身份";}
                    /*var userGroup = '';
                    $.each(result[i].groupList, function (index, item) {
                        userGroup += item.groupName+'';
                    })*/
                    var depName = '';
                    $.each(result[i].organizaList, function (index, item) {
                        depName += item.organizationName+'';
                    })

                    userJson[i] = {"学工号": result[i].xgh,
                                   "姓名": result[i].realName,
                                   "身份": identity,
                                   "所属部门(班级)" :depName,
                                   "手机号": result[i].mobile,
                                   /*"邮箱": result[i].email,*/
                                   "性别": sex,
                                   "籍贯": result[i].jg,
                                   "民族": result[i].mz,
                                   /*"政治面貌": result[i].zzmm,*/
                                   "证件类型": idType,
                                   "证件号码": result[i].idNumber,
                                   "出生日期": result[i].birthday
                    };
                }
                downloadExl_onlyJson(userJson);
            }
        }else {
            informationAlert_OnlyConfirmButton_NOT_REFRESH('导出失败！原因：' + response.msg);
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH('访问服务器发生错误！' + error);
    };
}

/** 12、导入人员信息 **/
function exportUser(){
    /***隐藏***/
    $("#wrapper").hide();
    $("#displayFileName").html("");
    $("#exportUser").attr("data-target","#exportUser_div");
}

/** 13、增加单个人员弹出div **/
function addUserDiv(){
    /*** 清除现场 ***/
    $("#userName").val("");
    $("#xh").val("");
    $("#zjhm").val("");
    $("#birthday").val("");
    $("#address").val("");// 家庭住址重置
    $("#s_zjhm").val("");
    $("#p_name").val("");
    $("#p_phone").val("");
    $("#p_zjhm").val("");
    $("#a_userMobile").val("");
    $("#a_xjh").val("");
  	//$("#a_divselect_ul option").attr("selected",false);
    /********再次弹出人员新增框时候，默认是教师的选择 **********/
    $("#userPrimaryKey").text("学工号");
    $("#xh").attr("placeholder","请填写增加用户的学工号");
    /*** 显示选择部门的div ***/
    $("#checkedDepartDiv").show();
    $("#uncheckedDepartDiv").show();
    /*** 隐藏填写当前用户孩子的信息***/
    $("#a_childList").empty();
    $("#a_childList").hide();
    $("#a_jg_div").hide();
    $("#a_address_div").hide();
    $("#a_idNumber").html("证件号码");
    $("#zjhm").attr("placeholder","请填写当前用户的证件号码");

    idType = 0;/*** 恢复证件类型 ***/
    identity = 1;/*** 恢复用户身份类型  ***/
   	s_status = 1; //恢复在线状态

    $("#addOrganizationNameList").empty();
    $("#addUser").attr("data-target","#addUser_div");
    findDeptNode();
    /*学生状态和家长信息*/
    $("#stu_p_div").hide();
    /*** 初始化增加用户DIV不同身份的元素的还原  ***/
    $(":radio[name='identity'][value='" + identity + "']").prop("checked", "checked");
    addUserDivInit(identity);
    /***初始化民族***/
   initUserMz('','a_mz');
}

/**
 * 14、删除用户
 * @param userID
 */
function delUserDiv(userID,identity){
    informationAlert_confirmAndCancelButton('delUser('+userID+','+identity+')',"是否确定删除选择的用户数据？");
}

/**
 * 15、删除用户接口
 * @param userID
 * @param identity
 */
function delUser(userID,identity) {
    var param = {};
    param.appName = "user_delUserInfo";
    param.userID = userID;
    param.identity = identity;
    serverFromJSONData(param,true).then(function (response) {
        if(response.msgState == 200){
            informationAlert_OnlyCancelButton_REFRESH('refreshAreaTable()','删除成功!');
        }else {
            informationAlert_OnlyConfirmButton_NOT_REFRESH('删除失败！原因：' + response.msg);
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH('访问服务器发生错误！' + error);
    };
}

/** 16、修改人员基础信息 **/
function updateUserDiv(userID){
    curUserId = userID;
    queryUserInfo(userID);
    $('#updateUser_div').modal('show');
    //$("#updateUser").attr("data-target","#updateUser_div");
}

/***
 *  17、更新用户基本信息
 */
function updateUserInfo(){
    /*** 判断图片base64是否存在 ***/
    if(!checkValueIsNull(uploadImgBase64)){
        var param = {};
        param.appName = "image_uploadImag";
        var imgList = new Array();
        imgList.push(uploadImgBase64);
        param.imgList = imgList;

        serverFromJSONData(param,true).then(function (response) {
            if(response.msgState == 200 && response.data !=null && response.data != ''){
                if (response.data.length == 1){
                    updateUser(response.data[0]);
                }else{
                    informationAlert_OnlyConfirmButton_NOT_REFRESH("获取图片失败，请稍后再试!");
                }
            }else{
                informationAlert_OnlyConfirmButton_NOT_REFRESH("图片上传失败，失败原因："+response.msg);
            }
        }),function (error) {
            informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
        };
    }else{
        updateUser("");
    }
}

/** 17.1、提交修改用户个人信息 **/
function updateUser(userHeadImg) {

    var u_userName = $("#u_userName").val();// 用户姓名
    var u_xh = $("#u_xh").val();// 用户学工号
    var zjlx = idType; // 用户证件类型
    var xjh = $("#u_xjh").val();// 学籍号
    var zjhm = $("#u_zjhm").val();// 用户证件号码
    var s_zjhm = $("#u_s_zjhm").val();
    var u_birthday = $("#u_birthday").val();// 出生日期
    var identity = $("input[name='identity']:checked").val();//身份类别
    var departList = null;
    var childList = null;
    var departCodeList = null;
    var childInfoList = null;
    var address = $("#u_address").val();
    var userMobile = $("#u_userMobile").val();
    var p_name = $("#u_p_name").val();
    /*家长手机号*/
    var p_phone = $("#u_p_phone").val();
    var p_zjhm = $("#u_p_zjhm").val();//证件号码
    var p_zjlx = 1;//证件类型
    var p_userId = $("#u_p_userId").val();
    s_is_nonresident = $("input[name='s_is_nonresident_u']:checked").val();
    

  
    /*** 验证姓名是否正确 ***/
    if(checkValueIsNull(u_userName)){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('姓名栏不能为空，请重新填写!');
        return;
    }

    if(checkValueIsNull(u_xh)){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('学号栏不能为空，请重新填写!');
        return;
    }
  

    /*** 校验用户填写的手机号码格式是否正确 ***/
    /*if (identity == 2 && !checkSubmitMobil(userMobile)){
        return false;
    }*/
     /*** 如果是学生，则默认证件类型为身份证 ***/
    if (identity == 3){
        idType = 1;
        zjlx = idType;
       /* if(checkValueIsNull(s_zjhm)){
    		informationAlert_OnlyConfirmButton_NOT_REFRESH('学生身份证不能为空，请重新填写!');
   			return;	
    	}
     	if(!isCardNo(s_zjhm)){
            informationAlert_OnlyConfirmButton_NOT_REFRESH('学生证件号码格式不正确，请重新操作！');
            return;
        }*/
     	//学生身份证
     	if(s_zjhm == null || s_zjhm == ''){
     		zjhm = "--";
     	}else{
     		zjhm = s_zjhm;
     	}
    }

    /*** 校验用户输入的身份证件号码是否正确 ***/
    if (zjlx == 0 || zjlx == null){
//      informationAlert_OnlyConfirmButton_NOT_REFRESH('用户证件号不正确，请重新操作！');
//      return;
    }else{
        /*if(checkValueIsNull(zjhm)){
            informationAlert_OnlyConfirmButton_NOT_REFRESH('用户证件号码栏不能为空，请重新操作！');
            return;
        }

        if(zjlx == 1){
             if(!isCardNo(zjhm)){
                 informationAlert_OnlyConfirmButton_NOT_REFRESH('用户证件号码栏格式不正确，请重新操作！');
                 return;
             }
        }*/
        if(zjhm == null || zjhm == ''){
     		zjhm = "--";
     	}else{
     		zjhm = zjhm;
     	}
    }
  

    if (checkValueIsNull(proviceCode)){
        $("#u_prov option").each(function (){
            var proviceName = $(this).text();
            if (!checkValueIsNull(proviceName)){
                if(!checkValueIsNull($(this).val())){
                    proviceCode = $(this).val();
                    return false;
                }
            }
        });
    }

    if(checkValueIsNull(cityCode) || '0' == cityCode){
        $("#u_city option").each(function (){
            var cityName = $(this).text();
            if (!checkValueIsNull(cityName)){
                if(!checkValueIsNull($(this).val())){
                    cityCode = $(this).val();
                    return false;
                }
            }
        });
    }

    if(identity !=1 && checkValueIsNull(address)){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('用户家庭地址栏不能为空，请重新操作！');
        return;
    }

    if (identity != 2){
        departList = $("#organizationNameList div");//获取子元素div
        if(departList != null) {
            departCodeList = new Array();
            $.each(departList, function (i, n) {
                if (!checkValueIsNull(n.id)) {
                    var curDepartIsLead = $(":checkbox[name='isLeader'][value='isLead_" + n.id + "']");
                    var isLeaderFlag = "0";
                    if (curDepartIsLead.attr('checked')) {
                        isLeaderFlag = "1";
                    }
                    departCodeList.push(n.id + "_" + isLeaderFlag);
                }
            });
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH('人用户至少要关联一个组织机构，请重新操作！');
            return;
        }
    }else {
        var isFull = true;
        /*** 获取最后的孩子信息列表 ***/
        childList = $("#u_childList>div[id^='u_parentChildName_']");
        if(childList != null){
           childInfoList = new Array();
           var totalChildListCnt = childList.length;// 获取当前总的子元素个数
           var totalIndex = 0;
           var indexTemp = 0;
           var temp = 0;
            /***开始循环***/
            while(totalIndex < totalChildListCnt){
                indexTemp++;
                if(indexTemp>=100){
                    break;
                }

                var obj = {};
                var childName = getChildValue("#u_childName_"+indexTemp);
                if(childName != null){
                    if(checkValueIsEmptyString(childName)){
                        isFull = false;
                        break;
                    }else{
                        ++temp;
                    }
                }else {
                    continue;
                }

                var childXgh = getChildValue("#u_childXgh_"+indexTemp);
                if(childXgh !=null){
                    if(checkValueIsEmptyString(childXgh)){
                        isFull = false;
                        break;
                    }else{
                        ++temp;
                    }
                }else {
                    continue;
                }

                var childRelation = getChildValue("#u_childRelation_"+indexTemp);
                if(childRelation !=null){
                    if(checkValueIsEmptyString(childRelation)){
                        isFull = false;
                        break;
                    }else {
                        ++temp;
                    }
                }else {
                    continue;
                }

                if(temp == 3){
                    obj.realName = childName;
                    obj.xgh = childXgh;
                    obj.relation = childRelation;
                    childInfoList.push(obj);
                    totalIndex++;
                }
                temp = 0;
            }
        }
        if(childList!=null && childList.length !=0){
            if(!isFull){
                informationAlert_OnlyConfirmButton_NOT_REFRESH('孩子的信息填写不完整，请重新填写!');
                return;
            }
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH('一个家长至少绑定一个孩子，请重新填写!');
            return;
        }
    }



	 //验证家长姓名
    if(identity == 3 && checkValueIsNull(p_name)){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('家长姓名栏不能为空，请重新填写!');
        return;
    }
     /*** 校验家长用户填写的手机号码格式是否正确 ***/
	if (identity == 3&&!checkSubmitMobil(p_phone)){
        return false;
    }
	/*** 校验用户输入的身份证件号码是否正确  (家长的) ***/
	if(identity == 3){
        /*if(checkValueIsNull(p_zjhm)){
            informationAlert_OnlyConfirmButton_NOT_REFRESH('家长证件号码栏不能为空，请重新操作！');
            return;
	     }
        if(!isCardNo(p_zjhm)){
            informationAlert_OnlyConfirmButton_NOT_REFRESH('家长证件号码格式不正确，请重新操作！');
            return;
        }*/
       if(p_zjhm == null || p_zjhm == ''){
     		p_zjhm = "--";
     	}else{
     		p_zjhm = p_zjhm;
     	}
	}
    /*** 提交数据 ***/
    var param = {};
    param.userID = curUserId;
    param.xm = u_userName;
    param.xgh = u_xh;
    param.identity = identity;
    param.sex = sex;
    param.idType = zjlx;
    param.idNumber = zjhm;
    param.departCodeList = departCodeList;
    param.childList = childInfoList;
    param.cityCode = cityCode;
    param.address = address;
    param.mz = mz;
    param.mobile = userMobile;
    param.birthday=u_birthday;//生日
    param.headImg = userHeadImg;// 后续新增
    param.xjh = xjh;// 后续新增
    param.p_userId = p_userId;
    param.p_userName = p_name;
    param.p_mobile = p_phone;
    param.p_idType = p_zjlx;
    param.s_status = s_status;
    param.p_idNumber = p_zjhm;
    param.s_is_nonresident = s_is_nonresident;
    
    param.appName="user_updateUserInfo";
    serverFromJSONData(param,true).then(function (response) {
       if(response.msgState == 200){
           informationAlert_OnlyCancelButton_REFRESH('close_updateUserModel()','用户数据已修改成功!');
           idType = 0;
       }else {
           informationAlert_OnlyConfirmButton_NOT_REFRESH('修改失败，失败原因：' + response.msg);
       }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH('访问服务器发生错误！' + error);
    };
    cityCode = "0";
}

/***
 * 18、获取指定元素的值
 * @param elementId
 * @returns {*}
 */
function getChildValue(elementId){
    var childObj = $(elementId);
    /***判断对象是否存在***/
    if(childObj.length > 0 ){
        console.log(elementId+" 存在");
        var childValue = childObj.val();
        if(checkValueIsNull(childValue)){
            return "";
            console.log(elementId+" 无值!");
        }else{
            return childValue;
        }
    }else{
        console.log(elementId+" 不存在!");
        return null;
    }
}

/***
 * 19、增加用户
 */
function addUserInfo(){
    /*** 判断图片base64是否存在 ***/
    if(!checkValueIsNull(uploadImgBase64)){
        var param = {};
        param.appName = "image_uploadImag";
        var imgList = new Array();
        imgList.push(uploadImgBase64);
        param.imgList = imgList;

        serverFromJSONData(param,true).then(function (response) {
            if(response.msgState == 200 && response.data !=null && response.data != ''){
                if (response.data.length == 1){
                    addUser(response.data[0]);
                }else{
                    informationAlert_OnlyConfirmButton_NOT_REFRESH("获取图片失败，请稍后再试!");
                }
            }else{
                informationAlert_OnlyConfirmButton_NOT_REFRESH("图片上传失败，失败原因："+response.msg);
            }
        }),function (error) {
            informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
        };
    }else{
        addUser("");
    }
}

/**
 * 18、提交单个增加的用户数据
 */
function addUser(userImg){
    var xm = $("#userName").val();// 姓名
    var xh = $("#xh").val();// 学工号
    var zjlx = idType;//证件类型
    var xjh = $("#a_xjh").val();//学籍号
    var zjhm = $("#zjhm").val();//证件号码
    var s_zjhm = $("#s_zjhm").val();//学生身份证号码
    
    /*var mz = $("#mz").val();// 民族*/
    var birthday = $("#birthday").val();// 出生日期

    /*** 获取增加用户时选择的组织部门列表 ***/
    var departList = $("#addOrganizationNameList div");//获取子元素div
    var departCodeStr = "";

    /*** 获取增加用户的身份为家长的时候，填写的孩子相关的信息 ***/
    var childName = $("#childName").val();// 孩子姓名
    var childXgh = $("#childXgh").val();// 孩子学号
    var childRelation = $("#childRelation").val();// 与孩子的关系
    
    var userMobile = $("#a_userMobile").val();

    /*** 获取家庭地址 ***/
    var address = $("#address").val();
    /*家长姓名*/
    var p_name = $("#p_name").val();
    /*家长手机号*/
    var p_phone = $("#p_phone").val();
    var p_zjhm = $("#p_zjhm").val();//证件号码
    var p_zjlx = 1;//证件类型
	s_is_nonresident = $("input[name='s_is_nonresident_a']:checked").val();
    /*** 验证姓名是否正确 ***/
    if(checkValueIsNull(xm)){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('姓名栏不能为空，请重新填写!');
        return;
    }

    if(checkValueIsNull(xh)){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('学号栏不能为空，请重新填写!');
        return;
    }
  
    if(identity == null || identity == '' || identity == 0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('用户身份类别不正确，请重新填写!');
        return;
    }

    /*** 校验老师用户填写的手机号码格式是否正确 ***/
    if (identity == 1 && !checkSubmitMobil(userMobile)){
        return false;
    }
  
    /*** 如果是学生，则默认证件类型为身份证 ***/
    if (identity == 3){
        idType = 1;
        zjlx = idType;
        /*if(checkValueIsNull(s_zjhm)){
    		informationAlert_OnlyConfirmButton_NOT_REFRESH('学生身份证不能为空，请重新填写!');
   			return;	
    	}
     	if(!isCardNo(s_zjhm)){
            informationAlert_OnlyConfirmButton_NOT_REFRESH('学生证件号码格式不正确，请重新操作！');
            return;
        }*/
     	//学生身份证
     	if(s_zjhm == null || s_zjhm == ''){
     		zjhm = "--";
     	}else{
     		zjhm = s_zjhm;
     	}
    }

    /*** 校验用户输入的身份证件号码是否正确 ***/
    if (zjlx == 0 || zjlx == null){
//      informationAlert_OnlyConfirmButton_NOT_REFRESH('用户证件号不正确，请重新操作！');
//      return;
    }else{
        /*if(checkValueIsNull(zjhm)){
            informationAlert_OnlyConfirmButton_NOT_REFRESH('用户证件号码栏不能为空，请重新操作！');
            return;
        }

        if(zjlx == 1){
            if(!isCardNo(zjhm)){
                informationAlert_OnlyConfirmButton_NOT_REFRESH('用户证件号码格式不正确，请重新操作！');
                return;
            }
        }*/
        if(zjhm == null || zjhm == ''){
     		zjhm = "--";
     	}else{
     		zjhm = zjhm;
     	}
    }
    

    if (checkValueIsNull(birthday)){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('用户出生日期栏不能为空，请重新操作！');
        return;
    }

    if(checkValueIsNull(proviceCode)){
        $("#a_prov option").each(function (){
            var proviceName = $(this).text();
            if (!checkValueIsNull(proviceName)){
                if(!checkValueIsNull($(this).val())){
                    proviceCode = $(this).val();
                    return false;
                }
            }
        });
    }

    if(checkValueIsNull(cityCode) || '0' == cityCode){
            $("#a_city option").each(function (){
                var cityName = $(this).text();
                if (!checkValueIsNull(cityName)){
                    if(!checkValueIsNull($(this).val())){
                        cityCode = $(this).val();
                        return false;
                    }
                }
            });
    }

    if(identity != 1 && checkValueIsNull(address)){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('用户家庭地址栏不能为空，请重新操作！');
        return;
    }

	 //验证家长姓名
    if(identity == 3 && checkValueIsNull(p_name)){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('家长姓名栏不能为空，请重新填写!');
        return;
    }
     /*** 校验家长用户填写的手机号码格式是否正确 ***/
	if (identity == 3&&!checkSubmitMobil(p_phone)){
        return false;
    }
	/*** 校验用户输入的身份证件号码是否正确  (家长的) ***/
	if(identity == 3){
        /*if(checkValueIsNull(p_zjhm)){
            informationAlert_OnlyConfirmButton_NOT_REFRESH('家长证件号码栏不能为空，请重新操作！');
            return;
	     }
        if(!isCardNo(p_zjhm)){
            informationAlert_OnlyConfirmButton_NOT_REFRESH('家长证件号码格式不正确，请重新操作！');
            return;
        }*/
        if(p_zjhm == null || p_zjhm == ''){
     		p_zjhm = "--";
     	}else{
     		p_zjhm = p_zjhm;
     	}
	}
	
	
    /*** 获取用户的部门或孩子信息组装 ***/
    if (identity != 2){
    	//console.log("----------------->",departList);
        if(departList != null&&departList.length>0) {
            $.each(departList, function (i, n) {
                if (!checkValueIsNull(n.id)){
                    var curDepartIsLead = $(":checkbox[name='isLeader'][value='isLead_" + n.id + "']");
                    var isLeaderFlag = "0";
                    if (curDepartIsLead.attr('checked')) {
                        isLeaderFlag = "1";
                    }
                    departCodeStr += n.id+"_"+isLeaderFlag+",";
                }
            });
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH('用户隶属部门不能为空，请重新填写!');
            return;
        }
    }else{
        var isFull = true;
        /*** 获取最后的孩子信息列表 ***/
        childList = $("#a_childList>div[id^='a_parentChildName_']");
        if(childList != null){
            childInfoList = new Array();
            var totalChildListCnt = childList.length;// 获取当前总的子元素个数
            var totalIndex = 0;
            var indexTemp = 0;
            var temp = 0;
            var errorExistCnt = 0;// 临时错误个数
            /***开始循环***/
            while(totalIndex < totalChildListCnt){
                indexTemp++;
                if(indexTemp>=100){
                    break;
                }

                var obj = {};
                var childName = getChildValue("#a_childName_"+indexTemp);
                if(childName != null){
                    if(checkValueIsEmptyString(childName)){
                        isFull = false;
                        break;
                    }else{
                        if(!isChinaName(childName)){
                            errorExistCnt ++;
                            informationAlert_OnlyConfirmButton_NOT_REFRESH('孩子姓名栏仅限于中文填写，请重新填写!');
                            isFull = false;
                            break;
                        }else {
                            ++temp;// 正常情况
                        }
                    }
                }else {
                    continue;
                }

                var childXgh = getChildValue("#a_childXgh_"+indexTemp);
                if(childXgh != null){
                    if(checkValueIsEmptyString(childXgh)){
                        isFull = false;
                        break;
                    }else{
                        ++temp;// 正常情况
                    }
                }else {
                    continue;
                }

                var childRelation = getChildValue("#a_childRelation_"+indexTemp);
                if(childRelation != null){
                    if(checkValueIsEmptyString(childRelation)){
                        isFull = false;
                        break;
                    }else {
                        if(!isChinaName(childRelation)){
                            errorExistCnt ++;
                            informationAlert_OnlyConfirmButton_NOT_REFRESH('关系栏仅限于中文填写，请重新填写!');
                            isFull = false;
                            break;
                        }else {
                            ++temp;// 正常情况
                        }
                    }
                }else {
                    continue;
                }

                if(temp == 3){
                    obj.realName = childName;
                    obj.xgh = childXgh;
                    obj.relation = childRelation;
                    childInfoList.push(obj);
                    totalIndex++;
                }
                temp = 0;
            }
        }
        if(childList!=null && childList.length !=0){
            if(!isFull){
                if (errorExistCnt == 0){
                    informationAlert_OnlyConfirmButton_NOT_REFRESH('孩子的信息填写不完整，请重新填写!');
                }
                return;
            }
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH('一个家长至少绑定一个孩子，请重新填写!');
            return;
        }
    }

     if(identity == 1){
     	if(checkValueIsNull(userMobile)){
     		informationAlert_OnlyConfirmButton_NOT_REFRESH('手机号码栏不能为空，请重新填写!');
            return;
     	}
     }
     
   
     
    /**
     *  上传数据
     */
    var param = {};
    param.appName = "user_addUser";
    param.xm = xm;
    param.xgh = xh;
    param.idType = zjlx;
    param.idNumber = zjhm;
    param.sex = sex;
    param.identity = identity;
    param.mz = mz;
    param.departName = departCodeStr;
    param.birthday = birthday;
    param.address = address;
    param.cityCode = cityCode;
    param.mobile = userMobile;
    param.headImg = userImg;// 后续新增
    param.xjh = xjh;// 后续新增
    param.p_userName = p_name;
    param.p_mobile = p_phone;
    param.p_idType = p_zjlx;
    param.s_status = s_status;
    param.p_idNumber = p_zjhm;
    param.s_is_nonresident = s_is_nonresident;
    
    /*** 与孩子相关的数据
    if (identity == 2){
        param.childList = childInfoList;
    }
     ***/
   
    serverFromJSONData(param,true).then(function (response) {
        if(response.msgState == 200){
            informationAlert_OnlyCancelButton_REFRESH('close_addUserModel()','用户新建成功!');
            idType = 0;
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH('创建用户失败，失败原因：'+response.msg);
        }
        cityCode = "0";
    }),function (error) {
        cityCode = "0";
        informationAlert_OnlyConfirmButton_NOT_REFRESH('访问服务器发生错误，请稍后再试!');
    };
}

/**
 * 19、关闭新建用户窗口
 */
function close_addUserModel(isUse){
    $('#addUser_div').modal('hide');
    $('#address').val('');
    identity = 1;
    if(isUse!=9){
    	cleanLastTimeAddUserDiscardData();
    }
}

/**
 * 20、关闭更新用户窗口
 */
function close_updateUserModel(){
    $('#updateUser_div').modal('hide');
    refreshAreaTable();
}

/**
 * 21、增加用户后，清理掉上次缓存的数据
 */
function cleanLastTimeAddUserDiscardData(){
    $("#userName").val("");// 重置姓名
    $("#xh").val("");// 学工号重置
    $('#zjlx').val(1);// 证件类型重置
    $("#zjhm").val("");// 证件号码重置
    $("#address").val("");// 家庭住址重置
    $(":radio[name='sex'][value='1']").prop("checked", "checked");// 性别重置
    $(":radio[name='identity'][value='1']").prop("checked", "checked");
    $("#birthday").val("");//出生日期重置
    $("#a_userMobile").val("");//清除掉手机号
    idType = 0;
    refreshAreaTable();
}

/**
 * 22、初始化属性结构
 */
function initTree(){
    var param = {};
    param.appName = "origaniza_listOriganizaTree";
    serverFromJSONData(param,true).then(function (response) {
        var organizationTree = response.data;
        /** 树形节点配置信息 **/

        zNodes = organizationTree;
        $(document).ready(function(){
            $.fn.zTree.init($("#tree"), setting, zNodes);
            zTree = $.fn.zTree.getZTreeObj("tree");
            rMenu = $("#rMenu");
            if (organizationTree != null){
                $("#dataLoadIng").css("display","none");
            }
        });
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH('访问服务器发生错误，请稍后再试!');
    };
}

/**
 * 23、修改部门
 */
function updateDepart(){
    /** 修改部门的新名称 **/
    var departName = $("#newDepartName").val();
    if (departName == ''){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('部门名称不能为空，请重新填写!');
        return;
    }

    /*** 2、获取部门性质 ***/
    var departType = $("input[name='udepartType']:checked").val();// 获取身份类型
    if(checkValueIsNull(departType)){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("部门性质不能为空，请重新选择!");
        return;
    }

    /** 选择的上级部门 **/
    var node = $.fn.zTree.getZTreeObj("tree").getSelectedNodes();
    var nodeID = null;
    if (node.length == 0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('请选择您要操作的部门!');
    }else{
        nodeID = node[0].id;
        $("#updateDepart").attr("data-target","#updateDepart_div");
    }

    /** 修改组织机构名称 **/
    var param = {};
    param.menuName = departName;
    param.opperOriganizaCode = nodeID;
    param.isdepartClassFlag = departType;
    param.appName = "origaniza_updateOringaniza";

    serverFromJSONData(param,true).then(function (response) {
       $('#updateClose').trigger("click");
       if (response.msgState == 200){
           informationAlert_OnlyCancelButton_REFRESH('initTree()','部门修改成功!');
       }else {
           informationAlert_OnlyConfirmButton_NOT_REFRESH('部门修改失败，请稍后再试!');
       }
       $("#newDepartName").val();
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH('访问服务器发生错误，请稍后再试!');
    };
}

/**
 * 24、增加部门
 */
function addDepart(){
    /** 1、新增的部门名称 **/
    var departName = $("#departName").val();
    if (checkValueIsNull(departName)){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("添加的部门名称不能为空，请重新填写!");
        return;
    }

    /*** 2、获取部门性质 ***/
    var departType = $("input[name='adepartType']:checked").val();// 获取身份类型
    if(checkValueIsNull(departType)){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("部门性质不能为空，请重新选择!");
        return;
    }

    /** 3、选择的上级部门 **/
    var node = $.fn.zTree.getZTreeObj("tree").getSelectedNodes();
    var nodeID = null;
    if (node.length == 0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择您要操作的部门!");
    }else{
        nodeID = node[0].id;
        $("#addDepart").attr("data-target","#addDepart_div");
    }

    /** 添加组织机构 **/
    var param = {};
    param.menuName = departName;
    param.opperOriganizaCode = nodeID;
    param.isdepartClassFlag = departType;
    param.appName = "origaniza_addOriganiza";

    serverFromJSONData(param,true).then(function (response) {
        $('#close').trigger("click");
        if (response.msgState == 200){
            informationAlert_OnlyCancelButton_REFRESH('initTree()','添加部门成功!');
        }else {
            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加部门失败，请稍后再试");
        }
        $("#departName").val('');
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}

/**
 * 25、删除部门
 */
function delDepart(){
    var node = $.fn.zTree.getZTreeObj("tree").getSelectedNodes();
    var nodeID =node[0].id;
	
	if(node[0].level==0){
		informationAlert_OnlyConfirmButton_NOT_REFRESH("学校不能删除!");
		return;
	}
	
    /** 发出请求参数 **/
    var param = {};
    param.opperOriganizaCode = nodeID;
    param.appName = "origaniza_delOringaniza";

    serverFromJSONData(param,true).then(function (response) {
        $('#delClose').trigger("click");
        if (response.msgState == 200){
            informationAlert_OnlyCancelButton_REFRESH('initTree()','部门删除成功!');
        }else {
            informationAlert_OnlyConfirmButton_NOT_REFRESH('部门删除失败，失败原因：'+response.msg);
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };

}

/**
 * 26、excel上传用户
 */
function uploadUser(){
    /*** 查询请求的接口对应的服务器信息 ***/
    var param = {};
    param.appName="interface_queryInterfaceServerInfo";
    param.interfaceName = 'user/addUserByExcel.do';
    serverFromJSONData(param,true).then(function (response) {
        if (response.msgState == 200){
            /***点击上传且返回正确的数据时，开始显示进度条 ***/
            $("#wrapper").show();
            uploadFile("/apis/SC/"+param.interfaceName);
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("获取上传文件接口对应的服务器数据失败，请稍后再试!");
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}

/**
 * 27、增加人员信息时候底部展示组织部门
 * @param index
 */
function findDeptNode() {
    // 2、接口请求参数组装
    var msg = {};
    msg.deptTypeID = -1;
    msg.appName="origaniza_listOriganizaTree";

    serverFromJSONData(msg,true).then(function (success) {
        var node = success.data;
        var zTreeObj;
        var setting = {view:{showLine: false,dblClickExpand: false},
                       data:{simpleData: {enable: true}},
                       callback: {onClick: zAddUserTreeOnClick},
                       check: {enable: false}};
        $(document).ready(function(){
            zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, node);
        });
        getProviceList();
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}

/***
 * 28、查询人员的基础信息
 * @param userID
 */
function queryUserInfo(userID) {

    $("#organizationNameList").empty();
    $("#u_childList").empty();
    globalIndex = 1;

    organizationNameList="";
    //$('#u_xh').attr("readonly","readonly");
    // 2、接口请求参数组装
    var msg = {};
    msg.userID = userID;
    msg.appName="user_getUserBaseInfo";

    serverFromJSONData(msg,true).then(function (success) {
        var userBaseInfo = success.data;
        $("#u_userName").val(userBaseInfo.realName);
        cityCode = userBaseInfo.cityCode;
        proviceCode = userBaseInfo.proviceCode;
        /******************************** 判断用户的身份类别 *********************************/
        /**28.1如果身份是教师和学生**/
        if (userBaseInfo.identity == 1 || userBaseInfo.identity == 3){
            $("#u_userPrimaryKey").text("学工号");
            $("#u_xh").attr("placeholder","请填写增加用户的学工号");
            /*** 显示选择部门的div ***/
            $("#u_checkedDepartDiv").show();
            $("#u_uncheckedDepartDiv").show();
            /*** 隐藏填写当前用户孩子的信息***/
            $("#u_parentChildName").hide();
            $("#u_parentChildXgh").hide();
            $("#u_parentChildRelation").hide();
            /*** 显示隐藏用户籍贯相关的信息 ***/
            if(userBaseInfo.identity == 3){
                $("#u_xjh_div").show();
                $("#u_idNumber").html("身份证号码");
                $("#u_jg_div").show();
                $("#u_stu_p_div").show();
                $("#u_address_div").show();
                $("#s_u_idtype_div").show();
                $("#u_idType_div").hide();
                $("#u_address").val(userBaseInfo.jg);
                $("#organ").text("隶属班级");
                $("#u_xjh").val(userBaseInfo.xjh);
                $("#u_userMobile_div").hide();
                
             	$(":radio[name='s_status'][value='" + userBaseInfo.s_status + "']").prop("checked", "checked");
             	$(":radio[name='s_is_nonresident_u'][value='" + userBaseInfo.s_is_nonresident + "']").prop("checked", "checked");
             	$("#u_p_name").val(userBaseInfo.p_userName);
             	$("#u_p_phone").val(userBaseInfo.p_mobile);
             	$("#u_p_zjhm").val(userBaseInfo.p_idNumber);
             	$("#u_p_userId").val(userBaseInfo.p_userId);
             	
             	//判断学生是否是离校,如果是则是设置不可用
//           	if(userBaseInfo.s_status==2){
//           		$("#updateUser_div input").attr("readonly", "readonly");
//           		$("#updateUser_div select").attr("disabled", "disabled");
//           		$("[name='sex']").attr("disabled","disabled");
//           		$("[name='s_status']").attr("disabled","disabled");
//           		$("#updateUser_div #organizationNameList").attr("disabled","disabled");
//           		$("#updateBtn").attr("disabled","disabled");
//           	}else{
             		$("#updateUser_div input").removeAttr("readonly");
             		//$("#u_xh").attr("readonly","readonly");
             		$("#updateUser_div select").removeAttr("disabled");
             		$("[name='sex']").removeAttr("disabled");
             		$("[name='s_status']").removeAttr("disabled");
             		$("#updateUser_div #organizationNameList").removeAttr("disabled");
             		$("#updateBtn").removeAttr("disabled");
//           	}
             	
             	
            }else {
                $("#u_xjh_div").hide();
                $("#u_jg_div").show();
                $("#s_u_idtype_div").hide();
                $("#u_idType_div").show();
                $("#u_address_div").hide();
                $("#u_stu_p_div").hide();
                $("#organ").text("隶属部门");
                $("#u_userMobile_div").show();
                $("#u_userMobile").val(userBaseInfo.mobile);
            }
        }else{
            return;
        }
//      else if(userBaseInfo.identity == 2){
//          $("#u_xjh_div").hide();
//          $("#u_userPrimaryKey").text("手机号");
//          $("#u_xh").attr("placeholder","请填写用户的手机号");
//          /*** 隐藏已选部门div和选择部门的div ***/
//          $("#u_checkedDepartDiv").hide();
//          $("#u_uncheckedDepartDiv").hide();
//          /*** 显示填写当前用户孩子的信息***/
//          $("#u_parentChildName").show();
//          $("#u_parentChildXgh").show();
//          $("#u_parentChildRelation").show();
//          /*** 显示用户的籍贯相关的信息 ***/
//          $("#u_idNumber").html("证件号码");
//          $("#u_jg_div").show();
//          $("#u_address_div").show();
//          $("#u_address").val(userBaseInfo.jg);
//          $("#u_userMobile_div").hide();
//          $("#u_userMobile").val(userBaseInfo.mobile);
//      }
        

        $("#u_xh").val(userBaseInfo.userName);
        if (!checkValueIsNull(userBaseInfo.zjz)){
            $("#userHeadImg").attr("src", userBaseInfo.zjz);
        }else{
        	$("#userHeadImg").removeAttr("src");
        }
        
        /*** 用户民族 ***/
        initUserMz(userBaseInfo.mz,"u_mz");

        /*** 查找下拉列表中的值和用户本身的值进行匹配 ***/
        $('#u_divselect_ul').find('li').each(function(){
            var aobj = $(this).find("a");
            if (aobj.attr("selectid") == userBaseInfo.idType){
                idType = userBaseInfo.idType;
                $("#u_citeClick").html(aobj.text());
                $("#u_citeClick").css("color","black");
            }
        });


       /* $("#u_zjlx").find("option[value='"+userBaseInfo.idType+"']").attr("selected",true);*/
        if(userBaseInfo.idNumber == null || userBaseInfo.idNumber == ''){
            $("#u_zjhm").attr("placeholder","暂无该用户的证件号码，请及时更新")
        }else{
            $("#u_zjhm").val(userBaseInfo.idNumber);
            $("#u_s_zjhm").val(userBaseInfo.idNumber);
        }

        $(":radio[name='sex'][value='" + userBaseInfo.sex + "']").prop("checked", "checked");
        $(":radio[name='identity'][value='" + userBaseInfo.identity + "']").prop("checked", "checked");
        if(userBaseInfo.brithday == null || userBaseInfo.brithday ==''){
            $("#u_birthday").attr("placeholder","暂无该用户的出生日期信息，请及时更新")
        }else{
            $("#u_birthday").val(userBaseInfo.brithday);
        }

        /*** 获取当前人员加入的部门 ***/
        if (userBaseInfo.identity != 2){
            var organizaList = userBaseInfo.organizaList;
            if(organizaList!=null){
                $.each(organizaList,function(n,obj) {
                    var organizationName = obj.organizationName;
                    var organizationCode = obj.organizationCode;
                    organizationNameList += buildDepartTag(organizationCode,organizationName,obj.isLead,userBaseInfo.identity);
                });
                $("#organizationNameList").append(organizationNameList);
            }
            queryDeptList(userBaseInfo.identity);
        }else{
         /*** 获取当前人员的孩子列表 ***/
            $("#u_childList").append(buildChildList(userBaseInfo.childList,'u'));
            getuProviceList();
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
   
}

/***
 * 构建孩子信息
 * @param childList
 * @returns {string}
 */
function buildChildList(childList,adFlag) {
    var chilListStr = "";
    if (childList != null && childList.length != 0){
        $.each(childList,function(index,value){
            chilListStr += buildChildDiv(value.realName,value.xgh,value.relation,adFlag);
            globalIndex++;
        });
    }
    return chilListStr;
}
/***
 * 构建孩子信息div
 * @returns {string}
 */
function buildChildDiv(realName,xgh,relation,adFlag){
     return '<div id="'+adFlag+'_parentChildName_'+globalIndex+'" class="form-group">'+
               '<label class="control-label col-md-3 col-sm-3 col-xs-12">孩子信息</label>'+
               '<div class="col-md-8" style="text-align: left;padding-top:5px">'+
                   '<span style="text-align: right">姓名</span>'+
                       '<input id="'+adFlag+'_childName_'+globalIndex+'" style="width: 70px;" class="childInput" type="text" value="'+realName+'"/>'+
                   '<span style="text-align: right;margin-left: 1px;">学号</span>'+
                       '<input id="'+adFlag+'_childXgh_'+globalIndex+'" style="width: 80px;" class="childInput" type="text" value="'+xgh+'"/>'+
                   '<span style="text-align: right;margin-left: 1px;">关系</span>'+
                       '<input id="'+adFlag+'_childRelation_'+globalIndex+'" style="width: 50px;" class="childInput" type="text" value="'+relation+'"/>'+
                   '&nbsp;<label style="font-weight: bold;color: red;cursor: hand;" onclick="deleteRowToChildList(\''+globalIndex+'\',\''+adFlag+'\')">×</label>'+
                   '&nbsp;<label style="font-weight: bold;color: #2f8325;cursor: hand;" onclick="addRowToChildList(\''+adFlag+'\')">＋</label>'+
               '</div>'+
            '</div>';
}

/*** 增加孩子信息行 ***/
function addRowToChildList(adFlag){
    if (cntChildDivNum(adFlag+'_childList')>=3){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("一个家长最多关联三个孩子，请重新再试!");
        return;
    }else{
        globalIndex ++;
    }
    var childListStr = $('#'+adFlag+'_childList').html();
    childListStr += buildChildDiv('','','',adFlag);
    $('#'+adFlag+'_childList').empty();
    $('#'+adFlag+'_childList').append(childListStr);
}

/***
 * 删除孩子信息行
 */
function deleteRowToChildList(index,adFlag){
    if(cntChildDivNum(adFlag+'_childList')<=1){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("一个家长至少要关联一个孩子，请重新再试!");
        return;
    }
    /*** 删除指定id的div ***/
    $('div#'+adFlag+'_parentChildName_'+index).remove();
}

/***
 * 判断指定div内的子div个数
 * @param parentDivId
 * @returns {*|jQuery}
 */
function cntChildDivNum(parentDivId){
    var cnt = $("#"+parentDivId+" > div").size();
    return cnt;
}


/***
 * 29、抽离构建部门tag
 * @param organizationCode
 * @param organizationName
 * @param userType
 * @returns {string}
 */
function buildDepartTag_add(organizationCode,organizationName,userType){
    var departLead = "";
     if(userType == 1){
         departLead = "<label id='isLead_"+organizationCode+"'><input type='checkbox' onclick='judgeDepartIsHaveLeader(&quot;"+organizationCode+"&quot;)' name='isLeader' value='isLead_"+organizationCode+"'><i>✓</i>领导</label>";
     }
    return "<div id='"+ organizationCode +"' class='tagator_tag'>"+ organizationName +
              "<div class='tagator_tag_remove' onclick='organizationClick(&quot;"+ organizationCode + "&quot;)'>×</div>" +
           "</div>" + departLead;
}

/***
 * 30、生成标签，用于查询数据时根据用户已有的生成标签，flag：是否选中
 * @param organizationCode
 * @param organizationName
 * @param flag
 * @param userType
 * @returns {string}
 */
function buildDepartTag(organizationCode,organizationName,flag,userTtype){
    var isLeadFlag = "";
    if(flag == 1){
        isLeadFlag = "<label id='isLead_"+organizationCode+"'><input type='checkbox' name='isLeader' value='isLead_"+organizationCode+"' checked><i>✓</i>领导</label>";
    }else{
        isLeadFlag = "<label id='isLead_"+organizationCode+"'><input type='checkbox' onclick='judgeDepartIsHaveLeader(&quot;"+organizationCode+"&quot;)' name='isLeader' value='isLead_"+organizationCode+"'><i>✓</i>领导</label>";
    }
    if(userTtype != 1){
        isLeadFlag = "";
    }
    return "<div id='"+ organizationCode +"' class='tagator_tag'>"+ organizationName +
           "<div class='tagator_tag_remove' onclick='organizationClick(&quot;"+ organizationCode + "&quot;)'>×</div>" +
           "</div>" + isLeadFlag;
}

/***
 * 31、后端接口判断部门是否有负责人
 * @param departID
 */
function judgeDepartIsHaveLeader(departID){
    var param = {};
    param.appName = "user_judgeDepartIsHaveLeader";
    param.departID = departID;
    serverFromJSONData(param,true).then(function (response) {
       var isHaveLeader = response.data;
       var obj = $('input[value="isLead_'+departID+'"]');
        if (isHaveLeader == 1){
            obj.attr("checked",false);
            informationAlert_OnlyConfirmButton_NOT_REFRESH("当前部门已设置了部门负责人，不能重复设置负责人!");
        }else {
            //obj.attr("checked",true);
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}

/***
 * 32、动态删除指定的tag
 * @param a
 */
function organizationClick(organizationCode) {
    $("#"+organizationCode).remove();
    $("#isLead_"+organizationCode).remove();
}

/***
 *  33、修改人员时，部门节点查询
 */
function queryDeptList(identity) {
    // 2、接口请求参数组装
    var msg = {};
    msg.deptTypeID = -1;
    msg.appName="origaniza_listOriganizaTree";

    serverFromJSONData(msg,true).then(function (success) {
        var node = success.data;
        var zTreeObj;
        var setting = {view:{showLine: false,dblClickExpand: false},
                       data:{simpleData: {enable: true}},
                       check: {enable: false},
                       callback:{onClick: zTreeOnClick}
                      };
        $(document).ready(function(){
            zTreeObj = $.fn.zTree.init($("#treeDepart"), setting, node);
        });
        /*** 如果基本类型不是教师 就查询省市数据 ***/
         getuProviceList();
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}

/***
 * 34、修改人员信息时候部门节点点击
 */
function zTreeOnClick(){
    var node = $.fn.zTree.getZTreeObj("treeDepart").getSelectedNodes();
    var nodeID = null;
    var nodeCode = null;
    if (node.length == 0 ){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("新增的用户所属部门不能为空!");
    }else{
        /***判断当前点击的部门是否存在子节点，有子节点，人员只能挂在子节点部门上 ***/
        nodeID = node[0].id;
        nodeName = node[0].name;
        //if(!checkNodeIsHaveChildNode(node[0])){
           // if(nodeID.length <= 4){
           //     informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择学校下辖的部门!");
            //    return;
           // }
            if (!judgeDepartIsExists("organizationNameList",nodeID)){
                var uidentity = $("input[name='identity']:checked").val();
                if (uidentity == 3){
                    if(judgeDepartIsMore("organizationNameList")){
                        var organizationNameObj = buildDepartTag_add(nodeID,nodeName,uidentity);
                        $("#organizationNameList").append(organizationNameObj);
                    }else{
                        informationAlert_OnlyConfirmButton_NOT_REFRESH("学生只能关联一个组织机构!");
                    }
                }else {
                    var organizationNameObj = buildDepartTag_add(nodeID,nodeName,uidentity);
                    $("#organizationNameList").append(organizationNameObj);
                }
            }
       // }else{
       //     informationAlert_OnlyConfirmButton_NOT_REFRESH("用户只能挂靠在["+nodeName+"]的下级子部门!");
        //}
    }
}

/***
 * 35、判断当前节点是否还有子节点
 * @param curNode
 */
function checkNodeIsHaveChildNode(curNode){
    if(curNode.children){
        return true;
    }else{
        return false;
    }
}

/***
 * 36、增加人员信息时部门节点点击事件
 */
function zAddUserTreeOnClick(){
    var node = $.fn.zTree.getZTreeObj("treeDemo").getSelectedNodes();
    var nodeID = null;
    var nodeCode = null;
    if (node.length == 0 ){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("新增的用户所属部门不能为空!");
    }else{
        nodeID = node[0].id;
        nodeName = node[0].name;
       // if(!checkNodeIsHaveChildNode(node[0])){
            //if(nodeID.length <= 4){
            //    informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择学校下辖的部门!");
            //    return;
           // }else{
                var uidentity = $("input[name='identity']:checked").val();
                /*** 如果添加的部门不重复，则继续添加 ***/
                if (!judgeDepartIsExists("addOrganizationNameList",nodeID)){
                    if (uidentity == 3){
                        if (judgeDepartIsMore("addOrganizationNameList")){
                            var organizationNameObj = buildDepartTag_add(nodeID,nodeName,uidentity);
                            $("#addOrganizationNameList").append(organizationNameObj);
                        }else {
                            informationAlert_OnlyConfirmButton_NOT_REFRESH("一个学生只能关联一个组织机构!");
                        }
                    }else{
                        var organizationNameObj = buildDepartTag_add(nodeID,nodeName,uidentity);
                        $("#addOrganizationNameList").append(organizationNameObj);
                    }
                }
           // }
        //}else{
        //    informationAlert_OnlyConfirmButton_NOT_REFRESH("用户只能挂靠在["+nodeName+"]的下级子部门!");
        //}
    }
}

/***
 * 37、教师下载模板事件
 */
function excelTempletTeacher(){
    var templetJSON = [
        {
            "学/工号":"0001",
            "姓名":"小王",
            "性别":"男",
            "人员类型":"教师",
            "所属部门":"咨询中心",
            "证件类型":"居民身份证",
            "证件号码":"510824199001016621",
            //"政治面貌":"群众",
            "民族":"汉",
            "手机号码":"13888880000",
            //"电子邮箱":"vip@163.com",
            "出生日期":"1970-01-01",
            "校区/学校":"东校区",
            "是否是一卡通导出数据(1:是,0:不是【必须分清楚】)":"1",
            "物理卡号":"212612353",
            "pid(人员唯一标识)":"5306b789e2774ea2810e2f6032439d92"
            
        }
    ];
    downloadExl(templetJSON,"teacher");
}

/**
 * 38、学生下载模板
 */
function excelTempletStudent(){
    var templetJSON = [
        {
            "学/工号":"0001",
            "姓名":"王亮",
            "性别":"男",
            "人员类型":"学生",
            "班级名称":"咨询中心",
            "学生身份证":"510824199001016621",
            //"政治面貌":"群众",
            "民族":"汉",
            "手机号码":"13888880000",
            //"电子邮箱":"vip@163.com",
            "出生日期":"1970-01-01",
            "家庭地址":"xxxxx",
            "学生状态(1:在校，2:离校，3:休学)":"1",
            "是否住校(1:走读，0:住校)":"1",
            "家长姓名":"刘华能",
            "家长电话":"15708322591",
            "家长身份证":"513128199212226837",
            "校区/学校":"东校区",
            "是否是一卡通导出数据(1:是,0:不是【必须分清楚】)":"1",
            "物理卡号":"212612354",
            "pid(人员唯一标识)":"43cb6932499145ad9d1732c75c4afee2"
            
        }
    ];
    downloadExl(templetJSON,"student");
}

/**
 * 39、家长下载模板
 */
function excelTempletParent(){
    var templetJSON = [
        {
            "监护人姓名":"王亮",
            "监护人性别":"男",
            "监护人手机号码":"13800000000",
            "导入人员类型":"家长",
            "被监护人姓名":"王德顺",
            "与被监护人关系":"母亲",
            "被监护人证件类型(选)":"居民身份证",
            "被监护人证件号码(选)":"5108241990909019992",
            "被监护人学工号(选)":"00698776",
            "监护人证件类型":"居民身份证",
            "监护人证件号码":"5108241990909019991",
            "监护人政治面貌":"13888880000",
            "监护人所属民族":"汉",
            //"监护人电子邮箱":"vip@163.com",
            "监护人出生日期":"1970-01-01",
            "监护人家庭地址":"xxxxx"
        }
    ];
    downloadExl(templetJSON,"parent");
}

/**
 * 40、判断点击的节点是否已经选择
 * @param divNode
 * @param departCode
 * @returns {boolean}
 */
function judgeDepartIsExists(divNode,departCode){
    var cnt = 0;
    var departList = $("#"+divNode+" div");//获取待检查的节点
    if(departList != null) {
        var departCodeList = new Array();
        $.each(departList, function (i, n) {
            departCodeList.push(n.id);
        });
        /*** 判断是否存在 ***/
        $.each(departCodeList,function (ii,nn) {
            if (nn == departCode){
               cnt++;
            }
        })
        if (cnt >0 ){
            return true;
        }
    }else{
        return false;
    }
}

/***
 * 41、判断部门是否有多个
 * @param divNode
 */
function judgeDepartIsMore(divNode){
    var cnt = 0;
    var departList = $("#"+divNode+" div");//获取待检查的节点
    if(departList == null) {
        return true;
    }else {
        if(departList.length <= 1){
            return true;
        }else{
            return false;
        }
    }
}

/**
 * 41、性别字段
 * @param o
 * @param n
 */
function radioClick(o,n) {
    if(n==1){
        sex = o.value;
    }
    if(n==2){
        identity = o.value;
    }
    if(n==3){
    	s_status = o.value;
    }
    if(n==4){
    	s_is_nonresident = o.value;
    }
}

/***
 * 42、获取省份列表
 * @param proviceCode
 */
function getProviceList(){
    var msg = {};
    msg.appName="city_getProviceList";
    serverFromJSONData(msg,true).then(function (success) {
     var provice = $("#a_prov");
     provice.empty();
     var proviceListStr = "";
     var proviceList = success.data.list;

      if (proviceList != null && proviceList.length != 0){
          $.each(proviceList,function(name,value) {
                  proviceListStr += "<option value="+value.CODE+">&nbsp;&nbsp;&nbsp;"+value.NAME+"&nbsp;&nbsp;&nbsp;</option>";
          });
          provice.append(proviceListStr);
          /*** 获取城市列表 ***/
          getCityList("");
      }else{
          informationAlert_OnlyConfirmButton_NOT_REFRESH("获取省份数据列表失败，请稍后再试!");
      }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}

/***
 * 43、获取市列表
 * @param proviceCode
 */
function getCityList(proviceCode){
    var msg = {};
    msg.appName="city_getCityList";
    msg.proviceCode = proviceCode;
    serverFromJSONData(msg,true).then(function (success) {
        var city = $("#a_city");
        city.empty();
        var cityListStr = "";
        var cityList = success.data.list;

        if (cityList != null && cityList.length != 0){
            $.each(cityList,function(name,value) {
                cityListStr += "<option value="+value.CODE+">&nbsp;&nbsp;&nbsp;"+value.NAME+"&nbsp;&nbsp;&nbsp;</option>";
            });
            city.append(cityListStr);
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("获取城市数据列表失败，请稍后再试!");
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}

/***
 * 42、获取省份列表
 * @param proviceCode
 */
function getuProviceList(){
    var msg = {};
    msg.appName="city_getProviceList";
    serverFromJSONData(msg,true).then(function (success) {
        var provice = $("#u_prov");
        provice.empty();
        var proviceListStr = "";
        var proviceList = success.data.list;

        if (proviceList != null && proviceList.length != 0){
            $.each(proviceList,function(name,value) {
                if(value.CODE == proviceCode){
                    proviceListStr += "<option value="+value.CODE+" selected='selected'>&nbsp;&nbsp;&nbsp;"+value.NAME+"&nbsp;&nbsp;&nbsp;</option>";
                }else{
                    proviceListStr += "<option value="+value.CODE+">&nbsp;&nbsp;&nbsp;"+value.NAME+"&nbsp;&nbsp;&nbsp;</option>";
                }
            });
            provice.append(proviceListStr);
            /*** 获取城市列表 ***/
            getuCityList();
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("获取省份数据列表失败，请稍后再试!");
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}

/***
 * 43、获取市列表
 * @param proviceCode
 */
function getuCityList(){
    var msg = {};
    msg.appName="city_getCityList";
    msg.proviceCode = proviceCode;
    serverFromJSONData(msg,true).then(function (success) {
        var city = $("#u_city");
        city.empty();
        var cityListStr = "";
        var cityList = success.data.list;

        if (cityList != null && cityList.length != 0){
            $.each(cityList,function(name,value) {
                if(value.CODE == cityCode){
                    cityListStr += "<option value="+value.CODE+" selected='selected'>&nbsp;&nbsp;&nbsp;"+value.NAME+"&nbsp;&nbsp;&nbsp;</option>";
                }else{
                    cityListStr += "<option value="+value.CODE+">&nbsp;&nbsp;&nbsp;"+value.NAME+"&nbsp;&nbsp;&nbsp;</option>";
                }
            });
            city.append(cityListStr);
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("获取城市数据列表失败，请稍后再试!");
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}

/***
 * 44、打开文件上传
 */
function openfile(obj,imgId){
    $(obj).parent().children("#"+imgId).click();
}

/***
 * 45、增加用户页面DIV初始化时，不同身份显示的元素的还原
 */
function addUserDivInit(uidentity){
	
	initUserMz('','a_mz');
	$("#userPrimaryKey").text("学工号");
    $("#xh").attr("placeholder","请填写用户学工号");
    /*** 显示选择部门的div ***/
    $("#checkedDepartDiv").show();
    $("#uncheckedDepartDiv").show();
    /*** 隐藏填写当前用户孩子的信息***/
    $("#a_childList").empty();
    $("#a_childList").hide();
    if(uidentity == 3){
        getProviceList();
        $("#a_jg_div").show();
        $("#a_address_div").show();
        $("#a_xjh_div").show();
        $("#s_a_idtype_div").show();
        $("#idType_div").hide();//隐藏证件信息
        /***隐藏手机号码***/
        $("#a_userMobile_div").hide();
        /***修改相应的提示 ***/
        $("#a_idNumber").html("身份证号码");
        $("#zjhm").attr("placeholder","请填写用户身份证件号码");
        $("#stu_p_div").show();
    }else {
    	//getProviceList();
        $("#a_jg_div").show();
        $("#a_address_div").hide();
        $("#a_xjh_div").hide();
        $("#s_a_idtype_div").hide();
         $("#idType_div").show();//显示证件信息
        $("#a_idNumber").html("证件号码");
        $("#zjhm").attr("placeholder","请填写用户证件号码");
        /***显示手机号码***/
        $("#a_userMobile_div").show();
        /*学生状态*/
        $("#stu_p_div").hide();
            
    }
	
	
	/*if (uidentity == 2){
            $("#userPrimaryKey").text("手机号");
            $("#xh").attr("placeholder","请填写用户手机号");
            
            $("#checkedDepartDiv").hide();
            $("#uncheckedDepartDiv").hide();
            //*隐藏手机号码
            //$("#a_userMobile_div").hide();
           // 显示填写当前用户孩子的信息，同时默认增加一行填写孩子的信息 
            $("#a_childList").empty();
            $("#a_childList").show();
            addRowToChildList('a');
            getProviceList();
            $("#a_jg_div").show();
            $("#a_address_div").show();
            // 证件类型的信息提示 
            $("#a_idNumber").html("证件号码");
            $("#zjhm").attr("placeholder","请填写用户证件号码");
            $("#a_xjh_div").hide();
            $("#a_userMobile_div").hide();
       }*/
}

/***
 * 46 重置密码
 * 
 */

function resetPass(account,userID,schoolID){

	informationAlert_confirmAndCancelButton("saveResetPass(\""+account+"\","+userID+","+schoolID+")","确认要重置密码？")
	
}

//重置密码
function saveResetPass(account,userID,schoolID){
	var msg = {};
	msg.account = '123456';//account.toString().substring(1,account.length);
    msg.userId = userID;
    msg.schoolID = schoolID;
	msg.appName="login_ResetPassword";

    serverFromJSONData(msg,true).then(function (success) {
    	if(success.msgState == 200){
	            informationAlert_OnlyConfirmButton_NOT_REFRESH("重置密码成功！新密码为123456,请登录后尽快修改！");
        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH("重置密码失败，原因："+success.msg);
	        }
		}),function (error) {
		        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/***
 * 初始化用户民族
 */
function initUserMz(mzName,ele){
	var mz = $("#"+ele);
    mz.empty();
    if(mzName==null){
	    var mzListStr = "<option selected='selected'>--请选择--</option>";
    }
    if (mzArray != null && mzArray.length != 0){
        $.each(mzArray,function(name,value) {
            if(value == mzName){
                mzListStr += "<option  selected='selected'>&nbsp;&nbsp;&nbsp;"+value+"&nbsp;&nbsp;&nbsp;</option>";
            }else{
                mzListStr += "<option>&nbsp;&nbsp;&nbsp;"+value+"&nbsp;&nbsp;&nbsp;</option>";
            }
        });
        mz.append(mzListStr);
    }
}



