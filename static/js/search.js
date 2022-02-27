'use strict';
function search() {
    let keyword = $('#input_kw').val();

    if (keyword == "") {
        alert("검색어를 입력하세요.")
    } else if (keyword.length < 2) {
        alert("두 글자 이상 입력 해주세요.")
    } else if (/[^가-힣0-9a-zA-Z ]/.test(keyword) == true) {
        alert("검색은 특수문자를 포함할 수 없습니다.")
    }

    // $.ajax({
    //     type: 'POST',
    //     url: '/search',
    //     data: {},
    //     success: function (response) {
    //         console.log(response)
    //         // alert(response['msg']);
    //         // window.location.replace("/results")
    //     },

    // });
}


