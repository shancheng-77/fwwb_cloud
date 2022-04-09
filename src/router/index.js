import {Orders} from "../component/orders";
import {Management} from "../component/management";
import {Edge} from "../component/egde";
import {Emergency} from "../component/emergency/emergency";
import {Log} from "../component/log";
import {Equipment} from "../component/equipment";

export const router = [
    {
        path:'/orders',
        name:'订单',
        item:true,
        component:<Orders/>
    },
    {
        path:'/edge',
        name:'边端',
        item:true,
        component:<Edge/>
    },
    {
        path:'/equipment',
        name:'设备',
        item:false,
        component:<Equipment/>
    },
    {
        path:'/management',
        name:'管理',
        item:true,
        component:<Management/>
    },

    {
        path: '/emergency',
        name: '异常',
        item:true,
        component: <Emergency/>
    },
    {
        path: '/log',
        name: '日志',
        item:true,
        component: <Log/>
    }
]
