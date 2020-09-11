
/*分页所需参数*/
var static_index=1;
var static_pageSize=15;
//总页数
var totalPage;
var static_query;

var static_id;//相册ID
var imgArray;//相册路径数组
$(function () {
    var thisURL = document.URL;
    var  getval =thisURL.split('?')[1];
    static_id= getval.split("=")[1];
    init();//初始化相册照片

});


/**
 * 初始化相册图片列表
 */
function init() {
    var msg = {};

    msg.appName="campusLandscape_findCampusLandscapeById";
    msg.index=static_index;
    msg.pageSize=static_pageSize;
    msg.id=static_id;

    serverFromJSONData(msg,true).then(function (success) {
        var data = success.data['list'];
        static_query=success.data['query'];
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
                    '                                                    <a href="#" onClick="delcfm(&quot;'+ bean.pk_id + '&quot;)"><i class="fa fa-times"></i></a>\n' +
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



/**
 * 新增图片
 */
function addPhoto() {

    var imgAdd = $("#imgAddHtml").html();//base64图片
    if(imgAdd.length<50){
        informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择图片");
        return;
    }
    var msg = {};
    msg.appName="campusLandscape_saveCampusLandscapeItem";
    msg.a_img=imgAdd;
    msg.id=static_id;
	$('#add_photo').attr({"disabled":"disabled"});
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("图片添加成功！");
            resetting();
            $("#close").click();
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("图片添加失败，原因："+success.msg)
        }
        $('#add_photo').removeAttr("disabled");
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/*显示删除确认框*/
function delcfm(id) {
    informationAlert_confirmAndCancelButton("deletePhotoSubmit("+id+")","是否确认删除图片？");
}
/*执行删除图片*/
function deletePhotoSubmit(id){

    var msg = {};
    msg.appName="campusLandscape_deleteCampusLandscapeById";
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
    $("#imgAdd").attr("src","");
    $("#imgAddShow").attr("src","");
    $("#imgTest").val("");
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