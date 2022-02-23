  function save_idpw() {
    let id = $('#userid').val()
    let pw = $('#userpw').val()
    let nickname = $('#usernick').val()


    $.ajax({
      type: 'POST',
      url: '/api/signup',
      data: {id_give: id, pw_give: pw, nickname_give: nickname},
      success: function (response) {
        alert(response['msg'])
        window.location.href = '/login'
      }
    })
  }

  // function Verif() {
  //   var p1 = document.getElementById('userpw').value;
  //   var p2 = document.getElementById('userpw2').value;
  //
  //   if(p1.length < 8) {
  //       alert('비밀번호는 8글자 이상이여야 합니다.');
  //       return false;
  //   }
  //   if( p1 != p2) {
  //       alert("비밀번호가 일치하지않습니다.");
  //       return false;
  //   } else{
  //       alert("비밀번호가 일치합니다.");
  //       return true;
  //   }
  // }