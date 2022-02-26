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
                            data-star="⭐${star}"
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
                                <div class="card-body"">
                                  <p class="thunmbnail__title card-text">${title}</p>
                                </div>
                              </div>
                            </div>
                          </button>`;
        $('#thumbnail-box').append(temp_html);
      }
      readTitle();
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
                            data-star="⭐${star}"
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
                                  <p class="thunmbnail__title card-text">${title}</p>
                                </div>
                              </div>
                            </div>
                          </button>`;
        $('#thumbnail-box').append(temp_html);
      }
      readTitle();
    },
  });
}
/*************************
 * topBtn function
 **************************/
const dm = document.documentElement;
const topBtn = document.querySelector('.top__btn');

const documentHeight = dm.scrollHeight;

window.addEventListener('scroll', function () {
  let scrollToTop = dm.scrollTop;

  if (documentHeight != 0) {
    const actionHeight = documentHeight / 4;

    if (scrollToTop > actionHeight) {
      topBtn.classList.remove('blind');
    } else {
      topBtn.classList.add('blind');
    }
  }
});

topBtn.addEventListener('click', function () {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
});

/*************************
 * Practice
 **************************/
// thunmbnail의 title을 읽어오는 함수 입니다.
function readTitle() {
  // title 저장을 위한 변수 선언
  const thumbnails = document.querySelectorAll('.thumbnail');

  thumbnails.forEach(function (thumbnail) {
    thumbnail.addEventListener('click', clickThumb);
  });

  function clickThumb(e) {
    let title = e.currentTarget.getAttribute('data-bs-whatever');
    // titleBucket에 title값을 넣어줍니다
    titleBucket = title;
    console.log(title);
  }
}
// readTitle() 값을 저장해줄 변수 선언
let titleBucket = '';
// console.log(titleBucket);
/*************************
 * Leave a comment function
 **************************/

$(document).ready(function () {
  show_comment();
});
$('#commentBtn').on('click', save_comment);
// 댓글 갯수 저장을 위한 변수 선언
let commentCount = 0;

function save_comment() {
  let name = $('#recipient-name').val();
  let comment = $('#message-text').val();
  let title = titleBucket;
  // console.log(title);

  $.ajax({
    type: 'POST',
    url: '/toon',
    data: { name_give: name, comment_give: comment, title_give: title },
    success: function (response) {
      alert(response['msg']);
      // 댓글을 등록 후에 읽어온다
      $.ajax({
        type: 'GET',
        url: '/toon',
        // title이 뭔지 data를 보내줘야합니다.
        // title_give: title
        data: {},
        success: function (response) {
          // 댓글을 등록할때는 1개 등록
          let name = response['comment'][commentCount]['name'];
          let comment = response['comment'][commentCount]['comment'];

          let temp_html = `<div class="row">
                              <div class="col user-name">${name}</div>
                              <div class="col-9">${comment}</div>
                            </div>`;
          $('#comment_box').prepend(temp_html);
          // 댓글이 하나 늘었습니다.
          commentCount += 1;
          clearValue();
        },
      });
    },
  });
  // 값 초기화
}
function show_comment() {
  $.ajax({
    type: 'GET',
    url: '/toon',
    data: {},
    success: function (response) {
      let rows = response['comment'];
      for (let i = commentCount; i < rows.length; i++) {
        let name = rows[i]['name'];
        let comment = rows[i]['comment'];
        let title = rows[i]['title'];
        // div에 title 정보 추가
        let temp_html = `<div db-title="${title}" class="row">
                          <div class="col user-name">${name}</div>
                          <div class="col-9">${comment}</div>
                        </div>`;

        $('#comment_box').prepend(temp_html);
      }
      // show_comment 선언 후 commentCount에 댓글 갯수저장
      commentCount = rows.length;
    },
  });
}

// input, textarea를 비워주기 위한 함수
function clearValue() {
  let name = document.getElementById('recipient-name');
  let comment = document.getElementById('message-text');

  name.value = null;
  comment.value = null;
}
