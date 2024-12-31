import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useChangePasswordMutation } from '../redux/slices/api/userApiSlice';

const ChangePasswordDialog = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [changeUserPassword, {isLoading}] = useChangePasswordMutation();

    const resetForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        try {

            const res = await changeUserPassword({newPassword, currentPassword}).unwrap();
            console.log(res);
            toast.success(res.message);
            setOpen(false);
            resetForm();
        } catch (err) {
            console.log(err);
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center w-full px-2 py-1.5 cursor-pointer">
                    <Lock className="mr-2 h-4 w-4" />
                    <span>Change Password</span>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <Card className="border-0 shadow-none">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="w-5 h-5" />
                            Change Password
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Current Password</label>
                                <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full"/>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">New Password</label>
                                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Confirm New Password</label>
                                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full"/>
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                        </form>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSubmit} className="w-full">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update Password"}
                        </Button>
                    </CardFooter>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

export default ChangePasswordDialog;