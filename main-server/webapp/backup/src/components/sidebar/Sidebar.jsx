import React  from 'react';
import "./sidebar.css";
import { Home as HomeIcon } from "@material-ui/icons";
import { TableView as TableViewIcon} from "@mui/icons-material"
import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Dashboard</h3>
                    <ul className="sidebarList">
                        <Link to="/" className="link">
                            <li className="sidebarListItem">
                                <HomeIcon className="sidebarIcon"/>
                                Home
                            </li>
                        </Link>
                        <Link to="/data" className="link">
                            <li className="sidebarListItem">
                                <TableViewIcon className="sidebarIcon" />
                                Event List
                            </li>
                        </Link>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;