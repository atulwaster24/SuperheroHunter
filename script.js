var storedList = getStoredData();
const herosList = document.getElementById("SuperHero-list");
const searchInput = document.getElementById("SearchInput");
const searchButton = document.getElementById("search-img");
const heroItems = document.getElementsByClassName("heroItem");
var superheroObj = {};

var list = [];
var favList;
let isFav;

async function getSuperHeros() {
    const response = await fetch("https://gateway.marvel.com:443/v1/public/characters?limit=25&&ts=1&apikey=beec1ed7ad29e816e11b5f16342b2574&hash=dd9294f9fdbd0a1639af3a46ef94773c");
    const data = await response.json();

    const responseData = data.data.results;
    list = responseData;
    // console.log(list);
    addFavouriteButton(list);

    list.forEach((item) => {
        const foundInStoredList = storedList.find((storedItem) => storedItem.id === item.id);

        if (foundInStoredList) {
            item.isFav = true;
        } else {
            item.isFav = false;
        }
    })

    setInterval(() => { maintainFavoritesList(list) }, 1000);
    // maintainFavoritesList(list);
    // // console.log(list)
    setInterval(() => { renderList(list) }, 1000);
}

function addFavouriteButton(list) {
    list.forEach((item) => {
        item.isFav = false;
    })
}

function maintainFavoritesList(list) {
    favList = list.filter(item => item.isFav === true);
    // console.log(favList);
    updateLocalStorage(favList);
}

async function fetchDetails(heroId){
    const response = await fetch(`https://gateway.marvel.com:443/v1/public/characters/${heroId}?limit=25&&ts=1&apikey=beec1ed7ad29e816e11b5f16342b2574&hash=dd9294f9fdbd0a1639af3a46ef94773c`);

    const responseData = await response.json();
    

    console.log(responseData.data.result);
}

function renderList(list) {
    herosList.innerHTML = "";
    list.forEach((item) => {
        const li = document.createElement("li");
        // const img = document.createElement('img');
        li.id = item.id;
        if (item.isFav === true) {
            li.innerHTML = `<a href="superhero.html" target="_blank" id="heroId" class=
            "heroItem" ><h3 data-targetId ="${item.id}">${item.name}</h3></a><img id="heart-img" data-targetid = "${item.id}" type="button" src="static/red-heart.svg" alt="">`;
        } else {
            li.innerHTML = `<a href="superhero.html" id="heroId" target="_blank" class="heroItem" ><h3 data-targetId ="${item.id}">${item.name}</h3></a><img id="heart-img" data-targetid = "${item.id}" type="button" src="static/white-heart.svg" alt="">`;
        }
        li.className = "SL-item";

        herosList.appendChild(li);
    })
}

function handleClickEvent(e) {
    const targetId = e.target.id;
    if (targetId === "home") {

        homepageActive = true;
        getSuperHeros();
    } else if (targetId === "heart-img") {
        toggleFavProperty(e);
        updateLocalStorage(favList);
    }
    else if(targetId === "heroId"){
        fetchDetails(e.target.dataset.targetId);
    }
}


function updateLocalStorage(list) {
    const dataString = JSON.stringify(list);
    localStorage.setItem("list", dataString);
}

function getStoredData() {
    const storedDataString = localStorage.getItem("list");
    const storedData = JSON.parse(storedDataString);
    return storedData;
}


function toggleFavProperty(e) {
    const selectedCharacterId = e.target.dataset.targetid;
    list.forEach((item) => {
        if (item.id === Number(selectedCharacterId)) {
            item.isFav = !item.isFav;
        }
    })
}

function handleSearchInput() {
    const searchStr = searchInput.value;

    searchSuperHero(searchStr);
}

async function searchSuperHero(input) {
    const response = await fetch(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${input}&&ts=1&apikey=beec1ed7ad29e816e11b5f16342b2574&hash=dd9294f9fdbd0a1639af3a46ef94773c`);

    const searchedData = await response.json();

    list = searchedData.data.results;
    renderList(list);
}

function initialize() {
    document.addEventListener("click", (e) => {
        console.log(e);
        handleClickEvent(e);
    })

    getSuperHeros();

    searchButton.addEventListener("click", () => {
        handleSearchInput();
    })
}

initialize();

