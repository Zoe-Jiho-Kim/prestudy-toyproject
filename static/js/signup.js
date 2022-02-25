'use strict';
$(document).ready(function () {
    $('#logout').text("")
    $('#mypage').text("")
});


// #############################
// ##    정보검증 후 회원가입    ##
// #############################

function signup() {
    let username = $('#userid').val();
    let password = $('#userpw').val();
    let password2 = $('#userpw2').val();
    let nickname = $('#usernick').val();

    if ($("#help-id").hasClass("is-danger")) {
        alert("이메일을 다시 확인해주세요.")
        return;
    } else if (!$("#help-id").hasClass("is-success")) {
        alert("이메일 중복확인을 해주세요.")
        return;
    }
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
    if (nickname == "") {
            document.getElementById('help-nickname').innerHTML = '닉네임을 입력해주세요.';
            document.getElementById('help-nickname').style.color = 'red';
            return;
    } else {
            document.getElementById('help-nickname').innerHTML = '사용할 수 있는 닉네임입니다.';
            document.getElementById('help-nickname').style.color = 'blue';
    }


    $.ajax({
        type: 'POST',
        url: '/api/signup',
        data: {
            id_give: username,
            pw_give: password,
            nickname_give: nickname
        },
        success: function (response) {
            alert(response['msg']);
            window.location.replace("/login")
        },

    });
}

// #############################
// ##  이메일,패스워드 체크정규식  ##
// #############################

function email_verif(asValue) {
    var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    return regExp.test(asValue);
}

function is_password(asValue) {
    var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
    return regExp.test(asValue);
}

// #######################
// ##    이메일 중복확인   ##
// #######################

function check_dup() {
    let username = $("#userid").val()
    // console.log(username)
    if (username == "") {
        $("#help-id").text("이메일를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-username").focus()
        return;
    }
    if (!email_verif(username)) {
        $("#help-id").text("이메일 형식을 확인해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-username").focus()
        return;
    }

    $.ajax({
        type: "POST",
        url: "/signup/check_dup",
        data: {
            username_give: username
        },
        success: function (response) {

            if (response["exists"]) {
                $("#help-id").text("이미 존재하는 이메일입니다.").removeClass("is-safe").addClass("is-danger")
                $("#userid").focus()
            } else {
                $("#help-id").text("사용할 수 있는 이메일입니다.").removeClass("is-danger").addClass("is-success")
            }
            $("#help-id").removeClass("is-loading")
        }
    });
}
// #############################
// ##    onchange  정보검증     ##
// #############################
function check_pw() {
    let pw = document.getElementById('userpw').value;
    let pw2 = document.getElementById('userpw2').value;
    let nick = document.getElementById('usernick').value;

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
    } if (nick == "") {
            document.getElementById('help-nickname').innerHTML = '닉네임을 입력해주세요.';
            document.getElementById('help-nickname').style.color = 'red';
            return;
    } else {
            document.getElementById('help-nickname').innerHTML = '사용할 수 있는 닉네임입니다.';
            document.getElementById('help-nickname').style.color = 'blue';
    }
}
    // if (password == "") {
    //     $("#help-password").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
    //     $("#input-password").focus()
    //     return;
    // } else if (!is_password(password)) {
    //     $("#help-password").text("비밀번호의 형식을 확인해주세요. 영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자").removeClass("is-safe").addClass("is-danger")
    //     $("#input-password").focus()
    //     return
    // } else {
    //     $("#help-password").text("사용할 수 있는 비밀번호입니다.").removeClass("is-danger").addClass("is-success")
    // }
    // if (nickname == "") {
    //     $("#help-nickname").text("닉네임를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
    //     $("#input-nickname").focus()
    //     return;
    // if (pw.length < 6 || pw.length > 16) {
    //     document.getElementById('check').innerHTML = '비밀번호는 6글자 이상, 16글자 이하만 이용 가능합니다.';
    //
    // } else if (pw.length > 6 || pw.length < 16) {
    //     document.getElementById('check').innerHTML = '';
    // }
    // for (var i = 0; i < SC.length; i++) {
    //     if (pw.indexOf(SC[i]) != -1) {
    //         check_SC = 1;
    //     }
    // }
    // if (check_SC == 0) {
    //     document.getElementById('check').innerHTML = '비밀번호에 특수문자가 들어가 있지 않습니다.';
    //     document.getElementById('check').style.color = 'red';
    // } else if (check_SC == 1) {
    //     document.getElementById('check').innerHTML = '';
    // }




// $(document).ready(function () {
//         $('#signbtn').on('input change', function () {
//             if (document.getElementById('userpw').value == document.getElementById('userpw2').value) {
//                 $('#signbtn').prop('disabled', true);
//             }
//             else {
//                 $('#signbtn').prop('disabled', true);
//             }
//         });
//     });