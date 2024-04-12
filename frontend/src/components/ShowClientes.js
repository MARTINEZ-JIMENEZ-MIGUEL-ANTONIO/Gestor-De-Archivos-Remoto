import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowClientes = () => {
    const url = 'http://localhost:5000/Clientes';
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [clientes, setClientes] = useState([]);
    const modalRef = useRef(null);

    useEffect(() => { 
        refreshToken();
        getClientes();
    }, []);

    useEffect(() => {
        if (modalRef.current) {
            // Inicializar el modal usando la referencia actualizada
            modalRef.current.addEventListener('hide.bs.modal', () => {
                setId('');
                setNombre('');
                setEmail('');
                setTelefono('');
                setOperation(1);
                setTitle('Agregar Cliente');
            });
        }
    }, [modalRef]);

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = decodeToken(response.data.accessToken);
            setTitle(decoded.title);
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
                window.location.href = "/";
            }
        }
    };

    const decodeToken = (accessToken) => {
        const base64Url = accessToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    };

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = decodeToken(response.data.accessToken);
            setTitle(decoded.title);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const getClientes = async () => {
        try {
            const response = await axiosJWT.get(url);
            setClientes(response.data);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            show_alerta('Error al obtener clientes', 'error');
        }
    };

    const enviarSolicitud = async (metodo, parametros) => {
        try {
            let requestUrl = url;
            if (parametros.id) {
                requestUrl += `/${parametros.id}`;
            }
            const respuesta = await axios({ method: metodo, url: requestUrl, data: parametros });
            if (respuesta.data[0] === 'success') {
                if (operation === 1) {
                    show_alerta('Cliente agregado correctamente', 'success');
                } else if (operation === 2) {
                    show_alerta('Cliente editado correctamente', 'success');
                }
                getClientes();
                closeModal();
            } else {
                show_alerta('Cliente ' + (operation === 1 ? 'agregado' : 'editado') + ' correctamente', 'success');
                getClientes();
            }
        } catch (error) {
            show_alerta('Error en la solicitud: ' + error.message, 'error');
            console.log(error);
        }
    };

    const deleteCliente = (id, nombre) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Seguro de eliminar el cliente ' + nombre + ' ?',
            icon: 'question',
            text: 'No se podrá dar marcha atrás',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${url}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(response => {
                    show_alerta('Cliente eliminado correctamente', 'success');
                    getClientes();
                })
                .catch(error => {
                    console.error('Error al eliminar cliente:', error);
                    show_alerta('Error al eliminar cliente', 'error');
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                show_alerta('El cliente NO fue eliminado', 'info');
            }
        }).catch(error => {
            console.error('Error al mostrar confirmación de eliminación:', error);
            show_alerta('Error al mostrar confirmación de eliminación', 'error');
        });
    };

    const openModal = (op, id = '', nombre = '', email = '', telefono = '') => {
        if (op === 1) {
            setTitle('Agregar Cliente');
            setOperation(1);
            // Limpiar los campos al abrir para agregar un nuevo cliente
            setNombre('');
            setEmail('');
            setTelefono('');
        } else if (op === 2) {
            setTitle('Editar Cliente');
            setId(id);
            setNombre(nombre);
            setEmail(email);
            setTelefono(telefono);
            setOperation(2);
        }
        if (modalRef.current) {
            new window.bootstrap.Modal(modalRef.current).show();
        }
    };

    const closeModal = () => {
        if (modalRef.current) {
            new window.bootstrap.Modal(modalRef.current).hide();
        }
    };

    const validar = () => {
        var parametros;
        var metodo;
        if (nombre.trim() === '') {
            show_alerta('Escribe el nombre del cliente', 'warning');
        } else if (email.trim() === '') {
            show_alerta('Escribe el email del cliente', 'warning');
        } else if (telefono.trim() === '') {
            show_alerta('Escribe el teléfono del cliente', 'warning');
        } else {
            if (operation === 1) {
                parametros = { nombre: nombre.trim(), email: email.trim(), telefono: telefono };
                metodo = 'POST';
            } else {
                parametros = { id: id, nombre: nombre.trim(), email: email.trim(), telefono: telefono };
                metodo = 'PUT';
            }
            enviarSolicitud(metodo, parametros);
        }
    };

    const handleSave = () => {
        validar();
    };

    const limpiarCampos = () => {
        setNombre('');
        setEmail('');
        setTelefono('');
    };

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                        <div className='modal-body'>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-user'></i></span>
                                <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-envelope'></i></span>
                                <input type='email' id='email' className='form-control' placeholder='Email' value={email}
                                    onChange={(e) => setEmail(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-phone'></i></span>
                                <input type='text' id='telefono' className='form-control' placeholder='Teléfono' value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}></input>
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                <button onClick={() => validar()} className='btn btn-success'>
                                    <i className='fa-solid fa-floppy-disk'></i> Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                        <div className='table-responsive'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr><th>#</th><th>CLIENTE</th><th>EMAIL</th><th>TELÉFONO</th><th></th></tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {clientes.map((cliente, i) => (
                                        <tr key={cliente.id}>
                                            <td>{(i + 1)}</td>
                                            <td>{cliente.nombre}</td>
                                            <td>{cliente.email}</td>
                                            <td>{cliente.telefono}</td>
                                            <td>
                                                <button onClick={() => openModal(2, cliente.id, cliente.nombre, cliente.email, cliente.telefono)}
                                                    className='btn btn-warning'>
                                                    <i className='fa-solid fa-edit'></i> Editar
                                                </button>
                                                &nbsp;
                                                <button onClick={() => deleteCliente(cliente.id, cliente.nombre)} className='btn btn-danger'>
                                                    <i className='fa-solid fa-trash'></i> Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowClientes;
