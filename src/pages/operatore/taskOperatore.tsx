import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { MapPin, CalendarDays, Users, UserStar, MapPinCheckInside, Coffee, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ListaColleghiDialog } from "./dialog/listaColleghiDialog";
import { ReferenteEventoDialog } from "./dialog/referenteEventoDialog";

type ListaColleghi={nome:string;cognome:string;telefono:string;oraInizio:string;oraFine:string;tipoMansione:string;teamLeader:boolean;gpg:boolean;timbraturaEffettuata:boolean}
type TurnoEvento={idTurno:number;titoloEvento:string;localitaEvento:string;nomeCognomeReferente:string;telefonoReferente:string;dataTurno:string;oraInizio:string;oraFine:string;orePausa:number;notaTurno:string;tipologiaTurno:string;tipoMansione:string;teamLeader:boolean;listaColleghi:ListaColleghi[]}

const turniDemo:TurnoEvento[]=[
 {idTurno:9001,titoloEvento:'Milano Fashion Week',localitaEvento:'Palazzo Reale, Piazza del Duomo, Milano',nomeCognomeReferente:'Marco Rossi',telefonoReferente:'333 1234567',dataTurno:'05/09/2026',oraInizio:'08:00',oraFine:'14:00',orePausa:.5,notaTurno:'Presentarsi 15 minuti prima al punto di ritrovo.',tipologiaTurno:'DIURNO',tipoMansione:'VIG',teamLeader:false,listaColleghi:[{nome:'Luca',cognome:'Bianchi',telefono:'333 1112233',oraInizio:'08:00',oraFine:'14:00',tipoMansione:'VIG',teamLeader:true,gpg:false,timbraturaEffettuata:true},{nome:'Sara',cognome:'Verdi',telefono:'333 4445566',oraInizio:'08:00',oraFine:'14:00',tipoMansione:'CP',teamLeader:false,gpg:false,timbraturaEffettuata:false}]},
 {idTurno:9002,titoloEvento:'Evento Corporate Detelder',localitaEvento:'CityLife, Milano',nomeCognomeReferente:'Laura Bianchi',telefonoReferente:'333 9876543',dataTurno:'05/09/2026',oraInizio:'15:00',oraFine:'21:00',orePausa:.5,notaTurno:'Accesso staff da ingresso laterale.',tipologiaTurno:'POMERIDIANO',tipoMansione:'CP',teamLeader:false,listaColleghi:[{nome:'Paolo',cognome:'Neri',telefono:'333 9998877',oraInizio:'15:00',oraFine:'21:00',tipoMansione:'CP',teamLeader:false,gpg:false,timbraturaEffettuata:true}]}
];

