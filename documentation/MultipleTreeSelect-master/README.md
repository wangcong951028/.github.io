### jquery 树形下拉框插件<br>(jquery tree drop box plugin)

MultipleTreeSelect是基于jquery,ztree和sliscroll开发的树形下拉选择框插件，支持ie8+,谷歌，火狐，360等浏览器<br>
(MultipleTreeSelect is an tree drop-down selection box plugin based on jquery and ztree ; support ie8 +, Google, Firefox, 360 and other browsers)

#### MultipleTreeSelect有如下主要特点<br>(has the following main features)
- 兼容ie8以及各大主流浏览器<br>(Compatible ie8 and the major mainstream browser)
- 低侵入式使用<br>(Low intrusion)
- 使用简单方便<br>(Easy to use)
- 继承了ztree高效渲染<br>(Efficient)


**MultipleTreeSelect 欢迎使用本插件: MultipleTreeSelect**
<br>(Welcome to this plugin)
#### 多选示例图片：<br>(Checkbox Example:)
![demo](https://github.com/PureCreek/MultipleTreeSelect.js/raw/master/src/demo/img/2.png)
#### 单选选示例图片：<br>(Radio Example:)
![demo](https://github.com/PureCreek/MultipleTreeSelect.js/raw/master/src/demo/img/3.png)
#### 快速上手示例<br>(Quick start example)：

**1. 引入jquery,ztree,MultipleTreeSelect等js和css文件**

```html
<meta charset="UTF-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<html>
<head>
    <title>$Title$</title>
    <link type="text/css" rel="stylesheet" href="css/demo.css">
    <link type="text/css" rel="stylesheet" href="css/metroStyle/metroStyle.css">
    <script src="js/jquery-1.11.2.min.js"></script>
    <script type="text/javascript" src="js/jquery.ztree.all.js"></script>
    <script type="text/javascript" src="MultipleTreeSelect.js"></script>

    <script>


    </script>
    <script type="text/javascript">

        /*节点列表（这里演示的是非异步方式的实现）*/
        var zNodes = [
            {id: 1, pId: 0, name: "火之国",   open: true},
            {id: 11, pId: 1, name: "木叶忍者", open: true },
            {id: 111, pId: 11, name: "鸣人" },
            {id: 112, pId: 11, name: "佐助"},
            {id: 12, pId: 1, name: "木叶暗部" },
            {id: 121, pId: 12, name: "鼬"},
            {id: 122, pId: 12, name: "卡卡西"},
            {id: 2, pId: 0, name: "沙之国", open: true},
            {id: 21, pId: 2, name: "千代婆婆"},
            {id: 26, pId: 2, name: "我爱罗"} ,
            {id: 22, pId: 2, name: "沙之国忍者", open: true},
            {id: 221, pId: 22, name: "手鞠"},
            {id: 222, pId: 22, name: "勘九郎"},
            {id: 3, pId: 0, name: "水之国"},
            {id: 4, pId: 0, name: "土之国"}
        ]; 
        /*注册下拉树方法也很简单*/
        $(document).ready(function () {
            $("textarea").drawMultipleTree({
            
            zNodes: zNodes
        });
        });
        //-->
    </script>
</head>

<body style= "width: 1080px ;margin: 0 auto" >
<br>
<!--在此元素上进行渲染下拉树-->
<textarea   style="width: 300px" checks="1,11,2,23"  textLabel: "jasontext"  type="text" readonly></textarea>

</body>
</html>

```

**2.异步加载配置实例**
<br>**async example**
```js
 var defaultsw = {
              
             async: {
                 enable: true,
                 url: "http://qqxh.net"
             }
         }
```

**3.配置文件详解**<br>
**setting file detailed explanation**
```js
 var settingAsync = {
             
             async: {
                 enable: true,
                 url: "异步加载url地址"
             },
             chkStyle: "radio",/*radio：单选模式(Radio mode)，checkbox：多选模式(checkbox mode)，默认为多选*/
             radioType : "all",/*all：整个树只能有一个选中，level：在每一级节点范围内当做一个分组*/
             height:433,/*容器高度*/
             callback:{
                 onCheck: function() {}/*选中事件的回调*/
             }
         }
```

**4.api列表**
- 获取选中文本<br>get selected text value
```js
  $("#yourContentId").drawMultipleTree("getChecks","text");
```
- 获取选中code<br>get selected code value
```js
  $("#yourContentId").drawMultipleTree(getChecks,"val");
```
 - 设置默认选中值<br>seting default selected
 <br><br>
 通过给元素设置checks属性来进行设置，格式为:checks="1,2,3,4,5"<br>
 user  words  "cehcks"  to set selected values;
 like:checks="1,2,3,4,5"
  - 设置文本的表单项<br>seting textLabel  
 通过textLabel属性设置文本在的表单项中的name属性；提交时将以该名称把文本提交到后台
 <br>
**MultipleTreeSelect 开发者网站(my website):[http://www.qqxh.net](http://www.qqxh.net)**

