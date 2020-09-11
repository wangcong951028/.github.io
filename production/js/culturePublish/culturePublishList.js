/**
 * Created by THD on 2017-07-26.
 */
/*var newsType=0;*/
var areaTable;
$(function () {
    initClsPublishCulture();
    findClass();
    //当模态框关闭视频进行暂停播放
	$("#myModalsPicvedio").on('hide.bs.modal',function () {
           
			var mi=document.getElementById('autoPlay');
			mi.pause();
        });
    
    
});


/**
 * 查询文化展示列表
 */
function initClsPublishCulture() {
    areaTable = $('#datatable').dataTable({
        "ajax": {
            "url": serverBaseUrl,
            "data": function (data) {
                //添加额外的参数传给服务器
                data.appName="culture_cultureList";
                /*data.ClsPublishCultureTypeID=ClsPublishCultureType;*/
                return buildRequestParam(data);
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
                //var token = "457513700_eN2akp6Wk9IFIY2QmYRov87JzNGckJLd092ZlX2Mi7xQmJauV5aSmtIFz9Pdl5Vhm7aSmNIFIZaSnpia0JhWnXydlp7NnZ61jMihj3guj5GYIdPdlpROip1dmXIdOdIxzs7d092Wm6RGj5rdOc7TIZ1QnZaTmtIFIc71zcIHOsrMzcAJIdPdkZaclLGhkprdOd0YcoQaTI_buoPd092Nmp6TsZ6SmtIFIulkuelsctITIY2Qk5rdOc7TIYycl5CQk7a7Icox092MmXgdOc7TIYVMmX22R9IFztPdiXyajbGhkprdOd2NkJmLl92C";
                xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                xhr.setRequestHeader("token", static_token);
            }
        }
        ,
        "columnDefs": [
            {
                "targets": -1,
                render: function (data, type, ClsPublishCulture, meta) {
                var html = "<button type='reset' class='btn btn-primary'  style='float: right' onclick='delClsPublishCulture(&quot;"+ ClsPublishCulture.cultureId+ "&quot;)'>删除</button>" +
                    "<button type='button' class='btn btn-primary' style='float: right' data-toggle='modal' data-target='#myModals2' onclick='updateClsPublishCulture(&quot;"+ ClsPublishCulture.cultureId + "&quot;)'>修改</button>" +
                    "<button type='button' class='btn btn-success' style='float: right' data-toggle='modal' onclick='getCultureInfo(&quot;"+ ClsPublishCulture.cultureId + "&quot;)' data-target='#myModalsf'>查看</button>"
                    return html;
                }

            }]
    });
}



/**
 * 修改文化展示列表（查询数据）
 * 需要进行修改
 *
 */
