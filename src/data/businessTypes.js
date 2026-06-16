export const businessTypes = [
    {
        id: 'barberia',
        title: 'Barbería',
        description: 'Cortes, barba y servicios masculinos.',
        icon: '💈',
        defaultServices: [
            { id: 'corte', name: 'Corte', price: 400, duration: 30 },
            { id: 'corte-barba', name: 'Corte + barba', price: 600, duration: 45 },
            { id: 'barba', name: 'Barba', price: 300, duration: 20 },
        ],
    },
    {
        id: 'salon-belleza',
        title: 'Salón de belleza',
        description: 'Peluquería, color, lavado y tratamientos.',
        icon: '💇',
        defaultServices: [
            { id: 'corte-dama', name: 'Corte', price: 500, duration: 40 },
            { id: 'color', name: 'Color', price: 1200, duration: 90 },
            { id: 'lavado', name: 'Lavado', price: 300, duration: 20 },
        ],
    },
    {
        id: 'unas',
        title: 'Uñas',
        description: 'Manicura, soft gel, esmaltado y diseño.',
        icon: '💅',
        defaultServices: [
            { id: 'manicura', name: 'Manicura', price: 500, duration: 45 },
            { id: 'soft-gel', name: 'Soft gel', price: 900, duration: 75 },
            { id: 'esmaltado', name: 'Esmaltado', price: 450, duration: 40 },
        ],
    },
    {
        id: 'estetica',
        title: 'Estética',
        description: 'Tratamientos faciales, depilación y belleza.',
        icon: '✨',
        defaultServices: [
            { id: 'limpieza-facial', name: 'Limpieza facial', price: 900, duration: 60 },
            { id: 'depilacion', name: 'Depilación', price: 600, duration: 45 },
        ],
    },
    {
        id: 'masajes',
        title: 'Masajes',
        description: 'Masajes relajantes, deportivos o terapéuticos.',
        icon: '💆',
        defaultServices: [
            { id: 'masaje-relajante', name: 'Masaje relajante', price: 1000, duration: 60 },
            { id: 'masaje-descontracturante', name: 'Masaje descontracturante', price: 1200, duration: 60 },
        ],
    },
    {
        id: 'otros',
        title: 'Otros',
        description: 'Servicios no incluidos en las categorías anteriores.',
        icon: '❓',
        defaultServices: [
            { id: 'servicio-general', name: 'Servicio general', price: 500, duration: 30 },
        ],
    },
];