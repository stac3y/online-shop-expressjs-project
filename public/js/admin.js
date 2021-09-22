const deleteProduct = (btn) => {
    const productId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    fetch(`product/${productId}`, {
        method: "DELETE",
        headers: {
            'csrf-token': csrf
        }
    })
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        });
}