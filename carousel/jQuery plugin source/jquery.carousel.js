/*! jquery.carousel.js © yamoo9.net, 2016 */
;(function(global, $){
	'use strict';

	/**
	 *	@default 기본 옵션
	 *	@type		{Object}
	 */
	var defaults = {
		'usingAria': true,
		'activeClass': 'active',
		'activeIndex': 0,
		'playSlide': true,
		'duration': 3000
	};

	/**
	 *	@method	 jQuery.prototype.CarouselUI
	 *	@param		{Object}	settings
	 */
	$.fn.CarouselUI = function(settings) {
		var $this = this;
		return $.each($this, function(idx, el) {
			var $el = $this.eq(idx);
			return $el.data('carouselUI', new CarouselUI($el).initialize(settings) );
		});
	};

	/**
	 *	@constructor	CarouselUI
	 *	@param				{object}	el HTMLElement
	 */
	var CarouselUI = function($el) {
		this.$widget = $el;
	};
	/**
	 *	@prototype CarouselUI
	 *	@type			{Object}
	 */
	CarouselUI.prototype = {
		'constructor': CarouselUI,
		/**
		 *	@method	 initialize 캐러셀 초기화
		 *	@memberOf CarouselUI.prototype
		 *	@param		{Object}	settings
		 *	@return	 {Object}	CarouselUI {}
		 */
		'initialize': function(settings) {
			// 옵션 객체 합성
			this.settings = $.extend({}, defaults, settings);
			this.currentIndex = this.settings.activeIndex;
			// 캐러셀 초기 설정
			settingCarousel.call(this);
			// 캐러셀 UI 객체 반환
			return this;
		},
		/**
		 *	@method	 activeTab
		 *	@memberOf CarouselUI.prototype
		 */
		'activeTab': activeTab,
		/**
		 *	@method	 setAria
		 *	@memberOf CarouselUI.prototype
		 */
		'setAria': settingAria,
		/**
		 *	@method	 desetAria
		 *	@memberOf CarouselUI.prototype
		 */
		'desetAria': destroyAria,
		/**
		 *	@method	 play
		 *	@memberOf CarouselUI.prototype
		 */
		'play': playSlide,
		/**
		 *	@method	 stop
		 *	@memberOf CarouselUI.prototype
		 */
		'stop': stopSlide
	};
	/** @type {Object} 키보드 객체 */
	var keys = {
		'left'		 : 37,
		'up'			 : 38,
		'right'		: 39,
		'down'		 : 40
	};
	/** @private	makingId */
	var build_id = 0;
	function makingId() {
		return build_id++;
	}
	/** @private	readingZeroNum	0을 붙인 숫자로 변경하여 반환 */
	function readingZeroNum(idx) {
		var num = idx + 1;
		return 10 > num ? '0' + num : num;
	}
	/** @private	settingCarousel */
	function settingCarousel() {
		var carousel = this;
		// 캐러셀 UI 탭 패널 요소 수집 후, jQuery 인스턴스 객체로 변수에 참조
		carousel.$tabpanel = carousel.$widget.children();
		// 캐러셀 UI 인디케이터 컨테이너 요소 생성 후, 변수에 참조
		carousel.$tablist = $('<ol>');
		// 동적으로 생성될 인디케이터 템플릿
		var template_indicators = [
			'<li>',
			'<a href="#">',
			'<span class="readable-hidden"></span>',
			'</a>',
			'</li>'
		].join('');
		// 캐로셀 UI 탭 패널 요소를 순환한 후, 템플릿을 활용하여 동적으로 코드 생성
		$.each(carousel.$tabpanel, function(idx) {
			// 개별 탭 패널 참조
			var $panel = carousel.$tabpanel.eq(idx);
			// 탬플릿 문자열로 탭 요소 생성 후, 변수에 참조
			var $tab = $(template_indicators);
			// 탭 패널의 레이블 설정 값을 label 변수에 참조
			var label = $panel.attr('data-label');
			// 탭 내부에서 span요소를 찾아 label 속성 값을 콘텐츠로 설정
			// label 변수 값이 존재하지 않으면, 패널 내부의 제목(첫번째 매칭 요소) 콘텐츠를 설정
			// 제목 또한 존재하지 않으면 '슬라이드 N'으로 설정
			$tab.find('span').text(label || $panel.find(':header:eq(0)').text() || '슬라이드 ' + (idx + 1));
			$tab.attr('title', label || $panel.find(':header:eq(0)').text() || '슬라이드 ' + (idx + 1));
			// 완성된 코드는 $tablist에 마지막 자식 요소로 삽입
			$tab.appendTo(carousel.$tablist);
		});
		// 완성된 $tablist 요소를 $widget 요소의 첫번째 자식 요소로 삽입힌다.
		carousel.$widget.prepend(carousel.$tablist);
		carousel.$tabs = carousel.$tablist.find('a');
		// 이전/다음 슬라이드 보기 버튼 추가
		$.each(['prev', 'next'], function(idx, feature) {
			$('<button type="button" class="ui-carousel__button ui-carousel__button--' + feature + '">')
				.html('<span class="readable-hidden"></span>').appendTo(carousel.$widget);
		});
		carousel.$buttons = carousel.$widget.find('button');
		// 슬라이드를 감싸는 영역을 동적으로 생성
		carousel.$tabpanel.wrapAll('<div class="ui-carousel__tabpanel-wrapper">');
		// 클래스 속성 설정
		settingClass.call(carousel);
		// 패널 레퍼에 width 설정
		carousel.$widget.find('.ui-carousel__tabpanel-wrapper').width( carousel.$tabpanel.outerWidth() * carousel.$tabpanel.length );
		// 이벤트 핸들러 바인딩 설정
		bindingEvents.call(carousel);
		// WAI-ARIA 설정
		carousel.settings.usingAria && settingAria.call(carousel);
		// 활성화 탭
		carousel.activeTab( carousel.currentIndex );
		// 슬라이드 재생
		carousel.settings.playSlide && playSlide.call(carousel);
	}
	/** @private	settingClass */
	function settingClass() {
		var carousel = this;
		var id = makingId();
		carousel.id = id;
		// $widget 요소에 클래스 속성 식별자 추가
		carousel.$widget.addClass('ui-carousel');
		// 탭 리스트 요소에 클래스 속성 식별자 추가
		carousel.$tablist.addClass('ui-carousel__indicators');
		$.each(carousel.$tabs, function(idx) {
			// 개별 탭 참조
			var $tab = carousel.$tabs.eq(idx);
			// 0을 붙인 숫자로 변경하는 함수를 사용하여 반환된 결과를 num 변수에 참조
			var num = readingZeroNum(idx);
			var slide_id = 'ui-carousel__slide-'+id+'--' + num;
			$tab.attr({
				'id': 'ui-carousel__tab-'+id+'--' + num,
				'class': 'ui-carousel__tab',
				'tabindex': -1
			});
			$tab.data('num', num);
			// 탭 패널에 클래스 속성 식별자 추가
			var $panel = carousel.$tabpanel.eq(idx);
			$panel.attr({
				'class': 'ui-carousel__tabpanel',
				'id': slide_id,
			});
			$panel.data('slide_id', slide_id);
		});
	}
	/** @private	settingAria */
	function settingAria() {
		var carousel = this;
		var $widget = carousel.$widget;
		$widget.attr({
			'role': 'region',
			'aria-label': $widget.attr('data-label') || $widget.children(':header:eq(0)').text() || '캐로셀 UI: 슬라이드 메뉴'
		});
		carousel.$tablist.attr('role', 'tablist');
		carousel.$tablist.find('li').attr('role', 'presentation');
		$.each(carousel.$tabs, function(idx) {
			var $tab = carousel.$tabs.eq(idx);
			var $panel = carousel.$tabpanel.eq(idx);
			var num = $tab.data('num');
			var slide_id = $panel.data('slide_id');
			$tab.attr({
				'role': 'tab',
				'aria-controls': slide_id,
				'aria-selected': false
			});
			$panel.attr({
				'role': 'tabpanel',
				'aria-labelledby': 'ui-carousel__tab-'+carousel.id+'--'+num,
				'aria-hidden': true
			});
		});
		// Aria 사용 설정 값이 false 일 경우, true로 변경
		if ( !this.settings.usingAria ) {
			this.settings.usingAria = true;
			console.info('WAI-ARIA가 적용되었습니다.');
		}
		return this;
	}
	/** @private	destroyAria */
	function destroyAria() {
		var carousel = this;
		var $widget = carousel.$widget;
		$widget
			.removeAttr('role')
			.removeAttr('aria-label');
		carousel.$tablist.removeAttr('role');
		carousel.$tablist.find('li').removeAttr('role');
		carousel.$tabs
			.removeAttr('role')
			.removeAttr('aria-controls')
			.removeAttr('aria-selected');
		carousel.$tabpanel
			.removeAttr('role')
			.removeAttr('aria-labelledby')
			.removeAttr('aria-hidden');
		this.settings.usingAria = false;
		console.info('WAI-ARIA가 해제되었습니다.');
		return this;
	}
	/** @private	bindingEvents */
	function bindingEvents() {
		var carousel = this;
		// 캐러셀에 마우스 이벤트 발동 시,
		carousel.$widget.on({
			// 마우스가 올라가면 멈춤
			'mouseenter': function() {
				carousel.stop();
			},
			// 마우스가 나가면 다시 재생
			'mouseleave': function() {
				carousel.settings.playSlide && carousel.play();
			}
		});
		// $tabs를 반복 순환하여 개별 $tab 요소에
		// 이벤트 ↔ 이벤트 핸들러 바인딩
		$.each(carousel.$tabs, function(idx) {
			// 개별 $tab 참조
			var $tab = carousel.$tabs.eq(idx);
			// $tab 요소에 이벤트 핸들러 바인딩
			// $.proxy() 프록시 우회 메소드를 사용하여
			// this 컨텍스트 참조 변수 설정
			$tab.on({
				'click': $.proxy(activeSlide, $tab, carousel),
				'focus': function() {
					carousel.stop();
				},
				'blur': function() {
					carousel.settings.playSlide && carousel.play();
				}
			});
		});
		$.each(carousel.$buttons, function(idx) {
			var $button = carousel.$buttons.eq(idx);
			$button.on({
				'click': $.proxy(activeTabWithButton, $button, carousel),
				'focus': function() {
					carousel.stop();
				},
				'blur': function() {
					carousel.settings.playSlide && carousel.play();
				}
			});
		});
		// 키보드로 제어하는 탭 내비게이션 활성화를 위한 이벤트 핸들링
		carousel.$tabs.on('keydown', $.proxy(activeKeyboardNavigation, carousel) );
	}
	/**
	 *	@function activeSlide		 슬라이드 활성화
	 *	@param		{Object}				carousel
	 *	@param		{Event Object}	e
	 */
	function activeSlide(carousel, e) {
		// 브라우저 기본 동작 차단
		e.preventDefault();
		var index = getIndex.call(this);
		carousel.currentIndex = index;
		// 사용자 상호작용에 따른 "선택 상태" 변경 메소드 호출
		changeStateSelect.call(this, carousel);
		// 사용자 상호작용에 따른 "감춤 상태" 변경 메소드 호출
		changeStateHidden.call(this, carousel);
		// 탭 패널의 부모 요소(<ol>)의 left 위치 값을 선택된 탭의 인덱스에 따라 변경
		// $tabpanel.parent().css('left', $tabpanel.outerWidth() * index * -1);
		carousel.$tabpanel.parent().stop().animate({
			'left': carousel.$tabpanel.outerWidth() * index * -1
		});
		// 버튼 텍스트 업데이트
		updateButtonText.call(carousel, index);
	}
	/**
	 *	@function activeSlide	 선택 상태 변경
	 *	@param		{Object}			carousel
	 */
	function changeStateSelect(carousel) {
		// 선택된 탭의 부모 형제의 자식 중 role 속성 값이 tab 인 요소를 찾아
		// WAI-ARIA 상태 변경
		// 키보드 포커싱이 되지 않도록 설정
		// active 클래스 속성 제거
		var activeClass = carousel.settings.activeClass;
		var $actived_tab = this.parent().siblings().find( '.'+activeClass );
		$actived_tab.attr('tabindex', -1).removeClass(activeClass);
		// 선택된 탭 요소의 WAI-ARIA 상태 변경
		// 키보드 포커싱이 되도록 설정
		// active 클래스 속성 추가
		this.attr('tabindex', 0).addClass(activeClass);
		if( carousel.settings.usingAria ) {
			$actived_tab.attr('aria-selected', false);
			this.attr('aria-selected', true);
		}
	}
	/**
	 *	@function changeStateHidden	 감춤 상태 변경
	 *	@param		{Object}						carousel
	 */
	function changeStateHidden(carousel) {
		// 사용자가 선택한 탭의 id 속성 값을 통해
		// 제어해야 할 탭 패널(슬라이드)를 필터링한다.
		var $panel = carousel.$tabpanel.filter('#' + this.attr('id').replace('tab', 'slide'));
		// 필터링된 탭 패널의 형제 요소를 찾아 감춤 상태를 업데이트 한다.
		$panel.siblings().find('a').attr('tabindex', -1);
		// 사용자가 선택한 탭이 제어하는 탭 패널의 감춤 상태를 업데이트 한다.
		$panel.find('a').removeAttr('tabindex');
		if( carousel.settings.usingAria ) {
			$panel.siblings().attr('aria-hidden', true);
			$panel.attr('aria-hidden', false);
		}
	}
	/** @function getIndex	인덱스를 반환 */
	function getIndex() {
		// 선택된 탭의 id 속성 값에서 인덱스 정보를 뽑아 반환한다.
		return Number(this.attr('id').split('--')[1]) - 1;
	}
	/** @function activeTabWithButton	 활성화 상태에 따른 버튼 변화 */
	function activeTabWithButton(carousel) {
		// 활성화 된 탭을 찾아 $tab 변수에 참조
		var $tab = carousel.$tabs.filter( '.' + carousel.settings.activeClass );
		// getIndex 함수를 사용하여 활성화 된 탭의 인덱스 값 index 변수에 참조
		var index = getIndex.call($tab) + 1;
		// 사용자가 클릭한 버튼이 이전 버튼인지 확인
		// 이전 버튼일 경우 true 값이 isClickPrevBtn 변수에 참조
		var isClickPrevBtn = this.attr('class').indexOf('prev') > -1;
		// $tabs의 개수 값을 length 변수에 참조
		var length = carousel.$tabs.length;
		// isClickPrevBtn 참조 값이 참일 경우 실행
		if (isClickPrevBtn) {
			// 유효한 index 값을 설정함
			index = --index > 0 ? index : length;
		}
		// isClickPrevBtn 참조 값이 거짓일 경우 실행
		else {
			// 유효한 index 값을 설정함
			index = ++index <= length ? index : 1;
		}
		carousel.currentIndex = index - 1;
		// 해당 index에 해당하는 탭 활성화
		activeTab.call(carousel, carousel.currentIndex);
	}
	/**
	 *	@function activeTab	 탭 활성화
	 *	@param		{Number}		id
	 *	@return	 {Object}		Carousel {}
	 */
	function activeTab(id) {
		var carousel = this;
		// 전달된 id 인자 값에 따라 활성화할 탭 필터링
		var $filter, type = $.type(id);
		// 숫자일 경우, 해당 숫자에 해당하는 탭 활성화
		if (type === 'number') {
			$filter = carousel.$tabs.eq(id);
		}
		// 문자일 경우, 해당 선택자에 해당하는 탭 활성화
		else if (type === 'string') {
			$filter = carousel.$tabs.filter(id);
		}
		// 숫자,문자가 아닐 경우 오류 메시지 출력 후, 함수 종료
		else {
			return console.error('숫자 또는 선택자(문자)를 입력해주세요.');
		}
		// 필터링 된 탭 활성화(클릭)
		$filter.trigger('click');
		return carousel;
	}
	/**
	 *	@function updateButtonText	버튼 텍스트 업데이트
	 *	@param		{Number}	idx
	 */
	function updateButtonText(idx) {
		var carousel = this;
		// 전달받은 idx 값을 사용하여 활성화된 탭을 $tab 변수에 참조
		var $tab = carousel.$tabs.eq(idx - 1);
		// getIndex() 함수를 사용하여 활성화된 탭의 index 값을 참조
		var index = getIndex.call($tab);
		// $buttons 객체에 수집된 요소 중 이전 버튼을 필터링하여 참조
		var $prevBtn = carousel.$buttons.filter('.ui-carousel__button--prev');
		// $buttons 객체에 수집된 요소 중 다음 버튼을 필터링하여 참조
		var $nextBtn = carousel.$buttons.filter('.ui-carousel__button--next');
		// 이전 버튼에 삽입되어야 할 텍스트를 탭 내부의 span 요소에서 참조
		var prevText = carousel.$tabs.eq(index - 1).find('span').text();
		// 다음 버튼에 삽입되어야 할 텍스트를 탭 내부의 span 요소에서 참조
		var nextText = carousel.$tabs.eq(index + 1 === 3 ? 0 : index + 1).find('span').text();
		// 이전 버튼 내부의 span 요소에 prevText 값 설정
		$prevBtn.find('span').text(prevText);
		// 이전 버튼의 title 속성에 prevText 값 설정
		$prevBtn.attr('title', prevText);
		// 다음 버튼 내부의 span 요소에 nextText 값 설정
		$nextBtn.find('span').text(nextText);
		// 다음 버튼의 title 속성에 nextText 값 설정
		$nextBtn.attr('title', nextText);
	}
	/**
	 *	@function activeKeyboardNavigation	키보드로 제어하는 탭 내비게이션 활성화
	 *	@param		{Event Pbject}	e
	 */
	function activeKeyboardNavigation(e) {
		// 키코드 변수 값 참조
		var key = e.keyCode;
		var carousel = this;
		var activeClass = carousel.settings.activeClass;
		// 활성화된 탭 정보를 가져와 변수에 참조
		var $tab = carousel.$tabs.filter( '.' + activeClass );
		var index = getIndex.call($tab);
		var length = carousel.$tabs.length;
		// 사용자가 키보드 ←, ↑ 누를 경우 처리되는 조건
		if (key === keys.left || key === keys.up) {
			// 유효한 인덱스 값을 설정
			index = --index >= 0 ? index : length - 1;
		}
		// 사용자가 키보드 →, ↓ 누를 경우 처리되는 조건
		else if (key === keys.right || key === keys.down) {
			// 유효한 인덱스 값을 설정
			index = ++index < length ? index : 0;
		}
		// 설정한 키보드 키가 아닌 경우 함수 종료
		else {
			return;
		}
		carousel.currentIndex = index;
		// 해당 인덱스의 탭 활성화
		activeTab.call(carousel, index);
		// 활성화 된 탭에 포커스 설정
		carousel.$tabs.filter('.' + activeClass).focus();
	}
	/**
	 *	@function playSlide	슬라이드 재생
	 *	@param		{Number}	 duration	 재생 발동 시간(ms)
	 *	@param		{Boolean}	continuity 연속 재생 여부
	 */
	function playSlide(duration, continuity) {
		var carousel = this;
		var currentIndex = carousel.currentIndex;
		if ( duration ) { carousel.settings.duration = duration; }
		if ( continuity ) { carousel.settings.playSlide = true; }
		carousel.playId = global.setTimeout(function() {
			carousel.activeTab(++currentIndex % carousel.$tabs.length );
			playSlide.call(carousel, duration);
		}, duration || carousel.settings.duration );
	}
	/** @function stopSlide	슬라이드 재생 멈춤 */
	function stopSlide() {
		var carousel = this;
		global.clearTimeout(carousel.playId);
		console.info('슬라이드 재생이 멈췄습니다.');
	}

})(this, this.jQuery);