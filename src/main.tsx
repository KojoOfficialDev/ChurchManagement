import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './core/stores';
import 'react-data-grid/lib/styles.css';
import "flatpickr/dist/themes/dark.css";
import './index.scss'
import './assets/css/icofont.min.css'
import { AppRoutes } from './components/pages/app_routes'
import 'tw-elements';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
)
