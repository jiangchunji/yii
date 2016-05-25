<div data-options="region:'north'" style="height: 60px; overflow: hidden;" class="logo1">
    <?php $this->beginContent('//home/north'); ?>
    <?php $this->endContent(); ?>
</div>
<div data-options="region:'west',title:'功能导航'" style="width: 200px; overflow: hidden;">
    <!--    @Html.HtmlTag("ul", new HtmlAttrs() { id = "leftTree", url = Html.WebAction("Left"), className = "treestyle" })-->
    <!--    @* <ul id="leftTree" url="Home/Left" class="easyui-tree">*@-->
    <?php
    $this->widget('ext.yii-easyui.widgets.EuiTree', array('id' => "leftTree", 'url' => Yii::app()->createUrl("home/Left")));
    ?>
</div>
<div id="centerPanel" data-options="region:'center'" style="overflow: hidden;">
    <div id="tabs" class="easyui-tabs" fit="true" border="false">
    </div>
</div>

<div data-options="region:'south'" style="height: 27px; overflow: hidden;">
    <?php $this->beginContent('//home/south'); ?>
    <?php $this->endContent(); ?>
</div>

<div id="mm" class="easyui-menu cs-tab-menu" style="width: 100px;">
    <div id="mm-tabupdate">刷新</div>
    <div class="menu-sep"></div>
    <div id="mm-tabclose">关闭</div>
    <div id="mm-tabcloseother">关闭其他</div>
    <div id="mm-tabcloseall">关闭全部</div>
</div>
<script type="text/javascript">

$(document).ready(function () {
    if ($.cookie('easyuiThemeName') != null) {
        changeTheme($.cookie('easyuiThemeName'));
    }

    //页面加载初始化
    addTab("初始页面", '/yii/index.php?r=sys/Menu/Index');

    var CurrentNode = null, rootHeight = 0, rootNodes = null;

    function CalculateRootHeight(treeTarget) {
        if (rootHeight != 0) {
            return rootHeight;
        }
        if (rootNodes == null)
            rootNodes = $(treeTarget).tree("getRoots");
        jQuery.each(rootNodes, function (index, node) {
            rootHeight = rootHeight + $(node.target).outerHeight();
        });
        return rootHeight;
    };
    $("body").layout({ fit: true });
    $("#leftTree").tree({
        animate: true,
        onSelect: function (node) {
            if (node.state == "closed") {
                $(this).tree("expand", node.target);
            }
            if (node.url != undefined) {
                var opts = $('#centerPanel').panel('options');
                var treeCtrl = $(this);
//                $('.layout-button-right').trigger("click");
                var strArray = new Array();
                strArray.push(node.text);
                var pNode = treeCtrl.tree("getParent", node.target);
                while (pNode != null) {
                    strArray.push(pNode.text);
                    pNode = treeCtrl.tree("getParent", pNode.target);
                }
                debugger;
                addTab(strArray.reverse().join("->"), node.url);
            }
            return false;
        }, onBeforeSelect: function (node) {
            return node.url != undefined && !$("#leftTree")[0].disabled ;
        }, onBeforeCollapse: function (node) {
            return CurrentNode != node.target;
        }, onLoadSuccess: function (node, data) {//			onExpand
            if (node != null && CurrentNode == node.target) {
                var rootsHeight = CalculateRootHeight(this);
                var panelBody = $(document.body).layout("panel", "west").panel("body");
                var rootChildul = $(node.target).parent().find("ul:first");
                rootChildul.css("overflow", "auto");
                rootChildul.outerHeight(panelBody.outerHeight() - rootsHeight);
            }
        }, onBeforeExpand: function (node) {

            if (node.url != undefined) {
                return true;
            }
            if (CurrentNode != node.target) {
                var lastExpandNode = CurrentNode;
                CurrentNode = node.target;
                var childNodes = $(this).tree("getChildren", node.target);
                if (childNodes.length && childNodes.length > 0) {
                    var rootsHeight = CalculateRootHeight(this);
                    var panelBody = $(document.body).layout("panel", "west").panel("body");
                    var rootChildul = $(node.target).parent().find("ul:first");
                    rootChildul.css("overflow", "auto");
                    rootChildul.outerHeight($(panelBody).outerHeight() - rootsHeight);
                }
                if (lastExpandNode != null) {
                    $(this).tree("collapse", lastExpandNode);
                }
                $(this).tree("expand", node.target);
            }
        }, onClick: function (node) {
            if ( node.url == undefined) {
                var opts = $(this).tree("options");
                opts.onBeforeExpand.call(this, node);
            }
        }
    });
    //添加选项卡事件
    tabCloseEven();
});

