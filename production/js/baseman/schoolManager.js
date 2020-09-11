/**
 * Created by ricardo on 2017-09-08.
*/

var areaTable;
var schoolID;// 学校
var schoolName = "";// 学校名称
var pageSize = 10;// ，每页显示个数
var pageNo = 1;// 页码
var totalPage = 1;// 总页数
var cityCode = "110100";// 城市代码，默认北京
var proviceCode = "110000";//省份代码，默认北京
var uploadImgBase64 = new Array();// 临时上传图片base64格式
var updateTag="";//图片更新标志
var carrierUserID = 0;// 代理商id
var submitAddOpenModelList = new Array();// 增加开通模块列表，默认大小是1
var submitAddNoOpenModelList = new Array();// 增加不开团模块列表，默认大小是1
var schoolID = 0;// 临时学校id


$(function(){

   /*** 1、查询学校使用短信列表 ***/
   querySchoolManagerList();

    /** 2、搜索学校列表 **/
    $("#searchSchoolList").on("click",function(){
        schoolName = $("#schoolName").val();
        areaTable.api().ajax.reload();
    });

    /** 3、点击新建学校，新建学校div显示 **/
    $("#buildSchool").on("click",function () {
        $('#buildSchool_div').modal('show');
        buildCarrierList('a_carrier');
    });

    /** 4、页面加载的时候 **/
    getProviceList('a_prov','a_city');

    /*** 5、省份选中事件***/
    $('#a_prov').change(function () {
        proviceCode = $("#a_prov").val();
        cityCode = "0";
        getCityList(proviceCode,'a_city');
    });

    /*** 6、城市选中事件***/
    $('#a_city','u_city').change(function () {
        cityCode = $("#a_city").val();
    });

    /*** 5.1、省份选中事件***/
    $('#u_prov').change(function () {
        proviceCode = $("#u_prov").val();
        cityCode = "0";
        getCityList(proviceCode,'u_city');
    });

    /*** 6.1、城市选中事件***/
    $('#u_city').change(function () {
        cityCode = $("#u_city").val();
    });

    /*** 7.1、上传图片改变事件 ***/
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
            uploadImgBase64.push(oFREvent.target.result);
        };

        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            $("#tagpic").attr("src", objUrl); //将图片路径存入src中，显示出图片
        }
    });
    
    /*** 7.2、上传图片改变事件 ***/
    $("#bgicons").live('change', function(){
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
            uploadImgBase64.push(oFREvent.target.result);
        };

        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            $("#bgpic").attr("src", objUrl); //将图片路径存入src中，显示出图片
        }
    });
    /*** 7.3、上传图片改变事件 ***/
    $("#watericons").live('change', function(){
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
            uploadImgBase64.push(oFREvent.target.result);
        };

        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            $("#waterpic").attr("src", objUrl); //将图片路径存入src中，显示出图片
        }
    });
    /*** 8、代理商选中事件 ***/
    $('#a_carrier').change(function () {
        carrierUserID = $(this).val();
        $("#carrierHeader").val($(this).find("option:selected").attr("carrierUserName"));
    });

    /*** 9、代理商选中事件 ***/
    $('#ucarrier').change(function () {
        carrierUserID = $(this).val();
        $("#ucarrierHeader").val($(this).find("option:selected").attr("carrierUserName"));
    });

    /*** 7.1、上传图片改变事件 ***/
    $("#uicons").live('change', function(){
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
            uploadImgBase64.push(oFREvent.target.result);
        };
        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            $("#utagpic").attr("src", objUrl); //将图片路径存入src中，显示出图片
            updateTag=updateTag.replace("utagpic,","");//替换重新选择加入的字符
            updateTag +="utagpic"+",";
            
        }
    });
    
        /*** 7.2、上传图片改变事件 ***/
    $("#ubgicons").live('change', function(){
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
       // console.log(this.files[0]);
        if(size<0.1){
        	informationAlert_OnlyConfirmButton_NOT_REFRESH("请上传高清图片作为背景！");
            return false;
        }
        if(size > 5){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("上传的图片大小不能超过5M!");
            return false;
        }

        /*** 将上传的图片反编码为base64字符串 ***/
        var oFReader = new FileReader();
        oFReader.readAsDataURL(this.files[0]);
        oFReader.onload = function (oFREvent) {
            uploadImgBase64.push(oFREvent.target.result);
        };

        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            $("#ubgpic").attr("src", objUrl); //将图片路径存入src中，显示出图片
            updateTag=updateTag.replace("ubgpic,","");//替换重新选择加入的字符
            updateTag +="ubgpic"+",";
        }
    });
    /*** 7.3、上传图片改变事件 ***/
    $("#uwatericons").live('change', function(){
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
            uploadImgBase64.push(oFREvent.target.result);
        };

        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            $("#uwaterpic").attr("src", objUrl); //将图片路径存入src中，显示出图片
            updateTag=updateTag.replace("uwaterpic,","");//替换重新选择加入的字符
            updateTag +="uwaterpic"+",";
        }
    });

    /*** 8、初始化___点击模块服务，模块服务显示___右边侧栏 ***/
    $("#moduleServerInfo").sidebar({side: "right"});
    $(document).delegate('.moduleServer', 'click', function () {
        $("#moduleServerInfo").css("display","");
        $("#moduleServerInfo").trigger("sidebar:toggle");
        $("#moduleServerInfo").css("box-shadow","0px 0px 99px 1px #c0c0c0");
        /*** 查询学校开通模块情况 ***/
        schoolID = $(this).data('info');
        getSchoolModelList(schoolID);
        return false;
    });

    /*** 9 模块服务____点击关闭___监听 ***/
    $("#moduleServer-close").on('click', function () {
        $("#moduleServerInfo").trigger("sidebar:close");
        $("#moduleServerInfo").css("box-shadow","");
        $("#moduleServerInfo").css("display","none");
    });


    /*** 10、开通学校模块监听事件 ***/
    $("#ms_updateModel").on("click",function () {
        submitschool(schoolID);
    });

})


