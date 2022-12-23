const input_URL = document.getElementById('input_URL');
const reset_button = document.getElementById('reset_button');
const submit_button = document.getElementById('submit_button');


//url 체크는 여기서 이루어짐
async function submit_URL(event) {
    const data = {url: input_URL.value};
    const res = await fetch('/shorten', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
    if (res.ok) {
        let data = await res.json();
        
        console.log(data);
    }
    else {
        console.log("shoot");
    }
}

//reset_button.addEventListener('click', function() {input_URL.value=''; console.log('test')});
reset_button.addEventListener('click', function() {console.log('working')});
submit_button.addEventListener('click', submit_URL);