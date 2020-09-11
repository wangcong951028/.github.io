/*====js通用弹出框====*/
/*
 * tipType类型：
 * error, warning, question, information and confirmation
 * */

/**
 * 1、 弹出框只有：确定按钮，支持点击后调用某个函数
 * @param tipContent  消息提示框内容
 * @param tipType  消息提示类型
 * @param fun  调用函数名称
 */
function zebraDialog_info(tipContent, tipType, fun) {
	$.Zebra_Dialog(tipContent, {
		'type' : tipType,
		'overlay_opacity' : 0.4,
		'title' : '系统消息',
		'buttons' : [ {
			caption : '确定',
			callback : function() {
				if (fun != null && fun != "") {
					eval(fun);
				}
			}
		} ]
	});
}

/**
 * 2、 弹出框有：确定按钮、取消按钮，支持点击确定按钮后调用指定函数
 * 
 * @param tipContent  消息提示框内容
 * @param tipType 消息提示类型
 * @param fun  调用函数名称
 */
function zebraDialog_ques(tipContent,tipType,fun){
	$.Zebra_Dialog(tipContent, {
		  'type':     tipType,
		  'overlay_opacity': 0.4,
		  'title':    '系统消息',
		  'buttons': [
                       {caption: '确定',callback: function() {
                    	   if(fun == null || fun == ""){
                   	       }else{
                   	    	eval(fun);
                   	       }
                       } },
                       {caption: '取消',callback: function() {} },
		             ]
		});
}

/**
 * 3、 弹出框只有：确定按钮，点击确定按钮后，刷新当前页面
 * @param tipContent  消息提示框内容
 * @param tipType   消息提示类型
 * @param isReload 是否刷新当前页面
 */
function zebraDialog_ques_onClose(tipContent, tipType, isReload) {
	$.Zebra_Dialog(tipContent, {
		'type' : tipType,
		'title' : '系统消息',
		'overlay_opacity' : 0.4,
		'buttons' : [ {
			  caption : '确定',
			  callback : function() {
				  // nothing
			  }
		} ],
		'onClose' : function() {
			if (isReload){
				window.location.reload();
			}
		}
	});
}

/* 4、 询问是否继续操作，继续就提示成功，再刷新页面 */
function zebraDialog_ques_onClose_refrese(tipContent){
	var resultFlag = -1;
	$.Zebra_Dialog(tipContent, {
		  'type':     'question',
		  'overlay_opacity': 0.4,
		  'title':    '系统消息',
		  'buttons': [
                      {caption: '确定',callback: function() {
                    	   /*调用函数*/
                    	  resultFlag = 1;
                      } },    
                      {caption: '取消',callback: function() {
                    	  resultFlag = 0;
                      } },
		             ],
		  'onClose' : function(){
			  if(resultFlag != 0){
				  if(resultFlag == 1){
					  zebraDialog_ques_onClose("操作成功!");
				  }else{
					  zebraDialog_ques_onClose("操作失败，请稍后再试!");
				  }
			  }
		  }
		});
}


/**********************************************通用zebra弹窗函数************************************************/

/**
 *  弹出框有： 确定按钮、取消按钮，点击确定按钮后，调用指定的函数
 *  @param tipContent  消息提示框内容
 *  @param func  指定的函数名
 */
function zebra_question(tipContent, func) {
	var resultFlag = -1;
	$.Zebra_Dialog(tipContent, {
		'type' : 'question',
		'overlay_opacity' : 0.4,
		'title' : '系统消息',
		'buttons' : [ {
			caption : '确定',
			callback : function() {
				resultFlag = eval(func);
			}
		}, {
			caption : '取消'
		}, ],
		'onClose' : function() {
			if (resultFlag == 1) {
				zebraDialog_ques_onClose("操作成功!", 'information');
			} else if (resultFlag == 2) {
				zebraDialog_ques_onClose("操作失败，请稍后再试!", 'error');
			}
		}
	});
}

/**
 * 通用调用AJAX方法
 * @param url 请求的路径
 * @param data 请求的数据
 * @param success  服务器执行成功调用的函数
 * @param error  服务器执行失败调用的函数
 * @returns {Number}
 */
function zebra_ajax(url, data, success, error) {
	var flag = 2;
	$.ajax({
		url : ctpath + url,
		type : "post",
		dataType : "json",
		data : data,
		async : false,
		success : function() {
			flag = 1;
			if (success != null) {
				eval(success);
			}
		},
		error : function() {
			if (error != null) {
				eval(error);
			}
		}
	});
	return flag;
}

/* 简单提示框，提示成功与否，并执行相应函数 */
function zebra_hint(url, data, success, error) {
	$.ajax({
		url : ctpath + url,
		type : "post",
		dataType : "json",
		data : data,
		success : function() {
			if (success != null) {
				eval(success);
			}
			zebraDialog_info("操作成功！", "information");
		},
		error : function() {
			if (error != null) {
				eval(error);
			}
			zebraDialog_info("操作异常！", "error");
		}
	});
}

/**
 * 提示消息，并跳转到指定的页面
 * @param tipContent
 * @param tipType
 * @param actionUrl
 */
function zebraDialog_ques_onClose_toActionUrl(tipContent, tipType, actionUrl) {
	$.Zebra_Dialog(tipContent, {
		'type' : tipType,
		'title' : '系统消息',
		'overlay_opacity' : 0.4,
		'buttons' : [ {
			  caption : '确定',
			  callback : function() {
				  // nothing
			  }
		} ],
		'onClose' : function() {
			window.location = path + actionUrl;
		}
	});
}
