import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
    Layout, 
    Briefcase, 
    FileText,
    ChevronRight
} from 'lucide-react';

const UserDashboard = () => {
    const { user } = useAuth();

    const menuItems = [
        {
            title: "Licitaciones Disponibles",
            description: "Explora y participa en licitaciones públicas activas",
            icon: <Briefcase className="w-8 h-8" />,
            link: "/licitaciones",
            buttonText: "Ver Licitaciones",
            gradient: "from-blue-600 to-cyan-500"
        },
        {
            title: "Mis Propuestas",
            description: "Gestiona tus propuestas y da seguimiento a su estado",
            icon: <FileText className="w-8 h-8" />,
            link: "/mis-propuestas",
            buttonText: "Gestionar Propuestas",
            gradient: "from-emerald-600 to-teal-500"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black">
            {/* Navbar con efecto glassmorphism */}
            <nav className="bg-white bg-opacity-10 backdrop-blur-lg border-b border-white border-opacity-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-3">
                            <Layout className="w-8 h-8 text-blue-400" />
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                Panel de Usuario
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="px-4 py-2 rounded-xl bg-blue-900 bg-opacity-30 border border-blue-400 border-opacity-30">
                                <span className="text-blue-200">
                                    Cuenta: {user?.address.slice(0, 6)}...{user?.address.slice(-4)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Contenido principal */}
            <main className="max-w-7xl mx-auto mt-8 px-4 pb-8">
                {/* Elementos de fondo decorativos */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                    <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {menuItems.map((item, index) => (
                        <Link 
                            to={item.link} 
                            key={index}
                            className="transform transition-all duration-300 hover:scale-102 hover:-translate-y-1"
                        >
                            <div className="relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white bg-opacity-10 border border-white border-opacity-20 p-6">
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 opacity-10 bg-gradient-to-br"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-xl bg-gradient-to-br text-white">
                                            {item.icon}
                                        </div>
                                    </div>
                                    
                                    <h2 className="text-2xl font-bold text-white mb-2">
                                        {item.title}
                                    </h2>
                                    
                                    <p className="text-blue-200 mb-6 opacity-80">
                                        {item.description}
                                    </p>
                                    
                                    <button className={`
                                        w-full py-3 px-4 rounded-xl
                                        flex items-center justify-between
                                        bg-gradient-to-r ${item.gradient}
                                        text-white font-semibold
                                        transition-all duration-300
                                        hover:shadow-lg hover:shadow-blue-500/20
                                    `}>
                                        <span>{item.buttonText}</span>
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Elementos decorativos */}
                                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-white to-transparent opacity-5 rounded-full blur-2xl"></div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;