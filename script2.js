const herosList = document.getElementById("favSuperhero-list");
let isFav;
var storedList;
var listToRender;
setInterval(()=>{
    storedList = getStoredData();
    listToRender = storedList;
}, 1)

function getStoredData() {
    const storedDataString = localStorage.getItem("list");
    const storedData = JSON.parse(storedDataString);
    return storedData;
}

function maintainFavoritesList(list) {
    favList = [];
    list.forEach((item)=>{
        if(item.isFav !== false){
            favList.push(item);
        }
    });

    updateLocalStorage(favList);
}

function updateLocalStorage(list) {
    const dataString = JSON.stringify(list);
    getStoredData();
    localStorage.setItem("list", dataString);
}

function handleClickEvent(e) {
    const targetId = e.target.id;
    if (targetId === "home") {
        homepageActive = true;
        getSuperHeros();
    } else if (targetId === "heart-img") {
        toggleFavProperty(e);
        updateLocalStorage(listToRender);
    }
}


function toggleFavProperty(e) {
    const selectedCharacterId = e.target.dataset.targetid;
    listToRender.forEach((item) => {
        if (item.id === Number(selectedCharacterId)) {
            item.isFav = !item.isFav;
        }
    })
}



function renderList(storedList) {
    herosList.innerHTML = "";
    storedList.forEach((item) => {
        const li = document.createElement("li");
        li.id = item.id;
        if (item.isFav === true) {
            li.innerHTML = `<a href="superhero.html" id="${item.id}" class=
            "heroItem"><h3>${item.name}</h3></a><img id="heart-img" data-targetid = "${item.id}" type="button" src="static/red-heart.svg" alt="">`;
        } else {
            li.innerHTML = `<a href="superhero.html" id="${item.id}" class="heroItem"><h3>${item.name}</h3></a><img id="heart-img" data-targetid = "${item.id}" type="button" src="static/white-heart.svg" alt="">`;
        }
        // li.innerHTML = `${item.name} <button id="LikeBtn" data-targetId ="${item.id}" type="button"><img id="heart-img" type="button" src="static/${favToggle}.svg" alt=""></button>`;
        li.className = "SL-item";

        herosList.appendChild(li);
    })
}

function initialize() {
    document.addEventListener("click", (e) => {
        handleClickEvent(e);
    })

    setInterval(() => {
        maintainFavoritesList(listToRender);
        renderList(storedList);
    }, 250);
}

initialize();

