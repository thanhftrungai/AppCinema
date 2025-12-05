import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 1. Import Router (để chuyển trang)
import { BrowserRouter } from 'react-router-dom'

// 2. Import Kho chứa phim (Context) vừa tạo
import { MovieProvider } from './context/MovieContext.jsx'
import { CinemaProvider } from './context/CinemaContext.jsx'
import { RoomProvider } from './context/RoomContext.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            {/* 3. Bọc App bên trong MovieProvider */}
            <MovieProvider>
                <CinemaProvider> {/* Thêm dòng này */}
                    <RoomProvider> {/* Thêm dòng này */}
                        <App />
                    </RoomProvider>
                </CinemaProvider>
            </MovieProvider>
        </BrowserRouter>
    </StrictMode>,
)