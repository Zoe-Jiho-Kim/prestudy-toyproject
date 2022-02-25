'use strict';
function changebtn() {
    console.log("changebtn")
    let password = $('#userpw').val();
    let password2 = $('#userpw2').val();


    if (password == "") {
        document.getElementById('help-password').innerHTML = '비밀번호를 입력해주세요.';
            document.getElementById('help-password').style.color = 'red';
            return;
    } else if (!is_password(password)){
        document.getElementById('help-password').innerHTML = '비밀번호의 형식을 확인해주세요. 영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자';
            document.getElementById('help-password').style.color = 'red';
            return;
    } else {
        document.getElementById('help-password').innerHTML = '사용할 수 있는 비밀번호입니다.';
            document.getElementById('help-password').style.color = 'blue';
    }
    if (password != '' && password2 != '') {
        if (password == password2) {
            document.getElementById('help-password2').innerHTML = '비밀번호가 일치합니다.';
            document.getElementById('help-password2').style.color = 'blue';
        } else {
            document.getElementById('help-password2').innerHTML = '비밀번호가 일치하지 않습니다.';
            document.getElementById('help-password2').style.color = 'red';
            return;
        }
    }



    $.ajax({
        type: 'POST',
        url: '/api/information',
        data: {
            pw_give: password
        },
        success: function (response) {
            alert(response['msg']);
            window.location.replace("/login")
        },

    });
}

// #############################
// ##    패스워드 체크정규식     ##
// #############################


function is_password(asValue) {
    var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
    return regExp.test(asValue);
}

// #############################
// ##    onchange  정보검증     ##
// #############################

function check_pw() {
    console.log("check_pw")
    let pw = document.getElementById('userpw').value;
    let pw2 = document.getElementById('userpw2').value;

    if (pw == "") {
        document.getElementById('help-password').innerHTML = '비밀번호를 입력해주세요.';
            document.getElementById('help-password').style.color = 'red';
            return;
    } else if (!is_password(pw)){
        document.getElementById('help-password').innerHTML = '비밀번호의 형식을 확인해주세요. 영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자';
            document.getElementById('help-password').style.color = 'red';
            return;
    } else {
        document.getElementById('help-password').innerHTML = '사용할 수 있는 비밀번호입니다.';
            document.getElementById('help-password').style.color = 'blue';
    } if (pw != '' && pw2 != '') {
        if (pw == pw2) {
            document.getElementById('help-password2').innerHTML = '비밀번호가 일치합니다.';
            document.getElementById('help-password2').style.color = 'blue';
        } else {
            document.getElementById('help-password2').innerHTML = '비밀번호가 일치하지 않습니다.';
            document.getElementById('help-password2').style.color = 'red';
            return;
        }
    }
}
