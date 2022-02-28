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

    $('#thumbnail-box').empty();

    $.ajax({
        type: 'POST',
        url: '/webtoons/genre',
        // genre가 뭔지 data를 보내줘야합니다.
        data: {genre_give: genre},
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
        }
    });
}
