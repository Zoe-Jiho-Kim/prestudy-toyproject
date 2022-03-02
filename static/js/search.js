'use strict';
const searchInput = document.querySelector('#input_kw');

function search() {
  let keyword = $('#input_kw').val();
  // console.log(keyword)

  if (keyword == '') {
    alert('검색어를 입력하세요.');
    return;
  } else if (keyword.length < 2) {
    alert('두 글자 이상 입력 해주세요.');
    return;
  } else if (/[^가-힣0-9a-zA-Z ]/.test(keyword) == true) {
    alert('검색은 특수문자를 포함할 수 없습니다.');
    return;
  } else {
    // $('#thumbnail-box').empty();
    moreBtn.className = 'blind';
    $.ajax({
      type: 'POST',
      url: '/searchToons',
      data: {
        give_keyword: keyword,
      },
      success: function (response) {
        // debugger;
        console.log(response);
        let searched_wt = response['searched_webtoons'];
        // 검색창을 비워줍니다
        searchInput.value = null;

        $('#thumbnail-box').empty();
        //console.log(typeof searched_wt);
        //console.log(searched_wt.findIndex);
        //if (!searched_wt[0]['title'])
        for (let i = 0; i < searched_wt.length; i++) {
          let title = searched_wt[i]['title'];
          let body = searched_wt[i]['body'].replace(/\"/gi, "'"); // Change double quotes to single quotes
          let img = searched_wt[i]['img'];
          let writer = searched_wt[i]['writer'];
          let url = searched_wt[i]['url'];
          let star = searched_wt[i]['star'];
          let genre = searched_wt[i]['genre'];

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
}
