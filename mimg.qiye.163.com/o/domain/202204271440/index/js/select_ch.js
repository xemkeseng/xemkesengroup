//海外线路选择
$(function(){
    var ch = cookie('ch');
    if(cookie('ch')!=null){
        $('#ch').val(ch);
    }else{
        $.ajax({
            type: "GET",
            url: "/view/area.jsp",
            dataType: "json",
            success: function(data){
                $('#ch').val(data.area==1?'hw':'');
            },
            error:function(e){
                $('#ch').val('');
            }
        });
    }
})