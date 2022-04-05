import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {router} from "./router";
import {Main} from "./views/main";
export function AppWithRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/orders" />}
                />
                <Route path='/' element={<Main/>} >
                    {router.map(route => {
                        // console.log(route.component)
                        return (
                            <Route path={route.path} element={route.component} key={route.path}/>
                        )
                    })}
                </Route>
                <Route
                    path="/*"
                    element={<Navigate to="/orders" />}
                />
            </Routes>
        </BrowserRouter>
    );
}

