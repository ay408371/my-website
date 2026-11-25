const money = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const fmt = value => `₹${money.format(Math.max(0, Number(value) || 0))}`;
const byId = id => document.getElementById(id);
const incomeInput = byId('incomeInput');
const expenseInput = byId('expenseInput');
const categories = [
  { id: 'housingInput', name: 'Housing / rent', color: '#4567a8' },
  { id: 'foodInput', name: 'Groceries', color: '#8297d0' },
  { id: 'schoolInput', name: 'School fees', color: '#e5ad83' },
  { id: 'billsInput', name: 'Electricity & water', color: '#79aaa6' },
  { name: 'Medical', value: 3000, color: '#9eabc7' },
  { name: 'Loan payments', value: 5000, color: '#d2bd8d' },
  { name: 'Lifestyle', value: 4500, color: '#8292a8' },
  { name: 'Festivals', value: 0, color: '#b7c8b3' }
];
const snapshotKey = 'finspark-blue-snapshots-v1';
const goalKey = 'finspark-blue-goals-v1';

function values() {
  const income = Math.max(0, Number(incomeInput.value) || 0);
  const expenses = Math.max(0, Number(expenseInput.value) || 0);
  return { income, expenses, left: Math.max(0, income - expenses), spent: income ? Math.min(100, expenses / income * 100) : 0 };
}
function renderBudget() {
  const { income, expenses, left, spent } = values();
  const rate = income ? left / income * 100 : 0;
  byId('heroRemaining').textContent = fmt(left); byId('heroLeft').textContent = fmt(left);
  byId('heroIncome').textContent = fmt(income); byId('heroExpenses').textContent = fmt(expenses);
  byId('incomeMetric').textContent = fmt(income); byId('expenseMetric').textContent = fmt(expenses); byId('leftMetric').textContent = fmt(left);
  byId('savingsRate').textContent = `${rate.toFixed(1)}%`; byId('spentCaption').textContent = `${spent.toFixed(1)}%`;
  byId('ringPercent').textContent = `${Math.round(spent)}%`; byId('spendRing').style.setProperty('--spend', `${spent}%`);
  byId('donutTotal').textContent = fmt(expenses); byId('expenseDonut').style.setProperty('--donut-total', `${Math.min(spent,100)}%`);
  renderLegend(expenses); renderTip(income); renderSafety();
}
function renderLegend(total) {
  const items = categories.map(item => ({ ...item, amount: item.id ? Math.max(0, Number(byId(item.id).value) || 0) : item.value }));
  const sum = items.reduce((a, x) => a + x.amount, 0) || total || 1;
  byId('legend').innerHTML = items.map(item => `<div class="legend-item"><span class="legend-name"><i style="--dot:${item.color}"></i>${item.name}</span><span>${fmt(item.amount)} · ${Math.round(item.amount / sum * 100)}%</span></div>`).join('');
  const stops = []; let cursor = 0;
  items.forEach(item => { const next = cursor + item.amount / sum * 100; stops.push(`${item.color} ${cursor}% ${next}%`); cursor = next; });
  byId('expenseDonut').style.background = `conic-gradient(${stops.join(',')})`;
}
function renderTip(income) {
  const bills = Math.max(0, Number(byId('billsInput').value) || 0);
  const percent = income ? bills / income * 100 : 0;
  byId('tipTitle').textContent = 'Electricity & Other Bills';
  byId('tipText').textContent = `Bills use ${percent.toFixed(1)}% of your income. Compare internet plans, switch off unused devices and check your monthly subscriptions to spot savings.`;
  byId('coachText').textContent = values().left > 0 ? `You have ${fmt(values().left)} left after expenses. Consider assigning some of it to a goal or keeping it for unexpected costs.` : 'Your planned expenses are at or above your income. Review a category and see whether any amount can be adjusted.';
}
[incomeInput, expenseInput, ...categories.filter(x => x.id).map(x => byId(x.id))].forEach(input => input.addEventListener('input', renderBudget));

// Soft pointer-follow tilt and touch movement; reduced-motion preferences are respected.
const card = byId('overviewCard');
if (card && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const moveCard = (x, y) => {
    const r = card.getBoundingClientRect();
    const dx = (x - r.left) / r.width - .5; const dy = (y - r.top) / r.height - .5;
    card.style.setProperty('--tilt-x', `${dy * -3}deg`); card.style.setProperty('--tilt-y', `${dx * 4}deg`);
  };
  card.addEventListener('pointermove', e => moveCard(e.clientX, e.clientY));
  card.addEventListener('pointerleave', () => { card.style.setProperty('--tilt-x','0deg'); card.style.setProperty('--tilt-y','0deg'); });
}

