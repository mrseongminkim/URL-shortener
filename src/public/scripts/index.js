const input_URL = document.getElementById('input_URL');
const reset_button = document.getElementById('reset_button');
const submit_button = document.getElementById('submit_button');
const alert = document.getElementById('alert');
const result = document.getElementById('result');
const hash = document.getElementById('hash');
const copy = document.getElementById('copy');

function is_valid_url(url) {
    let valid_format = new RegExp(
        '^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$', 'i');
    return valid_format.test(url);
}

function trim_url(url) {
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '');
}

async function submit_URL(event) {
    const data = { url: trim_url(input_URL.value) };
    if (is_valid_url(data.url)) {
        alert.style.visibility = 'hidden';
        const res = await fetch('/shorten', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (res.ok) {
            let data = await res.json();
            hash.textContent = 'http://localhost:3000/' + data.url_res;
            result.style.visibility = 'visible';
        }
        else {
            alert.style.visibility = 'visible';
        }
    }
    else {
        alert.style.visibility = 'visible';
    }
}

reset_button.addEventListener('click', function () { input_URL.value = ''; console.log('test') });
submit_button.addEventListener('click', submit_URL);
copy.addEventListener('click', function () {
    navigator.clipboard.writeText(hash.textContent);
});