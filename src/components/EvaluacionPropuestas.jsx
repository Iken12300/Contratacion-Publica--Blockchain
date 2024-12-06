import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import { contractServices } from '../services/contractServices';
import { 
    ArrowLeft,
    AlertCircle,
    Calendar,
    DollarSign,
    Users,
    CheckCircle2,
    Loader,
    User,
    Clock
} from 'lucide-react';

const EvaluacionPropuestas = () => {
    const navigate = useNavigate();
    const { contract, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [licitaciones, setLicitaciones] = useState([]);
    const [propuestasPorLicitacion, setPropuestasPorLicitacion] = useState({});

    useEffect(() => {
        if (!user?.isAdmin) {
            navigate('/home');
            return;
        }
        cargarLicitacionesYPropuestas();
    }, [contract, user, navigate]);

    const cargarLicitacionesYPropuestas = async () => {
        try {
            setLoading(true);
            const todasLicitaciones = await contractServices.obtenerLicitaciones(contract);
            const licitacionesPendientes = todasLicitaciones.filter(
                lic => lic.ganador === '0x0000000000000000000000000000000000000000'
            );
            setLicitaciones(licitacionesPendientes);

            const propuestas = {};
            for (const licitacion of licitacionesPendientes) {
                try {
                    const propuestasLicitacion = await contractServices
                        .obtenerPropuestasPorLicitacion(contract, licitacion.id);
                    propuestas[licitacion.id] = propuestasLicitacion;
                } catch (error) {
                    console.error(`Error al cargar propuestas para licitación ${licitacion.id}:`, error);
                    propuestas[licitacion.id] = [];
                }
            }
            setPropuestasPorLicitacion(propuestas);
        } catch (error) {
            setError('Error al cargar las propuestas: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const seleccionarGanador = async (licitacionId, propuestaId) => {
        try {
            setLoading(true);
            await contractServices.seleccionarGanador(
                contract,
                licitacionId,
                propuestaId,
                user.address
            );
            await cargarLicitacionesYPropuestas();
            alert('Ganador seleccionado exitosamente');
        } catch (error) {
            setError('Error al seleccionar ganador: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatearEth = (wei) => {
        try {
            return Web3.utils.fromWei(wei.toString(), 'ether');
        } catch (error) {
            return '0';
        }
    };

    const formatearFecha = (timestamp) => {
        try {
            return new Date(Number(timestamp) * 1000).toLocaleString();
        } catch (error) {
            return 'Fecha no disponible';
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
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Evaluación de Propuestas
                    </h2>
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

                {licitaciones.length === 0 ? (
                    <div className="backdrop-blur-lg bg-white bg-opacity-10 rounded-2xl border border-white border-opacity-20 p-8 text-center">
                        <p className="text-blue-200">No hay licitaciones pendientes de evaluación</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {licitaciones.map((licitacion) => (
                            <div key={licitacion.id} 
                                className="backdrop-blur-lg bg-white bg-opacity-10 rounded-2xl border border-white border-opacity-20 p-6">
                                <div className="border-b border-blue-400 border-opacity-20 pb-4 mb-6">
                                    <h3 className="text-2xl font-bold text-white mb-4">
                                        {licitacion.titulo}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex items-center space-x-2 text-blue-200">
                                            <DollarSign className="w-5 h-5" />
                                            <span>{formatearEth(licitacion.presupuesto)} ETH</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-blue-200">
                                            <Calendar className="w-5 h-5" />
                                            <span>{formatearFecha(licitacion.fechaLimite)}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-blue-200">
                                            <Users className="w-5 h-5" />
                                            <span>{propuestasPorLicitacion[licitacion.id]?.length || 0} Propuestas</span>
                                        </div>
                                    </div>
                                </div>

                                {propuestasPorLicitacion[licitacion.id]?.length > 0 ? (
                                    <div className="space-y-4">
                                        {propuestasPorLicitacion[licitacion.id].map((propuesta) => (
                                            <div key={propuesta.id}
                                                className="p-6 rounded-xl bg-blue-900 bg-opacity-30 border border-blue-400 border-opacity-30 
                                                         hover:bg-opacity-40 transition-all duration-200"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <User className="w-5 h-5 text-blue-400" />
                                                            <p className="text-white font-medium">
                                                                Propuesta #{propuesta.id} - {propuesta.proponente.slice(0, 6)}...
                                                                {propuesta.proponente.slice(-4)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-blue-300 bg-blue-900 bg-opacity-40 
                                                                    px-4 py-2 rounded-lg">
                                                        <DollarSign className="w-5 h-5" />
                                                        <span className="font-semibold">
                                                            {formatearEth(propuesta.montoPropuesto)} ETH
                                                        </span>
                                                    </div>
                                                </div>

                                                <p className="text-blue-200 mb-4">{propuesta.descripcion}</p>

                                                <button
                                                    onClick={() => seleccionarGanador(licitacion.id, propuesta.id)}
                                                    disabled={loading}
                                                    className="w-full py-3 px-4 rounded-xl flex items-center justify-center space-x-2
                                                             bg-gradient-to-r from-emerald-600 to-teal-600
                                                             hover:from-emerald-500 hover:to-teal-500
                                                             disabled:from-gray-600 disabled:to-gray-600
                                                             text-white font-semibold transition-all duration-200"
                                                >
                                                    <CheckCircle2 className="w-5 h-5" />
                                                    <span>Seleccionar como Ganador</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Clock className="w-12 h-12 text-blue-400 mx-auto mb-2 opacity-50" />
                                        <p className="text-blue-200">No hay propuestas para esta licitación</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EvaluacionPropuestas;