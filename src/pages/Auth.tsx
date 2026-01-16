import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, Lock, Sparkles, Loader2, User, Briefcase, Calendar, Eye, EyeOff, Check, X } from 'lucide-react';

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [age, setAge] = useState('');
    const [job, setJob] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const navigate = useNavigate();

    // Password Validation
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber;
    const passwordsMatch = password === confirmPassword;

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSignUp) {
            if (!isPasswordValid) {
                toast.error('Password does not meet requirements');
                return;
            }
            if (!passwordsMatch) {
                toast.error('Passwords do not match');
                return;
            }
        }

        setLoading(true);
        console.log(`Starting ${isSignUp ? 'Sign Up' : 'Sign In'} for email: ${email}`);

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            age: age,
                            job_title: job,
                        }
                    }
                });
                if (error) throw error;
                console.log('Sign Up successful:', data);
                toast.success('Check your email for the confirmation link!');
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                console.log('Sign In successful:', data);
                toast.success('Successfully logged in!');
                navigate('/');
            }
        } catch (error: any) {
            console.error(`${isSignUp ? 'Sign Up' : 'Sign In'} failed:`, error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/30 blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/20 blur-[100px] animate-pulse delay-1000" />
                <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-pink-600/20 blur-[80px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md p-6"
            >
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden p-8">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                className="h-16 w-16 bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3"
                            >
                                <img src="/logo.jpg" alt="Logo" className="h-14 w-14 rounded-xl object-contain" />
                            </motion.div>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                            {isSignUp ? 'Join GlowLink' : 'Welcome back'}
                        </h2>
                        <p className="text-gray-400 text-sm">
                            {isSignUp
                                ? 'Create your premium bio link today'
                                : 'Enter your details to access your account'}
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleAuth}>
                        {isSignUp && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-gray-300 uppercase tracking-wider">Full Name</Label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                                        <Input
                                            type="text"
                                            required={isSignUp}
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="John Doe"
                                            className="bg-black/20 border-white/10 pl-10 text-white placeholder:text-gray-500 focus:border-cyan-400/50 focus:ring-cyan-500/20 transition-all h-10"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium text-gray-300 uppercase tracking-wider">Age</Label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                                            <Input
                                                type="number"
                                                required={isSignUp}
                                                value={age}
                                                onChange={(e) => setAge(e.target.value)}
                                                placeholder="25"
                                                className="bg-black/20 border-white/10 pl-10 text-white placeholder:text-gray-500 focus:border-cyan-400/50 focus:ring-cyan-500/20 transition-all h-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium text-gray-300 uppercase tracking-wider">Job Title</Label>
                                        <div className="relative group">
                                            <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                                            <Input
                                                type="text"
                                                required={isSignUp}
                                                value={job}
                                                onChange={(e) => setJob(e.target.value)}
                                                placeholder="Designer"
                                                className="bg-black/20 border-white/10 pl-10 text-white placeholder:text-gray-500 focus:border-cyan-400/50 focus:ring-cyan-500/20 transition-all h-10"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-gray-300 uppercase tracking-wider">Email</Label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                                <Input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="bg-black/20 border-white/10 pl-10 text-white placeholder:text-gray-500 focus:border-cyan-400/50 focus:ring-cyan-500/20 transition-all h-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-gray-300 uppercase tracking-wider">Password</Label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-black/20 border-white/10 pl-10 pr-10 text-white placeholder:text-gray-500 focus:border-purple-400/50 focus:ring-purple-500/20 transition-all h-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>

                            {/* Password Validation Indicators */}
                            {isSignUp && (
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div className={`text-[10px] flex items-center gap-1 ${hasMinLength ? 'text-green-400' : 'text-gray-500'}`}>
                                        {hasMinLength ? <Check className="h-3 w-3" /> : <div className="h-1 w-1 rounded-full bg-gray-600 ml-1 mr-1" />}
                                        8+ Characters
                                    </div>
                                    <div className={`text-[10px] flex items-center gap-1 ${hasUpperCase ? 'text-green-400' : 'text-gray-500'}`}>
                                        {hasUpperCase ? <Check className="h-3 w-3" /> : <div className="h-1 w-1 rounded-full bg-gray-600 ml-1 mr-1" />}
                                        Uppercase
                                    </div>
                                    <div className={`text-[10px] flex items-center gap-1 ${hasLowerCase ? 'text-green-400' : 'text-gray-500'}`}>
                                        {hasLowerCase ? <Check className="h-3 w-3" /> : <div className="h-1 w-1 rounded-full bg-gray-600 ml-1 mr-1" />}
                                        Lowercase
                                    </div>
                                    <div className={`text-[10px] flex items-center gap-1 ${hasNumber ? 'text-green-400' : 'text-gray-500'}`}>
                                        {hasNumber ? <Check className="h-3 w-3" /> : <div className="h-1 w-1 rounded-full bg-gray-600 ml-1 mr-1" />}
                                        Number
                                    </div>
                                </div>
                            )}
                        </div>

                        {isSignUp && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-2"
                            >
                                <Label className="text-xs font-medium text-gray-300 uppercase tracking-wider">Confirm Password</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required={isSignUp}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className={`bg-black/20 border-white/10 pl-10 pr-10 text-white placeholder:text-gray-500 focus:border-purple-400/50 focus:ring-purple-500/20 transition-all h-10 ${confirmPassword && !passwordsMatch ? 'border-red-500/50' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {confirmPassword && !passwordsMatch && (
                                    <p className="text-[10px] text-red-400 flex items-center gap-1">
                                        <X className="h-3 w-3" /> Passwords do not match
                                    </p>
                                )}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:opacity-90 transition-all duration-300 h-11 text-white font-medium border-0 shadow-lg shadow-purple-500/25 mt-4 group"
                            disabled={loading || (isSignUp && (!isPasswordValid || !passwordsMatch))}
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    {isSignUp ? 'Create Account' : 'Sign In'}
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <p className="text-sm text-gray-400 mb-3">
                            {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}
                        </p>
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setPassword('');
                                setConfirmPassword('');
                            }}
                            className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                            {isSignUp ? 'Sign in instead' : 'Create an account'}
                            <Sparkles className="h-3 w-3" />
                        </button>
                    </div>
                </div>

                <p className="text-center mt-8 text-xs text-gray-500">
                    &copy; {new Date().getFullYear()} GlowLink. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
}
