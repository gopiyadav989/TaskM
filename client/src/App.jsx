import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";
import Trash from "./pages/Trash";
import TasksDetails from "./pages/TasksDetails";

import { Toaster } from "sonner";
import { useDispatch, useSelector } from 'react-redux';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { setOpenSidebar } from "./redux/slices/authSlice";

function Layout() {
    const { user } = useSelector((state) => state.auth);

    const location = useLocation();

    return user ? (
        <div className="w-full h-screen flex flex-col md:flex-row">
            <div className="w-1/5 h-screen bg-white sticky top-0 hidden md:block">
                <Sidebar />
            </div>

            <MobileSidebar />

            <div className="flex-1 overflow-y-auto">
                <Navbar />

                <div className="p-4 2xl:px-10">
                    <Outlet />
                </div>
            </div>
        </div>
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    )
};

function MobileSidebar() {
    const { isSidebarOpen } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    return (
        <Sheet open={isSidebarOpen && window.innerWidth < 768} onOpenChange={() => dispatch(setOpenSidebar())}>
            <SheetContent side="left" className="w-[300px] px-0">
                <SheetHeader className="p-4">
                    <SheetTitle className="text-left sr-only">Navigation</SheetTitle>
                    <SheetDescription className="sr-only">
                        Application navigation menu
                    </SheetDescription>
                </SheetHeader>
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
}

function App() {

    return (
        <>
            <main className='w-full min-h-screen bg-[#f3f4f6]'>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Navigate to='/dashboard' />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/completed/:status" element={<Tasks />} />
                        <Route path="/in-progress/:status" element={<Tasks />} />
                        <Route path="/todo/:status" element={<Tasks />} />
                        <Route path="/team" element={<Users />} />
                        <Route path="/trashed" element={<Trash />} />
                        <Route path="/task/:id" element={<TasksDetails />} />
                    </Route>

                    <Route path="/login" element={<Login />} />
                </Routes>

                <Toaster richColors />
            </main>
        </>
    )
}

export default App
