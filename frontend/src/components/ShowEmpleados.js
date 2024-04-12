import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowEmpleados = () => {
    const url = 'http://localhost:5000/Empleados';
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [cargo, setCargo] = useState('');
    const [salario, setSalario] = useState('');
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [empleados, setEmpleados] = useState([]);
    const modalRef = useRef(null);

    useEffect(() => {
        refreshToken();
        getEmpleados();
    }, []);

    useEffect(() => {
        if (modalRef.current) {
            modalRef.current.addEventListener('hide.bs.modal', () => {
                limpiarCampos();
                setId('');
                setOperation(1);
                setTitle('Agregar Empleado');
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

    const getEmpleados = async () => {
        try {
            const response = await axiosJWT.get(url);
            setEmpleados(response.data);
        } catch (error) {
            console.error('Error al obtener empleados:', error);
            show_alerta('Error al obtener empleados', 'error');
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
                    show_alerta('Empleado agregado correctamente', 'success');
                } else if (operation === 2) {
                    show_alerta('Empleado editado correctamente', 'success');
                }
                getEmpleados();
                closeModal();
            } else {
                show_alerta('Empleado ' + (operation === 1 ? 'agregado' : 'editado') + ' correctamente', 'success');
                getEmpleados();
            }
        } catch (error) {
            show_alerta('Error en la solicitud: ' + error.message, 'error');
            console.log(error);
        }
    };

    const deleteEmpleado = (id, nombre) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Seguro de eliminar el empleado ' + nombre + ' ?',
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
                    show_alerta('Empleado eliminado correctamente', 'success');
                    getEmpleados();
                })
                .catch(error => {
                    console.error('Error al eliminar empleado:', error);
                    show_alerta('Error al eliminar empleado', 'error');
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                show_alerta('El empleado NO fue eliminado', 'info');
            }
        }).catch(error => {
            console.error('Error al mostrar confirmación de eliminación:', error);
            show_alerta('Error al mostrar confirmación de eliminación', 'error');
        });
    };

    const openModal = (op, id = '', nombre = '', cargo = '', salario = '') => {
        if (op === 1) {
            setTitle('Agregar Empleado');
            setOperation(1);
            setNombre('');
            setCargo('');
            setSalario('');
        } else if (op === 2) {
            setTitle('Editar Empleado');
            setId(id);
            setNombre(nombre);
            setCargo(cargo);
            setSalario(salario);
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
            show_alerta('Escribe el nombre del empleado', 'warning');
        } else if (cargo.trim() === '') {
            show_alerta('Escribe el cargo del empleado', 'warning');
        } else if (salario.trim() === '') {
            show_alerta('Escribe el salario del empleado', 'warning');
        } else {
            if (operation === 1) {
                parametros = { nombre: nombre.trim(), cargo: cargo.trim(), salario: salario };
                metodo = 'POST';
            } else {
                parametros = { id: id, nombre: nombre.trim(), cargo: cargo.trim(), salario: salario };
                metodo = 'PUT';
            }
            enviarSolicitud(metodo, parametros);
        }
    };

    const limpiarCampos = () => {
        setNombre('');
        setCargo('');
        setSalario('');
    };

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                        <div className='modal-body'>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-id-card'></i></span>
                                <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-briefcase'></i></span>
                                <input type='text' id='cargo' className='form-control' placeholder='Cargo' value={cargo}
                                    onChange={(e) => setCargo(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-money-bill'></i></span>
                                <input type='text' id='salario' className='form-control' placeholder='Salario' value={salario}
                                    onChange={(e) => setSalario(e.target.value)}></input>
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
                                    <tr><th>#</th><th>Nombre</th><th>Cargo</th><th>Salario</th><th></th></tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {empleados.map((empleado, i) => (
                                        <tr key={empleado.id}>
                                            <td>{(i + 1)}</td>
                                            <td>{empleado.nombre}</td>
                                            <td>{empleado.cargo}</td>
                                            <td>{empleado.salario}</td>
                                            <td>
                                                <button onClick={() => openModal(2, empleado.id, empleado.nombre, empleado.cargo, empleado.salario)}
                                                    className='btn btn-warning'>
                                                    <i className='fa-solid fa-edit'></i> Editar
                                                </button>
                                                &nbsp;
                                                <button onClick={() => deleteEmpleado(empleado.id, empleado.nombre)} className='btn btn-danger'>
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

export default ShowEmpleados;
