$(document).ready(function () {
  var rightUrl= 'https://script.google.com/macros/s/AKfycbycjiYgmD-4A4BadxOOWueWqwcEEBCpQjR5yZdW-aCNBKl4dCmfKBYMCVXjSrnAqkA/exec?sheetName=ADMK';
 fetch(rightUrl)
  .then(response => response.json())
      .then(data => {
        console.log(data)
     renderADMKStrip(data)
      })
  

function renderADMKStrip(rawData) {

  const nameMap = {
    ADMK: "அதிமுக",
    BJP: "பாஜக",
    PMK: "பாமக",
    AMMK: "அமமுக",
    TMC: "தமாகா",
    OTHERS: "மற்றவை"
  };

  const imgMap = {
    ADMK: "assets/images/party/ADMK.png",
    BJP: "assets/images/party/BJP.png",
    PMK: "assets/images/party/PMK.png",
    AMMK: "assets/images/party/AMMK.png",
    TMC: "assets/images/party/TMC.png",
    OTHERS: "assets/images/party/others.png"
  };

  const mainParties = ["ADMK", "BJP", "PMK", "AMMK", "TMC"];

  let htmlData = [];
  let othersTotal = 0;

  rawData.forEach(item => {

    if (!item.party) return;


    const match = item.party.match(/(.*)\(/);
    if (!match) return;

    const partyName = match[1].trim();

    // ✅ ONLY aladmk value
    const seats = Number(item.aladmk || 0);

    if (mainParties.includes(partyName)) {
      htmlData.push({ party: partyName, seats });
    } else {
      othersTotal += seats;
    }

  });

  // 👉 add others
  htmlData.push({ party: "OTHERS", seats: othersTotal });

  // 👉 render
  const html = `
    <div class="result-strip d-flex flex-column align-items-center p-2">
      ${htmlData.map(item => {

        const name = nameMap[item.party] || item.party;
        const img = imgMap[item.party] || imgMap["OTHERS"];

        return `
          <div class="party-box text-center mb-3">
            
            <div class="party_flex gap-1">
              <img src="${img}" class="party-icon" />
              <div class="party-name ms-2">${name}</div>
            </div>

            <div class="seat-box">${item.seats}</div>

          </div>
        `;
      }).join("")}
    </div>
  `;

  document.getElementById("resultContainerTwo").innerHTML = html;































  
}

  setInterval(() => {

      fetch(rightUrl)
  .then(response => response.json())
      .then(data => {
     
     renderADMKStrip(data,true)
      })
  }, 3000);


    fetch(rightUrl);






















});