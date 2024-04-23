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
    if (url.startsWith('/')) {
        document.getElementById('body').classList.add('leave');
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                console.log('Request successful');

        }
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    } else {
        document.getElementById('body').classList.add('leaveExternal');
    }
    setTimeout(() => {
        if (url.startsWith('/')) {
            window.history.replaceState( {} , 'title', url );
            do {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(xmlHttp.responseText, "text/html");
                    document.getElementById('outer').innerHTML = doc.getElementById('outer').innerHTML;
                    document.body.classList.remove('leave');
                    newpage();
                    break;
                } else {
                    console.error('Request did not succeed before timeout.')
                    if (xmlHttp.status != 200) {
                        if (xmlHttp.status == 404) {
                            alert('Failed to connect: 404 (Page not found)');
                            location.reload();
                            break;
                        }
                        alert('Failed to connect: Error ' + xmlHttp.status);
                        location.reload();
                        break;
                    }
                    if (i == 49) {
                        alert('Failed to connect');
                        location.reload();
                    }
                    new Promise(r => setTimeout(r, 250));
                    i = i + 1;
                }
            } while (i < 50);
        } else {
            window.location.href = url;
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