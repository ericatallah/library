window.onload = () => {
    removeAlert();
};

let alertTimeout;

const showAlert = (type, msg) => {
    const alertStr = 
        `<div class="alert alert-${type} fade show" role="alert">
            <strong>${msg}</strong>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>`;

    $('body').prepend(alertStr);
    removeAlert();
};

const removeAlert = () => {
    clearTimeout(alertTimeout);
    alertTimeout = setTimeout(() => {
        $('.alert').alert('close');
    }, 5000);
};

const removeBook = (elem) => {
    const id = +elem.getAttribute('data-bookid');
    
    fetch(`/books/deletebook/${id}`, { method: 'DELETE' }).then(res => res.json()).then(json => {
        console.log('json: ', json);
        $('#removeBookModal').modal('hide');
        showAlert('danger', json.msg);
    });
};

const setDataAttr = (elem) => {
    const id = elem.getAttribute('data-bookid');
    document.getElementById('removeBookConfirm').setAttribute('data-bookid', id);
};
