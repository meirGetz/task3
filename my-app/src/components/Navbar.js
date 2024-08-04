import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">MyApp</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className="nav-link btn btn-primary" to="/">Log in</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link btn btn-success" to="/NotesWithVersions">Notes</Link>
                        </li>
                        {/* <li className="nav-item">
                            <Link className="nav-link btn btn-info" to="/about">About</Link>
                        </li> */}
                        {/* הוסף כאן קישורים נוספים לפי הצורך */}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
