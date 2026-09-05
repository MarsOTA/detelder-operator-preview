const DEMO_TOKEN = 'detelder-preview-demo-token';

const demoToday = [
  {
    idTurno: 9001,
    titoloEvento: 'Milano Fashion Week',
    localitaEvento: 'Palazzo Reale, Piazza del Duomo, Milano',
    nomeCognomeReferente: 'Marco Rossi',
    listaColleghi: [{ id: 1 }, { id: 2 }, { id: 3 }],
    orarioTurni: [
      {
        oraInizio: '08:00',
        oraFine: '14:00',
        orePausa: 0.5,
        notaTurno: 'Presentarsi 15 minuti prima al punto di ritrovo.',
        tipologiaTurno: 'DIURNO',
        tipoMansione: 'VIG'
      }
    ]
  },
  {
    idTurno: 9002,
    titoloEvento: 'Evento Corporate Detelder',
    localitaEvento: 'CityLife, Milano',
    nomeCognomeReferente: 'Laura Bianchi',
    listaColleghi: [{ id: 1 }, { id: 2 }],
    orarioTurni: [
      {
        oraInizio: '15:00',
        oraFine: '21:00',
        orePausa: 0.5,
        notaTurno: 'Accesso staff da ingresso laterale.',
        tipologiaTurno: 'POMERIDIANO',
        tipoMansione: 'CP'
      }
    ]
  }
];

const demoFuture = [
  {
    idTurno: 9101,
    dataTurno: '08/09/2026',
    titoloEvento: 'Concerto Arena Milano',
    localitaEvento: 'Unipol Forum, Assago',
    tipologiaTurno: 'SERALE',
    tipoMansione: 'VIG',
    oraInizio: '18:00',
    oraFine: '01:00',
    notaTurno: 'Ritrovo presso ingresso staff ore 17:30.'
  },
  {
    idTurno: 9102,
    dataTurno: '12/09/2026',
    titoloEvento: 'Fiera Milano',
    localitaEvento: 'Fiera Milano Rho',
    tipologiaTurno: 'DIURNO',
    tipoMansione: 'CP',
    oraInizio: '08:00',
    oraFine: '20:00',
    notaTurno: 'Badge da ritirare al desk coordinamento.'
  },
  {
    idTurno: 9103,
    dataTurno: '18/09/2026',
    titoloEvento: 'Evento Luxury',
    localitaEvento: 'Via Montenapoleone, Milano',
    tipologiaTurno: 'DIURNO',
    tipoMansione: 'DIR',
    oraInizio: '10:00',
    oraFine: '18:00',
    notaTurno: ''
  }
];

const demoPayroll = [
  {
    idPayroll: 9201,
    dataTurno: '01/09/2026',
    oraInizioDefinitivo: '08:00',
    oraFineDefinitivo: '20:00',
    orePausaDefinitivo: 1,
    ragioneSociale: 'Milano Eventi',
    nomeBrand: 'Fashion Week',
    indirizzoEvento: 'Piazza del Duomo, Milano'
  },
  {
    idPayroll: 9202,
    dataTurno: '02/09/2026',
    oraInizioDefinitivo: '20:00',
    oraFineDefinitivo: '08:00',
    orePausaDefinitivo: 1,
    ragioneSociale: 'Arena Milano',
    nomeBrand: 'Live Event',
    indirizzoEvento: 'Assago, Milano'
  },
  {
    idPayroll: 9203,
    dataTurno: '03/09/2026',
    oraInizioDefinitivo: '09:00',
    oraFineDefinitivo: '17:00',
    orePausaDefinitivo: 0.5,
    ragioneSociale: 'Detelder',
    nomeBrand: 'Corporate',
    indirizzoEvento: 'CityLife, Milano'
  }
];

const demoMonths = [
  { meseAnno: 'Agosto 2026', numeroTurni: 12, mese: 8, anno: 2026 },
  { meseAnno: 'Luglio 2026', numeroTurni: 10, mese: 7, anno: 2026 },
  { meseAnno: 'Giugno 2026', numeroTurni: 11, mese: 6, anno: 2026 }
];

function parseBody(body) {
  if (!body) return {};
  if (typeof body === 'object') return body;
  try { return JSON.parse(body); } catch { return {}; }
}

function isDemoRequest(req) {
  return req.headers.authorization === `Bearer ${DEMO_TOKEN}`;
}

function demoResponse(rawPath, req, res) {
  if (rawPath === 'auth/login' && req.method === 'POST') {
    const body = parseBody(req.body);
    if (body.username === 'demo' && body.password === 'demo') {
      res.status(200).json({
        success: true,
        token: DEMO_TOKEN,
        dipendente: {
          id: 999999,
          nome: 'Operatore',
          cognome: 'Demo',
          ruolo: 'OPERATORE'
        }
      });
      return true;
    }
    return false;
  }

  if (!isDemoRequest(req)) return false;

  if (rawPath === 'auth/checkAuth') {
    res.status(200).json({ ok: true, username: 'demo' });
    return true;
  }

  if (rawPath.startsWith('turni/turniGiornalieri/')) {
    res.status(200).json(demoToday);
    return true;
  }

  if (rawPath.startsWith('turni/turniFuturi/')) {
    res.status(200).json(demoFuture);
    return true;
  }

  if (rawPath.startsWith('payroll/rendicontazionePerMese/')) {
    res.status(200).json(demoPayroll);
    return true;
  }

  if (rawPath.startsWith('payroll/storicoRendicontazione/')) {
    res.status(200).json(demoMonths);
    return true;
  }

  if (rawPath.startsWith('payroll/rendicontazione/')) {
    res.status(200).json(demoPayroll);
    return true;
  }

  return false;
}

export default async function handler(req, res) {
  const base = 'https://detelder-be.vercel.app/';
  const rawPath = typeof req.query.path === 'string' ? req.query.path : '';

  if (!rawPath || rawPath.includes('://')) {
    res.status(400).json({ message: 'Invalid API path' });
    return;
  }

  if (demoResponse(rawPath, req, res)) return;

  const target = new URL(rawPath.replace(/^\/+/, ''), base);
  const headers = {
    accept: 'application/json',
    'content-type': req.headers['content-type'] || 'application/json'
  };

  if (req.headers.authorization) headers.authorization = req.headers.authorization;
  if (req.headers.cookie) headers.cookie = req.headers.cookie;

  const init = {
    method: req.method,
    headers,
    redirect: 'manual'
  };

  if (req.method !== 'GET' && req.method !== 'HEAD' && typeof req.body !== 'undefined') {
    init.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  try {
    const upstream = await fetch(target, init);
    const text = await upstream.text();

    const contentType = upstream.headers.get('content-type');
    if (contentType) res.setHeader('content-type', contentType);

    const setCookie = upstream.headers.get('set-cookie');
    if (setCookie) {
      const rewritten = setCookie.replace(/;\s*Domain=[^;]+/gi, '');
      res.setHeader('set-cookie', rewritten);
    }

    res.setHeader('x-preview-backend', base);
    res.status(upstream.status).send(text);
  } catch (error) {
    console.error('Detelder preview proxy error', error);
    res.status(502).json({
      message: 'Backend non raggiungibile dalla preview',
      detail: error instanceof Error ? error.message : String(error)
    });
  }
}
