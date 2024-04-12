import React from 'react';
import axios from 'axios';

const Navbar = () => {
    const Logout = async () => {
        try {
            await axios.delete('http://localhost:5000/logout');
            window.location.href = "/";
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <nav className="navbar is-light" role="navigation" aria-label="main navigation">
            <div className="container">
                <div className="navbar-brand">
                    <a href="/" role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>
                <div id="navbarBasicExample" className="navbar-menu">
                    <div className="navbar-start">
                        <a href="/dashboard" className="navbar-item">
                            Home
                        </a>
                    </div>
                    <div className="navbar-start">
                        <a href="/archivos" className="navbar-item">
                            Archivos
                        </a>
                    </div>
                    <div className="navbar-start">
                        <a href="/clientes" className="navbar-item">
                            Clientes
                        </a>
                    </div>
                    <div className="navbar-start">
                        <a href="/empleados" className="navbar-item">
                            Empleados
                        </a>
                    </div>
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                <button onClick={Logout} className="button is-light">
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
