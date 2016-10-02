$(document).ready(function(){
	$('#test-before').click(function(event){
		event.preventDefault();
		$('#main-before').addClass('wrap-back-loading');
		$('#loading-before').addClass('wrap-loading');
		$('#loading-before').html('');
		$('#loading-before').append(//div요소에 내용을 동적으로 추가한다.
			"<h2>Loading...</h2>"+
			"<p>3초후에 해당페이지로 이동합니다.</p>"
		);
		setTimeout(hideLoading, 3000); // 3초가 경과하면 hideLoading 함수가 실행.

	});
	$('#test').click(function(event){
		event.preventDefault();
		$('#main').addClass('wrap-back-loading');
		$('#loading').addClass('wrap-loading');
		$('#loading').html('');
		$('#loading').append(//role=alert에 내용을 동적으로 추가한다.
			"<h2>Loading...</h2>"+
			"<p>3초후에 해당페이지로 이동합니다.</p>"
		);
		setTimeout(hideLoading, 3000); // 3초가 경과하면 hideLoading 함수가 실행.
	});

	function hideLoading(){
		location.href = "next.html";
	}
});