import React from "react";
import { Link } from 'react-router';
import './header.css';
import '../body/body.css';
import bell from './bell.png';
import logo from './logo.png';
import search from './search.png';
import user from './user.png';
import write from './write.png';

const NavBar = () => {

    return (
        <div className="Navigation">
            <div className="logo__search">
                <Link to="/" style={{display: "block"}}>
                    <img className="nav__logo" src={logo} alt="logo" />
                </Link>
                <div className="nav__search">
                    <img className="nav__icon" src={search} alt={"search"} style={{opacity:"50%"}}/>
                    <input type="search" placeholder="Search"/>
                </div>
            </div>
            <div className="nav__menu">
                <Link to="/new-story" ><img className="nav__icon" src={write} alt={'write'}/></Link>
                <Link to="#" ><img className="nav__icon" src={bell} alt={'notifications'}/></Link>
                <Link to="/profile" ><img className="nav__icon" src={user} alt={'user'}/></Link>
            </div>
        </div>
    )
}


const MainHeader =  () => {

    return (
        <header>
            <NavBar />
        </header>
    );
}

export default MainHeader;
