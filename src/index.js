import data from "./data.json";

const languages = data.languages;
const champions = data.champions;
const langSelect = document.querySelector("#lang-select");
const championSelect = document.querySelector("#champion-select");

languages.forEach(lang => addOption(langSelect, lang));
champions.forEach(champion => addOption(championSelect, champion));

function addOption(selectElement, optionValue) {
  const option = document.createElement("option");
  option.value = optionValue;
  option.textContent = optionValue;
  selectElement.appendChild(option);
}

const PATCH_VERSION = data.version;
document.querySelector("#patch").textContent = `Patch: ${PATCH_VERSION}`;

const main = document.querySelector("main");
const articleTemplate = document.querySelector("#article-template");
const carouselCellTemplate = document.querySelector("#carousel-cell-template");
class Champion {
  // data is from
  // https://ddragon.leagueoflegends.com/cdn/10.16.1/data/zh_CN/champion/Ahri.json
  constructor(data) {
    for (const key in data) {
      this[key] = data[key];
    }
  }

  updateView() {
    main.innerHTML = "";
    // XXX not work (invalid invocation), why?
    // const $ = article.querySelector;
    const clone = articleTemplate.content.cloneNode(true);
    const article = clone.querySelector("article");
    main.appendChild(article);
    article.querySelector("h1").textContent = `${this.name}, ${this.title}`;
    article.querySelector("img").src = `https://ddragon.leagueoflegends.com/cdn/${PATCH_VERSION}/img/champion/${this.image.full}`;
    article.querySelector("img").alt = this.name;

    const spells = [];
    spells.push(
      {
        name: this.passive.name,
        description: this.passive.description,
        imgSrc: `https://ddragon.leagueoflegends.com/cdn/${PATCH_VERSION}/img/passive/${this.passive.image.full}`
      }
    );
    this.spells.forEach(spell => {
      const name = spell.name;
      const description = spell.description;
      const imgSrc = `https://ddragon.leagueoflegends.com/cdn/${PATCH_VERSION}/img/spell/${spell.image.full}`
      spells.push({name, description, imgSrc});
    });

    article.querySelectorAll(".spell").forEach((elem, idx) => {
      const spell = spells[idx];
      elem.querySelector("img").src = spell.imgSrc;
      elem.querySelector(".name").textContent = spell.name;
      elem.querySelector(".description").textContent = stripHtml(spell.description);
    });

    const carousel = article.querySelector(".main-carousel");
    carousel.innerHTML = "";
    this.skins.forEach(({num, name}) => {
      const clone = carouselCellTemplate.content.cloneNode(true);
      const cell = clone.querySelector(".carousel-cell");
      const img = cell.querySelector("img");
      img.setAttribute(
        "data-flickity-lazyload",
        `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${this.id}_${num}.jpg`
      );
      img.alt = name;
      carousel.appendChild(cell);
    });
    new Flickity(carousel, {
      lazyLoad: 2,
      wrapAround: true,
      fullscreen: true,
    });
  }
}

const form = document.querySelector("form");
const progress = document.querySelector(".progress");
form.onsubmit = onsubmit;
loadData();
onsubmit();

function saveData(language, champion) {
  if (language) localStorage.setItem("language", language);
  if (champion) localStorage.setItem("champion", champion);
}

function loadData() {
  const lang = localStorage.getItem("language");
  if (lang) {
    const found = Array.from(langSelect.querySelectorAll("option")).find(o => o.value === lang);
    if (found) {
      found.selected = true;
    } else {
      console.error(`Invalid language: ${lang}`);
    }
  }

  const champion = localStorage.getItem("champion");
  if (champion) {
    const found = Array.from(championSelect.querySelectorAll("option")).find(o => o.value === champion);
    if (found) {
      found.selected = true;
    } else {
      console.error(`Invalid champion: ${champion}`);
    }
  }
}

function onsubmit(e) {
  if (e) e.preventDefault();

  const fd = new FormData(form);
  const lang = fd.get("lang");
  const champion = fd.get("champion");
  saveData(lang, champion);
  console.log(lang, champion);
  const url = `https://ddragon.leagueoflegends.com/cdn/${PATCH_VERSION}/data/${lang}/champion/${champion}.json`;
  progress.textContent = `Fetching ${url}...`;
  fetch(`https://ddragon.leagueoflegends.com/cdn/${PATCH_VERSION}/data/${lang}/champion/${champion}.json`)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`)
      return r.json();
    })
    .then(j => {
      console.log(j.data[champion]);
      new Champion(j.data[champion]).updateView();
      progress.textContent = "";
    });
}

// https://stackoverflow.com/a/822486/2999892
function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent;
}
