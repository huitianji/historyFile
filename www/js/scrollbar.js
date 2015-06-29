
function myAddEvent(obj,sEvent,fn){
    if(obj.addEventListener){
    obj.addEventListener(sEvent,fn,false);
    }else if(obj.attachEvent){
    obj.attachEvent("on"+sEvent,fn);
    }
}
function onMouseWheel(ev,oDiv,oParent,ulMoving,conBox){
    var oEvent = ev  || event;
    // IE  chrom
    //wheelDelta 上 正
    //-----------下 负
    //火狐下  detail  上   负
    //---------------下   正
    //alert(oEvent.wheelDelta);//ie下wheelDelta
//        console.log(oEvent.detail);
    var bDown = true;
    bDown = oEvent.wheelDelta ? oEvent.wheelDelta < 0 : oEvent.detail > 0;
//        console.log(bDown);
    if(bDown){
    //
    setTop(oDiv.offsetTop+10,oDiv,oParent,ulMoving,conBox);
    }else{
    //
    setTop(oDiv.offsetTop-10,oDiv,oParent,ulMoving,conBox);
    }
if(oEvent.preventDefault){
    oEvent.preventDefault();//火狐里面阻止默认行为
    }
return false;
}
//    myAddEvent(document,"mousewheel",onMouseWheel);
//    myAddEvent(document,"DOMMouseScroll",onMouseWheel);
function moveFunction(oDiv,oParent,ulMoving,conBox){
    oDiv.onmousedown = function(ev){
        var oEvent = ev || event;
        var dixY= oEvent.clientY - oDiv.offsetTop;
        document.onmousemove = function(ev){
            var oEvent = ev || event;
            var l = oEvent.clientY - dixY;
            setTop(l,oDiv,oParent,ulMoving,conBox);
        }
document.onmouseup = function(ev){
    document.onmousemove = null;
    document.onmouseup = null;
    }
return false;
}
}
function setTop(l,oDiv,oParent,ulMoving,conBox){
    if(l < 0){
    l = 0;
    }else if(l > oParent.offsetHeight - oDiv.offsetHeight){
    l = oParent.offsetHeight - oDiv.offsetHeight;
    }
oDiv.style.top = l + "px";
//
var scale = l / (oParent.offsetHeight - oDiv.offsetHeight);
//document.title = scale;
ulMoving.style.top = -(ulMoving.offsetHeight - conBox.offsetHeight)*scale + "px";
    //////////////
//    var height = ulMoving.offsetHeight - conBox.offsetHeight;
//    var t = (height/conBox.offsetHeight)*parseInt($(oDiv).css("height"));
//    var h = parseInt($(oDiv).css("height"));
//    $(oDiv).css({"height":(h+t)+"px"});
//    console.log(h+t)
   // console.log($(oDiv).css("height"));
    ////////////
}
///////////////////////////////
//    var oDiv1 = $("#box0 .div1")[0];
//    var oParent1 = $("#box0 .parent")[0];
//    var ulMoving = $("#box0 .ul-moving")[0];
//    var conBox = $("#box0 .content-box")[0];
//    comBox(oDiv1,oParent1,ulMoving,conBox);
//    myAddEvent(oParent1,"mousewheel",function(ev){onMouseWheel(ev,oDiv1,oParent1,ulMoving,conBox);});
//    myAddEvent(oParent1,"DOMMouseScroll",function(ev){onMouseWheel(ev,oDiv1,oParent1,ulMoving,conBox);});
////////////////
//
function heightAuto(){
    var $box = $(".col-xs-list");//col-ul-box
    for(var i= 0,len = $box.length;i<len;i++){
        (function(){
            var oDiv = $box.eq(i).find(".oscroll-bar")[0];
            var oParent = $box.eq(i).find(".oparent-box")[0];
            var ulMoving = $box.eq(i).find(".col-ul-box")[0];
            var contentBox = $box.eq(i).find(".col-detail-box")[0];
            /*
            内容高度大于200隐藏滚动条
            小于200显示滚动条
            */
            var $oparentBar = $box.eq(i).find(".oparent");
            if($(ulMoving).height()<=200){
                $oparentBar.css("display","none");
            }else{
                $oparentBar.css("display","block");
            }
            /*end*/
            var icoTop = $box.eq(i).find('.ico-arrow-top');
            var icoBottom = $box.eq(i).find('.ico-arrow-bottom');
            moveFunction(oDiv,oParent,ulMoving,contentBox);
            myAddEvent(oParent,"mousewheel",function(ev){onMouseWheel(ev,oDiv,oParent,ulMoving,contentBox);});
            myAddEvent(oParent,"DOMMouseScroll",function(ev){onMouseWheel(ev,oDiv,oParent,ulMoving,contentBox);});
            icoTop.click(function(){
                setTop(oDiv.offsetTop - 10,oDiv,oParent,ulMoving,contentBox)
            });
            icoBottom.click(function(){
                setTop(oDiv.offsetTop + 10,oDiv,oParent,ulMoving,contentBox)
            });
            ////////////////

//        var height = ulMoving.offsetHeight - contentBox.offsetHeight;
//        var t = (height/contentBox.offsetHeight)*parseInt($(oDiv).css("height"));
//        var h = parseInt($(oDiv).css("height"));
//        $(oDiv).css({"height":(h+t)+"px"});
//        console.log(h+t);
            ///// x=oDiv,n=oParent,t=ulMoving,h=contentBox;
            ////h/t=x/n
            var h = contentBox.offsetHeight;
            var t = ulMoving.offsetHeight;
            var n = oParent.offsetHeight;
            var x;
            x = (h*n)/t;
            var ox = parseInt(Math.ceil(x));
//        console.log(x);
//        console.log(Math.ceil(x));
            //oDiv.style.height =  + "px";
            //////////////
            if(ox){
                //console.log(ox)
                $box.eq(i).find(".oscroll-bar").css("height",ox+"px");
            }
        })(i)
    }
}
//heightAuto();


