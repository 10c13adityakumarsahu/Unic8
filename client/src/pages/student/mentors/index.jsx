import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchStudentViewMentorsService, createMeetingRequestService } from "@/services";
import { Video, Star, ShieldCheck, Users, Search, GraduationCap, Calendar, Clock, AlertCircle } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/context/auth-context";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function StudentMentorsPage() {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { auth } = useContext(AuthContext);
    const { toast } = useToast();

    // Scheduling State
    const [showScheduleDialog, setShowScheduleDialog] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [meetingDate, setMeetingDate] = useState("");
    const [meetingTime, setMeetingTime] = useState("");
    const [isScheduling, setIsScheduling] = useState(false);

    async function fetchMentors() {
        const response = await fetchStudentViewMentorsService();
        if (response?.success) {
            setMentors(response.data);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchMentors();
    }, []);

    const filteredMentors = mentors.filter(mentor =>
        mentor.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.profession?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.interests?.some(interest => interest.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    function handleOpenSchedule(mentor) {
        if (!auth?.authenticate) {
            toast({
                title: "Authentication Required",
                description: "Please sign in to schedule a meeting with a mentor.",
                variant: "destructive",
            });
            return;
        }
        setSelectedMentor(mentor);
        setShowScheduleDialog(true);
    }

    async function handleScheduleMeeting() {
        if (!meetingDate || !meetingTime) {
            toast({
                title: "Incomplete details",
                description: "Please select both date and time for the meeting.",
                variant: "destructive",
            });
            return;
        }

        setIsScheduling(true);
        const response = await createMeetingRequestService({
            mentorId: selectedMentor._id,
            mentorName: selectedMentor.userName,
            studentId: auth?.user?._id,
            studentName: auth?.user?.userName,
            studentEmail: auth?.user?.userEmail,
            date: meetingDate,
            time: meetingTime
        });

        if (response?.success) {
            toast({
                title: "Meeting Scheduled",
                description: `Your request has been sent to ${selectedMentor.userName}. They will review and provide a meeting link shortly.`,
            });
            setShowScheduleDialog(false);
            setMeetingDate("");
            setMeetingTime("");
        } else {
            toast({
                title: "Scheduling Failed",
                description: response?.message || "Something went wrong",
                variant: "destructive",
            });
        }
        setIsScheduling(false);
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-bold animate-pulse">Finding top mentors...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 md:py-20">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-black uppercase tracking-widest">
                            <Users className="h-4 w-4" /> 50+ Expert Mentors
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight">
                            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Expert Mentor</span>
                        </h1>
                        <p className="text-xl text-gray-500 font-medium max-w-2xl">
                            Connect 1-on-1 with industry leaders to accelerate your career and master new skills through video conferencing.
                        </p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, role or skill..."
                            className="h-14 pl-12 rounded-2xl border-gray-100 bg-white shadow-xl shadow-gray-200/50 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Mentors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredMentors.length > 0 ? (
                        filteredMentors.map((mentor) => (
                            <Card key={mentor._id} className="group hover:scale-[1.02] transition-all duration-500 rounded-3xl border-0 shadow-xl hover:shadow-2xl hover:shadow-indigo-100 bg-white overflow-hidden flex flex-col">
                                <div className="h-32 bg-gradient-to-br from-indigo-600 to-purple-700 relative">
                                    <div className="absolute -bottom-10 left-8">
                                        <div className="w-20 h-20 rounded-2xl border-4 border-white overflow-hidden bg-gray-100 shadow-lg">
                                            {mentor.image ? (
                                                <img src={mentor.image} alt={mentor.userName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-3xl font-black text-indigo-200 uppercase">
                                                    {mentor.userName?.[0]}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-wider">
                                            Available Now
                                        </div>
                                    </div>
                                </div>

                                <CardContent className="p-8 pt-12 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                            {mentor.userName}
                                        </h3>
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <Star className="h-4 w-4 fill-amber-500" />
                                            <span className="text-sm font-black italic">4.9</span>
                                        </div>
                                    </div>

                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-indigo-500" /> {mentor.profession || 'Educator & Expert'}
                                    </p>

                                    <p className="text-gray-500 font-medium line-clamp-2 mb-6 text-[15px] leading-relaxed">
                                        {mentor.bio || "Industry professional dedicated to helping students achieve their learning goals through personalized mentorship."}
                                    </p>

                                    {/* Skills / Interests */}
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {(mentor.interests?.length > 0 ? mentor.interests : ['Leadership', 'Technology', 'Career Guidance']).slice(0, 3).map((interest, idx) => (
                                            <span key={idx} className="bg-gray-50 border border-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                                                {interest}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-auto grid grid-cols-1 gap-4">

                                        <Button
                                            onClick={() => handleOpenSchedule(mentor)}
                                            className="h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
                                        >
                                            <Calendar className="h-4 w-4" /> Schedule
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <div className="bg-white p-12 rounded-3xl shadow-xl max-w-lg mx-auto border border-gray-100">
                                <GraduationCap className="h-16 w-16 text-indigo-200 mx-auto mb-6" />
                                <h3 className="text-2xl font-black text-gray-900 mb-2">No Mentors Found</h3>
                                <p className="text-gray-500 font-medium mb-8">We couldn't find any mentors matching your search. Try different keywords or browse all experts.</p>
                                <Button
                                    onClick={() => setSearchTerm("")}
                                    className="bg-indigo-600 text-white font-black rounded-xl px-10 h-12"
                                >
                                    View All Mentors
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Scheduling Dialog */}
                <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                    <DialogContent className="sm:max-w-[500px] rounded-3xl border-0 shadow-2xl p-0 overflow-hidden bg-white">
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white">
                            <DialogHeader>
                                <DialogTitle className="text-3xl font-black tracking-tight">Schedule session</DialogTitle>
                                <DialogDescription className="text-indigo-100 font-medium">
                                    Set up a 1-on-1 video call with <span className="font-black text-white">{selectedMentor?.userName}</span>
                                </DialogDescription>
                            </DialogHeader>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Preferred Date</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input
                                            type="date"
                                            value={meetingDate}
                                            onChange={(e) => setMeetingDate(e.target.value)}
                                            className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50/50 font-bold"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Preferred Time</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Select value={meetingTime} onValueChange={setMeetingTime}>
                                            <SelectTrigger className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50/50 font-bold">
                                                <SelectValue placeholder="Select time slot" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                                {["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"].map(time => (
                                                    <SelectItem key={time} value={time} className="font-bold py-3">{time}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex gap-4">
                                <AlertCircle className="h-6 w-6 text-indigo-600 shrink-0" />
                                <p className="text-sm font-medium text-indigo-700 leading-relaxed">
                                    Once scheduled, the mentor will receive your request. You'll receive a meeting link in your dashboard after they accept.
                                </p>
                            </div>
                        </div>

                        <DialogFooter className="p-8 pt-0 flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowScheduleDialog(false)}
                                className="flex-1 h-14 rounded-2xl border-gray-100 font-black hover:bg-gray-50 tracking-tight"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleScheduleMeeting}
                                disabled={isScheduling}
                                className="flex-1 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-100 tracking-tight"
                            >
                                {isScheduling ? "Scheduling..." : "Confirm Schedule"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

export default StudentMentorsPage;
