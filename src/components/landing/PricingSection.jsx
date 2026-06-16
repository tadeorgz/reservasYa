import { Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
    {
        name: "Gratis",
        price: "$0",
        description: "Para empezar con una agenda online simple.",
        highlight: false,
        features: [
            "21 días gratis",
            "1 profesional",
            "Hasta 30 reservas al mes",
            "Página pública de reservas",
            "Agenda básica",
        ],
    },
    {
        name: "Estándar",
        price: "$490",
        description: "Para negocios que ya reciben varios turnos por semana.",
        highlight: true,
        features: [
            "21 días gratis",
            "Hasta 3 profesionales",
            "Hasta 300 reservas al mes",
            "Servicios ilimitados",
            "Clientes e historial",
        ],
    },
    {
        name: "Profesional",
        price: "$890",
        description: "Para equipos que necesitan más control y métricas.",
        highlight: false,
        features: [
            "21 días gratis",
            "Profesionales ilimitados",
            "Reservas ilimitadas",
            "Métricas avanzadas",
            "Personalización del negocio",
        ],
    },
];

export default function PricingSection() {
    const navigate = useNavigate();

    return (
        <section id="planes" className="bg-[#FBFBF9] px-6 py-24 text-[#1E2925]">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                    <span className="rounded-full bg-[#199462]/10 px-4 py-2 text-sm font-bold text-[#199462]">
                        Planes
                    </span>

                    <h2 className="mt-6 text-3xl font-black tracking-tight md:text-5xl">
                        Empezá gratis y elegí el plan cuando tu negocio crezca.
                    </h2>

                    <p className="mt-5 text-lg font-medium text-[#1E2925]/70">
                        Todos los planes incluyen 21 días gratis. Sin compromiso ni tarjeta inicial.
                    </p>
                </div>

                <div className="mt-14 grid gap-6 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <article
                            key={plan.name}
                            className={`relative rounded-3xl border p-8 shadow-sm ${plan.highlight
                                ? "border-[#199462] bg-[#0D231B] text-white shadow-2xl "
                                : "border-black/5 bg-white text-[#1E2925] shadow-lg "
                                }`}
                        >
                            {plan.highlight && (
                                <span className="absolute right-6 top-6 rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-black text-[#0D231B]">
                                    Recomendado
                                </span>
                            )}

                            <h3 className="text-2xl font-black">{plan.name}</h3>

                            <p
                                className={`mt-3 min-h-12 text-sm leading-6 ${plan.highlight ? "text-white/65" : "text-[#1E2925]/65"
                                    }`}
                            >
                                {plan.description}
                            </p>

                            <div className="mt-8 flex items-end gap-1">
                                <span className="text-5xl font-black">{plan.price}</span>
                                <span
                                    className={`pb-2 text-sm font-bold ${plan.highlight ? "text-white/60" : "text-[#1E2925]/55"
                                        }`}
                                >
                                    /mes
                                </span>
                            </div>

                            <button
                                onClick={() => navigate("/register")}
                                className={`mt-8 inline-flex w-full items-center justify-center cursor-pointer gap-2 rounded-full px-6 py-3.5 text-sm font-black transition ${plan.highlight
                                    ? "bg-[#199462] text-white hover:bg-[#2D7A5F]"
                                    : "bg-[#1E2925] text-white hover:bg-[#0D231B]"
                                    }`}
                            >
                                Prueba gratis
                                <ArrowRight size={18} />
                            </button>

                            <ul className="mt-8 space-y-4">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex gap-3 text-sm font-semibold">
                                        <Check
                                            size={18}
                                            className={
                                                plan.highlight ? "text-[#D4AF37]" : "text-[#199462]"
                                            }
                                        />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}