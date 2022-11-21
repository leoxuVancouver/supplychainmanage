/*
 *Plugin Name 	: 整屏平滑滚动
 *Author 		: Eric
 *Email			: 417114612@qq.com	
 *Version		: 1.0
 *Date			: 2014-12-29
 *=============================
 *功能：创建粘性导航菜单
 *参数：scrollBar 		: false,	//屏幕是否需要滚动条
		speed 			: 600,		//滚屏时的速度，单位毫秒
		sectionSelector : '.part'	//第几屏元素的选择器
		time            : 4000      //自动轮播时间
 *若参数为字符串，则调用插件方法；
 *返回值：返回jQuery对象，供链式调用；
 *用法：
 *$('#wrap').faViscousMenu();
 *#wrap为导航的父级元素；
*/
;(function ($){  
	$(".part").height($(window).height());
	
	$.fn.faViscousMenu = function (options){

		//默认设置
		var settings = {
			scrollBar 		: true,	    //屏幕是否需要滚动条
			speed 			: 600,		//滚屏时的速度，单位毫秒
			sectionSelector : '.part',	//第几屏元素的选择器
			time            : 4000      //自动轮播时间
		}

		//合并参数和默认选项
		$.extend(settings,options || {});

		var self = this,							//缓存对象
			screenIndex = 0,						//当前屏幕的索引值
			len = $('.nav_wrap').children("li").length,	//共有几屏的数量
			switchOnoff = false;					//控制滚屏时的开关，防止持续滚屏产生的不良影响
		var methods = {
			init: function (){

				//初始化为导航绑定事件
				self.find('.nav_wrap').on('click','li',function (){
					screenIndex = $(this).index();
					methods.move(screenIndex);
					if(screenIndex == len-1){
						$(".next").fadeOut("slow");
					}
					else {
						$(".next").fadeIn("slow");
					}
				})

				//如果开启了，不需要垂直滚动条，为鼠标滚轮添加自定义事件
				if ( !settings.scrollBar ){
					$('body').css({'overflow-y':'hidden'});
					methods.move(0);
					methods._bind(window,'mousewheel',methods._mouseWheel);           //exclude firefox
					methods._bind(window,'DOMMouseScroll',methods._mouseWheel);       //firefox
					//$(window).on('mousewheel.faViscous',methods._mouseWheel);
					//$(window).on('DOMMouseScroll.faViscous',methods._mouseWheel);
				}
			},
			//自定义事件绑定函数，jQuery对滚轮事件没有对应的事件对象支持
			_bind: function (obj,eventName,fn){
				if ( obj.addEventListener ){
					obj.addEventListener(eventName,fn,false);
				}else {
					obj.attachEvent('on'+eventName,function (){
						fn,call(obj);
					})
				}
			},
			//运动函数处理
			move: function (screenIndex){
				var top = $(settings.sectionSelector).eq(screenIndex).position().top;
				self.find('.nav_wrap .active').removeClass('active');
				self.find('.nav_wrap').children("li").eq(screenIndex).children("a").addClass('active');
				$('body,html').animate({scrollTop:top},settings.speed,"swing",function (){
					switchOnoff = false;
				});				
			},
			//滚轮事件处理
			_mouseWheel: function (ev){
				var ev = ev || window.event;
				ev.preventDefault();		//阻止默认滚动事件

				if (switchOnoff) return;	//开关控制防止持续滚屏
				switchOnoff = true;

				if ( ev.wheelDelta ){
					//根据ev.wheelDelta判断是ie和chrome
					var dir = ev.wheelDelta > 0 ? true : false;
				}else {
					//detail为火狐firefox的滚动事件对象
					var dir = ev.detail < 0 ? true : false;
				}

				//dir为true是为向上滚动，否则向下滚动
				screenIndex = dir ? screenIndex - 1 : screenIndex + 1;
				if (screenIndex<0){
					screenIndex = 0;
				}else if ( screenIndex > len-1 ){
					screenIndex = len-1;
				}
				else if (screenIndex == len-1){
					$(".next").fadeOut("slow");
				}
				else {
					$(".next").fadeIn("slow");
				}
				methods.move(screenIndex);
			}
		}
			
			//点击下一屏
			$(".next").on("click",function(){
				screenIndex += 1;
				methods.move(screenIndex);
				if(screenIndex == len-1){
					$(".next").fadeOut("slow");
				}
				else {
					$(".next").fadeIn("slow");
				}
			})
			
		//返回对象
		return this.each(function (){
			
			if ( methods[options] ){
				return methods[options].apply(this,Array.prototype.slice.call(arguments,1))
			}else if ( (typeof options).toLowerCase() === 'object' || !options ){
				return methods.init.apply(this,arguments);
			}else {
				$.error( 'Method' + options + ' dosen\'t exist on this plugin!')
			}

		})
	}

})(jQuery)
