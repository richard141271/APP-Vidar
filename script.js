let kuber = JSON.parse(localStorage.getItem("bikuber")) || [];
let aktivKubeIndex = null;
function lagre() {
  localStorage.setItem("bikuber", JSON.stringify(kuber));
}
function visSide(id) {
  document.querySelectorAll('.side').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  if (id === 'oversikt') visKuber();
}
function leggTilKube() {
  const navn = document.getElementById("kubenavn").value.trim();
  const plassering = document.getElementById("plassering").value.trim();
  const type = document.getElementById("kubetype").value.trim();
  if (!navn || !plassering || !type) return alert("Fyll ut alle feltene.");
  const dato = new Date().toLocaleDateString();
  kuber.push({ navn, plassering, type, opprettet: dato, logg: [] });
  lagre(); visKuber(); visSide('oversikt');
}
function visKuber() {
  const liste = document.getElementById("kubeliste");
  liste.innerHTML = "";
  if (kuber.length === 0) {
    liste.innerHTML = "<p>Ingen kuber registrert ennå.</p>";
    return;
  }
  kuber.forEach((kube, index) => {
    const div = document.createElement("div");
    div.className = "kort";
    div.innerHTML = `
      <strong>${kube.navn}</strong><br>
      Plassering: ${kube.plassering}<br>
      Type: ${kube.type}<br>
      Opprettet: ${kube.opprettet}<br><br>
      <button onclick="visDetaljer(${index})">Vis detaljer</button>
    `;
    liste.appendChild(div);
  });
}
function visDetaljer(index) {
  aktivKubeIndex = index;
  const kube = kuber[index];
  document.getElementById("detaljNavn").innerText = kube.navn;
  document.getElementById("detaljInfo").innerHTML = `
    <p><strong>Plassering:</strong> ${kube.plassering}</p>
    <p><strong>Type:</strong> ${kube.type}</p>
    <p><strong>Opprettet:</strong> ${kube.opprettet}</p>
  `;
  document.getElementById("temp").value = "";
  document.getElementById("vaer").value = "";
  document.getElementById("notat").value = "";
  document.getElementById("bildeurl").value = "";
  visLogg();
  visSide("kubedetaljer");
}
function lagreInspeksjon() {
  const temp = document.getElementById("temp").value;
  const vaer = document.getElementById("vaer").value;
  const notat = document.getElementById("notat").value;
  const bildeurl = document.getElementById("bildeurl").value;
  if (!temp || !vaer || !notat) {
    alert("Fyll ut temperatur, vær og notat."); return;
  }
  const dato = new Date().toLocaleDateString();
  const loggpost = { dato, temp, vaer, notat, bildeurl };
  kuber[aktivKubeIndex].logg.push(loggpost);
  lagre(); visDetaljer(aktivKubeIndex);
}
function visLogg() {
  const loggVisning = document.getElementById("loggvisning");
  loggVisning.innerHTML = "";
  const logg = kuber[aktivKubeIndex].logg;
  if (logg.length === 0) {
    loggVisning.innerHTML = "<p>Ingen inspeksjoner enda.</p>"; return;
  }
  logg.slice().reverse().forEach((post, i) => {
    const index = logg.length - 1 - i;
    const div = document.createElement("div");
    div.className = "loggpost";
    div.innerHTML = `
      <p><strong>${post.dato}</strong> | ${post.temp}°C | ${post.vaer}</p>
      <p>${post.notat}</p>
      ${post.bildeurl ? `<img src="${post.bildeurl}" alt="Bilde">` : ""}
      <button onclick="slettLogg(${index})">Slett</button>
    `;
    loggVisning.appendChild(div);
  });
}
function slettLogg(loggIndex) {
  if (confirm("Slette denne loggposten?")) {
    kuber[aktivKubeIndex].logg.splice(loggIndex, 1);
    lagre(); visDetaljer(aktivKubeIndex);
  }
}
visSide('oversikt');