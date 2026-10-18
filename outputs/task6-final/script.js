const KEY = 'wellnestEntry';
const IDS = ['water','water-goal','activity','activity-goal','sleep','sleep-goal','personal-goal'];

const LIBRARY = [
  { topic:'Nutrition', title:'Balanced plates', text:'Eating a variety of foods such as vegetables, fruits, grains, and protein sources is a common general approach to nutrition.' },
  { topic:'Nutrition', title:'Reading food labels', text:'Food labels list ingredients and nutrition facts that can help you compare products.' },
  { topic:'Exercise', title:'Moving through the day', text:'Short walks and stretching breaks can help break up long periods of sitting.' },
  { topic:'Exercise', title:'Start gradually', text:'Many people find it easier to build a routine by starting with small, comfortable activities.' },
  { topic:'Hygiene', title:'Handwashing basics', text:'Washing hands with soap and water is a widely recommended hygiene habit.' },
  { topic:'Hygiene', title:'Personal items', text:'Keeping personal items like towels and water bottles clean supports everyday hygiene.' },
  { topic:'Stress Management', title:'Take a pause', text:'Slow breathing or a short break away from screens are simple ways some people reset during busy days.' },
  { topic:'Stress Management', title:'Talk to someone', text:'Sharing concerns with a trusted friend, family member, or counselor can be helpful.' }
];

const TOPIC_ICONS = { 'Nutrition':'leaf', 'Exercise':'heart', 'Hygiene':'drop', 'Stress Management':'moon' };
function $(id){ return document.getElementById(id); }

function loadEntry(){
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || '{}');
    IDS.forEach(id => { $(id).value = data[id] ?? ''; });
  } catch(e){ /* storage unavailable or corrupt: start empty */ }
  renderProgress();
}

function saveEntry(e){
  e.preventDefault();
  const data = {};
  IDS.forEach(id => data[id] = $(id).value);
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    $('tracker-status').textContent = 'Entry saved in this browser.';
  } catch(err){
    $('tracker-status').textContent = 'Could not save in this browser.';
  }
  renderProgress();
}

function clearEntry(){
  IDS.forEach(id => $(id).value = '');
  try { localStorage.removeItem(KEY); } catch(e){}
  $('tracker-status').textContent = 'Entry cleared.';
  renderProgress();
}

function updateMeters(){
  [['water','water-goal'],['activity','activity-goal'],['sleep','sleep-goal']].forEach(([v, g]) => {
    const val = parseFloat($(v).value), goal = parseFloat($(g).value);
    const pct = (!isNaN(val) && goal > 0) ? Math.min(100, Math.round(val / goal * 100)) : 0;
    const card = $(v).closest('.metric');
    card.style.setProperty('--pct', pct + '%');
    card.querySelector('.pct').textContent = pct + '%';
  });
}

function renderProgress(){
  updateMeters();
  const rows = [
    ['Water','water','water-goal','glasses'],
    ['Activity','activity','activity-goal','minutes'],
    ['Sleep','sleep','sleep-goal','hours']
  ];
  const ul = $('progress');
  ul.innerHTML = '';
  rows.forEach(([name, v, g, unit]) => {
    const val = parseFloat($(v).value), goal = parseFloat($(g).value);
    if (isNaN(val)) return;
    const li = document.createElement('li');
    const goalText = isNaN(goal) || goal <= 0 ? 'no goal set' : `goal ${goal} ${unit}`;
    li.textContent = `${name}: ${val} ${unit} (${goalText})`;
    if (!isNaN(goal) && goal > 0) {
      const p = document.createElement('progress');
      p.max = goal; p.value = Math.min(val, goal);
      p.setAttribute('aria-label', `${name} progress`);
      li.appendChild(p);
    }
    ul.appendChild(li);
  });
  const g = $('personal-goal').value.trim();
  if (g) { const li = document.createElement('li'); li.textContent = `My goal: ${g}`; ul.appendChild(li); }
}

function renderLibrary(){
  const f = $('topic-filter').value;
  const list = $('library-list');
  list.innerHTML = '';
  const shown = LIBRARY.filter(i => f === 'all' || i.topic === f);
  $('library-status').textContent = `Showing ${shown.length} of ${LIBRARY.length} items`;
  shown.forEach(i => {
    const a = document.createElement('article');
    a.className = 'card';
    const h = document.createElement('h3'); h.textContent = i.title;
    const t = document.createElement('p'); t.className = 'tag'; t.textContent = i.topic;
    const p = document.createElement('p'); p.textContent = i.text;
    a.dataset.topic = i.topic;
    const ic = document.createElement('span');
    ic.className = 'card-icon'; ic.setAttribute('aria-hidden', 'true');
    ic.innerHTML = '<svg class="icon"><use href="#i-' + TOPIC_ICONS[i.topic] + '"/></svg>';
    a.append(ic, h, t, p);
    list.appendChild(a);
  });
}

const reminders = []; let nextId = 1;

function addReminder(e){
  e.preventDefault();
  const text = $('reminder-text').value;
  const mins = parseInt($('reminder-min').value, 10);
  if (!mins || mins < 1) { $('reminder-alert').textContent = 'Enter a number of minutes from 1 to 240.'; return; }
  const r = { id: nextId++, text, mins };
  r.timer = setInterval(() => { $('reminder-alert').textContent = `Reminder: ${r.text}`; }, mins * 60000);
  reminders.push(r);
  renderReminders();
}

