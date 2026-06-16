import {
    CalendarDays,
    Link,
    Users,
    Scissors,
    BarChart3,
    Settings,
} from "lucide-react";

const features = [
    {
        icon: CalendarDays,
        title: "Agenda visual",
        text: "Todos los turnos en un calendario claro, ordenado por día y profesional.",
    },
    {
        icon: Link,
        title: "Página de reservas",
        text: "Compartí tu link para que tus clientes reserven sin escribirte por WhatsApp.",
    },
    {
        icon: Users,
        title: "Profesionales",
        text: "Gestioná barberos, peluqueros o integrantes del equipo desde el panel.",
    },
    {
        icon: Scissors,
        title: "Servicios",
        text: "Configurá precios, duración y servicios activos según tu negocio.",
    },
    {
        icon: BarChart3,
        title: "Métricas",
        text: "Visualizá turnos, ingresos y actividad para tomar mejores decisiones.",
    },
    {
        icon: Settings,
        title: "Configuración simple",
        text: "Personalizá horarios, datos del negocio, colores y link público.",
    },
];

export default function FeaturesSection() {
    return (
        <section id="incluye" className="bg-[#0D231B] px-6 py-24 text-white">
            <div className="mx-auto max-w-7xl">
                <div className="max-w-3xl">
                    <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-[#D4AF37]">
                        Qué incluye
                    </span>

                    <h2 className="mt-6 text-3xl font-black tracking-tight md:text-5xl">
                        Todo lo necesario para empezar a trabajar más ordenado.
                    </h2>

                    <p className="mt-5 text-lg font-medium text-white/70">
                        Un panel simple para gestionar turnos, servicios, profesionales y reservas públicas desde un solo lugar.
                    </p>
                </div>

                <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <article
                                key={feature.title}
                                className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur transition hover:bg-white/10"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#199462]/20 text-[#D4AF37]">
                                    <Icon size={24} />
                                </div>

                                <h3 className="mt-6 text-xl font-black">{feature.title}</h3>

                                <p className="mt-3 leading-7 text-white/65">
                                    {feature.text}
                                </p>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}