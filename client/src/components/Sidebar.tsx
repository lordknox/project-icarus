import { Map, LayoutDashboard, Wind, Sun, Zap } from 'lucide-react';

interface SidebarProps {
    currentView: 'map'|'dashboard';
    onViewChange: (view: 'map'|'dashboard') => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
    return(
        <aside className='w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-xl flex flex-col'>
            {/* Logo */}
            <div className='p-6 border-b border-blue-700'>
                <div className='flex items-center gap-3'>
                    <div className='p-2 bg-yellow-500 rounded-lg'>
                        <Sun className='w-6 h-6 text-blue-900' />
                    </div>
                    <div>
                        <h1 className='text-2xl font-bold'>Icarus</h1>
                        <p className='text-xs text-blue-200'>Renewable Energy Intelligence</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className='flex-1 p-4 space-y-2'>
                <button 
                  onClick={() => onViewChange('map')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transtion-all ${
                    currentView === 'map'
                    ? 'bg-blue-700 shadow-lg'
                    : 'hover:bg-blue-800/50'
                  }`}
                >
                    <Map className='w-5 h-5' />
                    <span className='font-medium'>Map View</span>
                </button>
                <button
                  onClick={() => onViewChange('dashboard')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    currentView === 'dashboard'
                    ? 'bg-blue-700 shadow-lg'
                    : 'hover: bg-blue-800/50'
                  }`}
                >
                    <LayoutDashboard className='w-5 h-5' />
                    <span className='font-medium'>Dashboard</span>
                </button>

                <div className='pt-4 mt-4 border-t border-blue-700'>
                    <p className='text-xs text-blue-300 px-4 pb-2 uppercase tracking-wide'>
                        Resources
                    </p>

                    <div className='space-y-1'>
                        <div className='flex items-center gap-3 px-4 py-2 text-sm text-blue-200'>
                            <Wind className='w-4 h-4' />
                            <span>8 Wind Zones</span>
                        </div>
                        <div className='flex items-center gap-3 px-4 py-2 text-sm text-blue-200'>
                            <Sun className='w-4 h-4' />
                            <span>8 solar Zones</span>
                        </div>
                        <div className='flex items-center gap-3 px-4 py-2 text-sm text-blue-200'>
                            <Zap className='w-4 h-4' />
                            <span>10 Grid Points</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Footer */}
            <div className='p-4 border-t border-blue-700'>
                <p className='text-xs text-blue-300 text-center'>
                    India Renewable Energy Platform
                </p>
                <p className='text-xs text-blue-400 text-center mt-1'>
                    Version 1.0.0
                </p>
            </div>
        </aside>
    );
}