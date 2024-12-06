import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Hexagon, 
    Lock, 
    CheckCircle,
    FileText,
    Trash2,
    Trophy,
    ExternalLink,
    Activity,
    History,
    Clock,
    Loader,
    AlertCircle,
    User
} from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { contract } = useAuth();
    const [isConnected, setIsConnected] = useState(false);
    const [userAccount, setUserAccount] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [actividadReciente, setActividadReciente] = useState([]);
    const [loadingActividad, setLoadingActividad] = useState(true);

    const cargarActividadReciente = async () => {
        try {
            if (!contract) return;

            const [eventosLicitacion, eventosEliminados, eventosGanador] = await Promise.all([
                contract.getPastEvents('LicitacionCreada', {
                    fromBlock: 'earliest',
                    toBlock: 'latest'
                }),
                contract.getPastEvents('LicitacionEliminada', {
                    fromBlock: 'earliest',
                    toBlock: 'latest'
                }),
                contract.getPastEvents('GanadorSeleccionado', {
                    fromBlock: 'earliest',
                    toBlock: 'latest'
                })
            ]);

            const todosEventos = [
                ...eventosLicitacion.map(e => ({
                    tipo: 'creacion',
                    titulo: e.returnValues.titulo || 'Nueva Licitación',
                    direccion: e.returnValues.creador,
                    timestamp: null,
                    transactionHash: e.transactionHash
                })),
                ...eventosEliminados.map(e => ({
                    tipo: 'eliminacion',
                    titulo: 'Licitación Eliminada',
                    direccion: e.returnValues.eliminadaPor,
                    timestamp: null,
                    transactionHash: e.transactionHash
                })),
                ...eventosGanador.map(e => ({
                    tipo: 'ganador',
                    titulo: 'Ganador Seleccionado',
                    direccion: e.returnValues.ganador,
                    timestamp: null,
                    transactionHash: e.transactionHash
                }))
            ];

            // Obtener timestamps
            for (let evento of todosEventos) {
                const tx = await window.ethereum.request({
                    method: 'eth_getTransactionByHash',
                    params: [evento.transactionHash],
                });
                const block = await window.ethereum.request({
                    method: 'eth_getBlockByNumber',
                    params: [tx.blockNumber, false],
                });
                evento.timestamp = parseInt(block.timestamp, 16) * 1000;
            }

            const eventosOrdenados = todosEventos
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 10);

            setActividadReciente(eventosOrdenados);
        } catch (error) {
            console.error('Error al cargar actividad reciente:', error);
        } finally {
            setLoadingActividad(false);
        }
    };

    const connectWallet = async () => {
        try {
            setIsLoading(true);
            if (window.ethereum) {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });

                setUserAccount(accounts[0]);
                setIsConnected(true);
                setError('');
                
                setTimeout(() => {
                    navigate('/home');
                }, 1500);

            } else {
                throw new Error('Por favor, instala MetaMask');
            }
        } catch (error) {
            setError(error.message || 'Error al conectar con MetaMask');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({
                        method: 'eth_accounts'
                    });
                    if (accounts.length > 0) {
                        setUserAccount(accounts[0]);
                        setIsConnected(true);
                        navigate('/home');
                    }
                } catch (error) {
                    console.error('Error checking connection:', error);
                }
            }
        };

        checkConnection();
    }, [navigate]);

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', accounts => {
                if (accounts.length > 0) {
                    setUserAccount(accounts[0]);
                } else {
                    setUserAccount('');
                    setIsConnected(false);
                }
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }
    }, []);

    useEffect(() => {
        if (contract) {
            cargarActividadReciente();
        }
    }, [contract]);

    const getIconoEvento = (tipo) => {
        switch (tipo) {
            case 'creacion':
                return <FileText className="w-4 h-4 text-emerald-400" />;
            case 'eliminacion':
                return <Trash2 className="w-4 h-4 text-red-400" />;
            case 'ganador':
                return <Trophy className="w-4 h-4 text-yellow-400" />;
            default:
                return <Activity className="w-4 h-4 text-blue-400" />;
        }
    };

    const formatearFecha = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
            </div>

            <div className="container mx-auto px-4 flex flex-col lg:flex-row items-start justify-center space-y-8 lg:space-y-0 lg:space-x-8">
                {/* Panel de Login */}
                <div className="relative w-full max-w-lg">
                    <div className="absolute inset-0 grid grid-cols-3 gap-8 transform -rotate-12 scale-150 opacity-20">
                        {[...Array(12)].map((_, i) => (
                            <Hexagon 
                                key={i} 
                                className="text-blue-300 w-full h-full" 
                                strokeWidth={0.5}
                            />
                        ))}
                    </div>

                    <div className="relative backdrop-blur-lg bg-white bg-opacity-10 p-8 rounded-2xl shadow-2xl border border-white border-opacity-20">
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <Lock className="w-16 h-16 text-blue-400" />
                            </div>
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                Sistema de Contratación Pública
                            </h1>
                            <p className="mt-4 text-lg text-blue-100">
                                Conecta tu wallet para acceder al sistema
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-900 bg-opacity-40 border border-red-500 rounded-xl text-red-200">
                                <span className="font-medium">Error: </span> {error}
                            </div>
                        )}

                        {isConnected && !error && (
                            <div className="mb-6 p-4 bg-green-900 bg-opacity-40 border border-green-500 rounded-xl text-green-200">
                                <div className="flex items-center justify-center space-x-2">
                                    <CheckCircle className="w-5 h-5" />
                                    <span>¡Conectado! Redirigiendo...</span>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={connectWallet}
                            disabled={isLoading || isConnected}
                            className={`
                                w-full px-6 py-4 rounded-xl
                                flex items-center justify-center space-x-3
                                transition-all duration-300 transform hover:scale-105
                                ${isLoading || isConnected 
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
                                }
                                text-white font-semibold text-lg
                                shadow-lg hover:shadow-xl
                            `}
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="w-6 h-6 animate-spin" />
                                    <span>Conectando...</span>
                                </>
                            ) : isConnected ? (
                                <>
                                    <CheckCircle className="w-6 h-6" />
                                    <span>Conectado</span>
                                </>
                            ) : (
                                <>
                                    <img src="../../public/MetaMask_Fox.png" alt="MetaMask" className="w-6 h-6" />
                                    <span>Conectar con MetaMask</span>
                                </>
                            )}
                        </button>

                        {userAccount && (
                            <div className="mt-6 text-center text-blue-200 bg-blue-900 bg-opacity-30 p-3 rounded-xl border border-blue-400 border-opacity-30">
                                Cuenta: {userAccount.slice(0, 6)}...{userAccount.slice(-4)}
                            </div>
                        )}

                        <div className="mt-6 text-center text-blue-200 text-sm">
                            <p className="opacity-80">Asegúrate de tener instalado MetaMask</p>
                        </div>
                    </div>
                </div>

                {/* Panel de Actividad Reciente */}
                <div className="w-full max-w-lg backdrop-blur-lg bg-white bg-opacity-10 p-8 rounded-2xl shadow-2xl border border-white border-opacity-20">
                    <div className="flex items-center space-x-3 mb-6">
                        <History className="w-6 h-6 text-blue-400" />
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            Actividad Reciente
                        </h2>
                    </div>

                    {loadingActividad ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader className="w-8 h-8 animate-spin text-blue-400" />
                        </div>
                    ) : actividadReciente.length === 0 ? (
                        <div className="text-center py-8">
                            <Clock className="w-12 h-12 text-blue-400 mx-auto mb-4 opacity-50" />
                            <p className="text-blue-200">No hay actividad reciente</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {actividadReciente.map((evento, index) => (
                                <div 
                                    key={index}
                                    className="p-4 rounded-xl bg-blue-900 bg-opacity-30 border border-blue-400 border-opacity-30
                                             hover:bg-opacity-40 transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            {getIconoEvento(evento.tipo)}
                                            <div>
                                                <p className="text-white font-semibold">{evento.titulo}</p>
                                                <div className="flex items-center space-x-2 text-blue-300 text-sm">
                                                    <User className="w-3 h-3" />
                                                    <span>{evento.direccion.slice(0, 6)}...{evento.direccion.slice(-4)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <a
                                            href={`https://sepolia.etherscan.io/tx/${evento.transactionHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                    <div className="mt-2 text-blue-200 text-sm">
                                        <Clock className="w-3 h-3 inline-block mr-1" />
                                        {formatearFecha(evento.timestamp)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;