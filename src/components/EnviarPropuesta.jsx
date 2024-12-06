import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { contractServices } from '../services/contractServices';
import { useNavigate, useParams } from 'react-router-dom';
import Web3 from 'web3';
import { 
    ArrowLeft, 
    FileText, 
    Wallet, 
    AlertCircle,
    Loader,
    Info
} from 'lucide-react';

const EnviarPropuesta = () => {
    const { id: licitacionId } = useParams();
    const navigate = useNavigate();
    const { contract, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [licitacion, setLicitacion] = useState(null);
    const [formData, setFormData] = useState({
        descripcion: '',
        montoPropuesto: ''
    });

    useEffect(() => {
        if (contract) {
            cargarLicitacion();
        }
    }, [contract, licitacionId]);

    const cargarLicitacion = async () => {
        try {
            if (!contract || !contract.methods) {
                throw new Error('Contrato no inicializado correctamente');
            }

            const licitacionData = await contract.methods.licitaciones(licitacionId).call();
            
            if (licitacionData.creador === '0x0000000000000000000000000000000000000000') {
                throw new Error('La licitación no existe');
            }

            setLicitacion(licitacionData);
        } catch (error) {
            setError('Error al cargar la licitación: ' + error.message);
            console.error('Error completo:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!contract || !user) {
            setError('No hay conexión con el contrato o usuario');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const web3 = new Web3(window.ethereum);
            const montoWei = web3.utils.toWei(formData.montoPropuesto, 'ether');

            if (BigInt(montoWei) > BigInt(licitacion.presupuesto)) {
                throw new Error('El monto propuesto excede el presupuesto de la licitación');
            }

            await contractServices.enviarPropuesta(
                contract,
                licitacionId,
                formData.descripcion,
                montoWei,
                user.address
            );

            alert('Propuesta enviada exitosamente');
            navigate(`/licitacion/${licitacionId}`);
        } catch (error) {
            setError('Error al enviar la propuesta: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!contract) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center">
                <div className="text-blue-200 flex items-center space-x-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Conectando con el contrato...</span>
                </div>
            </div>
        );
    }

    if (!licitacion && !error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center">
                <Loader className="w-12 h-12 text-blue-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black py-6 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button 
                        onClick={() => navigate(`/licitacion/${licitacionId}`)}
                        className="flex items-center space-x-2 text-blue-300 hover:text-blue-200 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Volver</span>
                    </button>
                </div>

                {/* Main Card */}
                <div className="backdrop-blur-lg bg-white bg-opacity-10 rounded-2xl border border-white border-opacity-20 p-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-8">
                        Enviar Propuesta
                    </h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-900 bg-opacity-40 border border-red-500 rounded-xl text-red-200 flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {licitacion && (
                        <div className="mb-8 p-4 rounded-xl bg-blue-900 bg-opacity-30 border border-blue-400 border-opacity-30">
                            <div className="flex items-center space-x-2 mb-2">
                                <Info className="w-5 h-5 text-blue-400" />
                                <h3 className="text-blue-200 font-semibold">Detalles de la Licitación:</h3>
                            </div>
                            <p className="text-white mb-2">{licitacion.titulo}</p>
                            <p className="text-blue-200">
                                Presupuesto máximo: {Web3.utils.fromWei(licitacion.presupuesto, 'ether')} ETH
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="flex items-center space-x-2 text-blue-200 text-sm font-semibold mb-2">
                                <FileText className="w-4 h-4" />
                                <span>Descripción de la Propuesta</span>
                            </label>
                            <textarea
                                value={formData.descripcion}
                                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                                className="w-full p-3 rounded-xl bg-blue-900 bg-opacity-30 border border-blue-400 border-opacity-30 
                                         text-white placeholder-blue-300 placeholder-opacity-50 focus:outline-none focus:border-blue-400
                                         transition-all duration-200"
                                rows="4"
                                placeholder="Describa los detalles de su propuesta"
                                required
                            />
                        </div>

                        <div>
                            <label className="flex items-center space-x-2 text-blue-200 text-sm font-semibold mb-2">
                                <Wallet className="w-4 h-4" />
                                <span>Monto Propuesto (ETH)</span>
                            </label>
                            <input
                                type="number"
                                step="0.001"
                                value={formData.montoPropuesto}
                                onChange={(e) => setFormData({...formData, montoPropuesto: e.target.value})}
                                className="w-full p-3 rounded-xl bg-blue-900 bg-opacity-30 border border-blue-400 border-opacity-30 
                                         text-white placeholder-blue-300 placeholder-opacity-50 focus:outline-none focus:border-blue-400
                                         transition-all duration-200"
                                placeholder="0.00"
                                required
                            />
                            <p className="mt-2 text-sm text-blue-300 opacity-80 flex items-center space-x-1">
                                <Info className="w-4 h-4" />
                                <span>Debe ser menor o igual al presupuesto máximo</span>
                            </p>
                        </div>

                        <div className="flex items-center justify-end space-x-4 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate(`/licitacion/${licitacionId}`)}
                                className="px-6 py-3 rounded-xl text-blue-200 border border-blue-400 border-opacity-30 
                                         hover:bg-blue-900 hover:bg-opacity-30 transition-all duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`
                                    px-6 py-3 rounded-xl text-white
                                    flex items-center justify-center space-x-2
                                    transition-all duration-200
                                    ${loading 
                                        ? 'bg-gray-600 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
                                    }
                                `}
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        <span>Enviando...</span>
                                    </>
                                ) : (
                                    <span>Enviar Propuesta</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EnviarPropuesta;