import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { contractServices } from '../services/contractServices';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import { 
    FileText,
    AlertCircle,
    Loader,
    Calendar,
    DollarSign,
    User,
    Clock,
    Plus,
    ChevronRight,
    CheckCircle2,
    XCircle,
    Timer,
    Trash2
} from 'lucide-react';

const ListarLicitaciones = () => {
    const navigate = useNavigate();
    const { contract, user } = useAuth();
    const [licitaciones, setLicitaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (contract) {
            cargarLicitaciones();
        }
    }, [contract]);

    const cargarLicitaciones = async () => {
        try {
            setLoading(true);
            const listadoLicitaciones = await contractServices.obtenerLicitaciones(contract);
            setLicitaciones(listadoLicitaciones);
            setError('');
        } catch (error) {
            setError('Error al cargar licitaciones: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const eliminarLicitacion = async (licitacionId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta licitación?')) {
            return;
        }

        try {
            setLoading(true);
            await contractServices.eliminarLicitacion(contract, licitacionId, user.address);
            await cargarLicitaciones();
            setError('');
        } catch (error) {
            setError('Error al eliminar la licitación: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatearFecha = (timestamp) => {
        try {
            const timestampNumber = typeof timestamp === 'bigint' ? Number(timestamp) : Number(timestamp);
            return new Date(timestampNumber * 1000).toLocaleString();
        } catch (error) {
            return 'Fecha no disponible';
        }
    };

    const formatearEth = (wei) => {
        try {
            const weiString = typeof wei === 'bigint' ? wei.toString() : wei;
            return Web3.utils.fromWei(weiString, 'ether');
        } catch (error) {
            return '0';
        }
    };

    const getEstadoLicitacion = (estado, fechaLimite) => {
        try {
            const ahora = Math.floor(Date.now() / 1000);
            const fechaLimiteNum = Number(fechaLimite);
            
            if (fechaLimiteNum < ahora) return 'Cerrada';
            return ['Creada', 'Abierta', 'En Evaluación', 'Adjudicada', 'Cancelada'][Number(estado)];
        } catch (error) {
            return 'Estado desconocido';
        }
    };

    const getEstadoConfig = (estado) => {
        switch (estado) {
            case 'Abierta':
                return {
                    icon: <CheckCircle2 className="w-4 h-4" />,
                    class: 'bg-emerald-900 bg-opacity-30 text-emerald-300 border border-emerald-500 border-opacity-30'
                };
            case 'Cerrada':
                return {
                    icon: <XCircle className="w-4 h-4" />,
                    class: 'bg-red-900 bg-opacity-30 text-red-300 border border-red-500 border-opacity-30'
                };
            case 'En Evaluación':
                return {
                    icon: <Timer className="w-4 h-4" />,
                    class: 'bg-yellow-900 bg-opacity-30 text-yellow-300 border border-yellow-500 border-opacity-30'
                };
            default:
                return {
                    icon: <Clock className="w-4 h-4" />,
                    class: 'bg-blue-900 bg-opacity-30 text-blue-300 border border-blue-500 border-opacity-30'
                };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center">
                <div className="text-blue-200 flex flex-col items-center space-y-4">
                    <Loader className="w-12 h-12 animate-spin" />
                    <span>Cargando licitaciones...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black py-6 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-blue-400" />
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            Licitaciones Disponibles
                        </h2>
                    </div>
                    {user?.isAdmin && (
                        <button
                            onClick={() => navigate('/crear-licitacion')}
                            className="flex items-center space-x-2 px-6 py-3 rounded-xl
                                     bg-gradient-to-r from-blue-600 to-purple-600 
                                     hover:from-blue-500 hover:to-purple-500
                                     text-white font-semibold transition-all duration-200"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Nueva Licitación</span>
                        </button>
                    )}
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-900 bg-opacity-40 border border-red-500 rounded-xl text-red-200 flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {licitaciones.length === 0 ? (
                    <div className="text-center py-12 backdrop-blur-lg bg-white bg-opacity-10 rounded-2xl border border-white border-opacity-20">
                        <Clock className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
                        <p className="text-blue-200 text-lg">No hay licitaciones disponibles</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {licitaciones.map((licitacion) => {
                            const estado = getEstadoLicitacion(licitacion.estado, licitacion.fechaLimite);
                            const estadoConfig = getEstadoConfig(estado);
                            const puedeEliminar = user?.isAdmin || licitacion.creador.toLowerCase() === user?.address.toLowerCase();
                            
                            return (
                                <div key={licitacion.id}
                                    className="relative backdrop-blur-lg bg-white bg-opacity-10 rounded-2xl border border-white border-opacity-20 
                                             transform transition-all duration-200 hover:scale-102 hover:-translate-y-1"
                                >
                                    <div className="p-6 m-8">
                                        {puedeEliminar && estado !== 'Adjudicada' && (
                                            <button
                                                onClick={() => eliminarLicitacion(licitacion.id)}
                                                className="absolute top-4 right-4 p-2 rounded-full 
                                                          bg-red-900 bg-opacity-30 border border-red-500 border-opacity-30
                                                          text-red-300 hover:bg-opacity-50 transition-all duration-200"
                                                disabled={loading}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}

                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-bold text-white">
                                                {licitacion.titulo}
                                            </h3>
                                            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${estadoConfig.class}`}>
                                                {estadoConfig.icon}
                                                <span>{estado}</span>
                                            </div>
                                        </div>
                                        
                                        <p className="text-blue-200 opacity-80 mb-6 line-clamp-2">
                                            {licitacion.descripcion}
                                        </p>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center space-x-2 text-blue-200">
                                                <DollarSign className="w-4 h-4 text-blue-400" />
                                                <span>{formatearEth(licitacion.presupuesto)} ETH</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-blue-200">
                                                <Calendar className="w-4 h-4 text-blue-400" />
                                                <span>{formatearFecha(licitacion.fechaLimite)}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-blue-200">
                                                <User className="w-4 h-4 text-blue-400" />
                                                <span>
                                                    {licitacion.creador.slice(0, 6)}...{licitacion.creador.slice(-4)}
                                                </span>
                                            </div>
                                        </div>
                                            
                                        <button
                                            onClick={() => navigate(`/licitacion/${licitacion.id}/propuesta`)}
                                            className="w-full py-3 px-4 rounded-xl flex items-center justify-between
                                                     bg-gradient-to-r from-blue-600 to-purple-600
                                                     hover:from-blue-500 hover:to-purple-500
                                                     text-white font-semibold transition-all duration-200"
                                            disabled={estado !== 'Abierta'}
                                        >
                                            <span>Crear Propuesta</span>
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
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

export default ListarLicitaciones;