/*
=========================================================================
			Cors 跨域传输插件				作者：黄健生
=========================================================================
使用方法：
在父页面的所有元素之后，</body>之前引入cors.js:
<script src="cors.js" debug></script>
debug属性：打开调试模式，出错时在浏览器控制台显示提示信息。默认：关闭。

在父页面中，要插入元素的位置加入：
<include dat-source="toBeIncluded.html"></include>
	dat-source属性(必选)：被包含页面的url。
	dat-cbFn属性(可选)：模块嵌入完成后的回调函数。
	userdata属性(可选)：要传递到子页面的JSON格式数据。
	data-listener属性(可选)：处理从子页面传回的数据的回调函数

在子页面中，所有元素之后引入cors.js:
<script src="cors.js" dat-include="selector"></script>
	dat-include属性(必选)：将被引入的元素的CSS选择器。
	userdata属性(可选)：要传递到父页面的JSON格式数据。
	data-listener属性(可选)：处理从父页面传回的数据的回调函数
--------------------------------------------------------------------------

本插件支持javascript方式调用，以下代码与上述html方式调用效果一致。

在主页面中使用：
var cors=new Cors().includeElements({
		insertTo:'selector',
		srcTarget:'subpage.html',
		cbFn:function(){},
		user_data:{},
		data_listener:function(data){}
	});
insertTo:(必选)			要插入元素的容器的选择器。
						(可以使用任何CSS选择器，跟jQuery的功能一致。下同)
srcTarget:(必选)		将要引入的页面url。
cbFn:(可选)				模块嵌入到父页面后执行的回调函数。
user_data:(可选)  		要传递到子页面的JSON格式数据。
data_listener:(可选)	处理从子页面传回的数据的回调函数

在子页面中调用：
var cors=new Cors().insertToParent({
		selectors:'selector',
		user_data:{},
		data_listener:function(data){}
	});
selectors:(必选)  		被引入的元素的CSS选择器。
user_data:(可选)  		要传递到父页面的JSON格式数据。
data_listener:(可选)	处理从父页面传回的数据的回调函数。

注意事项：
若使用属性方式指定回调函数，用户自定义的回调函数必须写在
<script src="cors.js"></script>之前。

若在IE8中使用，为避免ie8进入了Quirks模式或Compatibility模式
请确保主页面以<!DOCTYPE html>开头
或在<head>中包含<meta http-equiv="X-UA-Compatible" content="IE=edge">

兼容性：
本插件在IE8+，chrome(latest), firefox(latest), 
android webview, ios webview环境中测试通过
支持file://和http://协议
*/
var Cors = (function () {
    function Cors() { }
    var cbFunction = [];//在嵌入页面加载完毕后立即执行的回调函数
    var s_dataListener = [];//接收到数据后的回调函数

    Cors.prototype.includeElements = function (args) {
        //arguments: insertTo, srcTarget, cbFn, user_data, data_listener

        var iframe = document.createElement('iframe');
        iframe.src = args.srcTarget;
        iframe.id = args.insertTo;//iframe以insertTo选择器命名
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        if (args.cbFn) cbFunction[args.insertTo] = args.cbFn;
        s_dataListener[args.insertTo] = args.data_listener;

        bindEvent(window, 'load', function () {
            //传递insertTo到iframe，让iframe构造一个对象:data={'insertTo','element','s_data'}
            var o = JSON.stringify({ insertTo: args.insertTo, userdata: args.user_data });
            iframe.contentWindow.postMessage(o, '*');
        });

        bindEvent(window, 'message', function (e) {
            //message事件可能由任何窗口发送的事件所触发，
            //仅当e.source是iframes(window对象)时，才执行以下处理
            if (e.source) {
                //根据e.data确定要插入到哪个元素中
                var p = JSON.parse(e.data);
                var element = document.querySelector(p.insertTo);
                if (element === null) return;

                var tmpPN = document.createElement('div');
                var tmpChild = document.createElement('div');
                var parent = element.parentNode;
                tmpPN.appendChild(tmpChild);
                tmpChild.outerHTML = p.element;
                parent.insertBefore(tmpPN.childNodes[0], element);
                parent.removeChild(element);

                //p.s_data:接收的数据
                if (p.s_data && s_dataListener[p.insertTo]) {
                    s_dataListener[p.insertTo](p.s_data);
                }

                var curFrame = document.getElementById(p.insertTo);
                if (curFrame) {
                    //document.body.removeChild(curFrame);
                    if (cbFunction[p.insertTo]) cbFunction[p.insertTo]();
                }
            }//end of e.source
        });//end of onmessage handler
    }//end of includeElements function
    Cors.prototype.insertToParent = function (args) {
        //arguments: selectors, user_data, data_listener

        bindEvent(window, 'message', function (e) {
            var o, s
            //o.userdata:接收的数据
            //o.s_data:待发送的数据
            o = JSON.parse(e.data);
            if (o.userdata && args.data_listener) {
                args.data_listener(o.userdata);
            }
            var sMenu = document.querySelector(args.selectors);
            //构造data={'insertTo','element','s_data'}后，发送给主页面
            if (sMenu) {
                o.element = sMenu.outerHTML;
                o.s_data = args.user_data;
                s = JSON.stringify(o);
                window.parent.postMessage(s, '*');
            }
        });
    }//end of insertToParent function

    function bindEvent(eventObj, event, eventHandler) {
        if (eventObj.addEventListener) {
            eventObj.addEventListener(event, eventHandler, false);
        } else if (eventObj.attachEvent) {
            event = 'on' + event;
            eventObj.attachEvent(event, eventHandler);
        }//end if
    }//end function

    return Cors;
}());//end of Cors

(function () {
    var script, debug_out, dat_include, includeAnchors, dat_source, dat_cbFn,
		m_userdata, s_userdata, m_dataListener, s_dataListener;
    var _ref = document.getElementsByTagName("script");
    for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        script = _ref[_j];
        if (/cors/.test(script.src)) {
            debug_out = script.attributes['debug'] || false;
            dat_include = script.attributes['dat-include'] === undefined ? false :
							script.attributes['dat-include'].value;
            s_userdata = script.attributes['userdata'] === undefined ? null :
							script.attributes['userdata'].value;
            s_dataListener = script.attributes['data-listener'] === undefined ||
							script.attributes['data-listener'].value == '' ? null :
							script.attributes['data-listener'].value;

            if (dat_include) new Cors().insertToParent({
                selectors: dat_include,
                user_data: s_userdata,
                data_listener: eval('(' + s_dataListener + ')')
            });
        }
    }//end for

    includeAnchors = document.getElementsByTagName('include');
    if (!includeAnchors) return;

    for (var i = 0; i < includeAnchors.length; i++) {
        dat_source = includeAnchors[i].attributes['dat-source'] === undefined ? false :
					includeAnchors[i].attributes['dat-source'].value;
        dat_cbFn = includeAnchors[i].attributes['dat-cbFn'] === undefined ||
					includeAnchors[i].attributes['dat-cbFn'].value == '' ? false :
					includeAnchors[i].attributes['dat-cbFn'].value;
        m_userdata = includeAnchors[i].attributes['userdata'] === undefined ? null :
					includeAnchors[i].attributes['userdata'].value;

        m_dataListener = includeAnchors[i].attributes['data-listener'] === undefined ||
						includeAnchors[i].attributes['data-listener'].value == '' ? null :
						includeAnchors[i].attributes['data-listener'].value;

        includeAnchors[i].id = 'inc' + i;
        if (!dat_source && debug_out) console.log('未设置[dat_source]数据来源');
        if (dat_source) {
            new Cors().includeElements({
                insertTo: '#' + includeAnchors[i].id,
                srcTarget: dat_source,
                cbFn: eval('(' + dat_cbFn + ')'),
                user_data: m_userdata,
                data_listener: eval('(' + m_dataListener + ')')
            });
        }
    }//end for
}());//end of closure function