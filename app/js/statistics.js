var json;

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        // Typical action to be performed when the document is ready:
        json = JSON.parse(xhttp.responseText);
    }
}

function get(season, sort) {
    xhttp.open("GET", "https://us-central1-test-f1kaapo.cloudfunctions.net/scoretable?season=" + season + "&sort=" + sort, false);
    return xhttp.send();
}

var urlParams = new URLSearchParams(window.location.search);

let year = new Date();

let season = urlParams.has('season') ? urlParams.get('season') : year.getFullYear();
let sort = urlParams.has('sort') ? urlParams.get('sort') : 'totalscore';

get(season, sort);

function addStats(user) {
    let row = `<tr><td>${user.userid}</td><td>${user.qlpoints}</td><td>${user.gppoints}</td><td>${user.totalscore}</td></tr>`;
    stats.insertAdjacentHTML("beforeend", row);
}

const seasonchooser = document.querySelector('#season');
seasonchooser.selectedIndex = year.getFullYear() - season;

const headertext = document.querySelector('#headertext');
headertext.insertAdjacentText("beforeend", " (" + season + ")");

const stats = document.querySelector('.stats');
let url = location.href.replace(location.search, '') + "?season=" + season;
let header = '<tr><th>Name</th><th><a href="' + url + '&sort=qlpoints">QL Points</a></th> ' 
    + '<th><a href="' + url + '&sort=gppoints">GP Points</a></th><th><a href="' + url + '&sort=totalscore">Total Score</a></th></tr>';
stats.insertAdjacentHTML("beforeend", header);

for (let i = 0; i < json.length; i++) addStats(json[i]);

// Remove if you don't like=) This is the future proof method to make copy
const copy = document.querySelector('.copy');
const start = 2018;
start === year.getFullYear() ? year = year.getFullYear() : year = `${start}–${year.getFullYear()}`;
const content = document.createTextNode(`Ⓒ ${year}, back-end: VRS77, front-end: ATA `);
copy.appendChild(content);