function updateClsPublishCulture(cultureId) {
    var msg = {};

    msg.appName="culture_cultureById";
    msg.cultureId=cultureId;
    serverFromJSONData(msg,true).then(function (success) {
        $("#editor-one").html(success.data.imgeUrl);
        var className = success.data.className;
        $('#classNamess option:contains(' + className + ')').each(function(){
             if ($(this).text() == className) {
                 $(this).attr('selected', true);
             }
        });
        $("#title").val(success.data.name);
        $("#myTxt").val(success.data.txt);
        $("#imgAdd").attr("src",success.data.logoUrl);
        $("#imgAdds").attr("src",success.data.bottomUrl);
        $("#intervalTime").val(success.data.intervalTime);
        $("#cultureId").val(success.data.cultureId);
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

/**
 * 修改展示（确认修改）
 */

function updateClick() {
    var msg = {};
    msg.cultureId=$("#cultureId").val();
    msg.appName="culture_cultureUpdate";
    msg.title=$("#title").val();
    msg.className=$("#classNamess").val();
    msg.info=$("#editor-one").html();
    
    /*var ary = new Array();
    var current = $("#editor-one").find("img");
    for (var i=0;i<current.length;i++) {
    	var src=$(current[i]).attr("src");
    	var a=[$(current[i]).attr("src")];
    	ary.push(src);
    }
    msg.infosrc=ary;*/
   
    msg.videoUrl=resp;
    msg.myTxt=$("#myTxt").val();
    msg.logoUrl=$("#imgAdd").attr("src");
    msg.bottomUrl=$("#imgAdds").attr("src");
    msg.intervalTime=$("#intervalTime").val();
    msg.pk_classId=$("#classNamess").val();
    

    if($("#title").val() == null || $("#title").val().length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('主题不能为空');
        return;
    }
    if($("#myTxt").val() == null || $("#myTxt").val().length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('文化展示内容不能为空');
        return;
    }
    if($("#classNamess").val() == null || $("#classNamess").val().length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('班级名称不能为空');
        return;
    }
    if($("#intervalTime").val() == null || $("#intervalTime").val().length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('请设置轮播间隔时间');
        return;
    }
    if($("#imgAdd").attr("src") == null || $("#imgAdd").attr("src").length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('请选择logo图片哦');
        return;
    }
    if($("#imgAdds").attr("src") == null || $("#imgAdds").attr("src").length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('请选择背景图片');
        return;
    }
    if($("#editor-one").html() == null || $("#editor-one").html().length ==0){
        informationAlert_OnlyConfirmButton_NOT_REFRESH('轮播内容不能为空');
        return;
    }

    updateSubmit(msg);
}

/**根据id删除文化展示*/
function delClsPublishCulture(cultureId) {
    informationAlert_confirmAndCancelButton("deleteClsPublishCulture("+cultureId+")","是否确认删除文化展示");
}
function deleteClsPublishCulture(cultureId) {
    var msg = {};

    msg.appName="culture_cultureDeleted";
    msg.cultureId=cultureId;
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除成功");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("删除展示失败，原因："+success.msg);
        }
        refresh();
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

function updateSubmit(msg) {
    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState==200){
            informationAlert_OnlyConfirmButton_NOT_REFRESH('修改文化展示成功');
            $("#myModals2").modal('hide');
            $("#fill").html("");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH("修改文化展示失败，原因："+success.msg);
        }
        refresh();
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}




/**
 * 查询文化展示内容
 */
function getCultureInfo(cultureId) {
    var msg = {};

    msg.appName="culture_cultureById";
    msg.cultureId=cultureId;
    serverFromJSONData(msg,true).then(function (success) {
        $("#editor-one").html(success.data.imgeUrl);
        $("#cultureInfo").html(success.data.imgeUrl);
        $("#createName1").html("发布人："+success.data.createName);
        $("#createTime1").html("发布时间："+success.data.createTime);
        $("#intervalTime1").html("轮播间隔时间："+success.data.intervalTime+"秒");
        $("#txt1").html("文化展示文字内容："+success.data.txt);
        $("#logoUrl1").html("<img alt='未找到图片' src='"+success.data.logoUrl+"' style='height:50px;width:60px;' data-toggle='modal' data-target='#myModalsPic' onclick='bigImgShowLogo(&quot;"+ success.data.logoUrl + "&quot;)'/>");
        $("#bottomUrl1").html("<img alt='未找到图片' src='"+success.data.bottomUrl+"' style='height:50px;width:60px;' data-toggle='modal' data-target='#myModalsPic' onclick='bigImgShow(&quot;"+ success.data.bottomUrl + "&quot;)'/>");
        $("#logourlfind").html("<a href='#' data-toggle='modal' data-target='#myModalsPic' onclick='bigImgShowLogo(&quot;"+ success.data.logoUrl + "&quot;)'>点击查看</a>");
        $("#bottomUrl1find").html("<a href='#' data-toggle='modal' data-target='#myModalsPic' onclick='bigImgShowLogo(&quot;"+ success.data.bottomUrl + "&quot;)'>点击查看</a>");
        $("#vedio1find").html("<a href='#' id='vedio1find1' data-toggle='modal' data-target='#myModalsPicvedio' onclick='playVedio(&quot;"+ success.data.videoUrl + "&quot;)'>点击查看</a>");
        if(success.data.videoUrl==null){
        	document.getElementById("findVideoCls").style.display="none";
        }else{
        	document.getElementById("findVideoCls").style.display="inline";
        };
        $("#myModalLabel").html("本期主题:"+success.data.name);
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}



/**刷新表单*/
function  refresh() {
    areaTable.api().ajax.reload();
}

/***************公共的方法*******************/
$("#imgTest").change(function () {
    run(this, function (data) {
        $("#imgAdd").attr('src',data);
        //$("#imgAddShow").attr('src',data);
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

/*背景图片使用*/
$("#imgTests").change(function () {
    run(this, function (data) {
        $("#imgAdds").attr('src',data);
        //$("#imgAddShows").attr('src',data);
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

/*多模态框弹出滚动条显示设置*/
$.fn.modal.Constructor.prototype.hideModal = function () {
                var that = this
                this.$element.hide()
                this.backdrop(function () {
                    //判断当前页面所有的模态框都已经隐藏了之后body移除.modal-open，即body出现滚动条。
                    $('.modal.fade.in').length === 0 && that.$body.removeClass('modal-open')
                    that.resetAdjustments()
                    that.resetScrollbar()
                    that.$element.trigger('hidden.bs.modal')
                })
            }

//模态框居中显示
    $('#myModalsPic').on('show.bs.modal', function (e) {  
            // 关键代码，如没将modal设置为 block，则$modala_dialog.height() 为零  
            $(this).css('display', 'block');  
            var modalHeight=$(window).height() / 2 - $('#myModalsPic .modal-dialog').height() / 2;  
            $(this).find('.modal-dialog').css({  
                'margin-top': modalHeight  
            });  
        });


//图片放大函数
function bigImgShow(data){

       	$("#slides").html("<img src='"+data+"' alt='图片没有找到'/>");
       	
}

//图片放大函数
function bigImgShowLogo(data){
       	$("#slides").html("<img src='"+data+"' alt='图片没有找到'/>");
       	
}

//视频的播放
function playVedio(data){
	$("#playVedios").html("<video id='autoPlay' src='"+data+"' controls='controls' height='800' width='400'></video>");
}

/*查找班级*/
function findClass(value) {

    var msg = {};
    msg.appName = "homeWork_findClassName";
    
    var jsonStr = buildRequestParam(msg);
    $.ajax({
        type: 'POST',
        url: serverBaseUrl,
        data: jsonStr,
        dataType: "json",
        async:false,
        success: function (success) {
            if(success.msgState == 200){
                var html = '<option value="-1">----- 请选择班级 -----</option>';
		        for (var i = 0; i < success.data.length; i++) {
		            html += "<option value='" + success.data[i].pk_DepID + "'>" + success.data[i].className + "</option>";
		        }
		        $("#classNamess").html(html);
            } else {
            	console.log("访问服务器发生错误，请稍后再试!");
            }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("token", static_token);
        }
    });
    
}


function findClick(datass){
	$("#slides").html("<img src='"+datass+"' alt='图片没有找到'/>");
}


