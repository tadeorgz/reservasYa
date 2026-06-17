import { useNavigate } from 'react-router-dom';
import { CircleArrowLeft } from 'lucide-react';
import { businessTypes } from '../data/businessTypes';

function BusinessTypePage() {
    const navigate = useNavigate();

    const handleSelectType = (type) => {
        localStorage.setItem('selectedBusinessType', JSON.stringify(type));
        navigate('/servicios');
    };

    return (
        <div className="min-h-screen bg-brand-gradient p-6 flex flex-col items-center justify-center">
            <div className="w-full lg:max-w-4/5 max-w-11/12 text-center mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="text-white cursor-pointer py-2 px-4 rounded-lg mb-4 hover:bg-white/10 transition-all flex items-center"
                >
                    <CircleArrowLeft className="inline-block mr-2" />
                </button>

                <h1 className="text-3xl font-bold text-white mb-2">
                    ¿Qué tipo de negocio tienes?
                </h1>

                <p className="text-white/80">
                    Esto nos ayuda a preparar servicios iniciales para tu agenda.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:max-w-4/5 max-w-11/12">
                {businessTypes.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => handleSelectType(type)}
                        className="bg-brand-bg cursor-pointer text-left p-6 rounded-3xl shadow-xl border border-white/10 hover:scale-[1.02] transition-all"
                    >
                        <div className="text-4xl mb-4">{type.icon}</div>

                        <h2 className="text-xl font-bold text-brand-text mb-2">
                            {type.title}
                        </h2>

                        <p className="text-sm text-brand-text/70">
                            {type.description}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default BusinessTypePage;