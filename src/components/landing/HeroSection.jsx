import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
    const navigate = useNavigate();

    return (
        <section id="inicio" className="relative px-6 pt-28 pb-20 text-center">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(25,148,98,0.45),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(212,175,55,0.18),transparent_35%)]" />
            <div className="mx-auto max-w-4xl">
                <span className="mb-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80">
                    Hecho para negocios de Uruguay
                </span>

                <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                    La agenda online que tu negocio necesita.
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-white/75 md:text-xl">
                    Creá tu página de reservas y empezá a recibir turnos hoy mismo.
                </p>

                <button
                    onClick={() => navigate("/register")}
                    className="mt-10 inline-flex items-center gap-2 cursor-pointer rounded-full bg-gradient-to-r from-[#199462] to-[#2D7A5F] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-105"                >
                    Prueba gratis
                    <ArrowRight size={20} />
                </button>

                <div className="mx-auto mt-16 max-w-5xl rounded-3xl border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur">
                    <div className="aspect-[16/9] rounded-2xl bg-white/90 text-slate-900 flex items-center justify-center">
                        <img
                            src="/image.png"
                            alt="Demo de la aplicación"
                            className="h-full w-auto rounded-2xl object-cover "
                        />
                        {/* <img
                            src="/full-dashboard-screenshot.png"
                            alt="Demo de la aplicación"
                            className="h-full w-auto rounded-2xl object-cover"
                        /> */}
                    </div>
                </div>
            </div>
        </section>
    );
}