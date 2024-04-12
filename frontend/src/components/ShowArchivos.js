import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowArchivos = () => {
    const url = 'http://localhost:5000/Archivos';
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [ruta, setRuta] = useState('');
    const [tipo, setTipo] = useState('');
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [archivos, setArchivos] = useState([]);
    const modalRef = useRef(null);

    useEffect(() => {
        refreshToken();
        getArchivos();
    }, []);

    useEffect(() => {
        if (modalRef.current) {
            modalRef.current.addEventListener('hide.bs.modal', () => {
                limpiarCampos();
                setId('');
                setOperation(1);
                setTitle('Agregar Archivo');
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

    const getArchivos = async () => {
        try {
            const response = await axiosJWT.get(url);
            setArchivos(response.data);
        } catch (error) {
            console.error('Error al obtener archivos:', error);
            show_alerta('Error al obtener archivos', 'error');
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
                    show_alerta('Archivo agregado correctamente', 'success');
                } else if (operation === 2) {
                    show_alerta('Archivo editado correctamente', 'success');
                }
                getArchivos();
                closeModal();
            } else {
                show_alerta('Archivo ' + (operation === 1 ? 'agregado' : 'editado') + ' correctamente', 'success');
                getArchivos();
            }
        } catch (error) {
            show_alerta('Error en la solicitud: ' + error.message, 'error');
            console.log(error);
        }
    };

    const deleteArchivo = (id, nombre) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Seguro de eliminar el archivo ' + nombre + ' ?',
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
                    show_alerta('Archivo eliminado correctamente', 'success');
                    getArchivos();
                })
                .catch(error => {
                    console.error('Error al eliminar archivo:', error);
                    show_alerta('Error al eliminar archivo', 'error');
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                show_alerta('El archivo NO fue eliminado', 'info');
            }
        }).catch(error => {
            console.error('Error al mostrar confirmación de eliminación:', error);
            show_alerta('Error al mostrar confirmación de eliminación', 'error');
        });
    };

    const openModal = (op, id = '', nombre = '', ruta = '', tipo = '') => {
        if (op === 1) {
            setTitle('Agregar Archivo');
            setOperation(1);
            setNombre('');
            setRuta('');
            setTipo('');
        } else if (op === 2) {
            setTitle('Editar Archivo');
            setId(id);
            setNombre(nombre);
            setRuta(ruta);
            setTipo(tipo);
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
            show_alerta('Escribe el nombre del archivo', 'warning');
        } else if (ruta.trim() === '') {
            show_alerta('Escribe la ruta del archivo', 'warning');
        } else if (tipo.trim() === '') {
            show_alerta('Escribe el tipo del archivo', 'warning');
        } else {
            if (operation === 1) {
                parametros = { nombre: nombre.trim(), ruta: ruta.trim(), tipo: tipo };
                metodo = 'POST';
            } else {
                parametros = { id: id, nombre: nombre.trim(), ruta: ruta.trim(), tipo: tipo };
                metodo = 'PUT';
            }
            enviarSolicitud(metodo, parametros);
        }
    };

    const limpiarCampos = () => {
        setNombre('');
        setRuta('');
        setTipo('');
    };

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                        <div className='modal-body'>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-link'></i></span>
                                <input type='text' id='ruta' className='form-control' placeholder='Ruta' value={ruta}
                                    onChange={(e) => setRuta(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-file'></i></span>
                                <input type='text' id='tipo' className='form-control' placeholder='Tipo' value={tipo}
                                    onChange={(e) => setTipo(e.target.value)}></input>
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
                                    <tr><th>#</th><th>ARCHIVO</th><th>RUTA</th><th>TIPO</th><th></th></tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {archivos.map((archivo, i) => (
                                        <tr key={archivo.id}>
                                            <td>{(i + 1)}</td>
                                            <td>{archivo.nombre}</td>
                                            <td>{archivo.ruta}</td>
                                            <td>{archivo.tipo}</td>
                                            <td>
                                                <button onClick={() => openModal(2, archivo.id, archivo.nombre, archivo.ruta, archivo.tipo)}
                                                    className='btn btn-warning'>
                                                    <i className='fa-solid fa-edit'></i> Editar
                                                </button>
                                                &nbsp;
                                                <button onClick={() => deleteArchivo(archivo.id, archivo.nombre)} className='btn btn-danger'>
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

export default ShowArchivos;
