/**
 *
 */
var commonFn = {

    addCookie : function(name, value, iDay){
        if(!iDay) return;

        var oDate = new Date();
        oDate.setDate(oDate.getDate() + iDay);
//        document.cookie = name + '=' + value + ';path=/;expires=' + oDate;
        //xpires='+oDate.toGMTString() 解决百度浏览器bug
        document.cookie = name + '=' + value + ';path=/;xpires='+oDate.toGMTString();

    },
    getCookie : function(name){
        var cookies = document.cookie.split('; ');
        for(var i = 0, len = cookies.length; i < len; i++){
            var arr = cookies[i].split('=');
            if(arr[0] == name) return arr[1];
        }
        return '';
    },
    //获取url参数
    getUrlParam : function(param){
        var reg_param = new RegExp("(^|&)" + param + "=([^&]*)(&|$)");
        var arr = window.location.search.substr(1).match(reg_param);
        if (arr && arr.length >= 2) {
            return arr[2];
        }else{
            return '';
        }
    }
};