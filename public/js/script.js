require('../css/style.css');
const Utilities = require('../js/utilities');

window.onload = () => {
    Utilities.removeAlert();
};

// todo eric: need to remove onclick attribute and set a jquery click event to call this function instead..
const removeBook = (elem) => {
    const id = +elem.getAttribute('data-bookid');
    
    fetch(`/books/deletebook/${id}`, { method: 'DELETE' }).then(res => res.json()).then(json => {
        $('#removeBookModal').modal('hide');
        Utilities.showAlert('danger', json.msg, () => {window.location.reload(true);});
    });
};

const setDataAttr = (elem) => {
    const id = elem.getAttribute('data-bookid');
    document.getElementById('removeBookConfirm').setAttribute('data-bookid', id);
};

const getBookInfo = async elem => {
    Utilities.showLoader();
    const bookData = await fetch(`/books/getbookinfo?query=${elem.getAttribute('data-query')}`).then(res => res.json());
    
    if (!bookData.data) {
        Utilities.showAlert('danger', bookData.msg);
        Utilities.showLoader();
        return false;
    }

    const title = bookData.data.volumeInfo.title || '';
    const subtitle = bookData.data.volumeInfo.subtitle || '';
    const imageUrl = bookData.data.volumeInfo.imageLinks ? bookData.data.volumeInfo.imageLinks.smallThumbnail || '' : false;
    const publishedDate = bookData.data.volumeInfo.publishedDate || '';
    const pageCount = bookData.data.volumeInfo.pageCount || '';
    const description = bookData.data.volumeInfo.description || '';
    const categories = bookData.data.volumeInfo.categories ? bookData.data.volumeInfo.categories.join(', ') : '';
    const authors = bookData.data.volumeInfo.authors ? bookData.data.volumeInfo.authors.join(', ') : '';

    Utilities.bookDetailsModal.find('.modal-title').text(`${title} ${subtitle}`);
    Utilities.bookDetailsModal.find('.modal-body').html(`
        <div class="flex">
            <img src="${imageUrl ? imageUrl : Utilities.defaultBookImage}" alt="Book Cover" />
            <div class="book-details-container">
                <p><strong>Published:</strong> ${publishedDate}</p>
                <p><strong>Pages:</strong> ${pageCount}</p>
                <p><strong>Categories:</strong> ${categories}</p>
                <p><strong>Categories:</strong> ${authors}</p>
            </div>
        </div>
        <p>${description}</p>
    `);
    
    Utilities.showLoader();
    Utilities.bookDetailsModal.modal('show');
};

$('#get-book-info').on('click', '.get-book-info', (e) => {
    getBookInfo(e.target);
});

$('#book-cards-list').on('click', '.get-book-info', (e) => {
    getBookInfo(e.target);
});