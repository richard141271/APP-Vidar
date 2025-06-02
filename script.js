
let kuber = JSON.parse(localStorage.getItem("kuber") || "[]");
let aktivKube = null;
let bildeData = null;

function visKubeoversikt() {
  document.getElementById("kubeoversikt").style.display = "block";
  document.getElementById("registrer-kube").style.display = "none";
  document.getElementById("kube-detaljer").style.display = "none";

  const div = document.getElementById("kubeoversikt");
  div.innerHTML = `<h2>Mine kuber</h2>
    <button onclick="eksporterData()">⬇️ Eksporter data</button>
    <input type="file" onchange="importerData(event)">`;

  kuber.forEach((kube, i) => {
    div.innerHTML += `
      <div class="kube">
        <strong>${kube.id}</strong><br>
        Plassering: ${kube.plassering}<br>
        Type: ${kube.type}<br>
        Opprettet: ${kube.opprettet}<br>
        <button onclick="visDetaljer(${i})">Vis detaljer</button>
      </div>`;
  });
}

function visRegistrerKube() {
  document.getElementById("kubeoversikt").style.display = "none";
  document.getElementById("registrer-kube").style.display = "block";
  document.getElementById("kube-detaljer").style.display = "none";
}

function lagreNyKube() {
  const id = document.getElementById("ny-id").value;
  const plassering = document.getElementById("ny-plassering").value;
  const type = document.getElementById("ny-type").value;
  const opprettet = new Date().toLocaleDateString();
  kuber.push({ id, plassering, type, opprettet });
  localStorage.setItem("kuber", JSON.stringify(kuber));
  visKubeoversikt();
}

function visDetaljer(index) {
  aktivKube = kuber[index];
  bildeData = null;
  document.getElementById("kubeoversikt").style.display = "none";
  document.getElementById("registrer-kube").style.display = "none";
  document.getElementById("kube-detaljer").style.display = "block";

  document.getElementById("kube-navn").innerText = aktivKube.id;
  document.getElementById("plassering").innerText = aktivKube.plassering;
  document.getElementById("type").innerText = aktivKube.type;
  document.getElementById("opprettet").innerText = aktivKube.opprettet;

  document.getElementById("forhåndsvisning").src = "";
  document.getElementById("forhåndsvisning").style.display = "none";

  visLogg();
}

function visBilde(event) {
  const img = document.getElementById("forhåndsvisning");
  const fil = event.target.files[0];
  if (fil) {
    const reader = new FileReader();
    reader.onload = function(e) {
      bildeData = e.target.result;
      img.src = bildeData;
      img.style.display = "block";
    };
    reader.readAsDataURL(fil);
  }
}

function lagreInspeksjon() {
  const data = {
    temp: document.getElementById("temp").value,
    vær: document.getElementById("vær").value,
    notat: document.getElementById("notat").value,
    tilstand: document.querySelector('input[name="tilstand"]:checked')?.value || "n/a",
    bilde: bildeData,
    tid: new Date().toLocaleString()
  };
  const nøkkel = "logg_" + aktivKube.id;
  const eksisterende = JSON.parse(localStorage.getItem(nøkkel) || "[]");
  eksisterende.unshift(data);
  localStorage.setItem(nøkkel, JSON.stringify(eksisterende));
  document.getElementById("temp").value = "";
  document.getElementById("vær").value = "";
  document.getElementById("notat").value = "";
  document.getElementById("forhåndsvisning").style.display = "none";
  bildeData = null;
  visLogg();
}

function visLogg() {
  const nøkkel = "logg_" + aktivKube.id;
  const logg = JSON.parse(localStorage.getItem(nøkkel) || "[]");
  const div = document.getElementById("logg");
  div.innerHTML = "";
  logg.forEach(entry => {
    let farge = entry.tilstand === "grønn" ? "#ccffcc" :
                entry.tilstand === "gul" ? "#fffccc" :
                entry.tilstand === "rød" ? "#ffcccc" : "#eee";
    div.innerHTML += `<div style="background:${farge};padding:5px;margin-bottom:10px;">
      <strong>${entry.tid}</strong><br>
      ${entry.temp}°C | ${entry.vær} | ${entry.tilstand}<br>
      ${entry.notat}<br>
      ${entry.bilde ? "<img src='" + entry.bilde + "' style='max-width:100px;'>" : ""}
      <br><button onclick="slettLogg('${entry.tid}')">🗑 Slett</button>
    </div>`;
  });
}

function slettLogg(tid) {
  const nøkkel = "logg_" + aktivKube.id;
  let logg = JSON.parse(localStorage.getItem(nøkkel) || "[]");
  logg = logg.filter(entry => entry.tid !== tid);
  localStorage.setItem(nøkkel, JSON.stringify(logg));
  visLogg();
}

function eksporterData() {
  const allData = {
    kuber: kuber,
    logger: {}
  };
  kuber.forEach(k => {
    allData.logger[k.id] = JSON.parse(localStorage.getItem("logg_" + k.id) || "[]");
  });
  const blob = new Blob([JSON.stringify(allData)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "birøkter-backup.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importerData(event) {
  const fil = event.target.files[0];
  if (fil) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const data = JSON.parse(e.target.result);
      if (data.kuber && data.logger) {
        kuber = data.kuber;
        localStorage.setItem("kuber", JSON.stringify(kuber));
        for (let id in data.logger) {
          localStorage.setItem("logg_" + id, JSON.stringify(data.logger[id]));
        }
        visKubeoversikt();
        alert("✅ Importert!");
      } else {
        alert("❌ Ugyldig fil.");
      }
    };
    reader.readAsText(fil);
  }
}

visKubeoversikt();
