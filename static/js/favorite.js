'use strict';

//작업중

//////////////////////////////////////////////////
$(document).ready(function () {
  list();
});

function list() {
  $('#thumbnail-box').empty();
  moreBtn.className = 'blind';
  $.ajax({
    type: 'GET',
    url: '/favoritelist',
    data: {},
    success: function (response) {
      let rows = response['favorites'];
      for (let i = 0; i < rows.length; i++) {
        let title = rows[i]['title'];

        $.ajax({
          type: 'POST',
          url: '/favoritelist',
          data: { title_give: title },
          success: function (response) {
            let rows = response['webtoons'][0];

            let title = rows['title'];
            let body = rows['body'].replace(/\"/gi, "'"); // Change double quotes to single quotes
            let img = rows['img'];
            let writer = rows['writer'];
            let url = rows['url'];
            let star = rows['star'];
            let genre = rows['genre'];
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

            readTitle();
            viewComments();
          },
        });
      }
    },
  });
}
