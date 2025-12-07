import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 1. Import Router (để chuyển trang)
import { BrowserRouter } from 'react-router-dom'

// 2. Import Kho chứa (Context)
import { MovieProvider } from './context/MovieContext.jsx'
import { CinemaProvider } from './context/CinemaContext.jsx'
import { RoomProvider } from './context/RoomContext.jsx';
import { ShowtimeProvider } from './context/ShowtimeContext.jsx'; // Thêm dòng này

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            {/* 3. Bọc App bên trong các Provider */}
            <MovieProvider>
                <CinemaProvider>
                    <RoomProvider>
                        <ShowtimeProvider> {/* Bọc ShowtimeProvider vào trong cùng */}
                            <App />
                        </ShowtimeProvider>
                    </RoomProvider>
                </CinemaProvider>
            </MovieProvider>
        </BrowserRouter>
    </StrictMode>,
)