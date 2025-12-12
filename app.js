// Counters: styrer automatisk nummerering av bigarder (BG) og kuber (BK)
function _getCounters(){
  try {
    return JSON.parse(localStorage.getItem('counters') || '{}');
  } catch(e) { return {}; }
}
function _saveCounters(obj){
  localStorage.setItem('counters', JSON.stringify(obj || {}));
}
function _zeroPad(num, width){
  const s = String(num);
  return s.length >= width ? s : '0'.repeat(width - s.length) + s;
}

// Hent neste bigard-kode, oppdater teller
function nextBigardCode(){
  const c = _getCounters();
  if(!c.bigardSeq) c.bigardSeq = 0;
  c.bigardSeq = Number(c.bigardSeq) + 1;
  _saveCounters(c);
  return 'BG' + _zeroPad(c.bigardSeq, 2); // BG01
}

// Hent neste kube-kode, oppdater teller
function nextKubeCode(){
  const c = _getCounters();
  if(!c.kubeSeq) c.kubeSeq = 0;
  c.kubeSeq = Number(c.kubeSeq) + 1;
  _saveCounters(c);
  return 'BK' + _zeroPad(c.kubeSeq, 3); // BK001
}

// Migration helper: hvis det allerede finnes kuber/bigarder uten kode, opprett dem
function ensureCodesForExistingData(){
  try{
    const bigarder = JSON.parse(localStorage.getItem('bigarder') || '[]');
    const kuber = JSON.parse(localStorage.getItem('kuber') || '[]');
    const c = _getCounters();
    // Oppdater counters til å være minst like store som eksisterende tall i koder
    bigarder.forEach(b=>{
      if(b.kode && b.kode.startsWith('BG')){
        const n = parseInt(b.kode.slice(2),10);
        if(!isNaN(n) && (!c.bigardSeq || n > c.bigardSeq)) c.bigardSeq = n;
      }
    });
    kuber.forEach(k=>{
      if(k.kode && k.kode.startsWith('BK')){
        const n = parseInt(k.kode.slice(2),10);
        if(!isNaN(n) && (!c.kubeSeq || n > c.kubeSeq)) c.kubeSeq = n;
      }
    });
    _saveCounters(c);
  } catch(e){ /* ignore */ }
}
// localStorage helpers for kuber
function getKuber(){
  return JSON.parse(localStorage.getItem('kuber') || '[]');
}
function saveKuber(arr){
  localStorage.setItem('kuber', JSON.stringify(arr));
}
function saveKube(obj){
  const a = getKuber();
  // gi kuben id hvis den ikke har
  if(!obj.id) obj.id = 'kube-' + Date.now();
  if(!obj.opprettet) obj.opprettet = Date.now();
  a.unshift(obj);
  saveKuber(a);
}
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
