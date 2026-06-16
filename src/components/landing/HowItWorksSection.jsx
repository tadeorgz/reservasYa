const steps = [
    {
        number: "01",
        title: "Creá tu negocio",
        text: "Cargás nombre, WhatsApp, rubro y datos básicos para empezar.",
    },
    {
        number: "02",
        title: "Configurá servicios y horarios",
        text: "Definís qué ofrecés, cuánto dura cada servicio y cuándo atendés.",
    },
    {
        number: "03",
        title: "Compartí tu link de reservas",
        text: "Tus clientes reservan desde una página simple y vos ves todo en el dashboard.",
    },
];

export default function HowItWorksSection() {
    return (
        <section id="funciona" className="bg-[#FBFBF9] px-6 py-24 text-[#1E2925]">
            <div className="mx-auto max-w-7xl">
                <div className="max-w-3xl">
                    <span className="rounded-full bg-[#D4AF37]/20 px-4 py-2 text-sm font-bold text-[#7A5B00]">
                        Cómo funciona
                    </span>

                    <h2 className="mt-6 text-3xl font-black tracking-tight md:text-5xl">
                        Tu agenda online lista en pocos minutos.
                    </h2>

                    <p className="mt-5 text-lg font-medium text-[#1E2925]/70">
                        Sin instalaciones raras, sin vueltas técnicas y sin depender de una app.
                        Entrás, configurás y empezás a recibir turnos.
                    </p>
                </div>

                <div className="mt-14 grid gap-6 md:grid-cols-3">
                    {steps.map((step) => (
                        <article
                            key={step.number}
                            className="rounded-3xl bg-[#0D231B] p-7 text-white shadow-xl"
                        >
                            <span className="text-sm font-black text-[#D4AF37]">
                                {step.number}
                            </span>

                            <h3 className="mt-5 text-2xl font-black">{step.title}</h3>

                            <p className="mt-4 leading-7 text-white/70">{step.text}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}