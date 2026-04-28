$(document).ready(function () {

 
  var leftUrl= 'https://script.google.com/macros/s/AKfycbycjiYgmD-4A4BadxOOWueWqwcEEBCpQjR5yZdW-aCNBKl4dCmfKBYMCVXjSrnAqkA/exec?sheetName=DMK';
  
  





  fetch(leftUrl)
  .then(response => response.json())
      .then(data => {
        console.log(data)
      renderPartyStrip(data)
      })

  
  
  
  
  const loader = document.getElementById("loader");
  const container = document.getElementById("resultContainer");





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



  setInterval(() => {

        fetch(leftUrl)
  .then(response => response.json())
      .then(data => {
       
     renderPartyStrip(data, true)
      })
  }, 3000);
 
    fetch(leftUrl);
   



});