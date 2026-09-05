import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Briefcase, Menu, X, CalendarClock, UserCheck } from "lucide-react";
import { ezystaffBEUrl } from "../../utils/baseUrl";
import { useState } from "react";
import './styleOperatori.css';

const HeaderOperatore = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const operatoreLoggato = localStorage.getItem('operatoreLoggato');

  const logout = async () => {
    await fetch(ezystaffBEUrl + 'auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', accept: 'application/json' }
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate("/operator");
  }

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(prev => !prev);

  const navButtonClass = (active: boolean, mobile = false) => [
    "cursor-pointer rounded-xl border-0 font-semibold transition-colors duration-150",
    mobile ? "h-12 w-full justify-start px-4 text-[15px]" : "h-10 px-3 text-sm",
    active
      ? "border-l-[3px] border-l-[#00ffb8] bg-[#153d3a] text-[#9be8ce] hover:bg-[#153d3a] hover:text-[#9be8ce]"
      : "border-l-[3px] border-l-transparent bg-transparent text-[#d7e2e8] hover:bg-[#102330] hover:text-[#9be8ce]"
  ].join(" ");

  const iconClass = "mr-3 h-5 w-5 shrink-0";

  return (
    <header className="operatore-header">
      <div className="container mx-auto flex flex-col px-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-h-[64px] w-full items-center justify-between md:w-auto">
          <div className="h-14 w-40">
            <img src="/assets/logo.svg" alt="Logo" className="block h-full w-full object-contain" />
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
              aria-expanded={menuOpen}
              className="h-[50px] w-[50px] rounded-xl text-[#00ffb8] hover:bg-[#102330] hover:text-[#00ffb8]"
            >
              {menuOpen
                ? <X className="!h-[34px] !w-[34px]" strokeWidth={2.4} />
                : <Menu className="!h-[34px] !w-[37px] scale-x-110" strokeWidth={2.5} />}
            </Button>
          </div>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          <div className="inline-flex h-9 items-center px-2 text-[13px] font-medium text-[#9fbfb6]">
            {operatoreLoggato}
          </div>

          <Link to="/operator">
            <Button variant="ghost" className={navButtonClass(location.pathname === "/operator")}>
              <Briefcase className="mr-2 h-4 w-4" />Turni di oggi
            </Button>
          </Link>

          <Link to="/operator/turniFuturi">
            <Button variant="ghost" className={navButtonClass(location.pathname === "/operator/turniFuturi")}>
              <CalendarClock className="mr-2 h-4 w-4" />Turni futuri
            </Button>
          </Link>

          <Link to="/operator/rendicontazione">
            <Button variant="ghost" className={navButtonClass(location.pathname === "/operator/rendicontazione")}>
              <UserCheck className="mr-2 h-4 w-4" />Rendicontazione
            </Button>
          </Link>

          <div className="ml-1 border-l border-[#264556] pl-2">
            <Button
              variant="ghost"
              onClick={logout}
              className="h-10 cursor-pointer rounded-xl border-0 bg-transparent px-3 text-sm font-semibold text-[#c7d4da] hover:bg-[#301f22] hover:text-[#f1b6b6]"
            >
              <LogOut className="mr-2 h-4 w-4" />Logout
            </Button>
          </div>
        </nav>

        <div
          aria-hidden={!menuOpen}
          className={`grid transition-[grid-template-rows,opacity,transform] duration-200 ease-out md:hidden ${
            menuOpen
              ? "grid-rows-[1fr] translate-y-0 opacity-100"
              : "pointer-events-none grid-rows-[0fr] -translate-y-1 opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <nav className="flex flex-col gap-1.5 pb-4 pt-1">
              <div className="mb-1 flex items-center gap-2 px-1 py-1 text-[13px] font-medium text-[#9fbfb6]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3f766c]" />
                {operatoreLoggato}
              </div>

              <Link to="/operator" onClick={toggleMenu}>
                <Button variant="ghost" className={navButtonClass(location.pathname === "/operator", true)}>
                  <Briefcase className={iconClass} />Turni di oggi
                </Button>
              </Link>

              <Link to="/operator/turniFuturi" onClick={toggleMenu}>
                <Button variant="ghost" className={navButtonClass(location.pathname === "/operator/turniFuturi", true)}>
                  <CalendarClock className={iconClass} />Turni futuri
                </Button>
              </Link>

              <Link to="/operator/rendicontazione" onClick={toggleMenu}>
                <Button variant="ghost" className={navButtonClass(location.pathname === "/operator/rendicontazione", true)}>
                  <UserCheck className={iconClass} />Rendicontazione
                </Button>
              </Link>

              <div className="mt-1 border-t border-[#264556] pt-2">
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="h-11 w-full cursor-pointer justify-start rounded-xl border-0 bg-transparent px-4 text-[15px] font-semibold text-[#c7d4da] hover:bg-[#301f22] hover:text-[#f1b6b6]"
                >
                  <LogOut className={iconClass} />Logout
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeaderOperatore
