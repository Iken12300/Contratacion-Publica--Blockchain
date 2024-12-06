// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        const initContract = async () => {
            try {
                if (window.ethereum) {
                    const web3 = new Web3(window.ethereum);
                    const accounts = await web3.eth.getAccounts();
                    
                    // Aquí pondrás la dirección de tu contrato desplegado
                    const contractAddress = "0xcF2c2E0c7eEb52863f773bb9999aCfD9edC53C8b";
                    
                    // Aquí va tu ABI
                    const contractABI =[
                        {
                            "inputs": [],
                            "stateMutability": "nonpayable",
                            "type": "constructor"
                        },
                        {
                            "anonymous": false,
                            "inputs": [
                                {
                                    "indexed": true,
                                    "internalType": "address",
                                    "name": "admin",
                                    "type": "address"
                                },
                                {
                                    "indexed": true,
                                    "internalType": "address",
                                    "name": "agregadoPor",
                                    "type": "address"
                                }
                            ],
                            "name": "AdministradorAgregado",
                            "type": "event"
                        },
                        {
                            "anonymous": false,
                            "inputs": [
                                {
                                    "indexed": true,
                                    "internalType": "address",
                                    "name": "admin",
                                    "type": "address"
                                },
                                {
                                    "indexed": true,
                                    "internalType": "address",
                                    "name": "eliminadoPor",
                                    "type": "address"
                                }
                            ],
                            "name": "AdministradorEliminado",
                            "type": "event"
                        },
                        {
                            "inputs": [
                                {
                                    "internalType": "address",
                                    "name": "_nuevoAdmin",
                                    "type": "address"
                                }
                            ],
                            "name": "agregarAdministrador",
                            "outputs": [],
                            "stateMutability": "nonpayable",
                            "type": "function"
                        },
                        {
                            "inputs": [
                                {
                                    "internalType": "string",
                                    "name": "_titulo",
                                    "type": "string"
                                },
                                {
                                    "internalType": "string",
                                    "name": "_descripcion",
                                    "type": "string"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "_presupuesto",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "_fechaLimite",
                                    "type": "uint256"
                                }
                            ],
                            "name": "crearLicitacion",
                            "outputs": [],
                            "stateMutability": "nonpayable",
                            "type": "function"
                        },
                        {
                            "inputs": [
                                {
                                    "internalType": "uint256",
                                    "name": "_licitacionId",
                                    "type": "uint256"
                                }
                            ],
                            "name": "eliminarLicitacion",
                            "outputs": [],
                            "stateMutability": "nonpayable",
                            "type": "function"
                        },
                        {
                            "inputs": [
                                {
                                    "internalType": "uint256",
                                    "name": "_licitacionId",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "_propuestaId",
                                    "type": "uint256"
                                }
                            ],
                            "name": "eliminarPropuesta",
                            "outputs": [],
                            "stateMutability": "nonpayable",
                            "type": "function"
                        },
                        {
                            "inputs": [
                                {
                                    "internalType": "uint256",
                                    "name": "_licitacionId",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "string",
                                    "name": "_descripcion",
                                    "type": "string"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "_montoPropuesto",
                                    "type": "uint256"
                                }
                            ],
                            "name": "enviarPropuesta",
                            "outputs": [],
                            "stateMutability": "nonpayable",
                            "type": "function"
                        },
                        {
                            "anonymous": false,
                            "inputs": [
                                {
                                    "indexed": true,
                                    "internalType": "uint256",
                                    "name": "licitacionId",
                                    "type": "uint256"
                                },
                                {
                                    "indexed": true,
                                    "internalType": "address",
                                    "name": "ganador",
                                    "type": "address"
                                },
                                {
                                    "indexed": false,
                                    "internalType": "uint256",
                                    "name": "montoPropuesto",
                                    "type": "uint256"
                                }
                            ],
                            "name": "GanadorSeleccionado",
                            "type": "event"
                        },
                        {
                            "anonymous": false,
                            "inputs": [
                                {
                                    "indexed": true,
                                    "internalType": "uint256",
                                    "name": "id",
                                    "type": "uint256"
                                },
                                {
                                    "indexed": true,
                                    "internalType": "address",
                                    "name": "creador",
                                    "type": "address"
                                },
                                {
                                    "indexed": false,
                                    "internalType": "string",
                                    "name": "titulo",
                                    "type": "string"
                                },
                                {
                                    "indexed": false,
                                    "internalType": "uint256",
                                    "name": "presupuesto",
                                    "type": "uint256"
                                }
                            ],
                            "name": "LicitacionCreada",
                            "type": "event"
                        },
                        {
                            "anonymous": false,
                            "inputs": [
                                {
                                    "indexed": true,
                                    "internalType": "uint256",
                                    "name": "id",
                                    "type": "uint256"
                                },
                                {
                                    "indexed": true,
                                    "internalType": "address",
                                    "name": "eliminadaPor",
                                    "type": "address"
                                }
                            ],
                            "name": "LicitacionEliminada",
                            "type": "event"
                        },
                        {
                            "anonymous": false,
                            "inputs": [
                                {
                                    "indexed": true,
                                    "internalType": "uint256",
                                    "name": "licitacionId",
                                    "type": "uint256"
                                },
                                {
                                    "indexed": true,
                                    "internalType": "uint256",
                                    "name": "propuestaId",
                                    "type": "uint256"
                                },
                                {
                                    "indexed": true,
                                    "internalType": "address",
                                    "name": "eliminadaPor",
                                    "type": "address"
                                }
                            ],
                            "name": "PropuestaEliminada",
                            "type": "event"
                        },
                        {
                            "anonymous": false,
                            "inputs": [
                                {
                                    "indexed": true,
                                    "internalType": "uint256",
                                    "name": "licitacionId",
                                    "type": "uint256"
                                },
                                {
                                    "indexed": false,
                                    "internalType": "uint256",
                                    "name": "propuestaId",
                                    "type": "uint256"
                                },
                                {
                                    "indexed": true,
                                    "internalType": "address",
                                    "name": "proponente",
                                    "type": "address"
                                }
                            ],
                            "name": "PropuestaEnviada",
                            "type": "event"
                        },
                        {
                            "inputs": [
                                {
                                    "internalType": "address",
                                    "name": "_admin",
                                    "type": "address"
                                }
                            ],
                            "name": "quitarAdministrador",
                            "outputs": [],
                            "stateMutability": "nonpayable",
                            "type": "function"
                        },
                        {
                            "inputs": [
                                {
                                    "internalType": "uint256",
                                    "name": "_licitacionId",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "_propuestaId",
                                    "type": "uint256"
                                }
                            ],
                            "name": "seleccionarGanador",
                            "outputs": [],
                            "stateMutability": "nonpayable",
                            "type": "function"
                        },
                        {
                            "inputs": [
                                {
                                    "internalType": "address",
                                    "name": "",
                                    "type": "address"
                                }
                            ],
                            "name": "administradores",
                            "outputs": [
                                {
                                    "internalType": "bool",
                                    "name": "",
                                    "type": "bool"
                                }
                            ],
                            "stateMutability": "view",
                            "type": "function"
                        },
                        {
                            "inputs": [
                                {
                                    "internalType": "uint256",
                                    "name": "",
                                    "type": "uint256"
                                }
                            ],
                            "name": "licitaciones",
                            "outputs": [
                                {
                                    "internalType": "uint256",
                                    "name": "id",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "address",
                                    "name": "creador",
                                    "type": "address"
                                },
                                {
                                    "internalType": "string",
                                    "name": "titulo",
                                    "type": "string"
                                },
                                {
                                    "internalType": "string",
                                    "name": "descripcion",
                                    "type": "string"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "presupuesto",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "fechaLimite",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "bool",
                                    "name": "activa",
                                    "type": "bool"
                                },
                                {
                                    "internalType": "address",
                                    "name": "ganador",
                                    "type": "address"
                                },
                                {
                                    "internalType": "enum ContratacionPublica.EstadoLicitacion",
                                    "name": "estado",
                                    "type": "uint8"
                                }
                            ],
                            "stateMutability": "view",
                            "type": "function"
                        },
                        {
                            "inputs": [
                                {
                                    "internalType": "uint256",
                                    "name": "",
                                    "type": "uint256"
                                }
                            ],
                            "name": "listaAdministradores",
                            "outputs": [
                                {
                                    "internalType": "address",
                                    "name": "",
                                    "type": "address"
                                }
                            ],
                            "stateMutability": "view",
                            "type": "function"
                        },
                        {
                            "inputs": [],
                            "name": "obtenerAdministradores",
                            "outputs": [
                                {
                                    "internalType": "address[]",
                                    "name": "",
                                    "type": "address[]"
                                }
                            ],
                            "stateMutability": "view",
                            "type": "function"
                        },
                        {
                            "inputs": [
                                {
                                    "internalType": "uint256",
                                    "name": "_licitacionId",
                                    "type": "uint256"
                                }
                            ],
                            "name": "obtenerPropuestas",
                            "outputs": [
                                {
                                    "components": [
                                        {
                                            "internalType": "uint256",
                                            "name": "id",
                                            "type": "uint256"
                                        },
                                        {
                                            "internalType": "uint256",
                                            "name": "licitacionId",
                                            "type": "uint256"
                                        },
                                        {
                                            "internalType": "address",
                                            "name": "proponente",
                                            "type": "address"
                                        },
                                        {
                                            "internalType": "string",
                                            "name": "descripcion",
                                            "type": "string"
                                        },
                                        {
                                            "internalType": "uint256",
                                            "name": "montoPropuesto",
                                            "type": "uint256"
                                        },
                                        {
                                            "internalType": "bool",
                                            "name": "seleccionada",
                                            "type": "bool"
                                        },
                                        {
                                            "internalType": "enum ContratacionPublica.EstadoPropuesta",
                                            "name": "estado",
                                            "type": "uint8"
                                        }
                                    ],
                                    "internalType": "struct ContratacionPublica.Propuesta[]",
                                    "name": "",
                                    "type": "tuple[]"
                                }
                            ],
                            "stateMutability": "view",
                            "type": "function"
                        },
                        {
                            "inputs": [
                                {
                                    "internalType": "uint256",
                                    "name": "",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "",
                                    "type": "uint256"
                                }
                            ],
                            "name": "propuestasPorLicitacion",
                            "outputs": [
                                {
                                    "internalType": "uint256",
                                    "name": "id",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "licitacionId",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "address",
                                    "name": "proponente",
                                    "type": "address"
                                },
                                {
                                    "internalType": "string",
                                    "name": "descripcion",
                                    "type": "string"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "montoPropuesto",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "bool",
                                    "name": "seleccionada",
                                    "type": "bool"
                                },
                                {
                                    "internalType": "enum ContratacionPublica.EstadoPropuesta",
                                    "name": "estado",
                                    "type": "uint8"
                                }
                            ],
                            "stateMutability": "view",
                            "type": "function"
                        }
                    ];  
                    
                    const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
                    setContract(contractInstance);

                    if (accounts[0]) {
                        // Verificar si es admin
                        const isAdmin = await contractInstance.methods.administradores(accounts[0]).call();
                        
                        setUser({
                            address: accounts[0],
                            isAdmin: isAdmin
                        });
                    }
                }
            } catch (error) {
                console.error("Error initializing contract:", error);
            } finally {
                setLoading(false);
            }
        };

        initContract();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, contract }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);