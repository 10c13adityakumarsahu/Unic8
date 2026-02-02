import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Users, Video, BookOpen, TrendingUp, PieChart as PieChartIcon, ArrowUpRight } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { useState, useMemo } from "react";

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

function InstructorDashboard({ listOfCourses = [], listOfMeetings = [] }) {

  const stats = useMemo(() => {
    // Safety checks
    const courses = Array.isArray(listOfCourses) ? listOfCourses : [];
    const meetings = Array.isArray(listOfMeetings) ? listOfMeetings : [];

    // Course Stats
    const courseStats = courses.reduce(
      (acc, course) => {
        const studentCount = course?.students?.length || 0;
        const revenue = (course?.pricing || 0) * studentCount;

        acc.totalStudents += studentCount;
        acc.courseProfit += revenue;

        if (revenue > 0) {
          acc.courseRevenueData.push({
            name: course.title,
            revenue: revenue,
          });
        }

        course?.students?.forEach((student) => {
          acc.studentList.push({
            type: 'Course',
            title: course.title,
            studentName: student.studentName,
            studentEmail: student.studentEmail,
            amount: course.pricing || 0,
            date: "N/A"
          });
        });

        return acc;
      },
      { totalStudents: 0, courseProfit: 0, courseRevenueData: [], studentList: [] }
    );

    // Meeting Stats
    const meetingStats = meetings.reduce((acc, meeting) => {
      if (meeting?.paymentStatus === 'paid') {
        const amount = meeting?.amount || 0;
        acc.revenue += amount;

        // For Timeline
        const dateObj = new Date(meeting.date);
        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        if (!acc.timeline[dateStr]) acc.timeline[dateStr] = 0;
        acc.timeline[dateStr] += amount;

        acc.list.push({
          type: 'Meeting',
          title: `1:1 Session (${dateObj.toLocaleDateString()})`,
          studentName: meeting.studentName,
          studentEmail: meeting.studentEmail,
          amount: amount,
          date: dateObj
        });
      }
      return acc;
    }, { revenue: 0, timeline: {}, list: [] });

    // Combine Data
    const totalProfit = courseStats.courseProfit + meetingStats.revenue;
    const combinedList = [...courseStats.studentList, ...meetingStats.list].sort((a, b) => b.amount - a.amount);

    // Pie Chart Data (Prevent empty chart issue)
    let pieData = [
      { name: 'Courses', value: courseStats.courseProfit },
      { name: 'Meetings', value: meetingStats.revenue }
    ];
    if (totalProfit === 0) pieData = [{ name: 'No Data', value: 1 }]; // Placeholder

    // Line Chart Data
    const lineData = Object.entries(meetingStats.timeline).map(([date, amount]) => ({
      date,
      amount
    }));

    return {
      totalProfit,
      courseProfit: courseStats.courseProfit,
      meetingProfit: meetingStats.revenue,
      totalStudents: courseStats.totalStudents,
      combinedList,
      courseRevenueData: courseStats.courseRevenueData,
      pieData: totalProfit > 0 ? pieData : [],
      lineData
    };
  }, [listOfCourses, listOfMeetings]);

  const config = [
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: stats.totalProfit,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      icon: BookOpen,
      label: "Course Revenue",
      value: stats.courseProfit,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      icon: Video,
      label: "Meeting Revenue",
      value: stats.meetingProfit,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      icon: Users,
      label: "Total Students",
      value: stats.totalStudents,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {config.map((item, index) => (
          <Card key={index} className="border-none shadow-xl shadow-gray-100/50 overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{item.label}</p>
                  <h3 className="text-2xl font-black text-gray-900 leading-none">
                    {item.label.includes('Students') ? item.value : `₹${item.value.toLocaleString()}`}
                  </h3>
                </div>
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color} transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300`}>
                  <item.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Distribution */}
        <Card className="border-none shadow-xl shadow-gray-100/50 rounded-3xl bg-white flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-black text-gray-900 flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-indigo-600" /> Revenue Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            {stats.totalProfit > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400 font-bold">
                No revenue data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Courses */}
        <Card className="border-none shadow-xl shadow-gray-100/50 rounded-3xl bg-white flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-black text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" /> Top Performing Courses
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            {stats.courseRevenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.courseRevenueData} layout="vertical" margin={{ left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                  <Tooltip cursor={{ fill: '#f0fdf4' }} />
                  <Bar dataKey="revenue" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400 font-bold">
                No course data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Meeting Income Trend */}
        <Card className="border-none shadow-xl shadow-gray-100/50 rounded-3xl bg-white lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Video className="h-5 w-5 text-amber-600" /> Mentorship Income Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            {stats.lineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.lineData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="amount" stroke="#f59e0b" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400 font-bold">
                No meeting data available yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card className="border-none shadow-2xl shadow-gray-100 rounded-3xl overflow-hidden bg-white">
        <CardHeader className="p-8 border-b border-gray-50 bg-gray-50/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black text-gray-900 tracking-tight">Recent Transactions</CardTitle>
              <p className="text-gray-500 font-medium mt-1">Details of your earnings</p>
            </div>
            <Button variant="ghost" className="text-indigo-600 font-bold flex items-center gap-2">
              View All <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                  <TableHead className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-widest">Type</TableHead>
                  <TableHead className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-widest">Details</TableHead>
                  <TableHead className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-widest">Student</TableHead>
                  <TableHead className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-widest text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.combinedList.length > 0 ? (
                  stats.combinedList.slice(0, 5).map((item, index) => (
                    <TableRow key={index} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50">
                      <TableCell className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${item.type === 'Course' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                          {item.type}
                        </span>
                      </TableCell>
                      <TableCell className="px-8 py-6">
                        <span className="font-bold text-gray-900 block">{item.title}</span>
                        <span className="text-xs text-gray-400 font-bold">{item.date instanceof Date ? item.date.toLocaleDateString() : item.date}</span>
                      </TableCell>
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-black">
                            {item.studentName?.[0]}
                          </div>
                          <div>
                            <p className="font-black text-gray-900 text-xs">{item.studentName}</p>
                            <p className="text-gray-400 text-[10px]">{item.studentEmail}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-6 text-right">
                        <span className="font-black text-emerald-600">₹{item.amount.toLocaleString()}</span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="px-8 py-20 text-center">
                      <p className="text-gray-400 font-bold">No transactions yet.</p>
                      <p className="text-gray-400 text-xs">Sales and paid meetings will appear here.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InstructorDashboard;
