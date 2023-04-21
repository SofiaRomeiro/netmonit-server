import "./grafana.css"
import React  from 'react';

const Grafana = () => {
    return (
        <div class="grafana-dashboard">
            <iframe 
                src="http://localhost:3000/d-solo/NBFrOIY4z/events-overview?orgId=1&from=1680562469122&to=1680563095738&panelId=2" 
                width="90%"
                height="700vh"
                frameborder="0"
                class="dashboard"
            >        
            </iframe>
            <div class="more-btn">
                <button 
                className="grafana-button" 
                onClick={() => window.location.href="http://localhost:3000/d/NBFrOIY4z/events-overview?orgId=1&from=1680562469122&to=1680563095738" }
                >
                    More
                </button>
            </div>
            <div class="space-adder"></div>
            
        </div>   

    )
}

export default Grafana;