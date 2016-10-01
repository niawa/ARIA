$(document).ready(function() {
	$('.nav-before').setup_navigation();

	var $menu = $('#menu'),
		$menulink = $('.menu-link'),
		$menuTrigger = $('.has-subnav-before > a');

	$menulink.click(function(e) {
		e.preventDefault();
		$menulink.toggleClass('active');
		$menu.toggleClass('active');
	});

	$menuTrigger.click(function(e) {
		e.preventDefault();
		var $this = $(this);
		$this.toggleClass('active').next('ul').toggleClass('active');
	});
});


var keyCodeMap = {
	48:"0", 49:"1", 50:"2", 51:"3", 52:"4", 53:"5", 54:"6", 55:"7",
	56:"8", 57:"9", 59:";",65:"a", 66:"b", 67:"c", 68:"d", 69:"e",
	70:"f", 71:"g", 72:"h", 73:"i", 74:"j", 75:"k", 76:"l",
	77:"m", 78:"n", 79:"o", 80:"p", 81:"q", 82:"r", 83:"s", 84:"t",
	85:"u", 86:"v", 87:"w", 88:"x", 89:"y", 90:"z",
	96:"0", 97:"1", 98:"2", 99:"3", 100:"4", 101:"5", 102:"6",
	103:"7", 104:"8", 105:"9"
}

$.fn.setup_navigation = function(settings) {

	settings = jQuery.extend({
		menuHoverClass: 'show-menu-before',
	}, settings);

	var top_level_links = $(this).find('> li > a');

	$(top_level_links).next('ul')
		.find('a')
		.attr('tabIndex',-1);

	$(top_level_links).hover(function(){
		$(this).closest('ul')
			.find('.'+settings.menuHoverClass)
			.removeClass(settings.menuHoverClass)
			.find('a')
			.attr('tabIndex',-1);
		$(this).next('ul')
			.addClass(settings.menuHoverClass)
			.find('a').attr('tabIndex',0);
	});

	$(top_level_links).focus(function(){
		$(this).closest('ul')
			.find('.'+settings.menuHoverClass)
			.removeClass(settings.menuHoverClass)
			.find('a')
			.attr('tabIndex',-1);

		$(this).next('ul')
			.addClass(settings.menuHoverClass)
			.find('a').attr('tabIndex',0);
	});
	// 메뉴 네비게이션을 위한 방향키를 위한 이벤트 처리
	$(top_level_links).keydown(function(e){
		if(e.keyCode == 37) {//왼쪽 방향키
			e.preventDefault();
			// 첫번째 아이템인 경우
			if($(this).parent('li').prev('li').length == 0) {
				$(this).parents('ul')
					.find('> li').last().find('a').first().focus();
			} else {
				$(this).parent('li').prev('li').find('a').first().focus();
			}
		} else if(e.keyCode == 38) {//위쪽 방향키
			e.preventDefault();
			if($(this).parent('li').find('ul').length > 0) {
				$(this).parent('li').find('ul')
					.addClass(settings.menuHoverClass)
					.find('a').attr('tabIndex',0)
					.last().focus();
			}
		} else if(e.keyCode == 39) {//오른쪽 방향키
			e.preventDefault();
			// 마지막 아이템인 경우
			if($(this).parent('li').next('li').length == 0) {
				$(this).parents('ul')
					.find('> li').first().find('a').first().focus();
			} else {
				$(this).parent('li').next('li').find('a').first().focus();
			}
		} else if(e.keyCode == 40) {//아래쪽 방향키
			e.preventDefault();
			if($(this).parent('li').find('ul').length > 0) {
				$(this).parent('li').find('ul')
					.addClass(settings.menuHoverClass)
					.find('a').attr('tabIndex',0)
					.first().focus();
			}
		} else if(e.keyCode == 13 || e.keyCode == 32) {//엔터키 경우
			// 서브메뉴가 hidden인 경우 서브메뉴를 오픈해라
			e.preventDefault();
			$(this).parent('li').find('ul')
				.addClass(settings.menuHoverClass)
				.find('a').attr('tabIndex',0)
				.first().focus();
		} else if(e.keyCode == 27) {//ESC일 경우
			e.preventDefault();
			$('.'+settings.menuHoverClass)
				.removeClass(settings.menuHoverClass)
				.find('a')
				.attr('tabIndex',-1);
		} else {
			$(this).parent('li').find('ul a').each(function(){
				if($(this).text().substring(0,1).toLowerCase() == keyCodeMap[e.keyCode]) {
					$(this).focus();
					return false;
				}
			});
		}
	});

	var links = $(top_level_links).parent('li').find('ul').find('a');
	$(links).keydown(function(e){
		if(e.keyCode == 38) {//위쪽 방향키
			e.preventDefault();
			// 첫번째 아이템인 경우
			if($(this).parent('li').prev('li').length == 0) {
				$(this).parents('ul').parents('li').find('a').first().focus();
			} else {
				$(this).parent('li').prev('li').find('a').first().focus();
			}
		} else if(e.keyCode == 40) {//아래쪽 방향키
			e.preventDefault();
			if($(this).parent('li').next('li').length == 0) {
				$(this).parents('ul').parents('li').find('a').first().focus();
			} else {
				$(this).parent('li').next('li').find('a').first().focus();
			}
		} else if(e.keyCode == 27 || e.keyCode == 37) {
		//ESC 또는 왼쪽 방향키
			e.preventDefault();
			$(this)
				.parents('ul').first()
				.prev('a').focus()
				.parents('ul').first()
				.find('.'+settings.menuHoverClass)
				.removeClass(settings.menuHoverClass)
				.find('a')
				.attr('tabIndex',-1);
		} else if(e.keyCode == 32) {// 스페이스바 키
			e.preventDefault();
			window.location = $(this).attr('href');
		} else {
			var found = false;
			$(this).parent('li').nextAll('li').find('a').each(function(){
				if($(this).text().substring(0,1).toLowerCase() == keyCodeMap[e.keyCode]) {
					$(this).focus();
					found = true;
					return false;
				}
			});

			if(!found) {
				$(this).parent('li').prevAll('li').find('a').each(function(){
					if($(this).text().substring(0,1).toLowerCase() == keyCodeMap[e.keyCode]) {
						$(this).focus();
						return false;
					}
				});
			}
		}
	});
	//만약 클릭 또는 포커스 이벤트가 네비게이션 밖에서 발생할 경우
	//메뉴를 감춘다
	$(this).find('a').last().keydown(function(e){
		if(e.keyCode == 9) {//tab 키
			// If the user tabs out of the navigation hide all menus
			$('.'+settings.menuHoverClass)
				.removeClass(settings.menuHoverClass)
				.find('a')
				.attr('tabIndex',-1);
		}
	});

	$(document).click(function(){
	$('.'+settings.menuHoverClass)
	.removeClass(settings.menuHoverClass).find('a').attr('tabIndex',-1); });

	$(this).click(function(e){
		e.stopPropagation();
	});
}