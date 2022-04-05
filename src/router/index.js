import {Orders} from "../component/orders";
import {Management} from "../component/management";
import {Edge} from "../component/egde";
import {Emergency} from "../component/emergency/emergency";
import {Log} from "../component/log";

export const router = [
    {
        path:'/orders',
        name:'订单',
        component:<Orders/>
    },
    {
        path:'/edge',
        name:'边端',
        component:<Edge/>
    },
    {
        path:'/management',
        name:'管理',
        component:<Management/>
    },

    {
        path: '/emergency',
        name: '异常',
        component: <Emergency/>
    },
    {
        path: '/log',
        name: '日志',
        component: <Log/>
    }
]
