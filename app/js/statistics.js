var json = [{
    "userid": "juha",
    "totalscore": 152,
    "qlpoints": 92,
    "gppoints": 60
}, {
    "userid": "markus",
    "totalscore": 146,
    "qlpoints": 100,
    "gppoints": 46
}, {
    "userid": "niki",
    "totalscore": 118,
    "qlpoints": 61,
    "gppoints": 57
}, {
    "userid": "juki",
    "totalscore": 117,
    "qlpoints": 64,
    "gppoints": 53
}, {
    "userid": "jari",
    "totalscore": 115,
    "qlpoints": 68,
    "gppoints": 47
}, {
    "userid": "noppa",
    "totalscore": 106,
    "qlpoints": 71,
    "gppoints": 35
}, {
    "userid": "ilkka",
    "totalscore": 93,
    "qlpoints": 47,
    "gppoints": 46
}, {
    "userid": "jukka",
    "totalscore": 93,
    "qlpoints": 45,
    "gppoints": 48
}, {
    "userid": "toni",
    "totalscore": 92,
    "qlpoints": 55,
    "gppoints": 37
}, {
    "userid": "unzki",
    "totalscore": 92,
    "qlpoints": 57,
    "gppoints": 35
}, {
    "userid": "kari",
    "totalscore": 91,
    "qlpoints": 43,
    "gppoints": 48
}, {
    "userid": "kake",
    "totalscore": 87,
    "qlpoints": 46,
    "gppoints": 41
}, {
    "userid": "johan",
    "totalscore": 71,
    "qlpoints": 62,
    "gppoints": 9
}, {
    "userid": "lauri",
    "totalscore": 70,
    "qlpoints": 45,
    "gppoints": 25
}, {
    "userid": "petri",
    "totalscore": 64,
    "qlpoints": 49,
    "gppoints": 15
}];

function addStats(user) {
    let row = `<tr><td>${user.userid}</td><td>${user.qlpoints}</td><td>${user.gppoints}</td><td>${user.totalscore}</td></tr>`;
    stats.insertAdjacentHTML("beforeend", row);
}

const stats = document.querySelector('.stats');
let header = '<tr><th>Name</th><th>QL Points</th><th>GP Points</th><th>Total Score</th></tr>';
stats.insertAdjacentHTML("beforeend", header);

for (let i = 0; i < json.length; i++) addStats(json[i]);

// Remove if you don't like=) This is the future proof method to make copy
const copy = document.querySelector('.copy');
const start = 2018;
let year = new Date();
start === year.getFullYear() ? year = year.getFullYear() : year = `${start}–${year.getFullYear()}`;
const content = document.createTextNode(`Ⓒ ${year}, back-end: Nesc, front-end: ATA `);
copy.appendChild(content);