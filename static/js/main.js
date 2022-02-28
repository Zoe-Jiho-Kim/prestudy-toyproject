'use strict';




//작업중
$('#favorites').on('click', save_favorites);
// comment 저장 함수
function save_favorites() {
  let name = $('#{{recipient-name}}').val();
  let comment = $('#message-text').val();
  let title = titleBucket;

  $.ajax({
    type: 'POST',
    url: '/favorites',
    data: {
      name_give: name,
      comment_give: comment,
      title_give: title,
      time_give: timeString,
    },
  });
}



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
  // Clean input
  clearValue();
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
      viewComments();
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
      viewComments();
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
 * Leave a comment function
 **************************/
// readTitle() 값을 저장해줄 변수 선언
let titleBucket = '';
// 댓글 갯수 저장을 위한 변수 선언
let commentCount = 0;

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
  }
}

// input, textarea를 비워주기 위한 함수
function clearValue() {
  let name = document.getElementById('recipient-name');
  let comment = document.getElementById('message-text');

  if (name.value !== '') {
    name.value = name.getAttribute('value');
    comment.value = null;
  } else {
    name.value = null;
    comment.value = null;
  }
}
//
$('#commentBtn').on('click', save_comment);
// comment 저장 함수
function save_comment() {
  let name = $('#recipient-name').val();
  let comment = $('#message-text').val();
  let title = titleBucket;

  $.ajax({
    type: 'POST',
    url: '/toon',
    data: {
      name_give: name,
      comment_give: comment,
      title_give: title,
      time_give: timeString,
    },
    success: function (response) {
      alert(response['msg']);
      // 댓글을 등록 후에 읽어온다
      $.ajax({
        type: 'POST',
        url: '/toon/comment',
        // title이 뭔지 data를 보내줘야합니다.
        data: { title_give: title },
        success: function (response) {
          // 댓글을 등록할때는 1개 등록
          let name = response['comment'][commentCount]['name'];
          let comment = response['comment'][commentCount]['comment'];
          let timeNow = response['comment'][commentCount]['time'];

          let temp_html = `<div class="row comments">
                            <div class="col-3 user-name">${name}</div>
                            <div class="col-9">${comment}</div>
                            <div class="comment__btn">
                              <div class="comment-time">${timeNow}</div>
                              <!-- <button class="comment__btn--edit">수정</button>
                              <button class="comment__btn--delete">삭제</button>-->
                            </div>
                          </div>`;
          $('#comment_box').prepend(temp_html);
          // 댓글이 하나 늘었습니다.
          commentCount += 1;
          clearValue();
          commentsNumberView();
        },
      });
    },
  });
}

// comment 보는 함수
function viewComments() {
  // 모든 썸네일 버튼 클릭이벤트 생성
  const thumbs = document.querySelectorAll('.thumbnail');

  thumbs.forEach(function (thumbnail) {
    thumbnail.addEventListener('click', show_comment);
  });
  // 댓글을 보여주는 함수
  function show_comment() {
    let title = titleBucket;
    // 이미 생성된 댓글을 깨끗하게 지워줍니다.
    $('.comments').remove();
    // 댓글 갯수를 초기화해줍니다.
    commentCount = 0;

    $.ajax({
      type: 'POST',
      url: '/toon/comment',
      data: { title_give: title },
      success: function (response) {
        let rows = response['comment'];
        for (let i = commentCount; i < rows.length; i++) {
          let name = rows[i]['name'];
          let comment = rows[i]['comment'];
          let timeNow = rows[i]['time'];

          let temp_html = `<div class="row comments">
                            <div class="col-3 user-name">${name}</div>
                            <div class="col-9">${comment}</div>
                            <div class="comment__btn">
                              <div class="comment-time">${timeNow}</div>
                              <!-- <button class="comment__btn--edit">수정</button>
                              <button class="comment__btn--delete">삭제</button>-->
                            </div>
                          </div>`;

          $('#comment_box').prepend(temp_html);
        }
        // show_comment 선언 후 commentCount에 댓글 갯수저장
        commentCount = rows.length;
        commentsNumberView();
      },
    });
  }
}

/*************************
 * Comment box validation
 **************************/
const modalNickname = document.querySelector('#recipient-name');
const modalCommentBox = document.querySelector('#message-text');
const modalCommentBtn = document.querySelector('#commentBtn');

modalCommentBtn.disabled = true;
modalNickname.addEventListener('change', noFunction);
modalCommentBox.addEventListener('change', noFunction);

function noFunction() {
  if (modalNickname.value === '' || modalCommentBox.value === '') {
    modalCommentBtn.disabled = true;
  } else {
    modalCommentBtn.disabled = false;
  }
}
// textarea 엔터키 적용
modalCommentBox.addEventListener('keydown', function (e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    modalCommentBtn.click();
  }
});
// comment창에 키가 입력 될때마다 noFunction을 동작 시킵니다
modalNickname.addEventListener('keyup', noFunction);
modalCommentBox.addEventListener('keyup', noFunction);

/*************************
 * Display comment registration time
 **************************/
const commentToday = new Date();

const year = String(commentToday.getFullYear()).slice(-2);
const month = ('0' + (commentToday.getMonth() + 1)).slice(-2);
const day = ('0' + commentToday.getDate()).slice(-2);

const hours = ('0' + commentToday.getHours()).slice(-2);
const minutes = ('0' + commentToday.getMinutes()).slice(-2);

const timeString = year + '.' + month + '.' + day + ' ' + hours + ':' + minutes;

/*************************
 * Limit the number of comments
 **************************/

function length_check() {
  const desc = $('#message-text').val();
  const nick = $('#recipient-name').val();
  if (desc.length > 100) {
    alert('댓글은 100자를 초과할 수 없습니다.');
    $('#message-text').val(desc.substring(0, 100));
  }
  if (nick.length > 8) {
    alert('닉네임는 8자를 초과할 수 없습니다.');
    $('#recipient-name').val(nick.substring(0, 8));
  }
}
modalCommentBox.addEventListener('keyup', length_check);
modalNickname.addEventListener('keyup', length_check);

/*************************
 * Show the number of comments
 **************************/

function commentsNumberView() {
  const commentsNumber = document.querySelector('.comment__count');

  if (commentCount == 0) {
    commentsNumber.innerHTML =
      '웹툰에 대한' + '<br />' + '의견을 남겨주세요 😍';
  } else {
    commentsNumber.innerHTML = `댓글 수: ${commentCount}개 👍`;
  }
}
/*************************
 * 로그아웃
 **************************/
$(document).ready(function() {
    $('#logout').click(function() {
        $.removeCookie('mytoken');

        alert('로그아웃!')

        window.location.href = '/';
    })
});