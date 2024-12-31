import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateUserMutation, useRegisterMutation } from "../../redux/slices/api/userApiSlice";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";

const User = ({ user, onSubmit, onCancel }) => {
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [addNewUser, { isLoading }] = useRegisterMutation();
  const [formData, setFormData] = useState(user ? { ...user } : {
    name: '',
    title: '',
    email: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { user: presentUser } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validate()) {
        const res = user
          ? await updateUser(formData).unwrap()
          : await addNewUser({ ...formData, password: formData.email }).unwrap();

        if (res.user._id === presentUser._id) {
          dispatch(setCredentials(res.user));
        }

        toast.success(res.message);
        onSubmit(formData);
      }
    }
    catch (error) {
      console.log(error);
      toast.error(`${user ? "Updated User" : "Adding New User"} failed`);
    }

  };




  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" value={formData.name} onChange={handleChange} />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={formData.title} onChange={handleChange} />
        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={formData.email} onChange={handleChange} />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input id="role" value={formData.role} onChange={handleChange} />
        {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {user ? "Update User" : "Add User"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default User;
