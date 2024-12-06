// src/services/contractServices.js
import Web3 from 'web3';

export const contractServices = {
    async obtenerLicitaciones(contract) {
        try {
            if (!contract) {
                throw new Error('Contrato no inicializado');
            }

            const licitaciones = [];
            let index = 1;
            let continuar = true;

            while (continuar && index < 100) {
                try {
                    const licitacion = await contract.methods.licitaciones(index).call();
                    if (licitacion.creador !== '0x0000000000000000000000000000000000000000') {
                        licitaciones.push({
                            ...licitacion,
                            id: index
                        });
                    }
                    index++;
                } catch (error) {
                    continuar = false;
                }
            }

            return licitaciones;
        } catch (error) {
            console.error("Error al obtener licitaciones:", error);
            throw error;
        }
    },

    async obtenerAdministradores(contract) {
        try {
            if (!contract) {
                throw new Error('Contrato no inicializado');
            }

            const adminList = await contract.methods.obtenerAdministradores().call();
            
            const adminsActivos = [];
            for (const admin of adminList) {
                try {
                    const esAdmin = await contract.methods.administradores(admin).call();
                    if (esAdmin) {
                        adminsActivos.push(admin.toLowerCase());
                    }
                } catch (error) {
                    console.error(`Error verificando admin ${admin}:`, error);
                }
            }

            return adminsActivos;
        } catch (error) {
            console.error("Error al obtener administradores:", error);
            throw error;
        }
    },

    async crearLicitacion(contract, titulo, descripcion, presupuesto, fechaLimite, account) {
        try {
            if (!contract) {
                throw new Error('Contrato no inicializado');
            }

            return await contract.methods
                .crearLicitacion(titulo, descripcion, presupuesto, fechaLimite)
                .send({ from: account });
        } catch (error) {
            console.error("Error al crear licitación:", error);
            throw error;
        }
    },

    async eliminarLicitacion(contract, licitacionId, account) {
        try {
            if (!contract) {
                throw new Error('Contrato no inicializado');
            }

            // Verificar si la licitación existe
            const licitacion = await contract.methods.licitaciones(licitacionId).call();
            if (licitacion.creador === '0x0000000000000000000000000000000000000000') {
                throw new Error('La licitación no existe');
            }

            // Verificar si el usuario tiene permisos
            const esAdmin = await contract.methods.administradores(account).call();
            if (!esAdmin && licitacion.creador.toLowerCase() !== account.toLowerCase()) {
                throw new Error('No tienes permisos para eliminar esta licitación');
            }

            return await contract.methods
                .eliminarLicitacion(licitacionId)
                .send({ from: account });
        } catch (error) {
            console.error("Error al eliminar licitación:", error);
            throw error;
        }
    },

    async enviarPropuesta(contract, licitacionId, descripcion, montoPropuesto, account) {
        try {
            if (!contract) {
                throw new Error('Contrato no inicializado');
            }

            return await contract.methods
                .enviarPropuesta(licitacionId, descripcion, montoPropuesto)
                .send({ from: account });
        } catch (error) {
            console.error("Error al enviar propuesta:", error);
            throw error;
        }
    },

    async eliminarPropuesta(contract, licitacionId, propuestaId, account) {
        try {
            if (!contract) {
                throw new Error('Contrato no inicializado');
            }

            // Verificar si la licitación existe
            const licitacion = await contract.methods.licitaciones(licitacionId).call();
            if (licitacion.creador === '0x0000000000000000000000000000000000000000') {
                throw new Error('La licitación no existe');
            }

            // Obtener la propuesta
            const propuestas = await contract.methods.obtenerPropuestas(licitacionId).call();
            const propuesta = propuestas.find(p => p.id === propuestaId);
            
            if (!propuesta) {
                throw new Error('La propuesta no existe');
            }

            // Verificar si el usuario tiene permisos
            const esAdmin = await contract.methods.administradores(account).call();
            if (!esAdmin && propuesta.proponente.toLowerCase() !== account.toLowerCase()) {
                throw new Error('No tienes permisos para eliminar esta propuesta');
            }

            return await contract.methods
                .eliminarPropuesta(licitacionId, propuestaId)
                .send({ from: account });
        } catch (error) {
            console.error("Error al eliminar propuesta:", error);
            throw error;
        }
    },

    async obtenerPropuestasPorLicitacion(contract, licitacionId) {
        try {
            if (!contract) {
                throw new Error('Contrato no inicializado');
            }

            return await contract.methods.obtenerPropuestas(licitacionId).call();
        } catch (error) {
            console.error("Error al obtener propuestas:", error);
            throw error;
        }
    },

    async agregarAdministrador(contract, adminAddress, account) {
        try {
            if (!contract) {
                throw new Error('Contrato no inicializado');
            }

            if (!Web3.utils.isAddress(adminAddress)) {
                throw new Error('Dirección de Ethereum inválida');
            }

            const esAdmin = await contract.methods.administradores(adminAddress).call();
            if (esAdmin) {
                throw new Error('Esta dirección ya es administrador');
            }

            return await contract.methods
                .agregarAdministrador(adminAddress)
                .send({ from: account });
        } catch (error) {
            console.error("Error al agregar administrador:", error);
            throw error;
        }
    },

    async quitarAdministrador(contract, adminAddress, account) {
        try {
            if (!contract) {
                throw new Error('Contrato no inicializado');
            }

            if (!Web3.utils.isAddress(adminAddress)) {
                throw new Error('Dirección de Ethereum inválida');
            }

            if (adminAddress.toLowerCase() === account.toLowerCase()) {
                throw new Error('No puedes quitarte a ti mismo como administrador');
            }

            const esAdmin = await contract.methods.administradores(adminAddress).call();
            if (!esAdmin) {
                throw new Error('Esta dirección no es administrador');
            }

            return await contract.methods
                .quitarAdministrador(adminAddress)
                .send({ from: account });
        } catch (error) {
            console.error("Error al quitar administrador:", error);
            throw error;
        }
    },

    async seleccionarGanador(contract, licitacionId, propuestaId, account) {
        try {
            if (!contract) {
                throw new Error('Contrato no inicializado');
            }

            return await contract.methods
                .seleccionarGanador(licitacionId, propuestaId)
                .send({ from: account });
        } catch (error) {
            console.error("Error al seleccionar ganador:", error);
            throw error;
        }
    },

    async obtenerMisPropuestas(contract, account) {
        try {
            if (!contract) {
                throw new Error('Contrato no inicializado');
            }

            const licitaciones = await this.obtenerLicitaciones(contract);
            const misPropuestas = [];

            for (const licitacion of licitaciones) {
                const propuestas = await contract.methods.obtenerPropuestas(licitacion.id).call();
                const propuestasFiltradas = propuestas.filter(
                    p => p.proponente.toLowerCase() === account.toLowerCase()
                ).map(p => ({
                    ...p,
                    licitacion: licitacion
                }));
                misPropuestas.push(...propuestasFiltradas);
            }

            return misPropuestas;
        } catch (error) {
            console.error("Error al obtener mis propuestas:", error);
            throw error;
        }
    },

    async verificarAdmin(contract, address) {
        try {
            if (!contract) {
                throw new Error('Contrato no inicializado');
            }

            if (!Web3.utils.isAddress(address)) {
                throw new Error('Dirección de Ethereum inválida');
            }

            return await contract.methods.administradores(address).call();
        } catch (error) {
            console.error("Error al verificar administrador:", error);
            throw error;
        }
    }
};