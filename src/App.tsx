import { FormEvent, useEffect, useMemo, useState } from 'react';

type View = 'today' | 'future' | 'report';
type Json = Record<string, any>;

const token = () => localStorage.getItem('token') || '';
const operatorId = () => localStorage.getItem('idOperatore') || '';

async function api(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('accept', 'application/json');
  if (options.body) headers.set('content-type', 'application/json');
  if (token()) headers.set('authorization', `Bearer ${token()}`);

  const response = await fetch(`/api/proxy?path=${encodeURIComponent(path)}`, {
    ...options,
    headers,
  });
  const text = await response.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) {
    throw new Error(data?.message || `Errore API ${response.status}`);
  }
  return data;
}

function formatToday() {
  const d = new Date();
  const weekday = d.toLocaleDateString('it-IT', { weekday: 'long' });
  const date = d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${date}`;
}

function timeToMinutes(value?: string) {
  const [h = 0, m = 0] = String(value || '0:0').split(':').map(Number);
  return h * 60 + m;
}

function shiftStatus(start?: string, end?: string) {
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const from = timeToMinutes(start);
  let to = timeToMinutes(end);
  if (to < from) {
    to += 24 * 60;
    const corrected = current < from ? current + 24 * 60 : current;
    if (corrected >= from && corrected <= to) return 'IN_CORSO';
    return corrected < from ? 'FUTURO' : 'PASSATO';
  }
  if (current >= from && current <= to) return 'IN_CORSO';
  return current < from ? 'FUTURO' : 'PASSATO';
}

function monthShort(input?: string) {
  if (!input) return '---';
  const [day, month, year] = input.split('/');
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  if (Number.isNaN(d.getTime())) return '---';
  return d.toLocaleDateString('it-IT', { month: 'short' }).replace('.', '').toUpperCase();
}

function dayShort(input?: string) {
  return input?.split('/')?.[0] || '--';
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api('auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      if (!data?.success) throw new Error(data?.message || 'Accesso non riuscito');
      localStorage.setItem('token', data.token);
      localStorage.setItem('ruolo', data.dipendente?.ruolo || '');
      localStorage.setItem('idOperatore', String(data.dipendente?.id || ''));
      localStorage.setItem('operatoreLoggato', `${data.dipendente?.nome || ''} ${data.dipendente?.cognome || ''}`.trim());
      onLogin();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="preview-login">
      <form className="preview-login-card" onSubmit={submit}>
        <h1>DETELDER</h1>
        <p>Operator UI Preview · ambiente separato e senza azioni di scrittura</p>
        <div className="preview-field">
          <label htmlFor="username">Username</label>
          <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="preview-field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="preview-primary" disabled={loading}>{loading ? 'Accesso...' : 'Accedi'}</button>
        {error && <div className="preview-error">{error}</div>}
      </form>
    </div>
  );
}

function Header({ view, setView, logout }: { view: View; setView: (v: View) => void; logout: () => void }) {
  return (
    <header className="operatore-header">
      <div className="preview-header-inner">
        <div className="preview-brand">DETELDER · PREVIEW</div>
        <div className="preview-user">{localStorage.getItem('operatoreLoggato')}</div>
        <div className="preview-nav">
          <button className={view === 'today' ? 'active' : ''} onClick={() => setView('today')}>Turni di oggi</button>
          <button className={view === 'future' ? 'active' : ''} onClick={() => setView('future')}>Turni futuri</button>
          <button className={view === 'report' ? 'active' : ''} onClick={() => setView('report')}>Rendicontazione</button>
          <button onClick={logout}>Esci</button>
        </div>
      </div>
    </header>
  );
}

function Today() {
  const [turni, setTurni] = useState<Json[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clock, setClock] = useState(new Date().toLocaleTimeString('it-IT'));

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date().toLocaleTimeString('it-IT')), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setLoading(true);
    api(`turni/turniGiornalieri/${operatorId()}`)
      .then((data) => setTurni(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const rows = useMemo(() => turni.flatMap((turno) => {
    const schedules = Array.isArray(turno.orarioTurni) && turno.orarioTurni.length ? turno.orarioTurni : [turno];
    return schedules.map((orario: Json, index: number) => ({
      key: `${turno.idTurno || index}-${index}`,
      title: turno.titoloEvento || turno.ragioneSociale || 'Turno',
      location: turno.localitaEvento || turno.indirizzoEvento || '',
      start: orario.oraInizio || turno.oraInizio || '',
      end: orario.oraFine || turno.oraFine || '',
      pause: orario.orePausa ?? turno.orePausa ?? '',
      note: orario.notaTurno || turno.notaTurno || '',
      type: orario.tipologiaTurno || turno.tipologiaTurno || '',
      role: orario.tipoMansione || turno.tipoMansione || '',
      referent: turno.nomeCognomeReferente || '',
      colleagues: Array.isArray(turno.listaColleghi) ? turno.listaColleghi.length : 0,
    }));
  }), [turni]);

  return (
    <section className="main-section">
      <div className="preview-width">
        <div className="titolo">Turni di oggi</div>
        <div className="dataOggi"><span>◷</span><span>{formatToday()}</span></div>
        <div className="box-checkin-checkout">
          <div className="box-timer">
            <div className="timer-value">{clock}</div>
            <div className="timer-label">ORARIO CORRENTE</div>
          </div>
          <button className="check-button check-button-in preview-disabled" type="button">
            <span className="check-button-content">CHECK-IN</span>
          </button>
          <div className="preview-safe-label">Disattivato nella preview: nessuna timbratura verrà registrata.</div>
        </div>
        {loading && <div className="preview-loading">Caricamento turni...</div>}
        {error && <div className="preview-warning">{error}</div>}
        {!loading && !error && rows.length === 0 && <div className="preview-empty">Nessun turno assegnato oggi.</div>}
        {rows.map((row) => (
          <article className="card-turni" key={row.key}>
            <div className="turno-content preview-card-content">
              <div className="info-orario-turno">
                <div className="info-ora">
                  <div className="orario-turno">{row.start} - {row.end}</div>
                  <span className={`stato-turno ${shiftStatus(row.start, row.end)}`}>{shiftStatus(row.start, row.end).replace('_', ' ')}</span>
                </div>
                <div className="info-pausa">
                  <div className="pausa-label">PAUSA</div>
                  <div className="pausa-value">{row.pause || '—'} h</div>
                </div>
              </div>
              <div className="info-turno">
                <div className="titolo-evento">{row.title}</div>
                <div className="luogo-evento-content"><span>⌖</span><span className="luogo-evento-text">{row.location}</span></div>
                {(row.type || row.role) && <div><span className="tipo-evento">{row.type}</span>{row.type && row.role ? ' · ' : ''}<span className="tipo-mansione">{row.role}</span></div>}
                {row.note && <div className="note-operative-content"><div className="note-operative-label">NOTE OPERATIVE</div><div className="note-operative-value">{row.note}</div></div>}
              </div>
              <div className="info-personale-content">
                <div className="referente-evento"><span className="referente-evento-label">{row.referent || 'Referente evento'}</span></div>
                <div className="colleghi-evento"><span className="colleghi-evento-label">{row.colleagues} colleghi</span></div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Future() {
  const [turni, setTurni] = useState<Json[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api(`turni/turniFuturi/${operatorId()}`)
      .then((data) => setTurni(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="main-section">
      <div className="preview-width">
        <div className="titolo">I tuoi impegni</div>
        {loading && <div className="preview-loading">Caricamento turni futuri...</div>}
        {error && <div className="preview-warning">{error}</div>}
        {!loading && !error && turni.length === 0 && <div className="preview-empty">Nessun turno futuro.</div>}
        {turni.map((turno, index) => (
          <article className="turni-futuri-card" key={turno.idTurno || index}>
            <div className="preview-card-content">
              <div className="turni-futuri-operativita">
                <div className="turni-futuri-data-content">
                  <div className="turni-futuri-giorno">{dayShort(turno.dataTurno)}</div>
                  <div className="turni-futuri-mese">{monthShort(turno.dataTurno)}</div>
                </div>
                <div>
                  <div className="turni-futuri-titolo-evento">{turno.titoloEvento}</div>
                  <div className="turni-futuri-tipologia-content">
                    {turno.tipologiaTurno && <span className="turni-futuri-tipologiaTurno">{turno.tipologiaTurno}</span>}
                    {turno.tipoMansione && <span className="turni-futuri-tipoMansione">{turno.tipoMansione}</span>}
                  </div>
                  <div className="turni-futuri-localita-evento">⌖ {turno.localitaEvento}</div>
                  <div className="turni-futuri-Orario">◷ {turno.oraInizio} - {turno.oraFine}</div>
                </div>
              </div>
              {turno.notaTurno && <div className="turni-futuri-note-operative-content"><div className="note-operative-label">NOTE OPERATIVE</div><div className="note-operative-value">{turno.notaTurno}</div></div>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function calcHours(items: Json[]) {
  let minutes = 0;
  items.forEach((item) => {
    if (!item.oraInizioDefinitivo || !item.oraFineDefinitivo) return;
    const start = timeToMinutes(item.oraInizioDefinitivo);
    let end = timeToMinutes(item.oraFineDefinitivo);
    if (end < start) end += 1440;
    minutes += Math.max(0, end - start - Number(item.orePausaDefinitivo || 0) * 60);
  });
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

function Report() {
  const [tab, setTab] = useState<'approve' | 'archive'>('approve');
  const [items, setItems] = useState<Json[]>([]);
  const [months, setMonths] = useState<Json[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    const path = tab === 'approve' ? `payroll/rendicontazione/${operatorId()}` : `payroll/storicoRendicontazione/${operatorId()}`;
    api(path)
      .then((data) => tab === 'approve' ? setItems(Array.isArray(data) ? data : []) : setMonths(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [tab]);

  const loadMonth = async (month: Json) => {
    setLoading(true);
    try {
      const data = await api(`payroll/rendicontazionePerMese/${operatorId()}?mese=${month.mese}&anno=${month.anno}`);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="main-section">
      <div className="preview-width">
        <div className="titolo">Rendicontazione</div>
        <div className="tabs-list preview-row" style={{ padding: 4 }}>
          <button data-state={tab === 'approve' ? 'active' : 'inactive'} className="tab-button" style={{ flex: 1, border: 0, padding: 10 }} onClick={() => setTab('approve')}>Da approvare</button>
          <button data-state={tab === 'archive' ? 'active' : 'inactive'} className="tab-button" style={{ flex: 1, border: 0, padding: 10 }} onClick={() => setTab('archive')}>Archivio</button>
        </div>
        {tab === 'approve' && (
          <>
            <div className="sintesi-rendicontazione-content" style={{ marginTop: 8 }}>
              <div><div className="totale-ore-label">Totale ore</div><span className="totale-ore-value">{calcHours(items)}</span><span className="totale-ore-unita"> h</span></div>
              <div style={{ textAlign: 'right' }}><div className="totale-giorni-label">Giorni lavorati</div><span className="totale-giorni-value">{items.length}</span><span className="totale-giorni-unita"> giorni</span></div>
            </div>
            <div className="rendicontazione-info"><div className="rendicontazione-info-title">Ambiente di anteprima</div><div className="rendicontazione-info-testo">Puoi verificare dati e grafica. Approva e Modifica sono disattivati per non alterare il database reale.</div></div>
          </>
        )}
        {loading && <div className="preview-loading">Caricamento rendicontazione...</div>}
        {error && <div className="preview-warning">{error}</div>}
        {tab === 'approve' && items.map((turno, index) => (
          <div className="rendicontazione-turno-content" key={turno.idPayroll || index}>
            <div className="preview-row"><span className="rendicontazione-data-turno">{turno.dataTurno}</span><span className="rendicontazione-orario-turno">{turno.oraInizioDefinitivo} - {turno.oraFineDefinitivo}</span></div>
            <div className="rendicontazione-pausa-turno">Pausa {turno.orePausaDefinitivo ?? 0} h</div>
            <div className="rendicontazione-titolo-turno">{[turno.ragioneSociale, turno.nomeBrand].filter(Boolean).join(' - ')}</div>
            <div className="rendicontazione-indirizzo-turno">{turno.indirizzoEvento}</div>
            <div className="preview-row" style={{ marginTop: 12 }}><button className="preview-primary preview-disabled" style={{ width: '45%' }}>APPROVA</button><button className="rendicontazione-bottone-modifica preview-disabled" style={{ height: 40 }}>MODIFICA</button></div>
          </div>
        ))}
        {tab === 'archive' && months.map((month, index) => (
          <div key={month.meseAnno || index}>
            <button className="archivio-mensile-trigger preview-row" style={{ width: '100%', color: 'inherit' }} onClick={() => loadMonth(month)}>
              <span className="archivio-mese-anno">{month.meseAnno}</span>
              <span className="archivio-giorni-mensili">{month.numeroTurni} turni</span>
            </button>
          </div>
        ))}
        {tab === 'archive' && items.length > 0 && <div className="preview-stack" style={{ marginTop: 8 }}>{items.map((turno, index) => <div className="turno-archiviato-content" key={turno.idPayroll || index}><div className="preview-row"><span className="data-turno-archiviato">{turno.dataTurno}</span><span className="ora-turno-archiviato">{turno.oraInizioDefinitivo} - {turno.oraFineDefinitivo}</span></div><div className="pausa-turno-archiviato">Pausa {turno.orePausaDefinitivo ?? 0} h</div><div className="nome-turno-archiviato">{[turno.ragioneSociale, turno.nomeBrand].filter(Boolean).join(' - ')}</div><div className="indirizzo-turno-archiviato">{turno.indirizzoEvento}</div></div>)}</div>}
      </div>
    </section>
  );
}

export default function App() {
  const [logged, setLogged] = useState(Boolean(token() && operatorId()));
  const [view, setView] = useState<View>('today');

  const logout = () => {
    ['token', 'ruolo', 'idOperatore', 'operatoreLoggato'].forEach((key) => localStorage.removeItem(key));
    setLogged(false);
  };

  if (!logged) return <Login onLogin={() => setLogged(true)} />;

  return (
    <div className="preview-shell">
      <Header view={view} setView={setView} logout={logout} />
      {view === 'today' && <Today />}
      {view === 'future' && <Future />}
      {view === 'report' && <Report />}
    </div>
  );
}
