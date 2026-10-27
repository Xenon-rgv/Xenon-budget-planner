/**
 * Xenon - Intelligent Capital OS & Budget Engine
 * Local-First Sovereign Architecture with Dual Environment (Demo Sandbox & Real Life Budget)
 * Zero external tracking & 100% Offline Capability
 */

// ============================================================================
// 1. CONFIGURATION & CONSTANTS
// ============================================================================

const CURRENCIES = {
  NGN: { symbol: '₦', name: 'Nigerian Naira (NGN)', rate: 1 },
  USD: { symbol: '$', name: 'US Dollar (USD)', rate: 1 },
  EUR: { symbol: '€', name: 'Euro (EUR)', rate: 1 },
  GBP: { symbol: '£', name: 'British Pound (GBP)', rate: 1 }
};

const CATEGORIES = {
  food: { name: 'Dining & Groceries', icon: 'fa-solid fa-utensils', color: '#06B6D4', defaultBudget: 75000 },
  transport: { name: 'Transit & Commute', icon: 'fa-solid fa-car-side', color: '#38BDF8', defaultBudget: 35000 },
  utilities: { name: 'Power & Utilities', icon: 'fa-solid fa-bolt-lightning', color: '#F59E0B', defaultBudget: 25000 },
  data: { name: 'Data & Telecom', icon: 'fa-solid fa-wifi', color: '#818CF8', defaultBudget: 15000 },
  fuel: { name: 'Fuel & Auxiliary Power', icon: 'fa-solid fa-gas-pump', color: '#F97316', defaultBudget: 35000 },
  housing: { name: 'Housing & Property', icon: 'fa-solid fa-house-chimney', color: '#EC4899', defaultBudget: 60000 },
  support: { name: 'Family & Welfare', icon: 'fa-solid fa-users', color: '#A855F7', defaultBudget: 30000 },
  leisure: { name: 'Leisure & Lifestyle', icon: 'fa-solid fa-martini-glass-citrus', color: '#F43F5E', defaultBudget: 25000 },
  savings: { name: 'Vault & Capital Reserve', icon: 'fa-solid fa-vault', color: '#8B5CF6', defaultBudget: 40000 },
  salary: { name: 'Compensation & Revenue', icon: 'fa-solid fa-briefcase', color: '#10B981', defaultBudget: 0 },
  other: { name: 'Miscellaneous', icon: 'fa-solid fa-cubes', color: '#94A3B8', defaultBudget: 10000 }
};

const CHANNELS = {
  fintech: { name: 'Fintech / Instant Pay', icon: 'fa-solid fa-mobile-screen' },
  transfer: { name: 'Direct Bank Wire', icon: 'fa-solid fa-building-columns' },
  terminal: { name: 'POS Terminal', icon: 'fa-solid fa-cash-register' },
  card: { name: 'Card Payment', icon: 'fa-solid fa-credit-card' },
  cash: { name: 'Physical Cash', icon: 'fa-solid fa-money-bill-wave' }
};

const STORAGE_KEYS = {
  MODE: 'xenon_active_mode_v1',
  SETTINGS: 'xenon_settings_v1',
  DEMO_WORKSPACE: 'xenon_demo_data_v1',
  REAL_WORKSPACE: 'xenon_real_data_v1'
};

// ============================================================================
// 2. STATE ENGINE
// ============================================================================

let state = {
  mode: 'demo', // 'demo' | 'real'
  selectedYear: new Date().getFullYear(),
  selectedMonth: new Date().getMonth(), // 0-indexed
  activeTab: 'dashboard',
  currency: 'NGN',
  settings: {
    theme: 'dark',
    sound: true
  },
  // Active workspace pointer (mirrors demo or real)
  workspace: {
    transactions: [],
    budgets: {
      monthlyOverall: 350000,
      categories: {}
    },
    goals: []
  },
  deletedTxBuffer: null
};

// ============================================================================
// 3. CYBERNETIC SOUND SYNTHESIZER (Web Audio API)
// ============================================================================

class XenonSoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playCash() {
    if (!state.settings.sound) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(659.25, now); // E5
      osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.12); // C6

      osc2.frequency.setValueAtTime(987.77, now); // B5
      osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.12); // E6

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.28);
      osc2.stop(now + 0.28);
    } catch (e) {}
  }

  playDelete() {
    if (!state.settings.sound) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.18);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {}
  }

  playCelebration() {
    if (!state.settings.sound) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const notes = [523.25, 659.25, 783.99, 1046.5];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const startTime = now + idx * 0.07;
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch (e) {}
  }
}

const sfx = new XenonSoundFX();

// ============================================================================
// 4. DATA PERSISTENCE & ENVIRONMENT ISOLATION
// ============================================================================

function loadInitialData() {
  try {
    const rawMode = localStorage.getItem(STORAGE_KEYS.MODE);
    if (rawMode === 'real' || rawMode === 'demo') {
      state.mode = rawMode;
    }

    const rawSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (rawSettings) {
      const parsedSettings = JSON.parse(rawSettings);
      state.settings = { ...state.settings, ...parsedSettings };
      if (parsedSettings.currency) state.currency = parsedSettings.currency;
    }

    loadActiveWorkspace();
  } catch (err) {
    console.error('Data load exception:', err);
    loadActiveWorkspace();
  }
}

function loadActiveWorkspace() {
  const storageKey = state.mode === 'real' ? STORAGE_KEYS.REAL_WORKSPACE : STORAGE_KEYS.DEMO_WORKSPACE;
  const rawData = localStorage.getItem(storageKey);

  if (rawData) {
    try {
      state.workspace = JSON.parse(rawData);
    } catch (e) {
      initWorkspaceDefault();
    }
  } else {
    if (state.mode === 'demo') {
      seedDemoSandbox();
    } else {
      initRealBudgetDefaults();
    }
  }
}

function saveActiveWorkspace() {
  const storageKey = state.mode === 'real' ? STORAGE_KEYS.REAL_WORKSPACE : STORAGE_KEYS.DEMO_WORKSPACE;
  try {
    localStorage.setItem(storageKey, JSON.stringify(state.workspace));
    localStorage.setItem(STORAGE_KEYS.MODE, state.mode);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
      ...state.settings,
      currency: state.currency
    }));
  } catch (err) {
    console.error('Workspace save failed:', err);
  }
}

function initWorkspaceDefault() {
  state.workspace = {
    transactions: [],
    budgets: {
      monthlyOverall: 300000,
      categories: {}
    },
    goals: []
  };
  Object.keys(CATEGORIES).forEach((key) => {
    state.workspace.budgets.categories[key] = CATEGORIES[key].defaultBudget;
  });
}

function initRealBudgetDefaults() {
  initWorkspaceDefault();
  // Clean default for Real Life Budget with starter categories
  state.workspace.budgets.monthlyOverall = 400000;
  state.workspace.goals = [
    {
      id: 'real-goal-1',
      name: 'Primary Emergency Vault',
      target: 500000,
      current: 50000,
      deadline: `${state.selectedYear}-12-31`,
      icon: 'fa-solid fa-shield-halved'
    }
  ];
  saveActiveWorkspace();
}

