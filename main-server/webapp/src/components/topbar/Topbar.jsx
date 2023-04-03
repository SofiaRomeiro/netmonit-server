import React  from 'react';
import "./topbar.css"
import { Link } from 'react-router-dom';

const Topbar = () => {
    return (
        <div className="topbar">
            <div className="topbarWrapper">
                <div className='topLeft'>
                    <span className="title">Network Monitoring Hub</span>
                </div>
                <div className='right-side'>
                    <Link to="/grafana" className="RSelement">Grafana</Link>
                    <Link to="/probes" className="RSelement">Probes</Link>
                    <Link to="/settings" className="RSelement">Setting</Link>
                </div>
                    
               
            </div>
        </div>
    );
};

export default Topbar;