/**
 * 1、刷新table
 */
function refreshAreaTable(){
    areaTable.api().ajax.reload();
}

/**
 * 2、初始化学校列表
 */
function querySchoolManagerList() {
    //添加额外的参数传给服务器
    areaTable = $('#datatable').dataTable({
        "ajax": {
            "url": serverBaseUrl,
            "data": function (data) {
                data.appName = "school_querySchoolList";
                data.schoolName = schoolName;
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
                "targets":1,
                render:function (data,type,full,meta) {
                    return "<img class='schoolLogo' src="+full.schoolLogo+"></img>";
                }
            },
            {
                "targets":3,
                render:function (data,type,full,meta) {
                    var result = "未知";
                    if(full.schoolStatus == 1){
                        result = "<span style='color:#60c060'>正常</span>";
                    }else if(full.schoolStatus == 0){
                        result = "<span style='color:red'>已停用</span>";
                    }else{
                        result = "未知";
                    }
                    return result;
                }
            },{
                "targets":8,
                render:function (data,type,full,meta) {
                    return "<a class='bbtn btn-info btn-xs rm ah' onclick='showModelDiv(\"updateSchool_div\","+full.schoolID+",\""+full.schoolName+"\")'><i class='fa fa-pencil'></i>详情</a>" +
                           "<a class='bbtn btn-info btn-xs ah moduleServer' data-info="+full.schoolID+" onclick='setMSSN(\""+full.schoolName+"\")'><i class='fa fa-pencil'></i>模块服务</a>"+
													 "<a class='bbtn btn-info btn-xs' style='margin-left:5px;cursor: pointer;' onclick='addwexinModel(\""+full.schoolID+"\")'><i class='fa fa-pencil'></i>添加微信模板</a>";
                }
            }
        ]
    });
}

/***
 *  设置学校名称
 */
function setMSSN(schoolName){
	$("#ms_schoolName").text(schoolName);
}

/***
 * 3、弹出模态框
 * @param divID
 */
function showModelDiv(divID,schoolID,schoolName){
    $("#page_schoolID").val(schoolID);
    $('#'+divID).modal('show');
    if (divID == 'updateSchool_div'){
        /*** 查询学校详情 ***/
        querySchoolInfo(schoolID);
    }
}

/***
 * 4、隐藏模态框
 * @param divID
 */
function hideModelDiv(divID){
    $('#'+divID).modal('hide');
    areaTable.api().ajax.reload();
}


/***
 * 5、获取省份列表
 * @param proviceCode
 * @param pselectid
 * @param cselectid
 */
