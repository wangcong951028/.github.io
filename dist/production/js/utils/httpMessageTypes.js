/**
 * Created by Administrator on 2017/8/10 0010.
 */
angular
    .module('httpMessageTypes', [])
    .constant('httpMessageTypes', {
          LOGIN: "http://192.168.2.22:8081/oauth/auth/oauth.do",
          SYSTEMNAME_SUFFIX: "&智慧云平台管理系统"
    });