function seedDemoSandbox() {
  const currentY = state.selectedYear;
  const currentM = String(state.selectedMonth + 1).padStart(2, '0');

  state.workspace = {
    budgets: {
      monthlyOverall: 380000,
      categories: {}
    },
    goals: [
      {
        id: 'demo-goal-1',
        name: 'Annual Property Lease Vault',
        target: 650000,
        current: 440000,
        deadline: `${currentY}-12-15`,
        icon: 'fa-solid fa-house'
      },
      {
        id: 'demo-goal-2',
        name: 'Workstation & Infrastructure',
        target: 450000,
        current: 310000,
        deadline: `${currentY}-11-30`,
        icon: 'fa-solid fa-laptop-code'
      },
      {
        id: 'demo-goal-3',
        name: 'Strategic Liquidity Reserve',
        target: 300000,
        current: 215000,
        deadline: `${currentY}-12-31`,
        icon: 'fa-solid fa-shield-halved'
      }
    ],
    transactions: [
      {
        id: 'tx-1',
        type: 'income',
        title: 'Core Retainer & Salary Credit',
        amount: 450000,
        category: 'salary',
        channel: 'transfer',
        date: `${currentY}-${currentM}-01`,
        note: 'Monthly Net Remittance'
      },
      {
        id: 'tx-2',
        type: 'income',
        title: 'Consulting Advisory Invoice #104',
        amount: 95000,
        category: 'salary',
        channel: 'fintech',
        date: `${currentY}-${currentM}-06`,
        note: 'Sprint milestone payout'
      },
      {
        id: 'tx-3',
        type: 'expense',
        title: 'Bulk Sustenance & Market Provisions',
        amount: 46500,
        category: 'food',
        channel: 'transfer',
        date: `${currentY}-${currentM}-03`,
        note: 'Monthly essentials inventory'
      },
      {
        id: 'tx-4',
        type: 'expense',
        title: 'Main Grid Power Utility Token',
        amount: 18000,
        category: 'utilities',
        channel: 'fintech',
        date: `${currentY}-${currentM}-05`,
        note: 'Prepaid electric recharge'
      },
      {
        id: 'tx-5',
        type: 'expense',
        title: 'High-Speed Fiber Data Pipeline',
        amount: 14500,
        category: 'data',
        channel: 'card',
        date: `${currentY}-${currentM}-07`,
        note: 'Workstation connectivity'
      },
      {
        id: 'tx-6',
        type: 'expense',
        title: 'Auxiliary Generator Fuel Outlay',
        amount: 21000,
        category: 'fuel',
        channel: 'terminal',
        date: `${currentY}-${currentM}-10`,
        note: '20 Litres backup diesel/PMS'
      },
      {
        id: 'tx-7',
        type: 'expense',
        title: 'Express Commute & Ride Logistics',
        amount: 9500,
        category: 'transport',
        channel: 'cash',
        date: `${currentY}-${currentM}-13`,
        note: 'Metropolitan meetings'
      },
      {
        id: 'tx-8',
        type: 'expense',
        title: 'Family Upkeep & Welfare Remittance',
        amount: 35000,
        category: 'support',
        channel: 'transfer',
        date: `${currentY}-${currentM}-15`,
        note: 'Welfare priority allocation'
      },
      {
        id: 'tx-9',
        type: 'expense',
        title: 'Leisure, Dining & Hospitality',
        amount: 11000,
        category: 'leisure',
        channel: 'fintech',
        date: `${currentY}-${currentM}-18`,
        note: 'Weekend networking'
      },
      {
        id: 'tx-10',
        type: 'expense',
        title: 'Capital Vault Allocation (Lease Stash)',
        amount: 45000,
        category: 'savings',
        channel: 'transfer',
        date: `${currentY}-${currentM}-20`,
        note: '#vault-deposit Property fund'
      }
    ]
  };

  Object.keys(CATEGORIES).forEach((key) => {
    state.workspace.budgets.categories[key] = CATEGORIES[key].defaultBudget;
  });

  saveActiveWorkspace();
}

// ============================================================================
// 5. FORMATTING & LOCALIZATION
// ============================================================================

function getCurrencySymbol() {
  return CURRENCIES[state.currency]?.symbol || '₦';
}

function formatCurrency(num, includeDecimals = true) {
  const n = Number(num) || 0;
  const symbol = getCurrencySymbol();
  if (!includeDecimals) {
    return symbol + Math.round(n).toLocaleString('en-US');
  }
  return symbol + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getMonthName(monthIdx) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIdx] || '';
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function isDateInSelectedMonth(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d.getFullYear() === state.selectedYear && d.getMonth() === state.selectedMonth;
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px) scale(0.95)';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

// ============================================================================
// 6. RENDER LOGIC
// ============================================================================

function renderAll() {
  applyTheme();
  updateCurrencyDisplaySymbols();
  renderEnvironmentBanner();
  renderHeader();
  renderHeroAndMetrics();
  renderCategoryPicker();
  renderDashboardTab();
  renderTransactionsTab();
  renderGoalsTab();
  renderToolsTab();
}

function updateCurrencyDisplaySymbols() {
  const symbol = getCurrencySymbol();
  document.querySelectorAll('.currency-symbol-display').forEach((el) => {
    el.textContent = symbol;
  });
  const selector = document.getElementById('currencySelector');
  if (selector && selector.value !== state.currency) {
    selector.value = state.currency;
  }
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.settings.theme);
  const sun = document.getElementById('sunIcon');
  const moon = document.getElementById('moonIcon');
  if (sun && moon) {
    if (state.settings.theme === 'light') {
      sun.classList.remove('hidden');
      moon.classList.add('hidden');
    } else {
      sun.classList.add('hidden');
      moon.classList.remove('hidden');
    }
  }

  const soundOn = document.getElementById('soundOnIcon');
  const soundOff = document.getElementById('soundOffIcon');
  if (soundOn && soundOff) {
    if (state.settings.sound) {
      soundOn.classList.remove('hidden');
      soundOff.classList.add('hidden');
    } else {
      soundOn.classList.add('hidden');
      soundOff.classList.remove('hidden');
    }
  }
}

function renderEnvironmentBanner() {
  const demoBtn = document.getElementById('modeDemoBtn');
  const realBtn = document.getElementById('modeRealBtn');
  const badge = document.getElementById('envStatusBadge');
  const msg = document.getElementById('envStatusMsg');
  const actionBtn = document.getElementById('envActionBtn');

  if (state.mode === 'demo') {
    demoBtn?.classList.add('active');
    realBtn?.classList.remove('active');
    if (badge) badge.innerHTML = `<i class="fa-solid fa-flask"></i> Sandbox Demo`;
    if (msg) msg.textContent = 'Simulated financial workspace. Test transactions, edit limits, and explore metrics safely.';
    if (actionBtn) actionBtn.textContent = 'Switch to Real Budget';
  } else {
    realBtn?.classList.add('active');
    demoBtn?.classList.remove('active');
    if (badge) badge.innerHTML = `<i class="fa-solid fa-shield-halved"></i> Real Life Budget`;
    if (msg) msg.textContent = 'Active sovereign ledger. Completely isolated and preserved on local device storage.';
    if (actionBtn) actionBtn.textContent = 'Switch to Demo Sandbox';
  }
}

function renderHeader() {
  const monthLabel = document.getElementById('currentMonthLabel');
  if (monthLabel) {
    monthLabel.textContent = `${getMonthName(state.selectedMonth)} ${state.selectedYear}`;
  }
}

function getFilteredTransactionsForCurrentMonth() {
  return (state.workspace.transactions || []).filter((tx) => isDateInSelectedMonth(tx.date));
}

