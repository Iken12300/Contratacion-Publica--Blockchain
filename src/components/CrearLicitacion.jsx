import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { contractServices } from '../services/contractServices';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import { 
    ArrowLeft,
    FileText,
    Clock,
    Wallet,
    AlertCircle,
    Loader
} from 'lucide-react';

const CrearLicitacion = () => {
    const navigate = useNavigate();
    const { contract, user } = useAuth();
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        presupuesto: '',
        fechaLimite: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const web3 = new Web3(window.ethereum);
            const presupuestoWei = web3.utils.toWei(formData.presupuesto, 'ether');
            const fechaTimestamp = Math.floor(new Date(formData.fechaLimite).getTime() / 1000);

            await contractServices.crearLicitacion(
                contract,
                formData.titulo,
                formData.descripcion,
                presupuestoWei,
                fechaTimestamp,
                user.address
            );

            setFormData({
                titulo: '',
                descripcion: '',
                presupuesto: '',
                fechaLimite: ''
            });
            
            alert('Licitación creada exitosamente');
            navigate('/home');
        } catch (error) {
            setError('Error al crear la licitación: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black py-6 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button 
                        onClick={() => navigate('/home')}
                        className="flex items-center space-x-2 text-blue-300 hover:text-blue-200 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Volver</span>
                    </button>
                </div>

                {/* Main Card */}
                <div className="backdrop-blur-lg bg-white bg-opacity-10 rounded-2xl border border-white border-opacity-20 p-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-8">
                        Crear Nueva Licitación
                    </h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-900 bg-opacity-40 border border-red-500 rounded-xl text-red-200 flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="flex items-center space-x-2 text-blue-200 text-sm font-semibold mb-2">
                                <FileText className="w-4 h-4" />
                                <span>Título de la Licitación</span>
                            </label>
                            <input
                                type="text"
                                value={formData.titulo}
                                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                                className="w-full p-3 rounded-xl bg-blue-900 bg-opacity-30 border border-blue-400 border-opacity-30 
                                         text-white placeholder-blue-300 placeholder-opacity-50 focus:outline-none focus:border-blue-400
                                         transition-all duration-200"
                                placeholder="Ingrese el título"
                                required
                            />
                        </div>

                        <div>
                            <label className="flex items-center space-x-2 text-blue-200 text-sm font-semibold mb-2">
                                <FileText className="w-4 h-4" />
                                <span>Descripción</span>
                            </label>
                            <textarea
                                value={formData.descripcion}
                                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                                className="w-full p-3 rounded-xl bg-blue-900 bg-opacity-30 border border-blue-400 border-opacity-30 
                                         text-white placeholder-blue-300 placeholder-opacity-50 focus:outline-none focus:border-blue-400
                                         transition-all duration-200"
                                rows="4"
                                placeholder="Describa los detalles de la licitación"
                                required
                            />
                        </div>

                        <div>
                            <label className="flex items-center space-x-2 text-blue-200 text-sm font-semibold mb-2">
                                <Wallet className="w-4 h-4" />
                                <span>Presupuesto (ETH)</span>
                            </label>
                            <input
                                type="number"
                                step="0.001"
                                value={formData.presupuesto}
                                onChange={(e) => setFormData({...formData, presupuesto: e.target.value})}
                                className="w-full p-3 rounded-xl bg-blue-900 bg-opacity-30 border border-blue-400 border-opacity-30 
                                         text-white placeholder-blue-300 placeholder-opacity-50 focus:outline-none focus:border-blue-400
                                         transition-all duration-200"
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <div>
                            <label className="flex items-center space-x-2 text-blue-200 text-sm font-semibold mb-2">
                                <Clock className="w-4 h-4" />
                                <span>Fecha Límite</span>
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.fechaLimite}
                                onChange={(e) => setFormData({...formData, fechaLimite: e.target.value})}
                                className="w-full p-3 rounded-xl bg-blue-900 bg-opacity-30 border border-blue-400 border-opacity-30 
                                         text-white placeholder-blue-300 placeholder-opacity-50 focus:outline-none focus:border-blue-400
                                         transition-all duration-200"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-end space-x-4 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/home')}
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
                                        <span>Creando...</span>
                                    </>
                                ) : (
                                    <span>Crear Licitación</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CrearLicitacion;