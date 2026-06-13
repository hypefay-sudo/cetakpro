import { useMemo, useState } from 'react';
import EmptyState from '../components/EmptyState';
import { clearHistory, deleteHistoryItem, getHistory } from '../utils/storage';
import { exportTxt } from '../utils/exportTxt';

export default function History({ showToast }) {
  const [items, setItems] = useState(getHistory());
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedId, setSelectedId] = useState(items[0]?.id || '');
  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const matchesQuery = `${item.title} ${item.category} ${item.prompt}`.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = category === 'All' || item.category === category;
        return matchesQuery && matchesCategory;
      }),
    [items, query, category],
  );
  const selected = filtered.find((item) => item.id === selectedId) || filtered[0];

  const remove = (id) => {
    const next = deleteHistoryItem(id);
    setItems(next);
    setSelectedId(next[0]?.id || '');
    showToast?.('History dihapus.');
  };

  const clearAll = () => {
    if (!window.confirm('Hapus semua history?')) return;
    clearHistory();
    setItems([]);
    setSelectedId('');
    showToast?.('Semua history dihapus.');
  };

  const copy = async (prompt) => {
    await navigator.clipboard.writeText(prompt);
    showToast?.('Prompt berhasil disalin.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">History</h1>
          <p className="mt-1 text-slate-600">Cari, salin, export, atau hapus prompt tersimpan.</p>
        </div>
        <button className="btn-secondary" type="button" onClick={clearAll} disabled={!items.length}>Clear all</button>
      </div>
      <section className="panel p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <input className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search history..." />
          <select className="field" value={category} onChange={(event) => setCategory(event.target.value)}>
            {['All', 'Banner', 'Sticker', 'A3 Custom'].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </section>
      {filtered.length ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_460px]">
          <section className="panel overflow-hidden">
            <div className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`block w-full px-5 py-4 text-left transition ${selected?.id === item.id ? 'bg-brand-50' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-950">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.category} · {new Date(item.createdAt).toLocaleString('id-ID')}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">{item.platform}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
          <aside className="panel flex max-h-[720px] flex-col overflow-hidden">
            {selected ? (
              <>
                <div className="border-b border-slate-200 p-5">
                  <p className="text-base font-bold text-slate-950">{selected.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{selected.layoutSummary}</p>
                </div>
                <pre className="flex-1 overflow-auto whitespace-pre-wrap p-5 text-sm leading-6 text-slate-700">{selected.prompt}</pre>
                <div className="grid gap-2 border-t border-slate-200 p-4 sm:grid-cols-3">
                  <button className="btn-secondary" type="button" onClick={() => copy(selected.prompt)}>Copy</button>
                  <button className="btn-secondary" type="button" onClick={() => exportTxt(`${selected.title}.txt`, selected.prompt)}>Export TXT</button>
                  <button className="btn-secondary" type="button" onClick={() => remove(selected.id)}>Delete</button>
                </div>
              </>
            ) : null}
          </aside>
        </div>
      ) : (
        <EmptyState title="Tidak ada history" description="Simpan prompt dari halaman generator untuk melihatnya di sini." />
      )}
    </div>
  );
}
