const params = new URLSearchParams(window.location.search);

window.onload = function() {
    newpage();
    let source = document.querySelector('#sourcelink');
    let sourceClick;
    source.addEventListener('mousedown', () => {
        sourceClick = setTimeout(function () {
            loadPage('/debug', source);
        }, 2500);
    });

    document.addEventListener('mouseup', () => {
        clearTimeout(sourceClick);
    });
  };

function newpage() {
    console.log('New page loaded');
    document.getElementById('source').style.display = '';
    document.getElementById('pfp').style.display = '';
    const buttons = Array.from(document.querySelectorAll('#bottom div button'));
    if (buttons.length == 1) {
        buttons[0].style.borderRadius = '10px';
        buttons[0].parentElement.id = '';
        buttons[0].style.width = '85%';
    } else if (buttons.length <= 3) {
        var i = 0;
        buttons.forEach(button => {
            if (i == 0) {
                button.style.borderTopLeftRadius = '10px';
                button.style.borderBottomLeftRadius = '10px';
            } else if (i == buttons.length - 1) {
                button.style.borderTopRightRadius = '10px';
                button.style.borderBottomRightRadius = '10px';
            }
            i = i + 1;
        });
    }
    if (buttons.length >= 3 && window.innerWidth < 650){
        buttons.forEach(button => {
            button.style.borderRadius = '0px';
        });
    }
    if (params.get('stay') == null) {
        document.getElementById('bottom').style.display = '';
    }
}

function loadPage(url, button) {
    if (typeof url !== 'string') {
        throw new Error('Invalid argument. Expected a string.');
    }
    document.body.classList.remove('enter')
    document.body.classList.remove('enterReverse')
    const oldurl = window.location.pathname;
    // button.innerHTML = 'Loading...';
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
                    document.getElementById('title').innerHTML = doc.getElementById('title').innerHTML;
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
            } while (i < 100);
        } else {
            window.location.href = url;
        }
        // window.location.href = url;
    }, 1100);
    
}
function changePfp() {
    var files = ['/images/pfp.gif', '/images/pfp1.gif', '/images/pfp2.gif', '/images/pfp3.gif']
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