
let kuber = JSON.parse(localStorage.getItem("kuber") || "[]");
let aktivKube = null;

function visKubeoversikt() {
  document.getElementById("kubeoversikt").style.display = "block";
  document.getElementById("registrer-kube").style.display = "none";
  document.getElementById("kube-detaljer").style.display = "none";

  const div = document.getElementById("kubeoversikt");
  div.innerHTML = "<h2>Mine kuber</h2>";
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
  document.getElementById("kubeoversikt").style.display = "none";
  document.getElementById("registrer-kube").style.display = "none";
  document.getElementById("kube-detaljer").style.display = "block";

  document.getElementById("kube-navn").innerText = aktivKube.id;
  document.getElementById("plassering").innerText = aktivKube.plassering;
  document.getElementById("type").innerText = aktivKube.type;
  document.getElementById("opprettet").innerText = aktivKube.opprettet;

  visLogg();
}

function visBilde(event) {
  const img = document.getElementById("forhåndsvisning");
  const fil = event.target.files[0];
  if (fil) {
    const reader = new FileReader();
    reader.onload = function(e) {
      img.src = e.target.result;
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
    bilde: document.getElementById("forhåndsvisning").src,
    tid: new Date().toLocaleString()
  };
  const nøkkel = "logg_" + aktivKube.id;
  const eksisterende = JSON.parse(localStorage.getItem(nøkkel) || "[]");
  eksisterende.unshift(data);
  localStorage.setItem(nøkkel, JSON.stringify(eksisterende));
  visLogg();
}

function visLogg() {
  const nøkkel = "logg_" + aktivKube.id;
  const logg = JSON.parse(localStorage.getItem(nøkkel) || "[]");
  const div = document.getElementById("logg");
  div.innerHTML = "";
  logg.forEach(entry => {
    div.innerHTML += `<div><strong>${entry.tid}</strong><br>
    ${entry.temp}°C | ${entry.vær}<br>
    ${entry.notat}<br>
    ${entry.bilde ? "<img src='" + entry.bilde + "' style='max-width:100px;'>" : ""}
    </div><hr>`;
  });
}

visKubeoversikt();
