
var showClickTip = true;
var addSpace = true;
var csLine = false;
var addTitle = false;
var chartext = '';
var strChar = '';
var strTitle = '';
var clip = null;
var $msg = null;
var isShowing = false;
var msgTimer = null;
var locationPath = filterPath(location.pathname);
var scrollElem = scrollableElement('html', 'body');
var currentTab = '#tab-1';
$(function(){
	document.title = "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -";
	// if ("undefined" != typeof(isIE) && true == isIE) {
	// 	$('#ie-only').show();
	// }
	var top = -1 * $('#spchar').height();
	setCharCasePos();
	placeHolder();
	clip = new ZeroClipboard.Client();
	clip.glue( 'copyChar' );
	clip.addEventListener( 'mouseDown', function() { 
        clip.setText(chartext);
    });
    clip.addEventListener( 'onComplete', function() { 
        showMsg ($('#copyChar'),'succuss','已成功复制到剪贴板~');
    });

    
});

$(window).resize(function(){
	setCharCasePos();
	clip.reposition();
});
$('input[type="text"]').keypress(function(event){
	if ($(this).val() == $(this).attr('placeholder')) {
		$(this).val('').css('color','#555');
	}
	if (event.keyCode == 13) {
		setTitle();
	}
});
$('#showPos').click(function(){
	alert($('#setting').offset().top  + 'selft' + $(this).offset().left );
});
$('a[href*=#]').click(function() {
	  var thisPath = filterPath(this.pathname) || locationPath;
	  if (  locationPath == thisPath
	  && (location.hostname == this.hostname || !this.hostname)
	  && this.hash.replace(/#/,'') ) {
	    var $target = $(this.hash), target = this.hash;
	    if (target) {
	       	var exOffset = 0;
	       	if ($(window).height() > $target.innerHeight()) { 
	          exOffset = ($(window).height() - $target.innerHeight()) / 2;
	        }
	      	var targetOffset = $target.offset().top + exOffset;
	      	var oldHash = location.hash;
	      	if (!location.hash) {
	      		oldHash = '#app';
	      	}
	      	$('#nav li a[href=' + oldHash +']').removeClass('active');
	        event.preventDefault();
	        $(scrollElem).animate({scrollTop: targetOffset}, 400, function() {
	          location.hash = target;
	          $('#nav li a[href=' + target +']').addClass('active');
	        });
	    }
	  }
});

$('#inputbox button').click(function(){
	setTitle();
});

$('button').mouseover(function(){
	$(this).addClass('hover');
});

$('button').mouseout(function(){
	$(this).removeClass('hover');
});

$('#addspace').click(function(){
	if (csLine) return;
	if ($(this).children().is(':checked')) {
		addSpace = true;
	}else{
		addSpace = false;
	}
});

$('#csline').click(function(){
	if ($(this).children().is(':checked')) {
		csLine = true;
		$('#setting label[id != csline]').children().attr('disabled',true);
		$('#setting label[id != csline]').css({'color':'#ddd','cursor':'default'});
		$('#inputbox input[id != cstitle]').hide();
		$('#cstitle').show();
		$('#cstitle')[0].focus();
	}else{
		csLine = false;
		$('#setting label[id != csline]').children().attr('disabled',false);
		$('#setting label[id != csline]').css({'color':'#555','cursor':'pointer'});
		$('#cstitle').hide();
		$('#bmchar').show();
		if (addTitle) {
			$('#bmtitle').show();
		}
	}
});

$('#addtitle').click(function(){
	if (csLine) return;
	if ($(this).children().is(':checked')) {
		addTitle = true;
		$('#bmtitle').fadeIn();
	}else{
		addTitle = false;
		$('#bmtitle').fadeOut();
	}
});

$('#spchar table tr td').click(function(){
	if (showClickTip) {
		showClickTip = false;
		$('#tipOfChar').remove();
	};
	SelectText($(this)[0]);
	chartext = $(this)[0].innerText;
	$('#bmchar').val(chartext).css('color','#555');
	$('#charCase').html(chartext);
	$('#copyChar').html('复制"'+ chartext + '"到剪贴板');
	$('#bigSpChar').css('visibility','visible');
	setCharCasePos();
	clip.reposition();
});


$('#myTab label').click(function(){

	var str = $(this).attr('tab-link');
	if (str == currentTab) {
		return false;
	}
	$('#myTab label[tab-link=' + currentTab + ']' ).removeClass('active');
	$(currentTab).hide();
	currentTab = str;
	$(currentTab).fadeIn();
	$(this).addClass('active');
});

function scrollableElement(els) {
  for (var i = 0, argLength = arguments.length; i <argLength; i++) {
    var el = arguments[i],
        $scrollElement = $(el);
    if ($scrollElement.scrollTop()> 0) {
      return el;
    } else {
      $scrollElement.scrollTop(1);
      var isScrollable = $scrollElement.scrollTop()> 0;
      $scrollElement.scrollTop(0);
      if (isScrollable) {
        return el;
      }
    }
  }
  return [];
}

function filterPath(string) {
return string
  .replace(/^\//,'')
  .replace(/(index|default).[a-zA-Z]{3,4}$/,'')
  .replace(/\/$/,'');
}

function setTitle () {
	var ss = '';
	if(!checkInput()){
		return;
	}
	if (csLine) {
		ss = $('#cstitle').val();
		ss = ss.replace(/(^\s*)|(\s*$)/g,"");
	}else{
		ss = generateStr(strChar,strTitle);
	}
	document.title = ss;
	$('#ans').html(ss);
	showMsg($('#inputbox button'),'succuss','设置分割线成功！您可以将本页保存为书签啦！');
}

function placeHolder () {
	$('input[placeholder]').each(function(){
		var $input = $(this);
		$input.val($input.attr('placeholder')).css('color','#aaa');
		$input.bind('click focus',function(){
			if ($input.val() == $input.attr('placeholder')) {
				$input.val('').css('color','#555');
			}
		});
		$input.bind('blur',function(){
			if ($input.val() == '') {
				$input.val($input.attr('placeholder')).css('color','#aaa');
			}
		});
	});
}

function setCharCasePos (str) {
	str = arguments[0] ? arguments[0] : '#bigSpChar';
	var top = $('#spchar').offset().top;
    var left = $('#app-content').offset().left + $('#app-content').outerWidth() - $(str).outerWidth()-4;
	$(str).css({'left':left,'top':top});
}

function checkInput () {
	if (csLine) {
		var str = $('#cstitle').val();
		str = str.replace(/(^\s*)|(\s*$)/g,"");
		if (0 == str.length || str == $('#cstitle').attr('placeholder')) {
			showMsg($('#cstitle'),'danger','请先输入您自定义的分隔线哦！');
			$('#cstitle').val('');
			$('#cstitle')[0].focus();
			return false;
		}
	} else{
		var str = $('#bmchar').val();
		str = str.replace(/(^\s*)|(\s*$)/g,"");
		if (0 == str.length || str == $('#bmchar').attr('placeholder')) {
			showMsg($('#bmchar'),'danger','请先输入字符哦！');
			$('#bmchar').val('');
			$('#bmchar')[0].focus();
			return false;
		}
		strTitle = $('#bmtitle').val();
		if (addTitle && $('#bmtitle').val() == $('#bmtitle').attr('placeholder')) {
			//var msg = new showMsg($('#bmtitle'),'danger','您没有输入标题哦，不过同样给您生成了分割线！');
			strTitle = '';
		}
		strChar = str;
	}
	return true;
}

function generateStr (str,btitle) {
	var title = str;
	var step = str.length;
	if (addSpace) {
		++step;
		str += ' ';
		title += ' ';
	}
	if (addTitle) {
		var i = title.length;
		for (; i < 20; i += step) {
			title += str;
		};
		title = title.substr(0,19);
		title += ' ';
		title += btitle + ' ';
		for (i = title.length; i < 70; i += step) {
			title += str;
		}
	}else{
		for (var i = title.length; i < 70; i += step) {
			title += str;
		}
	}
	
	return title;
}

function SelectText(element) {
	var text = element;
	if ($.browser.msie) {
	var range = document.body.createTextRange();
	range.moveToElementText(text);
	range.select();
	} else if ($.browser.mozilla || $.browser.opera) {
	var selection = window.getSelection();
	var range = document.createRange();
	range.selectNodeContents(text);
	selection.removeAllRanges();
	selection.addRange(range);
	} else if ($.browser.safari) {
	var selection = window.getSelection();
	selection.setBaseAndExtent(text, 0, text, 1);
	}
}

function showMsg (obj,msgtp,str) {
	if (isShowing) {
		clearTimeout(msgTimer);
		$msg.remove();
	}
	var msgType = 'msg-';
	switch(msgtp){
		case 'info':
			msgType += 'info';
			break;
		case 'succuss':
			msgType += 'succuss';
			break;
		case 'danger':
			msgType += 'danger';
			break;
		default:
			return;
	}
	$msg = $('<div></div>');
	$msg.addClass('msg msg-top');
	$msg.addClass(msgType);
	$msg.append(str);
	$msg.append('<span class="cuspOut"><span class="cuspIn"></span></span>');
	var top = obj.offset().top + obj.innerHeight();
	var left = obj.offset().left;
	$(document.body).append($msg);
	$msg.css({'top':top,'left':left}).fadeIn();
	//document.body.appendChild($msg[0]);
	isShowing = true;
	msgTimer = setTimeout(function(){
		$msg.fadeOut();
		$msg.remove();
		isShowing = false;
	},2000);
}

/* sina weibo
<script type="text/javascript" charset="utf-8">
(function(){
  var _w = 90 , _h = 24;
  var param = {
    url:location.href,
    type:'2',
    count:'1', ///是否显示分享数，1显示(可选)
    appkey:'675505486', //您申请的应用appkey,显示分享来源(可选)
    title:'', //分享的文字内容(可选，默认为所在页面的title)
    pic:'', //分享图片的路径(可选)
    ralateUid:'1833184245', //关联用户的UID，分享微博会@该用户(可选)
	language:'zh_cn', //设置语言，zh_cn|zh_tw(可选)
    rnd:new Date().valueOf()
  }
  var temp = [];
  for( var p in param ){
    temp.push(p + '=' + encodeURIComponent( param[p] || '' ) )
  }
  document.write('<iframe allowTransparency="true" frameborder="0" scrolling="no" src="http://hits.sinajs.cn/A1/weiboshare.html?' + temp.join('&') + '" width="'+ _w+'" height="'+_h+'"></iframe>')
})()
</script>

qq weibo
<script src="http://mat1.gtimg.com/app/opent/js/qshare_min.js"></script>
<script>
_share_tencent_weibo({
	"appkey":"801210500"	//你从腾讯微博开放平台获得的appkey
	,"qicon":{"width":32,"height":32,"name":"icon3.png"}	//选中文字后出现的转播按钮样式
//以下参数非必须，建议您删除掉
,"pic": "http://app.qpic.cn/mblogpic/4df7ef943f773edef66c/2000|http://app.qpic.cn/mblogpic/fceb497309f311c76ce8/2000"	//转播的图片，注意请先将图片地址进行urlencode后再用|进行合并，删除此参数程序将自行抓取网页中所有50*50以上大小的图片*/
//,"title": "您想要转播的文字内容..."	/*转播的内容，删除此参数程序获取网页中<title></title>标签之间的内容来填充*/,"url": "指定你想要转播的页面网址"   /*转播链接，删除此参数程序自动获取使用本代码的网页链接*/
//});
//</script>
//*/