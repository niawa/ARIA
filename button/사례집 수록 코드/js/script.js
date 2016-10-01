$(document).ready(function() {
	$("#div-btn").click(function() {
		alert("이것은 버튼입니다.");
	});
	$('#div-btn').keyup(function(e) {
		if (e.keyCode == 32) {
			alert('스페이스바를 눌렀군요!');
		}
		if (e.keyCode == 13) {
			alert('엔터키를 눌렀군요!');
		}
	});
});