import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, ShieldCheck, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { setCredentialsService } from "@/services";
import { useToast } from "@/hooks/use-toast";

function SetCredentialsPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    async function handleSubmit(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await setCredentialsService({ token, password });
            if (response.success) {
                toast({
                    title: "Account Ready!",
                    description: "You can now log in with your new password.",
                });
                navigate("/auth");
            } else {
                toast({
                    title: "Error",
                    description: response.message || "Failed to set password",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "An unexpected error occurred.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
                    <CardHeader className="pt-12 pb-6 text-center space-y-4">
                        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-200 group hover:rotate-6 transition-transform">
                            <ShieldCheck className="text-white h-8 w-8" />
                        </div>
                        <div>
                            <CardTitle className="text-3xl font-black text-gray-900 tracking-tight">Set Your Credentials</CardTitle>
                            <p className="text-gray-500 font-medium mt-2 px-8 leading-relaxed">
                                Welcome to the professional team! Please secure your account by setting a strong password.
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 lg:p-10 pt-4">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">New Password</Label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all text-lg"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Confirm Password</Label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all text-lg"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isSubmitting || !password || password !== confirmPassword}
                                className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xl shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-1 mt-4 group"
                            >
                                {isSubmitting ? "Processing..." : (
                                    <div className="flex items-center justify-center gap-2">
                                        Activate Account
                                        <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
                            <GraduationCap className="h-6 w-6 text-gray-200 mx-auto mb-2" />
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Platform Professional Access</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default SetCredentialsPage;
