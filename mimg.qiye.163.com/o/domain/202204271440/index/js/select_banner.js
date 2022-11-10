(function () {

    var styledBanners = ['//mimg.qiye.163.com/o/mailapp/qiyelogin/style/img/user_yixin_right_20180827.jpg',
                        '../mimg.qiye.163.com/o/mailapp/qiyelogin/style/img/user_yixin_left_20180827.jpg',
                        '../mimg.qiye.163.com/o/mailapp/qiyelogin/style/img/user_yixin_center_20180827.jpg',
                        '//mimg.qiye.163.com/o/mailapp/qiyelogin/style/img/user_yixin_right_20180827.jpg'];

    var lxStyledBanners = ['//mimg.qiye.163.com/p/official_site/admin/imageRight.png',
                         '../mimg.qiye.163.com/p/official_site/admin/imageLeft.png',
                         '../mimg.qiye.163.com/p/official_site/admin/imageCenter.png',
                         '//mimg.qiye.163.com/p/official_site/admin/imageRight.png'],

        computedBanner;

    // 如果用户使用默认背景，则根据样式选择默认背景
    // 否则根据文件名称判断用户的自定义背景图片是改版之前上传还是改版之后上传
    // 改版之前上传的图片需要做兼容处理（不显示登录框背景、设置登录框背景色

    var $loginModWrapper = $('#login-mod-wrapper');
    var $loginQrMod = $('#login-mod-qr');
    var $loginQr1 = $('#login-qr-1');
    var $loginQr2 = $('#login-qr-2');

    if (isDefaultBg) {
        computedBanner = isHmail ? lxStyledBanners[currentStyle] : styledBanners[currentStyle];
    } else {
        computedBanner = currentBanner;
        var timeStr = computedBanner.match(/\/([\d]+)\.[^\/]+$/) && computedBanner.match(/\/([\d]+)\.[^\/]+$/)[1] || undefined,
            uploadTime = timeStr && new Number(timeStr) || undefined,
            judgeTime = 1353600000000;//2012-11-23 00:00:00
        if (!uploadTime || uploadTime < judgeTime) {
            $loginModWrapper.css('background-image', 'none');
            $loginModWrapper.css('background-color', '#fff');
        }
    }

    // 设置背景banner图片
    var $mainPart = $('#main-part').css('background-image', 'url(' + computedBanner.replace('index.html','index.html') + ')');
    if (isDefaultBg) {
        // 默认背景时加上点击跳转
        $mainPart.css('cursor', 'pointer').click(function () {
            if (isHmail) {
                window.open("https://hubble.netease.com/sl/aaagOJ");
                window.DATracker && DATracker.track('click_login_pic_download');
            } else {
                window.open("https://qiye.yixin.im/");
            }
        });
    }

    // 根据style设置登录框的样式
    $('#login-mod-wrapper, #login-mod-qr')
        .addClass('login-mod-wrapper-' + currentStyle)
        .css('cursor', 'default')
        .click(function (event) {
            event.stopPropagation();
        });
    
    $('#login-mod-wrapper').show();

    $('#official_app').click(function() {
        window.open('https://hubble.netease.com/sl/aaagOQ');
        window.DATracker && DATracker.track('click_login_topbar_mailapplication');
    });

    $('#official_app').on('mouseenter', function() {
        window.DATracker && DATracker.track('scan_login_topbar_mailappliction');
    });
    
    $('#donwload_block').on('click', function() {
        window.DATracker && DATracker.track('click_login_account_download');
        window.open('https://hubble.netease.com/sl/aaagOK');
    });

    function QrLogin() {

    }

    $.extend(QrLogin.prototype, {
        //刷新二维码
        refreshQrCode: (function () {
            var appCodeImg = $("#appCode");
            return function () {
                var imgUrl = 'https://mail.qiye.163.com/commonweb/qrcode/getqrcode.do?p=qiyemail&w=130&h=130&r=' + new Date().getTime();
                // var imgUrl = '/commonweb/qrcode/getqrcode.jpg?w=130&h=130&r=' + new Date().getTime() ;//测试用
                appCodeImg.prop('src', imgUrl);
            }
        })(),
        //开始二维码扫描轮询
        startScan: function () {
            var that = this;
            /*重置扫码状态  开始*/
            that.stopScan();
            that.refreshQrCode();
            var appLoginWait = $('#appLoginWait');
            var appLoginScan = $('#appLoginScan');
            appLoginWait.show();
            appLoginScan.hide();
            /*重置扫码状态  结束*/
            that.scanTimer = setInterval(function () {
                $.ajax({
                    url: 'https://mail.qiye.163.com/commonweb/qrcode/checkstatus.do?p=qiyemail',
                    // url:'/commonweb/qrcode/checkstatus.do',//测试用
                    type: 'get',
                    dataType: 'jsonp',
                    success: function (response) {
                        if (response && response.code === 200) {
                            var data = response.result;
                            if (data.status == 0) {
                                //未扫码
                            }
                            else if (data.status == 1) {
                                //扫码成功
                                appLoginWait.hide();
                                appLoginScan.show();
                            }
                            else if (data.status == 2) {
                                //登录成功
                                window.location.href = data.loginurl;
                            }
                            else if (data.status == 3) {
                                //不存在或已过期
                                that.showCodeRefresh();
                            }
                        }
                    },
                    error: function () {
                        console.log('connection fail...');
                    }
                });
            }, 1000);
        },
        //停止二维码扫描轮询
        stopScan: function () {
            var that = this;
            clearInterval(that.scanTimer);
        },
        //显示二维码失效遮罩
        showCodeRefresh: function () {
            var that = this;
            that.stopScan();
            $('#appCodeRefresh').show();
            $('#appCodeWrap').removeClass('allowmove');
        },
        //隐藏二维码失效遮罩
        hideCodeRefresh: function () {
            var that = this;
            $('#appCodeRefresh').hide();
            $('#appCodeWrap').addClass('allowmove');
            that.startScan();
        },
        initQrcode: function () {
            var that = this;
            that.scanTimer = null;
            var $codebox = $('.js-codebox')
            $codebox.on('click', function (e) {
                e.stopPropagation()
            })
            $loginQr1.on('click', function () {
                $codebox.show().animate({
                    left: '0',
                    top: '0',
                    opacity: '1'
                }, 200);
                that.startScan();
                // setTimeout(function () {
                //     $loginModWrapper.hide()
                // }, 200);
            });
            $('.js-closeentry').on('click', function (event) {
                $codebox.animate({
                    left: '413px',
                    top: '355px',
                    opacity: '0'
                }, 200);
                that.stopScan();
                // $loginModWrapper.show()
            });

            $('#appLoginRestart').on('click', function () {
                that.startScan();
            });
            $('#appCodeRefresh').on('click', function () {
                that.hideCodeRefresh();
            })

        },
        scanCodeHandler: function () {
            var that = this;
            var appCodeWrap = $('#appCodeWrap');
            var howToUseApp = $('#howToUseApp');
            var appCodeBox = $('#appCodeBox');
            howToUseApp.on('mouseover', function () {
                appCodeWrap.addClass('hover');
            });
            howToUseApp.on('mouseout', function () {
                appCodeWrap.removeClass('hover');
            });
            appCodeBox.on('mouseover', function () {
                appCodeWrap.addClass('hover');
            });
            appCodeBox.on('mouseout', function () {
                appCodeWrap.removeClass('hover');
            });
            // 显隐二维码交互
            that.initQrcode();
        }
    })

    var qrLogin = new QrLogin()
    qrLogin.scanCodeHandler()



    // 点击二维码碎片的动作
    $loginQr1.hover(function () {
        $loginQr1.addClass('login-qr-1-hover');
    }, function () {
        $loginQr1.removeClass('login-qr-1-hover');
    })/*.click(function () {
        // $loginQrMod.show('fast');
        // $loginModWrapper.hide();
        // TODO
        qrLogin.startScan()
    });*/

    // $loginQr2.click(function () {
    //     // $loginQrMod.hide('fast');
    //     // $loginModWrapper.show();
    // });

    // 设置错误消息
    if ($.trim(errMsg).length > 0) {
        setMsgpid(errMsg);
    }


})();
