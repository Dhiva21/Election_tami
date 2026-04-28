$(document).ready(function () {

  var allianceUrl = 'https://script.google.com/macros/s/AKfycbycjiYgmD-4A4BadxOOWueWqwcEEBCpQjR5yZdW-aCNBKl4dCmfKBYMCVXjSrnAqkA/exec?sheetName=ALL_CONSTITUENCIES';

 
  const loader = document.getElementById("loader");
  const container = document.getElementById("resultContainer");



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

    // 🔥 CHECK: any data started?
    const hasStarted = parties.some(p => Number(p.seats) > 0);

    // 🔥 DIFF FUNCTION (updated)
    function getDiffHtml(diff, current) {


      if (current === 0) return "";

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
            <div class="overlay-white_assembly"></div>

            <div class="content d-flex align-items-center">
              <div class="icon assembly">
                <img src="assets/images/assembly_images.png" />
              </div>

              <div class="text rightContent_assembly">
                <div class="title">முன்னிலை + வெற்றி</div>
                <p>
                  <span class="count" id="total-count">${totalSeats}</span>
                  <sub class="sub-count">/ 234</sub>
                </p>
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
            const diffHtml = getDiffHtml(diff, current);

            return `
              <div class="result-card result-cardOne ${config.class}">
                <div class="overlay-white"></div>

                <div class="content d-flex align-items-center">
                  <div class="icon_1">
                    <img src="${config.img}" />
                  </div>

                  <div class="rightContent text">
                    <div class="title">${config.name}</div>

                    <div class="gap-2">
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

    // 🔄 UPDATE MODE
    else {

      parties.forEach((item, i) => {
        const el = document.getElementById(`count-${i}`);
        if (el) {

          const current = Number(item.seats || 0);
          const last = lastWining[item.party] || 0;
          const diff = current - last;
          const diffHtml = getDiffHtml(diff,current);

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


  setInterval(() => {
    fetch(allianceUrl)
      .then(res => res.json())
      .then(data => indexCard(data, true));
  }, 3000);


    fetchData(allianceUrl);



});