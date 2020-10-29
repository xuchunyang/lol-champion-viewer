const fs = require("fs");
const path = require("path");
const axios = require("axios");

const getLatestVersion = async () => {
  const response = await axios.get(
    "https://ddragon.leagueoflegends.com/api/versions.json"
  );
  const versions = response.data;
  const latestVersion = versions[0];
  return latestVersion;
};

const getLanguages = async () => {
  return (
    await axios.get("https://ddragon.leagueoflegends.com/cdn/languages.json")
  ).data;
};

const getChampions = async (version) => {
  const response = await axios.get(
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
  );
  return Object.keys(response.data.data);
};

(async () => {
  const latestVersion = await getLatestVersion();

  const jsonFile = path.resolve(__dirname, "data.json");
  if (!fs.existsSync(jsonFile)) {
    console.log(`${jsonFile} does not exist, creating ${jsonFile}...`);
  } else {
    const currentVersion = JSON.parse(fs.readFileSync(jsonFile, "utf8"))
      .version;
    if (currentVersion !== latestVersion) {
      console.log(
        `${currentVersion} < ${latestVersion}, updating ${jsonFile}...`
      );
    } else {
      console.log(`${currentVersion} is the latest version, exiting`);
      return;
    }
  }
  const [languages, champions] = await Promise.all([
    getLanguages(),
    getChampions(latestVersion),
  ]);
  fs.writeFileSync(
    jsonFile,
    JSON.stringify({ version: latestVersion, languages, champions }, null, 2)
  );
})();
