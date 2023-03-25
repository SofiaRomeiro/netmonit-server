import React  from 'react';
import "./topbar.css"

const Topbar = () => {
    return (
        <div className="topbar">
            <div className="topbarWrapper">
                <div className="topLeft">
                    <span className="logo">PIC Monitoring Hub</span>
                </div>
                <div className="topRight">Features (TBA)</div>
            </div>
        </div>
    );
};

export default Topbar;