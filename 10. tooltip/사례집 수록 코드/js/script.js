/*! tooltip.js © yamoo9.net, 2016 */
;(function(global, $) {
	'use strict';

	var $demo_tooltip			= $('.demo-tooltip');
	var $demo_tooltip_link		= $demo_tooltip.find('.tooltip-btn');
	var $demo_tooltip_content	= $demo_tooltip.find('.tooltip-content');

	function updateState(e) {
		var state;
		switch(e.type) {
			case 'mouseenter':
			case 'focus':
				state = false;
			break;
			case 'mouseleave':
			case 'blur':
				state = true;
			break;
			case 'keydown':
				if ( e.keyCode === 27 ) { state = true; }
		}
		$demo_tooltip_content.attr({
			'aria-hidden': state,
			'data-hidden': state
		});
	}

	$demo_tooltip.on('mouseenter mouseleave keydown', updateState);
	$demo_tooltip_link.on('focus blur', updateState);

})(this, this.jQuery);