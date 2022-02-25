'use strict';
/*************************
 * genre btn toggle function
 **************************/
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

/*************************
 * Put information received from db in modal window
 **************************/
const exampleModal = document.getElementById('exampleModal');
exampleModal.addEventListener('show.bs.modal', function (event) {
  // Button that triggered the modal
  const button = event.relatedTarget;
  // Extract info from data-bs-* attributes
  const recipient = button.getAttribute('data-bs-whatever');
  const thumbImg = button.getAttribute('data-img');
  const thumbBody = button.getAttribute('data-body');
  const thumbStar = button.getAttribute('data-star');
  const thumbWriter = button.getAttribute('data-writer');
  const thumbGenre = button.getAttribute('data-genre');
  const thumbUrl = button.getAttribute('data-url');

  // Update the modal's content.
  const modalTitle = exampleModal.querySelector('.modal-title');
  const modalImg = document.getElementById('modal-img');
  const modalBody = exampleModal.querySelector('.modal-desc');
  const modalStar = exampleModal.querySelector('.modal-star');
  const modalWriter = exampleModal.querySelector('.modal-writer');
  const modalGenre = exampleModal.querySelector('.modal-genre');
  const modalUrl = exampleModal.querySelector('.modal-url');

  modalTitle.textContent = recipient;
  modalImg.src = thumbImg;
  modalBody.textContent = thumbBody;
  modalStar.textContent = thumbStar;
  modalWriter.textContent = thumbWriter;
  modalGenre.textContent = thumbGenre;
  modalUrl.href = thumbUrl;
});

/*************************
 * 춘님 db에서 크롤링해온 데이터 받아오기
 **************************/
$(document).ready(function () {
  listing();
});

function listing() {
  $.ajax({
    type: 'GET',
    url: '/webtoons',
    data: {},
    success: function (response) {
      let rows = response['webtoons'];
      for (let i = 0; i < 30; i++) {
        let title = rows[i]['title'];
        let body = rows[i]['body'].replace(/\"/gi, "'"); // Change double quotes to single quotes
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
                            data-writer="${writer}"
                            data-body="${body}"
                            data-url="${url}"
                            data-star="${star}"
                            data-genre="${genre}"
                            data-img="${img}"
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

/*************************
 * moreBtn function
 **************************/

const moreBtn = document.querySelector('#morebtn');
let btnCount = 1;

moreBtn.addEventListener('click', morebtn);

function morebtn() {
  $.ajax({
    type: 'GET',
    url: '/webtoons',
    data: {},
    success: function (response) {
      let rows = response['webtoons'];

      (function clickCounter() {
        btnCount += 1;
        console.log(btnCount);
      })();

      for (let i = btnCount * 30; i < 30 + btnCount * 30; i++) {
        let title = rows[i]['title'];
        let body = rows[i]['body'].replace(/\"/gi, "'"); // Change double quotes to single quotes
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
                            data-writer="${writer}"
                            data-body="${body}"
                            data-url="${url}"
                            data-star="${star}"
                            data-genre="${genre}"
                            data-img="${img}"
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
/*************************
 * topBtn function
 **************************/

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

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
