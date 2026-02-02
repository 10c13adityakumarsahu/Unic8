import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchInstructorMeetingsService, updateMeetingStatusService } from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, User, Video, CheckCircle, XCircle, ExternalLink, Mail, Timer, AlertTriangle, RefreshCw } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
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

function InstructorMeetings() {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meetingLinks, setMeetingLinks] = useState({});
    const [currentTime, setCurrentTime] = useState(new Date());
    const { auth } = useContext(AuthContext);
    const { toast } = useToast();

    // Reschedule State
    const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [newDate, setNewDate] = useState("");
    const [newTime, setNewTime] = useState("");

    async function fetchMeetings() {
        if (!auth?.user?._id) return;
        const response = await fetchInstructorMeetingsService(auth.user._id);
        if (response?.success) {
            setMeetings(response.data);
            const links = {};
            response.data.forEach(m => {
                if (m.meetingLink) links[m._id] = m.meetingLink;
            });
            setMeetingLinks(links);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchMeetings();
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, [auth]);

    async function handleUpdateStatus(meetingId, status) {
        const meetingLink = meetingLinks[meetingId];
        if (status === 'accepted' && !meetingLink) {
            toast({
                title: "Meeting link required",
                description: "Please provide a meeting link before accepting.",
                variant: "destructive",
            });
            return;
        }

        const response = await updateMeetingStatusService(meetingId, { status, meetingLink });
        if (response?.success) {
            toast({
                title: `Meeting ${status}`,
                description: `Successfully ${status} the meeting request.`,
            });
            fetchMeetings();
        }
    }

    async function handleRescheduleRequest() {
        if (!newDate || !newTime) {
            toast({ title: "Error", description: "Select date and time", variant: "destructive" });
            return;
        }

        const response = await updateMeetingStatusService(selectedMeeting._id, {
            status: "reschedule_requested",
            rescheduleRequestedBy: "mentor",
            date: newDate,
            time: newTime
        });

        if (response?.success) {
            toast({ title: "Requested", description: "Reschedule request sent to student" });
            setShowRescheduleDialog(false);
            fetchMeetings();
        }
    }

    const calculateTimeLeft = (meetingDateStr, timeSlot) => {
        try {
            // Very basic parser for "10:00 AM" etc.
            const [time, modifier] = timeSlot.split(' ');
            let [hours, minutes] = time.split(':');
            hours = parseInt(hours);
            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;

            const meetingDate = new Date(meetingDateStr);
            meetingDate.setHours(hours, parseInt(minutes), 0);

            const diff = meetingDate.getTime() - currentTime.getTime();
            if (diff < 0) return "Started/Passed";

            const mins = Math.floor(diff / 60000);
            const hrs = Math.floor(mins / 60);
            return hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins}m`;
        } catch (e) {
            return "N/A";
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-bold animate-pulse">Loading meeting requests...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Meeting Requests</h2>
                    <p className="text-gray-500 font-medium">Manage your 1-on-1 sessions</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {meetings.length > 0 ? (
                    meetings.map((meeting) => (
                        <Card key={meeting._id} className="rounded-3xl border-0 shadow-xl shadow-gray-200/50 bg-white overflow-hidden hover:shadow-2xl transition-all duration-300">
                            <div className="flex flex-col md:flex-row">
                                <div className="p-8 flex-1 space-y-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <User className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{meeting.studentName}</h3>
                                                <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                                                    <Mail className="h-3 w-3" /> {meeting.studentEmail}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${meeting.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                    meeting.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                        meeting.status === 'reschedule_requested' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                            'bg-rose-50 text-rose-600 border border-rose-100'
                                                }`}>
                                                {meeting.status.replace('_', ' ')}
                                            </div>
                                            {meeting.status === 'accepted' && (
                                                <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${meeting.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                                                    }`}>
                                                    {meeting.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-indigo-600" />
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                                                <p className="font-bold text-gray-700">{new Date(meeting.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="h-5 w-5 text-indigo-600" />
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time Slot</p>
                                                <p className="font-bold text-gray-700">{meeting.time}</p>
                                            </div>
                                        </div>
                                        {meeting.status === 'accepted' && meeting.paymentStatus === 'paid' && (
                                            <div className="flex items-center gap-3">
                                                <Timer className="h-5 w-5 text-indigo-600" />
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Starts In</p>
                                                    <p className="font-bold text-gray-700">{calculateTimeLeft(meeting.date, meeting.time)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-gray-50 flex flex-wrap gap-4">
                                        {meeting.status === 'pending' && (
                                            <>
                                                <div className="flex-1 relative min-w-[300px]">
                                                    <Video className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <Input
                                                        placeholder="Paste Meeting Link..."
                                                        className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50/50"
                                                        value={meetingLinks[meeting._id] || ""}
                                                        onChange={(e) => setMeetingLinks({ ...meetingLinks, [meeting._id]: e.target.value })}
                                                    />
                                                </div>
                                                <Button
                                                    onClick={() => handleUpdateStatus(meeting._id, 'accepted')}
                                                    className="h-12 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black"
                                                >
                                                    Accept Request
                                                </Button>
                                            </>
                                        )}

                                        {meeting.status === 'accepted' && meeting.paymentStatus === 'paid' && (
                                            <Button
                                                onClick={() => window.open(meeting.meetingLink, '_blank')}
                                                className="h-12 px-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black flex items-center gap-2"
                                            >
                                                <Video className="h-4 w-4" /> Connect Now
                                            </Button>
                                        )}

                                        {meeting.status === 'accepted' && meeting.paymentStatus === 'pending' && (
                                            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
                                                <AlertTriangle className="h-4 w-4" />
                                                <span className="text-sm font-bold uppercase tracking-tight">Awaiting Student Payment</span>
                                            </div>
                                        )}

                                        {(meeting.status === 'pending' || meeting.status === 'accepted') && (
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedMeeting(meeting);
                                                    setShowRescheduleDialog(true);
                                                }}
                                                className="h-12 px-6 rounded-xl border-gray-100 font-bold text-gray-500 flex items-center gap-2"
                                            >
                                                <RefreshCw className="h-4 w-4" /> Request Reschedule
                                            </Button>
                                        )}

                                        {meeting.status === 'pending' && (
                                            <Button
                                                onClick={() => handleUpdateStatus(meeting._id, 'rejected')}
                                                variant="ghost"
                                                className="h-12 px-6 rounded-xl text-rose-500 font-bold flex items-center gap-2"
                                            >
                                                <XCircle className="h-4 w-4" /> Reject
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card className="rounded-3xl border-0 shadow-xl shadow-gray-200/50 bg-white p-20 text-center flex flex-col items-center">
                        <Video className="h-16 w-16 text-indigo-100 mb-6" />
                        <h3 className="text-2xl font-black text-gray-900 mb-2">No Meetings</h3>
                    </Card>
                )}
            </div>

            {/* Reschedule Dialog */}
            <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Request Reschedule</DialogTitle>
                        <DialogDescription className="font-medium text-gray-500">
                            Suggest a new time to <span className="text-indigo-600 font-bold">{selectedMeeting?.studentName}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="space-y-2">
                            <Label className="font-bold">New Date</Label>
                            <Input
                                type="date"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                className="h-12 rounded-xl"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold">New Time</Label>
                            <Select value={newTime} onValueChange={setNewTime}>
                                <SelectTrigger className="h-12 rounded-xl">
                                    <SelectValue placeholder="Select new slot" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"].map(time => (
                                        <SelectItem key={time} value={time}>{time}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowRescheduleDialog(false)}>Cancel</Button>
                        <Button onClick={handleRescheduleRequest} className="bg-indigo-600 text-white font-black px-8">Send Request</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default InstructorMeetings;
