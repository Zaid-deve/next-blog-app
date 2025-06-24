'use client';

import React, { useEffect, useState } from 'react';
import { Home, FileText, HelpCircle, Menu, X, LogOutIcon } from 'lucide-react';
import { DashboardContent } from '@/components/dashboard/Dashboard';
import { HelpContent } from '@/components/dashboard/Help';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { timeAgo } from '@/lib/functions';
import { BlogsContent } from '@/components/dashboard/Blogs';
import { DashboardStats } from '@/types/types';
import axios from 'axios';
import { toast } from 'sonner';


// Enhanced navigation item with modern styling
const NavItem = ({ icon: Icon, label, isActive, onClick }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${isActive
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
            : 'text-gray-700 hover:bg-gray-100 hover:scale-105'
            }`}
    >
        <Icon size={20} />
        <span>{label}</span>
    </button>
);

// Modern sidebar with glassmorphism effect
const Sidebar = ({ activeSection, setActiveSection, isOpen, toggleSidebar, user, logout }: any) => {
    const navigationItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'blogs', label: 'Blogs', icon: FileText },
        { id: 'help', label: 'Help', icon: HelpCircle }
    ];

    function initLogout() {
        logout();
    }

    return (
        <>
            {/* Mobile overlay with blur effect */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar with glassmorphism */}
            <div className={`
        fixed top-0 left-0 h-screen bg-white/80 backdrop-blur-xl border-r border-white/20 z-50 transform transition-all duration-300 ease-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        w-100
      `}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                    <h2 className="text-2xl font-black bg-gradient-to-r text-gray-500">
                        My <br /> Dashboard
                    </h2>
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 border-b border-gray-200">
                    <div className="flex gap-x-3 items-center bg-gray-100 p-3 rounded-xl">
                        <Link href='/dashboard/profile' className='w-full flex gap-3 items-center'>
                            <Image src={user?.avatarUrl ?? '/person-with-blue-shirt-that-says-name-person_1029948-7040 (1).avif'} height={25} width={25} alt={'profile image'} className='rounded-full h-10 w-10' />
                            <div className='flex flex-col'>
                                <h3 className='text-lg font-bold'>{user?.username || 'user'}</h3>
                                <span className='text-xs font-semibold'>{timeAgo(user?.createdAt || null) || '-'}</span>
                            </div>
                        </Link>
                        <Button onClick={initLogout} className='cursor-pointer rounded-4xl' variant={'destructive'} size={'icon'}>
                            <LogOutIcon />
                        </Button>
                    </div>
                </div>

                <nav className="p-6 space-y-3">
                    {navigationItems.map((item) => (
                        <NavItem
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            isActive={activeSection === item.id}
                            onClick={() => {
                                setActiveSection(item.id);
                                if (window.innerWidth < 1024) toggleSidebar();
                            }}
                        />
                    ))}
                </nav>
            </div>
        </>
    );
};

// Main dashboard with modern background
const Dashboard = () => {
    const auth = useAuth();
    const { logout, user } = auth;
    const router = useRouter();
    const [activeSection, setActiveSection] = useState(sessionStorage.getItem('dashboardTab') ?? 'dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState<DashboardStats>({
        views: 0, blogs: 0, revenue: 0, growth: 0
    })

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    useEffect(() => {
        if (auth.authorized) {
            (async () => {
                try {
                    const req = await axios.get('/api/me/stats', {
                        headers: {
                            Authorization: `Bearer ${auth.authorization}`
                        }
                    });

                    if (req.status == 200) {
                        setStats(req.data.data)
                    }

                } catch (e: any) {
                    toast.error(e.response.data.error ?? e.message ?? 'Something went wrong !');
                    if (e.status == 401) {
                        router.push('/login')
                    }
                }
            })()
        }
    }, [auth])

    // Content renderer with enhanced styling
    const renderContent = () => {
        sessionStorage.setItem('dashboardTab', activeSection)

        switch (activeSection) {
            case 'dashboard':
                return <DashboardContent stats={stats} />;
            case 'blogs':
                return <BlogsContent />;
            case 'help':
                return <HelpContent />;
            default:
                return <DashboardContent stats={stats} />;
        }

    };

    useEffect(() => {
        if (!auth.authorized) {
            router.push('/login');
        }
    }, [auth.authorized])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
            <Sidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                isOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                logout={logout}
                user={user}
            />

            {/* Main content with backdrop */}
            <div className="flex-1 lg:ml-0">
                {/* Enhanced mobile header */}
                <div className="lg:hidden bg-white/80 backdrop-blur-xl border-b border-white/20 p-4 shadow-sm">
                    <button
                        onClick={toggleSidebar}
                        className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Content with modern background */}
                <main className="min-h-screen">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;