function renderHeroAndMetrics() {
  const currentTxs = getFilteredTransactionsForCurrentMonth();

  let totalIncome = 0;
  let totalExpense = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  currentTxs.forEach((tx) => {
    const amt = Number(tx.amount) || 0;
    if (tx.type === 'income') {
      totalIncome += amt;
      incomeCount++;
    } else {
      totalExpense += amt;
      expenseCount++;
    }
  });

  const netBalance = totalIncome - totalExpense;

  // Safe daily spend calculation
  const totalDays = getDaysInMonth(state.selectedYear, state.selectedMonth);
  const today = new Date();
  let daysRemaining = totalDays;

  if (today.getFullYear() === state.selectedYear && today.getMonth() === state.selectedMonth) {
    daysRemaining = Math.max(1, totalDays - today.getDate() + 1);
  } else if (
    new Date(state.selectedYear, state.selectedMonth, 1) <
    new Date(today.getFullYear(), today.getMonth(), 1)
  ) {
    daysRemaining = 0;
  }

  const monthlyBudget = Number(state.workspace.budgets?.monthlyOverall) || 350000;
  const remainingBudget = Math.max(0, monthlyBudget - totalExpense);
  const safeDailySpend = daysRemaining > 0 ? remainingBudget / daysRemaining : 0;

  // Budget progress percentage
  const budgetRatio = monthlyBudget > 0 ? (totalExpense / monthlyBudget) * 100 : 0;
  const budgetPercentClamped = Math.min(100, Math.round(budgetRatio));

  // Capital retention rate
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  // DOM Updates
  const netBalValEl = document.getElementById('netBalanceValue');
  if (netBalValEl) {
    netBalValEl.textContent = Math.abs(netBalance).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    const symbolEl = netBalValEl.parentElement?.querySelector('.currency-symbol-display');
    if (symbolEl) {
      symbolEl.textContent = netBalance < 0 ? `-${getCurrencySymbol()}` : getCurrencySymbol();
      symbolEl.style.color = netBalance < 0 ? 'var(--coral-light)' : 'var(--xenon-cyan-glow)';
    }
  }

  const safeDailyValEl = document.getElementById('safeDailySpendValue');
  if (safeDailyValEl) {
    safeDailyValEl.textContent = formatCurrency(safeDailySpend) + '/day';
  }

  const daysRemEl = document.getElementById('daysRemainingLabel');
  if (daysRemEl) {
    daysRemEl.textContent = daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Period closed';
  }

  const percentUsedEl = document.getElementById('budgetPercentUsed');
  if (percentUsedEl) percentUsedEl.textContent = `${Math.round(budgetRatio)}%`;

  const budgetSpentRatioEl = document.getElementById('budgetSpentRatio');
  if (budgetSpentRatioEl) {
    budgetSpentRatioEl.textContent = `${formatCurrency(totalExpense, false)} / ${formatCurrency(monthlyBudget, false)}`;
  }

  const meterFillEl = document.getElementById('meterBarFill');
  if (meterFillEl) {
    meterFillEl.style.width = `${budgetPercentClamped}%`;
    if (budgetRatio > 90) {
      meterFillEl.style.background = 'linear-gradient(90deg, #f59e0b 0%, #f43f5e 100%)';
    } else {
      meterFillEl.style.background = 'linear-gradient(90deg, #06b6d4 0%, #8b5cf6 65%, #f59e0b 100%)';
    }
  }

  const budgetStatusText = document.getElementById('budgetStatusText');
  if (budgetStatusText) {
    if (totalExpense > monthlyBudget) {
      budgetStatusText.textContent = `Warning: Monthly threshold exceeded by ${formatCurrency(totalExpense - monthlyBudget, false)}!`;
      budgetStatusText.style.color = 'var(--coral-light)';
    } else if (budgetRatio >= 80) {
      budgetStatusText.textContent = `Alert: 80%+ of planned monthly limit consumed.`;
      budgetStatusText.style.color = 'var(--amber-light)';
    } else {
      budgetStatusText.textContent = `Optimal liquidity: ${formatCurrency(remainingBudget, false)} uncommitted buffer remaining.`;
      budgetStatusText.style.color = 'var(--text-dim)';
    }
  }

  // 3-Grid KPI
  const incomeDisp = document.getElementById('totalIncomeDisplay');
  if (incomeDisp) incomeDisp.textContent = formatCurrency(totalIncome);

  const incomeTxEl = document.getElementById('incomeTxCount');
  if (incomeTxEl) incomeTxEl.textContent = `${incomeCount} credit${incomeCount === 1 ? '' : 's'}`;

  const expenseDisp = document.getElementById('totalExpenseDisplay');
  if (expenseDisp) expenseDisp.textContent = formatCurrency(totalExpense);

  const expenseTxEl = document.getElementById('expenseTxCount');
  if (expenseTxEl) expenseTxEl.textContent = `${expenseCount} debit${expenseCount === 1 ? '' : 's'}`;

  const savingsRateDisp = document.getElementById('savingsRateDisplay');
  if (savingsRateDisp) savingsRateDisp.textContent = `${savingsRate}%`;

  const savingsAdvEl = document.getElementById('savingsAdviceText');
  if (savingsAdvEl) {
    if (savingsRate >= 35) savingsAdvEl.textContent = 'High sovereign surplus';
    else if (savingsRate >= 20) savingsAdvEl.textContent = 'Robust capital margin';
    else if (savingsRate > 0) savingsAdvEl.textContent = 'Tight operational margin';
    else savingsAdvEl.textContent = 'Deficit outflow';
  }

  const tabBadge = document.getElementById('transactionsCountBadge');
  if (tabBadge) tabBadge.textContent = currentTxs.length;
}

// ============================================================================
// 7. DASHBOARD TAB: DONUT CHART & ENVELOPES
// ============================================================================

function renderDashboardTab() {
  const currentTxs = getFilteredTransactionsForCurrentMonth();
  const expenses = currentTxs.filter((tx) => tx.type === 'expense');

  const categoryTotals = {};
  let grandTotalExpense = 0;

  expenses.forEach((tx) => {
    const cat = tx.category || 'other';
    const amt = Number(tx.amount) || 0;
    categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
    grandTotalExpense += amt;
  });

  renderDonutChart(categoryTotals, grandTotalExpense);
  renderInsights(categoryTotals, grandTotalExpense);
  renderCategoryEnvelopes(categoryTotals);
}

