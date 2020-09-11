/**
 * Created by ricardo on 2017-08-05.
 */
/**
 * 登录相关的js操作
 */
var login = angular.module("login",["httpMessageTypes"])
    .controller("loginSchool",["httpMessageTypes","$scope","$rootScope",function (httpMessageTypes, $scope, $rootScope) {
        /** 获取登录页面的学校列表 **/
        $scope.userName = "";
        $scope.password = "";
        $scope.schoolID = 1;
        $scope.appKey = "aGFuZHlDYW1wdXM=";
        $scope.appSecret = "1234567890abcedefgh";

        // 点击登录，提交登录请求
        $scope.loginBtn = function () {
            /** 请求参数获取 **/
            $scope.msg = {
                userName:$scope.userName,
                password:$scope.password,
                schoolID:$scope.schoolID,
                loginFromMan:1,
                appName:"login_login"
            };
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
                    xhr.setRequestHeader("token", ".");
                },
                success:function (msg) {
                    var token = msg.data.token[0]+"_"+msg.data.token[1];
                    if(msg.msgState == 200){
                        sessionStorage.token = token;
                        $rootScope.$emit("login",msg);
                    }
                }
            });
        };

        $scope.schoolData = [{
            id:0,
            name:"-- 请选择校园 --"
        },{
            id:1,
            name:"郫都区第一中学"
        },{
            id:2,
            name:"北京外国语附属中学"
        },{
            id:3,
            name:"嘉祥外国语学校"
        },{
            id:4,
            name:"清华附属中学"
        },{
            id:5,
            name:"北京大学附属中学"
        },{
            id:6,
            name:"郫都区第二中学"
        }]
    }]);


