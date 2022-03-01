'use strict';

//작업중
$('#favorites').on('click', save_favorites);
// comment 저장 함수
function save_favorites() {
  let title = titleBucket;
  let name = document.querySelector('#useremail').innerHTML;

  $.ajax({
    type: 'POST',
    url: '/favorites',
    data: {
      name_give: name,
      title_give: title,
    },
    success: function (response) {
      alert(response['msg']);
    },
  });
}


//////////////////////////////////////////////////
$(document).ready(function () {
  list();
});

function list() {
  $.ajax({
    type: 'GET',
    url: '/favoritelist',
    data: {},
  });
}