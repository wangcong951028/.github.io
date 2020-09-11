/** excel导入导出工具类 **/
var wb;//读取完成的数据
var rABS = false; //是否将文件读取为二进制字符串
var jsonObj;
var head="";
/*
 json字段说明：
 json = {"姓名": gradeData[i].s_StudentName,
         "学号": gradeData[i].s_xgh,
         "科目": gradeData[i].courseName,
         "总分": gradeData[i].s_totalScore,
         "成绩": gradeData[i].s_Score,
         "班级": gradeData[i].className,
         "考试场次": gradeData[i].infoName
 };
 **/

/***
 * 1、excel导入
 * @param obj 传入的文件对象
 */
function importf(obj) {
    if(!obj.files) {
    	jsonObj = new Array();
        return;
    }
    var f = obj.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = e.target.result;
        if(rABS) {
            wb = XLSX.read(btoa(fixdata(data)), {//手动转化
                type: 'base64'
            });
        } else {
            wb = XLSX.read(data, {
                type: 'binary'
            });
        }
        //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
        //wb.Sheets[Sheet名]获取第一个Sheet的数据
        //document.getElementById("demo").innerHTML= JSON.stringify( XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) );
        var ss = JSON.stringify( XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
        var data = eval('(' + ss + ')');
        jsonObj = new Array();
        for(var i = 0; i < data.length;i++ ){
            jsonObj[i] = data[i];
        }
    };
    if(rABS) {
        reader.readAsArrayBuffer(f);
    } else {
        reader.readAsBinaryString(f);
    }
}

/***
 * 2、文件流转BinaryString
 * @param data
 * @returns {string}
 */
function fixdata(data) {
    var o = "",
        l = 0,
        w = 10240;
    for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
    return o;
}

/***
 * 3、导出excel
 * @param json json串
 * @param id  html标签id
 * @param type 文件类型
 */
var tmpDown; //导出的二进制对象
function downloadExl(json,id ,flag,type) {
    var tmpdata = json[0];
    json.unshift({});
    var keyMap = []; //获取keys
    for (var k in tmpdata) {
        keyMap.push(k);
        json[0][k] = k;
    }
    var tmpdata = [];//用来保存转换好的json
    json.map((v,i) => keyMap.map((k, j) => Object.assign({}, {
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
        {bookType: (type == undefined ? 'xlsx':'xls'),bookSST: false, type: 'binary'}
    ))], {
        type: ""
    }); //创建二进制对象写入转换好的字节流
    var href = URL.createObjectURL(tmpDown); //创建对象超链接
    if(flag){
    	document.getElementById(id).href = href; //绑定a标签
	  	document.getElementById(id).click(); //模拟点击实现下载
    }else{
    	document.getElementById(id).href = href; //绑定a标签
    }
    setTimeout(function() { //延时释放
        URL.revokeObjectURL(tmpDown); //用URL.revokeObjectURL()来释放这个object URL
    }, 100);
}

/***
 * 4、导出excel文件
 * @param json 字符串
 * @param type
 */
function downloadExl_onlyJson(json, type) {
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

function importGrade(obj) {
	var arrays=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    if(!obj.files) {
    	jsonObj = new Array();
        return;
    }
    var f = obj.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = e.target.result;
        if(rABS) {
            wb = XLSX.read(btoa(fixdata(data)), {//手动转化
                type: 'base64'
            });
        } else {
            wb = XLSX.read(data, {
                type: 'binary'
            });
        }
        //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
        //wb.Sheets[Sheet名]获取第一个Sheet的数据
        //document.getElementById("demo").innerHTML= JSON.stringify( XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) );
        debugger;
        persons = [];
        if (wb.Sheets.hasOwnProperty(wb.SheetNames[0])) {
            var fromTo = wb.Sheets[wb.SheetNames[0]]['!ref'];
            console.log(fromTo);
            var persons = persons.concat(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
            // break; // 如果只取第一张表，就取消注释这行
        }
        var mi=wb.SheetNames[0];
        var ui=fromTo[3];
        
        
        for(var i=0;i<arrays.length;i++){
        	if(i==0){
        		head+= wb.Sheets[mi][arrays[i]+'1'].v;
        	}else{
        		head+= ","+wb.Sheets[mi][arrays[i]+'1'].v;
        	}
        	if(arrays[i]==ui){
        		break;
        	}
        }
        
        var ss = JSON.stringify( XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
        var data = eval('(' + ss + ')');
        jsonObj = new Array();
        for(var i = 0; i < data.length;i++ ){
            jsonObj[i] = data[i];
        }
    };
    if(rABS) {
        reader.readAsArrayBuffer(f);
    } else {
        reader.readAsBinaryString(f);
    }
}
