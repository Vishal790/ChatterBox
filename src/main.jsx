import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import './index.css'
import { Provider } from 'react-redux'
import store from './redux/store.js'
ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <div onContextMenu={(e) => e.preventDefault()}>
          <App />
        </div>
        <Toaster />
      </BrowserRouter>
    </Provider>
 </React.StrictMode>    
);