function addTab(title, url) {
    if ($('#tabs').tabs('exists', title)) {
        $('#tabs').tabs('select', title);//选中并刷新
        var currTab = $('#tabs').tabs('getSelected');
        var url = $(currTab.panel('options').content).attr('src');
        if (url != undefined && currTab.panel('options').title != 'Home') {
            $('#tabs').tabs('update', {
                tab: currTab,
                options: {
                    content: createFrame(url)
                }
            })
        }
    } else {
        var content = createFrame(url);
        $('#tabs').tabs('add', {
            title: title,
            content: content,
            closable: true
        });
    }
    tabClose();
}

function createFrame(url) {
    var s = '<iframe scrolling="auto" frameborder="0"  src="' + url + '" style="width:100%;height:100%;"></iframe>';
    return s;
}

function tabClose() {
    /*双击关闭TAB选项卡*/
    $(".tabs-inner").dblclick(function () {
        var subtitle = $(this).children(".tabs-closable").text();
        $('#tabs').tabs('close', subtitle);
    })
    /*为选项卡绑定右键*/
    $(".tabs-inner").bind('contextmenu', function (e) {
        $('#mm').menu('show', {
            left: e.pageX,
            top: e.pageY
        });

        var subtitle = $(this).children(".tabs-closable").text();

        $('#mm').data("currtab", subtitle);
        $('#tabs').tabs('select', subtitle);
        return false;
    });
}

//绑定右键菜单事件
function tabCloseEven() {
    //刷新
    $('#mm-tabupdate').click(function () {
        var currTab = $('#tabs').tabs('getSelected');
        var url = $(currTab.panel('options').content).attr('src');
        if (url != undefined && currTab.panel('options').title != 'Home') {
            $('#tabs').tabs('update', {
                tab: currTab,
                options: {
                    content: createFrame(url)
                }
            })
        }
    })
    //关闭当前
    $('#mm-tabclose').click(function () {
        var currtab_title = $('#mm').data("currtab");
        $('#tabs').tabs('close', currtab_title);
    })
    //全部关闭
    $('#mm-tabcloseall').click(function () {
        $('.tabs-inner span').each(function (i, n) {
            var t = $(n).text();
            if (t != 'Home') {
                $('#tabs').tabs('close', t);
            }
        });
    });
    //关闭除当前之外的TAB
    $('#mm-tabcloseother').click(function () {
        var prevall = $('.tabs-selected').prevAll();
        var nextall = $('.tabs-selected').nextAll();
        if (prevall.length > 0) {
            prevall.each(function (i, n) {
                var t = $('a:eq(0) span', $(n)).text();
                if (t != 'Home') {
                    $('#tabs').tabs('close', t);
                }
            });
        }
        if (nextall.length > 0) {
            nextall.each(function (i, n) {
                var t = $('a:eq(0) span', $(n)).text();
                if (t != 'Home') {
                    $('#tabs').tabs('close', t);
                }
            });
        }
        return false;
    });
    //关闭当前右侧的TAB
    $('#mm-tabcloseright').click(function () {
        var nextall = $('.tabs-selected').nextAll();
        if (nextall.length == 0) {
            //msgShow('系统提示','后边没有啦~~','error');
            alert('后边没有啦~~');
            return false;
        }
        nextall.each(function (i, n) {
            var t = $('a:eq(0) span', $(n)).text();
            $('#tabs').tabs('close', t);
        });
        return false;
    });
    //关闭当前左侧的TAB
    $('#mm-tabcloseleft').click(function () {
        var prevall = $('.tabs-selected').prevAll();
        if (prevall.length == 0) {
            alert('到头了，前边没有啦~~');
            return false;
        }
        prevall.each(function (i, n) {
            var t = $('a:eq(0) span', $(n)).text();
            $('#tabs').tabs('close', t);
        });
        return false;
    });

    //退出
    $("#mm-exit").click(function () {
        $('#mm').menu('hide');
    })
}
</script>
