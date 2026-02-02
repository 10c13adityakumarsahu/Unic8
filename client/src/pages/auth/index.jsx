import CommonForm from "@/components/common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { GraduationCap, ShieldCheck, ArrowRight, Fingerprint, KeyRound, Mail, Lock as LockIcon, ChevronLeft } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { forgotPasswordService, resetPasswordService } from "@/services";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  // Forgot Password State
  const [forgotPasswordStep, setForgotPasswordStep] = useState("none"); // none, request, reset
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordOTP, setForgotPasswordOTP] = useState("");
  const [forgotPasswordNewPassword, setForgotPasswordNewPassword] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
    handleVerifyOTP,
  } = useContext(AuthContext);

  const { toast } = useToast();

  function handleTabChange(value) {
    setActiveTab(value);
  }

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== "" &&
      signUpFormData.phoneNumber !== "" &&
      signUpFormData.role !== ""
    );
  }

  async function onRegister(event) {
    event.preventDefault();
    const data = await handleRegisterUser(event);
    if (data?.success) {
      toast({
        title: "Registration Success",
        description: data.message,
      });
      setShowOtpScreen(true);
    } else {
      toast({
        title: "Registration Failed",
        description: data?.message || "Something went wrong",
        variant: "destructive"
      });
    }
  }

  async function onVerifyOTP() {
    setOtpLoading(true);
    const data = await handleVerifyOTP({
      userEmail: signUpFormData.userEmail,
      otp: otpValue
    });

    if (data?.success) {
      toast({
        title: "Account Verified",
        description: data.message,
      });
      setShowOtpScreen(false);
      setActiveTab("signin");
      setOtpValue("");
    } else {
      toast({
        title: "Verification Failed",
        description: data?.message || "Invalid OTP",
        variant: "destructive"
      });
    }
    setOtpLoading(false);
  }

  async function handleForgotPasswordRequest() {
    setForgotPasswordLoading(true);
    const data = await forgotPasswordService({ userEmail: forgotPasswordEmail });
    if (data?.success) {
      toast({
        title: "OTP Sent",
        description: data.message,
      });
      setForgotPasswordStep("reset");
    } else {
      toast({
        title: "Error",
        description: data?.message || "Failed to send OTP",
        variant: "destructive",
      });
    }
    setForgotPasswordLoading(false);
  }

  async function handleResetPassword() {
    setForgotPasswordLoading(true);
    const data = await resetPasswordService({
      userEmail: forgotPasswordEmail,
      otp: forgotPasswordOTP,
      newPassword: forgotPasswordNewPassword,
    });
    if (data?.success) {
      toast({
        title: "Success",
        description: data.message,
      });
      setForgotPasswordStep("none");
      setForgotPasswordEmail("");
      setForgotPasswordOTP("");
      setForgotPasswordNewPassword("");
      setActiveTab("signin");
    } else {
      toast({
        title: "Error",
        description: data?.message || "Failed to reset password",
        variant: "destructive",
      });
    }
    setForgotPasswordLoading(false);
  }

  async function onLogin(event) {
    event.preventDefault();
    const data = await handleLoginUser(event);
    if (data?.success) {
      toast({
        title: "Welcome Back!",
        description: data.message,
      });
    } else {
      toast({
        title: "Login Failed",
        description: data?.message || "Invalid credentials",
        variant: "destructive",
      });
      if (data?.message?.toLowerCase().includes("verify")) {
        setSignUpFormData({ ...signUpFormData, userEmail: signInFormData.userEmail });
        setShowOtpScreen(true);
      }
    }
  }

  if (showOtpScreen) {
    return (
      <div className="flex flex-col min-h-screen bg-white items-center justify-center p-6">
        <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="pt-12 pb-6 text-center space-y-4">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-100 animate-pulse">
              <ShieldCheck className="text-white h-10 w-10" />
            </div>
            <div>
              <CardTitle className="text-3xl font-black text-gray-900 tracking-tight">Verify Your Account</CardTitle>
              <p className="text-gray-500 font-medium mt-2 px-8 leading-relaxed">
                Check the <span className="text-indigo-600 font-black underline underline-offset-4 decoration-indigo-200">success notification</span> at the bottom of your screen or your terminal for the code.
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-8 lg:p-10 pt-4">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">6-Digit Verification Code</Label>
                <div className="relative group">
                  <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors h-5 w-5" />
                  <Input
                    type="text"
                    maxLength={6}
                    placeholder="0 0 0 0 0 0"
                    className="h-16 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all text-center text-3xl font-black tracking-[0.5em] pl-12"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={onVerifyOTP}
                disabled={otpLoading || otpValue.length !== 6}
                className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xl shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-1 group"
              >
                {otpLoading ? "Verifying..." : (
                  <div className="flex items-center gap-2">
                    Complete Verification
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={() => setShowOtpScreen(false)}
                className="w-full h-12 rounded-xl text-gray-400 font-bold hover:text-gray-900"
              >
                Back to Registration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col lg:flex-row min-h-screen bg-white">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white px-12">
          <div className="max-w-md space-y-6 text-center">
            <GraduationCap className="h-20 w-20 mx-auto text-white shadow-2xl" />
            <h1 className="text-6xl font-black tracking-tighter">
              UNIC8
            </h1>
            <p className="text-xl text-indigo-100 font-medium leading-relaxed">
              Unlock your potential with our cutting-edge learning management system.
              Join thousands of students achieving their goals today.
            </p>
            {/* Removed stats cards as requested */}
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="flex flex-1 items-center justify-center p-8 lg:p-12 bg-gray-50">
          <div className="w-full max-w-md space-y-8">
            {forgotPasswordStep === "none" ? (
              <>
                <div className="text-center lg:text-left">
                  <div className="flex justify-center lg:justify-start items-center gap-3 mb-6">
                    <GraduationCap className="h-10 w-10 text-indigo-600 lg:hidden" />
                    <h2 className="text-4xl font-black tracking-tight text-gray-900">
                      {activeTab === "signin" ? "Welcome back" : "Get started"}
                    </h2>
                  </div>
                  <p className="text-lg text-gray-500 font-medium tracking-tight">
                    {activeTab === "signin"
                      ? "Sign in to continue your learning journey"
                      : "Create your account and start learning"}
                  </p>
                </div>

                <Tabs
                  value={activeTab}
                  defaultValue="signin"
                  onValueChange={handleTabChange}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-8 h-14 rounded-2xl bg-gray-200/50 p-1.5 backdrop-blur-sm">
                    <TabsTrigger
                      value="signin"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-lg font-black transition-all text-sm uppercase tracking-widest"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="signup"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-lg font-black transition-all text-sm uppercase tracking-widest"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="space-y-4 outline-none">
                    <Card className="border-0 shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white px-2">
                      <CardContent className="p-8 space-y-4">
                        <CommonForm
                          formControls={signInFormControls}
                          buttonText={"Sign In"}
                          formData={signInFormData}
                          setFormData={setSignInFormData}
                          isButtonDisabled={!checkIfSignInFormIsValid()}
                          handleSubmit={onLogin}
                        />
                        <div className="text-center mt-4">
                          <button
                            onClick={() => setForgotPasswordStep('request')}
                            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                          >
                            Forgot Password?
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4 outline-none">
                    <Card className="border-0 shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white px-2">
                      <CardContent className="p-8 space-y-4">
                        <CommonForm
                          formControls={signUpFormControls}
                          buttonText={"Create Account"}
                          formData={signUpFormData}
                          setFormData={setSignUpFormData}
                          isButtonDisabled={!checkIfSignUpFormIsValid()}
                          handleSubmit={onRegister}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <div className="text-center pt-8">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    Secure platform by UNIC8 Engineering
                  </p>
                </div>
              </>
            ) : forgotPasswordStep === "request" ? (
              <Card className="border-0 shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white">
                <CardHeader className="p-8 pb-4">
                  <button
                    onClick={() => setForgotPasswordStep('none')}
                    className="flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors mb-4"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back to Login
                  </button>
                  <CardTitle className="text-3xl font-black text-gray-900 tracking-tight">Forgot Password?</CardTitle>
                  <CardDescription className="text-gray-500 font-medium">
                    Enter your email address and we'll send you an OTP to reset your password.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50/50"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleForgotPasswordRequest}
                    disabled={!forgotPasswordEmail || forgotPasswordLoading}
                    className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-100 transition-all"
                  >
                    {forgotPasswordLoading ? "Sending..." : "Send Reset OTP"}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-3xl font-black text-gray-900 tracking-tight">Reset Password</CardTitle>
                  <CardDescription className="text-gray-500 font-medium">
                    Enter the OTP sent to your terminal and choose a new password.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Reset OTP</Label>
                    <div className="relative">
                      <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        maxLength={6}
                        placeholder="######"
                        value={forgotPasswordOTP}
                        onChange={(e) => setForgotPasswordOTP(e.target.value)}
                        className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50/50 tracking-[0.5em] font-black"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">New Password</Label>
                    <div className="relative">
                      <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={forgotPasswordNewPassword}
                        onChange={(e) => setForgotPasswordNewPassword(e.target.value)}
                        className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50/50"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleResetPassword}
                    disabled={!forgotPasswordOTP || !forgotPasswordNewPassword || forgotPasswordLoading}
                    className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-100 transition-all"
                  >
                    {forgotPasswordLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                  <button
                    onClick={() => setForgotPasswordStep('request')}
                    className="w-full text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors text-center"
                  >
                    Didn't get the code? Resend
                  </button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
