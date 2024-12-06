import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import { contractServices } from '../services/contractServices';
import { 
    ArrowLeft,
    AlertCircle,
    CheckCircle,
    UserPlus,
    Users,
    User,
    XCircle,
    Loader,
    Shield
} from 'lucide-react';

const GestionAdministradores = () => {
    const navigate = useNavigate();
    const { contract, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [adminAddress, setAdminAddress] = useState('');
    const [adminList, setAdminList] = useState([]);

    useEffect(() => {
        if (!user?.isAdmin) {
            navigate('/home');
            return;
        }
        if (contract) {
            cargarAdministradores();
        }
    }, [user, contract, navigate]);

    const cargarAdministradores = async () => {
        try {
            setLoading(true);
            setError('');
            const admins = await contractServices.obtenerAdministradores(contract);
            
            const adminsActivos = [];
            for (const admin of admins) {
                const esAdmin = await contract.methods.administradores(admin).call();
                if (esAdmin) {
                    adminsActivos.push(admin.toLowerCase());
                }
            }
            
            setAdminList(adminsActivos);
        } catch (error) {
            console.error('Error al cargar administradores:', error);
            setError('Error al cargar la lista de administradores');
            if (user?.isAdmin) {
                setAdminList([user.address.toLowerCase()]);
            }
        } finally {
            setLoading(false);
        }
    };

    const agregarAdmin = async (e) => {
        e.preventDefault();
        if (!adminAddress.trim()) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!Web3.utils.isAddress(adminAddress)) {
                throw new Error('Dirección de Ethereum inválida');
            }

            await contractServices.agregarAdministrador(contract, adminAddress, user.address);
            setSuccess('Administrador agregado exitosamente');
            setAdminAddress('');
            await cargarAdministradores();
        } catch (error) {
            setError(error.message || 'Error al agregar administrador');
        } finally {
            setLoading(false);
        }
    };

    const quitarAdmin = async (direccion) => {
        if (!window.confirm(`¿Estás seguro de quitar el rol de administrador a: ${direccion}?`)) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (direccion.toLowerCase() === user.address.toLowerCase()) {
                throw new Error('No puedes quitarte a ti mismo como administrador');
            }

            await contractServices.quitarAdministrador(contract, direccion, user.address);
            setSuccess('Administrador removido exitosamente');
            await cargarAdministradores();
        } catch (error) {
            setError(error.message || 'Error al quitar administrador');
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black py-6 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <Shield className="w-8 h-8 text-blue-400" />
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            Gestión de Administradores
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

                <div className="backdrop-blur-lg bg-white bg-opacity-10 rounded-2xl border border-white border-opacity-20 p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-900 bg-opacity-40 border border-red-500 rounded-xl text-red-200 flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-900 bg-opacity-40 border border-green-500 rounded-xl text-green-200 flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{success}</span>
                        </div>
                    )}

                    {/* Formulario para agregar admin */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                            <UserPlus className="w-5 h-5" />
                            <span>Agregar Nuevo Administrador</span>
                        </h3>
                        <form onSubmit={agregarAdmin} className="flex gap-4">
                            <input
                                type="text"
                                value={adminAddress}
                                onChange={(e) => setAdminAddress(e.target.value)}
                                placeholder="Dirección de Ethereum (0x...)"
                                className="flex-1 p-3 rounded-xl bg-blue-900 bg-opacity-30 border border-blue-400 border-opacity-30 
                                         text-white placeholder-blue-300 placeholder-opacity-50 focus:outline-none focus:border-blue-400
                                         transition-all duration-200"
                                disabled={loading}
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className={`
                                    px-6 py-3 rounded-xl
                                    flex items-center justify-center space-x-2
                                    transition-all duration-200
                                    ${loading 
                                        ? 'bg-gray-600 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
                                    }
                                    text-white font-semibold
                                `}
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        <span>Agregando...</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5" />
                                        <span>Agregar Admin</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Lista de admins */}
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                            <Users className="w-5 h-5" />
                            <span>Lista de Administradores</span>
                        </h3>
                        
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader className="w-8 h-8 animate-spin text-blue-400" />
                            </div>
                        ) : adminList.length === 0 ? (
                            <div className="text-center py-8">
                                <Shield className="w-12 h-12 text-blue-400 mx-auto mb-2 opacity-50" />
                                <p className="text-blue-200">No hay administradores registrados</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {adminList.map((admin) => (
                                    <div key={admin}
                                        className="p-4 rounded-xl bg-blue-900 bg-opacity-30 border border-blue-400 border-opacity-30 
                                                 hover:bg-opacity-40 transition-all duration-200"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-3">
                                                <User className="w-5 h-5 text-blue-400" />
                                                <div>
                                                    <p className="text-white font-medium">
                                                        {`${admin.slice(0, 6)}...${admin.slice(-4)}`}
                                                    </p>
                                                    <p className="text-sm text-blue-300 break-all">
                                                        {admin}
                                                    </p>
                                                    {admin.toLowerCase() === user.address.toLowerCase() && (
                                                        <span className="text-xs text-blue-400 font-medium">(Tú)</span>
                                                    )}
                                                </div>
                                            </div>
                                            {admin.toLowerCase() !== user.address.toLowerCase() && (
                                                <button
                                                    onClick={() => quitarAdmin(admin)}
                                                    className={`
                                                        px-4 py-2 rounded-lg flex items-center space-x-2
                                                        text-red-300 border border-red-500 border-opacity-30
                                                        hover:bg-red-900 hover:bg-opacity-30
                                                        transition-all duration-200
                                                        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                                                    `}
                                                    disabled={loading}
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    <span>Quitar</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestionAdministradores;