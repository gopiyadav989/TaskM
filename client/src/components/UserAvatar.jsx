import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Settings, Lock, LogOut } from "lucide-react";
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useLogoutMutation } from '../redux/slices/api/authApiSlice';
import { useNavigate } from 'react-router-dom';
import { getInitials } from '../utils/index';
import ChangePasswordDialog from './ChangePasswordDialog';
import UserForm from './users/UserForm';

const UserAvatarMenu = () => {
  const { user } = useSelector((state) => state.auth);
  const [logoutUser] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      navigate("/");
      toast.success("Logged out successfully");
    }
    catch (error) {
      toast.error("Logout failed");
      console.log(error)
    }
  };

  const handleEdit = (data) => {
    // if (data._id) {
    //   dispatch(setCredentials(data));
    // }
    setDialogOpen(false);
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setDialogOpen(true)}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <ChangePasswordDialog />
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit User
            </DialogTitle>
            <DialogDescription>
              Update user details.
            </DialogDescription>
          </DialogHeader>
          <UserForm user={user} onSubmit={handleEdit} onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>


    </div>

  );
};

export default UserAvatarMenu;