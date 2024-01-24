/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

// CONCATENATED MODULE: ./src/data.json
const data_namespaceObject = JSON.parse("{\"i8\":\"14.2.1\",\"Mj\":[\"en_US\",\"cs_CZ\",\"de_DE\",\"el_GR\",\"en_AU\",\"en_GB\",\"en_PH\",\"en_SG\",\"es_AR\",\"es_ES\",\"es_MX\",\"fr_FR\",\"hu_HU\",\"it_IT\",\"ja_JP\",\"ko_KR\",\"pl_PL\",\"pt_BR\",\"ro_RO\",\"ru_RU\",\"th_TH\",\"tr_TR\",\"vi_VN\",\"zh_CN\",\"zh_MY\",\"zh_TW\"],\"Yf\":[\"Aatrox\",\"Ahri\",\"Akali\",\"Akshan\",\"Alistar\",\"Amumu\",\"Anivia\",\"Annie\",\"Aphelios\",\"Ashe\",\"AurelionSol\",\"Azir\",\"Bard\",\"Belveth\",\"Blitzcrank\",\"Brand\",\"Braum\",\"Briar\",\"Caitlyn\",\"Camille\",\"Cassiopeia\",\"Chogath\",\"Corki\",\"Darius\",\"Diana\",\"Draven\",\"DrMundo\",\"Ekko\",\"Elise\",\"Evelynn\",\"Ezreal\",\"Fiddlesticks\",\"Fiora\",\"Fizz\",\"Galio\",\"Gangplank\",\"Garen\",\"Gnar\",\"Gragas\",\"Graves\",\"Gwen\",\"Hecarim\",\"Heimerdinger\",\"Hwei\",\"Illaoi\",\"Irelia\",\"Ivern\",\"Janna\",\"JarvanIV\",\"Jax\",\"Jayce\",\"Jhin\",\"Jinx\",\"Kaisa\",\"Kalista\",\"Karma\",\"Karthus\",\"Kassadin\",\"Katarina\",\"Kayle\",\"Kayn\",\"Kennen\",\"Khazix\",\"Kindred\",\"Kled\",\"KogMaw\",\"KSante\",\"Leblanc\",\"LeeSin\",\"Leona\",\"Lillia\",\"Lissandra\",\"Lucian\",\"Lulu\",\"Lux\",\"Malphite\",\"Malzahar\",\"Maokai\",\"MasterYi\",\"Milio\",\"MissFortune\",\"MonkeyKing\",\"Mordekaiser\",\"Morgana\",\"Naafiri\",\"Nami\",\"Nasus\",\"Nautilus\",\"Neeko\",\"Nidalee\",\"Nilah\",\"Nocturne\",\"Nunu\",\"Olaf\",\"Orianna\",\"Ornn\",\"Pantheon\",\"Poppy\",\"Pyke\",\"Qiyana\",\"Quinn\",\"Rakan\",\"Rammus\",\"RekSai\",\"Rell\",\"Renata\",\"Renekton\",\"Rengar\",\"Riven\",\"Rumble\",\"Ryze\",\"Samira\",\"Sejuani\",\"Senna\",\"Seraphine\",\"Sett\",\"Shaco\",\"Shen\",\"Shyvana\",\"Singed\",\"Sion\",\"Sivir\",\"Skarner\",\"Smolder\",\"Sona\",\"Soraka\",\"Swain\",\"Sylas\",\"Syndra\",\"TahmKench\",\"Taliyah\",\"Talon\",\"Taric\",\"Teemo\",\"Thresh\",\"Tristana\",\"Trundle\",\"Tryndamere\",\"TwistedFate\",\"Twitch\",\"Udyr\",\"Urgot\",\"Varus\",\"Vayne\",\"Veigar\",\"Velkoz\",\"Vex\",\"Vi\",\"Viego\",\"Viktor\",\"Vladimir\",\"Volibear\",\"Warwick\",\"Xayah\",\"Xerath\",\"XinZhao\",\"Yasuo\",\"Yone\",\"Yorick\",\"Yuumi\",\"Zac\",\"Zed\",\"Zeri\",\"Ziggs\",\"Zilean\",\"Zoe\",\"Zyra\"]}");
// CONCATENATED MODULE: ./src/index.js


const languages = data_namespaceObject.Mj;
const champions = data_namespaceObject.Yf;
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

const PATCH_VERSION = data_namespaceObject.i8;
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

const src_form = document.querySelector("form");
const progress = document.querySelector(".progress");
src_form.onsubmit = src_onsubmit;
loadData();
src_onsubmit();

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

function src_onsubmit(e) {
  if (e) e.preventDefault();

  const fd = new FormData(src_form);
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

/******/ })()
;