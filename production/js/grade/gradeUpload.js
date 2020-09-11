
/*导出*/
function downloadGrade() {
    // 2、接口请求参数组装
    var msg = {};
    msg.studentCode = $("#keyWord").val();
    msg.tremID = $("#tremName").val();
    msg.infoID = $("#infoName").val();
    msg.courseID = $("#courseName").val();
    msg.classID = $("#className").val();

    msg.appName="grade_download";

    serverFromJSONData(msg,true).then(function (success) {
        if(success.msgState == 200){
            var gradeData = success.data;
            var jsonDome = []
            for (var i = 0; i < gradeData.length; i++) {
                jsonDome[i] = {
                    "姓名": gradeData[i].s_StudentName,
                    "学号": gradeData[i].s_xgh,
                    "科目": gradeData[i].courseName,
                    "总分": gradeData[i].s_totalScore,
                    "成绩": gradeData[i].s_Score,
                    "班级": gradeData[i].className,
                    "考试场次": gradeData[i].infoName
                };
            }
            downloadExl(jsonDome);
            informationAlert_OnlyConfirmButton_NOT_REFRESH("导出成功！");
        }else{
            informationAlert_OnlyConfirmButton_NOT_REFRESH(success.msg);
        }

    }),function (error) {
        console.log("访问服务器发生错误，请稍后再试!",error);
    };
}

var tmpDown; //导出的二进制对象
function downloadExl(json, type) {
    var tmpdata = json[0];
    json.unshift({});
    var keyMap = []; //获取keys
    for (var k in tmpdata) {
        keyMap.push(k);
        json[0][k] = k;
    }
    var tmpdata = [];//用来保存转换好的json
    json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
        v: v[k],
        position: (j > 25 ? getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
    }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
        v: v.v
    });
    var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
    var tmpWB = {
        SheetNames: ['mySheet'], //保存的表标题
        Sheets: {
            'mySheet': Object.assign({},
                        tmpdata, //内容
                        {
                            '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
                        })
        }
    };

    tmpDown = new Blob([s2ab(XLSX.write(tmpWB,
        {bookType: (type == undefined ? 'xlsx':type),bookSST: false, type: 'binary'}//这里的数据是用来定义导出的格式类型
    ))], {
        type: ""
    }); //创建二进制对象写入转换好的字节流
    var href = URL.createObjectURL(tmpDown); //创建对象超链接
    document.getElementById("hf").href = href; //绑定a标签
    document.getElementById("hf").click(); //模拟点击实现下载
    setTimeout(function() { //延时释放
        URL.revokeObjectURL(tmpDown); //用URL.revokeObjectURL()来释放这个object URL
    }, 100);
}

function s2ab(s) { //字符串转字符流
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}
// 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
function getCharCol(n) {
    let temCol = '',
        s = '',
        m = 0
    while (n > 0) {
        m = n % 26 + 1
        s = String.fromCharCode(m + 64) + s
        n = (n - m) / 26
    }
    return s
}