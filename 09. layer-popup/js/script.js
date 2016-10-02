$(document).ready(function() {
	/*WAI-ARIA 미적용코드*/
	$('#layer_open_before').mousedown(function(e){
		$('#layer_before').show();
	});

	$('#layer_close_before').mousedown(function(e){
		$('#layer_before').hide();
	});

	$('#layer_open_before').keyup(function(e){
		var keyCode = e.keyCode || e.which;
		if(keyCode == 13 || keyCode ==32) {//엔터키또는 스페이바키
			$('#layer_open_before').blur();
			$('#layer_before').show();
			$('#layer_before h1').focus();
		}
	});
	$('#layer_close_before').keyup(function(e){
		var keyCode = e.keyCode || e.which;
		if(keyCode == 13) {//엔터키
			$('#layer_before').hide();
			$('#layer_open_before').focus();
		}
	});

	/*WAI-ARIA 적용코드*/
	$('#layer').keyup(function(e){
		var keyCode = e.keyCode || e.which; //키보드 코드값
		if(keyCode == 27){// ESC 키
			$("#layer").attr("aria-hidden","true");
			$("#layer_open").attr("tabindex","0");
			$("#layer_open").focus() ;
			$('#layer').hide();
		}
	});

	$('#layer_open').keyup(function(e){
		var keyCode = e.keyCode || e.which;
		if(keyCode == 13 || keyCode ==32) {//엔터키또는 스페이바키
			$('#layer').show();
			$("#layer").attr("aria-hidden","false");
			$("#layer_open").attr("tabindex","-1");
			$("#layer h1").focus();
		}
	});

	$('#layer_close').keyup(function(e){
		var keyCode = e.keyCode || e.which;
		if(keyCode == 13) {//엔터키
			$("#layer").attr("aria-hidden","true");
			$("#layer_open").attr("tabindex","0");
			$("#layer_open").focus() ;
			$('#layer').hide();
			//e.preventDefault();
		}
	});

	$('#layer_close').keydown(function(e){
		var keyCode = e.keyCode || e.which;
		if (e.shiftKey && keyCode == 9 ) { //shift+tab 키
			$(this).prev().focus();//이전 링크로 커서이동
		}else if(keyCode == 9){//탭키
			e.preventDefault();//탭키의 기본기능 삭제
			$('#layer h1').focus();//첫번째 링크로 이동
		}
	});

	$('#layer h1').keydown(function(e){
		var keyCode = e.keyCode || e.which;
		if (keyCode == 9 && e.shiftKey) {//shift+tab 키
			e.preventDefault();
			$("#layer").attr("aria-hidden","true");
			$("#layer_open").attr("tabindex","0");
			$("#layer_open").focus() ;
			$('#layer').hide();
		}
	});

	$('#layer_open').mousedown(function(e){
		$('#layer').show();
	});

	$('#layer_close').mousedown(function(e){
		$('#layer').hide();
	});
});