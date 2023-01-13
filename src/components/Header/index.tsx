import React from "react";
import "./Header.scss"
import wefoxLogo from '../../assets/wefox-logo.svg';
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../../router";

const Header = () => {
    const navigate = useNavigate();

    return (
        <div className="header">
            <Link to="/">
                <img className="logo" src={wefoxLogo} alt="Is not available"/>
            </Link>
            <h3 className="title">Frontend challenge</h3>
            <button className="create-post" onClick={() => navigate(routes.addPost)}>Create Post</button>
        </div>
    )
}

export default Header;
