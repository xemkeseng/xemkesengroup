(function () {

    var resetUrl = 'https://hostname/static/qiyeurs/?from=fromUrl#/resetPwd',
        currentHostName = 'mail.qiye.163.com',
        hl = getParam('hl');

    if (domainType === 'hz') {
        currentHostName = 'mailhz.qiye.163.com';
    }
    
    if(hl=='en_US'){
        resetUrl = 'https://hostname/static/qiyeurs/?hl=en_US&amp;from=fromUrl#/resetPwd';
    }

    $('#resetPwd').click(function () {
        location.href = resetUrl.replace('hostname', currentHostName).replace('fromUrl', encodeURIComponent(location.href));
    });

})();