const displayData = (data) => {
    console.log('got data: ', data);

    if (!data.fail) {
        data.then(res => {
            console.log('got data: ', res);
        });
    } else {
        document.getElementById('search-fail').innerHTML = `<div class="alert alert-danger" role="alert">${data.msg}</div>`;
    }
    
};

const removeBook = (elem) => {
    const id = +elem.getAttribute('data-bookid');
    console.log('wtf: ', id);
    //<div class="alert alert-danger" role="alert">{{error}}</div>
    const searchFail = document.getElementById('search-fail');
    const removeBookAlert = document.getElementById('removeBookAlert');
    fetch(`/books/deletebook/${id}`).then(res => res.json()).then(json => {
        console.log('json: ', json);
        removeBookAlert.alert('show');
    });
};

const setDataAttr = (elem) => {
    const id = elem.getAttribute('data-bookid');
    document.getElementById('removeBookConfirm').setAttribute('data-bookid', id);
};
