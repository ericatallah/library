let alertTimeout;
const bookDetailsModal = $('#bookDetailsModal');
const loadingSpinner = document.getElementById('loadingSpinner');
const defaultBookImage = '/static/img/don_quixote.jpg';

window.onload = () => {
    removeAlert();
};

const showLoader = () => {
    loadingSpinner.classList.toggle('show');
};

const showAlert = (type, msg, callback) => {
    const alertStr = 
        `<div class="alert alert-${type} fade show" role="alert">
            <strong>${msg}</strong>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>`;

    $('body').prepend(alertStr);
    removeAlert(callback);
};

const removeAlert = callback => {
    clearTimeout(alertTimeout);
    alertTimeout = setTimeout(() => {
        $('.alert').alert('close');
        if (callback) callback();
    }, 5000);
};

const removeBook = (elem) => {
    const id = +elem.getAttribute('data-bookid');
    
    fetch(`/books/deletebook/${id}`, { method: 'DELETE' }).then(res => res.json()).then(json => {
        $('#removeBookModal').modal('hide');
        showAlert('danger', json.msg, () => {window.location.reload(true);});
    });
};

const setDataAttr = (elem) => {
    const id = elem.getAttribute('data-bookid');
    document.getElementById('removeBookConfirm').setAttribute('data-bookid', id);
};

const getBookInfo = async elem => {
    showLoader();
    const bookData = await fetch(`/books/getbookinfo?query=${elem.getAttribute('data-query')}`).then(res => res.json());
    
    if (!bookData.data) {
        showAlert('danger', bookData.msg);
        showLoader();
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

    bookDetailsModal.find('.modal-title').text(`${title} ${subtitle}`);
    bookDetailsModal.find('.modal-body').html(`
        <div class="flex">
            <img src="${imageUrl ? imageUrl : defaultBookImage}" alt="Book Cover" />
            <div class="book-details-container">
                <p><strong>Published:</strong> ${publishedDate}</p>
                <p><strong>Pages:</strong> ${pageCount}</p>
                <p><strong>Categories:</strong> ${categories}</p>
                <p><strong>Categories:</strong> ${authors}</p>
            </div>
        </div>
        <p>${description}</p>
    `);
    
    showLoader();
    $('#bookDetailsModal').modal('show');
};