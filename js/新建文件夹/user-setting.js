/* .main.height()  Public*/
$(function(){
	//alert($(window).height()-362)
	$(".main").css("min-height",$(window).height()-362);		
})
/* modify success(public)*/
function modify_success(){
	$('.modify-div').css("display","none");
	$('#modify_success').css("display","block");
}
/* softKeyBoard*/
//safety-level
function addBlur(){
	$(".safety-level ul li").html("");
	if($("#new_pwd").val().length >= 6){
		$("#low").css("background","red");
		$("#low").html("低");
		if($("#new_pwd").val().length >= 8){
			$("#low,#auto").css("background","#c60");
			$("#auto").html("中");
			if($("#new_pwd").val().length >= 10){
				$("#low,#auto,#high").css("background","#0f3");
				$("#high").html("高");
			}else{
				$("#high").css("background","#ebebeb");	
			}
		}else{
			$("#auto").css("background","#ebebeb");	
		}
	}else{
		$(".safety-level ul li").css("background","#ebebeb");
		$(".safety-level ul li").html("");	
	}
}
//get vaule by softKeyboard
$(function(){
	$('.btn_letter').each(function(index) {
        $(this).click(function(){
			var name = '';
			name = $(this).parents('div')[0].className;
			value = $(this).val().replace(/\s/ig,'');
			val = val+value;
			$('#'+name).val(val);
			addBlur();
		})
    });	
	$('#bs').bind("click",function(){
		$('#bs_style').toggleClass("b_s");
	});
})
function setpassvalue(){
	var name = $('#softkeyboard')[0].className;
	var s = $('#'+name).val();
	s = s.substring(0,s.length-1)
	$('#'+name).val(s);
	val = s;
}
//softKeyboard show
function show_soft_keyboard(obj){
	$('#softkeyboard').css("display","block");
	$('#softkeyboard').removeClass();
	val = '';
	if(obj == key1){
		$('#softkeyboard').addClass('old_pwd');
		$('#softkeyboard').css("top","312px");
		$('#softkeyboard').css("left","310px");
	}
	if(obj == key2){
		$('#softkeyboard').addClass('new_pwd');
		$('#softkeyboard').css("top","346px");
		$('#softkeyboard').css("left","310px");
	}
	if(obj == key3){
		$('#softkeyboard').addClass('new_pwd1');
		$('#softkeyboard').css("top","422px");
		$('#softkeyboard').css("left","310px");
	}
}
//softKeyboard hidden
function OverInput(){
	$('#softkeyboard').css("display","none");
}
//modify password action
function modify_pwd_action(index){	
	$('#old_pwd_err').hide();
	$('#new_pwd_err').hide();
	$('#new_pwd1_err').hide();
	if($.trim($("#old_pwd").val())==""){
		$('#old_pwd_err').html('请输入原密码').show();	
		return false;
	}else{
		$('#old_pwd_err').hide();	
	}
	
	if($("#old_pwd").val().length < 6){
		$('#old_pwd_err').html('请输入合法密码').show();
		$("#old_pwd").val('');
		return false;
	}else{
		$('#old_pwd_err').hide();	
	}
	
	if($.trim($("#new_pwd").val())=="" ){
		$('#new_pwd1_err').html('请输入新密码').show();
		return false;
	}else{
		$('#new_pwd1_err').hide();
	}
	
	if($("#new_pwd").val().length < 6 ){
		$('#new_pwd1_err').html('请输入合法密码').show();
		return false;
	}else{
		$('#new_pwd1_err').hide();
	}
	
	if($.trim($("#new_pwd1").val())=="" ){
		$('#new_pwd1_err').html('请再次输入新密码').show();
		return false;
	}else{
		$('#new_pwd1_err').hide();
	}
	
	if($("#new_pwd1").val().length < 6 ){
		$('#new_pwd1_err').html('请输入合法密码').show();
		return false;
	}else{
		$('#new_pwd1_err').hide();
	}
	
	if($("#new_pwd").val() != $("#new_pwd1").val()){
		$('#new_pwd1_err').html('新密码与确认密码不一致').show();
		return false;
	}else{
		$('#new_pwd1_err').hide();
	}
	if(index == 1){
		company_info();
	}else{	
		modify_success();
	}
}
/* pop success*/
function company_info(){
	$('.mask').css({ display: "block", height: $(document).height()});
	$("#pop2").show();	
}
/* pop dialog*/
$(function(){
	$("#company_sure,.close").bind("click", function () {
		$('.mask').hide();
		$("#pop2").hide();
	});	
})
