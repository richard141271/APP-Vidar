// enkel storage-api
/* --- STORAGE HELPERS FOR KUBER (legg dette inn i app.js) --- */

// canonical helpers (bruk 'kuber' som localStorage-nøkkel)
function getKuber(){
  return JSON.parse(localStorage.getItem('kuber') || '[]');
}
function saveKuber(arr){
  localStorage.setItem('kuber', JSON.stringify(arr));
}
function saveKube(obj){
  const a = getKuber();
  if(!obj.id) obj.id = 'kube-' + Date.now();      // gi kuben en id hvis ikke satt
  if(!obj.opprettet) obj.opprettet = Date.now(); // sett opprettet-tid
  a.unshift(obj);
  saveKuber(a);
}

// backward-compatible aliases (hvis andre steder i koden bruker disse navnene)
if(typeof window.getBikuber === 'undefined') window.getBikuber = getKuber;
if(typeof window.saveBikuber === 'undefined') window.saveBikuber = saveKuber;
if(typeof window.saveKube === 'undefined') window.saveKube = saveKube; // hvis ikke allerede definert
function getBigarder(){ return JSON.parse(localStorage.getItem('bigarder')||'[]'); }
function saveBigarder(arr){ localStorage.setItem('bigarder', JSON.stringify(arr)); }
function saveBigard(obj){ const a=getBigarder(); a.unshift(obj); saveBigarder(a); }
function getBikuber(){ return JSON.parse(localStorage.getItem('kuber')||'[]'); }
function saveKube(obj){ const a=getBikuber(); a.unshift(obj); localStorage.setItem('kuber', JSON.stringify(a)); }

// wrappers for form pages
function saveBigard(data){ const a=getBigarder(); a.unshift(data); saveBigarder(a); }
function saveKube(data){ const a=getBikuber(); a.unshift(data); localStorage.setItem('kuber', JSON.stringify(a)); }

// små hjelpefunksjoner
function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]); }

/* INSPEKSJONER - localStorage */
function getInspeksjoner(){ return JSON.parse(localStorage.getItem('inspeksjoner')||'[]'); }
function saveInspeksjoner(arr){ localStorage.setItem('inspeksjoner', JSON.stringify(arr)); }
function saveInspeksjon(obj){ const a=getInspeksjoner(); a.unshift(obj); saveInspeksjoner(a); }
function removeInspeksjon(id){ const a=getInspeksjoner().filter(i=>i.id!==id); saveInspeksjoner(a); }

/* hjelp: slette inspeksjon wrapper */
function deleteInspeksjon(id){ removeInspeksjon(id); }

/* utvider saveKube for å sette opprettet-tid hvis ikke */
function saveKube(obj){
  const a=getBikuber();
  if(!obj.opprettet) obj.opprettet = Date.now();
  a.unshift(obj); localStorage.setItem('kuber', JSON.stringify(a));
}