const TaskOperatore=()=>{
 const navigate=useNavigate();
 const [turniGiornalieri]=useState<TurnoEvento[]>(turniDemo);
 const [turnoSelezionato,setTurnoSelezionato]=useState<TurnoEvento>();
 const [openListaColleghiDialog,setOpenListaColleghiDialog]=useState(false);
 const [openReferenteEventoDialog,setOpenReferenteEventoDialog]=useState(false);
 const formatDateShort=()=>{const t=new Date();const w=t.toLocaleDateString('it-IT',{weekday:'long'});const d=t.toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'});return `${w}, ${d}`};
 const formatTimeShort=()=>new Date().toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
 const [oraCorrente,setOraCorrente]=useState(formatTimeShort());
 useEffect(()=>{const timer=setInterval(()=>setOraCorrente(formatTimeShort()),1000);return()=>clearInterval(timer)},[]);
 const getStatoTurno=(dataTurno:string,oraInizio:string,oraFine:string):'IN_CORSO'|'FUTURO'|'PASSATO'=>{const[g,m,a]=dataTurno.split('/').map(Number);const[hi,mi]=oraInizio.split(':').map(Number);const[hf,mf]=oraFine.split(':').map(Number);const i=new Date(a,m-1,g,hi,mi);const f=new Date(a,m-1,g,hf,mf);const n=new Date();if(n>=i&&n<=f)return'IN_CORSO';if(n<i)return'FUTURO';return'PASSATO'};
 const apriListaColleghi=(id:number)=>{setTurnoSelezionato(turniGiornalieri.find(t=>t.idTurno===id));setOpenListaColleghiDialog(true)};
 const apriReferente=(id:number)=>{setTurnoSelezionato(turniGiornalieri.find(t=>t.idTurno===id));setOpenReferenteEventoDialog(true)};
 const mapsHref=(address:string)=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
 const partiOra=oraCorrente.split(':');
 return <section className="main-section">
  <div className="titolo">Turni di oggi</div>
  <div className="dataOggi"><CalendarDays className="h-4 w-4" strokeWidth={1.5}/><span>{formatDateShort()}</span></div>
  <div className="box-checkin-checkout"><div><div className="box-timer"><div className="timer-value"><span className="timer-main">{partiOra[0]}:{partiOra[1]}</span><span className="timer-seconds">:{partiOra[2]}</span></div><div className="timer-label">ORARIO CORRENTE</div></div><Button onClick={()=>{}} className="check-button check-button-in" size="lg"><span className="check-button-content"><MapPinCheckInside className="!w-[20px] !h-[20px]"/>CHECK-IN</span></Button></div></div>
  {turniGiornalieri.map((turno,index)=>{getStatoTurno(turno.dataTurno,turno.oraInizio,turno.oraFine);const labelTurno=index===0?'TURNO IN CORSO':'PROSSIMO TURNO';return <Card className={`card-turni ${index%2===0?'card-turni-alt':''}`} key={turno.idTurno}><CardContent className="turno-content"><div className="info-orario-turno"><div className="info-ora"><div className={`stato-turno ${index===0?'IN_CORSO':'FUTURO'}`}>{labelTurno}</div><div className="orario-turno">{turno.oraInizio} - {turno.oraFine}</div></div><div className="info-pausa"><div className="pausa-label"><Coffee className="h-4 w-4 text-[#ccffec]" strokeWidth={1.5}/><span>Pausa</span></div><div className="pausa-value">{turno.orePausa} ora</div></div></div><div className="info-turno"><div className="titolo-evento">{turno.titoloEvento}</div><a className="luogo-evento-content" href={mapsHref(turno.localitaEvento)} target="_blank" rel="noopener noreferrer" aria-label={`Apri ${turno.localitaEvento} su Google Maps`}><MapPin className="h-6 w-6" style={{color:'#a5e8cf'}}/><span className="luogo-evento-text">{turno.localitaEvento}</span></a><div className="tipo-evento">Tipo evento: {turno.tipologiaTurno}</div><div className="tipo-mansione">Mansione: {turno.tipoMansione}</div>{turno.notaTurno&&<div className="note-operative-content"><div className="note-operative-label">NOTE OPERATIVE</div><div className="note-operative-value">{turno.notaTurno}</div></div>}</div><div className="info-personale-content"><div className="colleghi-evento" onClick={()=>apriListaColleghi(turno.idTurno)}><Users className="h-7 w-7 text-[#00ffb8]" strokeWidth={1.5}/><span className="colleghi-evento-label">Colleghi</span></div><div className="referente-evento" onClick={()=>apriReferente(turno.idTurno)}><UserStar className="h-7 w-7 text-[#00ffb8]" strokeWidth={1.5}/><span className="referente-evento-label">Referente evento</span></div></div></CardContent></Card>})}
  <div className="sintesi-container"><div className="ore-mese-sintesi"><div className="ore-mese-label">ORE DEL MESE</div><div className="ore-mese-value-content"><CalendarClock className="h-7 w-7 text-[#00d96f]" strokeWidth={1.5}/><div className="ore-mese-value">123:30</div><div className="ore-label"> h</div></div><div className="dettaglio-mese-sintesi" onClick={()=>navigate('/operator/rendicontazione')}>Vai al dettaglio</div></div><div className="prossimi-turni-sintesi"><div className="prossimi-turni-label">PROSSIMI TURNI</div><div className="prossimi-turni-row"><div className="prossimi-turni-next-content"><div className="prossimi-turni-mese-value">SET</div><div className="prossimi-turni-giorno-value">08</div></div><div className="prossimi-turni-value-content"><div>3 turni</div><div>previsti</div></div></div><div className="dettaglio-turni-sintesi" onClick={()=>navigate('/operator/turniFuturi')}>Vedi tutti</div></div></div>
  <ListaColleghiDialog open={openListaColleghiDialog} setOpen={setOpenListaColleghiDialog} listaColleghi={turnoSelezionato?.listaColleghi??[]}/><ReferenteEventoDialog open={openReferenteEventoDialog} setOpen={setOpenReferenteEventoDialog} turnoSelezionato={turnoSelezionato}/>
 </section>
}
export default TaskOperatore;
