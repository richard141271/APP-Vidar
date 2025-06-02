
function visBilde(event) {
  const img = document.getElementById('forhåndsvisning');
  const fil = event.target.files[0];
  if (fil) {
    const reader = new FileReader();
    reader.onload = function(e) {
      img.src = e.target.result;
      img.style.display = 'block';
      localStorage.setItem('bildeData', e.target.result);
    };
    reader.readAsDataURL(fil);
  }
}

function lagreInspeksjon() {
  const data = {
    temperatur: document.getElementById('temp').value,
    vær: document.getElementById('vær').value,
    notater: document.getElementById('notat').value,
    bilde: localStorage.getItem('bildeData') || null,
    tidspunkt: new Date().toLocaleString()
  };
  localStorage.setItem('sisteInspeksjon', JSON.stringify(data));
  alert("✅ Inspeksjon lagret lokalt! Husk at data kan gå tapt hvis du tømmer nettleserdata.");
}
