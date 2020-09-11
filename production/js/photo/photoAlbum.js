
/*分页所需参数*/
var static_index=1;
var static_pageSize=10;
//总页数
var totalPage;
var static_query;
/*类型 1:首页轮播图片 2：校园风貌*/
var static_status=2;
var imgArray;//相册路径数组
$(function () {
    init();//初始化相册
});


function setStatus(type) {
    static_status = type;
    static_index = 1;
    init();
}

/**
 * 初始化相册列表
 */
function init() {
    if(static_status == 1){
        $("#PhotoNameHtml").html('');
        $("[name='photoType']").html("图片");
        APPHead();
    }else if(static_status == 2){
        $("#PhotoNameHtml").html('<label class="control-label col-md-3 col-sm-3 col-xs-12">相册名称 <span\n' +
            '    class="required">：</span></label>\n' +
            '        <div class="col-md-6 col-sm-6 col-xs-12">\n' +
            '            <input type="text" value="" maxlength="25" id="photoAlbumName" required="required" class="form-control col-md-7 col-xs-12">\n' +
            '            </div>');
        $("[name='photoType']").html("相册");


        schoolStyle();
    }
}

/**首页轮播图片*/
function APPHead() {

    var msg = {};

    msg.appName="APPHeadImg_findByAPPHeadImg";
    msg.index=static_index;
    msg.pageSize=static_pageSize;
    serverFromJSONData(msg,true).then(function (success) {
        var data = success.data["list"];
        static_query = success.data["query"];
        var html = "";
        imgArray = new Array();
        if(data != null){
            for(var i=0;i<data.length;i++){
                var bean = data[i];
                imgArray.push(bean.a_img);//将图片路径放进数组
                html += '<div class="col-md-55">\n' +
                    '                                    <div class="thumbnail">\n' +
                    '                                        <div class="image view view-first" style="height: 100%">\n' +
                    '                                            <img style="width: 100%;height: 200px; display: block;" src="'+bean.a_img+'" alt="image" />\n' +
                    '                                            <div class="mask no-caption" style="height: 100%">\n' +
                    '                                                <div class="tools tools-bottom">\n' +
                    '                                                    <a href="#" data-toggle="modal" data-target="#myModals1" onclick="showImgs(&quot;'+ bean.a_img + '&quot;)"><i class="fa fa-link"></i></a>\n' +
                    '                                                    <a href="#" onClick="delcfm1(&quot;'+ bean.pk_id + '&quot;)"><i class="fa fa-times"></i></a>\n' +
                    '                                                </div>\n' +
                    '                                            </div>\n' +
                    '                                        </div>\n' +
                    '                                    </div>\n' +
                    '                                </div>'
            }
        }
        $("#row").html(html);
        initPage();//初始化分页
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}
/*校园风貌*/
function schoolStyle() {

    var msg = {};

    msg.appName="campusLandscape_findCampusLandscape";
    msg.index=static_index;
    msg.pageSize=static_pageSize;
    serverFromJSONData(msg,true).then(function (success) {
        var data = success.data["list"];
        static_query = success.data["query"];
        var html = "";

        if(data != null){
            for(var i=0;i<data.length;i++){
                var bean = data[i];

                html += '<div class="col-md-55">\n' +
                    '                                    <div class="thumbnail">\n' +
                    '                                        <div class="image view view-first">\n' +
                    '                                            <img style="width: 100%; display: block;" src="'+bean.a_img+'" alt="image" />\n' +
                    '                                            <div class="mask no-caption">\n' +
                    '                                                <div class="tools tools-bottom">\n' +
                    '                                                    <a href="photo.html?id='+bean.pk_id+'" target="iframe"><i class="fa fa-link"></i></a>\n' +
                    '                                                    <a href="#" data-toggle="modal" data-target="#myModals" onclick="showUpdateAlubums(&quot;'+ bean.pk_id + '&quot;)"><i class="fa fa-pencil"></i></a>\n' +
                    '                                                    <a href="#" onClick="delcfm(&quot;'+ bean.pk_id + '&quot;)"><i class="fa fa-times"></i></a>\n' +
                    '                                                </div>\n' +
                    '                                            </div>\n' +
                    '                                        </div>\n' +
                    '                                        <div class="caption">\n' +
                    '                                            <p><strong>'+bean.a_info+'</strong>\n' +
                    '                                            </p>\n' +
                    '                                            <p>&nbsp;</p>\n' +
                    '                                        </div>\n' +
                    '                                    </div>\n' +
                    '                                </div>'
            }
        }
        $("#row").html(html);
        initPage();//初始化分页
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function showButton() {
    var type = "";
    if(static_status == 1){
        type = "图片";
    }else if(static_status==2){
        type = "相册";
    }
    $("#buttonType").html('<button type="button" id="add_photoAlbum" onclick="addPhotoAlbum()" class="btn btn-success" style="float: right">新增'+type+'</button>');
    $("#addAndUpdate").html("新增");
}

/**修改相册（显示数据）*/
function showUpdateAlubums(ids) {
    $("#addAndUpdate").html("修改");
    $("#buttonType").html('<button type="button" onclick="updatePhotoAlbum()" class="btn btn-success" style="float: right">修改相册</button>');

    var msg = {};
    msg.appName="campusLandscape_findCampusLandscape4Id";
    msg.id=ids;
    serverFromJSONData(msg,true).then(function (success) {
        var data = success.data;
        if(data != null){
            $("#albumId").val(data.pk_id);
            $("#photoAlbumName").val(data.a_info);
            $("#imgAdd").attr("src",data.a_img);
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/**执行修改相册*/
function updatePhotoAlbum() {
    informationAlert_confirmAndCancelButton("updatePhotoAlbum1()","是否确认修改相册？");
}
function updatePhotoAlbum1() {
    var imgAdd = $("#imgAddHtml").html();//base64图片
    if(imgAdd.length<30){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择图片");
        return;
    }
    if($("#photoAlbumName").val().length == 0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("相册名称不能为空");
        return;
    }

    var msg = {};
    msg.appName="campusLandscape_updateCampusLandscape";
    msg.pk_id=$("#albumId").val();
    msg.a_img=imgAdd;
    msg.a_info=$("#photoAlbumName").val();
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("相册修改成功！");
            resetting();
            $('#myModals').modal('hide');
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("图片添加失败，原因："+success.msg)
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/**
 * 新增首页图片
 */
function addAppPhoto() {
    var imgAdd = $("#imgAddHtml").html();//base64图片
    if(imgAdd.length<30){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择图片");
        return;
    }
    var msg = {};
    msg.appName="APPHeadImg_saveAPPHeadImg";
    msg.a_img=imgAdd;
    $('#add_photoAlbum').attr({"disabled":"disabled"});
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("图片添加成功！");
            resetting();
            $("#close").click();
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("图片添加失败，原因："+success.msg)
        }
         $('#add_photoAlbum').removeAttr("disabled");
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/**
 * 新增相册
 */
function addPhotoAlbum() {
    if(static_status == 1){//执行轮播图片添加
        addAppPhoto();
        return;
    }
    var photoAlbumName = $("#photoAlbumName").val();
    photoAlbumName =trims(photoAlbumName);
    if(photoAlbumName.length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请输入相册名称");
        return;
    }

    var imgAdd = $("#imgAddHtml").html();//base64图片
    if(imgAdd.length<30){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择封面图片");
        return;
    }
    var msg = {};
    msg.appName="campusLandscape_saveCampusLandscape";
    msg.a_info=photoAlbumName;
    msg.a_img=imgAdd;
    $('#add_photoAlbum').attr({"disabled":"disabled"});
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("相册添加成功！");
            resetting();
            $("#close").click();
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("相册添加失败，原因："+success.msg)
        }
        $('#add_photoAlbum').removeAttr("disabled");
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}


/*删除相册提示*/
function delcfm(id) {
    informationAlert_confirmAndCancelButton("deletePhotoAlbumSubmit("+id+")","删除相册会导致相册内所有图片丢失，是否继续？");
}
/*执行删除相册*/
function deletePhotoAlbumSubmit(id){

    var msg = {};
    msg.appName="campusLandscape_deleteCampusLandscape";
    msg.id=id;
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("相册删除成功！");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("相册删除失败，原因："+success.msg)
        }
        init();
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}
/*删除首页轮播图片*/
function delcfm1(id) {
    informationAlert_confirmAndCancelButton("deletePhotoSubmit("+id+")","是否确认删除图片？");
}
/*执行删除图片*/
function deletePhotoSubmit(id){

    var msg = {};
    msg.appName="APPHeadImg_deleteAPPHeadImgById";
    msg.id=id;
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("图片删除成功！");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("图片删除失败，原因："+success.msg)
        }
        init();
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
            '<li class="slide-container">\n' +
            '                    <div class="slide">\n' +
            '                        <img src="'+imgArray[i]+'" />\n' +
            '                    </div>\n' +
            '                    <div class="nav">\n' +
            '                        <label for="img-'+(i==0?imgArray.length:i)+'" class="prev">&#x2039;</label>\n' +
            '                        <label for="img-'+(i+1==imgArray.length?1:i+2)+'" class="next">&#x203a;</label>\n' +
            '                    </div>\n' +
            '                </li>';
        navdots+='<label for="img-'+(i+1)+'" class="nav-dot" id="img-dot'+(i+1)+'"></label>';
    }
    slides += '<li class="nav-dots" id="nav-dots">'+navdots+'</li>';
    $("#slides").html(slides);

    $("#img-dot"+($.inArray(src, imgArray)+1)+"").click();//默认点击第几个
}

//--------------分页
function last() {
    static_index-=1;
    if(static_index<=0){
        $("#lastButton").attr('disabled',true);
    }
    init();
}
function next() {
    static_index += 1;
    init();
}

function initPage() {

    //--------set页码
    if(static_query.total%static_pageSize != 0){
        totalPage=parseInt(static_query.total/static_pageSize)+1;
    }else{
        totalPage=parseInt(static_query.total/static_pageSize);
    }
    $("#total").html(static_query.total);
    $("#currentPage").html(static_index);
    $("#totalPage").html(totalPage);

    //-------上一页下一页按钮控制
    if(static_index<=1){
        $("#lastButton").attr('disabled',true);
    }else{
        $("#lastButton").attr('disabled',false);
    }
    if(totalPage <= 1){
        $("#nextButton").attr('disabled',true);
    }else{
        $("#nextButton").attr('disabled',false);
    }
    if(static_index>=totalPage){
        $("#nextButton").attr('disabled',true);
    }else{
        $("#nextButton").attr('disabled',false);
    }

}


//-----------------------------以下是公共方法------------------------

/**
 * 重置相册信息
 */
function resetting() {
    $("#photoAlbumName").val("");
    $("#imgAdd").attr("src","");
    $("#imgAddShow").attr("src","");
    $("#imgTest").val("");
    $("#albumId").val("");
    init();
}

$("#imgTest").change(function () {
    run(this, function (data) {
        $("#imgAdd").attr('src',data);
        $("#imgAddShow").attr('src',data);
    });

});

function run(input_file, get_data) {
    /*input_file：文件按钮对象*/
    /*get_data: 转换成功后执行的方法*/
    if (typeof (FileReader) === 'undefined') {
        informationAlert_OnlyConfirmButton_NOT_REFRESH("抱歉，你的浏览器不支持 FileReader，不能将图片转换为Base64，请使用现代浏览器操作！");
    } else {
        try {
            /*图片转Base64 核心代码*/
            var file = input_file.files[0];
            //这里我们判断下类型如果不是图片就返回 去掉就可以上传任意文件
            if (!/image\/\w+/.test(file.type)) {
                informationAlert_OnlyConfirmButton_NOT_REFRESH("请确保文件为图像类型");
                return false;
            }
            var reader = new FileReader();
            reader.onload = function () {
                get_data(this.result);
            }
            return reader.readAsDataURL(file);
        } catch (e) {
            informationAlert_OnlyConfirmButton_NOT_REFRESH('图片转Base64出错啦！' + e.toString())
        }
    }
}
//取出左右两端的空格
function trims(str){ //删除左右两端的空格
　　   return str.replace(/(^\s*)|(\s*$)/g, "");
　　 }