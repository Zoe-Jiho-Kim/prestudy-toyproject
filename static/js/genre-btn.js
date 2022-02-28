'use strict';

// genre를 담아줄 변수 선언
let genreBucket = '';

// 장르를 구하기위한 변수 선언
const genres = document.querySelectorAll('.genre__content--btn');

genres.forEach(function (genre) {
  genre.addEventListener('click', clickGenreBtn);
  genre.addEventListener('click', genre_listing);
});

function clickGenreBtn(e) {
  let genre = e.currentTarget.getAttribute('data-genre');
  // genreBucket에 genre값을 넣어줍니다
  genreBucket = genre;
}

// genre를 보내주는 함수
function genre_listing() {
  let genre = genreBucket;
  console.log(genre);

  $.ajax({
    type: 'POST',
    url: '/webtoons/genre',
    // genre가 뭔지 data를 보내줘야합니다.
    data: { genre_give: genre },
    success: function (response) {
      console.log(response);
    },
  });
}
