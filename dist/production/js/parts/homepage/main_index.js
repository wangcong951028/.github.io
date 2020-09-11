/**
 * Created by ricardo on 2017-08-07.
 */
/**
 * Created by cxf on 2017/8/6 0006.
 */
var myapp = angular.module("myapp",["ui.router","login","httpMessageTypes"]);

    /**控制器**/
    myapp.controller("homepage",["$scope","httpMessageTypes","$rootScope",function ($scope, httpMessageTypes, $rootScope) {
        $scope.title = "中小学智慧云平台管理系统";
        $scope.icon = "glyphicon glyphicon-music";
        $scope.userPhoto = "img/u=2170413434,4269266633&fm=26&gp=0.jpg";
        $scope.userName = "不摘桃花换酒钱";
        $scope.selectList = "";
        $scope.include = "";
        $scope.login = "./parts/user/login.html";
        $scope.loginShow = false;
        $scope.listData = [];
        $scope.schoolInfo = null;

        $scope.installList = function (msg) {
            /** 获取学校信息**/
            $scope.schoolInfo = msg.data.schoolInfo;
            /** 获取权限菜单 **/
            var appInfoList = msg.data.appInfoList;
            $scope.listData = [];
            angular.forEach(appInfoList,function (parent) {
                var subset = [];
                /**循环子菜单**/
                angular.forEach(parent.privilegeList,function (child) {
                    console.log("==="+child.icon);
                    subset.push({
                        name:child.appName,
                        icon:child.icon,
                        src:child.visiturl
                    })
                });
                $scope.listData.push({
                    name:parent.appName,
                    open:false,
                    subset:subset
                })
            });
            $scope.$apply(function () {
                $scope.listData;
            })
        };

        $scope.listClick = function (data) {
            data.open = !data.open;
        };

        $scope.lastClick = function (data) {
            $scope.include = data.src;
        };

        /** 监听login事件 **/
        $rootScope.$on("login",function (event, data) {
            $scope.$apply(function () {
                $scope.loginShow = false;
            });
            $scope.installList(data);
        });

        /** 跳过登录 **/
        if(sessionStorage.token){

            $scope.msg = {
                loginFromMan:1,
                appName:"login_skipLogin"
            };
            $scope.appKey = "aGFuZHlDYW1wdXM=";
            $scope.appSecret = "1234567890abcedefgh";
            $scope.param = JSON.stringify($scope.msg);
            $scope.time = new Date().getTime();
            var temp = 'appKey=' + $scope.appKey + '&appSecret=' + $scope.appSecret + '&param=' + $scope.param + '&time=' + $scope.time;
            $scope.sign = hex_md5(temp);

            var param = {
                appKey:$scope.appKey,
                appSecret:$scope.appSecret,
                param:$scope.param,
                sign:$scope.sign,
                time:$scope.time
            };
            param = JSON.stringify(param);
            $.ajax({
                type:"post",
                url:httpMessageTypes.LOGIN,
                data:param,
                dataType:"json",
                contentType:'application/json;charset=UTF-8',
                beforeSend : function (xhr) {
                    xhr.setRequestHeader("token", sessionStorage.token);
                },
                success:function (msg) {
                    if(msg.msgState == 200){
                        sessionStorage.token = msg.data.token[0]+"_"+msg.data.token[1];
                        $scope.loginShow = false;
                        $scope.installList(msg);
                    }else {
                        $scope.loginShow = true;
                    }
                }
            });
        }else {
            $scope.loginShow = true;
        }
    }]);

/**配置**/
myapp.config(function ($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.when("","/user");

    $stateProvider.state("user",{
        url : "/user",
        templateUrl : "login.html"
    })
});