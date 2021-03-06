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
// readTitle() ?????? ???????????? ?????? ??????
let titleBucket = '';
// ?????? ?????? ????????? ?????? ?????? ??????
let commentCount = 0;

// thunmbnail??? title??? ???????????? ?????? ?????????.
function readTitle() {
  // title ????????? ?????? ?????? ??????
  const thumbnails = document.querySelectorAll('.thumbnail');

  thumbnails.forEach(function (thumbnail) {
    thumbnail.addEventListener('click', clickThumb);
  });

  function clickThumb(e) {
    let title = e.currentTarget.getAttribute('data-bs-whatever');
    // titleBucket??? title?????? ???????????????
    titleBucket = title;
  }
}

// input, textarea??? ???????????? ?????? ??????
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
// comment ?????? ??????
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
      // ????????? ?????? ?????? ????????????
      $.ajax({
        type: 'POST',
        url: '/toon/comment',
        // title??? ?????? data??? ?????????????????????.
        data: { title_give: title },
        success: function (response) {
          // ????????? ??????????????? 1??? ??????
          let name = response['comment'][commentCount]['name'];
          let comment = response['comment'][commentCount]['comment'];
          let timeNow = response['comment'][commentCount]['time'];

          let temp_html = `<div class="row comments">
                            <div class="col-3 user-name">${name}</div>
                            <div class="col-9">${comment}</div>
                            <div class="comment__btn">
                              <div class="comment-time">${timeNow}</div>
                            </div>
                          </div>`;
          $('#comment_box').prepend(temp_html);
          // ????????? ?????? ???????????????.
          commentCount += 1;
          clearValue();
          commentsNumberView();
        },
      });
    },
  });
}

// comment ?????? ??????
function viewComments() {
  // ?????? ????????? ?????? ??????????????? ??????
  const thumbs = document.querySelectorAll('.thumbnail');

  thumbs.forEach(function (thumbnail) {
    thumbnail.addEventListener('click', show_comment);
  });
  // ????????? ???????????? ??????
  function show_comment() {
    let title = titleBucket;
    // ?????? ????????? ????????? ???????????? ???????????????.
    $('.comments').remove();
    // ?????? ????????? ?????????????????????.
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
                            </div>
                          </div>`;

          $('#comment_box').prepend(temp_html);
        }
        // show_comment ?????? ??? commentCount??? ?????? ????????????
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
// textarea ????????? ??????
modalCommentBox.addEventListener('keydown', function (e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    modalCommentBtn.click();
  }
});
// comment?????? ?????? ?????? ???????????? noFunction??? ?????? ????????????
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
    alert('????????? 100?????? ????????? ??? ????????????.');
    $('#message-text').val(desc.substring(0, 100));
  }
  if (nick.length > 8) {
    alert('???????????? 8?????? ????????? ??? ????????????.');
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
      '????????? ??????' + '<br />' + '????????? ??????????????? ????';
  } else {
    commentsNumber.innerHTML = `?????? ???: ${commentCount}??? ????`;
  }
}
/*************************
 * ????????????
 **************************/
$(document).ready(function () {
  $('#logout').click(function () {
    $.removeCookie('mytoken');

    alert('????????????!');

    window.location.href = '/';
  });
});

/////////////// ??????
document.addEventListener('DOMContentLoaded', () => {
  naviEffect();
});

//?????? ?????? ?????? ??????
function naviEffect() {
  const mainMenu = document.querySelector('#memberinfo>li');
  const memberBox = document.querySelector('#memberBox');

  (function initEvent() {
    mainMenu.addEventListener('mouseenter', () => {
      memberBox.style.display = 'block';
    });
    mainMenu.addEventListener('mouseleave', () => {
      memberBox.style.display = 'none';
    });
  })(); //initEvent
} //naviEffect
