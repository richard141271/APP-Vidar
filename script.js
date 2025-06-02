
const kuber = [
  {
    "id": "Rascheprangen",
    "plassering": "hjemme",
    "type": "stor",
    "opprettet": "2.6.2025"
  },
  {
    "id": "Furulia",
    "plassering": "skogkanten",
    "type": "medium",
    "opprettet": "28.5.2025"
  }
];

function visKuber() {
  const liste = document.getElementById('kube-liste');
  liste.innerHTML = '';
  kuber.forEach((kube, index) => {
    const div = document.createElement('div');
    div.className = 'kube';
    div.innerHTML = `<h2>${kube.id}</h2><p>${kube.plassering}</p><button onclick="visInspeksjon(${index})">Inspiser</button>`;
    liste.appendChild(div);
  });
}

let aktivKube = null;

function visInspeksjon(index) {
  aktivKube = kuber[index];
  document.getElementById('kube-navn').innerText = aktivKube.id;
  document.getElementById('plassering').innerText = aktivKube.plassering;
  document.getElementById('type').innerText = aktivKube.type;
  document.getElementById('opprettet').innerText = aktivKube.opprettet;
  document.getElementById('inspeksjon').style.display = 'block';
  document.getElementById('kube-liste').style.display = 'none';
}

function tilbake() {
  document.getElementById('inspeksjon').style.display = 'none';
  document.getElementById('kube-liste').style.display = 'block';
}

function visBilde(event) {
  const img = document.getElementById('forhåndsvisning');
  const fil = event.target.files[0];
  if (fil) {
    const reader = new FileReader();
    reader.onload = function(e) {
      img.src = e.target.result;
      img.style.display = 'block';
      localStorage.setItem('bildeData_' + aktivKube.id, e.target.result);
    };
    reader.readAsDataURL(fil);
  }
}

function lagreInspeksjon() {
  const data = {
    temperatur: document.getElementById('temp').value,
    vær: document.getElementById('vær').value,
    notater: document.getElementById('notat').value,
    bilde: localStorage.getItem('bildeData_' + aktivKube.id) || null,
    tidspunkt: new Date().toLocaleString()
  };
  localStorage.setItem('inspeksjon_' + aktivKube.id, JSON.stringify(data));
  alert("✅ Inspeksjon for " + aktivKube.id + " lagret lokalt!");
}

visKuber();
