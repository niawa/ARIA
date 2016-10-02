/**
 * AutocompleteUI Ver 1.0
 * @author mulder21c
 */
!(function(window,$){
	/**
	 * @class AutoCompleteUI
	 * @param {object} elem HTMLElement
	 */
	var AutoCompleteUI = function(elem){
		this.combobox = elem;
	}

	/*
	 * default options
	 * @private
	 */
	var defaults = {
		useAria : true,
		activeClass : 'active'
	};

	AutoCompleteUI.prototype = {
		/*
		 * whether the current browser is FireFox or not
		 * @property isFireFox
		 * @memberof AutoCompleteUI.prototype
		 */
		isFireFox : /firefox/.test(navigator.userAgent.toLowerCase()),
		/*
		 * select specific option item
		 * @function selectItem
		 * @memberof AutoCompleteUI.prototype
		 */
		selectItem : function(idx){
			var me = this;
			// if current item's index number exceeded the normal range, remove the suggested list
			if( idx < 0 || idx >= me.listWrap.data('count') * 1 ){
				me.combobox.val(me.orgkeyword);
				me.removeList();
				return;
			}
			var value = me.suggestList.children('li:eq(' + idx + ')').addClass('active').text();
			if(me.settings['useAria'] === true){
				me.combobox.attr({'aria-activedescendant' : me.prefix + 'item' + idx}).val(value);
			}else{
				me.combobox.attr({'data-activedescendant' : me.prefix + 'item' + idx}).val(value);
			}
		},
		/*
		 * deselect specific option item
		 * @function selectItem
		 * @memberof AutoCompleteUI.prototype
		 */
		deSelectItem : function(idx){
			var me = this;
			me.suggestList.children('li:eq('+ idx +')').removeClass('active');
		},
		/*
		 * event handler for key-up event
		 * @function bindKeyEvent
		 * @memberof AutoCompleteUI.prototype
		 */
		bindKeyEvent : function(event){
			event = event || window.event;
			event.stopImmediatePropagation();
			var me = this,
				cb = me.combobox,
				activatedItem = me.settings['useAria'] === true ? cb.attr('aria-activedescendant') : cb.attr('data-activedescendant'),
				keycode = event.which || event.keyCode;
			switch(keycode){
				// enter key
				case 13 :
					if( me.isFireFox === true ){
						clearTimeout(me.recuseFFTimer);
					}
					if( activatedItem !== undefined ){
						event.preventDefault ? event.preventDefault() : event.returnValue = false;
						me.combobox.val( $('#' + activatedItem).text().trim().substr(0, me.maxLength) );
						me.frm.submit();
					}else if( me.combobox.val().trim() !== '' ){
						me.frm.submit();
					}
					me.frm.submit();
					break;
				// esc key
				case 27 :
					event.preventDefault ? event.preventDefault() : event.returnValue = false;
					if( me.isFireFox === true ){
						clearTimeout(me.recuseFFTimer);
					}
					me.combobox.val( me.orgkeyword );
					me.removeList();
					break;
				// up-arrow key
				case 38 :
					event.preventDefault ? event.preventDefault() : event.returnValue = false;
					if( me.isFireFox === true ){
						clearTimeout(me.recuseFFTimer);
					}
					if( me.source.length === 0 || me.suggestList === null ){
						return;
					}
					if( activatedItem === undefined ){
						idx = me.source.length;
					}else{
						idx = $('#' + activatedItem).index();
					}
					me.deSelectItem(idx);
					me.selectItem(idx - 1);
					break;
				// down-arrow key
				case 40 :
					event.preventDefault ? event.preventDefault() : event.returnValue = false;
					if( me.isFireFox === true ){
						clearTimeout(me.recuseFFTimer);
					}
					if( me.source.length === 0 || me.suggestList === null ){
						return;
					}
					if( activatedItem === undefined ){
						idx = -1;
					}else{
						idx = $('#' + activatedItem).index();
					}
					me.deSelectItem(idx);
					me.selectItem(idx + 1);
					break;
				default :
					if( me.isFireFox === true ){
						var event = $.Event('keyup');
						event.which = keycode;
						clearTimeout(me.recuseFFTimer);
						me.fixFFKeyup(event);
					}
					break;
			}
		},
		/*
		 * event handler for key-down event
		 * @function updateList
		 * @memberof AutoCompleteUI.prototype
		 */
		updateList : function(event){
			event = event || window.event;
			event.stopImmediatePropagation();
			var me = this,
				keycode = event.which || event.keyCode;
			me.keyword = me.combobox.val().trim();
			if( me.orgkeyword === me.keyword ){
				return;
			}
			switch(keycode){
				case 13 :
				case 27 :
				case 38 :
				case 40 :
					event.preventDefault ? event.preventDefault() : event.returnValue = false;
					break;
				default :
					me.orgkeyword = me.keyword;
					clearTimeout(me.delayTimer);
					me.delayTimer = setTimeout(function(){
						if( me.keyword === '' ){
							me.removeList();
							return;
						}
						me.getSources.apply(me, arguments);
					}, 400);
				break;
			}
		},
		/**
		 * this function must be implemented, and must invoke this.setSources() with array list as arguments
		 * @function getSources
		 * @memberof AutoCompleteUI.prototype
		 * @abstract
		 */
		getSources : function(){
		},
		/**
		 * @function setSources
		 * @memberof AutoCompleteUI.prototype
		 * @param {array} source list
		 */
		setSources : function(list){
			var me = this;
			if( list instanceof Array === true){
				me.source = list;
			}else{
				me.source = [];
			}
			if( me.source.length === 0 ){
				me.removeList();
			}else{
				me.renderList();
			}
		},
		/**
		 * render suggested list from sources
		 * @function renderList
		 * @memberof AutoCompleteUI.prototype
		 */
		renderList : function(){
			var me = this;
			var sourceCtn = me.source.length;
			if( me.suggestList === null ){
				// 추천 검색어 목록 생성
				me.suggestList = $('<ul />').addClass('listbox')
				if(me.settings['useAria'] === true){
					me.suggestList.attr({'role' : 'listbox'});
				}
				me.suggestList.appendTo(me.listWrap);
			}
			me.listWrap.attr({
				'data-count' : sourceCtn
			})
			.on({
				'mousedown' : function(event){
					event = event || window.event;
					event.stopPropagation();
					var activatedItem = me.settings['useAria'] === true ? me.combobox.attr('aria-activedescendant') : me.combobox.attr('data-activedescendant')
					me.deSelectItem($('#' + activatedItem).index());
					me.selectItem($(this).index());
				}
			}, 'li');

			$(document).on({
				'mousedown' : function(event){
					event = event || window.event;
					if(event.target === me.combobox[0]){
						return;
					}
					me.removeList.apply(me, arguments);
				}
			});

			var docFrag = document.createDocumentFragment();
			for(var i = -1, item = null; item = me.source[++i];){
				$('<li />')
				 .attr($.extend({'id' : me.prefix + 'item' + i}, me.settings['useAria'] === true ? {'role' : 'option'} : null))
				 .text(item)
				 .appendTo(docFrag);
			}
			me.suggestList.empty().append(docFrag);

			if(me.settings['useAria'] === true){
				me.combobox.removeAttr('aria-activedescendant');
				me.combobox.attr({'aria-expanded' : 'true'});
				me.updateStatus(sourceCtn);
			}else{
				me.combobox.removeAttr('data-activedescendant');
			}
		},
		/**
		 * remove suggested list
		 * @function removeList
		 * @memberof AutoCompleteUI.prototype
		 */
		removeList : function(){
			var me = this;
			if( me.suggestList !== null ){
				me.suggestList.remove();
				me.suggestList = null;
				if( me.settings['useAria'] === true ){
					me.combobox.removeAttr('aria-activedescendant');
					me.combobox.attr({'aria-expanded' : 'false'});
					me.status.empty();
				}else{
					me.combobox.removeAttr('data-activedescendant');
				}
			}
		},
		/**
		 * update status of resulting rendering suggested list
		 * @function updateStatus
		 * @memberof AutoCompleteUI.prototype
		 * @param {number} count the count of suggested items
		 */
		updateStatus : function(count){
			var me = this;
			if( me.settings['useAria'] === true ){
				me.status.empty().append( $('<div />').text(count + '개의 추천 검색어가 있습니다.') );
			}
		},
		/**
		 * fix FireFox's key-up event issue
		 * @function fixFFKeyup
		 * @memberof AutoCompleteUI.prototype
		 * @param {number} count the count of suggested items
		 */
		fixFFKeyup : function(event){
			event = event || window.event;
			var me = this;
			var keycode = event.which || event.keyCode;
			me.recuseFFTimer = setInterval(function(){
				if( me.combobox.val() !== me.cacheFFValue){
					me.cacheFFValue = me.combobox.val();
					me.combobox.trigger('keyup');
				}
			}, 100);
		}
	}

	/**
	 * @function initialize
	 * @memberof AutoCompleteUI.prototype
	 * @param {object} settings
	 * @param {boolean} [useAria] whether use WAI-ARIA's roles and attributes, or not
	 * @param {string} [activeClass="active"] class name for presenting activated item
	 */
	AutoCompleteUI.prototype.initialize = function(settings){
		var me = this;
		// set autocomplete attribute to off, it will turn off autocompletion for form field
		me.combobox = $(me.combobox).attr({
			'autocomplete' : 'off'
		});

		// merging plugin settings with default options, and make sevaral properties of instance
		me.settings = $.extend({}, defaults, settings);
		me.frm = me.combobox.closest('form');
		me.keyword = me.combobox.val().trim();
		me.orgkeyword = me.combobox.val().trim();
		me.source = [];
		me.listWrap = $('<div />').appendTo(me.frm);
		me.listBox = null;
		me.maxLength = me.combobox.attr('maxlength') * 1 || Infinity;
		me.delayTimer = null;
		me.recuseFFTimer = null;
		me.cacheFFValue = null;
		me.getSources = me.settings.getSources;
		me.suggestList = null;
		me.status = null;
		me.prefix = me.settings['prefix'] ? me.settings['prefix'] + '-' : 'mulder21c-AutoComplete' + Math.floor(Math.random() * 999) % 99 + new Date().getTime() + Math.floor(Math.random() * 999) % 99 + '-';

		if(me.settings.useAria === true){
			// set WAI-ARIA's role and properties
			me.combobox.attr({
				'role' : 'combobox',
				'aria-haspopup' : 'true',
				'aria-autocomplete' : 'list'
			});
			// create element for reporting status of searched result
			me.status = $('<div />').attr({
				'role' : 'status',
				'aria-live' : 'polite',
				'aria-relevant' : 'additions',
				'class' : 'hidden-accessible'
			}).appendTo(me.frm);
		}

		me.combobox.on({
			keyup : function(){
				me.updateList.apply(me, arguments);
			},
			keydown : function(){
				me.bindKeyEvent.apply(me, arguments);
			},
			paste : function(){
				var args = arguments;
				setTimeout(function(){
					me.updateList.apply(me, args);
				}, 5)
			},
			focus : function(){
				if( me.isFireFox === true ){
					me.fixFFKeyup.apply(me, arguments);
				}
			},
			blur : function(){
				if( me.isFireFox === true ){
					clearTimeout(me.recuseFFTimer);
				}
			}
		});
	};

	/**
	 * @function external:"jQuery.fn".AutoCompleteUI
	 */
	$.fn.AutoCompleteUI = function(settings){
		return this.each(function() {
			new AutoCompleteUI(this).initialize(settings);
		});
	};

	window.AutoCompleteUI = AutoCompleteUI;
})(window, jQuery);