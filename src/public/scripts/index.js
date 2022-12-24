const input_URL = document.getElementById('input_URL');
const reset_button = document.getElementById('reset_button');
const submit_button = document.getElementById('submit_button');
const alert = document.getElementById('alert');
const result = document.getElementById('result');
const hash = document.getElementById('hash');
const copy = document.getElementById('copy');
const h2 = document.getElementById('h2');

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
    let data = { url: trim_url(input_URL.value) };
    if (is_valid_url(data.url)) {
        alert.style.display = 'none';
        const res = await fetch('/shorten', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        let val = await res.json();
        h2.textContent ='Shortend URL for ' + input_URL.value;
        hash.textContent = 'http://localhost:3000/' + val.url_res;
        result.style.display = 'block';
    }
    else
        alert.style.display = 'block';
}

reset_button.addEventListener('click', function () { input_URL.value = ''; });
submit_button.addEventListener('click', submit_URL);
copy.addEventListener('click', function () {
    navigator.clipboard.writeText(hash.textContent);
});