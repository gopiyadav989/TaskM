import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronUp,
  ChevronDown,
  ArrowUp,
  Pencil,
  Trash2,
  Clock,
  MessageSquare,
  Paperclip,
  ListTodo,
  Tag,
  Users,
  Minus
} from 'lucide-react';
import { format } from 'date-fns';
import { getInitials } from '../../utils';
import { useTrashTaskMutation } from '../../redux/slices/api/taskApiSlice';
import { toast } from 'sonner';
import AddTask from './AddTask';


const PRIORITY_CONFIG = {
  high: {
    icon: ChevronUp,
    class: "text-red-500",
    badge: "bg-red-100 text-red-700 border-red-200"
  },
  medium: {
    icon: ArrowUp,
    class: "text-yellow-500",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-200"
  },
  low: {
    icon: ChevronDown,
    class: "text-blue-500",
    badge: "bg-blue-100 text-blue-700 border-blue-200"
  },
  normal: {
    icon: Minus,
    class: "text-gray-500",
    badge: "bg-gray-100 text-gray-700 border-gray-200"
  }
};

const STATUS_CONFIG = {
  todo: {
    color: "bg-slate-500",
    badge: "bg-slate-100 text-slate-700 border-slate-200"
  },
  "in progress": {
    color: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700 border-blue-200"
  },
  completed: {
    color: "bg-green-500",
    badge: "bg-green-100 text-green-700 border-green-200"
  }
};


const ListView = ({ tasks = [] }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteTask] = useTrashTaskMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatDate = (date) => format(new Date(date), "MMM d, hh:mm a");

  const handleDeleteClick = (task) => {
    setSelectedTask(task);
    setOpenDialog(true);
  };

  const handleDelete = async() => {
    console.log(selectedTask);
    try {
      const res = await deleteTask({
        id: selectedTask._id,
        isTrashed: "trash",
      }).unwrap();

      toast.success(res?.message);
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error);
    }
    setOpenDialog(false);
    setSelectedTask(null);
  };


  const TaskTeamPreview = ({ team }) => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8">
          <Users className="h-4 w-4 mr-2" />
          {team?.length || 0} Members
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          {team?.map((member) => (
            <div key={member._id} className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{member.name}</span>
                <span className="text-xs text-muted-foreground">{member.title}</span>
              </div>
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );

  const TaskAssets = ({ assets }) => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8">
          <Paperclip className="h-4 w-4 mr-2" />
          {assets?.length || 0} Files
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="grid grid-cols-2 gap-2">
          {assets?.map((asset, index) => (
            <img
              key={index}
              src={asset}
              alt={`Asset ${index + 1}`}
              className="w-full h-24 object-cover rounded-md"
            />
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );

  const SubTasksPreview = ({ subTasks }) => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8">
          <ListTodo className="h-4 w-4 mr-2" />
          {subTasks?.length || 0} Subtasks
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          {subTasks?.map((task) => (
            <div key={task._id} className="flex items-center gap-2">
              <Badge variant="outline">{task.tag}</Badge>
              <span className="text-sm">{task.title}</span>
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );

  const ActivitiesPreview = ({ activities }) => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8">
          <MessageSquare className="h-4 w-4 mr-2" />
          {activities?.length || 0} Activities
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Recent Activities</h4>
          {activities?.map((activity) => (
            <div key={activity._id} className="flex items-start gap-2 text-sm">
              {activity.type === 'started' && <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />}
              {activity.type === 'commented' && <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />}
              {activity.type === 'completed' && <ListTodo className="h-4 w-4 mt-0.5 text-muted-foreground" />}
              <div>
                <span className="font-medium">{activity.by.name}</span>
                <span className="text-muted-foreground"> {activity.activity}</span>
                <p className="text-xs text-muted-foreground">
                  {formatDate(activity?.date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold">Tasks</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {tasks.length} active tasks
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <ListTodo className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
              <p className="text-sm text-gray-500">Create a new task to get started</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead >Task Details</TableHead>
                    <TableHead>Team & Progress</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task._id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{task.title}</div>
                          {task.subTasks?.length > 0 && (
                            <SubTasksPreview subTasks={task.subTasks} />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <TaskTeamPreview team={task.team} />
                          {task.assets?.length > 0 && (
                            <TaskAssets assets={task.assets} />
                          )}
                          {task.activities?.length > 0 && (
                            <ActivitiesPreview activities={task.activities} />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={PRIORITY_CONFIG[task.priority]?.badge}>
                          <div className="flex items-center gap-1.5">
                            {PRIORITY_CONFIG[task.priority]?.icon && React.createElement(PRIORITY_CONFIG[task.priority].icon, {
                              className: `h-3.5 w-3.5 ${PRIORITY_CONFIG[task.priority].class}`
                            })}
                            <span className="capitalize">{task.priority}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${STATUS_CONFIG[task.stage]?.badge}`}>
                          {task.stage}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(task.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" onClick={() => {
                                  setIsDialogOpen(true);
                                  setSelectedTask(task);
                                }}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit Task</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteClick(task)} >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Task</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      <AddTask open={isDialogOpen} task={selectedTask} setOpen={setIsDialogOpen} />
    </div>
  );
};

export default ListView;