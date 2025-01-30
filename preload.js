// preload.js

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }
  })


// import { apiKey, playerId } from '/constant.js'
const apiKey = "f8e59c52-452f-4d11-ae3d-48b71af6a155"
const playerId = "6036a315-98e4-42cb-9282-2b1fa557048e"
const playerName = "OpenForce";
const urlPlayer = `https://open.faceit.com/data/v4/players?nickname=${playerName}`;
const urlStatsPlayer = `https://open.faceit.com/data/v4/players/${playerId}/stats/cs2`;


const fetchData = async (url) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (response.ok) {
    const data = await response.json()
    return data;
    
  } else {
    console.log(error);
  }
}


const displayData = async () => {

  const [data, stats] = await Promise.all([fetchData(urlPlayer), fetchData(urlStatsPlayer)])

   const winLose = stats?.lifetime["Recent Results"]?.map(el => el && el > 0 ? `<p class="green">W</p>` : `<p class="red">L</p>`).join(' ')

   const totalKills = stats?.lifetime["Total Kills with extended stats"]
   const totalRounds = stats?.lifetime["Total Rounds with extended stats"]
   const kr = (totalKills / totalRounds).toFixed(2)

  // console.log(data, 'data');
  // console.log(stats, 'stats');

  const playerStats = `
    <div class="stats">
     <div class="stats-left">
      <p class="nikname">${data.nickname} <span class="flag-icon flag-icon-${data.country} flag-icon-squared"></span></p>
       <div class="stats-group">
        <div class="stats-group-left">
          <p class="stats-title">ADR:</p>
          <p class="stats-subtitle">${stats.lifetime["ADR"]}</p>
       </div>
        <div class="stats-group-right">
        <p class="stats-title">HS:</p>
          <p class="stats-subtitle">${stats.lifetime["Average Headshots %"]}%</p>
       </div>
       </div>
       <p class="stats-winrate">Win Rate: ${stats?.lifetime["Win Rate %"]}% </p>
     </div>
     <div class="stats-right">
      <div class="stats-elo">
           <p>${data.games.cs2.faceit_elo}</p>
          <img src="./icons/faceit${data.games.cs2.skill_level}.svg"/>
      </div>
       <div class="stats-group">
        <div class="stats-group-left">
          <p class="stats-title">K/D</p>
          <p class="stats-subtitle">${stats.lifetime["Average K/D Ratio"]}</p>
       </div>
        <div class="stats-group-right">
        <p class="stats-title">K/R</p>
          <p class="stats-subtitle">${kr}</p>
       </div>
        <div class="win-lose-main">${winLose}</div>
     </div>
    </div>
    `;
  document.getElementById("player-data").innerHTML = playerStats;
}



displayData()

