const rupee = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const now = new Date();
const hour = now.getHours();
const greetingText = document.querySelector('#greetingText');
const greetingIcon = document.querySelector('#greetingIcon');

if (hour < 12) { greetingText.textContent = 'Good morning'; greetingIcon.textContent = '☀'; }
else if (hour < 17) { greetingText.textContent = 'Good afternoon'; greetingIcon.textContent = '◐'; }
else { greetingText.textContent = 'Good evening'; greetingIcon.textContent = '☾'; }

const dateFormatter = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
document.querySelector('#todayDate').textContent = dateFormatter.format(now);
document.querySelector('#footerDate').textContent = `© ${now.getFullYear()} FinSpark`;

const income = document.querySelector('#income');
const expense = document.querySelector('#expense');
const incomeValue = document.querySelector('#incomeValue');
const expenseValue = document.querySelector('#expenseValue');
const savingValue = document.querySelector('#savingValue');

function updatePlanner() {
  let incomeAmount = Number(income.value);
  let expenseAmount = Number(expense.value);
  if (expenseAmount > incomeAmount) { expenseAmount = incomeAmount; expense.value = incomeAmount; }
  const saving = Math.max(0, incomeAmount - expenseAmount);
  incomeValue.textContent = rupee.format(incomeAmount);
  expenseValue.textContent = rupee.format(expenseAmount);
  savingValue.textContent = rupee.format(saving);
  document.querySelector('#safeSpend').textContent = rupee.format(Math.round(saving / 30));
}

income.addEventListener('input', updatePlanner);
expense.addEventListener('input', updatePlanner);
updatePlanner();
