import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchStudentMeetingsService, captureMeetingPaymentService, updateMeetingStatusService, rateMeetingService } from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Video, ExternalLink, User, AlertCircle, BadgeCheck, Hourglass, CreditCard, CheckCircle, XCircle, RefreshCw, Star } from "lucide-react";
import { useContext, useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";

function StudentMeetingsPage() {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { auth } = useContext(AuthContext);
    const { toast } = useToast();

    // Reschedule & Rating State
    const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
    const [showRatingDialog, setShowRatingDialog] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [newDate, setNewDate] = useState("");
    const [newTime, setNewTime] = useState("");
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");

    async function fetchMeetings() {
        if (!auth?.user?._id) return;
        const response = await fetchStudentMeetingsService(auth.user._id);
        if (response?.success) {
            setMeetings(response.data);
        }
        setLoading(false);
    }

    async function handlePayment(meetingId) {
        toast({ title: "Simulating Payment...", description: "Please wait..." });
        setTimeout(async () => {
            const response = await captureMeetingPaymentService(meetingId);
            if (response?.success) {
                toast({ title: "Payment Successful", description: "Meeting confirmed!" });
                fetchMeetings();
            }
        }, 1500);
    }

    async function handleRescheduleRequest() {
        if (!newDate || !newTime) {
            toast({ title: "Error", description: "Select date and time", variant: "destructive" });
            return;
        }

        const response = await updateMeetingStatusService(selectedMeeting._id, {
            status: "reschedule_requested",
            rescheduleRequestedBy: "student",
            date: newDate,
            time: newTime
        });

        if (response?.success) {
            toast({ title: "Requested", description: "Reschedule request sent to mentor" });
            setShowRescheduleDialog(false);
            fetchMeetings();
        }
    }

    async function handleAcceptReschedule(meeting) {
        const response = await updateMeetingStatusService(meeting._id, {
            status: "accepted",
            date: meeting.date,
            time: meeting.time,
            rescheduleRequestedBy: null
        });

        if (response?.success) {
            toast({ title: "Confirmed", description: "New schedule confirmed!" });
            fetchMeetings();
        }
    }

    async function handleSubmitRating() {
        if (rating === 0) {
            toast({ title: "Error", description: "Please select a rating", variant: "destructive" });
            return;
        }

        const response = await rateMeetingService(selectedMeeting._id, { rating, review });
        if (response?.success) {
            toast({ title: "Success", description: "Thank you for your feedback!" });
            setShowRatingDialog(false);
            fetchMeetings();
        }
    }

    useEffect(() => {
        fetchMeetings();
    }, [auth]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 md:py-20 text-indigo-950">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">Mentorship <span className="text-indigo-600">Sessions</span></h1>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {meetings.length > 0 ? (
                        meetings.map((meeting) => (
                            <Card key={meeting._id} className="rounded-3xl border-0 shadow-xl bg-white overflow-hidden hover:shadow-2xl transition-all duration-500">
                                <div className="p-8">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <User className="h-8 w-8" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Mentor</p>
                                                <h3 className="text-2xl font-black uppercase tracking-tight">{meeting.mentorName}</h3>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 ${meeting.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                meeting.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                    meeting.status === 'reschedule_requested' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                        'bg-rose-50 text-rose-600 border border-rose-100'
                                                }`}>
                                                {meeting.status.replace('_', ' ')}
                                            </div>
                                            {meeting.rating > 0 && <div className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest bg-amber-50 text-amber-600 flex items-center gap-1"><Star className="h-4 w-4 fill-amber-500" /> {meeting.rating}</div>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                        <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl">
                                            <Calendar className="h-5 w-5 text-indigo-600" />
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                                                <p className="font-bold">{new Date(meeting.date).toDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl">
                                            <Clock className="h-5 w-5 text-indigo-600" />
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time Slot</p>
                                                <p className="font-bold">{meeting.time}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Sections */}
                                    <div className="flex flex-wrap gap-4">
                                        {meeting.status === 'accepted' && meeting.paymentStatus === 'paid' && (
                                            <>
                                                <Button
                                                    onClick={() => window.location.href = `/video-call/${meeting._id}`}
                                                    className="h-14 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black flex items-center gap-2"
                                                >
                                                    <Video className="h-4 w-4" /> Join Now
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => { setSelectedMeeting(meeting); setShowRescheduleDialog(true); }}
                                                    className="h-14 px-8 rounded-2xl border-gray-100 font-black text-gray-600 flex items-center gap-2"
                                                >
                                                    <RefreshCw className="h-4 w-4" /> Reschedule
                                                </Button>
                                                {meeting.rating === 0 && (
                                                    <Button
                                                        ghost
                                                        onClick={() => { setSelectedMeeting(meeting); setShowRatingDialog(true); }}
                                                        className="h-14 px-8 rounded-2xl font-black text-amber-600 hover:bg-amber-50 transition-colors flex items-center gap-2"
                                                    >
                                                        <Star className="h-4 w-4 fill-amber-500" /> Recommend Mentor
                                                    </Button>
                                                )}
                                            </>
                                        )}

                                        {meeting.status === 'accepted' && meeting.paymentStatus === 'pending' && (
                                            <Button
                                                onClick={() => handlePayment(meeting._id)}
                                                className="h-14 px-10 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black flex items-center gap-2"
                                            >
                                                <CreditCard className="h-4 w-4" /> Pay ₹{meeting.amount} to Unblock
                                            </Button>
                                        )}

                                        {meeting.status === 'reschedule_requested' && meeting.rescheduleRequestedBy === 'mentor' && (
                                            <div className="w-full bg-blue-50 border border-blue-100 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                                                <div>
                                                    <h4 className="font-black text-blue-900 leading-tight">Mentor requested reschedule</h4>
                                                    <p className="text-sm font-medium text-blue-700/80">New proposed slot: {new Date(meeting.date).toDateString()} at {meeting.time}</p>
                                                </div>
                                                <div className="flex gap-3">
                                                    <Button onClick={() => handleAcceptReschedule(meeting)} className="bg-blue-600 text-white font-black px-6 rounded-xl">Accept Slot</Button>
                                                </div>
                                            </div>
                                        )}

                                        {meeting.status === 'rejected' && (
                                            <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl w-full flex items-center gap-4">
                                                <AlertCircle className="h-6 w-6 text-rose-600" />
                                                <p className="font-black text-rose-900 uppercase tracking-tight text-sm">Session Rejected by Mentor. They might be busy.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-xl">
                            <Calendar className="h-16 w-16 text-indigo-100 mx-auto mb-4" />
                            <h3 className="text-2xl font-black">No Active Sessions</h3>
                        </div>
                    )}
                </div>
            </div>

            {/* Dialogs */}
            <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
                <DialogContent className="rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Request Reschedule</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="h-12 rounded-xl" min={new Date().toISOString().split('T')[0]} />
                        <Select value={newTime} onValueChange={setNewTime}>
                            <SelectTrigger className="h-12 rounded-xl">
                                <SelectValue placeholder="New time slot" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"].map(time => (
                                    <SelectItem key={time} value={time}>{time}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleRescheduleRequest} className="bg-indigo-600 text-white font-black w-full h-12 rounded-xl">Request Mentor</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
                <DialogContent className="rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Recommend Mentor</DialogTitle>
                        <DialogDescription className="font-medium">How was your session with {selectedMeeting?.mentorName}?</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map(s => (
                                <Star
                                    key={s}
                                    onClick={() => setRating(s)}
                                    className={`h-10 w-10 cursor-pointer transition-colors ${rating >= s ? 'fill-amber-500 text-amber-500' : 'text-gray-200'}`}
                                />
                            ))}
                        </div>
                        <Input placeholder="Leave a review (optional)..." value={review} onChange={(e) => setReview(e.target.value)} className="h-12 rounded-xl" />
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSubmitRating} className="bg-indigo-600 text-white font-black w-full h-12 rounded-xl">Submit Feedback</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default StudentMeetingsPage;
