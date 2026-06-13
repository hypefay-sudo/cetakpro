const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const storage = {
  get(key, fallback = null) {
    return safeParse(localStorage.getItem(key), fallback);
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  },
};

export const getHistory = () => storage.get('cetakpro.history', []);

export const saveHistoryItem = (item, isPro = false) => {
  const history = getHistory();
  const maxItems = isPro ? 200 : 5;
  const next = [item, ...history.filter((historyItem) => historyItem.id !== item.id)].slice(0, maxItems);
  storage.set('cetakpro.history', next);
  return next;
};

export const deleteHistoryItem = (id) => {
  const next = getHistory().filter((item) => item.id !== id);
  storage.set('cetakpro.history', next);
  return next;
};

export const clearHistory = () => storage.set('cetakpro.history', []);

export const getSettings = () =>
  storage.get('cetakpro.settings', {
    defaultPlatform: 'ChatGPT Image',
    defaultLanguage: 'Indonesia',
    defaultPaperSize: 'a3plus',
    defaultMargin: 1.25,
    defaultBleed: 1,
    theme: 'Light',
  });

export const saveSettings = (settings) => storage.set('cetakpro.settings', settings);

export const getDailyUsage = () => {
  const today = new Date().toISOString().slice(0, 10);
  const usage = storage.get('cetakpro.dailyUsage', { date: today, count: 0 });
  return usage.date === today ? usage : { date: today, count: 0 };
};

export const incrementDailyUsage = () => {
  const usage = getDailyUsage();
  const next = { ...usage, count: usage.count + 1 };
  storage.set('cetakpro.dailyUsage', next);
  return next;
};

export const resetLocalData = () => {
  clearHistory();
  localStorage.removeItem('cetakpro.settings');
  localStorage.removeItem('cetakpro.dailyUsage');
};