function removeReminder(id){
  const i = reminders.findIndex(r => r.id === id);
  if (i > -1) { clearInterval(reminders[i].timer); reminders.splice(i, 1); }
  renderReminders();
}

function renderReminders(){
  const ul = $('reminder-list');
  ul.innerHTML = '';
  reminders.forEach(r => {
    const li = document.createElement('li');
    const s = document.createElement('span'); s.textContent = `${r.text}, every ${r.mins} min`;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'secondary'; b.textContent = 'Remove';
    b.setAttribute('aria-label', `Remove reminder: ${r.text}`);
    b.addEventListener('click', () => removeReminder(r.id));
    li.append(s, b);
    ul.appendChild(li);
  });
}

$('tracker-form').addEventListener('submit', saveEntry);
$('clear-btn').addEventListener('click', clearEntry);
$('topic-filter').addEventListener('change', renderLibrary);
$('reminder-form').addEventListener('submit', addReminder);
loadEntry();
renderLibrary();

const CHECKLIST = [
  { item:'Water bottle', category:'Hydration', description:'Keep a water bottle within reach while studying.' },
  { item:'Short stretch break', category:'Activity', description:'Stand up and stretch after sitting for a while.' },
  { item:'Regular meal times', category:'Nutrition', description:'Try to eat meals at consistent times when possible.' },
  { item:'Wash hands', category:'Hygiene', description:'Wash hands with soap and water before eating.' },
  { item:'Wind-down routine', category:'Sleep', description:'Set aside a quiet period before bed, away from screens.' },
  { item:'Mindful pause', category:'Stress Management', description:'Pause for a few slow breaths during a busy day.' }
];
const CHECK_ICONS = { 'Hydration':'drop', 'Activity':'zap', 'Nutrition':'leaf', 'Hygiene':'heart', 'Sleep':'moon', 'Stress Management':'bell' };
const CHECK_KEY = 'wellnestChecklist';

function loadChecked(){
  try { return JSON.parse(localStorage.getItem(CHECK_KEY) || '[]'); } catch(e){ return []; }
}
function saveChecked(){
  const ids = CHECKLIST.map((c, i) => 'habit-' + i).filter(id => $(id).checked);
  try { localStorage.setItem(CHECK_KEY, JSON.stringify(ids)); } catch(e){}
  updateChecklistStatus();
}
function updateChecklistStatus(){
  const done = CHECKLIST.filter((c, i) => $('habit-' + i).checked).length;
  const all = done === CHECKLIST.length;
  $('checklist-status').textContent = `${done} of ${CHECKLIST.length} habits completed` + (all ? '. Nice work today.' : '');
  const sec = $('checklist');
  sec.style.setProperty('--cp', Math.round(done / CHECKLIST.length * 100) + '%');
  sec.classList.toggle('all-done', all);
}
function renderChecklist(){
  const saved = loadChecked();
  const ul = $('checklist-list');
  ul.innerHTML = '';
  CHECKLIST.forEach((c, i) => {
    const id = 'habit-' + i;
    const li = document.createElement('li');
    li.dataset.category = c.category;
    const icon = document.createElement('span');
    icon.className = 'habit-icon'; icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = '<svg class="icon"><use href="#i-' + CHECK_ICONS[c.category] + '"/></svg>';
    const cb = document.createElement('input');
    cb.type = 'checkbox'; cb.id = id; cb.checked = saved.includes(id);
    cb.addEventListener('change', saveChecked);
    const label = document.createElement('label');
    label.htmlFor = id;
    const strong = document.createElement('strong'); strong.textContent = c.item;
    const cat = document.createElement('span'); cat.className = 'tag'; cat.textContent = c.category;
    const desc = document.createElement('span'); desc.className = 'desc'; desc.textContent = c.description;
    label.append(strong, cat, document.createElement('br'), desc);
    li.append(cb, icon, label);
    ul.appendChild(li);
  });
  updateChecklistStatus();
}
function resetChecklist(){
  CHECKLIST.forEach((c, i) => { $('habit-' + i).checked = false; });
  saveChecked();
}
$('checklist-reset').addEventListener('click', resetChecklist);
renderChecklist();

/* Hero photo: hide the photo slot if images/hero-photo.jpg is missing, so the illustration shows */
(function(){
  const img = document.querySelector('.hero-art .photo');
  if (!img) return;
  const hide = () => { img.hidden = true; };
  img.addEventListener('error', hide);
  if (img.complete && img.naturalWidth === 0) hide();
})();

/* Scroll reveal (skipped when reduced motion is preferred or IntersectionObserver is missing) */
(function(){
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  const items = document.querySelectorAll('main > section:not(.hero), .features .feature, .quickbar');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  items.forEach(el => { el.classList.add('reveal'); io.observe(el); });
})();

/* Photo fallback: if a photo file is missing, use the drawn illustration instead */
document.querySelectorAll('img[data-fallback]').forEach(img => {
  const swap = () => { const f = img.dataset.fallback; if (f && img.getAttribute('src') !== f) img.src = f; };
  img.addEventListener('error', swap);
  if (img.complete && img.naturalWidth === 0) swap();
});

/* Live meters while typing */
['water','water-goal','activity','activity-goal','sleep','sleep-goal'].forEach(id => $(id).addEventListener('input', updateMeters));