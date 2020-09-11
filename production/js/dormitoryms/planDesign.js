var data = {};

(function ($) {
	//进行公寓区的单独查询
	findAllDorm();
	
	$("#dormRegion").change(function(){
    	findDormBuilding();
    });
	
    //默认参数
    var defaults = {
        width: "",
        height: "",
        trAttr: [],
        tdAttr: [],
        rows: 10,
        cols: 8
    }
	//点击查询
	$(function () {

        $("#myButton").click(function () {
            var id = $("#dormBuiding").val();
            if (id == null || id == "" || id == 0) {
                informationAlert_OnlyConfirmButton_NOT_REFRESH("请选择楼栋号！")
                return;
            }
            $("#box").html("");
            GetData(id);
        });
    })

    var BaseTable;
    $.fn.extend({
        ETable: function (options) {
            $.extend(true, defaults, options);

            var el = $(this).addClass("ETable_table_flow");
            el.html("");
            var panel = CreatPanelDiv(defaults.width, defaults.height);

            //生成功能区
            var btnPanel = CreateBtnDiv();


            panel.appendChild(btnPanel);

            //生成默认表格
            var table = CreateTable();
            for (var j = 1; j <= defaults.rows; j++) {
                var tr = CreateTr(defaults.trAttr, j);

                table.appendChild(tr);
            }
            panel.appendChild(table);
            el.append(panel);
            el.addClass();
            BaseTable = table;
        },
        ETable_Render: function (options) {
            var el = $(this).addClass("ETable_table_flow");
            BaseTable = el.find("table").addClass("ETable_table").attr("id", "etable_table");

            //生成功能区
            var btnPanel = CreateBtnDiv();

            $(el).prepend(btnPanel);

            //渲染界面表格
            var trList = $(el).find("tr");

            //渲染行
            for (var i = 0; i < trList; i++) {
                $(trList[i]).attr("id", "etable_tr_" + (i + 1)).attr("rowNum", (i + 1));
            }

            //渲染列
            var rowCount = trList.length;
            var colCount = getColCountByTr(trList[0]);
            defaults.cols = colCount;
            defaults.rows = rowCount;
            var mergeList = [];

            for (var j = 0; j < trList.length; j++) {
                var rowNum = j + 1;
                $(trList[j]).attr("id", "etable_tr_" + rowNum).attr("rowNum", rowNum);
                var tdList = $(trList[j]).find("td");
                for (var i = 0; i < tdList.length; i++) {
                    var td = $(tdList[i]);
                    var rowspan = parseInt($(td).attr("rowSpan"));
                    if ($(td).attr("rowSpan") == null) {
                        rowspan = 0;
                    }
                    var colspan = parseInt($(td).attr("colSpan"));
                    if ($(td).attr("colSpan") == null) {
                        colspan = 0;
                    }
                    var colNum = i + 1;
                    if (rowspan > 1 || colspan > 1) {
                        var mergeModel = { beginRow: (j + 1), endRow: (j + 1 + rowspan), beginCol: (i + 1), colspan: colspan }
                        mergeList.push(mergeModel);
                    }
                    if (mergeList.length > 0) {
                        for (var k = 0; k < mergeList.length; k++) {
                            var model = mergeList[k];
                            if ((rowNum == model.beginRow) && (colNum == model.beginCol)) {
                                break;
                            }
                            if (rowNum >= model.beginRow && rowNum <= model.endRow) {
                                if (rowNum == model.beginRow && colNum > model.beginCol) {
                                    colNum += model.colspan - 1;
                                } else if (colNum >= model.beginCol) {
                                    colNum += model.colspan;
                                }
                            }
                        }
                    }
                    $(td).attr("id", "etable_td_" + rowNum + "_" + colNum).attr("rowNum", rowNum).attr("celNum", colNum);
                    $(td).click(function () { selectCel(this) })
                }
            }
        }
    })


    //-------------------------元素创建方法------------------------
    //创建主容器div
    function CreatPanelDiv(width, height) {
        var panelDiv = document.createElement("div");
        panelDiv.style.width = width;
        panelDiv.style.height = height;
        panelDiv.nodeName = "etable_panel";
        panelDiv.id = "etable_panel";
        panelDiv.classList.add("etable_panel");
        return panelDiv;
    }

    //创建按钮容器
    function CreateBtnDiv() {
        var btnDiv = document.createElement("div");
        btnDiv.classList.add("ETable_table_Panel_Btn");

        //合并按钮
        var btnMerge = CreateBtn("合并");
        btnMerge.onclick = function () { merge(); }
        btnDiv.appendChild(btnMerge);

        //拆分按钮
        var btnSplit = CreateBtn("拆分");
        btnSplit.onclick = function () { split(); }
        btnDiv.appendChild(btnSplit);

        //添加行按钮
        var btnAddRow = CreateBtn("添加行");
        btnAddRow.onclick = function () { addRow(); }
        btnDiv.appendChild(btnAddRow);

        //删除行按钮
        var btnDelRow = CreateBtn("删除行");
        btnDelRow.onclick = function () { deleteRow(); }
        btnDiv.appendChild(btnDelRow);

        //添加列按钮
        var btnAddCol = CreateBtn("添加列");
        btnAddCol.onclick = function () { addCol(); }
        btnDiv.appendChild(btnAddCol);

        //删除列按钮
        var btnDelCol = CreateBtn("删除列");
        btnDelCol.onclick = function () { delCol(); }
        btnDiv.appendChild(btnDelCol);

        //添加首行
        var btnAddFirstRow = CreateBtn("添加首行");
        btnAddFirstRow.onclick = function () { addFirstRow(); }
        btnDiv.appendChild(btnAddFirstRow);

        //添加首列
        var btnAddFirstCol = CreateBtn("添加首列");
        btnAddFirstCol.onclick = function () { addFirstCol(); }
        btnDiv.appendChild(btnAddFirstCol);

        //保存模版
        var btnSavePlan = CreateBtn("保存模版");
        btnSavePlan.onclick = function () { btnSave(); }
        btnDiv.appendChild(btnSavePlan);

        return btnDiv;
    }

    //创建Table
    function CreateTable() {
        var table = document.createElement("table");
        table.nodeName = "etable_table";
        table.id = "etable_table";
        table.classList.add("ETable_table");
        return table;
    }

    //创建tr
    //attr：自添加元素
    //j:行号
    function CreateTr(attr, j) {
        var defaultAttrs = [{ name: "rowNum", value: j }];
        if (attr != null && attr.count > 0) {
            defaultAttrs = defaultAttrs.concat(attr);
        }
        var tr = document.createElement("tr");
        $.each(defaultAttrs, function (value, index, array) {
            tr.setAttribute(this.name, this.value);
        })
        tr.nodeName = "etable_tr_" + j;
        tr.id = "etable_tr_" + j;
        for (var i = 1; i <= defaults.cols; i++) {
            var td = CreatTd(defaults.tdAttr, j, i, "");
            tr.appendChild(td);
        }
        return tr;
    }

    //创建td
    //attr：自添加元素
    //j:行号
    //i:列号
    function CreatTd(attr, j, i, value) {
        var defaultAttrs = [{ name: "rowNum", value: j }, { name: "celNum", value: i }];
        if (attr != null && attr.length > 0) {
            defaultAttrs = defaultAttrs.concat(attr);
        }
        var td = document.createElement("td");
        $.each(defaultAttrs, function (value, index, array) {
            td.setAttribute(this.name, this.value);
        })
        td.nodeName = "etable_td_" + j + "_" + i;
        td.id = "etable_td_" + j + "_" + i;
        td.innerHTML = value;
        $(td).click(function () { selectCel(this) })
        return td;
    }

    //创建输入框
    //val:输入框默认值
    function CreatInput(val) {
        var input = document.createElement("input");
        input.onblur = function () {
            $(this).parent().click(function () {
                selectCel(this)
            });
            $(this).parent().html($(this).val());
        }
        input.value = val;
        input.style.height = "25px";
        input.style.lineHeight = "25px";
        input.style.width = "75px";
        return input;
    }

    //创建按钮
    function CreateBtn(value) {
        var btn = document.createElement("input");
        btn.type = "button";
        btn.classList.add("ETable_table_Btn");
        btn.value = value;
        return btn;
    }


    //-------------------------元素创建方法化End------------------------

    //-------------------------功能按钮方法------------------------

    //合并单元格
    function merge() {
        var tdList = $(BaseTable).find(".ETable_table_Active");
        if (tdList != null && tdList.length > 1) {
            var list = [];
            var rowList = [];
            var bool = false;
            //将td转化为已行号为分组的数组，并记录所有行号
            $.each(tdList, function (value, index, array) {
                var rowspan = $(index).attr("rowspan");
                var colspan = $(index).attr("colspan");
                if (rowspan != null || colspan != null) {
                    bool = true;
                    return;
                }
                var row = $(index).attr("rowNum");
                var cel = $(index).attr("celNum");
                if (rowList.indexOf(row) > -1) {
                    list[row].push(cel);
                } else {
                    list[row] = [cel];
                    rowList.push(row);
                }
            })
            if (bool) {
                alert("所选单元格中存在已合并单元格，请先拆分");
                return;
            }
            //验证所选择的列是否符合合并规则
            var celList = null;
            for (var key in list) {
                if (celList == null) {
                    celList = list[key];
                } else {
                    for (var cel in list[key]) {
                        if (list[key].length != celList.length || list[key][cel] != celList[cel]) {
                            alert("所选列不规范！");
                            return
                        }
                    }
                }
            }
            //验证选择的行是否符合合并规则
            for (var i = 0; i < rowList.length; i++) {
                if (i != rowList.length - 1 && parseInt(rowList[i]) + 1 != parseInt(rowList[i + 1])) {
                    alert("所选行不规范！");
                    return
                }
            }
            $("#etable_td_" + rowList[0] + "_" + celList[0]).attr("rowspan", rowList.length).attr("colspan", celList.length);
            for (var j = 0; j < rowList.length; j++) {
                for (var i = 0; i < celList.length; i++) {
                    if (j == 0 && i == 0) {
                        continue;
                    } else {
                        $("#etable_td_" + rowList[j] + "_" + celList[i]).remove();
                    }
                }
            }
        } else {
            alert("请选择要合并的单元格");
        }
    }

    //拆分
    function split() {
        var tdlist = $(BaseTable).find(".ETable_table_Active");
        if (!checkSingle()) {
            return;
        }
        var td = tdlist[0];
        var rowspan = parseInt($(td).attr("rowspan"));

        var colspan = parseInt($(td).attr("colspan"));

        if (rowspan == null && colspan == null) {
            alert("该单元格没有合并！");
            return;
        }
        if ($(td).attr("rowspan") == null) {
            rowspan = 1;
        }
        if ($(td).attr("colspan") == null) {
            colspan = 1;
        }
        var row = parseInt($(td).attr("rowNum"));
        var cel = parseInt($(td).attr("celNum")) - 1;

        for (var j = 0; j < rowspan; j++) {

            for (var i = 0; i < colspan; i++) {
                var newTd = CreatTd(defaults.tdAttr, row + j, (cel + i + 1), "");
                if (j == 0 && i == 0) {
                    continue;
                } else {
                    if (cel + i == 0) {
                        $("#etable_tr_" + (row + j)).prepend(newTd);
                    } else {
                        $("#etable_td_" + (row + j) + "_" + (cel + i)).after(newTd);
                    }
                }
            }
        }
        $(td).attr("rowspan", null).attr("colspan", null);
    }

    //添加行
    function addRow() {
        var tdlist = $(BaseTable).find(".ETable_table_Active");
        if (!checkSingle()) {
            return;
        }
        var td = tdlist[0];

        var tr = $(td).parent();
        if (checkMerge(tr, false, true)) {
            alert("选中行中存在跨行合并，无法添加");
            return;
        }
        var row = parseInt($(td).attr("rowNum"));

        var rowspan = parseInt($(td).attr("rowspan"));
        if (rowspan > 0) {
            row += (rowspan - 1)
        }
        ChangeAfterRow(row, 1);
        var tr = CreateTr(defaults.trAttr, (row + 1));
        $("#etable_tr_" + row).after(tr);
        defaults.rows = defaults.rows + 1;
    }

    //删除行
    function deleteRow() {
        var tdlist = $(BaseTable).find(".ETable_table_Active");
        if (!checkSingle()) {
            return;
        }
        var td = tdlist[0];
        var tr = $(td).parent();
        var checkList = $(tr).find("td");
        var NotChange = false;
        for (var i = 0; i < checkList.length; i++) {
            if (NotEdit(checkList[i])) {
                NotChange = true;
                break;
            }
        }
        if (NotChange) {
            alert("选中列中存在不可编辑信息！");
            return;
        }
        if (checkMerge(tr, false, true)) {
            alert("选中行中存在合并，无法删除");
            return;
        }
        var row = parseInt($(td).attr("rowNum"));
        ChangeAfterRow(row, -1);
        $(tr).remove();
        defaults.rows = defaults.rows - 1;
    }

    //添加列
    function addCol() {
        var tdlist = $(BaseTable).find(".ETable_table_Active");
        if (!checkSingle()) {
            return;
        }
        var td = tdlist[0];
        var col = parseInt($(td).attr("celNum"));
        var colspan = 0;


        var baseCol = col


        if ($(td).attr("colspan") != null) {
            colspan = parseInt($(td).attr("colspan"));
            col += colspan;
            baseCol = col + 2
        }
        var changeTrList = $(BaseTable).find("tr");
        if (col < defaults.cols) {
            var isCheck = false;
            var checkTrList = $(BaseTable).find("tr");
            for (var i = 0; i < checkTrList.length; i++) {
                if ($(checkTrList[i]).find("#etable_td_" + (i + 1) + "_" + col).length == 0) {
                    if ($(checkTrList[i]).find("#etable_td_" + (i + 1) + "_" + (col + 1)).length == 0) {
                        isCheck = true;
                    }
                }
                var checkTdList = $(checkTrList[i]).find("td");
                for (var j = 0; j < checkTdList.length ; j++) {
                    if ((j + 1) == col) {
                        var check = parseInt($(checkTdList[j]).attr("colSpan"));
                        if (check > 0) {
                            isCheck = true;
                        }
                    }
                }
                if (isCheck) {
                    break;
                }
            }
            if (isCheck) {
                alert("选中列中存在合并，无法添加");
                return;
            }
            for (var j = 0; j < changeTrList.length; j++) {
                var changeTdList = $(changeTrList[j]).find("td");

                for (var i = 0; i < changeTdList.length; i++) {
                    var celNum = parseInt($(changeTdList[i]).attr("celNum"));
                    var rowNum = parseInt($(changeTdList[i]).attr("rowNum"));
                    if (celNum > col) {
                        $(changeTdList[i]).attr("celNum", (celNum + 1)).attr("id", "etable_td_" + (j + 1) + "_" + (celNum + 1));
                        celNum++;
                    }

                    if ($("#etable_td_" + rowNum + "_" + col).length == 0) {
                        if (celNum == baseCol) {
                            var newTd = CreatTd(defaults.tdAttr, rowNum, (baseCol - 1), "");
                            if (baseCol > defaults.cols) {
                                $("#etable_tr_" + (rowNum)).append(newTd)
                            } else {
                                $("#etable_td_" + (rowNum) + "_" + baseCol).before(newTd);
                            }
                        }
                    } else if (celNum == col) {
                        var newTd = CreatTd(defaults.tdAttr, rowNum, (col + 1), "");
                        $("#etable_td_" + (rowNum) + "_" + col).after(newTd);
                    }

                }
            }
           
        } else if (col >= defaults.cols){
            for (var j = 0; j < changeTrList.length; j++) {
                var newTd = CreatTd(defaults.tdAttr, (j+1), (defaults.cols + 1), "");
                $(changeTrList[j]).append(newTd)
            }
        }
        defaults.cols = defaults.cols + 1;
    }

    //删除列
    function delCol() {
        var tdlist = $(BaseTable).find(".ETable_table_Active");
        if (!checkSingle()) {
            return;
        }
        var td = tdlist[0];
        var col = parseInt($(td).attr("celNum"));

        var checkTrList = $(BaseTable).find("tr");
        var isCheck = false;
        var NotChange = false;
        for (var i = 0; i < checkTrList.length; i++) {

            if ($(checkTrList[i]).find("#etable_td_" + (i + 1) + "_" + col).length == 0) {
                isCheck = true;
            }
            var checkTdList = $(checkTrList[i]).find("td");
            for (var j = 0; j < checkTdList.length ; j++) {
                if ((j + 1) == col) {
                    //前边有合并列，在遍历到合并的第二个单元格所在行时当前行总单元格数量中会少计算那一个合并的单元格
                    //if (NotEdit(checkTdList[j])) {
                    //    NotChange = true;
                    //}
                    if (NotEdit("#etable_td_" + (i + 1) + "_" + col)) {
                        NotChange = true;
                    }
                    var colspan = parseInt($(checkTdList[j]).attr("colSpan"));
                    if (colspan > 0) {
                        isCheck = true;
                    }
                }
            }
            if (isCheck) {
                break;
            }
            if (NotChange) {
                break;
            }
        }
        if (isCheck) {
            alert("选中列中存在跨列合并，无法删除");
            return;
        }
        if (NotChange) {
            alert("选中列中存在不可编辑信息！");
            return;
        }
        var changeTdList = $(BaseTable).find("td");

        for (var i = 0; i < changeTdList.length; i++) {
            var rowNum = $(changeTdList[i]).parent().attr("rowNum");
            var celNum = parseInt($(changeTdList[i]).attr("celNum"));

            if (celNum > col) {
                $(changeTdList[i]).attr("celNum", (celNum - 1)).attr("id", "etable_td_" + rowNum + "_" + (celNum - 1));
            } else if (celNum == col) {
                $(changeTdList[i]).remove();
            }
        }
        defaults.cols = defaults.cols - 1;
    }

    //添加首行
    function addFirstRow() {
        ChangeAfterRow(0, 1);
        var tr = CreateTr(defaults.trAttr, 1);
        $(tr).prependTo(BaseTable);
        defaults.rows += 1;
    }

    //添加首列
    function addFirstCol() {
        var changeTdList = $(BaseTable).find("td");
        for (var i = 0; i < changeTdList.length; i++) {
            var rowNum = $(changeTdList[i]).parent().attr("rowNum");
            var celNum = parseInt($(changeTdList[i]).attr("celNum"));
            $(changeTdList[i]).attr("celNum", (celNum + 1)).attr("id", "etable_td_" + rowNum + "_" + (celNum + 1));
        }
        var trList = $(BaseTable).find("tr");
        for (var i = 1; i <= trList.length; i++) {
            var td = CreatTd(defaults.tdAttr, i, 1, "");
            $(trList[i - 1]).prepend(td);
        }
        defaults.cols += 1;

    }
    //保存模版
    function btnSave() {
        
        
        var html = $("#etable_table")[0].outerHTML;
        var html = html.replace("ETable_table_Active", "");
        var Moban = encodeURI(html);
        console.log(html)
        var bulidId = $("#BuildingId").val();
        School.waitPanel.showWait("正在保存模版。。。。。。", 99999);
        $.post($.Url.Save, { moban: Moban, bulidId: bulidId }, function (result) {
            if (result.flag) {
                top.$.messager.alert("系统提示", "保存成功！", "info");
            }
            else {
                top.$.messager.alert("系统提示", result.msg == null ? "操作失败，对此抱歉！" : result.msg, "error");
            }
            School.waitPanel.closeWait();
        })
    }

    //-------------------------功能按钮方法End------------------------

    //-------------------------单元格事件------------------------
    //单元格选中事件
    function selectCel(obj) {
        var count = $(obj).attr("clickCount");
        if (event.ctrlKey == 1) {
            if (NotEdit(obj)) {
                alert("该单元格不允许多选");
                return;
            }
            var tdlist = $(BaseTable).find(".ETable_table_Active");
            var check = false;
            for (var i = 0; i < tdlist.length; i++) {
                if (NotEdit(tdlist[i])) {
                    check = true;
                    break;
                }
            }
            if (check) {
                alert("该单元格不允许多选");
                return;
            }
            if (count == null || count == "0") {
                $(obj).addClass("ETable_table_Active").attr("clickCount", "1");
            } else if (count == "1") {
                $(obj).attr("clickCount", "0").removeClass("ETable_table_Active");
            }
        }
        else {
            if (count == null || count == "0") {
                $("#etable_table .ETable_table_Active ").attr("clickCount", "0").removeClass("ETable_table_Active");
                $(obj).addClass("ETable_table_Active").attr("clickCount", "1");
            } else if (count == "1" && !NotEdit(obj)) {
                $("#etable_table .ETable_table_Active ").attr("clickCount", "0").removeClass("ETable_table_Active");
                var row = $(obj).attr("rowNum");
                var rowId = "etable_tr_" + row;
                $("#" + rowId + " td").addClass("ETable_table_Active").attr("clickCount", "2");
            } else if (count == "2") {
                $("#etable_table .ETable_table_Active ").attr("clickCount", "0").removeClass("ETable_table_Active");
                $(obj).unbind("click");

                var input = CreatInput($(obj).html())
                $(obj).html("");
                obj.appendChild(input);
                input.select();
            }
        }
    }

    //-------------------------单元格事件end------------------------

    //-------------------------公用方法------------------------

    //检查是否单选
    function checkSingle() {
        var tdlist = $(BaseTable).find(".ETable_table_Active");
        if (tdlist.length == 0) {
            alert("请选择要拆分的单元格");
            return false;
        }
        if (tdlist.length > 1) {
            alert("只可选择一个单元格进行拆分");
            return false;
        }
        return true;
    }

    //检查是否可以编辑
    function NotEdit(obj)
    {
        var cla = $(obj).attr("class");
        if ( cla == null || cla == "" || cla.length == 0) {
            return false;
        } else if (cla.indexOf("not-edit") != -1) {
            return true;
        }
    }

    //将所选行后的行进行移动
    //row:所选行的行号
    //num:移动的行数，正数为向下移动，负数为向上移动
    function ChangeAfterRow(row, num) {
        row = parseInt(row);
        num = parseInt(num);
        //将选中行之后的所有行行号加1
        var changeTrList = $(BaseTable).find("tr");
        for (var j = 0 ; j < changeTrList.length; j++) {
            var trRow = parseInt($(changeTrList[j]).attr("rowNum"));
            if (trRow > row) {
                $(changeTrList[j]).attr("rowNum", (trRow + num)).attr("id", "etable_tr_" + (trRow + num));
            }
        }

        //所有选中行之后的行中的列行号+1
        var changeTdList = $(BaseTable).find("td");
        for (var i = 0 ; i < changeTdList.length; i++) {
            var rowNum = $(changeTdList[i]).parent().attr("rowNum");
            var celNum = $(changeTdList[i]).attr("celNum");
            if (num > 0) {
                if (rowNum > row) {
                    $(changeTdList[i]).attr("rowNum", rowNum).attr("id", "etable_td_" + rowNum + "_" + celNum);
                }
            } else {
                if (rowNum >= row) {
                    $(changeTdList[i]).attr("rowNum", rowNum).attr("id", "etable_td_" + rowNum + "_" + celNum);
                }
            }

        }
    }

    //获取行中的列数
    function getColCountByTr(tr) {
        var count = 0;
        $(tr).find("td").each(function () {
            var colspan = parseInt($(this).attr("colspan"));
            if (colspan != null && colspan > 0) {
                count += colspan;
            } else {
                count += 1;
            }
        })
        return count;
    }

    //检查一行中是否有单元格合并
    function checkMerge(tr, checkCol, checkRow) {
        var flag = false;
        if (checkCol == false && checkRow == false) {
            return false;
        }
        var tdList = []
        tdList = $(tr).find("td");
        for (var i = 0; i < tdList.length ; i++) {
            var rowspan = parseInt($(tdList[i]).attr("rowSpan"));
            var colspan = parseInt($(tdList[i]).attr("colSpan"));
            if (checkCol == true && colspan > 0) {
                flag = true;
                break;
            }
            if (rowspan > 1 && checkRow == true) {
                flag = true;
                break;
            }

            //if (tdList.length < defaults.cols) {
            //    flag = true;
            //    break;
            //}
        }
        return flag;
    }
    //-------------------------公用方法end------------------------

	//进行公寓区的查询
	function findAllDorm(){
	    var msg = {};
	    msg.appName = "apart_findAparMangAll";
	    // 4、对整个参数进行加密
	    var jsonStr = buildRequestParam(msg);
	
	    $.ajax({
	        type: 'POST',
	        url: serverBaseUrl,
	        data: jsonStr,
	        dataType: "json",
	        async:false,
	        success: function (success) {
	            if(success.msgState == 200){
	            	var html="<option selected='selected' value='-1'>---- 请选择 -----</option>"
	            	$.each(success.data,function(index,element){
	            		html+="<option value="+element.id+">"+element.name+"</option>";
	            	})
	            	$("#dormRegion").html(html);
	            }
	        },
	        beforeSend: function (xhr) {
	            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
	            xhr.setRequestHeader("token", static_token);
	        }
	    });
	}

	//进行楼栋的查询
	function findDormBuilding(){
		var msg = {};
	    msg.area=$("#dormRegion").val();
	    msg.appName="amang_findAMangAll";
	    serverFromJSONData(msg,true).then(function (success) {
	        if(success.msgState === 200){
	        	var html="<option selected='selected' value='-1'>---- 请选择 -----</option>"
	            	$.each(success.data,function(index,element){
	            		html+="<option value="+element.id+">"+element.apartmentName+"</option>";
	            	})
	            	$("#dormBuiding").html(html);
	        }else{
	            informationAlert_OnlyConfirmButton_NOT_REFRESH("查询失败："+success.msg);
	        }
	    });
	}

	//从后台拿去数据
	function GetData(id) {
        School.waitPanel.showWait("正在生成数据。。。。", 9999);
        $.post($.Url.Data, { id: id }, function (result) {
            if (result.flag) {
                School.waitPanel.closeWait();
                if (result.msg == "Have Plan")
                {
                    data = decodeURI(result.data);
                    $("#Template_Table").tmpl(null).appendTo("#box");                 
                    $("#box").html(data);
                    $("#box").ETable_Render();
                } else
                {
                    data = result.data;
                    $("#Template_Table").tmpl(data).appendTo("#box");
                    $("#box").ETable_Render();
                }
            }
            else {
                School.waitPanel.closeWait();
                top.$.messager.alert("提示", (result.msg == "" ? "数据获取失败,请重试" : result.msg), "error");
            }
        })
    }
	
})(jQuery);