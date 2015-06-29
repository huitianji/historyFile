$(function(){
    var copyCon = $(".copy-test-area").val();
    var flashvars = {
        content: encodeURIComponent(copyCon),
        uri: 'images/flash_copy_btn.png'
    };
    var params = {
        wmode: "transparent",
        allowScriptAccess: "always"
    };
    swfobject.embedSWF("flash/clipboard.swf", "forLoadSwf", "115", "35", "9.0.0", null, flashvars, params);
});