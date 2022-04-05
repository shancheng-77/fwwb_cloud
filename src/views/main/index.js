import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {Outlet, Link, useNavigate, useLocation} from 'react-router-dom';
import {router} from "../../router";
import {useEffect} from "react";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export function Main() {
    const location = useLocation();
    const initSelectedTab = () => {
      return  router.findIndex(n => n.path === location.pathname)
    }
    const [value, setValue] = React.useState(() => initSelectedTab());
    const navigate = useNavigate();
    const handleChange = (event, newValue) => {
        // console.log()
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%',minWidth:1200 }} style={{backgroundColor:'#1b2836'}}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider',backgroundColor:'#283A4D'}} >
                <Tabs value={value} onChange={handleChange} centered
                      aria-label="basic tabs example"
                      style={{height:60,lineHeight:60}}
                >
                    {
                        router.map((_, index) => {
                            return <Tab key={index} label={_.name} value={index}
                                        onClick={() => navigate(_.path)}
                                        style={{height:60,lineHeight:'60px',fontSize:18}}
                                    />;
                        })
                    }
                </Tabs>
            </Box>
            <Box sx={{height:620,padding:'20px 50px',backgroundColor:'#162330',display:'flex',justifyContent:'center'}}>
               <Box sx={{width:1100}}>
                   <Outlet/>
               </Box>
            </Box>
        </Box>
    );
}
