import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    BarChart,
    Users,
    DollarSign,
    UserPlus,
    ArrowRight,
    TrendingUp,
    Clock,
    LogOut,
    ChevronRight,
    UserCheck,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    fetchAdminStatsService,
    fetchAllUsersService,
    onboardInstructorService,
    fetchAllInstructorsService,
    addNewInstructorService,
} from "@/services";
import {
    Bar,
    BarChart as ReBarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
    CartesianGrid,
} from "recharts";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import { fetchCoursesByInstructorIdService, fetchInstructorMeetingsService } from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function AdminDashboardPage() {
    const [activeTab, setActiveTab] = useState("overview");
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [showAddInstructorDialog, setShowAddInstructorDialog] = useState(false);
    const [lastInvitedLink, setLastInvitedLink] = useState("");
    const [newInstructorFormData, setNewInstructorFormData] = useState({
        userName: "",
        userEmail: "",
    });
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [instructorData, setInstructorData] = useState({
        courses: [],
        meetings: []
    });
    const { resetCredentials } = useContext(AuthContext);
    const { toast } = useToast();

    async function fetchStats() {
        const response = await fetchAdminStatsService();
        if (response?.success) setStats(response.data);
    }

    async function fetchUsers() {
        const response = await fetchAllUsersService();
        if (response?.success) setUsers(response.data);
    }

    async function fetchInstructors() {
        const response = await fetchAllInstructorsService();
        if (response?.success) setInstructors(response.data);
    }

    async function handleOnboard(userId) {
        const response = await onboardInstructorService(userId);
        if (response?.success) {
            toast({
                title: "Success",
                description: "User onboarded as instructor successfully",
            });
            fetchUsers();
            fetchInstructors();
            fetchStats();
        }
    }

    async function handleViewInstructorAnalytics(instructor) {
        setSelectedInstructor(instructor);
        const courses = await fetchCoursesByInstructorIdService(instructor._id);
        const meetings = await fetchInstructorMeetingsService(instructor._id);

        setInstructorData({
            courses: courses?.data || [],
            meetings: meetings?.data || []
        });
    }

    async function handleAddNewInstructor() {
        const response = await addNewInstructorService(newInstructorFormData);
        if (response?.success) {
            setLastInvitedLink(response.data.invitationLink);
            toast({
                title: "Invitation Generated!",
                description: "The instructor account is created. Copy the link below.",
            });
            setNewInstructorFormData({
                userName: "",
                userEmail: "",
            });
            fetchInstructors();
            fetchStats();
        } else {
            toast({
                title: "Error",
                description: response?.message || "Failed to invite instructor",
                variant: "destructive",
            });
        }
    }

    function handleLogout() {
        resetCredentials();
        sessionStorage.clear();
    }

    useEffect(() => {
        fetchStats();
        fetchUsers();
        fetchInstructors();
    }, []);

    const COLORS = ["#4f46e5", "#818cf8", "#c7d2fe", "#e0e7ff"];

    return (
        <div className="flex h-full min-h-screen bg-[#f8fafc]">
            {/* Sidebar */}
            <aside className="w-80 bg-white border-r border-gray-100 hidden lg:block sticky top-0 h-screen overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                <TrendingUp className="text-white h-6 w-6" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Admin Portal</h2>
                        </div>

                        <nav className="space-y-2">
                            {[
                                { label: "Overview", value: "overview", icon: BarChart },
                                { label: "Instructors List", value: "instructors", icon: UserCheck },
                                { label: "Onboard Users", value: "onboard", icon: UserPlus },
                                { label: "User activity", value: "activity", icon: Clock },
                            ].map((item) => (
                                <Button
                                    key={item.value}
                                    variant="ghost"
                                    className={`w-full justify-start h-14 rounded-xl px-4 transition-all duration-200 group ${activeTab === item.value
                                        ? "bg-indigo-50 text-indigo-600"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                    onClick={() => {
                                        setActiveTab(item.value);
                                        setSelectedInstructor(null);
                                    }}
                                >
                                    <item.icon className={`mr-3 h-5 w-5 transition-colors ${activeTab === item.value ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-900"
                                        }`} />
                                    <span className="font-bold text-[15px]">{item.label}</span>
                                    {activeTab === item.value && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-sm"></div>
                                    )}
                                </Button>
                            ))}

                            <Button
                                variant="ghost"
                                className="w-full justify-start h-14 rounded-xl px-4 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all group"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-600" />
                                <span className="font-bold text-[15px]">Logout</span>
                            </Button>
                        </nav>
                    </div>

                    <div className="mt-auto p-8 border-t border-gray-50">
                        <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">
                                A
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-black text-gray-900 truncate">System Administrator</p>
                                <p className="text-xs font-bold text-gray-400 truncate">Super Admin Access</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 px-8 flex items-center justify-between">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight capitalize">
                        {activeTab.replace("-", " ")}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100 font-bold text-xs uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            System Live
                        </div>
                    </div>
                </header>

                <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
                    {activeTab === "overview" && (
                        <div className="space-y-12">
                            {/* Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { label: "Total Revenue", value: `₹${stats?.totalRevenue?.toLocaleString()}`, icon: DollarSign, color: "indigo" },
                                    { label: "Registered Users", value: stats?.totalUsers, icon: Users, color: "blue" },
                                    { label: "Total Instructors", value: stats?.totalInstructors, icon: UserCheck, color: "emerald" },
                                ].map((item, idx) => (
                                    <Card key={idx} className="border-none shadow-2xl shadow-gray-200/50 rounded-[2rem] overflow-hidden group hover:shadow-indigo-100 transition-all duration-500">
                                        <CardContent className="p-8 relative overflow-hidden">
                                            <div className="relative z-10 flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                                                    <h3 className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">{item.value || 0}</h3>
                                                </div>
                                                <div className={`w-16 h-16 rounded-3xl bg-${item.color}-50 flex items-center justify-center text-${item.color}-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                                    <item.icon className="h-8 w-8" />
                                                </div>
                                            </div>
                                            <div className={`absolute -right-8 -bottom-8 w-32 h-32 bg-${item.color}-50/50 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`}></div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Revenue Graph */}
                            <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                                <CardHeader className="p-10 border-b border-gray-50 flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-black text-gray-900 tracking-tight">Revenue Per Instructor</CardTitle>
                                        <p className="text-gray-500 font-medium mt-1">Platform-wide revenue distribution analytics</p>
                                    </div>
                                    <TrendingUp className="h-8 w-8 text-indigo-100" />
                                </CardHeader>
                                <CardContent className="p-10">
                                    <div className="h-[400px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ReBarChart data={stats?.revenuePerInstructor || []}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis
                                                    dataKey="instructorName"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                                                    dy={10}
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                                                />
                                                <Tooltip
                                                    cursor={{ fill: "#f8fafc" }}
                                                    contentStyle={{
                                                        borderRadius: "16px",
                                                        border: "none",
                                                        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                                                        padding: "16px"
                                                    }}
                                                />
                                                <Bar dataKey="revenue" radius={[10, 10, 10, 10]} barSize={40}>
                                                    {stats?.revenuePerInstructor?.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </ReBarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === "instructors" && !selectedInstructor && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] shadow-2xl shadow-gray-200/50">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Active Instructors</h2>
                                    <p className="text-gray-500 font-medium">Manage and monitor professional teaching staff</p>
                                </div>
                                <Dialog open={showAddInstructorDialog} onOpenChange={(open) => {
                                    setShowAddInstructorDialog(open);
                                    if (!open) setLastInvitedLink("");
                                }}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black px-8 h-14 gap-2 shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-1">
                                            <UserPlus className="h-5 w-5" />
                                            Add New Instructor
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl">
                                        <DialogHeader className="pt-8 px-8">
                                            <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">Register Instructor</DialogTitle>
                                            <p className="text-gray-500 font-medium mt-1">Create a new professional instructor account</p>
                                        </DialogHeader>
                                        <div className="p-8 space-y-6">
                                            {!lastInvitedLink ? (
                                                <>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Full Name</Label>
                                                        <Input
                                                            placeholder="Enter instructor name"
                                                            className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all"
                                                            value={newInstructorFormData.userName}
                                                            onChange={(e) => setNewInstructorFormData({ ...newInstructorFormData, userName: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Email Address</Label>
                                                        <Input
                                                            type="email"
                                                            placeholder="instructor@example.com"
                                                            className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all"
                                                            value={newInstructorFormData.userEmail}
                                                            onChange={(e) => setNewInstructorFormData({ ...newInstructorFormData, userEmail: e.target.value })}
                                                        />
                                                    </div>
                                                    <Button
                                                        onClick={handleAddNewInstructor}
                                                        className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 transition-all mt-4"
                                                    >
                                                        Send Invitation
                                                    </Button>
                                                </>
                                            ) : (
                                                <div className="space-y-6">
                                                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center">
                                                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce shadow-lg shadow-emerald-200">
                                                            <UserCheck className="text-white h-6 w-6" />
                                                        </div>
                                                        <h4 className="text-emerald-900 font-black">Account Created!</h4>
                                                        <p className="text-emerald-700 text-sm font-medium mt-1">Copy the credential link below.</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Invitation Link</Label>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                readOnly
                                                                value={lastInvitedLink}
                                                                className="h-12 rounded-xl bg-gray-50 border-gray-100 font-mono text-[10px]"
                                                            />
                                                            <Button
                                                                variant="outline"
                                                                className="h-12 w-12 rounded-xl border-gray-200 p-0 hover:bg-indigo-50 hover:text-indigo-600"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(lastInvitedLink);
                                                                    toast({ title: "Copied!", description: "Link copied to clipboard." });
                                                                }}
                                                            >
                                                                <ArrowRight className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full h-12 rounded-xl font-bold text-gray-500 hover:bg-gray-100"
                                                        onClick={() => {
                                                            setLastInvitedLink("");
                                                            setShowAddInstructorDialog(false);
                                                        }}
                                                    >
                                                        Done
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-none">
                                                    <TableHead className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Instructor</TableHead>
                                                    <TableHead className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Email</TableHead>
                                                    <TableHead className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</TableHead>
                                                    <TableHead className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {instructors?.map((instructor) => (
                                                    <TableRow key={instructor._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                                        <TableCell className="px-10 py-8">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black shadow-sm group-hover:scale-110 transition-transform">
                                                                    {instructor.userName[0]}
                                                                </div>
                                                                <p className="font-black text-gray-900">{instructor.userName}</p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="px-10 py-8">
                                                            <p className="text-sm font-bold text-gray-500">{instructor.userEmail}</p>
                                                        </TableCell>
                                                        <TableCell className="px-10 py-8">
                                                            <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
                                                                Active
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="px-10 py-8 text-right">
                                                            <Button
                                                                onClick={() => handleViewInstructorAnalytics(instructor)}
                                                                className="bg-gray-900 text-white rounded-xl font-bold px-6 h-10 text-xs shadow-lg hover:bg-black"
                                                            >
                                                                View Analytics
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === "instructors" && selectedInstructor && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-4 mb-4">
                                <Button variant="outline" onClick={() => setSelectedInstructor(null)} className="rounded-xl border-gray-200">← Back</Button>
                                <h2 className="text-2xl font-black text-gray-900">Analytics for {selectedInstructor.userName}</h2>
                            </div>
                            <InstructorDashboard
                                listOfCourses={instructorData.courses}
                                listOfMeetings={instructorData.meetings}
                            />
                        </div>
                    )}

                    {activeTab === "onboard" && (
                        <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                            <CardHeader className="p-10 border-b border-gray-50 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-black text-gray-900 tracking-tight">Onboard Users</CardTitle>
                                    <p className="text-gray-500 font-medium mt-1">Upgrade user accounts to professional instructor status</p>
                                </div>
                                <UserPlus className="h-8 w-8 text-indigo-100" />
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-none">
                                                <TableHead className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">User Details</TableHead>
                                                <TableHead className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Current Role</TableHead>
                                                <TableHead className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {users?.filter(u => u.role === 'user').map((user) => (
                                                <TableRow key={user._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                                    <TableCell className="px-10 py-8">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black shadow-sm group-hover:scale-110 transition-transform">
                                                                {user.userName[0]}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-gray-900">{user.userName}</p>
                                                                <p className="text-sm font-medium text-gray-400">{user.userEmail}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-10 py-8">
                                                        <span className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                                                            {user.role}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-10 py-8 text-right">
                                                        <Button
                                                            onClick={() => handleOnboard(user._id)}
                                                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold px-6 h-12 gap-2 shadow-lg shadow-indigo-100 transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            Onboard
                                                            <ArrowRight className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "activity" && (
                        <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                            <CardHeader className="p-10 border-b border-gray-50 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-black text-gray-900 tracking-tight">Active Usage Tracking</CardTitle>
                                    <p className="text-gray-500 font-medium mt-1">Real-time user engagement and platform active time</p>
                                </div>
                                <Clock className="h-8 w-8 text-indigo-100" />
                            </CardHeader>
                            <CardContent className="p-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {stats?.userActiveTime?.map((user, idx) => (
                                        <div key={idx} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all duration-300">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 font-black shadow-sm">
                                                    {user.userName[0]}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900">{user.userName}</p>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Today</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-black text-indigo-600 tracking-tighter tabular-nums">{user.timeActive}m</p>
                                                <div className="w-full bg-indigo-100 h-1 rounded-full mt-2 overflow-hidden">
                                                    <div className="bg-indigo-600 h-full" style={{ width: `${(user.timeActive / 120) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}

export default AdminDashboardPage;
