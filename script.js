let pokemons = [];
let next20 = "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20";
let currentImageIndex;

const typeIcons = {
    bug: "img/icons/bug.webp",
    dark: "img/icons/dark.webp",
    dragon: "img/icons/dragon.webp",
    electric: "img/icons/electric.webp",
    fairy: "img/icons/fairy.webp",
    fighting: "img/icons/fighting.webp",
    fire: "img/icons/fire.webp",
    flying: "img/icons/flying.webp",
    ghost: "img/icons/dark.webp",
    grass: "img/icons/grass.webp",
    ground: "img/icons/ground.webp",
    ice: "img/icons/ice.webp",
    normal: "img/icons/normal.webp",
    poison: "img/icons/poison.webp",
    psychic: "img/icons/psychic.webp",
    rock: "img/icons/rock.webp",
    steel: "img/icons/steel.webp",
    water: "img/icons/water.webp",
  };

async function init() {
  await getPokemons();
  displayPokemons();
}

async function getPokemons() {
  let response = await fetch(next20);
  let responseAsJson = await response.json();
  next20 = responseAsJson.next;
  let results = responseAsJson["results"];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    let url = result.url;
    await getPokeData(url);
  }
}

async function getPokeData(url) {
  let dataResponse = await fetch(url);
  let dataResponseJson = await dataResponse.json();
  pokemons.push(dataResponseJson);
}

function displayPokemons() {
  let cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";

  for (let i = 0; i < pokemons.length; i++) {
    const pokemon = pokemons[i];
    let name = pokemon.name;
    let type1 = pokemon.types[0].type.name;
    let type2 = pokemon.types[1]?.type?.name;
    let type3 = pokemon.types[2]?.type?.name;
    let types = [type1, type2, type3].filter(Boolean);
    let image = pokemon.sprites.other.dream_world.front_default;

    cardContainer.innerHTML += `
            <div class="card-small" onclick="openCard(${i})">
                <div class="header-card-sm">
                    <span class="id">#${pokemon.id}</span>
                    <h2>${name}</h2>
                </div>
                <div class="img-container ${type1}">
                    <img class="poke-img-sm" src=${image}>
                </div>
                <div class="footer-card-sm"></div>
            </div>
    `;
    displayFooter(i, types);
  }
}

function displayFooter(i, types) {
  let cardFooter = document.querySelectorAll(".footer-card-sm")[i];
  cardFooter.innerHTML = types
    .map((type) => `<img class="type-icon" src="${typeIcons[type]}">`)
    .join("");
}


function openCard(i) {
    let dialog = document.getElementById("dialog");
    let pokemon = pokemons[i];
    let type1 = pokemon.types[0].type.name;
    let type2 = pokemon.types[1]?.type?.name;
    let type3 = pokemon.types[2]?.type?.name;
    let types = [type1, type2, type3].filter(Boolean);
    let image = pokemon.sprites.other.dream_world.front_default;

  dialog.classList.remove("d-none");
  document.getElementById("opened-card").innerHTML += `
        <div class="header-card-l">
            <span class="id">#${pokemon.id}</span>
            <h2>${pokemon.name}</h2>
        </div>
        <div class="img-container ${type1}">
            <img class="poke-img-l" src=${image}>
        </div>
        <div class="stats" id="stats"></div>
        <div class="footer-card-l"></div>
    `;
    displayFooterLarge(i, types);
    displayStats(i);
    currentImageIndex = i;
}


function displayStats(i){
    const pokemon = pokemons[i];
    let hp = pokemon.stats[0].base_stat;
    let attack = pokemon.stats[1].base_stat;
    let defense = pokemon.stats[2].base_stat;

    document.getElementById('stats').innerHTML += `
        <table>
             <tr><td>HP</td><td>${hp}</td></tr>
             <tr><td>Attack</td><td>${attack}</td></tr>
             <tr><td>Defense</td><td>${defense}</td></tr>        
        </table>
        <div class="stats-bars">
            <div class="stats-bar" style="width: ${hp}%;"></div>
            <div class="stats-bar" style="width: ${attack}%;"></div>
            <div class="stats-bar" style="width: ${defense}%;"></div>
        </div>
     `;
}


function displayFooterLarge(i, types) {  
    let cardFooter = document.querySelector(".footer-card-l");
    cardFooter.innerHTML = types
      .map((type) => `<img class="type-icon" src="${typeIcons[type]}">`)
      .join("");
  }


function closeImage(){
    let dialog = document.getElementById('dialog');
    document.getElementById('opened-card').innerHTML = '';
    dialog.classList.add('d-none');
}


function nextImage(){
    document.getElementById("opened-card").innerHTML = '';
    if(currentImageIndex < pokemons.length-1){
        currentImageIndex++;
        openCard(currentImageIndex);
    } else {
        openCard(0)
    }
}


function previousImage(){
    let lastImageIndex = pokemons.length;
    document.getElementById("opened-card").innerHTML = '';
    if(currentImageIndex > 0){
        currentImageIndex--;
        openCard(currentImageIndex);
    } else{
        openCard(lastImageIndex-1);
    }
}



async function loadMore() {
    await getPokemons();
    displayPokemons();
  }
  