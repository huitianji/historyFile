function SydLocal(){
}

SydLocal.COMMON="local_common";
SydLocal.WWW="local_www";
SydLocal.PAY="local_pay";
SydLocal.PASSPORT="local_passport";
SydLocal.TOOTIP="local_tooltip";

SydLocal.prototype.get=_getLocal;
SydLocal.prototype.getCOMMON=_getCommonLocal;
SydLocal.prototype.getWWW=_getWwwLocal;
SydLocal.prototype.getPAY=_getPayLocal;
SydLocal.prototype.getPASSPORT=_getPassportLocal;
SydLocal.prototype.getToolTip=_getToolTipLocal;
SydLocal.prototype.fmt=_fmtLocal;
SydLocal.prototype.fmtCOMMON=_fmtCommonLocal;
SydLocal.prototype.fmtWWW=_fmtWwwLocal;
SydLocal.prototype.fmtPAY=_fmtPayLocal;
SydLocal.prototype.fmtPASSPORT=_fmtPassportLocal;
SydLocal.prototype.fmtToolTip=_fmtToolTipLocal;

function _getCommonLocal(key){
    return _getLocal(SydLocal.COMMON,key);
}
function _getWwwLocal(key){
    return _getLocal(SydLocal.WWW,key);
}
function _getPayLocal(key){
    return _getLocal(SydLocal.PAY,key);
}
function _getPassportLocal(key){
    return _getLocal(SydLocal.PASSPORT,key);
}
function _getToolTipLocal(key){
    return _getLocal(SydLocal.TOOTIP,key);
}

function _getLocal(type,key){
    try{
        var s = codes[type][key];
        if(s==null || s=='undefined' || s==''){
	    	return key;
	    }
        return s;
    }catch(e){}
    return "";
}

function _fmtCommonLocal(key,args){
    return _fmtLocal(SydLocal.COMMON,key,args);
}

function _fmtWwwLocal(key,args){
    return _fmtLocal(SydLocal.WWW,key,args);
}

function _fmtPayLocal(key,args){
    return _fmtLocal(SydLocal.PAY,key,args);
}
function _fmtPassportLocal(key,args){
    return _fmtLocal(SydLocal.PASSPORT,key,args);
}

function _fmtToolTipLocal(key,args){
    return _fmtLocal(SydLocal.TOOTIP,key,args);
}

function _fmtLocal(type,key,args){
    try{
        var s = codes[type][key];
	    if(s==null || s=='undefined' || s==''){
	    	return key;
	    }
        var numargs = args.length;
        if(numargs === 0 ){
            return s;
        }
        for (var i = 0 ; i < numargs; i++){// 获取参数内容。
            var reg = "{"+i+"}"; //创建正则RegExp对象
            s=s.replace(reg,args[i]);
        }
        return s;

    }catch(e){
    }
    return "";
}

var _ll=new SydLocal();
