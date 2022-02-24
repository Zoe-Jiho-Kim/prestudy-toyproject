'use strict';
$(document).ready(function () {
    $('#logout').text("")
    $('#mypage').text("")
});

function signup() {
    let username = $('#userid').val();
    let password = $('#userpw').val();
    let nickname = $('#usernick').val();

    if ($("#help-id").hasClass("is-danger")) {
        alert("아이디를 다시 확인해주세요.")
        return;
    } else if (!$("#help-id").hasClass("is-success")) {
        alert("아이디 중복확인을 해주세요.")
        return;
    }
    if (password == "") {
        $("#help-password").text("").removeClass("is-safe").addClass("is-danger")
        $("#input-password").focus()
        return;
    }if (nickname == "") {
        $("#help-nickname").text("닉네임를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-nickname").focus()
        return;
    }
    // } else if (!is_password(password)) {
    //     $("#help-password").text("비밀번호의 형식을 확인해주세요. 영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자").removeClass("is-safe").addClass("is-danger")
    //     $("#input-password").focus()
    //     return
    // } else {
    //     $("#help-password").text("사용할 수 있는 비밀번호입니다.").removeClass("is-danger").addClass("is-success")
    // }



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

function email_verif(asValue) {
    var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    return regExp.test(asValue);
}

// function is_password(asValue) {
//     var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
//     return regExp.test(asValue);
// }

function check_dup() {
    let username = $("#userid").val()

    console.log(username)
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

function check_pw() {

    var pw = document.getElementById('userpw').value;
    var SC = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "="];
    var check_SC = 0;
    // let nick = document.getElementById('usernick').value;

    if (pw.length < 6 || pw.length > 16) {
        document.getElementById('check').innerHTML = '비밀번호는 6글자 이상, 16글자 이하만 이용 가능합니다.';

    } else if (pw.length > 6 || pw.length < 16) {
        document.getElementById('check').innerHTML = '';
    }
    for (var i = 0; i < SC.length; i++) {
        if (pw.indexOf(SC[i]) != -1) {
            check_SC = 1;
        }
    }
    if (check_SC == 0) {
        document.getElementById('check').innerHTML = '비밀번호에 특수문자가 들어가 있지 않습니다.';
        document.getElementById('check').style.color = 'red';
    } else if (check_SC == 1) {
        document.getElementById('check').innerHTML = '';
    }
    if (document.getElementById('userpw').value != '' && document.getElementById('userpw2').value != '') {
        if (document.getElementById('userpw').value == document.getElementById('userpw2').value) {
            document.getElementById('check2').innerHTML = '비밀번호가 일치합니다.'
            document.getElementById('check2').style.color = 'blue';
            // $('#usernick').prop('disabled', false);

        } else {
            document.getElementById('check2').innerHTML = '비밀번호가 일치하지 않습니다.';
            document.getElementById('check2').style.color = 'red';
        }
    }

}






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