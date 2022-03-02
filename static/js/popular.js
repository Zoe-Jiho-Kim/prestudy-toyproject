'use strict';
const popularBtn = document.querySelector('.popular__btn');

popularBtn.addEventListener('click', popularArray);

function popularArray() {
  $.ajax({
    type: 'GET',
    url: '/popular',
    data: {},
    success: function (response) {
      $('#thumbnail-box').empty();
      let rows = response['comment'];
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
      moreBtn.removeEventListener('click', morebtn);
      moreBtn.addEventListener('click', morebtnPopular);
    },
  });
}

function morebtnPopular() {
  $.ajax({
    type: 'GET',
    url: '/popular',
    data: {},
    success: function (response) {
      let rows = response['comment'];

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
      (function clickCounter() {
        btnCount += 1;
      })();
      readTitle();
      viewComments();
    },
  });
}
