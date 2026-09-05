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
    "cursor-pointer rounded-xl border-0 font-semibold transition-colors",
    mobile ? "h-12 w-full justify-start px-4 text-[15px]" : "h-10 px-3 text-sm",
    active
      ? "border-l-[3px] border-l-[#00ffb8] bg-[#153d3a] text-[#9be8ce] hover:bg-[#153d3a] hover:text-[#9be8ce]"
      : "border-l-[3px] border-l-transparent bg-[#102330] text-[#f5f7fb] hover:bg-[#172f36] hover:text-[#9be8ce]"
  ].join(" ");

  const iconClass = "mr-3 h-5 w-5 shrink-0";

  return (
    <header className="operatore-header">
      <div className="container mx-auto flex flex-col px-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-h-[64px] w-full items-center justify-between md:w-auto">
          <div className="h-14 w-36">
            <img src="/assets/logo.svg" alt="Logo" className="block h-full w-full object-contain" />
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
              className="h-10 w-10 rounded-xl text-[#00ffb8] hover:bg-[#102330] hover:text-[#00ffb8]"
            >
              {menuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </Button>
          </div>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          <div className="inline-flex h-10 items-center rounded-xl border border-[#3f766c] bg-[#173a34] px-3 text-sm font-semibold text-[#9be8ce]">
            {operatoreLoggato}
          </div>

          <Link to="/operator">
            <Button variant="ghost" className={navButtonClass(location.pathname === "/operator")}>
              <Briefcase className="mr-2 h-4 w-4" />Turni di oggi
            </Button>
          </Link>

          <Link to="/operator/turniFuturi">
            <Button variant="ghost" className={navButtonClass(location.pathname === "/operator/turniFuturi")}>
              <CalendarClock className="mr-2 h-4 w-4" />Turni Futuri
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
              className="h-10 cursor-pointer rounded-xl border-0 bg-transparent px-3 text-sm font-semibold text-[#d7e2e8] hover:bg-[#301f22] hover:text-[#f1b6b6]"
            >
              <LogOut className="mr-2 h-4 w-4" />Logout
            </Button>
          </div>
        </nav>

        {menuOpen && (
          <nav className="flex flex-col gap-2 pb-4 pt-2 md:hidden">
            <div className="mb-1 inline-flex h-10 self-start items-center rounded-xl border border-[#3f766c] bg-[#173a34] px-3 text-sm font-semibold text-[#9be8ce]">
              {operatoreLoggato}
            </div>

            <Link to="/operator" onClick={toggleMenu}>
              <Button variant="ghost" className={navButtonClass(location.pathname === "/operator", true)}>
                <Briefcase className={iconClass} />Turni di oggi
              </Button>
            </Link>

            <Link to="/operator/turniFuturi" onClick={toggleMenu}>
              <Button variant="ghost" className={navButtonClass(location.pathname === "/operator/turniFuturi", true)}>
                <CalendarClock className={iconClass} />Turni Futuri
              </Button>
            </Link>

            <Link to="/operator/rendicontazione" onClick={toggleMenu}>
              <Button variant="ghost" className={navButtonClass(location.pathname === "/operator/rendicontazione", true)}>
                <UserCheck className={iconClass} />Rendicontazione
              </Button>
            </Link>

            <div className="mt-2 border-t border-[#264556] pt-3">
              <Button
                variant="ghost"
                onClick={logout}
                className="h-12 w-full cursor-pointer justify-start rounded-xl border-0 bg-transparent px-4 text-[15px] font-semibold text-[#d7e2e8] hover:bg-[#301f22] hover:text-[#f1b6b6]"
              >
                <LogOut className={iconClass} />Logout
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default HeaderOperatore
