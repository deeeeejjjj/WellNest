let water = 0;

function changeWater(amount) {
  water = Math.max(0, water + amount);
  document.getElementById('water-count').textContent = water;
}

function saveData() {
  const data = {
    water: water,
    exercise: document.getElementById('exercise').value,
    sleep: document.getElementById('sleep').value,
    habits: Array.from(document.querySelectorAll('.habit')).map(h => h.checked)
  };
  localStorage.setItem('wellnessData', JSON.stringify(data));
  document.getElementById('message').textContent = 'Progress saved!';
}