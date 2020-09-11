function getTree() {

    var tree = [{
        text: 'Parent 1',
        href: '#parent1',
        tags: ['4'],
        state: {
            checked: true
        },
        nodes: [
            {
                text: 'Child 1',
                href: '#child1',
                tags: ['2'],
                nodes: [
                    {
                        text: 'Grandchild 1',
                        href: '#grandchild1',
                        tags: ['0']
                    },
                    {
                        text: 'Grandchild 2',
                        href: '#grandchild2',
                        tags: ['0']
                    }
                ]
            },
            {
                text: 'Child 2',
                href: '#child2',
                tags: ['0']
            }
        ]
    },
        {
            text: 'Parent 2',
            href: '#parent2',
            tags: ['0'],
            nodes: [
                {
                    text: 'Child 1',
                    href: '#child1',
                    tags: ['2'],
                    nodes: [
                        {
                            text: 'Grandchild 1',
                            href: '#grandchild1',
                            tags: ['0']
                        },
                        {
                            text: 'Grandchild 2',
                            href: '#grandchild2',
                            tags: ['0']
                        }
                    ]
                },
                {
                    text: 'Child 2',
                    href: '#child2',
                    tags: ['0']
                }
            ]
        },
        {
            text: 'Parent 3',
            href: '#parent3'
        },
        {
            text: 'Parent 4',
            href: '#parent4',
            tags: ['0']
        },
        {
            text: 'Parent 5',
            href: '#parent5',
            tags: ['0']
        }]


    return tree;
}
$(function () {

    $('#tree').treeview({
        data: getTree(),       // 数据
        showCheckbox:true,
        //selectedColor:'#FFFFF',//设置选中项的颜色
        color: "#428bca",//背景颜色
        multiSelect:true,//多选
        expandIcon: 'glyphicon glyphicon-chevron-right',
        collapseIcon: 'glyphicon glyphicon-chevron-down',
        //nodeIcon: 'glyphicon glyphicon-bookmark'//设置图标
        onNodeChecked: function(event, node) { //选中节点
            var selectNodes = getChildNodeIdArr(node); //获取所有子节点
            if (selectNodes) { //子节点不为空，则选中所有子节点
                $('#tree').treeview('checkNode', [selectNodes, { silent: true }]);
            }
            var parentNode = $("#tree").treeview("getNode", node.parentId);
            setParentNodeCheck(node);
        },
        onNodeUnchecked: function(event, node) { //取消选中节点
            var selectNodes = getChildNodeIdArr(node); //获取所有子节点
            if (selectNodes) { //子节点不为空，则取消选中所有子节点
                $('#tree').treeview('uncheckNode', [selectNodes, { silent: true }]);
            }
        }
    });
    $('#tree').treeview('checkAll', { silent: true });
    function getChildNodeIdArr(node) {
        var ts = [];
        if (node.nodes) {
            for (x in node.nodes) {
                ts.push(node.nodes[x].nodeId);
                if (node.nodes[x].nodes) {
                    var getNodeDieDai = getChildNodeIdArr(node.nodes[x]);
                    for (j in getNodeDieDai) {
                        ts.push(getNodeDieDai[j]);
                    }
                }
            }
        } else {
            ts.push(node.nodeId);
        }
        return ts;
    }

    function setParentNodeCheck(node) {
        var parentNode = $("#tree").treeview("getNode", node.parentId);
        if (parentNode.nodes) {
            var checkedCount = 0;
            for (x in parentNode.nodes) {
                if (parentNode.nodes[x].state.checked) {
                    checkedCount ++;
                } else {
                    break;
                }
            }
            if (checkedCount === parentNode.nodes.length) {
                $("#tree").treeview("checkNode", parentNode.nodeId);
                setParentNodeCheck(parentNode);
            }
        }
    }

})



function myButton1() {
    console.debug("------------------");
    var aa = $('#tree').treeview('getSiblings', getTree());
    //console.debug(aa);
    var bb = $('#tree').treeview('getSelected', getTree());
    console.debug(bb);
    for (var i = 0;i<bb.length;i++ ){
        console.debug(bb[i].text);
    }
    console.debug("------------------");
}



$(function () {
   findDeptNode();
})
function common(msg){
    var param = {};
    // 1、公共参数组装
    param.appKey = "aGFuZHlDYW1wdXM=";
    param.appSecret ="1234567890abcedefgh";
    var time = new Date().getTime();
    param.time = time;

    /*msg.index = 1;*/
    var paramJsonMsg = JSON.stringify(msg);
    param.param =  paramJsonMsg;
    // 3、生成签名
    var temp = 'appKey=aGFuZHlDYW1wdXM=&appSecret=1234567890abcedefgh&param='+paramJsonMsg+'&time=' + time;
    param.sign = hex_md5(temp);
    // 4、对整个参数进行加密
    var jsonStr = JSON.stringify(param);
    return jsonStr;
}
var nodeItem;
/*发布问卷*/
function findDeptNode() {
    // 2、接口请求参数组装
    var msg = {};
    msg.appName="respondents_findDeptNode";
    var jsonStr = common(msg);
    $.ajax({
        type: 'POST',
        url: "http://192.168.2.22:8081/oauth/auth/oauth.do",
        data: jsonStr,
        dataType: "json",
        success: function (success) {
            var node = success.data;
            nodeItem = node;
            //console.debug(node);
            $('#tree1').treeview({
                data: node,       // data is not optional
                multiSelect:true,
                color: "#428bca",
                expandIcon: 'glyphicon glyphicon-chevron-right',
                collapseIcon: 'glyphicon glyphicon-chevron-down'
                //nodeIcon: 'glyphicon glyphicon-bookmark'

            });
            var aa = $('#tree1').treeview('getSiblings', node);
            console.debug(aa);
        },
        beforeSend: function(xhr) {
            var token = "457513700_eN2akp6Wk9IFIY2QmYRov87JzNGckJLd092ZlX2Mi7xQmJauV5aSmtIFz9Pdl5Vhm7aSmNIFIZaSnpia0JhWnXydlp7NnZ61jMihj3guj5GYIdPdlpROip1dmXIdOdIxzs7d092Wm6RGj5rdOc7TIZ1QnZaTmtIFIc71zcIHOsrMzcAJIdPdkZaclLGhkprdOd0YcoQaTI_buoPd092Nmp6TsZ6SmtIFIulkuelsctITIY2Qk5rdOc7TIYycl5CQk7a7Icox092MmXgdOc7TIYVMmX22R9IFztPdiXyajbGhkprdOd2NkJmLl92C";
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.setRequestHeader("token", token);
        }
    });
}


function myButton() {
    console.debug("------------------");
    var aa = $('#tree1').treeview('getSiblings', nodeItem);
    //console.debug(aa);
    var bb = $('#tree1').treeview('getSelected', nodeItem);
    for (var i = 0;i<bb.length;i++ ){
        console.debug(bb[i].id);
    }
}


