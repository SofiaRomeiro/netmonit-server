import "./grafana.css"
import React  from 'react';


const Grafana = () => {
    return (
        /*<iframe id="grafana"
            title="Grafana Network Monitoring"
            src="https://www.emolument.com/start"
            allow="fullscreen"
            width="100%"
            height="1000vh"
        >
        </iframe>*/
        <img 
            src={require("../../assets/dashboard.jpg")}
            width="100%"
            height="900vh"
        ></img>
     
    )
}

export default Grafana;