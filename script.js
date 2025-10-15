/* ADG static site: load projects, language toggle, modal, contact demo */

// helpers
const el = sel => document.querySelector(sel);
const els = sel => Array.from(document.querySelectorAll(sel));

// language setup
const LANG_KEY = 'adg-lang';
function setLang(lang){
  document.body.classList.toggle('en', lang === 'en');
  document.body.classList.toggle('mn', lang === 'mn');
  els('[data-mn]').forEach(el=>{
    el.textContent = (lang === 'mn') ? el.getAttribute('data-mn') : (el.getAttribute('data-en') || el.getAttribute('data-mn'));
  });
  el('#langBtn').textContent = (lang === 'mn') ? 'EN' : 'MN';
  localStorage.setItem(LANG_KEY, lang);
}
const savedLang = localStorage.getItem(LANG_KEY) || 'mn';
setLang(savedLang);
el('#langBtn').addEventListener('click', ()=> setLang(document.body.classList.contains('en') ? 'mn' : 'en'));

// projects: priority: localStorage 'adg-projects' (admin edits) else fetch projects.json
async function loadProjects(){
  const grid = el('#grid');
  grid.innerHTML = '<p style="opacity:.6">Loading…</p>';
  let data = null;

  // local admin override
  try{
    const local = localStorage.getItem('adg-projects');
    if(local){
      data = JSON.parse(local);
    } else {
      const resp = await fetch('projects.json', {cache:'no-store'});
      data = await resp.json();
    }
  }catch(e){
    console.error('Could not load projects', e);
    data = {projects: []};
  }

  grid.innerHTML = '';
  (data.projects || []).forEach((p, idx) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="img" style="background-image:url('${p.image || ''}'); min-height:${p.height||180}px"></div>
      <div class="meta">
        <div class="title" data-mn="${p.title_mn||p.title}" data-en="${p.title_en||p.title}">${p.title}</div>
        <div class="sub" data-mn="${p.location_mn||p.location}" data-en="${p.location_en||p.location}">${p.location}</div>
      </div>
    `;
    card.addEventListener('click', ()=> openModal(p));
    grid.appendChild(card);
  });
}

// modal
function openModal(p){
  const modal = el('#modal');
  el('#modalTitle').textContent = p.title_mn || p.title || '';
  el('#modalLoc').textContent = p.location_mn || p.location || '';
  el('#modalYear').textContent = p.year || '';
  el('#modalDesc').textContent = p.desc_mn || p.desc_en || p.description || '';
  el('#modalGallery').style.backgroundImage = `url('${p.image || ''}')`;
  modal.setAttribute('aria-hidden','false');
}
el('#modalClose')?.addEventListener('click', ()=> el('#modal').setAttribute('aria-hidden','true'));
el('#modal').addEventListener('click', (e)=> { if(e.target === el('#modal')) el('#modal').setAttribute('aria-hidden','true'); });

// contact demo
el('#contactForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const btn = el('.btn');
  btn.textContent = document.body.classList.contains('en') ? 'Sent' : 'Илгээлээ';
  setTimeout(()=> btn.textContent = document.body.classList.contains('en') ? 'Send' : 'Илгээх', 1500);
});

// init
loadProjects();
