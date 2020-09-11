//
//tokem
var static_token=sessionStorage.token;


$(function () {
    tokenVerify();
})
/**验证token*/
function tokenVerify() {
    if(static_token == null){
        top.location.href = "../../parts/login/login.html";

    }
}