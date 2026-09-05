import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock } from "lucide-react";

type TurnoEvento = {
  idTurno:number;
  titoloEvento:string;
  localitaEvento:string;
  nomeCognomeReferente:string;
  telefonoReferente:string;
  tipologiaTurno:string;
  tipoMansione:string;
  dataTurno:string;
  oraInizio:string;
  oraFine:string;
  notaTurno:string;
}

const turniFuturiDemo:TurnoEvento[] = [
  {
    idTurno:9101,
    titoloEvento:'Milano Fashion Week',
    localitaEvento:'Palazzo Reale, Piazza del Duomo, Milano',
    nomeCognomeReferente:'Marco Rossi',
    telefonoReferente:'333 1234567',
    tipologiaTurno:'DIURNO',
    tipoMansione:'VIG',
    dataTurno:'08/09/2026',
    oraInizio:'08:00',
    oraFine:'14:00',
    notaTurno:'Presentarsi 15 minuti prima al punto di ritrovo.'
  },
  {
    idTurno:9102,
    titoloEvento:'Evento Corporate Detelder',
    localitaEvento:'CityLife, Milano',
    nomeCognomeReferente:'Laura Bianchi',
    telefonoReferente:'333 9876543',
    tipologiaTurno:'POMERIDIANO',
    tipoMansione:'CP',
    dataTurno:'08/09/2026',
    oraInizio:'16:00',
    oraFine:'22:00',
    notaTurno:'Accesso staff da ingresso laterale.'
  },
  {
    idTurno:9103,
    titoloEvento:'Concerto Arena Milano',
    localitaEvento:'Unipol Forum, Assago, Milano',
    nomeCognomeReferente:'Paolo Neri',
    telefonoReferente:'333 9998877',
    tipologiaTurno:'SERALE',
    tipoMansione:'VIG',
    dataTurno:'09/09/2026',
    oraInizio:'18:00',
    oraFine:'23:30',
    notaTurno:''
  }
];

const turniFuturi = () => {
  const turniFuturi = turniFuturiDemo;

  const formatMonthShort=(input:string):string=>{
    const [day,month,year]=input.split('/');
    if(!day||!month||!year)return 'Data non valida';
    const date=new Date(Number(year),Number(month)-1,Number(day));
    if(isNaN(date.getTime()))return 'Data non valida';
    return date.toLocaleDateString('it-IT',{month:'long'}).substring(0,3).toUpperCase()
  };

  const formatDay=(input:string):string=>{
    const [day]=input.split('/');
    return day||'Data non valida'
  };

  const mapsHref=(address:string)=>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const gruppiTurni = Object.entries(
    turniFuturi.reduce<Record<string, TurnoEvento[]>>((acc, turno) => {
      if (!acc[turno.dataTurno]) acc[turno.dataTurno] = [];
      acc[turno.dataTurno].push(turno);
      return acc;
    }, {})
  );

  return (
    <section className="main-section">
      <div className="titolo">Turni futuri</div>

      {gruppiTurni.map(([dataTurno, turniGiorno])=>(
        <Card className="turni-futuri-card overflow-hidden" key={dataTurno}>
          <CardContent className="p-0">
            <div className="flex items-center gap-3 border-b border-[#2e5362] bg-[#0b2430] px-4 py-3">
              <div className="turni-futuri-data-content !w-[58px] shrink-0 !rounded-[9px] !px-0 !py-2">
                <div className="turni-futuri-giorno !text-[27px]">{formatDay(dataTurno)}</div>
                <div className="turni-futuri-mese !text-[11px]">{formatMonthShort(dataTurno)}</div>
              </div>
              <div className="min-w-0">
                <div className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#8fb4c5]">Giornata</div>
                <div className="text-[15px] font-semibold text-[#dce9ed]">{turniGiorno.length} {turniGiorno.length === 1 ? 'turno' : 'turni'}</div>
              </div>
            </div>

            <div className="divide-y divide-[#2e5362]">
              {turniGiorno.map((turnoFuturo)=>(
                <div className="p-4" key={turnoFuturo.idTurno}>
                  <div className="min-w-0">
                    <span className="turni-futuri-titolo-evento block leading-tight">
                      {turnoFuturo.titoloEvento}
                    </span>

                    <div className="turni-futuri-tipologia-content flex flex-wrap gap-1.5">
                      <span className="turni-futuri-tipologiaTurno !m-0 !border !border-[#315a78] !bg-[#16344a] !px-2.5 !py-1 !text-[#c9daff]">
                        {turnoFuturo.tipologiaTurno}
                      </span>
                      <span className="turni-futuri-tipoMansione !m-0 !border !border-[#3f766c] !bg-[#173a34] !px-2.5 !py-1 !text-[#9be8ce]">
                        {turnoFuturo.tipoMansione}
                      </span>
                    </div>

                    <a
                      className="mt-2 flex min-w-0 items-start gap-1.5 text-[#c9daff]"
                      href={mapsHref(turnoFuturo.localitaEvento)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Apri ${turnoFuturo.localitaEvento} su Google Maps`}
                    >
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                      <span className="turni-futuri-localita-evento underline underline-offset-2">
                        {turnoFuturo.localitaEvento}
                      </span>
                    </a>

                    <div className="mt-1 flex items-center gap-1.5">
                      <Clock className="h-4 w-4 shrink-0 text-[#c9daff]" />
                      <span className="turni-futuri-Orario">
                        {turnoFuturo.oraInizio} - {turnoFuturo.oraFine}
                      </span>
                    </div>
                  </div>

                  {turnoFuturo.notaTurno&&(
                    <div className="turni-futuri-note-operative-content !w-full">
                      <div className="note-operative-label">NOTE OPERATIVE</div>
                      <div className="note-operative-value">{turnoFuturo.notaTurno}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}

export default turniFuturi
