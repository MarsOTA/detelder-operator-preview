import React,{useState} from 'react';
import { Tabs,TabsContent,TabsList,TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Accordion,AccordionContent,AccordionItem,AccordionTrigger } from '@/components/ui/accordion';
import { ContestazioneTimbraturaDialog } from './dialog/contestazioneTimbraturaDialog';

type Turno={idPayroll:number;idTurno:number;stato:string;dataTurno:string;oraInizioDefinitivo:string;oraFineDefinitivo:string;orePausaDefinitivo:number;ragioneSociale:string;nomeBrand:string;indirizzoEvento:string;approvato:boolean}
const turni:Turno[]=[{idPayroll:1,idTurno:1,stato:'',dataTurno:'01/09/2026',oraInizioDefinitivo:'08:00',oraFineDefinitivo:'20:00',orePausaDefinitivo:1,ragioneSociale:'Milano Eventi',nomeBrand:'Fashion Week',indirizzoEvento:'Piazza del Duomo, Milano',approvato:false},{idPayroll:2,idTurno:2,stato:'CONTESTATO',dataTurno:'02/09/2026',oraInizioDefinitivo:'20:00',oraFineDefinitivo:'08:00',orePausaDefinitivo:1,ragioneSociale:'Arena Milano',nomeBrand:'Live Event',indirizzoEvento:'Assago, Milano',approvato:false}];
const mesi=[{meseAnno:'Agosto 2026',numeroTurni:12,totaleMinuti:7920,mese:8,anno:2026},{meseAnno:'Luglio 2026',numeroTurni:10,totaleMinuti:6600,mese:7,anno:2026}];

