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
/*
document.getElementById('search-books-submit').addEventListener('click', e => {
    const searchStr = document.getElementById('book-search').value;
    console.log('wtf: ', searchStr);

    const data = searchStr ? fetch(`/books/searchbooks?s=${searchStr}`).then(data => data.json()) : { fail: true, msg: 'Please enter a search term first.' };
    displayData(data);
});
*/