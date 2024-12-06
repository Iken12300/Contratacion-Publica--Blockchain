import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { contractServices } from '../services/contractServices';
import Web3 from 'web3';
import { 
    Send,
    AlertCircle,
    Loader,
    Calendar,
    DollarSign,
    Trophy,
    Clock,
    FileText,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    XCircle,
    Timer,
    Trash2
} from 'lucide-react';

const MisPropuestas = () => {
    const navigate = useNavigate();
    const { contract, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [propuestas, setPropuestas] = useState([]);

    useEffect(() => {
        if (contract && user) {
            cargarPropuestas();
        }
    }, [contract, user]);

    const cargarPropuestas = async () => {
        try {
            setLoading(true);
            const misPropuestas = await contractServices.obtenerMisPropuestas(contract, user.address);
            setPropuestas(misPropuestas);
            setError('');
        } catch (error) {
            setError('Error al cargar propuestas: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const eliminarPropuesta = async (licitacionId, propuestaId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta propuesta?')) {
            return;
        }

        try {
            setLoading(true);
            await contractServices.eliminarPropuesta(
                contract, 
                licitacionId, 
                propuestaId, 
                user.address
            );
            await cargarPropuestas();
            setError('');
        } catch (error) {
            setError('Error al eliminar la propuesta: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatearFecha = (timestamp) => {
        try {
            const fecha = new Date(Number(timestamp) * 1000);
            return fecha.toLocaleString();
        } catch (error) {
            return 'Fecha no disponible';
        }
    };

    const formatearEth = (wei) => {
        try {
            return Web3.utils.fromWei(wei.toString(), 'ether');
        } catch (error) {
            return '0';
        }
    };

    const getEstadoPropuesta = (propuesta, licitacion) => {
        if (licitacion.ganador === user.address) return 'Ganadora';
        if (licitacion.ganador !== '0x0000000000000000000000000000000000000000') return 'No Seleccionada';
        if (Number(licitacion.fechaLimite) < Date.now() / 1000) return 'Licitación Cerrada';
        return 'En Evaluación';
    };

    const getEstadoConfig = (estado) => {
        switch (estado) {
            case 'Ganadora':
                return {
                    icon: <Trophy className="w-4 h-4" />,
                    class: 'bg-emerald-900 bg-opacity-30 text-emerald-300 border border-emerald-500 border-opacity-30'
                };
            case 'No Seleccionada':
                return {
                    icon: <XCircle className="w-4 h-4" />,
                    class: 'bg-red-900 bg-opacity-30 text-red-300 border border-red-500 border-opacity-30'
                };
            case 'Licitación Cerrada':
                return {
                    icon: <Clock className="w-4 h-4" />,
                    class: 'bg-gray-900 bg-opacity-30 text-gray-300 border border-gray-500 border-opacity-30'
                };
            default:
                return {
                    icon: <Timer className="w-4 h-4" />,
                    class: 'bg-blue-900 bg-opacity-30 text-blue-300 border border-blue-500 border-opacity-30'
                };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center">
                <div className="text-blue-200 flex flex-col items-center space-y-4">
                    <Loader className="w-12 h-12 animate-spin" />
                    <span>Cargando propuestas...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black py-6 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <Send className="w-8 h-8 text-blue-400" />
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            Mis Propuestas
                        </h2>
                    </div>
                    <button 
                        onClick={() => navigate('/home')}
                        className="flex items-center space-x-2 text-blue-300 hover:text-blue-200 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Volver</span>
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-900 bg-opacity-40 border border-red-500 rounded-xl text-red-200 flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {propuestas.length === 0 ? (
                    <div className="backdrop-blur-lg bg-white bg-opacity-10 rounded-2xl border border-white border-opacity-20 p-8">
                        <div className="text-center">
                            <Send className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
                            <p className="text-blue-200 text-lg mb-6">No has enviado ninguna propuesta aún</p>
                            <button
                                onClick={() => navigate('/licitaciones')}
                                className="flex items-center space-x-2 px-6 py-3 mx-auto rounded-xl
                                         bg-gradient-to-r from-blue-600 to-purple-600 
                                         hover:from-blue-500 hover:to-purple-500
                                         text-white font-semibold transition-all duration-200"
                            >
                                <FileText className="w-5 h-5" />
                                <span>Ver Licitaciones Disponibles</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {propuestas.map((propuesta, index) => {
                            const estado = getEstadoPropuesta(propuesta, propuesta.licitacion);
                            const estadoConfig = getEstadoConfig(estado);
                            
                            return (
                                <div
                                    key={`${propuesta.licitacion.id}-${index}`}
                                    className="relative backdrop-blur-lg bg-white bg-opacity-10 rounded-2xl border border-white border-opacity-20 
                                             transform transition-all duration-200 hover:scale-102 hover:-translate-y-1"
                                >
                                    {estado !== 'Ganadora' && estado !== 'No Seleccionada' && (
                                        <button
                                            onClick={() => eliminarPropuesta(propuesta.licitacion.id, propuesta.id)}
                                            className="absolute top-4 right-4 p-2 rounded-full 
                                                      bg-red-900 bg-opacity-30 border border-red-500 border-opacity-30
                                                      text-red-300 hover:bg-opacity-50 transition-all duration-200"
                                            disabled={loading}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}

                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-bold text-white">
                                                {propuesta.licitacion.titulo}
                                            </h3>
                                            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${estadoConfig.class}`}>
                                                {estadoConfig.icon}
                                                <span>{estado}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2 text-blue-200">
                                                    <DollarSign className="w-4 h-4 text-blue-400" />
                                                    <span>Mi propuesta:</span>
                                                </div>
                                                <span className="text-white font-semibold">
                                                    {formatearEth(propuesta.montoPropuesto)} ETH
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2 text-blue-200">
                                                    <DollarSign className="w-4 h-4 text-blue-400" />
                                                    <span>Presupuesto máx:</span>
                                                </div>
                                                <span className="text-white font-semibold">
                                                    {formatearEth(propuesta.licitacion.presupuesto)} ETH
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-blue-200">
                                                <Calendar className="w-4 h-4 text-blue-400" />
                                                <span>{formatearFecha(propuesta.licitacion.fechaLimite)}</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-blue-400 border-opacity-20">
                                            <p className="text-blue-200 mb-2 font-semibold">Mi Descripción:</p>
                                            <p className="text-blue-200 opacity-80 line-clamp-3">
                                                {propuesta.descripcion}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MisPropuestas;