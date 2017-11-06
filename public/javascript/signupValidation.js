$(document).ready(function() {
    $("#signupForm").submit(function() {
        if( !$("#email").val() ) {
            alert('이메일을 입력해주세요.');
            return false;
        }
        if( !$("#password").val()) {
            alert('비밀번호를 입력해주세요.');
            return false;
        }
        if( !$("#repassword").val()) {
            alert('비밀번호 확인을 입력해주세요.');
            return false;
        }
        if( $("#password").val() != $("#repassword").val()) {
            alert('비밀번호와 비밀번호확인이 다릅니다.');
            return false;
        }
        if( !$("#name").val() ) {
            alert('이름을 입력해주세요.');
            return false;
        }
        if( !$("#job").val()) {
            alert('직업을 입력해주세요.');
            return false;
        }
        if( !$("#age").val()) {
            alert('나이을 입력해주세요.');
            return false;
        }
        if( !$("#incomeLevel").val()) {
            alert('소득분위를 입력해주세요.');
            return false;
        }
        if( !$("#isLove").val()) {
            alert('이성교제 유무를 입력해주세요.');
            return false;
        }
    });
});
