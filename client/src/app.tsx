import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { MapView } from './components/MapViewEnhanced';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Sidebar } from './components/Sidebar';

const queryClient  = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000*60*5,
            refetchOnWindowFocus: false,
        },
    },
});

type View = 'map' | 'dashboard';

function App() {
    const [currentView, setCurrentView] = useState<View>('map');

    return (
        <QueryClientProvider client= {queryClient}>
            <div className='flex h-screen bg-gray-50'>
                {/* Sidebar */}
                <Sidebar currentView = {currentView} onViewChange = {setCurrentView} />

                {/* Main Content */}
                <main className='flex-1 overflow-hidden'>
                    {currentView === 'map' && <MapView />}
                    {currentView === 'dashboard' && <Dashboard />}
                </main>
            </div>
        </QueryClientProvider>
    );
}

export default App;