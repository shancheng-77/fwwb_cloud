import Box from "@mui/material/Box";

import onImg from '../../static/关机on1.png';
import offImg from '../../static/关机off.png'
import errorImg from '../../static/故障信息.png'

export function EquipmentItem(props) {
    const {status,name,costTime=10, selected=false,output=10,setSelectedData} = props;
    const bgc = selected ? '#5276A6' : '#1F2D42';
    const handleClick = () => {
        setSelectedData(props);
    }
    const getImgUrl = (status) => {
        switch (status) {
            case 'ON' : return onImg;
            case 'OFF' : return offImg;
            default : return errorImg
        }
    }
    return (
        <Box style={{display:"flex",width:225,height:100,
                    backgroundColor:bgc,alignItems:"center",fontSize:14,
                    cursor:'pointer',color:'#eee'
                }}
             onClick={handleClick}
        >
            <Box style={{flex:'1 0 50px',padding:5}}>
                <img  src={getImgUrl(status)} alt='状态' width='50px'/>
            </Box>
            <Box style={{flex:'3 0 200px',display:'flex'}}>
                <Box style={{flex:'2 0 50px',lineHeight:'25px'}}>
                    <p>设备：</p>
                    <p>运行时间：</p>
                    <p>产量：</p>
                </Box>
                <Box style={{flex:'3 0 100px',lineHeight:'25px'}}>
                    <p>{name}</p>
                    <p>{costTime}</p>
                    <p>{output}</p>
                </Box>
            </Box>
        </Box>
    )
}
