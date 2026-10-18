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

function renderProgress(){
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
  LIBRARY.filter(i => f === 'all' || i.topic === f).forEach(i => {
    const a = document.createElement('article');
    a.className = 'card';
    const h = document.createElement('h3'); h.textContent = i.title;
    const t = document.createElement('p'); t.className = 'tag'; t.textContent = i.topic;
    const p = document.createElement('p'); p.textContent = i.text;
    a.append(h, t, p);
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