import { MessageCircle, CalendarX, Clock, TrendingDown } from "lucide-react";

const problems = [
    {
        icon: MessageCircle,
        title: "Todo queda en WhatsApp",
        text: "Los turnos se mezclan entre mensajes, audios y cambios de horario.",
    },
    {
        icon: CalendarX,
        title: "Se pierden reservas",
        text: "Un cliente escribe, nadie responde a tiempo y termina reservando en otro lado.",
    },
    {
        icon: Clock,
        title: "Horarios desordenados",
        text: "Es fácil pisar turnos o dejar huecos muertos durante el día.",
    },
    {
        icon: TrendingDown,
        title: "Poca claridad del negocio",
        text: "Cuesta saber cuántos turnos hubo, cuánto se generó y qué servicios se venden más.",
    },
];

export default function ProblemSection() {
    return (
        <section className="bg-[#FBFBF9] px-6 py-24 text-[#1E2925]">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                    <span className="rounded-full bg-[#199462]/10 px-4 py-2 text-sm font-bold text-[#199462]">
                        El problema
                    </span>

                    <h2 className="mt-6 text-3xl font-black tracking-tight md:text-5xl">
                        ¿Sos de Uruguay y todavía gestionás los turnos a mano o por WhatsApp?
                    </h2>

                    <p className="mt-5 text-lg font-medium text-[#1E2925]/70">
                        AgendasYa ayuda a negocios chicos y medianos a ordenar su agenda,
                        recibir reservas online y trabajar con más control desde el primer día.
                    </p>
                </div>

                <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    {problems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <article
                                key={item.title}
                                className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#199462]/10 text-[#199462]">
                                    <Icon size={24} />
                                </div>

                                <h3 className="mt-5 text-xl font-black">{item.title}</h3>

                                <p className="mt-3 text-sm leading-6 text-[#1E2925]/65">
                                    {item.text}
                                </p>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}