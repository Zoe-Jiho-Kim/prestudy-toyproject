'use strict';
// genre btn toggle function
$(function () {
  $('.genre__btn').click(function () {
    $('.genre__content').slideToggle('2000');
  });
});
$(function () {
  $('.popular__btn').click(function () {
    $('.genre__content').slideUp('2000');
  });
});

// 모달 창이 열리면 input에 autofocus
// const myModal = document.getElementById('myModal');
// const myInput = document.getElementById('myInput');

// myModal.addEventListener('shown.bs.modal', function () {
//   myInput.focus();
// });

// 모달창에 웹툰 제목이 뜬다
const exampleModal = document.getElementById('exampleModal');
exampleModal.addEventListener('show.bs.modal', function (event) {
  // Button that triggered the modal
  const button = event.relatedTarget;
  // Extract info from data-bs-* attributes
  const recipient = button.getAttribute('data-bs-whatever');
  // If necessary, you could initiate an AJAX request here
  // and then do the updating in a callback.
  //
  // Update the modal's content.
  const modalTitle = exampleModal.querySelector('.modal-title');
  // const modalBodyInput = exampleModal.querySelector('.modal-body input');

  modalTitle.textContent = recipient;
  //modalBodyInput.value = recipient;
});

//댓글ajax영역
$(document).ready(function () {
  show_comment();
  $('#commentBtn').on('click', save_comment);
});

function save_comment() {
  let name = $('#recipient-name').val();
  let comment = $('#message-text').val();

  $.ajax({
    type: 'POST',
    url: '/toon',
    data: { name_give: name, comment_give: comment },
    success: function (response) {
      alert(response['msg']);
      window.location.reload();
    },
  });
}

function show_comment() {
  $.ajax({
    type: 'GET',
    url: '/toon',
    data: {},
    success: function (response) {
      let rows = response['comment'];
      for (let i = 0; i < rows.length; i++) {
        let name = rows[i]['name'];
        let comment = rows[i]['comment'];

        let temp_html = `<div class="row">
                          <div class="col user-name">${name}</div>
                          <div class="col-9">${comment}</div>
                        </div>`;

        $('#comment_box').prepend(temp_html);
      }
    },
  });
}
