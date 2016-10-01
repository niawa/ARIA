$(document).ready(function() {
	var group1 = new radioGroup('rg1');
});

function keyCodes() {
	this.enter = 13;
	this.space = 32;
	this.left = 37;
	this.up = 38;
	this.right = 39;
	this.down = 40;
}

function radioGroup(id) {
	var thisObj = this;
	this.$id = $('#' + id);
	this.$buttons = this.$id.find('li').filter('[role=radio]');
	this.$checked = this.$buttons.filter('[aria-checked=true]');
	this.checkButton = true;
	this.$active = null;
	this.keys = new keyCodes();
	this.$buttons.click(function(e) {
		return thisObj.handleClick(e, $(this));
	});
	this.$buttons.keydown(function(e) {
		return thisObj.handleKeyDown(e, $(this));
	});
	this.$buttons.keypress(function(e) {
		return thisObj.handleKeyPress(e, $(this));
	});
	this.$buttons.focus(function(e) {
		return thisObj.handleFocus(e, $(this));
	});
	this.$buttons.blur(function(e) {
		return thisObj.handleBlur(e, $(this));
	});
}
radioGroup.prototype.selectButton = function($id) {
	if (this.checkButton == true) {
		this.$checked.attr('aria-checked', 'false');
		$id.attr('aria-checked', 'true');
		if (this.$checked.length == 0) {
			this.$buttons.first().attr('tabindex', '-1');
			this.$buttons.last().attr('tabindex', '-1');
		} else {
			this.$checked.attr('tabindex', '-1');
		}
		$id.attr('tabindex', '0');
		this.$checked = $id;
	}
	this.checkButton = true;
	this.$active = $id;
	$id.addClass('selected');
};
radioGroup.prototype.handleClick = function(e, $id) {
	if (e.altKey || e.ctrlKey || e.shiftKey) {
		return true;
	}
	e.stopPropagation();
	return false;
};
radioGroup.prototype.handleKeyDown = function(e, $id) {
	if (e.altKey) {
		return true;
	}
	switch (e.keyCode) {
		case this.keys.space:
		case this.keys.enter:
			{
				if (e.ctrlkey || e.shiftKey) {
					return true;
				}
				this.selectButton($id);
				e.stopPropagation();
				return false;
			}
		case this.keys.left:
		case this.keys.up:
			{
				var $prev = $id.prev();
				if (e.shiftKey) {
					return true;
				}
				if ($id.index() == 0) {
					$prev = this.$buttons.last();
				}
				if (e.ctrlKey) {
					this.checkButton = false;
				}
				$prev[0].focus();
				e.stopPropagation();
				return false;
			}
		case this.keys.right:
		case this.keys.down:
			{
				var $next = $id.next();
				if (e.shiftKey) {
					return true;
				}
				if ($id.index() == this.$buttons.length - 1) {
					$next = this.$buttons.first();
				}
				if (e.ctrlKey) {
					this.checkButton = false;
				}
				$next[0].focus();
				e.stopPropagation();
				return false;
			}
	}
	return true;
};
radioGroup.prototype.handleKeyPress = function(e, $id) {
	if (e.altKey) {
		return true;
	}
	switch (e.keyCode) {
		case this.keys.space:
		case this.keys.enter:
			{
				if (e.ctrlKey || e.shiftKey) {
					return true;
				}
			}
		case this.keys.left:
		case this.keys.up:
		case this.keys.right:
		case this.keys.down:
			{
				if (e.shiftKey) {
					return true;
				}
				e.stopPropagation();
				return false;
			}
	}
	return true;
};
radioGroup.prototype.handleFocus = function(e, $id) {
	this.selectButton($id);
	return true;
};
radioGroup.prototype.handleBlur = function(e, $id) {
	$id.removeClass('selected');
	return true;
};