//新版正审页面
//借款基本信息
var souyidai = new Object();
$(function() {
    $('#houseInfo').on('change', function() {
        loadBuildInfo.call(this);
    });

    function loadBuildInfo(afterFn) {
        var housename = $(this).find('option:selected').attr('housename');
        var houseProvince = $(this).find('option:selected').attr('province');
        var houseProvinceCode = $(this).find('option:selected').attr('provincecode');
        var houseCity = $(this).find('option:selected').attr('city');
        var houseCityCode = $(this).find('option:selected').attr('citycode');
        $(this).parent().find('input[name=houseName]').val(housename);
        $(this).parent().find('input[name=houseProvince]').val(houseProvince);
        $(this).parent().find('input[name=houseProvinceCode]').val(houseProvinceCode);
        $(this).parent().find('input[name=houseCity]').val(houseCity);
        $(this).parent().find('input[name=houseCityCode]').val(houseCityCode);
        //buildPeriods借款期限
        var index = $(this).find('option:selected').attr('value');
        var othis = this;
        $.ajax({
            url: "/borrow/building/" + $(othis).val(),
            type: "Get",
            dataType: "json",
            success: function(json) {
                $(othis).parents('#borrowInfo').find('select[name=periods]').empty().append($('<option value="-1"/>').text('请选择'));
                if (json.errorCode != 0) return;
                for (var i = 0, len = json.data.periods.length; i < len; i++) {
                    $(othis).parents('#borrowInfo').find('select[name=periods]').append($('<option/>').text(json.data.periods[i] + '个月').attr('value', json.data.periods[i]));
                }
                //还款方式;repayMode
                if (json.data.repayMode == '') {
                    return;
                }
                $(othis).parents('#borrowInfo').find('input[name=repayMode]').empty();
                $(othis).parents('#borrowInfo').find('input[name=repayMode]').val(json.data.repayModeName);
                $(othis).parents('#borrowInfo').find('input[name=repayMode]').next('span').text(json.data.repayModeName);
                afterFn && afterFn();
            }
        })
    }

    loadBuildInfo.call($("#houseInfo"), function() {
        var selectVal = $('select[name=periods]').attr("value");
        $('select[name=periods]').val(selectVal);
    });


    //上传内部

    var $mask = $('.popup-mask'),
        $layer = $('#version-layer'),
        $singleContent = $('#version-layer .certifi-lay-sigle'),
        $multiContent = $('#version-layer .certifi-multi'),
        $uploadImg = $('#uploadImg'),
        $multipleSelect = $multiContent.find('select');

    $(document).on('click', '.cer-add-btn', function(event) {
        hasChildren(this);
        uploader.reset();
        $list.find('p').remove();
        uploadItem = $(this);
        if (uploadItem.parents('#personUpload').length) {
            uploader.option('server', '/user/upload');
        } else {
            uploader.option('server', '/user/gdr_upload');
        }
    });

    //判断是否有二级select...
    function hasChildren(self) {
        var $selectHidden = $(self).next().find('span');

        if ($selectHidden.length) {
            $singleContent.hide();
            $multiContent.show();

            $multipleSelect.empty();
            $multipleSelect.append($('<option/>').text('请选择'));
            $multiContent.find('.certifi-layer-op').html('');
            $uploadImg.attr('src', 'https://static.souyidai.com/www/images/uploadpic/DEFAULT.jpg');

            for (var i = 0, len = $selectHidden.length; i < len; i++) {
                $multipleSelect.append($('<option/>').text($selectHidden.eq(i).html()));
            }

            $('#ctlBtn').attr('disabled', true);
            $('#ctlBtn').removeClass('blue-btn blue-btn-w160');
            $('#ctlBtn').addClass('ver-bg-default ver-bg-color666 ver-bg-default-w160'); //禁用上传文件按钮
        } else {
            $singleContent.show();
            $multiContent.hide();
            //传值
            var $key = $(self).prev().find('strong').text();
            $singleContent.find('.certifi-sigle-title').text($key);

            var $newContent = uploadJson[$key].content;
            var $newImg = 'https://static.souyidai.com/www/images/uploadpic/' + uploadJson[$key].pic + '.jpg';
            souyidai.cerCol = uploadJson[$key].cerCol;
            souyidai.cerName = $key;
            $singleContent.find('.certifi-layer-op').html($newContent);
            $uploadImg.attr('src', $newImg);

            $('#ctlBtn').attr('disabled', false);
            $('#ctlBtn').addClass('blue-btn blue-btn-w160');
            $('#ctlBtn').removeClass('ver-bg-default ver-bg-color666 ver-bg-default-w160'); //开启上传文件按钮
        }
    }

    //弹层下拉菜单
    $multipleSelect.on('change', function() {
        var $selectVal = $(this).find('option:selected').html();
        if ($selectVal == '请选择') {
            $multiContent.find('.certifi-layer-op').html('');
            $uploadImg.attr('src', 'https://static.souyidai.com/www/images/uploadpic/DEFAULT.jpg');
            //$('#ctlBtn').get(0).setAttribute('disabled',true);
            $('#ctlBtn').attr('disabled', true);
            $('#ctlBtn').removeClass('blue-btn blue-btn-w160');
            $('#ctlBtn').addClass('ver-bg-default ver-bg-color666 ver-bg-default-w160'); //禁用上传文件按钮
            return;
        }
        if ($selectVal != '') {
            $('#ctlBtn').attr('disabled', false);
            $('#ctlBtn').addClass('blue-btn blue-btn-w160');
            $('#ctlBtn').removeClass('ver-bg-default ver-bg-color666 ver-bg-default-w160'); //开启上传文件按钮
        }
        var $newContent = uploadJson[$selectVal].content;
        var $newImg = 'https://static.souyidai.com/www/images/uploadpic/' + uploadJson[$selectVal].pic + '.jpg';
        souyidai.cerCol = uploadJson[$selectVal].cerCol;
        souyidai.cerName = $selectVal;
        $multiContent.find('.certifi-layer-op').html($newContent);
        $uploadImg.attr('src', $newImg);
    });

    //文件上传组件初始化

    var $list = $('#thelist'),
        $btn = $('#ctlBtn'),
        state = 'pending',
        uploadItem,
        uploader;

    uploader = WebUploader.create({

        // 不压缩image
        resize: false,

        // swf文件路径
        swf: 'https://static.souyidai.com/www/js/Uploader.swf',

        // 文件接收服务端。
        server: '/user/upload',

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#picker'
    });

    // 当有文件添加进来的时候
    uploader.on('fileQueued', function(file) {
        $list.append('<p class="cer-upload-name" id="' + file.id +
            '"><a href="javascript:void(0)" class="cer-closed-file certifi-img">' +
            '<b style="display: none;">关闭</b></a><i class="certifi-img"></i>' +
            '<strong>' + file.name + '</strong><span class="state">等待上传...</span></p>');
        if ($list.find('p').length > 4) {
            $list.addClass('cer-file-overflow-y');
        } else {
            $list.removeClass('cer-file-overflow-y');
        }
        //文件接收完成，直接上传
        uploader.upload();
    });

    // 上传之前附加参数
    uploader.on('uploadBeforeSend', function(object, data) {
        data.cerCol = souyidai.cerCol;
        data.cerName = souyidai.cerName;
    });

    // 文件上传过程中创建进度条实时显示。
    // uploader.on( 'uploadProgress', function( file, percentage ) {
    //     var $li = $( '#'+file.id ),
    //         $percent = $li.find('.progress .progress-bar');

    //     // 避免重复创建
    //     if ( !$percent.length ) {
    //         $percent = $('<div class="progress progress-striped active">' +
    //           '<div class="progress-bar" role="progressbar" style="width: 0%">' +
    //           '</div>' +
    //         '</div>').appendTo( $li ).find('.progress-bar');
    //     }

    //     $li.find('.state').text('上传中');

    //     $percent.css( 'width', percentage * 100 + '%' );
    // });

    uploader.on('uploadSuccess', function(file) {
        $btn.val('上传完成');
        $('#' + file.id).find('.state').text('已上传');
        uploadItem.prev().addClass('cer-upload-success');
    });

    uploader.on('uploadError', function(file) {
        $btn.val('上传失败');
        $('#' + file.id).find('.state').text('上传出错');
        uploadItem.prev().addClass('cer-upload-failure');
    });

    uploader.on('uploadComplete', function(file) {
        $('#' + file.id).find('.progress').fadeOut();
    });

    uploader.on('all', function(type) {
        if (type === 'startUpload') {
            state = 'uploading';
        } else if (type === 'stopUpload') {
            state = 'paused';
        } else if (type === 'uploadFinished') {
            state = 'done';
        }

        if (state === 'uploading') {
            $btn.val('暂停上传');
        } else {
            $btn.val('确 定');
        }
    });

    $btn.on('click', function() {
        $('.shut-down').trigger('click');
        // if (state === 'uploading') {
        //     uploader.stop();
        // } else {
        //     uploader.upload();
        // }
        // if ($btn.val() === '上传完成') {
        //     $('.shut-down').trigger('click');
        // }
    });
    $('.webuploader-pick').addClass('ver-btn');
    $('#uploader').on('click', '.cer-closed-file', function(event) {
        $(this).parent().remove();
        var fileId = $(this).parent().attr('id');
        uploader.removeFile(fileId);
        if ($list.find('p').length > 4) {
            $list.addClass('cer-file-overflow-y');
        } else {
            $list.removeClass('cer-file-overflow-y');
        }
    });
});