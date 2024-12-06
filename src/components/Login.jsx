import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, Lock, CheckCircle } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [isConnected, setIsConnected] = useState(false);
    const [userAccount, setUserAccount] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
            </div>

            <div className="relative w-full max-w-lg">
                {/* Hexagon grid background */}
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
                                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Conectando...</span>
                            </>
                        ) : isConnected ? (
                            <>
                                <CheckCircle className="w-6 h-6" />
                                <span>Conectado</span>
                            </>
                        ) : (
                            <>
                                <img src="./../../public/MetaMask_Fox.png" alt="MetaMask" className="w-6 h-6" />
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
        </div>
    );
};

export default Login;