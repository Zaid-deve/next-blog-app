import { DashboardStats } from "@/types/types";
import { BoxIcon, DollarSign, EyeIcon, ShoppingBag, TrendingUp, Users } from "lucide-react";

// Dashboard content component with modern metrics cards
export const DashboardContent = ({ stats: { views = 0, blogs = 0, revenue = 0, growth = 0, activity = [] } }: { stats: DashboardStats }) => (
    <div className="p-8 space-y-8">
        <div className="flex flex-col space-y-2">
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Dashboard Overview
            </h1>
            <p className="text-xl text-gray-600 font-medium">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Modern metrics cards with gradients */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-6 text-white shadow-xl">
                <div className="absolute -right-4 -top-4 h-26 w-26 rounded-full bg-white/10"></div>
                <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                        <Users className="h-8 w-8" />
                        <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full hidden">+12%</span>
                    </div>
                    <h3 className="text-sm font-semibold opacity-90 mb-1">Total Blogs</h3>
                    <p className="text-3xl font-black">{`${blogs}`}</p>
                </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 text-white shadow-xl">
                <div className="absolute -right-4 -top-4 h-26 w-26 rounded-full bg-white/10"></div>
                <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                        <DollarSign className="h-8 w-8" />
                        <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">+8%</span>
                    </div>
                    <h3 className="text-sm font-semibold opacity-90 mb-1">Revenue</h3>
                    <p className="text-3xl font-black">${`${revenue}`}</p>
                </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-6 text-white shadow-xl">
                <div className="absolute -right-4 -top-4 h-26 w-26 rounded-full bg-white/10"></div>
                <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                        <EyeIcon className="h-8 w-8" />
                        <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">+5%</span>
                    </div>
                    <h3 className="text-sm font-semibold opacity-90 mb-1">Views</h3>
                    <p className="text-3xl font-black">{`${views}`}</p>
                </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white shadow-xl">
                <div className="absolute -right-4 -top-4 h-26 w-26 rounded-full bg-white/10"></div>
                <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                        <TrendingUp className="h-8 w-8" />
                        <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">+15%</span>
                    </div>
                    <h3 className="text-sm font-semibold opacity-90 mb-1">Growth</h3>
                    <p className="text-3xl font-black">{`${growth}`}%</p>
                </div>
            </div>
        </div>

        {/* Activity section with modern design */}
        <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-2 text-center">
                <BoxIcon className="mx-auto h-14 w-14"/>
                <h3>Nothing to show at a moment</h3>
            </div>
        </div>
    </div>
);