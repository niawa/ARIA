$(document).ready(function(){
    $(".btn").click(function(){
      testInput();
      
      $('#fname').on( 'keydown', function () {
        testInput();
      });
    });
  
  
  function testInput() {
    var val = $('#fname').val();
    
    if ( val === '' ) {
      $(".error").html("성을 입력하여 주세요."); 
      $("#fname").attr({'aria-invalid':true, 'aria-describedby':"error-text"});
      $("#fname").focus();
    } else {
      if ( (/[a-zA-Z]+$/).test(val) ) {
        $("#fname").removeAttr('aria-invalid');
        $("#fname").removeAttr('aria-describedby');
        $(".error").html('');
      } else {
        $(".error").html("영문으로 입력하여 주세요.");
        $("#fname").attr({'aria-invalid':true, 'aria-describedby':"error-text"});
        $("#fname").focus();
      }
    }
  }
});