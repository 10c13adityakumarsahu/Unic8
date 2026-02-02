import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AuthContext } from "@/context/auth-context";
import { updateUserService, changePasswordService } from "@/services";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { User, Briefcase, GraduationCap, Target, Heart, Award, Image as ImageIcon, Key, Lock, ShieldCheck } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

function InstructorProfile() {
    const { auth, setAuth } = useContext(AuthContext);
    const [userName, setUserName] = useState("");
    const [image, setImage] = useState("");
    const [bio, setBio] = useState("");
    const [educationLevel, setEducationLevel] = useState("");
    const [profession, setProfession] = useState("");
    const [learningGoals, setLearningGoals] = useState(""); // Can serve as Specializations
    const [interests, setInterests] = useState("");
    const [experienceLevel, setExperienceLevel] = useState("");
    const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        if (auth?.user) {
            setUserName(auth.user.userName || "");
            setImage(auth.user.image || "");
            setBio(auth.user.bio || "");
            setEducationLevel(auth.user.educationLevel || "");
            setProfession(auth.user.profession || "");
            setLearningGoals(auth.user.learningGoals?.join(", ") || "");
            setInterests(auth.user.interests?.join(", ") || "");
            setExperienceLevel(auth.user.experienceLevel || "");
        }
    }, [auth]);

    async function handleUpdateProfile() {
        const response = await updateUserService(auth?.user?._id, {
            userName,
            image,
            bio,
            educationLevel,
            profession,
            learningGoals: learningGoals.split(",").map(item => item.trim()).filter(item => item !== ""),
            interests: interests.split(",").map(item => item.trim()).filter(item => item !== ""),
            experienceLevel
        });

        if (response?.success) {
            setAuth({
                ...auth,
                user: response.data,
            });
            toast({
                title: "Profile Updated",
                description: "Your instructor profile has been updated successfully",
            });
        }
    }

    async function handleChangePassword() {
        if (newPassword !== confirmPassword) {
            toast({
                title: "Error",
                description: "New passwords do not match!",
                variant: "destructive",
            });
            return;
        }

        const data = await changePasswordService({
            userId: auth?.user?._id,
            oldPassword,
            newPassword,
        });

        if (data?.success) {
            toast({
                title: "Success",
                description: "Password updated successfully",
            });
            setShowChangePasswordDialog(false);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } else {
            toast({
                title: "Error",
                description: data?.message || "Failed to update password",
                variant: "destructive",
            });
        }
    }

    return (
        <div className="p-4 lg:p-8">
            <Card className="max-w-4xl mx-auto rounded-3xl border-gray-100 shadow-2xl bg-white overflow-hidden">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 h-32 relative">
                    <div className="absolute -bottom-12 left-12">
                        <div className="w-24 h-24 rounded-3xl border-4 border-white overflow-hidden bg-gray-100 shadow-lg">
                            {image ? (
                                <img src={image} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-black text-indigo-200 uppercase">
                                    {userName?.[0] || 'I'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-16 px-8 pb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Instructor Profile</h2>
                            <p className="text-gray-500 font-medium">Update your public profile and mentorship details</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
                                    <User className="h-3 w-3" /> Name
                                </Label>
                                <Input
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="Instructor Name"
                                    className="h-12 rounded-xl border-gray-100 focus:bg-white transition-all bg-gray-50/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
                                    <ImageIcon className="h-3 w-3" /> Profile Image URL
                                </Label>
                                <Input
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    placeholder="https://example.com/avatar.jpg"
                                    className="h-12 rounded-xl border-gray-100 focus:bg-white transition-all bg-gray-50/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
                                    <Briefcase className="h-3 w-3" /> Profession / Title
                                </Label>
                                <Input
                                    value={profession}
                                    onChange={(e) => setProfession(e.target.value)}
                                    placeholder="Senior Software Engineer..."
                                    className="h-12 rounded-xl border-gray-100 focus:bg-white transition-all bg-gray-50/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
                                    <Award className="h-3 w-3" /> Experience
                                </Label>
                                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                                    <SelectTrigger className="h-12 rounded-xl border-gray-100 bg-gray-50/50">
                                        <SelectValue placeholder="Years of Experience" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="beginner">1-3 Years</SelectItem>
                                        <SelectItem value="intermediate">3-5 Years</SelectItem>
                                        <SelectItem value="advanced">5+ Years</SelectItem>
                                        <SelectItem value="expert">10+ Years</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
                                <Target className="h-3 w-3" /> Specializations (comma separated)
                            </Label>
                            <Textarea
                                value={learningGoals}
                                onChange={(e) => setLearningGoals(e.target.value)}
                                placeholder="e.g. React Architecture, System Design, AI Integration..."
                                className="min-h-[80px] rounded-xl border-gray-100 focus:bg-white transition-all bg-gray-50/50 resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
                                <Heart className="h-3 w-3" /> Skills / Tech Stack (comma separated)
                            </Label>
                            <Textarea
                                value={interests}
                                onChange={(e) => setInterests(e.target.value)}
                                placeholder="Javascript, Python, Docker, AWS..."
                                className="min-h-[80px] rounded-xl border-gray-100 focus:bg-white transition-all bg-gray-50/50 resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none pl-1">
                                Instructor Bio
                            </Label>
                            <Textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Share your journey and mentorship style..."
                                className="min-h-[120px] rounded-xl border-gray-100 focus:bg-white transition-all bg-gray-50/50 resize-none"
                            />
                        </div>

                        <div className="pt-4 flex flex-col md:flex-row gap-4">
                            <Button
                                onClick={handleUpdateProfile}
                                className="flex-1 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl shadow-xl shadow-indigo-100"
                            >
                                Save Changes
                            </Button>

                            <Dialog open={showChangePasswordDialog} onOpenChange={setShowChangePasswordDialog}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-14 rounded-2xl border-2 border-indigo-100 hover:bg-indigo-50 text-indigo-600 font-black text-xl"
                                    >
                                        <Lock className="mr-2 h-5 w-5" /> Change Password
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md rounded-3xl border-0 shadow-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black text-gray-900 flex items-center gap-2">
                                            <ShieldCheck className="text-indigo-600" /> Update Password
                                        </DialogTitle>
                                        <DialogDescription className="font-medium text-gray-500">
                                            Keep your account secure.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-6 py-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Current Password</Label>
                                            <Input
                                                type="password"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                className="h-12 rounded-xl border-gray-100 bg-gray-50/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">New Password</Label>
                                            <Input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="h-12 rounded-xl border-gray-100 bg-gray-50/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Confirm New Password</Label>
                                            <Input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="h-12 rounded-xl border-gray-100 bg-gray-50/50"
                                            />
                                        </div>
                                        <Button
                                            onClick={handleChangePassword}
                                            className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black transition-all"
                                        >
                                            Update Password
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default InstructorProfile;