function getProviceList(pselectid,cselectid){
    var msg = {};
    msg.appName="city_getProviceList";
    serverFromJSONData(msg,true).then(function (success) {
        var provice = $("#"+pselectid);
        provice.empty();
        var proviceListStr = "";
        var proviceList = success.data.list;
        if (proviceList != null && proviceList.length != 0){
            $.each(proviceList,function(name,value) {
                if (proviceCode == value.CODE){
                    proviceListStr += "<option value="+value.CODE+" selected='selected'>&nbsp;&nbsp;&nbsp;"+value.NAME+"&nbsp;&nbsp;&nbsp;</option>";
                }else{
                    proviceListStr += "<option value="+value.CODE+">&nbsp;&nbsp;&nbsp;"+value.NAME+"&nbsp;&nbsp;&nbsp;</option>";
                }
            });
            provice.append(proviceListStr);
            /*** 获取城市列表 ***/
            getCityList(proviceCode,cselectid);
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("获取省份数据列表失败，请稍后再试!");
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}

/***
 * 6、获取市列表
 * @param proviceCode
 * @param selectid
 */
function getCityList(proviceCode,selectid){
    var msg = {};
    msg.appName="city_getCityList";
    msg.proviceCode = proviceCode;
    serverFromJSONData(msg,true).then(function (success) {
        var city = $("#"+selectid);
        city.empty();
        var cityListStr = "";
        var cityList = success.data.list;
        if (cityList != null && cityList.length != 0){
            $.each(cityList,function(name,value) {
                if(cityCode == value.CODE){
                    cityListStr += "<option value="+value.CODE+" selected='selected'>&nbsp;&nbsp;&nbsp;"+value.NAME+"&nbsp;&nbsp;&nbsp;</option>";
                }else{
                    cityListStr += "<option value="+value.CODE+">&nbsp;&nbsp;&nbsp;"+value.NAME+"&nbsp;&nbsp;&nbsp;</option>";
                }
            });
            city.append(cityListStr);
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("获取城市数据列表失败，请稍后再试!");
        }
        if (carrierUserID != 0){
            buildCarrierList('u_carrier');
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };

}

/***
 *   7、增加学校。保存
 */
function addSchool(pic_data){

    var schoolName = $('#aschoolName').val();// 学校名称
    var enSchoolName = $('#aEnschoolName').val();// 学校名称
    var schoolType = $("input[name='schoolType']:checked").val();//学校类别
    var supplyCode = $('#supplyCode').val();// 招生编码
    var schoolAddress = $('#schoolAddress').val();// 学校地址
    var website = $('#website').val();// website

    if (checkValueIsNull(schoolName)){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("学校名称栏不能为空!");
        return;
    }
	 if (checkValueIsNull(enSchoolName) ){
	        informationAlert_OnlyConfirmButton_NOT_REFRESH("学校英文名称栏不能为空!");
	        return;
	 }
	 if(!enSchoolName.match('/^[a-zA-Z]{1,}$/')){
		 informationAlert_OnlyConfirmButton_NOT_REFRESH("格式有误，请输入英文名称!");
		 return;
	 }

    if (checkValueIsNull(schoolType)){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("学校类别栏不能为空!");
        return;
    }

    if (checkValueIsNull(pic_data[0])){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请上传学校校徽栏!");
        return;
    }
    if (checkValueIsNull(pic_data[1])){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请上传学校校背景!");
        return;
    }
    if (checkValueIsNull(pic_data[2])){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请上传学校水印图片!");
        return;
    }

    if (carrierUserID == 0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("代理商栏不能为空!");
        return;
    }

    var msg = {};
    msg.appName="school_addSchool";
    msg.schoolName = schoolName;
    msg.enSchoolName = enSchoolName;
    msg.schoolType = schoolType;
    msg.supplyCode = supplyCode;
    msg.schoolAddress = schoolAddress;
    msg.website = website;
    msg.schoolBadge = pic_data[0];
    msg.bgpicture = pic_data[1];
    msg.aspjpeg = pic_data[2];
    msg.carrierID = carrierUserID;
    msg.cityID = cityCode;
    serverFromJSONData(msg,true).then(function (success) {
        var flag = success.data;
        if(flag >= 1){
            informationAlert_OnlyCancelButton_REFRESH('closeBuildModal()',"增加学校成功!");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH('增加学校失败，请稍后再试!');
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };

}

/***
 * 8、获取对象的url
 * @param file
 * @returns {*}
 */
function getObjectURL(file) {
    var url = null ;
    if (window.createObjectURL!=undefined) { // basic
        url = window.createObjectURL(file) ;
    } else if (window.URL!=undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
    } else if (window.webkitURL!=undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
    }
    return url ;
}

/***
 * 9、获取代理商列表
 */
function buildCarrierList(selectid){
    var param = {};
    param.appName = "user_getCarrierHeaderList";
    serverFromJSONData(param,true).then(function (success) {
        var carrierList = success.data;
        var carrier = $("#"+selectid);
        carrier.empty();
        var carrierListStr = "<option value='0' carrierName='0'>------请选择代理商------</option>";
        if(carrierList != null && carrierList.length != 0){
            $.each(carrierList,function(name,value) {
                if (carrierUserID == value.userID){
                    $('#ucarrierHeader').val(value.userName);
                    carrierListStr += "<option value="+value.userID+" selected='selected' carrierUserName="+value.userName+">&nbsp;&nbsp;&nbsp;"+value.companyName+"&nbsp;&nbsp;&nbsp;</option>";
                }else{
                    carrierListStr += "<option value="+value.userID+" carrierUserName="+value.userName+">&nbsp;&nbsp;&nbsp;"+value.companyName+"&nbsp;&nbsp;&nbsp;</option>";
                }
            });
            carrier.append(carrierListStr);
            carrierUserID = 0;
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("获取代理商数据列表失败，请稍后再试!");
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}

/***
 * 10、增加学校信息
 */
function addSchoolInfo(){
    /*** 先上传图标 ***/
    if (uploadImgBase64 != null && uploadImgBase64 != ""){
        var param = {};
        param.appName = "image_uploadImag";
       // var imgList = new Array();
        //imgList.push(uploadImgBase64);
        param.imgList = uploadImgBase64;

        serverFromJSONData(param,true).then(function (response) {
            if(response.msgState == 200 && response.data !=null && response.data != ''){
                if (response.data.length >=1){
                    addSchool(response.data);
                }else{
                    informationAlert_OnlyConfirmButton_NOT_REFRESH("获取图片失败，请稍后再试!");
                    return;
                }
            }else{
                informationAlert_OnlyConfirmButton_NOT_REFRESH("图片上传失败，失败原因："+response.msg);
                return;
            }
        }),function (error) {
            informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
        };
    }else{
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请上传学校校徽后再提交!");
    }
}

/***
 * 11、关闭新建学校模态框
 */
function closeBuildModal(){
    $('#buildSchool_div').modal('hide');
    refreshAreaTable();
}

/***
 * 12、查询学校详细信息，便于修改
 */
function querySchoolInfo(schoolID){

    var param = {};
    param.appName = "school_getSchoolInfo";
    param.schoolID = schoolID;
    serverFromJSONData(param,true).then(function (response) {
        var resultDate = response.data;
        if (resultDate != null){
            $('#uschoolName').val(resultDate.schoolName);
            $('#uEnschoolName').val(resultDate.enSchoolName);
            $('#usupplyCode').val(resultDate.schoolCode);
            $('#uschoolAddress').val(resultDate.schoolAddress);
            $('#uwebsite').val(resultDate.webSite);
            $("#utagpic").attr("src", resultDate.schoolLogo);
            $("#ubgpic").attr("src", resultDate.schoolBgPicture);
            $("#uwaterpic").attr("src", resultDate.schoolAspjpeg);
            $(":radio[name='uschoolType'][value='" + resultDate.schoolType + "']").prop("checked", "checked");
            $(":radio[name='uschoolState'][value='" + resultDate.schoolStatus + "']").prop("checked", "checked");
            if (!checkValueIsNull(resultDate.cityCode) && "0" != resultDate.cityCode){
                cityCode = resultDate.cityCode;
            }
            if (!checkValueIsNull(resultDate.provCode) && "0" != resultDate.provCode){
                 proviceCode = resultDate.provCode;
            }
            carrierUserID = resultDate.carrierID;
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("获取学校详情失败。请稍后再试!");
        }
        getProviceList('u_prov','u_city');
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
    };
}

/***
 * 13、更新学校信息
 */
function updateSchoolInfo(pic_data,updateTag){
    var schoolName = $('#uschoolName').val();
    var enSchoolName = $('#uEnschoolName').val();
    var schoolType = $("input[name='uschoolType']:checked").val();
    var schoolState = $("input[name='uschoolState']:checked").val();
    var supplyCode = $('#usupplyCode').val();
    var schoolAddress = $('#uschoolAddress').val();// 学校地址
    var website = $('#uwebsite').val();// website
    var schoolID =  $("#page_schoolID").val();
	  var picTags = updateTag.substring(0,updateTag.length-1).split(",");
		
		if (checkValueIsNull(schoolName)){
					informationAlert_OnlyConfirmButton_NOT_REFRESH("学校名称栏不能为空!");
					return;
			}
		 if (checkValueIsNull(enSchoolName) ){
					informationAlert_OnlyConfirmButton_NOT_REFRESH("学校英文名称栏不能为空!");
					return;
		 }
		 if(!enSchoolName.match('/^[a-zA-Z]{1,}$/')){
			    informationAlert_OnlyConfirmButton_NOT_REFRESH("格式有误，请输入英文名称!");
			    return;
		 }
	
			if (checkValueIsNull(schoolType)){
					informationAlert_OnlyConfirmButton_NOT_REFRESH("学校类别栏不能为空!");
					return;
			}
	
			if (checkValueIsNull(pic_data[0])){
					informationAlert_OnlyConfirmButton_NOT_REFRESH("请上传学校校徽栏!");
					return;
			}
			if (checkValueIsNull(pic_data[1])){
					informationAlert_OnlyConfirmButton_NOT_REFRESH("请上传学校校背景!");
					return;
			}
			if (checkValueIsNull(pic_data[2])){
					informationAlert_OnlyConfirmButton_NOT_REFRESH("请上传学校水印图片!");
					return;
			}
	
			if (carrierUserID == 0){
					informationAlert_OnlyConfirmButton_NOT_REFRESH("代理商栏不能为空!");
					return;
			}
    var msg = {};
    msg.schoolID = schoolID;
    msg.appName="school_updateSchoolInfo";
    msg.schoolName = schoolName;
    msg.schoolType = schoolType;
    msg.supplyCode = supplyCode;
    msg.schoolAddress = schoolAddress;
    msg.website = website;
    msg.enSchoolName = enSchoolName;
    for(var i=0;i<picTags.length;i++){
    	if(picTags[i]=="utagpic"){
    		 msg.schoolBadge = pic_data[i];
    	}
    	if(picTags[i]=="ubgpic"){
    		msg.bgpicture = pic_data[i];
    	}
    	if(picTags[i]=="uwaterpic"){
    		msg.aspjpeg = pic_data[i];
    	}
    }
    msg.carrierID = carrierUserID;
    msg.cityID = cityCode;
    msg.schoolState = schoolState;
    serverFromJSONData(msg,true).then(function (success) {
        var flag = success.data;
        if(flag >= 1){
            informationAlert_OnlyCancelButton_REFRESH('closeBuildModal()',"修改学校成功!");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH('修改学校失败，请稍后再试!');
        }
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };

}

/***
 * 14、更新学校入口
 */
function updateSchool(){

    if (!checkValueIsNull(uploadImgBase64)){
        var param = {};
        param.appName = "image_uploadImag";
       // var imgList = new Array();
       // imgList.push(uploadImgBase64);
        param.imgList = uploadImgBase64;
        serverFromJSONData(param,true).then(function (response) {
            if(response.msgState == 200 && response.data !=null && response.data != ''){
                if (response.data.length >=1){
                    updateSchoolInfo(response.data,updateTag);
                }else{
                    informationAlert_OnlyConfirmButton_NOT_REFRESH("获取图片失败，请稍后再试!");
                    return;
                }
            }else{
                informationAlert_OnlyConfirmButton_NOT_REFRESH("图片上传失败，失败原因："+response.msg);
                return;
            }
        }),function (error) {
            informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
        };
    }else{
        updateSchoolInfo("","");
    }
}

/***
 * 15、获取学校模块列表
 */
function getSchoolModelList(schoolID){
    $("#moduleList").empty();
    var param = {};
    param.appName = "module_schoolNotBuyModule";
    param.schoolID = schoolID;

    serverFromJSONData(param,true).then(function (response) {
        var manModelList = response.data.manList;// 管理端模块
        var appModelList = response.data.appList;// app端模块
        var contents = "<div style='margin:5px 0 10px 10px;height: 20px;color: #2494f2;font-weight: bold'>平台管理端（模块开通情况）：</div>";
        contents +="<div class='other_underline'></div>";
        var listSize = 0;// 记录终端模块的数量
        /** 循环权限列表 **/
        if(manModelList !=null && manModelList.length !=0){
            $.each(manModelList,function(n,obj) {
                contents += "<label style='margin:5px 0 5px 15px;height: 20px;font-size: 15px;'>"+obj.modelName+"</label>";
                var childList = obj.childModuleList;// 当前模块的子模块
                /** 循环第二级模块 **/
                if (childList !=null && childList.length!=0){
                    contents += "<table class='module-table table-tr-border'>";
                    $.each(childList,function (nn,oobj) {
                        listSize ++;
                        var existsFlag = false;
                        var childModuleList = oobj.childModuleList;// 获取第三级模块
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
                                "<td class='table-td-btn'>" +buildAddBtn(oobj.modelID,oobj.isOpen)+ "</td>"
                            "</tr>";
                        }
                        /*** 循环第三级菜单 ***/
                        if(existsFlag){
                            $.each(childModuleList,function (nnn,ooobj) {
                                listSize ++;
                                contents += "<tr class='table-tr-border'>" +
                                    "<td class='table-td-td-h'>"+ooobj.modelName+"</td>" +
                                    "<td class='table-td-btn'>" +buildAddBtn(ooobj.modelID,ooobj.isOpen)+ "</td>"+
                                    "</tr>";
                            });
                        }
                    });
                    contents += "</table>";
                }
            });
        }
        /*** app端权限组模块列表 ***/
        contents += "<div style='margin:10px 0 10px 10px;height: 20px;color: #2494f2;font-weight: bold'>平台移动端（模块开通情况）：</div>";
        contents +="<div class='other_underline'></div>";
        if(appModelList !=null && appModelList.length !=0){
            $.each(appModelList,function(n,ooobj) {
                listSize++;
                contents += "<label style='margin:5px 0 5px 20px;height: 20px;'>"+ooobj.modelName+"</label>";
                /*** APP端暂不考虑子模块 ***/
                contents += "<table class='module-table table-tr-border'>";
                contents += "<tr class='table-tr-border'>" +
                    "<td class='table-td-h'>"+ooobj.modelName+"</td>" +
                    "<td class='table-td-btn'>" +buildAddBtn(ooobj.modelID,ooobj.isOpen)+ "</td>"
                "</tr>";
                contents += "</table>";
            });
        }

        contents += "<div style='margin-top: 50px;'></div>";
        $("#moduleList").append(contents);
    }),function (error) {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误，请稍后再试!");
    };
}

/** 16、构建按钮 **/
function buildAddBtn(modelid,isOpen){
    if(isOpen == 1){
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
 * 17、新增
 **/
function addBtnClick(dom) {
    /** 获取末尾变量 **/
    var startFlag = dom.id.substring(0, dom.id.length - 1);
    var endFlag = dom.id.substring(dom.id.length - 1, dom.id.length);
    if (endFlag == 'q') {
        $("#" + startFlag + "q").css("backgroundColor", "#6DC56D");
        $("#" + startFlag + "c").css({backgroundColor: "", color: "#444"});
        var modelid = dom.id.split("_")[1];
        if ($.inArray(modelid, submitAddOpenModelList) == -1) {
            submitAddOpenModelList.push(modelid);
            submitAddNoOpenModelList.splice($.inArray(modelid, submitAddNoOpenModelList), 1);
        }
    }
    if (endFlag == 'c') {
        $("#" + startFlag + "c").css("backgroundColor", "#6DC56D");
        $("#" + startFlag + "q").css({backgroundColor: "", color: "#444"});
        var modelid = dom.id.split("_")[1];
        if ($.inArray(modelid, submitAddNoOpenModelList) == -1) {
            submitAddNoOpenModelList.push(modelid);
            submitAddOpenModelList.splice($.inArray(modelid, submitAddOpenModelList), 1);
        }
    }
}

/**
 * 18、开通学校模块
 */
function submitschool(schoolID){
        var param = {};
        param.appName="module_openSchoolModule";
        if(!checkArrayIsEmpty(submitAddOpenModelList)){
        	param.submitOpenModelList = submitAddOpenModelList.map(function(data){return +data});
        }
        if(!checkArrayIsEmpty(submitAddNoOpenModelList)){
        	param.submitNoOpenModelList = submitAddNoOpenModelList.map(function(data){return +data});
        }
        param.schoolID = schoolID;
        serverFromJSONData(param,true).then(function (response) {
            if(response.msgState == 200){
                /*queryAllPrivilegeList();*/
                informationAlert_OnlyConfirmButton_NOT_REFRESH('开通模块成功！');
                //进行刷新
                getSchoolModelList(schoolID);
            }else{
                informationAlert_OnlyConfirmButton_NOT_REFRESH('开通模块失败！失败原因：'+response.msg);
            }
        }),function (error) {
            informationAlert_OnlyConfirmButton_NOT_REFRESH("访问服务器发生错误。请稍后再试!");
        };
}


function addwexinModel(schoolID){
		window.location.href = 'weixinModel.html?schoolid='+schoolID+'';
}


