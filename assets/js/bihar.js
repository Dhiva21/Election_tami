$(document).ready(function () {

  var allianceUrl = 'https://script.google.com/macros/s/AKfycbycjiYgmD-4A4BadxOOWueWqwcEEBCpQjR5yZdW-aCNBKl4dCmfKBYMCVXjSrnAqkA/exec?sheetName=ALL_CONSTITUENCIES';
  var leftUrl= 'https://script.google.com/macros/s/AKfycbycjiYgmD-4A4BadxOOWueWqwcEEBCpQjR5yZdW-aCNBKl4dCmfKBYMCVXjSrnAqkA/exec?sheetName=DMK';
  var rightUrl= 'https://script.google.com/macros/s/AKfycbycjiYgmD-4A4BadxOOWueWqwcEEBCpQjR5yZdW-aCNBKl4dCmfKBYMCVXjSrnAqkA/exec?sheetName=ADMK';
   var versusUrl= 'https://script.google.com/macros/s/AKfycbycjiYgmD-4A4BadxOOWueWqwcEEBCpQjR5yZdW-aCNBKl4dCmfKBYMCVXjSrnAqkA/exec?sheetName=VVIP_VSCard';
 
var versusUrl = 'https://script.google.com/macros/s/AKfycbycjiYgmD-4A4BadxOOWueWqwcEEBCpQjR5yZdW-aCNBKl4dCmfKBYMCVXjSrnAqkA/exec?sheetName=VVIP_VSCard';

  const versus = document.getElementById("app");

fetch(versusUrl)
  .then(res => res.json())
  .then(data => {
    let html = "";

    data.forEach(item => {

      const isLeftLead = item.lvote > item.rvote;

      html += `
      <div class="bg-color">
        <div class="row align-items-center text-center">

          <!-- LEFT -->
          <div class="col-5">
            <div class="row align-items-center justify-content-end">
              
              <div class="col-auto">
                <img src="assets/images/${item.limg}.jpg" class="vs-img">
              </div>

              <div class="col-auto text-center">
                <div class="vs-count">${item.lvote.toLocaleString()}</div>
                <div class="trend ${isLeftLead ? 'up' : 'down'}">
                  ${isLeftLead ? 'முன்னிலை ↑' : 'பின்னடைவு ↓'}
                </div>
              </div>

            </div>
          </div>

          <!-- VS -->
          <div class="col-2">
            <div class="vs-text">VS</div>
          </div>

          <!-- RIGHT -->
          <div class="col-5">
            <div class="row align-items-center justify-content-start">
              
              <div class="col-auto text-center">
                <div class="vs-count">${item.rvote.toLocaleString()}</div>
                <div class="trend ${!isLeftLead ? 'up' : 'down'}">
                  ${!isLeftLead ? 'முன்னிலை ↑' : 'பின்னடைவு ↓'}
                </div>
              </div>

              <div class="col-auto">
                <img src="assets/images/${item.rimg}.jpg" class="vs-img">
              </div>

            </div>
          </div>

        </div>

        <!-- LOCATION -->
        <div class="text-center mt-2" style="font-size:14px;opacity:0.8">
          ${item.vlocan}
        </div>

      </div>`;
    });

    versus.innerHTML = html;
  })
  .catch(err => console.error(err));
 
  

  
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



  async function fetchVSData() {
  try {
    const res = await fetch(versusUrl);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Fetch Error:", err);
    return [];
  }
}

  function fetchData(url) {
    loader.style.display = "block";
    container.style.display = "none";

    fetch(url)
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

    const partyConfig = {
      Assembly: { name: "முன்னிலை + வெற்றி", img: "assets/images/party/assembly_images.png", class: "assembly" },
      DMK: { name: "திமுக+", img: "assets/images/party/stalin.png", class: "dmk" },
      ADMK: { name: "அதிமுக+", img: "assets/images/party/eps.png", class: "admk" },
      TVK: { name: "தவெக", img: "assets/images/party/Vijay.png", class: "tvk" },
      NTK: { name: "நாதக", img: "assets/images/party/Seeman.png", class: "ntk" },
    };

    // 🔥 LAST WIN DATA
    const lastWining = {
      DMK: 133,
      ADMK: 66,
      TVK: 0,
      NTK: 0
    };

    // 🔥 DIFF FUNCTION
  function getDiffHtml(diff) {
  if (diff > 0) {
    return `
      <div class="diff up bg_white_overlay">
        <img src="assets/images/party/UP.png" class="trend-icon" />
        + ${diff}
      </div>
    `;
  } 
  else if (diff < 0) {
    return `
      <div class="diff down bg_white_overlay">
        <img src="assets/images/party/Down.png" class="trend-icon" />
       - ${Math.abs(diff)}
      </div>
    `;
  }
  return "";
}

    const totalSeats =
      Number(result.alis1 || 0) +
      Number(result.alis2 || 0) +
      Number(result.alis3 || 0) +
      Number(result.alis4 || 0);

    // ✅ INITIAL RENDER
    if (!isUpdate) {

      container.innerHTML = `
        <div class="custom-grid">

          <!-- Assembly -->
         <div class="result-card assembly">

  <!-- ✅ FULL CARD OVERLAY -->
  <div class="overlay-white_assembly"></div>

  <div class="content d-flex align-items-center">
    
    <div class="icon assembly">
       <img src="assets/images/assembly_images.png" />
    </div>

    <div class="text rightContent_assembly">
      <div class="title">முன்னிலை + வெற்றி</div>
      <p >
      <span class="count" id="total-count">${totalSeats} </span>
       <sub class="sub-count">/ 234</sub></p>
      
    </div>

  </div>

</div>

          <!-- Parties -->
          ${parties.map((item, i) => {
            const config = partyConfig[item.party];
            if (!config) return "";

            const current = Number(item.seats || 0);
            const last = lastWining[item.party] || 0;
            const diff = current - last;
            const diffHtml = getDiffHtml(diff);

            return `
              <div class="result-card result-cardOne ${config.class}">
                <div class="overlay-white"></div>

                <div class="content d-flex align-items-center">
                  <div class="icon_1">
                    <img src="${config.img}" />
                  </div>

                  <div class="  rightContent text ">
                  
                    <div class="title">${config.name}</div>

                    <div class=" gap-2">
                      <p class="count mb-0 countFont" id="count-${i}">
                        ${current}
                      </p>
                        ${diffHtml}   
                    
                    </div>

                   
                 
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

      parties.forEach((item, i) => {
        const el = document.getElementById(`count-${i}`);
        if (el) {

          const current = Number(item.seats || 0);
          const last = lastWining[item.party] || 0;
          const diff = current - last;
          const diffHtml = getDiffHtml(diff);

          el.parentElement.innerHTML = `
            <p class="count mb-0 countFont" id="count-${i}">
              ${current}
            </p>
            ${diffHtml}
          `;

          el.classList.add("pulse");
          setTimeout(() => el.classList.remove("pulse"), 300);
        }
      });

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


function renderPartyStrip(rawData, isUpdate = false) {

  const nameMap = {
    DMK: "திமுக",
    CONGRESS: "காங்.",
    DMDK: "தேமுதிக",
    VCK: "விசிக",
    MDMK: "மதிமுக",
    OTHERS: "மற்றவை"
  };

  const imgMap = {
    DMK: "assets/images/party/DMK.png",
    CONGRESS: "assets/images/party/Congress.png",
    DMDK: "assets/images/party/DMDK.png",
    VCK: "assets/images/party/VCK.png",
    MDMK: "assets/images/party/MDMK.png",
    OTHERS: "assets/images/party/others.png"
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

  htmlData.push({ party: "OTHERS", seats: othersTotal });

  // 🔄 UPDATE மட்டும்
  if (isUpdate) {
    htmlData.forEach((item, i) => {
      const el = document.getElementById(`left-seat-${i}`);
      if (el) {
        el.innerText = item.seats;

        el.classList.add("pulse");
        setTimeout(() => el.classList.remove("pulse"), 300);
      }
    });
    return;
  }

  // 🚀 INITIAL RENDER
  const html = `
    <div class="result-strip d-flex flex-column align-items-center p-2">
      ${htmlData.map((item, i) => {

        const name = nameMap[item.party] || item.party;
        const img = imgMap[item.party] || imgMap["OTHERS"];

        return `
          <div class="party-box text-center mb-3">
            
            <div class="party_flex d-flex align-items-center justify-content-center gap-1">
              <img src="${img}" class="party-icon" />
              <div class="party-name">${name}</div>
            </div>

            <div class="seat-box" id="left-seat-${i}">${item.seats}</div>

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
            
            <div class="party_flex d-flex align-items-center justify-content-center gap-1">
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
    fetch(allianceUrl)
      .then(res => res.json())
      .then(data => indexCard(data, true));

        fetch(leftUrl)
  .then(response => response.json())
      .then(data => {
       
     renderPartyStrip(data, true)
      })
      fetch(rightUrl)
  .then(response => response.json())
      .then(data => {
     
     renderADMKStrip(data,true)
      })
  }, 3000);


    fetchData(allianceUrl);
    fetch(leftUrl);
    fetch(rightUrl);






















});