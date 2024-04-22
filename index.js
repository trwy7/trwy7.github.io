function loadPage(url) {
    if (typeof url !== 'string') {
        throw new Error('Invalid argument. Expected a string.');
    }

    document.getElementById('body').classList.add('leave');
    setTimeout(() => {
        window.location.href = url;
    }, 1250);
}