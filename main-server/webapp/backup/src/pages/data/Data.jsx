import "./data.css"
import { ethernet, wlan, wwan } from "../../constants/interfaces";
import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { green, red, amber } from "@mui/material/colors";
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CableIcon from '@mui/icons-material/Cable';
import WifiIcon from '@mui/icons-material/Wifi';
import LanguageIcon from '@mui/icons-material/Language';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';

// exported functions that are used in the Home.jsx file too
export function selectInterface(params) {
    const currentInterface = params.value.slice(0, 2)

    console.log("Interface: " + currentInterface)

    if (ethernet.includes(currentInterface)) { // it only verifies unix interfaces such as eth0 and wlan0
        return <CableIcon/>
    }

    else if (wlan.includes(currentInterface)) {
        return <WifiIcon/>
    }
    else if (wwan.includes(currentInterface)) {
        return <LanguageIcon/>
    }
    else {
        return <HelpIcon />
    }
};

export function selectConnectionStatus(params) {
    const currentStatus = params.value

    if (currentStatus) { // it only verifies unix interfaces such as eth0 and wlan0
        return <CheckIcon htmlColor="green"/>
    }

    else {
        return <CloseIcon htmlColor="red"/>
    }
};


export function getChipProps(params) {
    if (params.value === 'connected') {
        return {
            icon: <CheckCircleIcon style={{ fill: green[500] }} />,
            label: 'Connected',
            style: {
                borderColor: green[500]
            }
        };
    }
    else if (params.value === 'no_connection') {
        return {
            icon: <WarningIcon style={{ fill: amber[500] }} />,
            label: 'No Connection',
            style: {
                borderColor: amber[500]
            }
        };
    }
    else if (params.value === 'disconnected') {
        return {
            icon: <CancelIcon style={{ fill: red[500] }} />,
            label: 'Disconnected',
            style: {
                borderColor: red[500]
            }
        };
    }
    else {
        return {
            label: 'not defined'
        }
    }
};

export const getDate = (params) => {
    const date = params.value.split("T")[0];
    return date;  
};

export const getTime = (params) => {
    const timestamp = params.value.split("T")[1];
    const time = timestamp.split(".")[0];
    return time;   
};

const Data = () => {

    const [data, setData]  = useState([]);

    const getData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/events`);
            const jsonData = await response.json();
            setData(jsonData);
        }  catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const columns = [
        {field: 'id_pi', headerName: 'ID', headerAlign: 'center'},
        {field: 'creation_date', headerName: 'Date', type: 'date', headerAlign: 'center', align: 'center', valueGetter: getDate},
        {field: 'creation_date', headerName: 'Time', type: 'date', headerAlign: 'center', align: 'center', valueGetter: getTime},
        {field: 'connected', headerName: 'Connection Status', type:'boolean',align: 'center', headerAlign: 'center', renderCell: (params) => selectConnectionStatus(params)},
        {field: 'max', headerName: 'Max Time', type: 'number', headerAlign: 'center', align: 'center'},
        {field: 'min', headerName: 'Min Time', type: 'number', headerAlign: 'center', align: 'center'},
        {field: 'avg', headerName: 'Avg Time', type: 'number', headerAlign: 'center', align: 'center'},
        {field: 'packets_sent', headerName: '#Packets Sent', type: 'number', headerAlign: 'center', align: 'center'},
        {field: 'packets_received', headerName: '#Packets Received', type: 'number', headerAlign: 'center', align: 'center'},
        {
            field: 'packet_loss', 
            headerName: 'Packet Loss', 
            type: 'number', 
            headerAlign: 'center', 
            align: 'center',
            valueFormatter: (params) => {
                return `${params.value} %`;
            }
        },
        {field: 'ip', headerName: 'IP Address', headerAlign: 'center', align: 'center'},
        {field: 'interface', headerName: 'Interface', headerAlign: 'center', align: 'center', renderCell: (params) => {
            return selectInterface(params)
        }},
        {field: 'location', headerName: 'Location', headerAlign: 'center', align: 'center'}
        
    ];

    return (
        <div className="data">
            <DataGrid
                rows={data}
                columns={columns}
                id="_id"
                components={{Toolbar: GridToolbar}}
                getRowId={(row) => ((row.id_pi, row.creation_date)) }
                />
        </div>
    );
};

export default Data;