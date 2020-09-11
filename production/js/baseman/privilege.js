/**
 * Created by ricardo on 2017-09-08.
 */
var xgh = "";// 学工号
var realName = "";// 真实姓名
var userType = "";// 用户类型
var userID;// 全局的用户id，临时记录操作的对象
var tempGroupID;// 临时的权限组id
var tempGroupName;// 临时的权限组名
var tempModelName;// 临时模块名称
var temoRoleName;//临时角色名称
var tempTagName;// 临时通知群组名称
var submitHaveModelPrivilegeList = new Array();
var submitNoHaveModelPrivilegeList = new Array();
var submitAddHaveModelPrivilegeList = new Array();
var submitAddNoHaveModelPrivilegeList = new Array();
var uploadImgBase64;// 临时上传图片base64格式
var xhx;

var pageSize = 10;// ，每页显示个数
var pageNo = 1;// 页码
var totalPage = 0;// 总页数
var schoolTagList = null;// 学校通知群组列表
var tempTagID;// 临时的通知群组id
var schoolPrivilegeList = null;//学校权限角色组列表

$(function(){

    /** 1、获取人员基础数据 **/
    var param = {};
    param.appName = "user_listUserData";
    queryUserBaseList(param);

    /***** 2、关闭按钮右侧弹出侧边框 *****/
    /*** 2.1 分配角色___关闭监听 ***/
    $("#sidebar-close").on('click', function () {
        $("#sucaihuo").trigger("sidebar:close");
        $("#sucaihuo").css("box-shadow","");
        //$("#privilegeInfo").trigger("sidebar:close",{speed: 10});
    });

    /*** 2.2 设置角色___关闭监听 ***/
    $("#ssidebar-close").on('click', function () {
        /*** 2.2.1、点击设置角色按钮弹出框的关闭按钮时，关闭弹出的侧边框，同时隐藏边框阴影效果 ***/
        $("#setPrivilege").trigger("sidebar:close");
        $("#setPrivilege").css("box-shadow","");
        $("#privilegeInfo").trigger("sidebar:close", {speed: 10});
        $("#newBuildPrivilege").trigger("sidebar:close", {speed: 10});
        
    });

    /*** 2.3 设置点击全选按钮详情监听 ***/
    $("#psidebar-close").on('click', function () {
        $("#privilegeInfo").trigger("sidebar:close");
        $("#privilegeInfo").css("box-shadow","");
    });

    /*** 2.4 关闭___新建角色___按钮监听 ***/
    $("#nsidebar-close").on('click',function () {
        $("#newBuildPrivilege").trigger("sidebar:close");
        $("#newBuildPrivilege").css("box-shadow","");
    });

    /*** 2.5 关闭___群组管理___按钮监听 ***/
    $("#userTag-sidebar-close").on("click",function () {
        $("#userTagManager").trigger("sidebar:close");
        $("#userTagManager").css("box-shadow","");
        //关闭过后清空数据
        $("#userTagNameSearch").val("");
    });

    /*** 2.6 关闭___群组管理___按钮监听 ***/
    $("#tmsidebar-close").on("click",function () {
        $("#tmsidebar-close").trigger("sidebar:close");
        $("#tmsidebar-close").css("box-shadow","");
        /*** 关闭群组管理时，同时关闭新建群组和群组详情 ***/
        $("#newBuildTag").trigger("sidebar:close", {speed: 10});
        $("#updateBuildTag").trigger("sidebar:close", {speed: 10});
    });

    /*** 2.7 关闭___新建群组___按钮监听 ***/
    $("#ntsidebar-close").on("click",function () {
        $("#ntsidebar-close").trigger("sidebar:close");
        $("#ntsidebar-close").css("box-shadow","");
    });

    /**** 2.8、关闭___通知组详情____按钮监听 **/
    $("#upsidebar-close").on("click",function () {
        $("#upsidebar-close").trigger("sidebar:close");
        $("#upsidebar-close").css("box-shadow","");
    });

    /** 3、搜索人员信息 **/
    $("#searchUserList").on("click",function(){
        xgh = $("#xgh").val();
        realName = $("#xm").val();
        userType = $("#userType").val();
        areaTable.api().ajax.reload();
    });

    /** 4、 初始化___分配角色___右边侧栏 **/
    $("#sucaihuo").sidebar({side: "right"});
    $(document).delegate('.toggle-sidebar', 'click', function () {
        /** 初始化右侧弹出框 **/
        var userBaseInfo = $(this).data('info');
        if(userBaseInfo != null && userBaseInfo != ''){
            userID = userBaseInfo.split("_")[0];
            xhx=userBaseInfo.split("_")[2];
            var userRealName = userBaseInfo.split("_")[1];
            $("#userRealName").text(userRealName);
        }else{
            $("#userRealName").text("undefined");
        }
         /** 4.1、循环展示现用户的角色列表 **/
         queryUserPrivilegeList(userID);
        $("#sucaihuo").trigger("sidebar:toggle");
        $("#sucaihuo").css("box-shadow","0px 0px 99px 1px #c0c0c0");
        return false;
    });

    /** 5、初始化___设置角色___右边侧栏 **/
    $("#setPrivilege").sidebar({side: "right"});
    $(document).delegate('.setPrivilege', 'click', function () {
        queryAllPrivilegeList();
       $("#setPrivilege").trigger("sidebar:toggle");
       $("#setPrivilege").css("box-shadow","0px 0px 99px 1px #c0c0c0");
        return false;
    });

    /** 6、初始化___点击权限组详情___右边侧栏 **/
    $("#privilegeInfo").sidebar({side: "right"});
    $(document).delegate('.privilegeDetail', 'click', function () {
        $("#privilegeInfo").trigger("sidebar:toggle");
        $("#privilegeInfo").css("box-shadow","0px 0px 99px 1px #c0c0c0");
        return false;
    });

    /*** 7、初始化___新建角色___右边侧栏 ***/
    $("#newBuildPrivilege").sidebar({side: "right"});
    $(document).delegate('.newRole', 'click', function () {
        $('#newGroupPrivilegeName').val('');
        getModelList();
        $("#newBuildPrivilege").trigger("sidebar:toggle");
        $("#newBuildPrivilege").css("box-shadow","0px 0px 99px 1px #c0c0c0");
        return false;
    });

    /** 8、初始化___用户通知群组管理___右边侧栏 **/
    $("#userTagManager").sidebar({side: "right"});
    $(document).delegate('.userTagManager-sidebar', 'click', function () {
        /** 初始化右侧弹出框 **/
        var userBaseInfo = $(this).data('info');
        if(userBaseInfo != null && userBaseInfo != ''){
            userID = userBaseInfo.split("_")[0];
            var userRealName = userBaseInfo.split("_")[1];
            $("#tag_userRealName").text(userRealName);

            /*** 查询当前操作用户已加入的通知群组 ***/
            queryUserTagList(userID);
        }else{
            $("#tag_userRealName").text("undefined");
        }

        $("#userTagManager").trigger("sidebar:toggle");
        $("#userTagManager").css("box-shadow","0px 0px 99px 1px #c0c0c0");
        return false;
    });

    /** 9、初始化___群组管理___右边侧栏 **/
    $("#tagManager").sidebar({side: "right"});
    $(document).delegate('.tagManager', 'click', function () {
        querySchoolTagList();
        $("#tagManager").trigger("sidebar:toggle");
        $("#tagManager").css("box-shadow","0px 0px 99px 1px #c0c0c0");
        return false;
    });

    /** 10、初始化___新建群组___右边侧栏 **/
    $("#newBuildTag").sidebar({side: "right"});
    $(document).delegate('.newBuildTag', 'click', function () {
        reloadNewBuildTag();
        $("#newBuildTag").trigger("sidebar:toggle");
        $("#newBuildTag").css("box-shadow","0px 0px 99px 1px #c0c0c0");
        return false;
    });

    /*** 11、初始化___群组信息修改____右边侧栏 ***/
    $("#updateBuildTag").sidebar({side: "right"});
    $(document).delegate('.updateBuildTag', 'click', function () {
        $("#updateBuildTag").trigger("sidebar:toggle");
        $("#updateBuildTag").css("box-shadow","0px 0px 99px 1px #c0c0c0");
        return false;
    });

    /** 9、修改权限组信息 **/
    $("#updateGroup").on("click",function(){
        updateGroup();
    });

    /*** 8、回车搜索模块列表 **/
    $('#privilegeGroupModelSearch').bind('keypress', function (event) {
        if (event.keyCode == "13") {
            tempModelName = $("#privilegeGroupModelSearch").val();
            getPrivilegeGroupInfo(tempGroupID);
        }
    });
    
    /*** 9、回车搜索角色名称 ***/
    $("#roleNameSearch").bind('keypress',function (event) {
        if (event.keyCode == "13") {
            temoRoleName = $("#roleNameSearch").val();
            queryAllPrivilegeList();
        }
    });

    /*** 9、回车搜索角色名称，分配角色按钮弹窗 ***/
    $("#roleNameSearch2").bind('keypress',function (event) {
        if (event.keyCode == "13") {
            temoRoleName = $("#roleNameSearch2").val();
            querySchoolPrivilegeList();
        }
    });


    /*** 10、新建角色时回车筛选 ***/
    $("#nprivilegeGroupModelSearch").bind('keypress',function (event) {
        if(event.keyCode == "13") {
            temoRoleName = $("#nprivilegeGroupModelSearch").val();
            getModelList();
        }
    });

    /*** 11、增加新的权限组监听事件 ***/
    $("#addGroup").on("click",function () {
        addNewGroup();
    });


    /*** 12、新建权限组后刷新按钮***/
    $("#reload").on("click",function () {
        queryAllPrivilegeList();
    });

    /*** 13、回车搜索群组名称列表 ***/
    $("#userTagNameSearch").bind('keypress',function (event) {
        if(event.keyCode == "13") {
            tempTagName = $("#userTagNameSearch").val();
            queryUserTagList(userID);
        }
    });

    /*** 13、回车搜索群组名称列表 ***/
    $("#tagNameSearch").bind('keypress',function (event) {
        if(event.keyCode == "13") {
            tempTagName = $("#tagNameSearch").val();
            querySchoolTagList();
        }
    });

    /*** 14、文本框内容改变事件 ***/
    $("#icons").live('change', function(){
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
            $("#tagpic").attr("src", objUrl); //将图片路径存入src中，显示出图片
        }
    });

    /*** 15、文本框内容改变事件 ***/
    $("#up_icons").live('change', function(){
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
            $("#up_tagpic").attr("src", objUrl); //将图片路径存入src中，显示出图片
        }
    });

    /*** 15、点击添加群组按钮 ***/
    $("#addTag").on("click",function(){

        var newTagName = $("#newTagName").val();

        if(newTagName == null || newTagName == ''){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("通知群组名称不能为空，请填写通知群组名称!");
            return false;
        }

        if (uploadImgBase64 != null && uploadImgBase64 != ""){
            var param = {};
            param.appName = "image_uploadImag";
            var imgList = new Array();
            imgList.push(uploadImgBase64);
            param.imgList = imgList;

            serverFromJSONData(param,true).then(function (response) {
                if(response.msgState == 200 && response.data !=null && response.data != ''){
                    if (response.data.length == 1){
                        addTag(newTagName,response.data[0]);
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
            addTag(newTagName,"");
        }
    });

    /*** 16、点击修改群组按钮 ***/
    $("#updateTag").on("click",function(){

        var updateTagName = $("#updateTagName").val();

        if(updateTagName == null || updateTagName == ''){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("通知群组名称不能为空，请填写通知群组名称!");
            return false;
        }

        if (uploadImgBase64 != null && uploadImgBase64 != ""){
            var param = {};
            param.appName = "image_uploadImag";
            var imgList = new Array();
            imgList.push(uploadImgBase64);
            param.imgList = imgList;

            serverFromJSONData(param,true).then(function (response) {
                if(response.msgState == 200 && response.data !=null && response.data != ''){
                    if (response.data.length == 1){
                        updateTag(updateTagName,response.data[0],tempTagID);
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
            updateTag(updateTagName,"",tempTagID);
        }
    });

    /******** 16、通知群组分页事件监听 ********/

    $("#index-page").click(function(){
        pageNo = 1;
        $('#upper-page').css('cursor','Auto').css("font-weight","normal");
        if(totalPage > 1){
            $('#next-page').css('cursor','pointer').css("font-weight","bold");
        }
        buildSchoolTagPageList(schoolTagList,pageSize,pageNo);
    });
    $("#upper-page").click(function(){
        if (pageNo > 1){
            pageNo --;
            buildSchoolTagPageList(schoolTagList,pageSize,pageNo);
        }
        if(pageNo <= totalPage){
            $('#upper-page').css('cursor','Auto').css("font-weight","normal");
            $('#next-page').css('cursor','pointer').css("font-weight","bold");
        }
    });
    $("#next-page").click(function(){
        if (pageNo < totalPage){
            pageNo ++;
            buildSchoolTagPageList(schoolTagList,pageSize,pageNo);
        }
        if(pageNo >= totalPage){
            $('#upper-page').css('cursor','pointer').css("font-weight","bold");
            $('#next-page').css('cursor','Auto').css("font-weight","normal");
        }
    });
    $("#last-page").click(function(){
        if (totalPage > 1){
            $('#upper-page').css('cursor','pointer').css("font-weight","bold");
        }
        $('#next-page').css('cursor','Auto').css("font-weight","normal");
        pageNo = totalPage;
        buildSchoolTagPageList(schoolTagList,pageSize,pageNo);
    });

    /******** 17、权限角色分页事件监听 ********/

    $("#r_index-page").click(function(){
        pageNo = 1;
        $('#r_upper-page').css('cursor','Auto').css("font-weight","normal");
        if(totalPage > 1){
            $('#r_next-page').css('cursor','pointer').css("font-weight","bold");
        }
        buildPrivilegeList(schoolPrivilegeList,pageSize,pageNo);
    });
    $("#r_upper-page").click(function(){
        if (pageNo > 1){
            pageNo --;
            buildPrivilegeList(schoolPrivilegeList,pageSize,pageNo);
        }
        if(pageNo <= totalPage){
            $('#r_upper-page').css('cursor','Auto').css("font-weight","normal");
            $('#r_next-page').css('cursor','pointer').css("font-weight","bold");
        }
    });
    $("#r_next-page").click(function(){
        if (pageNo < totalPage){
            pageNo ++;
            buildPrivilegeList(schoolPrivilegeList,pageSize,pageNo);
        }
        if(pageNo >= totalPage){
            $('#r_upper-page').css('cursor','pointer').css("font-weight","bold");
            $('#r_next-page').css('cursor','Auto').css("font-weight","normal");
        }
    });
    $("#r_last-page").click(function(){
        if (totalPage > 1){
            $('#r_upper-page').css('cursor','pointer').css("font-weight","bold");
        }
        $('#r_next-page').css('cursor','Auto').css("font-weight","normal");
        pageNo = totalPage;
        buildPrivilegeList(schoolPrivilegeList,pageSize,pageNo);
    });

	//进行角色的查重验证
	$("#newGroupPrivilegeName").blur(function(){
  		//发送ajax请求
  		var msg = {};
	    msg.appName = "privilege_addRoleGroupValidate";
	    msg.roleName=$("#newGroupPrivilegeName").val();
	    var jsonStr = buildRequestParam(msg);
	    $.ajax({
	        type: 'POST',
	        url: serverBaseUrl,
	        data: jsonStr,
	        dataType: "json",
	        async:false,
	        success: function (success) {
	            if(success.data != null){
	            		informationAlert_OnlyConfirmButton_NOT_REFRESH('权限名称名不能重复');
	            } 
	        },
	        beforeSend: function (xhr) {
	            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
	            xhr.setRequestHeader("token", static_token);
	        }
	    });
    
	});
})


/**
 * 1、初始化人员列表
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
                data.userType = userType;
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
                "targets": 4,
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
                "targets":6,
                render:function (data,type,full,meta) {
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
                "targets":8,
                render:function (data,type,full,meta) {
                    var userBaseInfo = full.userID +"_"+full.realName+"_"+full.xgh;
                    return "<a class='toggle-sidebar bbtn btn-info btn-xs departListName' href='#' data-info="+userBaseInfo+"><i class='fa fa-pencil'></i>分配角色</a>" +
                           "<a class='userTagManager-sidebar bbtn btn-info btn-xs departListName' href='#' data-info="+userBaseInfo+"><i class='fa fa-pencil'></i>群组分配</a>";
                }
            }
        ]
    });
}

/**
 *  2、查询用户已加入的通知群组
 */
function queryUserTagList(userID){
    var param = {};
    param.appName="tag_queryUserTagList";
    param.userID = userID;
    if(tempTagName != null && tempTagName != ''){
        param.tagName = tempTagName;
    }
    serverFromJSONData(param,true).then(function (response) {
        var tableObj = $("#userTagListInfoTable");
        tableObj.empty();
        var trs = "";
        var dataList = response.data;
        if(dataList !=null && dataList.length !=0){
            $.each(dataList,function(n,obj) {
                var tagName = obj.tagName;
                trs += "<tr style='height: 40px;'><td>" +
                    "<button class='btn' style='margin-left:15px;'>"+tagName+"</button>" +
                    "<a id='userPrivilege' onclick='removeUserTagGroup("+obj.tagID+","+msg_accept_type+")' class='userPrivilege'>移除</a></td></tr>";
            });
        }else{
            trs += "<tr style='height: 40px;'><td><lable style='margin-left:15px;'>当前用户暂未加入任何通知组!</lable></td></tr>";
        }
        tableObj.append(trs);
        queryUserNotJoinAllTagList(msg_accept_type);
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
    };
}

/**
 * 3、查询用户已经拥有的权限组
 */
function queryUserPrivilegeList(userID){
    var param = {};
    param.appName = "privilege_getUserGroup";
    param.userID = userID;
	serverFromJSONData(param,true).then(function (response) {
        var tableObj = $("#userPrivilegeInfoTable");
        tableObj.empty();
        var trs = "";
        var dataList = response.data;
        if(dataList !=null && dataList.length !=0){
            $.each(dataList,function(n,obj) {
                var groupName = obj.groupName;
                trs += "<tr style='height: 40px;'><td>" +
                        "<button class='btn' style='margin-left:15px;'>"+groupName+"</button>" +
                        "<a id='userPrivilege' onclick='removeUserPrivilegeGroup("+obj.groupId+","+dataList.length+")' class='userPrivilege'>移除</a></td></tr>";
            });
        }else{
            trs += "<tr style='height: 40px;'><td><lable style='margin-left:15px;'>当前用户暂为加入任何权限组!</lable></td></tr>";
        }
        tableObj.append(trs);
        /** 4.2、循环展示学校现有的角色列表 **/
        querySchoolPrivilegeList();
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
    };
}

/**
 * 4、查询用户未分配的权限列表
 */
function querySchoolPrivilegeList(){
    var param = {};
    param.appName="privilege_getAllGroup";
    param.userID=userID;
    if(temoRoleName !=null && temoRoleName !=''){
        param.roleName = temoRoleName;
    }
    serverFromJSONData(param,true).then(function (response) {
        var tableObj = $("#schoolPrivilegeInfoTable");
        tableObj.empty();
        var trs = "";
        var dataList = response.data;
        if(dataList !=null && dataList.length !=0){
            $.each(dataList,function(n,obj) {
                var groupName = obj.groupName;
                trs += "<tr style='height: 40px;'><td><button class='btn' style='position:absolute;left:4%;width: 70%'>"+groupName+"</button>" +
                    "<a id='addUserPrivilegeGroup' onclick='addUserPrivilegeGroup("+obj.groupID+")' class='addPrivilegeButton'>添加</a></td></tr>";
            });
        }else{
            trs += "<tr style='height: 40px;'><td><lable style='margin-left:15px;'>当前用户暂无任何可加入的权限组!</lable></td></tr>";
        }
        tableObj.append(trs);
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
    };
}

/**
 * 5、查询学校全部角色列表
 */
function queryAllPrivilegeList(){
    /*** 开始先还原现场 ***/
    pageNo = 1;
    totalPage = 0;
    /*** 还原结束 ***/
    var param = {};
    param.appName="privilege_getAllGroup";
    if(temoRoleName !=null && temoRoleName !=''){
        param.roleName = temoRoleName;
    }
    serverFromJSONData(param,true).then(function (response) {
        schoolPrivilegeList = response.data;
        totalPage = getTotalPage(schoolPrivilegeList,pageSize);
        if(pageNo == 1){
            $('#r_upper-page').css('cursor','Auto').css("font-weight","normal");
            $('#r_next-page').css('cursor','pointer').css("font-weight","bold");
        }
        if (totalPage == 1){
            $('#r_upper-page').css('cursor','Auto').css("font-weight","normal");
            $('#r_next-page').css('cursor','Auto').css("font-weight","normal");
        }
        buildPrivilegeList(schoolPrivilegeList,pageSize,pageNo);
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
    };
}

/***
 * 6、抽离权限角色组的数据生成
 * @param dataList
 * @param pageSize
 * @param pageNo
 */
function buildPrivilegeList(dataList,pageSize,pageNo){
    var tableObj = $("#allPrivilegeInfoTable");
    tableObj.empty();
    var trs = "";
    if(dataList !=null && dataList.length !=0){
        /*** 21.1、 根据页码获取当前页应显示的数据 ***/
        var curPagePrivilegeList = pagination(pageNo,pageSize,dataList);
        if (curPagePrivilegeList != null && curPagePrivilegeList.length != 0){
            $.each(curPagePrivilegeList,function(n,obj) {
                var groupName = obj.groupName;
                var groupID = obj.groupID;
                trs += "<tr style='height: 40px;'><td>" +
                    "<button onclick='setGroupName(\""+groupName+"\","+groupID+")' class='btn privilegeDetail' style='position:absolute;left:4%;width: 70%'>"+groupName+"</button>" +
                    "<a id='delPrivilegeGroup' onclick='delPrivilegeGroups("+obj.groupID+")' class='addPrivilegeButton'>删除</a></td></tr>";
            });
        }else{
            trs += "<tr style='height: 40px;'><td><lable style='margin-left:15px;'>数据被您掏空了......</lable></td></tr>";
        }
    }else{
        trs += "<tr style='height: 40px;'><td><lable style='margin-left:15px;'>当前学校暂无任何权限组!</lable></td></tr>";
    }
    tableObj.append(trs);
}

/**
 * 6、查询用户待加入的通知群组
 *    msgrpType：可接收或者可发送的类型
 */
function queryUserNotJoinAllTagList(msgrpType){
    var param = {};
    param.appName="tag_queryAllTagList";
    param.userID = userID;
    param.msgrpType = msgrpType;
    serverFromJSONData(param,true).then(function (response) {
        var tableObj = $("#schoolTagInfoTable");
        tableObj.empty();
        var trs = "";
        var dataList = response.data;
        if(dataList !=null && dataList.length !=0){
            $.each(dataList,function(n,obj) {
                var tagName = obj.tagName;
                var tagID = obj.tagID;
                trs += "<tr style='height: 40px;'><td>" +
                    "<button onclick='setGroupName(\""+tagName+"\","+tagID+")' class='btn' style='position:absolute;left:4%;width: 70%'>"+tagName+"</button>" +
                    "<a id='delPrivilegeGroup' onclick='addUserTagGroup("+obj.tagID+","+msgrpType+")' class='addPrivilegeButton'>添加</a></td></tr>";
            });
        }else{
            trs += "<tr style='height: 40px;'><td><lable style='margin-left:15px;'>当前用户暂无任何可加入的通知群组!</lable></td></tr>";
        }
        tableObj.append(trs);
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
    };
}

/**
 * 7、增加用户权限组
 */
function addUserPrivilegeGroup(privilegeID){
    var param = {};
    param.appName = "privilege_addUserPrivilegeGroup";
    param.groupID = privilegeID;
    param.userID = userID;
    serverFromJSONData(param,true).then(function (response) {
        if(response.msgState == 200){
            queryUserPrivilegeList(userID);
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
    };
}

/**
 * 7、增加用户通知组
 */
function addUserTagGroup(tagID,msgrpType){
    var param = {};
    param.appName = "tag_addUserTag";
    param.tagId = tagID;
    param.userID = userID;
    param.msgrpType = msgrpType;
    serverFromJSONData(param,true).then(function (response) {
        /*** 增加成功后，刷新用户尚未加入的通知群组 ***/
        if(response.msgState == 200){
            if(msgrpType == 1){
                queryUserTagList(userID);
            }else {
                queryUserPublishTagList(userID);
            }
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(response.msg);
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
    };
}

/**
 * 8、移除用户指定的权限组
 */
function removeUserPrivilegeGroup(groupID,length){
	if(length>1){
		var param = {};
		debugger;
		if(xhx=="006550"){
			informationAlert_OnlyConfirmButton_NOT_REFRESH("初始管理员角色不能删除!");
			return;
		}
	    param.appName = "privilege_removeUserPrivilegeGroup";
	    param.groupID = groupID;
	    param.userID = userID;
	    serverFromJSONData(param,true).then(function (response) {
	        if(response.msgState == 200){
	            queryUserPrivilegeList(userID);
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH("移除权限失败，失败原因：" + response.msg);
	        }
	    }),function (error) {
	        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
	    };
	}
    
}

/**
 * 9、移除用户已加入的通知群组
 * @param tagID
 * @param msgrpType
 */
function removeUserTagGroup(tagID,msgrpType){

    var param = {};
    param.appName = "tag_removeUserTag";
    param.tagId = tagID;
    param.userID = userID;
    console.log(tagID+"-----"+userID);
//  if(){
//  	
//  }
    param.msgrpType = msgrpType;
    serverFromJSONData(param,true).then(function (response) {
        if(response.msgState == 200){
            if(msgrpType == 1){
                queryUserTagList(userID);
            }else{
                queryUserPublishTagList(userID);
            }
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("移除用户通知群组失败，失败原因：" + response.msg);
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
    };
}
function delPrivilegeGroups(groupid) {
	informationAlert_confirmAndCancelButton("delPrivilegeGroup("+groupid+")","是否确认删除");
}
/**
 * 10、删除权限组
 */
function delPrivilegeGroup(groupid){
	
    var param = {};
    param.appName = "privilege_delPrivilegeGroup";
    param.groupID = groupid;
    serverFromJSONData(param,true).then(function (response) {
        if(response.msgState == 200){
            queryAllPrivilegeList();
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("移除用户权限组失败，失败原因：" + response.msg);
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
    };
}

/**
 * 11、刷新按钮（用户权限弹出框）
 */
function reloadBtn(){
    queryUserPrivilegeList(userID);
}

/**
 * 12、传递参数
 * @param groupName
 * @param groupId
 */
function setGroupName(groupName,groupId){
    $("#groupInfoName").text(groupName);
    tempGroupID = groupId;
    getPrivilegeGroupInfo(groupId);
}

/**
 * 13、获取权限组下对应模块权限信息
 * @param groupId
 */
function getPrivilegeGroupInfo(groupId){
    $("#groupPrivilegeList").empty();
    var param = {};
    param.appName = "privilege_getRoleGroupPrivilegeList";
    param.groupID = groupId;
    if(tempModelName != null && tempModelName!=''){
        param.modelName=tempModelName;
    }
    serverFromJSONData(param,true).then(function (response) {
        var modelList = response.data.manGroupModelPrivilegeList;
        var appModelList = response.data.appGroupModelPrivilegeList;
        var contents = "<div style='margin:5px 0 10px 10px;height: 20px;color: #2494f2;font-weight: bold'>平台管理端（管理权限配置）：</div>";
        contents +="<div class='other_underline'></div>";
        var listSize = 0;
        /** 循环权限列表 **/
        if(modelList !=null && modelList.length !=0){
            $.each(modelList,function(n,obj) {
                contents += "<label style='margin:5px 0 5px 15px;height: 20px;font-size: 15px'>"+obj.modelName+"</label>";
                var childList = obj.childPrivilegeGroupList;
                /** 循环子菜单 **/
                if (childList !=null && childList.length!=0){
                    contents += "<table class='groupPrivilege-table table-tr-border'>";
                    $.each(childList,function (nn,oobj) {
                        listSize ++;
                        var expandModuleList = oobj.childPrivilegeGroupList;
                        var haveListFlag = false;
                        if(expandModuleList != null && expandModuleList.length != 0){
                            haveListFlag = true;
                        }
                        /*** 如果有下级子列表，则加粗，同时取消后面的权限管理按钮 ***/
                        if(haveListFlag){
                            contents += "<tr class='table-tr-border-1'>"+
                                          "<td class='table-td-h'>"+oobj.modelName+"</td>" +
                                          "<td class='table-td-btn'></td>"+
                                        "</tr>";
                        }else{
                            contents += "<tr class='table-tr-border'>"+
                                          "<td class='table-td-h'>"+oobj.modelName+"</td>" +
                                          "<td class='table-td-btn'>" +buildBtn(oobj.modelID,oobj.privilege)+ "</td>"+
                                        "</tr>";
                        }

                        /** 获取当前模块的子模块列表 **/
                        if(haveListFlag){
                            $.each(expandModuleList,function (nnn,ooobj) {
                                listSize ++;
                                contents += "<tr class='table-tr-border'>" +
                                    "<td class='table-td-td-h'>"+ooobj.modelName+"</td>" +
                                    "<td class='table-td-btn'>" +buildBtn(ooobj.modelID,ooobj.privilege)+ "</td>"+
                                    "</tr>";
                            });
                        }
                    });
                    contents += "</table>";
                }
            });
        }
        /*** app端权限组模块列表 ***/
        contents += "<div style='margin:10px 0 10px 10px;height: 20px;color: #2494f2;font-weight: bold'>平台移动端（可视化权限配置）：</div>";
        contents +="<div class='other_underline'></div>";
        if(appModelList !=null && appModelList.length !=0){
            $.each(appModelList,function(n,ooobj) {
                listSize ++;
                contents += "<label style='margin:5px 0 5px 20px;height: 20px;'>"+ooobj.modelName+"</label>";
                /*** APP端暂无子模块 ***/
                contents += "<table class='groupPrivilege-table table-tr-border'>";
                contents += "<tr class='table-tr-border'>" +
                            "<td class='table-td-h'>"+ooobj.modelName+"</td>" +
                            "<td class='table-td-btn'>" +buildBtn(ooobj.modelID,ooobj.privilege)+ "</td>"
                            "</tr>";
                contents += "</table>";
            });
        }
        contents += "<div style='margin-top: 50px;'></div>";
        /*submitHaveModelPrivilegeList = new Array(listSize);
        submitNoHaveModelPrivilegeList = new Array(listSize);*/
        $("#groupPrivilegeList").append(contents);
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}

/**
 * 14、计算模块权限的修改情况
 * @param dom
 */
function oxBtnClick(dom){
    /** 获取末尾变量 **/
    var startFlag = dom.id.substring(0,dom.id.length-1);
    var endFlag = dom.id.substring(dom.id.length-1,dom.id.length);
    if (endFlag == 'q'){
        $("#"+startFlag+"q").css("backgroundColor","#6DC56D");
        $("#"+startFlag+"c").css({backgroundColor:"",color:"#444"});
        var modelid = dom.id.split("_")[1];
        if($.inArray(modelid,submitHaveModelPrivilegeList) == -1){
            submitHaveModelPrivilegeList.push(modelid);
            submitNoHaveModelPrivilegeList.splice($.inArray(modelid,submitNoHaveModelPrivilegeList),1);
        }
    }
    if (endFlag == 'c'){
        $("#"+startFlag+"c").css("backgroundColor","#6DC56D");
        $("#"+startFlag+"q").css({backgroundColor:"",color:"#444"});
        var modelid = dom.id.split("_")[1];
        if($.inArray(modelid,submitNoHaveModelPrivilegeList) == -1){
            submitNoHaveModelPrivilegeList.push(modelid);
            submitHaveModelPrivilegeList.splice($.inArray(modelid,submitHaveModelPrivilegeList),1);
        }
    }
}

/**
 * 15、计算指定模块的权限修改情况
 * @param modelid
 * @param privilege
 * @returns {string}
 */
function buildBtn(modelid,privilege){
    if(privilege == 1){
        return "<div class='btn-group'>"+
            "<button id='m_"+modelid+"_q' type='button' onclick='oxBtnClick(this)' style='background:#6Dc56D;color:#444;' class='btn btn-default ox-btn'>" +
            "<i class='glyphicon glyphicon-ok'></i>" +
            "</button>"+
            "<button id='m_"+modelid+"_c' type='button' onclick='oxBtnClick(this)' style='color:#444;' class='btn btn-default ox-btn'>" +
            "<i class='glyphicon glyphicon-remove'></i>" +
            "</button>"+
            "</div>";
    }else{
        return "<div class='btn-group'>"+
            "<button id='m_"+modelid+"_q' type='button' onclick='oxBtnClick(this)' style='color:#444;' class='btn btn-default ox-btn'>" +
            "<i class='glyphicon glyphicon-ok'></i>" +
            "</button>"+
            "<button id='m_"+modelid+"_c' type='button' onclick='oxBtnClick(this)' style='background:#6Dc56D;color:#fff;' class='btn btn-default ox-btn'>" +
            "<i class='glyphicon glyphicon-remove'></i>" +
            "</button>"+
            "</div>";
    }
}

/** 
 * 16、新增角色组 
 **/
function addBtnClick(dom){
    /** 获取末尾变量 **/
    var startFlag = dom.id.substring(0,dom.id.length-1);
    var endFlag = dom.id.substring(dom.id.length-1,dom.id.length);
    if (endFlag == 'q'){
        $("#"+startFlag+"q").css("backgroundColor","#6DC56D");
        $("#"+startFlag+"c").css({backgroundColor:"",color:"#444"});
        var modelid = dom.id.split("_")[1];
        if($.inArray(modelid,submitAddHaveModelPrivilegeList) == -1){
            submitAddHaveModelPrivilegeList.push(modelid);
            submitAddNoHaveModelPrivilegeList.splice($.inArray(modelid,submitAddNoHaveModelPrivilegeList),1);
        }
    }
    if (endFlag == 'c'){
        $("#"+startFlag+"c").css("backgroundColor","#6DC56D");
        $("#"+startFlag+"q").css({backgroundColor:"",color:"#444"});
        var modelid = dom.id.split("_")[1];
        if($.inArray(modelid,submitAddNoHaveModelPrivilegeList) == -1){
            submitAddNoHaveModelPrivilegeList.push(modelid);
            submitAddHaveModelPrivilegeList.splice($.inArray(modelid,submitAddHaveModelPrivilegeList),1);
        }
    }
}

/** 17、构建按钮 **/
function buildAddBtn(modelid,privilege){
    if(privilege == 1){
        return "<div class='btn-group'>"+
            "<button id='m_"+modelid+"_q' type='button' onclick='addBtnClick(this)' style='background:#6Dc56D;color:#444;' class='btn btn-default ox-btn'>" +
            "<i class='glyphicon glyphicon-ok'></i>" +
            "</button>"+
            "<button id='m_"+modelid+"_c' type='button' onclick='addBtnClick(this)' style='color:#444;' class='btn btn-default ox-btn'>" +
            "<i class='glyphicon glyphicon-remove'></i>" +
            "</button>"+
            "</div>";
    }else{
        return "<div class='btn-group'>"+
            "<button id='m_"+modelid+"_q' type='button' onclick='addBtnClick(this)' style='color:#444;' class='btn btn-default ox-btn'>" +
            "<i class='glyphicon glyphicon-ok'></i>" +
            "</button>"+
            "<button id='m_"+modelid+"_c' type='button' onclick='addBtnClick(this)' style='background:#6Dc56D;color:#fff;' class='btn btn-default ox-btn'>" +
            "<i class='glyphicon glyphicon-remove'></i>" +
            "</button>"+
            "</div>";
    }
}

/**
 * 18、修改权限信息
 */
function updateGroup(){
    var param = {};
    param.appName = "privilege_updateRoleGroupPrivilege";
    if(!checkArrayIsEmpty(submitHaveModelPrivilegeList)){
        	param.submitHaveModelPrivilegeList = submitHaveModelPrivilegeList.map(function(data){return +data});
    }
    if(!checkArrayIsEmpty(submitNoHaveModelPrivilegeList)){
        	param.submitNoHaveModelPrivilegeList = submitNoHaveModelPrivilegeList.map(function(data){return +data});
    }
    param.groupID = tempGroupID;
    serverFromJSONData(param,true).then(function (response) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("修改权限组权限数据成功!");
    });
}

/**
 * 19、增加权限组时读取模块列表
 */
function getModelList(){
    $("#ngroupPrivilegeList").empty();
    var param = {};
    param.appName = "privilege_getAppManGroupPrivilegeList";
    if(tempModelName != null && tempModelName!=''){
        param.modelName=tempModelName;
    }
    serverFromJSONData(param,true).then(function (response) {
        var modelList = response.data.manGroupModelPrivilegeList;
        var appModelList = response.data.appGroupModelPrivilegeList;
        var contents = "<div style='margin:5px 0 10px 10px;height: 20px;color: #2494f2;font-weight: bold'>平台管理端（管理权限配置）：</div>";
        contents +="<div class='other_underline'></div>";
        var listSize = 0;
        /** 循环权限列表 **/
        if(modelList !=null && modelList.length !=0){
            $.each(modelList,function(n,obj) {
                contents += "<label style='margin:5px 0 5px 15px;height: 20px;font-size: 15px;'>"+obj.modelName+"</label>";
                var childList = obj.childPrivilegeGroupList;
                /** 循环子菜单 **/
                if (childList !=null && childList.length!=0){
                    contents += "<table class='groupPrivilege-table table-tr-border'>";
                    $.each(childList,function (nn,oobj) {
                        listSize ++;
                        var existsFlag = false;
                        var childModuleList = oobj.childPrivilegeGroupList;
                        if(childModuleList!=null && childModuleList.length!=0){
                            existsFlag = true;
                        }

                        if(existsFlag){
                            contents += "<tr class='table-tr-border-1'>" +
                                          "<td class='table-td-h'>"+oobj.modelName+"</td>" +
                                          "<td class='table-td-btn'></td>"+
                                       "</tr>";
                        }else{
                            contents += "<tr class='table-tr-border'>" +
                                          "<td class='table-td-h'>"+oobj.modelName+"</td>" +
                                          "<td class='table-td-btn'>" +buildAddBtn(oobj.modelID,oobj.privilege)+ "</td>"
                                        "</tr>";
                        }
                        /*** 循环第三级菜单 ***/
                        if(existsFlag){
                            $.each(childModuleList,function (nnn,ooobj) {
                                listSize ++;
                                contents += "<tr class='table-tr-border'>" +
                                              "<td class='table-td-td-h'>"+ooobj.modelName+"</td>" +
                                              "<td class='table-td-btn'>" +buildAddBtn(ooobj.modelID,ooobj.privilege)+ "</td>"+
                                           "</tr>";
                            });
                        }
                    });
                    contents += "</table>";
                }
            });
        }
        /*** app端权限组模块列表 ***/
        contents += "<div style='margin:10px 0 10px 10px;height: 20px;color: #2494f2;font-weight: bold'>平台移动端（可视化权限配置）：</div>";
        contents +="<div class='other_underline'></div>";
        if(appModelList !=null && appModelList.length !=0){
            $.each(appModelList,function(n,ooobj) {
                listSize++;
                contents += "<label style='margin:5px 0 5px 20px;height: 20px;'>"+ooobj.modelName+"</label>";
                /*** APP端暂无子模块 ***/
                contents += "<table class='groupPrivilege-table table-tr-border'>";
                contents += "<tr class='table-tr-border'>" +
                    "<td class='table-td-h'>"+ooobj.modelName+"</td>" +
                    "<td class='table-td-btn'>" +buildAddBtn(ooobj.modelID,ooobj.privilege)+ "</td>"
                "</tr>";
                contents += "</table>";
            });
        }

        contents += "<div style='margin-top: 50px;'></div>";
       /* submitAddHaveModelPrivilegeList = new Array(listSize);
        submitAddNoHaveModelPrivilegeList = new Array(listSize);*/
        $("#ngroupPrivilegeList").append(contents);
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}

/**
 * 20、增加权限组
 */
function addNewGroup(){
    var newGroupName = $("#newGroupPrivilegeName").val();
    if(newGroupName != null && newGroupName != ''){
       var param = {};
        param.appName="privilege_addRoleGroupPrivilege";
        param.groupName=newGroupName;
        if(!checkArrayIsEmpty(submitAddHaveModelPrivilegeList)){
        	param.submitHaveModelPrivilegeList = submitAddHaveModelPrivilegeList.map(function(data){return +data});
        }
        if(!checkArrayIsEmpty(submitAddNoHaveModelPrivilegeList)){
        	param.submitNoHaveModelPrivilegeList = submitAddNoHaveModelPrivilegeList.map(function(data){return +data});;
        }
        serverFromJSONData(param,true).then(function (response) {
            if(response.msgState == 200){
                queryAllPrivilegeList();
                informationAlert_OnlyConfirmButton_NOT_REFRESH('增加权限组['+newGroupName+']成功！');
            }else{
                informationAlert_OnlyConfirmButton_NOT_REFRESH('增加权限组发生错误:'+response.msg);
            }
        });
    }else {
        $("#newGroupNameTips").innerHTML ="[必填]";
    }
}

/**
 * 21、查询学校全部通知群组列表
 */
function querySchoolTagList(){
    /***还原现场***/
    pageNo = 1;
    totalPage = 0;
    /***还原现场结束***/
    var param = {};
    param.appName="tag_querySchoolAllTagList";
    param.tagName = tempTagName;
    serverFromJSONData(param,true).then(function (response) {
        schoolTagList = response.data;
        totalPage = getTotalPage(schoolTagList,pageSize);
        if(pageNo == 1){
            $('#upper-page').css('cursor','Auto').css("font-weight","normal");
        }
        if (totalPage == 1){
            $('#next-page').css('cursor','Auto').css("font-weight","normal");
        }
        buildSchoolTagPageList(schoolTagList,pageSize,pageNo);
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
    };
}

/***
 * 22、抽离学校通知群组分页
 * @param dataList
 * @param pageSize
 * @param pageNo
 * @returns {string}
 */
function buildSchoolTagPageList(dataList,pageSize,pageNo){
    var tableObj = $("#allTagListTable");
    tableObj.empty();
    var trs = "";

    if(dataList !=null && dataList.length !=0){
        /*** 21.1、 根据页码获取当前页应显示的数据 ***/
        var curPageTagList = pagination(pageNo,pageSize,dataList);
        if (curPageTagList != null && curPageTagList.length != 0){
            $.each(curPageTagList,function(n,obj) {
                var tagName = obj.tagName;
                var tagID = obj.tagID;
                var tagIcon = obj.icon;
                trs += "<tr style='height: 40px;'><td>" +
                    "<button onclick='setTagName(\""+tagName+"\","+tagID+",\""+tagIcon+"\")' class='btn updateBuildTag' style='position:absolute;left:4%;width: 70%'>"+tagName+"</button>" +
                    "<a id='delPrivilegeGroup' onclick='commonDel(2,"+tagID+")' class='addPrivilegeButton'>删除</a></td></tr>";
            });
        }else{
            trs += "<tr style='height: 40px;'><td><lable style='margin-left:15px;'>数据被您掏空了......</lable></td></tr>";
        }
    }else{
        trs += "<tr style='height: 40px;'><td><lable style='margin-left:15px;'>当前学校暂无任何通知群组!</lable></td></tr>";
    }
    tableObj.append(trs);
}

/**
 * 23、删除通知组
 */
function delTagGroup(tagid){
    var param = {};
    param.appName = "tag_delSchoolTag";
    param.tagId = tagid;
    serverFromJSONData(param,true).then(function (response) {
        if(response.msgState == 200 && response.data == 1){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功!" );
            querySchoolTagList();
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除失败，失败原因：" + response.msg);
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
    };
}

/***
 * 24、添加通知群组
 * @param tagName
 * @param tagIcon
 */
function addTag(tagName,tagIcon){
    var param = {};
    param.appName = "tag_addSchoolTag";
    param.tagName = tagName;
    if(tagIcon != null && tagIcon != ''){
        param.tagIcon = tagIcon;
    }

    serverFromJSONData(param,true).then(function (response) {
        if(response.msgState == 200 && response.data == 1){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("增加通知群组"+tagName+"成功!");
            reloadNewBuildTag();
            /*** 重新加载学校的通知群组列表 ***/
            querySchoolTagList();
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("添加失败，失败原因：" + response.msg);
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
    };
}

/***
 * 25、重新刷新通知群组信息
 */
function reloadNewBuildTag(){
    $("#newTagName").val("");
    uploadImgBase64 = "";
    /***重新加载***/
    $('#tagpic').replaceWith('<img id="tagpic">');
    /*** 上传文件input框重新绑定一次 ***/
    $('#icons').replaceWith('<input id="icons" tabindex="3" size="5" name="files" class="file-prew" type="file"/>');
}

/***
 * 26、计算总页码
 * @param arrayList
 * @param pageSize
 * @returns {number}
 */
function getTotalPage(arrayList,pageSize){
    if (arrayList == null || arrayList.length == 0){
        return 0;
    }else {
        var dataListLength = arrayList.length;
        return dataListLength % pageSize != 0 ? (parseInt(dataListLength/pageSize))+1 : Math.ceil(dataListLength/pageSize);
    }
}

/***
 * 27、通用删除
 * @param modelTyle
 * @param id
 */
function commonDel(modelTyle,id){
    if(modelTyle == 1){
        informationAlert_confirmAndCancelButton();
    }else if (modelTyle == 2){
        informationAlert_confirmAndCancelButton('delTagGroup('+id+',)','是否确定要删除当前通知组?');
    }else{
        informationAlert_OnlyConfirmButton_NOT_REFRESH("操作错误，请稍后再试!");
    }
}

/**
 * 28、传递参数____点击通知组详情
 * @param tagName
 * @param tagId
 */
function setTagName(tagName,tagId,tagIcon){
    $("#updateTagName").val(tagName);
    tempTagID = tagId;
    $("#up_tagpic").attr("src", tagIcon);
}

/***
 * 29、修改通知群组
 * @param tagName
 * @param tagIcon
 */
function updateTag(tagName,tagIcon){
    var param = {};
    param.appName = "tag_updateSchoolTag";
    param.tagName = tagName;
    param.tagIcon = tagIcon;
    param.tagId = tempTagID;

    serverFromJSONData(param,true).then(function (response) {
        if(response.msgState == 200 && response.data == 1){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("修改通知群组"+tagName+"成功!");
            reloadNewBuildTag();
            /*** 重新加载学校的通知群组列表 ***/
            querySchoolTagList();
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("修改失败，失败原因：" + response.msg);
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
    };
}

/***
 * 30、提供点击指定tab时 底色的切换
 * @param id
 */
function buildTagColor(selectTag){
    var lis = document.getElementsByTagName('li');
    for (var i = 0; i < lis.length; i++) {
        lis[i].setAttribute('class','');
    };
    selectTag.setAttribute('class','select');
    /*** 更改元素的文字 ***/
    tagContentSwitch(selectTag.getAttribute("id"));
}

/***
 * 31、转换
 * @param tagType
 */
function tagContentSwitch(tagType){
    if(tagType == 1){
        /*** 修改标签的文字信息 ***/
        $("#acceptSendName").html("接收");
        $("#alreadyJoinAcceptTag").html("已加入");
        $("#notJoinAcceptTag").html("可加入");
        /*** 查询当前标签的用户已加入的通知群组列表 ***/
        queryUserTagList(userID);
    }else{
        $("#acceptSendName").html("发送");
        $("#alreadyJoinAcceptTag").html("已有可发送");
        $("#notJoinAcceptTag").html("可分配发送");
        /*** 查询当前标签的用户已有发送的通知群组列表 ***/
        queryUserPublishTagList(userID);
    }

}


/**
 *  32、查询用户可发送的通知群组
 */
function queryUserPublishTagList(userID){
    var param = {};
    param.appName="tag_queryUserPublishTag";
    param.userID = userID;
    if(tempTagName != null && tempTagName != ''){
        param.tagName = tempTagName;
    }
    serverFromJSONData(param,true).then(function (response) {
        var tableObj = $("#userTagListInfoTable");
        tableObj.empty();
        var trs = "";
        var dataList = response.data;
        if(dataList !=null && dataList.length !=0){
            $.each(dataList,function(n,obj) {
                var tagName = obj.tagName;
                trs += "<tr style='height: 40px;'><td>" +
                    "<button class='btn' style='margin-left:15px;'>"+tagName+"</button>" +
                    "<a id='userPrivilege' onclick='removeUserTagGroup("+obj.tagID+","+msg_publish_type+")' class='userPrivilege'>移除</a></td></tr>";
            });
        }else{
            trs += "<tr style='height: 40px;'><td><lable style='margin-left:15px;'>当前用户暂无可发送通知组!</lable></td></tr>";
        }
        tableObj.append(trs);
        queryUserNotJoinAllTagList(msg_publish_type);
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
    };
}