const businessTypes = [
    { emoji: "💈", title: "Barberías", text: "Agenda por profesional, servicios rápidos y reservas simples." },
    { emoji: "💇", title: "Peluquerías", text: "Organizá cortes, color, brushing y tratamientos." },
    { emoji: "💅", title: "Uñas", text: "Turnos por duración, clientas recurrentes y horarios claros." },
    { emoji: "✨", title: "Estética", text: "Ideal para tratamientos, sesiones y atención personalizada." },
    { emoji: "🧖", title: "Masajes", text: "Reservas ordenadas para servicios por bloque horario." },
];

export default function BusinessTypesSection() {
    return (
        <section className="bg-[#FBFBF9] px-6 py-24 text-[#1E2925]">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                    <span className="rounded-full bg-[#199462]/10 px-4 py-2 text-sm font-bold text-[#199462]">
                        Pensado para
                    </span>

                    <h2 className="mt-6 text-3xl font-black tracking-tight md:text-5xl">
                        Negocios que trabajan con agenda.
                    </h2>

                    <p className="mt-5 text-lg font-medium text-[#1E2925]/70">
                        ReservasYa se adapta a barberías, peluquerías, salones y servicios que necesitan ordenar turnos.
                    </p>
                </div>

                <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                    {businessTypes.map((type) => (
                        <article
                            key={type.title}
                            className="rounded-3xl border border-black/5 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="text-4xl">{type.emoji}</div>
                            <h3 className="mt-5 text-xl font-black">{type.title}</h3>
                            <p className="mt-3 text-sm leading-6 text-[#1E2925]/65">
                                {type.text}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}