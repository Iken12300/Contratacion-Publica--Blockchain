import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import { 
    ArrowLeft,
    AlertCircle,
    Loader,
    FileText,
    Send,
    Trophy,
    ExternalLink,
    History,
    Clock
} from 'lucide-react';

const HistorialTransacciones = () => {
    const navigate = useNavigate();
    const { contract, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        if (contract) {
            cargarEventos();
        }
    }, [contract]);

    const cargarEventos = async () => {
        try {
            setLoading(true);
            const [eventosLicitacion, eventosPropuesta, eventosGanador] = await Promise.all([
                contract.getPastEvents('LicitacionCreada', {
                    fromBlock: 0,
                    toBlock: 'latest'
                }),
                contract.getPastEvents('PropuestaEnviada', {
                    fromBlock: 0,
                    toBlock: 'latest'
                }),
                contract.getPastEvents('GanadorSeleccionado', {
                    fromBlock: 0,
                    toBlock: 'latest'
                })
            ]);

            const todosEventos = [
                ...eventosLicitacion.map(e => ({
                    ...e,
                    tipo: 'Licitación Creada',
                    blockNumber: Number(e.blockNumber.toString())
                })),
                ...eventosPropuesta.map(e => ({
                    ...e,
                    tipo: 'Propuesta Enviada',
                    blockNumber: Number(e.blockNumber.toString())
                })),
                ...eventosGanador.map(e => ({
                    ...e,
                    tipo: 'Ganador Seleccionado',
                    blockNumber: Number(e.blockNumber.toString())
                }))
            ].sort((a, b) => b.blockNumber - a.blockNumber);

            setEventos(todosEventos);
        } catch (error) {
            console.error('Error completo:', error);
            setError('Error al cargar el historial: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const obtenerDetallesEvento = (evento) => {
        switch (evento.tipo) {
            case 'Licitación Creada':
                return {
                    titulo: evento.returnValues.titulo || 'Nueva Licitación',
                    direccion: evento.returnValues.creador,
                    id: evento.returnValues.id?.toString() || '',
                    icono: <FileText className="w-5 h-5" />
                };
            case 'Propuesta Enviada':
                return {
                    titulo: `Propuesta para Licitación #${evento.returnValues.licitacionId?.toString()}`,
                    direccion: evento.returnValues.proponente,
                    id: evento.returnValues.propuestaId?.toString() || '',
                    icono: <Send className="w-5 h-5" />
                };
            case 'Ganador Seleccionado':
                return {
                    titulo: `Ganador Licitación #${evento.returnValues.licitacionId?.toString()}`,
                    direccion: evento.returnValues.ganador,
                    id: evento.returnValues.licitacionId?.toString() || '',
                    icono: <Trophy className="w-5 h-5" />
                };
            default:
                return {
                    titulo: 'Evento Desconocido',
                    direccion: '',
                    id: '',
                    icono: null
                };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center">
                <div className="text-blue-200 flex flex-col items-center space-y-4">
                    <Loader className="w-12 h-12 animate-spin" />
                    <span>Cargando historial de transacciones...</span>
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
                        <History className="w-8 h-8 text-blue-400" />
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            Historial de Transacciones
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

                <div className="backdrop-blur-lg bg-white bg-opacity-10 rounded-2xl border border-white border-opacity-20 p-6">
                    {eventos.length === 0 ? (
                        <div className="text-center py-12">
                            <Clock className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
                            <p className="text-blue-200 text-lg">No hay transacciones registradas</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-blue-200 border-b border-blue-400 border-opacity-20">
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Tipo</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Detalles</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Dirección</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Hash</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-blue-400 divide-opacity-20">
                                    {eventos.map((evento, index) => {
                                        const detalles = obtenerDetallesEvento(evento);
                                        return (
                                            <tr key={index} className="hover:bg-blue-900 hover:bg-opacity-30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className={`
                                                        flex items-center space-x-2 px-3 py-1 rounded-full text-sm
                                                        ${evento.tipo === 'Licitación Creada' 
                                                            ? 'bg-green-900 bg-opacity-30 text-green-300 border border-green-500 border-opacity-30' 
                                                            : evento.tipo === 'Propuesta Enviada'
                                                            ? 'bg-blue-900 bg-opacity-30 text-blue-300 border border-blue-500 border-opacity-30'
                                                            : 'bg-purple-900 bg-opacity-30 text-purple-300 border border-purple-500 border-opacity-30'
                                                        }
                                                    `}>
                                                        {detalles.icono}
                                                        <span>{evento.tipo}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-white">
                                                        {detalles.titulo}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-blue-200">
                                                        {detalles.direccion?.slice(0, 6)}...{detalles.direccion?.slice(-4)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <a 
                                                        href={`https://sepolia.etherscan.io/tx/${evento.transactionHash}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                                                    >
                                                        <span>{evento.transactionHash.slice(0, 6)}...{evento.transactionHash.slice(-4)}</span>
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistorialTransacciones;