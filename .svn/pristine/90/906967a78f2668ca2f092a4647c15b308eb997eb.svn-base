$(function () {
    /*导航*/
    new Cors(function () {
        $(".nav li").hover(function () {
            $(this).addClass("hover");
            $(this).children(".submenu").show();
        }, function () {
            $(this).removeClass("hover");
            $(this).children(".submenu").hide();
        });
    });
    /*显示或隐藏条件*/
    /*$(".more_condition").bind("click",function(){
		$(this).toggleClass("more_up");
		$(".search_condition").children("dd").toggle();
	})*/
    $(".more_condition").click(function () {
        var $this = $(this);
        if ($this.hasClass('more_up')) {
            $this.removeClass("more_up").text("更多条件");
            $this.parents("dl").children("dd").hide();
        } else {
            $this.addClass("more_up").text("隐藏条件");
            $this.parents("dl").children("dd").show();
        }
    });

    //$(".table_common tbody tr:odd").addClass("odd");
    refreshRowBg();
});

function refreshRowBg() {
    $(".table_common").each(function () {
        $(this).find('tbody tr:odd').addClass("odd");
    });
}


function getQueryStringArgs() {
    //取得查询字符串并去掉开头的问号
    var qs = (location.search.length > 0 ? location.search.substring(1) : ""),
    //保存数据的对象
    args = {},
    //取得每一项
    items = qs.length ? qs.split("&") : [],
    item = null,
    name = null,
    value = null,
    i = 0,
    len = items.length;

    //逐个将每一项添加到args 对象中
    for (i = 0; i < len; i++) {
        item = items[i].split("=");
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);
        if (name.length) {
            args[name] = value;
        }
    }
    return args;
}

function updateRowBgColor() {
    $(".table_common").each(function () {
        var $tr = $(this).find("tbody tr:visible");
        for (var i = 0, len = $tr.length; i < len; i++) {
            if (i % 2 === 1) {
                $tr.eq(i).addClass("odd");
            } else {
                $tr.eq(i).removeClass("odd");
            }
        }
    });
}

/*
 * 选项卡及对应操作，依赖jQuery
 * 
 * 按需要的顺序排列标签及标签页对应的html即可，内部自动处理显示隐藏
 * 
 * 存在哪些重构空间？
 */
function Tab(param) {
    return new Tab.fn.init(param);
}

Tab.fn = Tab.prototype = {
    constructor: Tab,
    init: function (param) {
        this.$tab = param.$tab;//用来作为标签的元素，比如：若某组li为标签，则$tab为包裹这组li的ul，jQuery对象
        this.$tabContent = param.$tabContent;//用来作为标签页的元素，比如：若某组li为标签页，则$tabContent为包裹这组li的ul，jQuery对象
        this.$startTab = $('.' + param.startTabClassName);//起始显示的标签，请传入标签的className
        this._index = this.$tab.children().index(this.$startTab);//内部使用，当前选中的选项卡的index
        
        this.$tab.on('click', this.$tab.children()[0].tagName.toLowerCase(), { $tabContent: this.$tabContent }, function (e) {
            var $currentTab = $(this),
                $tabContent = e.data.$tabContent,
                index = $currentTab.index();
            $currentTab.addClass(param.startTabClassName).siblings().removeClass(param.startTabClassName);
            $tabContent.eq(index).show().siblings().hide();
        });
    }
};