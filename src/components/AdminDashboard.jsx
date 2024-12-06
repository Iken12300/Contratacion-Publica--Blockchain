import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Layout, 
    FileText, 
    Users, 
    CheckSquare, 
    Clock,
    ChevronRight
} from 'lucide-react';

const AdminDashboard = () => {
    const { contract, user } = useAuth();

    const menuItems = [
        {
            title: "Gestión de Licitaciones",
            description: "Crear y gestionar nuevas licitaciones públicas",
            icon: <FileText className="w-8 h-8" />,
            link: "/licitaciones",
            buttonText: "Gestionar Licitaciones",
            gradient: "from-blue-600 to-cyan-500"
        },
        {
            title: "Gestión de Administradores",
            description: "Administrar roles y permisos del sistema",
            icon: <Users className="w-8 h-8" />,
            link: "/gestion-admins",
            buttonText: "Administrar Roles",
            gradient: "from-emerald-600 to-teal-500"
        },
        {
            title: "Evaluación de Propuestas",
            description: "Revisar y evaluar propuestas pendientes",
            icon: <CheckSquare className="w-8 h-8" />,
            link: "/evaluacion-propuestas",
            buttonText: "Ver Propuestas Pendientes",
            gradient: "from-purple-600 to-pink-500"
        },
        {
            title: "Historial",
            description: "Ver registro histórico de transacciones",
            icon: <Clock className="w-8 h-8" />,
            link: "/historial",
            buttonText: "Ver Historial",
            gradient: "from-gray-800 to-gray-600"
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
                                Panel de Administración
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="px-4 py-2 rounded-xl bg-blue-900 bg-opacity-30 border border-blue-400 border-opacity-30">
                                <span className="text-blue-200">
                                    Admin: {user?.address.slice(0, 6)}...{user?.address.slice(-4)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Contenido principal */}
            <main className="max-w-7xl mx-auto mt-8 px-4 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {menuItems.map((item, index) => (
                        <Link 
                            to={item.link} 
                            key={index}
                            className="transform transition-all duration-300 hover:scale-102 hover:-translate-y-1"
                        >
                            <div className="relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white bg-opacity-10 border border-white border-opacity-20 p-6">
                                {/* Gradient overlay */ }
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

                                {/* Decorative elements */}
                                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-white to-transparent opacity-5 rounded-full blur-2xl"></div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;