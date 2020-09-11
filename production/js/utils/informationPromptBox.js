/**
 * Created by ricardo on 2017-09-28.
 */

/**
 * 1、消息提示框，只有确定按钮，点击确定按钮后不刷新数据
 * @param alertContent
 */
function informationAlert_OnlyConfirmButton_NOT_REFRESH(alertContent){
    $.alert({
        title: '系统消息',
        content: alertContent,
        buttons: {
            "确定": function () {
            }
        }
    });
}

/**
 * 2、消息提示框，只有确定按钮，点击确定按钮后要刷新数据，并指定要刷新的数据接口及接口所需参数
 *    其中函数的参数封装在函数名之中； 例如传过来的函数名格式为 deleteRole(' + id + ')
 * @param func
 * @param alertContent
 */
function informationAlert_OnlyCancelButton_REFRESH(func,alertContent){
    $.alert({
        title: '系统消息',
        content: alertContent,
        buttons: {
            "确定": function () {
              eval(func);
            }
        }
    });
}

/**
 * 3、弹出框有取消和确定按钮，根据传入的内容进行提示，点击确定按钮，调用指定的函数，
 *    其中函数的参数封装在函数名之中； 例如传过来的函数名格式为 deleteRole(' + id + ')
 * @param func
 * @param alertContent
 */
function informationAlert_confirmAndCancelButton(func,alertContent){
    $.confirm({
        title: '系统消息',
        content: alertContent,
        typeAnimated: true,
        buttons: {
            tryAgain: {
                text: '确定',
                btnClass: 'btn-green',
                action: function(){
                    eval(func);
                }
            },
            "取消": function () {
            }
        }
    });
}

