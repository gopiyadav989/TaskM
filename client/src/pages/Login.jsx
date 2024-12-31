import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../redux/slices/api/authApiSlice';
import { toast } from 'sonner';
import { setCredentials } from '../redux/slices/authSlice';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      return setErrors(prev => ({ ...prev, email: 'Email is required' }));
    }
    if (!formData.password.trim()) {
      return setErrors(prev => ({ ...prev, password: 'Password is required' }));
    }

    try{

      const res = await login(formData).unwrap();
      dispatch(setCredentials(res));
      console.log(res);
      toast.success("Logged in successfully");
      navigate("/dashboard");
      
    }
    catch(error){
      console.log(error);
      toast.error(error?.data?.message || error.error);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-600 flex items-center justify-center p-4">
      {/* Gradient Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <div className="container relative z-10 max-w-6xl flex flex-col lg:flex-row items-center gap-12">
        {/* Left Side - Branding */}
        <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
          <div className="inline-block px-4 py-1.5 rounded-full border border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm">
            <span className="bg-gradient-to-r from-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Manage all your tasks in one place
            </span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-50 to-zinc-900">
              Cloud-Based
              <br />
              Task Manager
            </h1>
            <p className="text-zinc-400 text-lg max-w-md">
              Streamline your workflow and boost productivity with our modern task management solution.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 max-w-md">
          <Card className="backdrop-blur-md bg-zinc-900/50 border-zinc-800/50">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r 
                from-zinc-200 to-white bg-clip-text text-transparent">
                Welcome back!
              </CardTitle>
              <CardDescription className="text-zinc-400 text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-200">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-zinc-800/50 border-zinc-700 text-zinc-200 
                      placeholder:text-zinc-500 focus:ring-zinc-500"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-zinc-200">
                    Password
                  </Label>
                  <Input id="password" name="password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} className="bg-zinc-800/50 border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus:ring-zinc-500"/>
                  {errors.password && (
                    <p className="text-red-400 text-sm">{errors.password}</p>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" className="border-zinc-700 data-[state=checked]:bg-zinc-700" />
                    <Label htmlFor="remember" className="text-sm text-zinc-400">
                      Remember me
                    </Label>
                  </div>
                  <Button variant="link" className="text-zinc-400 hover:text-zinc-200 p-0">
                    Forgot password?
                  </Button>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-zinc-200 to-zinc-400 hover:from-white hover:to-zinc-300 text-zinc-900">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;