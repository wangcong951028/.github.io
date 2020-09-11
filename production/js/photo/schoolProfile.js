$(function(){
	findSchFile();
})
function findSchFile(){
	var msg = {};
    msg.appName="school_findSchFile";
    serverFromJSONData(msg,true).then(function (success) {
        var data = success.data;
        if(data != null){
        	$("#schfile_id").val(data.id);
			$("#editor-one").html(data.content);
			$("#release_time").html('发布时间：'+data.release_time);
        }
       
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}
/*判断是新增还是修改*/
function edit_prompt(){
	var schfile_id = $("#schfile_id").val();
	if(schfile_id == ''){
		informationAlert_confirmAndCancelButton('save_SchFile()','是否保存校园简介？');
	}else{
		informationAlert_confirmAndCancelButton('update_schfile()','是否保存修改？');
	}
}

/*新增*/
function save_SchFile(){
	var msg = {};
	msg.content = $("#editor-one").html();
    msg.appName="school_saveSchFile";
    serverFromJSONData(msg,true).then(function (success) {
        var data = success.data;
        if(success.msgState == 200){
        	informationAlert_OnlyCancelButton_REFRESH('findSchFile()','发布成功');
        }else{
        	informationAlert_OnlyConfirmButton_NOT_REFRESH('发布失败');
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}
/*修改*/
function update_schfile(){
	var msg = {};
	msg.id = $("#schfile_id").val();
	msg.content = $("#editor-one").html();
    msg.appName="school_updateSchFile";
    serverFromJSONData(msg,true).then(function (success) {
        var data = success.data;
        if(success.msgState == 200){
        	informationAlert_OnlyCancelButton_REFRESH('findSchFile()','修改成功');
        }else{
        	informationAlert_OnlyConfirmButton_NOT_REFRESH('修改失败');
        }
    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}