function getSnapshots() { try { return JSON.parse(localStorage.getItem(snapshotKey) || '[]'); } catch { return []; } }
function drawSnapshots() {
  const entries = getSnapshots().sort((a,b) => a.month.localeCompare(b.month)).slice(-6);
  const plot = byId('historyPlot');
  if (!entries.length) { plot.innerHTML = '<div class="empty-chart"><span class="chart-emoji">▥</span><b>Your story starts this month.</b><small>Save your first snapshot below.<br />Watch your monthly picture take shape.</small></div>'; return; }
  const max = Math.max(...entries.map(x => x.income), 1);
  plot.innerHTML = `<div class="bars">${entries.map(x => `<div class="bar-group" title="Income ${fmt(x.income)} · Expenses ${fmt(x.expenses)}"><div class="bar-pair"><i class="income-bar" style="height:${Math.max(5,x.income/max*100)}%"></i><i class="expense-bar" style="height:${Math.max(5,x.expenses/max*100)}%"></i></div><small>${x.month}</small></div>`).join('')}</div><div class="chart-legend"><span><i class="income-key"></i>Income</span><span><i class="expense-key"></i>Expenses</span></div>`;
}
byId('snapshotMonth').value = new Date().toISOString().slice(0,7);
byId('saveSnapshot').addEventListener('click', () => {
  const month = byId('snapshotMonth').value; if (!month) return;
  const all = getSnapshots().filter(x => x.month !== month); const {income,expenses} = values(); all.push({month,income,expenses});
  localStorage.setItem(snapshotKey, JSON.stringify(all)); drawSnapshots(); byId('snapshotMessage').textContent = `Saved ${month} on this device.`;
});

function getGoals() { try { return JSON.parse(localStorage.getItem(goalKey) || '[]'); } catch { return []; } }
function drawGoals() {
  const goals = getGoals(); const list = byId('goalsList');
  if (!goals.length) { list.innerHTML = '<p class="empty-goals">No goals yet. Start with something you\'re saving for.</p>'; return; }
  list.innerHTML = goals.map(g => { const pct = Math.min(100, g.saved / g.target * 100); const monthly = Math.max(0, g.target - g.saved) / g.months; return `<article class="goal-item"><div><b>${escapeText(g.name)}</b><span>${fmt(g.saved)} of ${fmt(g.target)} · ${pct.toFixed(0)}%</span></div><i><b style="width:${pct}%"></b></i><small>About ${fmt(monthly)} each month for ${g.months} months</small></article>`; }).join('');
}
function escapeText(text) { const el = document.createElement('span'); el.textContent = text; return el.innerHTML; }
byId('goalForm').addEventListener('submit', e => {
  e.preventDefault(); const target = Number(byId('goalTarget').value); const months = Number(byId('goalMonths').value); const saved = Number(byId('goalSaved').value) || 0;
  if (!target || !months) return;
  const goals = getGoals(); goals.push({name:byId('goalName').value.trim() || 'My savings goal', target, months, saved});
  localStorage.setItem(goalKey, JSON.stringify(goals)); drawGoals(); e.target.reset(); byId('goalTarget').value=60000; byId('goalMonths').value=8; byId('goalSaved').value=0;
});
function renderSafety() {
  const expenses = values().expenses; const months = Number(byId('coverMonths').value) || 6; const saved = Math.max(0, Number(byId('emergencySaved').value) || 0); const target = expenses * months;
  byId('safetyFormula').textContent = `${months} months × ${fmt(expenses)} monthly expenses`;
  byId('safetyTarget').textContent = fmt(target); byId('safetyProgress').textContent = `${fmt(saved)} saved · ${fmt(Math.max(0,target-saved))} still to build`;
  byId('safetyRange').textContent = `3–6 month range: ${fmt(expenses*3)}–${fmt(expenses*6)}`;
}
byId('updateSafety').addEventListener('click', renderSafety); byId('coverMonths').addEventListener('change', renderSafety);
byId('year').textContent = new Date().getFullYear();
renderBudget(); drawSnapshots(); drawGoals();
