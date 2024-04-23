window.onload = function() {
    newpage();
  };

function newpage() {
    console.log('New page loaded');
}

function loadPage(url, button) {
    if (typeof url !== 'string') {
        throw new Error('Invalid argument. Expected a string.');
    }
    document.body.classList.remove('enter')
    document.body.classList.remove('enterReverse')
    const oldurl = window.location.pathname;
    // button.innerHTML = 'Loading...';
    console.log(button.innerHTML)
    if (url.startsWith('/')) {
        if (button.innerHTML == '<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i> Back') {
            document.getElementById('body').classList.add('leaveReverse');
        } else {
            document.getElementById('body').classList.add('leave');
        }
        
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
    setTimeout(async () => {
        if (url.startsWith('/')) {
            let i = 0
            do {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    document.body.classList.remove('loading');
                    window.history.replaceState( {} , 'title', url );
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(xmlHttp.responseText, "text/html");
                    document.getElementById('outer').innerHTML = doc.getElementById('outer').innerHTML;
                    if (button.innerHTML == '<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i> Back') {document.body.classList.add('enterReverse');} else {document.body.classList.add('enter');}
                    document.body.classList.remove('leave');
                    document.body.classList.remove('leaveReverse');
                    newpage();
                    break;
                } else {
                    document.body.classList.add('loading');
                    if (xmlHttp.status != 200 && xmlHttp.readyState == 4) {
                        if (xmlHttp.status == 404) {
                            alert('Failed to connect: 404 (Page not found)');
                            if (button.innerHTML == '<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i> Back') {document.body.classList.add('enterReverse');} else {document.body.classList.add('enter');};
                            document.body.classList.remove('leave');
                            document.body.classList.remove('leaveReverse');
                            document.body.classList.remove('loading');
                            console.error('404 while loading page')
                            break;
                        }
                        alert('Failed to connect: Error ' + xmlHttp.status);
                        if (button.innerHTML == '<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i> Back') {document.body.classList.add('enterReverse');} else {document.body.classList.add('enter');};
                        document.body.classList.remove('leave');
                        document.body.classList.remove('leaveReverse');
                        document.body.classList.remove('loading');
                        console.error('Error while loading page')
                        break;
                    }
                    if (i == 49) {
                        console.error('Request did not succeed before timeout.')
                        alert('Failed to connect');
                        if (button.innerHTML == '<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i> Back') {document.body.classList.add('enterReverse');} else {document.body.classList.add('enter');};
                        document.body.classList.remove('leave');
                        document.body.classList.remove('leaveReverse');
                        document.body.classList.remove('loading');
                        break;
                    }
                    await new Promise(r => setTimeout(r, 250));
                    i = i + 1;
                }
            } while (i < 50);
        } else {
            window.location.href = url;
        }
        // window.location.href = url;
    }, 1100);
    
}
function changePfp() {
    var files = ['images/pfp.gif', 'images/pfp1.gif', 'images/pfp2.gif', 'images/pfp3.gif']
    var img = document.getElementById('pfp').style.backgroundImage.replace('url("', '').replace('")', '');
    document.getElementById('pfp').style.backgroundImage = 'url("' + files[files[files.indexOf(img) + 1] != undefined ? files.indexOf(img) + 1 : 0] + '")';
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