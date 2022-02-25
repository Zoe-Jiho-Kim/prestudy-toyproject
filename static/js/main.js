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

//////////////////////////////////////////////////////
// 춘님 db에서 크롤링해온 데이터 받아오기

$(document).ready(function () {
  listing();
  //listing();
});

function listing() {
  $.ajax({
    type: 'GET',
    url: '/webtoons',
    data: {},
    success: function (response) {
      let rows = response['webtoons'];
      for (let i = 0; i < rows.length; i++) {
        let title = rows[i]['title'];
        let body = rows[i]['body'];
        let img = rows[i]['img'];
        let writer = rows[i]['writer'];
        let url = rows[i]['url'];
        let star = rows[i]['star'];
        let genre = rows[i]['genre'];

        let temp_html = `<button
                            type="button"
                            class="thumbnail"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                            data-bs-whatever="${title}"
                          >
                            <div class="col">
                              <div class="card shadow-sm">
                                <img
                                  src="${img}"
                                  width="100%"
                                  height="100%"
                                  title="${title}"
                                  alt="${title}"
                                />
                                <div class="card-body">
                                  <p class="card-text">${title}</p>
                                </div>
                              </div>
                            </div>
                          </button>`;
        $('#thumbnail-box').append(temp_html);
      }
    },
  });
}

/////////////////////////////////////////////////////////////////////////////
//
//

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
