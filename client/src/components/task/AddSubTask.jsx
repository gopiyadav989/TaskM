import React, { useState } from "react";
import { ListPlus, Tag as TagIcon, Calendar } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useCreateSubTaskMutation } from "../../redux/slices/api/taskApiSlice";

const AddSubTask = ({ open, setOpen, id }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    tag: ""
  });

  const [errors, setErrors] = useState({
    title: "",
    date: "",
    tag: ""
  });

  const [addSbTask] = useCreateSubTaskMutation();

  const validateForm = () => {
    const newErrors = {
      title: "",
      date: "",
      tag: ""
    };

    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!formData.tag.trim()) {
      newErrors.tag = "Tag is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const res = await addSbTask({ data: formData, id }).unwrap();
      toast.success(res.message);
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <ListPlus className="h-6 w-6" />
            Add Sub-Task
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <div className="relative">
                <Input id="title" name="title" placeholder="Enter sub-task title" value={formData.title} onChange={handleChange} className={`pl-8 ${errors.title ? 'border-red-500' : ''}`} />
                <ListPlus className="h-4 w-4 absolute left-2.5 top-3 text-gray-500" />
              </div>
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="space-y-2">
                <Label htmlFor="date">Due Date</Label>
                <div className="relative">
                  <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} className={`pl-8 ${errors.date ? 'border-red-500' : ''}`}/>
                  <Calendar className="h-4 w-4 absolute left-2.5 top-3 text-gray-500" />
                </div>
                {errors.date && (
                  <p className="text-sm text-red-500 mt-1">{errors.date}</p>
                )}
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-2">
                <Label htmlFor="tag">Tag</Label>
                <div className="relative">
                  <Input id="tag" name="tag" placeholder="Enter tag" value={formData.tag} onChange={handleChange} className={`pl-8 ${errors.tag ? 'border-red-500' : ''}`} />
                  <TagIcon className="h-4 w-4 absolute left-2.5 top-3 text-gray-500" />
                </div>
                {errors.tag && (
                  <p className="text-sm text-red-500 mt-1">{errors.tag}</p>
                )}
              </div>
            </Card>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="submit">
              Add Sub-Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubTask;