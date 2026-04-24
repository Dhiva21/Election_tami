$(document).ready(function () {

  var allianceUrl = 'https://script.google.com/macros/s/AKfycbycjiYgmD-4A4BadxOOWueWqwcEEBCpQjR5yZdW-aCNBKl4dCmfKBYMCVXjSrnAqkA/exec?sheetName=ALL_CONSTITUENCIES';
  var leftUrl= 'https://script.google.com/macros/s/AKfycbycjiYgmD-4A4BadxOOWueWqwcEEBCpQjR5yZdW-aCNBKl4dCmfKBYMCVXjSrnAqkA/exec?sheetName=DMK';
  var rightUrl= 'https://script.google.com/macros/s/AKfycbycjiYgmD-4A4BadxOOWueWqwcEEBCpQjR5yZdW-aCNBKl4dCmfKBYMCVXjSrnAqkA/exec?sheetName=ADMK'
 
  fetch(leftUrl)
  .then(response => response.json())
      .then(data => {
        console.log(data)
      renderPartyStrip(data)
      })

      fetch(rightUrl)
  .then(response => response.json())
      .then(data => {
        console.log(data)
     renderADMKStrip(data)
      })
  
  
  
  
  const loader = document.getElementById("loader");
  const container = document.getElementById("resultContainer");

  function fetchData() {
    loader.style.display = "block";
    container.style.display = "none";

    fetch(allianceUrl)
      .then(response => response.json())
      .then(data => {
        indexCard(data);
      })
      .catch(err => {
        console.error(err);
        loader.style.display = "none";
      });
  }

  function indexCard(data, isUpdate = false) {
    try {
      const result = data.find(item => Number(item.alid) === 1);
      if (!result) return;

      let parties = [
        { party: result.alip1, seats: result.alis1 },
        { party: result.alip2, seats: result.alis2 },
        { party: result.alip3, seats: result.alis3 },
        { party: result.alip4, seats: result.alis4 }
      ];

      // ✅ Move Assembly to first
      parties.sort((a, b) => {
        return (b.party === "Assembly") - (a.party === "Assembly");
      });

      const partyConfig = {
        Assembly: { name: "முன்னிலை + வெற்றி", img: "assets/images/assembly_images.png", class: "assembly" },
        DMK: { name: "திமுக+", img: "assets/images/new/stalin.png", class: "dmk" },
        ADMK: { name: "அதிமுக+", img: "assets/images/new/eps.png", class: "admk" },
          TVK: { name: "தவெக", img: "assets/images/vijay.png", class: "tvk" },
        NTK: { name: "நாதக", img: "assets/images/seeman.png", class: "ntk" },
      
      };

      // ✅ INITIAL RENDER
     if (!isUpdate) {

  // 👉 Calculate total seats
  const totalSeats =
    Number(result.alis1 || 0) +
    Number(result.alis2 || 0) +
    Number(result.alis3 || 0) +
    Number(result.alis4 || 0);

  container.innerHTML = `
    <div class="custom-grid">

      <!-- ✅ Assembly Card FIRST -->
      <div class="result-card assembly">
        <div class="content d-flex align-items-center">
          
        <div class="icon assembly"></div>

          <div class="text ms-2 rightContent">
            <div class="title">முன்னிலை + வெற்றி</div>
            <p class="count" id="total-count">${totalSeats}</p>
            <p class="total">/ 234</p>
          </div>

        </div>
      </div>

      <!-- ✅ Party Cards -->
      ${parties.map((item, i) => {
        const config = partyConfig[item.party];
        if (!config) return "";

        return `
          <div class="result-card ${config.class}">
           <div class="overlay-white"></div>
            <div class="content d-flex align-items-center">
              
              <div class="icon_1">
                <img src="${config.img}" />
              </div>

              <div class="text ms-2 rightContent">
                <div class="title">${config.name}</div>
                <p class="count" id="count-${i}">${item.seats || 0}</p>
                
              </div>

            </div>
          </div>
        `;
      }).join("")}

    </div>
  `;

  loader.style.display = "none";
  container.style.display = "block";
}
else {

  // 🔥 update individual party counts
  parties.forEach((item, i) => {
    const el = document.getElementById(`count-${i}`);
    if (el) {
      const seat = Number(item.seats || 0);
      el.innerText = seat;

      el.classList.add("pulse");
      setTimeout(() => el.classList.remove("pulse"), 300);
    }
  });

  // ✅ 🔥 DIRECT total from result (best way)
  const totalSeats =
    Number(result.alis1 || 0) +
    Number(result.alis2 || 0) +
    Number(result.alis3 || 0) +
    Number(result.alis4 || 0);

  const totalEl = document.getElementById("total-count");
  if (totalEl) {
    totalEl.innerText = totalSeats;

    totalEl.classList.add("pulse");
    setTimeout(() => totalEl.classList.remove("pulse"), 300);
  }
}

    } catch (err) {
      console.error(err);
      loader.style.display = "none";
    }
  }

  // 🔥 Initial load
  fetchData();

  // 🔄 Auto refresh every 3 sec
  setInterval(() => {
    fetch(allianceUrl)
      .then(res => res.json())
      .then(data => indexCard(data, true));
  }, 3000);



function renderPartyStrip(rawData) {

  const nameMap = {
    DMK: "திமுக",
    CONGRESS: "காங்.",
    DMDK: "தேமுதிக",
    VCK: "விசிக",
    MDMK: "மதிமுக",
    OTHERS: "மற்றவை"
  };

  const imgMap = {
    DMK: "assets/images/new/DMK.png",
    CONGRESS: "assets/images/new/Congress.png",
    DMDK: "assets/images/new/DMDK.png",
    VCK: "assets/images/new/VCK.png",
    MDMK: "assets/images/new/MDMK.png",
    OTHERS: "assets/images/new/others.png"
  };

  const mainParties = ["DMK", "CONGRESS", "DMDK", "VCK", "MDMK"];

  let htmlData = [];
  let othersTotal = 0;

  rawData.forEach(item => {

    if (!item.party) return;

    const match = item.party.match(/(.*)\(/);
    if (!match) return;

    const partyName = match[1].trim();

    
    const seats = Number(item.aldmk || 0);

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
            
            <div class="party_flex d-flex align-items-center justify-content-center gap-1">
              <img src="${img}" class="party-icon" />
              <div class="party-name">${name}</div>
            </div>

            <div class="seat-box">${item.seats}</div>

          </div>
        `;
      }).join("")}
    </div>
  `;

  document.getElementById("resultContainerOne").innerHTML = html;
}

function renderADMKStrip(rawData) {

  const nameMap = {
    ADMK: "அதிமுக",
    BJP: "பாஜக",
    PMK: "பாமக",
    AMMK: "அமமுக",
    TMC: "தமக",
    OTHERS: "மற்றவை"
  };

  const imgMap = {
    ADMK: "assets/images/new/ADMK.png",
    BJP: "assets/images/new/BJP.png",
    PMK: "assets/images/new/PMK.png",
    AMMK: "assets/images/new/AMMK.png",
    TMC: "assets/images/new/TMC.png",
    OTHERS: "assets/images/new/others.png"
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
            
            <div class="party_flex d-flex align-items-center justify-content-center gap-1">
              <img src="${img}" class="party-icon" />
              <div class="party-name">${name}</div>
            </div>

            <div class="seat-box">${item.seats}</div>

          </div>
        `;
      }).join("")}
    </div>
  `;

  document.getElementById("resultContainerTwo").innerHTML = html;
}




});