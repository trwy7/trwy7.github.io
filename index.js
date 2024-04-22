window.onload = function() {
    newpage();
  };

function newpage() {
    console.log('New page loaded');
}

function loadPage(url) {
    if (typeof url !== 'string') {
        throw new Error('Invalid argument. Expected a string.');
    }
    // button.innerHTML = 'Loading...';
    document.getElementById('body').classList.add('leave');
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            console.log('Request successful');

    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
    setTimeout(() => {
        window.history.replaceState( {} , 'title', url );
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(xmlHttp.responseText, "text/html");
            document.getElementById('outer').innerHTML = doc.getElementById('outer').innerHTML;
            document.body.classList.remove('leave');
            newpage();
        } else {
            console.error('Request did not succeed before timeout.')
            alert('Failed to connect');
            location.reload();
        }
        // window.location.href = url;
    }, 1250);
    
}
function getBrowser() {
    const userAgent = navigator.userAgent;

    if (userAgent.match(/chrome|chromium|crios/i)) {
        return 'Chrome';
    } else if (userAgent.match(/firefox|fxios/i)) {
        return 'Firefox';
    } else if (userAgent.match(/safari/i)) {
        return 'Safari';
    }
    return 'Unknown';
}