function renderDonutChart(categoryTotals, total) {
  const svg = document.getElementById('spendingDonutSvg');
  const totalText = document.getElementById('donutTotalText');
  const legend = document.getElementById('donutLegendContainer');
  if (!svg || !legend || !totalText) return;

  totalText.textContent = formatCurrency(total, false);
  svg.innerHTML = '';
  legend.innerHTML = '';

  const entries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0 || total === 0) {
    svg.innerHTML = `<circle cx="120" cy="120" r="85" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="26" />`;
    legend.innerHTML = `
      <div class="legend-item" style="justify-content:center; color: var(--text-dim);">
        <span>No debits logged for this period.</span>
      </div>
    `;
    return;
  }

  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  entries.forEach(([catKey, amt]) => {
    const meta = CATEGORIES[catKey] || CATEGORIES.other;
    const ratio = amt / total;
    const strokeDasharray = `${ratio * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '120');
    circle.setAttribute('cy', '120');
    circle.setAttribute('r', radius.toString());
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', meta.color);
    circle.setAttribute('stroke-width', '26');
    circle.setAttribute('stroke-dasharray', strokeDasharray);
    circle.setAttribute('stroke-dashoffset', strokeDashoffset.toString());
    circle.setAttribute('stroke-linecap', 'butt');
    circle.setAttribute('style', 'transition: stroke-width 0.2s ease; cursor: pointer;');
    circle.setAttribute('title', `${meta.name}: ${formatCurrency(amt)} (${Math.round(ratio * 100)}%)`);

    circle.addEventListener('mouseenter', () => circle.setAttribute('stroke-width', '32'));
    circle.addEventListener('mouseleave', () => circle.setAttribute('stroke-width', '26'));

    svg.appendChild(circle);

    const legItem = document.createElement('div');
    legItem.className = 'legend-item';
    legItem.innerHTML = `
      <div class="legend-left">
        <span class="legend-icon-tag" style="background:${meta.color}22; color:${meta.color}; border: 1px solid ${meta.color}44;">
          <i class="${meta.icon}"></i>
        </span>
        <span>${meta.name}</span>
      </div>
      <div class="legend-amt">
        <span>${formatCurrency(amt, false)}</span>
        <span style="font-size:0.7rem; color:var(--text-dim); margin-left:4px;">(${Math.round(ratio * 100)}%)</span>
      </div>
    `;
    legend.appendChild(legItem);

    accumulatedPercent += ratio;
  });
}

function renderInsights(categoryTotals, totalExpense) {
  const heading = document.getElementById('insightHeading');
  const desc = document.getElementById('insightDesc');
  if (!heading || !desc) return;

  const entries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    heading.textContent = 'System Ready';
    desc.textContent = 'Log transactions or apply automated allocation to activate real-time predictive insights.';
    return;
  }

  const [topCatKey, topAmt] = entries[0];
  const topCat = CATEGORIES[topCatKey] || CATEGORIES.other;
  const topRatio = Math.round((topAmt / totalExpense) * 100);

  if (topCatKey === 'food' && topRatio > 35) {
    heading.textContent = `Sustenance Concentration (${topRatio}%)`;
    desc.textContent = `Provisions have absorbed ${formatCurrency(topAmt, false)}. Consolidating supply procurement runs reduces impulse leakage by up to 20%.`;
  } else if (topCatKey === 'fuel' && topRatio > 20) {
    heading.textContent = `High Auxiliary Energy Outlay (${topRatio}%)`;
    desc.textContent = `Fuel consumption accounts for ${formatCurrency(topAmt, false)}. Check the Energy Modeling tool to calculate solar/inverter parity.`;
  } else if (topCatKey === 'leisure' && topRatio > 25) {
    heading.textContent = `Discretionary Outflow (${topRatio}%)`;
    desc.textContent = `Leisure and lifestyle have absorbed ${formatCurrency(topAmt, false)}. Setting an envelope ceiling preserves strategic target vault allocations.`;
  } else {
    heading.textContent = `Dominant Vector: ${topCat.name} (${topRatio}%)`;
    desc.textContent = `The largest capital outflow for this period is concentrated in ${topCat.name} at ${formatCurrency(topAmt, false)}.`;
  }
}

function renderCategoryEnvelopes(categoryTotals) {
  const container = document.getElementById('envelopesList');
  if (!container) return;

  container.innerHTML = '';
  const envelopeCategories = ['food', 'transport', 'fuel', 'utilities', 'data', 'housing', 'support', 'leisure', 'savings'];

  envelopeCategories.forEach((catKey) => {
    const meta = CATEGORIES[catKey];
    if (!meta) return;

    const limit = (state.workspace.budgets?.categories && state.workspace.budgets.categories[catKey]) || meta.defaultBudget;
    const spent = categoryTotals[catKey] || 0;
    const percent = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;

    let statusPillClass = 'status-safe';
    let statusText = 'Optimal';
    let progressColor = meta.color;

    if (spent > limit) {
      statusPillClass = 'status-danger';
      statusText = 'Ceiling Breached';
      progressColor = 'var(--coral-light)';
    } else if (percent >= 80) {
      statusPillClass = 'status-warning';
      statusText = `${percent}% Used`;
      progressColor = 'var(--amber-light)';
    } else {
      statusText = `${percent}%`;
    }

    const card = document.createElement('div');
    card.className = 'envelope-card';
    card.innerHTML = `
      <div class="env-top-row">
        <div class="env-name-group">
          <div class="env-icon-box" style="border: 1px solid ${meta.color}44; color:${meta.color};">
            <i class="${meta.icon}"></i>
          </div>
          <span class="env-name">${meta.name}</span>
        </div>
        <span class="env-status-pill ${statusPillClass}">${statusText}</span>
      </div>
      <div class="env-amounts-row">
        <span>Disbursed: <strong class="env-spent-text">${formatCurrency(spent, false)}</strong></span>
        <span>Cap: ${formatCurrency(limit, false)}</span>
      </div>
      <div class="env-progress-track">
        <div class="env-progress-fill" style="width: ${percent}%; background: ${progressColor};"></div>
      </div>
    `;

    container.appendChild(card);
  });
}

// ============================================================================
// 8. TRANSACTIONS TAB: LIST & FILTER
// ============================================================================

function renderTransactionsTab() {
  const container = document.getElementById('txListContainer');
  if (!container) return;

  const searchVal = (document.getElementById('txSearchInput')?.value || '').toLowerCase().trim();
  const typeFilter = document.getElementById('txTypeFilter')?.value || 'all';
  const catFilter = document.getElementById('txCategoryFilter')?.value || 'all';
  const chanFilter = document.getElementById('txChannelFilter')?.value || 'all';

  let list = (state.workspace.transactions || []).filter((tx) => isDateInSelectedMonth(tx.date));

  if (typeFilter !== 'all') list = list.filter((tx) => tx.type === typeFilter);
  if (catFilter !== 'all') list = list.filter((tx) => tx.category === catFilter);
  if (chanFilter !== 'all') list = list.filter((tx) => tx.channel === chanFilter);
  if (searchVal) {
    list = list.filter((tx) => {
      const matchTitle = (tx.title || '').toLowerCase().includes(searchVal);
      const matchNote = (tx.note || '').toLowerCase().includes(searchVal);
      const matchCat = (CATEGORIES[tx.category]?.name || '').toLowerCase().includes(searchVal);
      return matchTitle || matchNote || matchCat;
    });
  }

  list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="fa-solid fa-folder-open"></i></div>
        <h4 class="empty-title">No transactions recorded</h4>
        <p class="empty-desc">No entries match your search criteria for ${getMonthName(state.selectedMonth)} ${state.selectedYear}. Use the Record Flow action to append a new transaction.</p>
      </div>
    `;
    return;
  }

  const groups = {};
  list.forEach((tx) => {
    const dStr = tx.date;
    if (!groups[dStr]) groups[dStr] = [];
    groups[dStr].push(tx);
  });

  const sortedDateKeys = Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  sortedDateKeys.forEach((dateKey) => {
    const dateGroup = document.createElement('div');
    dateGroup.className = 'tx-date-group';

    const dObj = new Date(dateKey + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateTitle = dObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    if (dObj.getTime() === today.getTime()) {
      dateTitle = `Today &bull; ${dateTitle}`;
    } else if (dObj.getTime() === yesterday.getTime()) {
      dateTitle = `Yesterday &bull; ${dateTitle}`;
    }

    dateGroup.innerHTML = `<div class="tx-date-header">${dateTitle}</div>`;

    groups[dateKey].forEach((tx) => {
      const cat = CATEGORIES[tx.category] || CATEGORIES.other;
      const chan = CHANNELS[tx.channel] || { name: 'Settlement', icon: 'fa-solid fa-credit-card' };
      const isIncome = tx.type === 'income';

      const card = document.createElement('div');
      card.className = 'tx-card';
      card.innerHTML = `
        <div class="tx-left">
          <div class="tx-cat-badge" style="background:${cat.color}1c; border-color:${cat.color}35; color:${cat.color};">
            <i class="${cat.icon}"></i>
          </div>
          <div class="tx-info">
            <span class="tx-title">${escapeHtml(tx.title)}</span>
            <div class="tx-sub-line">
              <span><i class="${chan.icon}"></i> ${chan.name}</span>
              ${tx.note ? `<span>&bull;</span><span class="tx-tag-badge">${escapeHtml(tx.note)}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="tx-right">
          <div class="tx-amount ${isIncome ? 'text-cyan' : 'text-coral'}">
            ${isIncome ? '+' : '-'}${formatCurrency(tx.amount)}
          </div>
          <div class="tx-actions-menu">
            <button class="tx-action-btn edit-tx-btn" data-id="${tx.id}" title="Edit transaction" aria-label="Edit transaction">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="tx-action-btn delete-tx-btn" data-id="${tx.id}" title="Delete transaction" aria-label="Delete transaction">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;

      dateGroup.appendChild(card);
    });

    container.appendChild(dateGroup);
  });

  container.querySelectorAll('.edit-tx-btn').forEach((btn) => {
    btn.addEventListener('click', () => openEditTxModal(btn.dataset.id));
  });

  container.querySelectorAll('.delete-tx-btn').forEach((btn) => {
    btn.addEventListener('click', () => deleteTransaction(btn.dataset.id));
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ============================================================================
// 9. CAPITAL VAULTS (GOALS) TAB
// ============================================================================

function renderGoalsTab() {
  const container = document.getElementById('goalsCardsGrid');
  const totalLockedEl = document.getElementById('totalGoalsLockedDisplay');
  const totalTargetEl = document.getElementById('totalGoalsTargetDisplay');
  const totalPercentEl = document.getElementById('totalGoalsPercentDisplay');

  if (!container) return;

  container.innerHTML = '';

  let totalLocked = 0;
  let totalTarget = 0;

  (state.workspace.goals || []).forEach((g) => {
    totalLocked += Number(g.current) || 0;
    totalTarget += Number(g.target) || 0;
  });

  const overallPercent = totalTarget > 0 ? Math.min(100, Math.round((totalLocked / totalTarget) * 100)) : 0;

  if (totalLockedEl) totalLockedEl.textContent = formatCurrency(totalLocked, false);
  if (totalTargetEl) totalTargetEl.textContent = formatCurrency(totalTarget, false);
  if (totalPercentEl) totalPercentEl.textContent = `${overallPercent}%`;

  if (!state.workspace.goals || state.workspace.goals.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon"><i class="fa-solid fa-vault"></i></div>
        <h4 class="empty-title">No Capital Vaults Active</h4>
        <p class="empty-desc">Establish your first capital reserve vault for property acquisition, asset replacement, or emergency liquidity.</p>
      </div>
    `;
    return;
  }

  state.workspace.goals.forEach((goal) => {
    const cur = Number(goal.current) || 0;
    const tgt = Number(goal.target) || 1;
    const pct = Math.min(100, Math.round((cur / tgt) * 100));
    const isCompleted = cur >= tgt;

    const card = document.createElement('div');
    card.className = 'goal-card';
    card.innerHTML = `
      <div class="goal-top">
        <div class="goal-info-group">
          <div class="goal-icon-box">
            <i class="${goal.icon || 'fa-solid fa-vault'}"></i>
          </div>
          <div>
            <h4 class="goal-title">${escapeHtml(goal.name)}</h4>
            <span class="goal-deadline">Maturity: ${goal.deadline || 'Indefinite'}</span>
          </div>
        </div>
        ${isCompleted ? '<span class="env-status-pill status-safe">Fully Funded <i class="fa-solid fa-check"></i></span>' : `<span class="env-status-pill status-warning">${pct}%</span>`}
      </div>

      <div class="goal-meter">
        <div class="goal-nums">
          <span class="goal-saved-amt">${formatCurrency(cur, false)} allocated</span>
          <span class="goal-target-amt">Target: ${formatCurrency(tgt, false)}</span>
        </div>
        <div class="goal-progress-bar">
          <div class="goal-progress-fill" style="width: ${pct}%;"></div>
        </div>
      </div>

      <div class="goal-actions-row">
        <button class="btn btn-outline-xenon btn-sm deposit-btn" data-id="${goal.id}" data-name="${escapeHtml(goal.name)}">
          <i class="fa-solid fa-plus"></i>
          <span>Allocate Capital</span>
        </button>
        <div style="display:flex; gap:0.25rem;">
          <button class="tx-action-btn edit-goal-btn" data-id="${goal.id}" title="Edit Vault" aria-label="Edit vault">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="tx-action-btn delete-goal-btn" data-id="${goal.id}" title="Purge Vault" aria-label="Purge vault">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  container.querySelectorAll('.deposit-btn').forEach((btn) => {
    btn.addEventListener('click', () => openDepositModal(btn.dataset.id, btn.dataset.name));
  });

  container.querySelectorAll('.edit-goal-btn').forEach((btn) => {
    btn.addEventListener('click', () => openEditGoalModal(btn.dataset.id));
  });

  container.querySelectorAll('.delete-goal-btn').forEach((btn) => {
    btn.addEventListener('click', () => deleteGoal(btn.dataset.id));
  });
}

// ============================================================================
// 10. CALCULATORS TAB
// ============================================================================

function renderToolsTab() {
  updateSalarySplitter();
  updateGenEstimator();
}

function updateSalarySplitter() {
  const salaryInput = document.getElementById('salaryInput');
  const needsEl = document.getElementById('splitNeedsAmt');
  const wantsEl = document.getElementById('splitWantsAmt');
  const savingsEl = document.getElementById('splitSavingsAmt');

  if (!salaryInput || !needsEl || !wantsEl || !savingsEl) return;

  const salary = Number(salaryInput.value) || 0;
  needsEl.textContent = formatCurrency(salary * 0.5, false);
  wantsEl.textContent = formatCurrency(salary * 0.3, false);
  savingsEl.textContent = formatCurrency(salary * 0.2, false);
}

function updateGenEstimator() {
  const fuelPriceInput = document.getElementById('fuelPriceInput');
  const genHoursInput = document.getElementById('genHoursInput');
  const genSizeSelect = document.getElementById('genSizeSelect');

  const dailyCostEl = document.getElementById('genDailyCost');
  const dailyLitresEl = document.getElementById('genDailyLitres');
  const weeklyCostEl = document.getElementById('genWeeklyCost');
  const monthlyCostEl = document.getElementById('genMonthlyCost');

  if (!fuelPriceInput || !genHoursInput || !genSizeSelect || !dailyCostEl) return;

  const pricePerLitre = Number(fuelPriceInput.value) || 1050;
  const hoursPerDay = Number(genHoursInput.value) || 6;
  const burnRate = Number(genSizeSelect.value) || 1.2;

  const litresPerDay = hoursPerDay * burnRate;
  const dailyCost = litresPerDay * pricePerLitre;
  const weeklyCost = dailyCost * 7;
  const monthlyCost = dailyCost * 30;

  dailyCostEl.textContent = formatCurrency(dailyCost, false);
  if (dailyLitresEl) dailyLitresEl.textContent = `${litresPerDay.toFixed(1)} Litres/day`;
  if (weeklyCostEl) weeklyCostEl.textContent = formatCurrency(weeklyCost, false);
  if (monthlyCostEl) monthlyCostEl.textContent = formatCurrency(monthlyCost, false);
}

// ============================================================================
// 11. CATEGORY PICKER IN MODAL
// ============================================================================

function renderCategoryPicker() {
  const grid = document.getElementById('categoryPickerGrid');
  const hiddenInput = document.getElementById('txCategoryInput');
  if (!grid || !hiddenInput) return;

  grid.innerHTML = '';
  const currentSelected = hiddenInput.value || 'food';

  Object.entries(CATEGORIES).forEach(([key, meta]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `cat-pick-btn ${key === currentSelected ? 'selected' : ''}`;
    btn.dataset.category = key;
    btn.innerHTML = `
      <i class="${meta.icon}" style="color:${meta.color};"></i>
      <span>${meta.name.split('&')[0].trim()}</span>
    `;

    btn.addEventListener('click', () => {
      grid.querySelectorAll('.cat-pick-btn').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      hiddenInput.value = key;
    });

    grid.appendChild(btn);
  });
}

function selectCategoryInPicker(categoryKey) {
  const hiddenInput = document.getElementById('txCategoryInput');
  const grid = document.getElementById('categoryPickerGrid');
  if (hiddenInput) hiddenInput.value = categoryKey;
  if (grid) {
    grid.querySelectorAll('.cat-pick-btn').forEach((btn) => {
      if (btn.dataset.category === categoryKey) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
  }
}

// ============================================================================
// 12. TRANSACTION ACTIONS: ADD / EDIT / DELETE
// ============================================================================

function openAddTxModal(prefill = {}) {
  const overlay = document.getElementById('txModalOverlay');
  const form = document.getElementById('txForm');
  const titleEl = document.getElementById('txModalTitle');
  const editIdInput = document.getElementById('txEditId');

  if (!overlay || !form) return;

  form.reset();
  editIdInput.value = '';
  titleEl.textContent = 'Record Capital Flow';

  const todayStr = new Date().toISOString().split('T')[0];
  document.getElementById('txDateInput').value = prefill.date || todayStr;

  setTxModalType(prefill.type || 'expense');

  const amtInput = document.getElementById('txAmountInput');
  amtInput.value = prefill.amount || '';
  updateAmountPreview(prefill.amount || 0);

  document.getElementById('txTitleInput').value = prefill.title || '';
  selectCategoryInPicker(prefill.category || 'food');

  if (prefill.channel) {
    document.getElementById('txChannelSelect').value = prefill.channel;
  }

  document.getElementById('txNoteInput').value = prefill.note || '';

  overlay.classList.remove('hidden');
  setTimeout(() => amtInput.focus(), 150);
}

function openEditTxModal(txId) {
  const tx = (state.workspace.transactions || []).find((t) => t.id === txId);
  if (!tx) return;

  const overlay = document.getElementById('txModalOverlay');
  const titleEl = document.getElementById('txModalTitle');
  const editIdInput = document.getElementById('txEditId');

  if (!overlay) return;

  titleEl.textContent = 'Edit Ledger Entry';
  editIdInput.value = tx.id;

  setTxModalType(tx.type);
  document.getElementById('txAmountInput').value = tx.amount;
  updateAmountPreview(tx.amount);
  document.getElementById('txTitleInput').value = tx.title;
  selectCategoryInPicker(tx.category || 'food');
  document.getElementById('txChannelSelect').value = tx.channel || 'fintech';
  document.getElementById('txDateInput').value = tx.date;
  document.getElementById('txNoteInput').value = tx.note || '';

  overlay.classList.remove('hidden');
}

function closeTxModal() {
  const overlay = document.getElementById('txModalOverlay');
  if (overlay) overlay.classList.add('hidden');
}

function setTxModalType(type) {
  const expBtn = document.getElementById('typeExpenseBtn');
  const incBtn = document.getElementById('typeIncomeBtn');

  if (type === 'income') {
    incBtn.classList.add('active-income');
    expBtn.classList.remove('active-expense');
  } else {
    expBtn.classList.add('active-expense');
    incBtn.classList.remove('active-income');
  }
}

function getTxModalType() {
  const incBtn = document.getElementById('typeIncomeBtn');
  return incBtn.classList.contains('active-income') ? 'income' : 'expense';
}

function updateAmountPreview(val) {
  const preview = document.getElementById('txAmountFormattedPreview');
  if (preview) {
    const num = Number(val) || 0;
    preview.textContent = formatCurrency(num);
  }
}

function handleSaveTransaction(e) {
  e.preventDefault();

  const editId = document.getElementById('txEditId').value;
  const type = getTxModalType();
  const amount = parseFloat(document.getElementById('txAmountInput').value);
  const title = document.getElementById('txTitleInput').value.trim();
  const category = document.getElementById('txCategoryInput').value;
  const channel = document.getElementById('txChannelSelect').value;
  const date = document.getElementById('txDateInput').value;
  const note = document.getElementById('txNoteInput').value.trim();

  if (isNaN(amount) || amount <= 0) {
    showToast('Please enter a valid amount', 'error');
    return;
  }

  if (editId) {
    const idx = state.workspace.transactions.findIndex((t) => t.id === editId);
    if (idx !== -1) {
      state.workspace.transactions[idx] = {
        ...state.workspace.transactions[idx],
        type,
        amount,
        title,
        category,
        channel,
        date,
        note
      };
      showToast('Entry updated successfully.');
    }
  } else {
    const newTx = {
      id: 'tx-' + Date.now(),
      type,
      amount,
      title,
      category,
      channel,
      date,
      note
    };
    if (!state.workspace.transactions) state.workspace.transactions = [];
    state.workspace.transactions.unshift(newTx);
    sfx.playCash();
    showToast(`${type === 'income' ? 'Inflow' : 'Outflow'} of ${formatCurrency(amount)} recorded.`);
  }

  saveActiveWorkspace();
  closeTxModal();
  renderAll();
}

function deleteTransaction(txId) {
  const idx = state.workspace.transactions.findIndex((t) => t.id === txId);
  if (idx === -1) return;

  const deleted = state.workspace.transactions[idx];
  state.workspace.transactions.splice(idx, 1);
  saveActiveWorkspace();
  sfx.playDelete();
  renderAll();

  state.deletedTxBuffer = deleted;
  const undoHtml = `Transaction removed. <button id="undoDeleteBtn" style="color:var(--xenon-cyan-glow); background:none; border:none; text-decoration:underline; font-weight:bold; cursor:pointer; margin-left:6px;">Undo</button>`;
  showToast(undoHtml, 'success');

  setTimeout(() => {
    const btn = document.getElementById('undoDeleteBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        if (state.deletedTxBuffer) {
          state.workspace.transactions.unshift(state.deletedTxBuffer);
          state.deletedTxBuffer = null;
          saveActiveWorkspace();
          renderAll();
          showToast('Transaction restored.');
        }
      });
    }
  }, 50);
}

// ============================================================================
// 13. BUDGET ENVELOPES MODAL
// ============================================================================

function openBudgetModal() {
  const overlay = document.getElementById('budgetModalOverlay');
  const overallInput = document.getElementById('overallBudgetInput');
  const container = document.getElementById('envelopeInputsContainer');

  if (!overlay || !overallInput || !container) return;

  overallInput.value = state.workspace.budgets?.monthlyOverall || 350000;
  container.innerHTML = '';

  Object.entries(CATEGORIES).forEach(([key, meta]) => {
    if (key === 'salary') return;
    const curVal = (state.workspace.budgets?.categories && state.workspace.budgets.categories[key]) !== undefined
      ? state.workspace.budgets.categories[key]
      : meta.defaultBudget;

    const row = document.createElement('div');
    row.className = 'env-input-row';
    row.innerHTML = `
      <div class="env-input-label">
        <i class="${meta.icon}"></i>
        <span>${meta.name}</span>
      </div>
      <div class="input-currency-wrapper">
        <span class="currency-prefix currency-symbol-display" style="font-size:0.85rem; left:0.6rem;">${getCurrencySymbol()}</span>
        <input type="number" class="env-input-field cat-budget-input" data-category="${key}" value="${curVal}" min="0" step="500">
      </div>
    `;
    container.appendChild(row);
  });

  overlay.classList.remove('hidden');
}

function closeBudgetModal() {
  const overlay = document.getElementById('budgetModalOverlay');
  if (overlay) overlay.classList.add('hidden');
}

function handleSaveBudgets(e) {
  e.preventDefault();

  const overall = parseFloat(document.getElementById('overallBudgetInput').value) || 0;
  if (!state.workspace.budgets) state.workspace.budgets = {};
  state.workspace.budgets.monthlyOverall = overall;

  if (!state.workspace.budgets.categories) state.workspace.budgets.categories = {};

  document.querySelectorAll('.cat-budget-input').forEach((input) => {
    const cat = input.dataset.category;
    const val = parseFloat(input.value) || 0;
    state.workspace.budgets.categories[cat] = val;
  });

  saveActiveWorkspace();
  closeBudgetModal();
  renderAll();
  showToast('Budget limits configured successfully.');
}

// ============================================================================
// 14. CAPITAL VAULTS MODAL & DEPOSITS
// ============================================================================

function openNewGoalModal() {
  const overlay = document.getElementById('goalModalOverlay');
  const form = document.getElementById('goalForm');
  const title = document.getElementById('goalModalTitle');
  const editId = document.getElementById('goalEditId');

  if (!overlay || !form) return;

  form.reset();
  editId.value = '';
  title.textContent = 'Create Capital Vault';

  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  document.getElementById('goalDateInput').value = d.toISOString().split('T')[0];

  overlay.classList.remove('hidden');
}

function openEditGoalModal(goalId) {
  const goal = (state.workspace.goals || []).find((g) => g.id === goalId);
  if (!goal) return;

  const overlay = document.getElementById('goalModalOverlay');
  const title = document.getElementById('goalModalTitle');
  const editId = document.getElementById('goalEditId');

  if (!overlay) return;

  title.textContent = 'Configure Capital Vault';
  editId.value = goal.id;
  document.getElementById('goalNameInput').value = goal.name;
  document.getElementById('goalTargetInput').value = goal.target;
  document.getElementById('goalCurrentInput').value = goal.current;
  document.getElementById('goalDateInput').value = goal.deadline;
  document.getElementById('goalIconSelect').value = goal.icon || 'fa-solid fa-house';

  overlay.classList.remove('hidden');
}

function closeGoalModal() {
  const overlay = document.getElementById('goalModalOverlay');
  if (overlay) overlay.classList.add('hidden');
}

function handleSaveGoal(e) {
  e.preventDefault();

  const editId = document.getElementById('goalEditId').value;
  const name = document.getElementById('goalNameInput').value.trim();
  const target = parseFloat(document.getElementById('goalTargetInput').value);
  const current = parseFloat(document.getElementById('goalCurrentInput').value) || 0;
  const deadline = document.getElementById('goalDateInput').value;
  const icon = document.getElementById('goalIconSelect').value;

  if (isNaN(target) || target <= 0) {
    showToast('Please enter a valid target amount', 'error');
    return;
  }

  if (!state.workspace.goals) state.workspace.goals = [];

  if (editId) {
    const idx = state.workspace.goals.findIndex((g) => g.id === editId);
    if (idx !== -1) {
      state.workspace.goals[idx] = { ...state.workspace.goals[idx], name, target, current, deadline, icon };
      showToast('Vault targets updated.');
    }
  } else {
    const newGoal = {
      id: 'goal-' + Date.now(),
      name,
      target,
      current,
      deadline,
      icon
    };
    state.workspace.goals.push(newGoal);
    sfx.playCash();
    showToast(`Capital Vault "${name}" established.`);
  }

  saveActiveWorkspace();
  closeGoalModal();
  renderAll();
}

function deleteGoal(goalId) {
  if (!confirm('Are you sure you wish to decommission this capital vault?')) return;
  state.workspace.goals = state.workspace.goals.filter((g) => g.id !== goalId);
  saveActiveWorkspace();
  renderAll();
  showToast('Vault decommissioned.');
}

function openDepositModal(goalId, goalName) {
  const overlay = document.getElementById('depositModalOverlay');
  const idInput = document.getElementById('depositGoalId');
  const nameText = document.getElementById('depositGoalNameText');
  const amtInput = document.getElementById('depositAmountInput');

  if (!overlay) return;

  idInput.value = goalId;
  nameText.textContent = goalName;
  amtInput.value = '';

  overlay.classList.remove('hidden');
  setTimeout(() => amtInput.focus(), 150);
}

function closeDepositModal() {
  const overlay = document.getElementById('depositModalOverlay');
  if (overlay) overlay.classList.add('hidden');
}

function handleSaveDeposit(e) {
  e.preventDefault();

  const goalId = document.getElementById('depositGoalId').value;
  const amount = parseFloat(document.getElementById('depositAmountInput').value);

  if (isNaN(amount) || amount <= 0) {
    showToast('Please enter a valid funding amount', 'error');
    return;
  }

  const goal = state.workspace.goals.find((g) => g.id === goalId);
  if (!goal) return;

  goal.current = (Number(goal.current) || 0) + amount;

  // Mirror as savings outflow
  const newTx = {
    id: 'tx-' + Date.now(),
    type: 'expense',
    amount: amount,
    title: `Vault Inflow: ${goal.name}`,
    category: 'savings',
    channel: 'transfer',
    date: new Date().toISOString().split('T')[0],
    note: `#vault-allocation ${goal.name}`
  };
  state.workspace.transactions.unshift(newTx);

  if (goal.current >= goal.target) {
    sfx.playCelebration();
    showToast(`Vault Target Reached: ${goal.name} is fully funded!`);
  } else {
    sfx.playCash();
    showToast(`${formatCurrency(amount)} allocated to ${goal.name}.`);
  }

  saveActiveWorkspace();
  closeDepositModal();
  renderAll();
}

// ============================================================================
// 15. SETTINGS, EXPORT & ENVIRONMENT TOGGLE
// ============================================================================

function switchEnvironment(newMode) {
  if (state.mode === newMode) return;
  state.mode = newMode;
  loadActiveWorkspace();
  renderAll();
  showToast(`Switched to ${newMode === 'real' ? 'Real Life Budget' : 'Demo Sandbox'} mode.`);
}

function exportToJson() {
  const data = {
    system: 'Xenon Capital OS',
    version: '1.0.0',
    exportTimestamp: new Date().toISOString(),
    currency: state.currency,
    mode: state.mode,
    workspace: state.workspace
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Xenon_${state.mode}_Ledger_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('JSON snapshot exported.');
}

function exportToCsv() {
  const currentTxs = getFilteredTransactionsForCurrentMonth();
  if (currentTxs.length === 0) {
    showToast('No entries found for this calendar month.', 'error');
    return;
  }

  let csv = 'ID,Date,Type,Title,Category,Amount,Currency,Settlement_Channel,Note\n';

  currentTxs.forEach((tx) => {
    const cat = CATEGORIES[tx.category]?.name || tx.category;
    const chan = CHANNELS[tx.channel]?.name || tx.channel;
    const cleanTitle = `"${(tx.title || '').replace(/"/g, '""')}"`;
    const cleanNote = `"${(tx.note || '').replace(/"/g, '""')}"`;

    csv += `${tx.id},${tx.date},${tx.type},${cleanTitle},"${cat}",${tx.amount},"${state.currency}","${chan}",${cleanNote}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Xenon_${state.mode}_${getMonthName(state.selectedMonth)}_${state.selectedYear}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSV ledger spreadsheet exported.');
}

function handleImportJson(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      if (data.workspace) {
        state.workspace = data.workspace;
      } else if (data.transactions) {
        state.workspace = {
          transactions: data.transactions || [],
          budgets: data.budgets || { monthlyOverall: 300000, categories: {} },
          goals: data.goals || []
        };
      }
      if (data.currency) state.currency = data.currency;

      saveActiveWorkspace();
      renderAll();
      closeMenuModal();
      showToast('Ledger snapshot restored successfully.');
    } catch (err) {
      showToast('Failed to parse snapshot JSON file.', 'error');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

function clearActiveWorkspace() {
  const targetName = state.mode === 'real' ? 'Real Life Budget' : 'Demo Sandbox';
  if (!confirm(`CAUTION: Purge all records in the active ${targetName}? This cannot be undone.`)) return;

  initWorkspaceDefault();
  saveActiveWorkspace();
  renderAll();
  closeMenuModal();
  showToast(`${targetName} has been purged.`);
}

function openMenuModal() {
  const overlay = document.getElementById('menuModalOverlay');
  if (overlay) overlay.classList.remove('hidden');
}

function closeMenuModal() {
  const overlay = document.getElementById('menuModalOverlay');
  if (overlay) overlay.classList.add('hidden');
}

// ============================================================================
// 16. EVENT LISTENERS
// ============================================================================

function setupEventListeners() {
  // Mode Switchers
  document.getElementById('modeDemoBtn')?.addEventListener('click', () => switchEnvironment('demo'));
  document.getElementById('modeRealBtn')?.addEventListener('click', () => switchEnvironment('real'));
  document.getElementById('envActionBtn')?.addEventListener('click', () => {
    switchEnvironment(state.mode === 'demo' ? 'real' : 'demo');
  });
  document.getElementById('modalSwitchToRealBtn')?.addEventListener('click', () => {
    switchEnvironment('real');
    closeMenuModal();
  });
  document.getElementById('modalSwitchToDemoBtn')?.addEventListener('click', () => {
    switchEnvironment('demo');
    closeMenuModal();
  });

  // Currency Selector
  document.getElementById('currencySelector')?.addEventListener('change', (e) => {
    state.currency = e.target.value;
    saveActiveWorkspace();
    renderAll();
    showToast(`Display currency switched to ${state.currency} (${getCurrencySymbol()}).`);
  });

  // Month Switchers
  document.getElementById('prevMonthBtn')?.addEventListener('click', () => {
    if (state.selectedMonth === 0) {
      state.selectedMonth = 11;
      state.selectedYear--;
    } else {
      state.selectedMonth--;
    }
    renderAll();
  });

  document.getElementById('nextMonthBtn')?.addEventListener('click', () => {
    if (state.selectedMonth === 11) {
      state.selectedMonth = 0;
      state.selectedYear++;
    } else {
      state.selectedMonth++;
    }
    renderAll();
  });

  // Sound & Theme
  document.getElementById('soundToggleBtn')?.addEventListener('click', () => {
    state.settings.sound = !state.settings.sound;
    saveActiveWorkspace();
    applyTheme();
    if (state.settings.sound) sfx.playCash();
  });

  document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
    state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
    saveActiveWorkspace();
    applyTheme();
  });

  // Menu Modal
  document.getElementById('menuToggleBtn')?.addEventListener('click', openMenuModal);
  document.getElementById('closeMenuModalBtn')?.addEventListener('click', closeMenuModal);

  // Tabs Navigation
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      state.activeTab = tabName;

      document.querySelectorAll('.tab-btn').forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      document.querySelectorAll('.tab-content').forEach((view) => {
        view.classList.add('hidden');
        view.classList.remove('active');
      });

      const targetView = document.getElementById(`tabView${capitalize(tabName)}`);
      if (targetView) {
        targetView.classList.remove('hidden');
        targetView.classList.add('active');
      }
    });
  });

  // FAB
  document.getElementById('openAddTxModalBtn')?.addEventListener('click', () => openAddTxModal());

  // Quick Preset Chips
  document.querySelectorAll('.preset-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      openAddTxModal({
        type: 'expense',
        category: chip.dataset.category,
        title: chip.dataset.title,
        amount: chip.dataset.amount
      });
    });
  });

  // Transaction Form & Inputs
  document.getElementById('closeTxModalBtn')?.addEventListener('click', closeTxModal);
  document.getElementById('cancelTxBtn')?.addEventListener('click', closeTxModal);
  document.getElementById('txForm')?.addEventListener('submit', handleSaveTransaction);

  document.getElementById('typeExpenseBtn')?.addEventListener('click', () => setTxModalType('expense'));
  document.getElementById('typeIncomeBtn')?.addEventListener('click', () => setTxModalType('income'));

  document.getElementById('txAmountInput')?.addEventListener('input', (e) => {
    updateAmountPreview(e.target.value);
  });

  // Filters
  document.getElementById('txSearchInput')?.addEventListener('input', (e) => {
    const clearBtn = document.getElementById('clearSearchBtn');
    if (clearBtn) {
      if (e.target.value.length > 0) clearBtn.classList.remove('hidden');
      else clearBtn.classList.add('hidden');
    }
    renderTransactionsTab();
  });

  document.getElementById('clearSearchBtn')?.addEventListener('click', () => {
    const input = document.getElementById('txSearchInput');
    if (input) input.value = '';
    document.getElementById('clearSearchBtn')?.classList.add('hidden');
    renderTransactionsTab();
  });

  document.getElementById('txTypeFilter')?.addEventListener('change', renderTransactionsTab);
  document.getElementById('txCategoryFilter')?.addEventListener('change', renderTransactionsTab);
  document.getElementById('txChannelFilter')?.addEventListener('change', renderTransactionsTab);

  // Budget Modals
  document.getElementById('quickEditBudgetBtn')?.addEventListener('click', openBudgetModal);
  document.getElementById('manageEnvelopesBtn')?.addEventListener('click', openBudgetModal);
  document.getElementById('closeBudgetModalBtn')?.addEventListener('click', closeBudgetModal);
  document.getElementById('cancelBudgetBtn')?.addEventListener('click', closeBudgetModal);
  document.getElementById('budgetForm')?.addEventListener('submit', handleSaveBudgets);

  // Goals
  document.getElementById('newGoalModalBtn')?.addEventListener('click', openNewGoalModal);
  document.getElementById('closeGoalModalBtn')?.addEventListener('click', closeGoalModal);
  document.getElementById('cancelGoalBtn')?.addEventListener('click', closeGoalModal);
  document.getElementById('goalForm')?.addEventListener('submit', handleSaveGoal);

  // Deposits
  document.getElementById('closeDepositModalBtn')?.addEventListener('click', closeDepositModal);
  document.getElementById('cancelDepositBtn')?.addEventListener('click', closeDepositModal);
  document.getElementById('depositForm')?.addEventListener('submit', handleSaveDeposit);

  // Calculators
  document.getElementById('salaryInput')?.addEventListener('input', updateSalarySplitter);
  document.getElementById('fuelPriceInput')?.addEventListener('input', updateGenEstimator);
  document.getElementById('genHoursInput')?.addEventListener('input', updateGenEstimator);
  document.getElementById('genSizeSelect')?.addEventListener('change', updateGenEstimator);

  document.getElementById('applySplitToBudgetsBtn')?.addEventListener('click', () => {
    const salary = Number(document.getElementById('salaryInput')?.value) || 0;
    if (salary <= 0) return;

    if (!state.workspace.budgets) state.workspace.budgets = { monthlyOverall: 0, categories: {} };
    state.workspace.budgets.monthlyOverall = salary * 0.8;

    state.workspace.budgets.categories.food = Math.round(salary * 0.22);
    state.workspace.budgets.categories.housing = Math.round(salary * 0.18);
    state.workspace.budgets.categories.transport = Math.round(salary * 0.1);
    state.workspace.budgets.categories.fuel = Math.round(salary * 0.1);
    state.workspace.budgets.categories.utilities = Math.round(salary * 0.05);
    state.workspace.budgets.categories.data = Math.round(salary * 0.05);
    state.workspace.budgets.categories.support = Math.round(salary * 0.1);
    state.workspace.budgets.categories.leisure = Math.round(salary * 0.1);
    state.workspace.budgets.categories.savings = Math.round(salary * 0.2);

    saveActiveWorkspace();
    renderAll();
    showToast('50/30/20 algorithmic allocation applied to envelopes.');
  });

  // Settings & Maintenance
  document.getElementById('exportJsonBtn')?.addEventListener('click', exportToJson);
  document.getElementById('exportCsvBtn')?.addEventListener('click', exportToCsv);
  document.getElementById('importJsonFileInput')?.addEventListener('change', handleImportJson);
  document.getElementById('loadDemoDataBtn')?.addEventListener('click', () => {
    if (confirm('Re-seed the Demo Sandbox with fresh scenario transactions?')) {
      seedDemoSandbox();
      renderAll();
      closeMenuModal();
      showToast('Demo Sandbox re-seeded.');
    }
  });
  document.getElementById('clearAllDataBtn')?.addEventListener('click', clearActiveWorkspace);

  // Global Keyboard Navigation (HCI Excellence)
  window.addEventListener('keydown', (e) => {
    const tag = document.activeElement.tagName.toLowerCase();
    const isTyping = tag === 'input' || tag === 'textarea' || tag === 'select';

    if (e.key === 'Escape') {
      closeTxModal();
      closeBudgetModal();
      closeGoalModal();
      closeDepositModal();
      closeMenuModal();
    } else if (!isTyping) {
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        openAddTxModal();
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        switchEnvironment(state.mode === 'demo' ? 'real' : 'demo');
      } else if (e.key === '1') {
        document.getElementById('tabBtnDashboard')?.click();
      } else if (e.key === '2') {
        document.getElementById('tabBtnTransactions')?.click();
      } else if (e.key === '3') {
        document.getElementById('tabBtnGoals')?.click();
      } else if (e.key === '4') {
        document.getElementById('tabBtnTools')?.click();
      }
    }
  });

  // Backdrop dismissal
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.add('hidden');
      }
    });
  });
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================================
// 17. SERVICE WORKER REGISTRATION (100% Offline)
// ============================================================================

let deferredPrompt = null;

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then((reg) => console.log('Xenon ServiceWorker registered:', reg.scope))
        .catch((err) => console.warn('ServiceWorker notice:', err));
    });
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const pwaBtn = document.getElementById('pwaInstallBtn');
    if (pwaBtn) {
      pwaBtn.classList.remove('hidden');
      pwaBtn.addEventListener('click', () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(() => {
            deferredPrompt = null;
            pwaBtn.classList.add('hidden');
          });
        }
      });
    }
  });
}

// ============================================================================
// 18. INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  loadInitialData();
  setupEventListeners();
  renderAll();
  registerServiceWorker();
});
