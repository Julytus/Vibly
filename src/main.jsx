import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Import CSS libraries first
import 'uikit/dist/css/uikit.min.css'; // UIKit CSS
import 'simplebar-react/dist/simplebar.min.css'; // SimpleBar CSS

// Import custom CSS
import './index.css'; // CSS tùy chỉnh
import './styles/tailwind.css'; // Tailwind CSS
import './styles/style.css'; // CSS tùy chỉnh khác

// Import JavaScript libraries
import UIkit from 'uikit'; // UIKit JS
import Icons from 'uikit/dist/js/uikit-icons.min.js'; // UIKit Icons
UIkit.use(Icons); // Sử dụng Icons

// Render the application 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
