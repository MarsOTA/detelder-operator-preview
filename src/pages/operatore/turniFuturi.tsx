import { Card, CardContent } from "@/components/ui/card"
import { ezystaffBEUrl } from "@/utils/baseUrl";
import { useEffect, useState } from "react";
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
  const idOperatore = localStorage.getItem('idOperatore');
  const [turniFuturi,setTurniFuturi]=useState<TurnoEvento[]>(turniFuturiDemo);

  useEffect(()=>{caricaTurniAssegnati();},[])

  const caricaTurniAssegnati=async()=>{
    try {
      const resp=await fetch(ezystaffBEUrl+`turni/turniFuturi/${idOperatore}`,{
        headers:{
          'Authorization':`Bearer ${localStorage.getItem('token')}`,
          'Content-Type':'application/json',
          accept:'application/json'
        },
        credentials:'include'
      });

      if(!resp.ok) return;

      const data=await resp.json();
      if(Array.isArray(data) && data.length>0) setTurniFuturi(data)
    } catch {
      // Nella preview restano visibili i dati demo per verificare il layout.
    }
  }

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

  return (
    <section className="main-section">
      <div className="titolo">Turni futuri</div>

      {turniFuturi.map((turnoFuturo)=>(
        <Card className="turni-futuri-card" key={turnoFuturo.idTurno}>
          <CardContent className="p-4">
            <div className="turni-futuri-operativita !pt-2">
              <div className="turni-futuri-data-content">
                <div className="turni-futuri-giorno">{formatDay(turnoFuturo.dataTurno)}</div>
                <div className="turni-futuri-mese">{formatMonthShort(turnoFuturo.dataTurno)}</div>
              </div>

              <div className="min-w-0 flex-1">
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
            </div>

            {turnoFuturo.notaTurno&&(
              <div className="turni-futuri-note-operative-content">
                <div className="note-operative-label">NOTE OPERATIVE</div>
                <div className="note-operative-value">{turnoFuturo.notaTurno}</div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </section>
  )
}

export default turniFuturi
