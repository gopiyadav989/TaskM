import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  ThumbsUp,
  User,
  Bug,
  CheckCircle2,
  Timer,
  Calendar,
  Plus,
  PlusCircle
} from 'lucide-react';
import moment from 'moment';
import { usePostTrackActivityMutation } from '../../redux/slices/api/taskApiSlice';
import { toast } from 'sonner';

const TASKTYPEICON = {
  commented: (
    <div className='w-12 h-12 rounded-full bg-gray-500/10 flex items-center justify-center text-gray-500 hover:bg-gray-500/20 transition-colors'>
      <MessageSquare className="w-6 h-6" />
    </div>
  ),
  started: (
    <div className='w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 hover:bg-blue-500/20 transition-colors'>
      <ThumbsUp className="w-6 h-6" />
    </div>
  ),
  assigned: (
    <div className='w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 hover:bg-orange-500/20 transition-colors'>
      <User className="w-6 h-6" />
    </div>
  ),
  bug: (
    <div className='w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500/20 transition-colors'>
      <Bug className="w-6 h-6" />
    </div>
  ),
  completed: (
    <div className='w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 hover:bg-green-500/20 transition-colors'>
      <CheckCircle2 className="w-6 h-6" />
    </div>
  ),
  "in progress": (
    <div className='w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 hover:bg-purple-500/20 transition-colors'>
      <Timer className="w-6 h-6" />
    </div>
  ),
};

const getBadgeVariant = (type) => {
  const variants = {
    commented: 'secondary',
    started: 'default',
    assigned: 'warning',
    bug: 'destructive',
    completed: 'success',
    'in progress': 'purple'
  };
  return variants[type] || 'default';
};

const act_types = [
  "assigned",
  "started",
  "in progress",
  "bug",
  "completed",
  "commented"
];



const ActivityCard = ({ item, isConnected }) => {
  return (
    <div className='flex space-x-4 relative group'>
      <div className='flex flex-col items-center flex-shrink-0'>
        <div className='transform transition-transform group-hover:scale-110'>
          {TASKTYPEICON[item?.type]}
        </div>
        {isConnected && (
          <div className='w-0.5 bg-gray-200 h-16 absolute top-12 left-6 group-hover:bg-gray-300 transition-colors' />
        )}
      </div>

      <div className='flex flex-col gap-y-2 mb-8 bg-gray-50 p-5 rounded-xl flex-grow border border-gray-100 hover:bg-gray-100/50 transition-colors'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <p className='font-semibold text-gray-900'>{item?.by?.name}</p>
            <Badge variant={getBadgeVariant(item?.type)} className='capitalize'>
              {item?.type}
            </Badge>
          </div>
          <div className='flex items-center gap-2 text-gray-500'>
            <Calendar className="w-4 h-4" />
            <span className='text-sm'>{moment(item?.date).fromNow()}</span>
          </div>
        </div>
        <p className='text-gray-700 leading-relaxed'>{item?.activity}</p>
      </div>
    </div>
  );
};

const Activities = ({ activity, id, refetch }) => {
  console.log(activity);
  const [open, setOpen] = useState(false);

  const AddActivityForm = ({ onClose }) => {
    const [selected, setSelected] = useState(act_types[0]);
    const [text, setText] = useState("");
    const [postActivity, { isLoading }] = usePostTrackActivityMutation();

    const handleSubmit = async () => {
      try {
        console.log(selected, text);
        await postActivity({
          data: {
            type: selected,
            activity: text
          },
          id
        }).unwrap();

        setText("");
        setSelected(act_types[0]);
        onClose();
        toast.success("Activity added successfully");
        refetch();
      }
      catch (error) {
        console.log(error);
        toast.error(error?.data?.message || error.error);
      }
    };

    return (
      <div className='space-y-6 '>
        <div className='space-y-4'>
          <Label className="text-base">Activity Type</Label>
          <RadioGroup value={selected} onValueChange={setSelected} className='grid grid-cols-2 gap-4'>
            {act_types.map((type) => (
              <div key={type} className='flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg transition-colors'>
                <RadioGroupItem value={type} id={type} />
                <Label htmlFor={type} className="cursor-pointer">{type}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className='space-y-4'>
          <Label className="text-base">Activity Details</Label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Describe the activity..." className='min-h-[150px] resize-none' />
        </div>

        <Button onClick={handleSubmit} disabled={isLoading} className='w-full h-12 text-base'>
          {isLoading ? (
            <Timer className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Adding Activity..." : "Add Activity"}
        </Button>
      </div>
    );
  };

  return (
    <div className='w-full max-w-7xl mx-auto p-6'>
      <Card className='shadow-lg'>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Activity Timeline</CardTitle>
            <CardDescription>Track all project activities and updates</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle>Add New Activity</DialogTitle>
                <DialogDescription>
                  Create a new activity update for the project timeline.
                </DialogDescription>
              </DialogHeader>
              <AddActivityForm onClose={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <ScrollArea className='h-[700px] pr-4'>
            {activity?.map((el, index) => (
              <ActivityCard
                key={index}
                item={el}
                isConnected={index < activity.length - 1}
              />
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Activities;