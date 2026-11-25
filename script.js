const rupee = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const income = document.querySelector('#income');
const expense = document.querySelector('#expense');
const incomeValue = document.querySelector('#incomeValue');
const expenseValue = document.querySelector('#expenseValue');
const savingValue = document.querySelector('#savingValue');

function updatePlanner() {
  let incomeAmount = Number(income.value);
  let expenseAmount = Number(expense.value);

  if (expenseAmount > incomeAmount) {
    expense.value = incomeAmount;
    expenseAmount = incomeAmount;
  }

  incomeValue.textContent = rupee.format(incomeAmount);
  expenseValue.textContent = rupee.format(expenseAmount);
  savingValue.textContent = rupee.format(Math.max(0, incomeAmount - expenseAmount));

  const incomeProgress = ((incomeAmount - 5000) / (200000 - 5000)) * 100;
  const expenseProgress = (expenseAmount / 200000) * 100;
  income.style.setProperty('--range-progress', `${incomeProgress}%`);
  expense.style.setProperty('--range-progress', `${expenseProgress}%`);
}

income.addEventListener('input', updatePlanner);
expense.addEventListener('input', updatePlanner);
updatePlanner();