const Rendicontazione=()=>{
 const[tabAttivo,setTabAttivo]=useState('approvare');
 const[contestazioneDialogOpen,setContestazioneDialogOpen]=useState(false);
 const[turnoSelezionato,setTurnoSelezionato]=useState<{idPayroll:number;idTurno:number}|null>(null);
 const calcola=(items:Turno[])=>{let min=0;items.forEach(t=>{const[a,b]=t.oraInizioDefinitivo.split(':').map(Number);const[c,d]=t.oraFineDefinitivo.split(':').map(Number);let i=a*60+b,f=c*60+d;if(f<i)f+=1440;min+=f-i-t.orePausaDefinitivo*60});return `${String(Math.floor(min/60)).padStart(2,'0')}:${String(min%60).padStart(2,'0')}`};
 const modifica=(t:Turno)=>{setTurnoSelezionato({idPayroll:t.idPayroll,idTurno:t.idTurno});setContestazioneDialogOpen(true)};

 return <section className="main-section">
  <div className="titolo">Rendicontazione</div>
  <Tabs value={tabAttivo} onValueChange={setTabAttivo} className="w-full">
   <TabsList className="tabs-list !h-12 !w-full !gap-1 !rounded-[14px] !border !border-[#27485a] !bg-[#0b1d2a] !p-1">
    <TabsTrigger value="approvare" className="tab-button !h-10 flex-1 !rounded-[10px] !border !border-transparent !bg-transparent !text-[14px] !font-semibold !text-[#9fb3c4] !shadow-none transition-all duration-150 hover:!bg-[#102937] hover:!text-[#d8e7ec] data-[state=active]:!border-[#3f766c] data-[state=active]:!bg-[#153d3a] data-[state=active]:!text-[#9be8ce] data-[state=active]:!shadow-[0_1px_0_rgba(0,255,184,0.08)]">Da approvare</TabsTrigger>
    <TabsTrigger value="archivio" className="tab-button !h-10 flex-1 !rounded-[10px] !border !border-transparent !bg-transparent !text-[14px] !font-semibold !text-[#9fb3c4] !shadow-none transition-all duration-150 hover:!bg-[#102937] hover:!text-[#d8e7ec] data-[state=active]:!border-[#3f766c] data-[state=active]:!bg-[#153d3a] data-[state=active]:!text-[#9be8ce] data-[state=active]:!shadow-[0_1px_0_rgba(0,255,184,0.08)]">Archivio</TabsTrigger>
   </TabsList>

   <TabsContent value="approvare" className="mt-3">
    <div className="sintesi-rendicontazione-content !mb-3 !rounded-[14px] !border-[#2f655d] !bg-[#102d32] !p-3.5 !shadow-none">
     <div className="flex flex-col">
      <span className="totale-ore-label !text-[11px] !font-semibold !uppercase !tracking-[0.04em] !text-[#a9c0c3]">Totale ore</span>
      <div className="flex items-baseline gap-1"><span className="totale-ore-value !text-[28px] !leading-none">{calcola(turni)}</span><span className="totale-ore-unita !text-[13px]">h</span></div>
     </div>
     <div className="flex flex-col items-end">
      <span className="totale-giorni-label !text-[11px] !font-semibold !uppercase !tracking-[0.04em] !text-[#a9c0c3]">Giorni lavorati</span>
      <div className="flex items-baseline gap-1"><span className="totale-giorni-value !text-[28px] !leading-none">{turni.length}</span><span className="totale-giorni-unita !text-[13px]">Giorni</span></div>
     </div>
    </div>

    <div className="rendicontazione-info !mb-3 !rounded-[12px] !border-[#27485a] !border-l-[3px] !border-l-[#5f8eb0] !bg-[#0c2230] !p-3 !shadow-none">
     <div className="rendicontazione-info-title !text-[14px] !font-semibold !text-[#b9d6e8]">Periodo di Approvazione</div>
     <div className="rendicontazione-info-testo !mt-1 !text-[13px] !leading-[1.45] !text-[#d7e2e8]">Hai tempo fino al 5 Settembre 2026 per approvare o contestare i turni di Agosto. Dopo tale data, i turni verranno approvati automaticamente.</div>
    </div>

    {turni.map((t,index)=><React.Fragment key={index}>
     <div className="rendicontazione-turno-content !mt-3 !rounded-[14px] !border-[#335a60] !bg-[#0d2730] !p-3.5 !shadow-none">
      <div className="flex items-center justify-between gap-3">
       <span className="rendicontazione-data-turno !ml-0 !rounded-[7px] !border-[#3f766c] !bg-[#153d3a] !px-2 !py-1 !text-[11px] !font-semibold !text-[#9be8ce]">{t.dataTurno}</span>
       <span className="rendicontazione-orario-turno !mr-0 !text-[15px] !font-bold !text-[#ccffec]">{t.oraInizioDefinitivo} - {t.oraFineDefinitivo}</span>
      </div>
      <div className="rendicontazione-pausa-turno !mr-0 !mt-1 !text-[11px] !font-medium !text-[#9fb3c4]">Pausa {t.orePausaDefinitivo} h</div>
      <div className="rendicontazione-titolo-turno !ml-0 !mt-3 !text-[16px] !font-semibold !leading-[1.25] !text-[#f2f7f7]">{t.ragioneSociale} - {t.nomeBrand}</div>
      <div className="rendicontazione-indirizzo-turno !ml-0 !mt-1 !text-[13px] !text-[#b8c8cf]">{t.indirizzoEvento}</div>
      <div className="mt-3 flex w-full items-center justify-end">
       {t.approvato
        ? <span className="flex h-9 w-full items-center justify-center rounded-[9px] border border-[#2f6b5d] bg-[#0f332f] px-3 text-[11px] font-bold tracking-[0.04em] text-[#8edbc3]">APPROVATO</span>
        : t.stato==='CONTESTATO'
         ? <span className="flex h-9 w-full items-center justify-center rounded-[9px] border border-[#385c58] bg-[#162d2d] px-3 text-[11px] font-bold tracking-[0.04em] text-[#a9d8c8]">MODIFICATO</span>
         : <div className="flex w-full items-center justify-between gap-3">
            <Button onClick={()=>{}} className="!h-10 !w-[48%] !rounded-[10px] !border !border-[#00e6a6] !bg-[#00e6a6] !text-[12px] !font-bold !text-[#0b2b25] !shadow-none hover:!bg-[#16efb2]"><span>APPROVA</span></Button>
            <Button onClick={()=>modifica(t)} className="rendicontazione-bottone-modifica !h-10 !w-[48%] !rounded-[10px] !border-[#906121] !bg-[#2d251c] !text-[12px] !font-bold !text-[#ffc967] !shadow-none hover:!bg-[#382c1f]"><span>MODIFICA</span></Button>
           </div>}
      </div>
     </div>
    </React.Fragment>)}
   </TabsContent>

   <TabsContent value="archivio" className="mt-3">
    <Accordion type="single" collapsible className="w-full">
     {mesi.map(m=>{const ore=Math.floor(m.totaleMinuti/60),min=m.totaleMinuti%60;return <AccordionItem key={m.meseAnno} value={m.meseAnno} className="archivio-mensile-trigger !mt-3 !overflow-hidden !rounded-[14px] !border-[#294b57] !bg-[#0b1d2a] !px-3 !py-0">
      <AccordionTrigger className="!py-3 hover:!no-underline [&>svg]:!text-[#9bc7bd]"><div className="flex w-full items-center justify-between gap-3"><span className="archivio-mese-anno !text-[18px] !font-semibold !text-[#f2f7f7]">{m.meseAnno}</span><div className="archivio-giorni-mensili !text-[16px] !font-semibold !leading-tight !text-[#82cdb7]"><span>{String(ore).padStart(2,'0')}:{String(min).padStart(2,'0')} h</span><span className="mx-2">•</span><span>{m.numeroTurni} turni</span></div></div></AccordionTrigger>
      <AccordionContent className="!pb-3">
       {turni.map((t,index)=><React.Fragment key={index}>
        <div className="turno-archiviato-content !mt-2 !rounded-[10px] !border-[#2d5553] !bg-[#0c292b] !p-3 !shadow-none">
         <div className="flex items-center justify-between gap-3"><span className="data-turno-archiviato !text-[11px] !font-semibold !text-[#8bd4bf]">{t.dataTurno}</span><span className="ora-turno-archiviato !text-[14px] !text-[#9be8ce]">{t.oraInizioDefinitivo} - {t.oraFineDefinitivo}</span></div>
         <div className="pausa-turno-archiviato !mr-0 !mt-1 !text-[11px] !text-[#9fb3c4]">Pausa {t.orePausaDefinitivo} h</div>
         <div className="nome-turno-archiviato !ml-0 !mt-2 !text-[14px] !font-medium !text-[#eef5f5]">{t.ragioneSociale} - {t.nomeBrand}</div>
         <div className="indirizzo-turno-archiviato !ml-0 !mt-1 !text-[11px] !text-[#aebfc3]">{t.indirizzoEvento}</div>
        </div>
       </React.Fragment>)}
      </AccordionContent>
     </AccordionItem>})}
    </Accordion>
   </TabsContent>
  </Tabs>
  <ContestazioneTimbraturaDialog open={contestazioneDialogOpen} setOpen={setContestazioneDialogOpen} onSubmit={()=>setContestazioneDialogOpen(false)} idPayroll={turnoSelezionato?.idPayroll} idTurno={turnoSelezionato?.idTurno}/>
 </section>
}
export default Rendicontazione;
