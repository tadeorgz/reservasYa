import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function LandingNavbar() {
    const navigate = useNavigate();

    const handleScrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#2D7A5F]/20 backdrop-blur ${isScrolled ? 'bg-brand-dark-bg/80' : 'bg-[#2D7A5F]/30 shadow-lg shadow-emerald-500/20'} transition`}>
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <button
                    onClick={() => handleScrollToSection("inicio")}
                    className="flex items-center gap-2 text-xl font-black cursor-pointer"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#199462] to-[#D4AF37]">
                        <img className="h-full w-full object-contain rounded-xl" src="LOGO-RY.webp" alt="ReservasYa Logo " />
                    </span>
                    ReservasYa
                </button>

                <div className="hidden items-center gap-8 text-sm font-semibold text-white/75 md:flex">
                    <button onClick={() => handleScrollToSection("funciona")} className="cursor-pointer hover:text-white">
                        Cómo funciona
                    </button>
                    <button onClick={() => handleScrollToSection("incluye")} className="cursor-pointer hover:text-white">
                        Funcionalidades
                    </button>
                    <button onClick={() => handleScrollToSection("planes")} className="cursor-pointer hover:text-white">
                        Precios
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/login")}
                        className="cursor-pointer hidden text-sm font-semibold text-white/75 hover:text-white md:block pr-4"
                    >
                        Iniciar sesión
                    </button>

                    <button
                        onClick={() => navigate("/register")}
                        className="rounded-full bg-white px-5 cursor-pointer py-2.5 text-sm font-bold text-slate-950 transition hover:bg-white/70 "
                    >
                        Prueba gratis
                    </button>
                </div>
            </nav>
        </header>
    );
}