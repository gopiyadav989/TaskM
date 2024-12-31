import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ChevronUp,
  ChevronDown,
  ArrowUp,
  MessageSquare,
  Paperclip,
  ListTodo,
  MoreVertical,
  Clock,
  Users,
  FileText,
  Minus,
  Edit3,
  CopyCheck,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from '../utils';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import AddTask from '../components/task/AddTask';
import AddSubTask from '../components/task/AddSubTask';
import { useDuplicateTaskMutation, useTrashTaskMutation } from '../redux/slices/api/taskApiSlice';
import { toast } from 'sonner';

const BoardView = ({ tasks }) => {

  const navigate = useNavigate();

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
    todo: "bg-slate-500",
    "in-progress": "bg-blue-500",
    completed: "bg-green-500",
    blocked: "bg-red-500"
  };

  const formatDate = (date) => format(new Date(date), "MMM d, hh:mm a");
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [openSubTaskDialog, setOpenSubTaskDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [deleteTask] = useTrashTaskMutation();
  const [duplicateTask] = useDuplicateTaskMutation();

  const TaskDialog = ({ task }) => {
    const menuItems = [
      {
        label: "Open Task",
        icon: <FileText className="h-4 w-4" />,
        onClick: () => navigate(`/task/${task._id}`),
      },
      {
        label: "Edit",
        icon: <Edit3 className="h-4 w-4" />,
        onClick: () => {
          setSelectedTask(task);
          setOpenTaskDialog(true);
        }
      },
      {
        label: "Add Sub-Task",
        icon: <ListTodo className="h-4 w-4" />,
        onClick: () => {
          setOpenSubTaskDialog(true);
        }
      },
      {
        label: "Duplicate",
        icon: <CopyCheck className="h-4 w-4" />,
        onClick: () => duplicateHandler(),
      },
      {
        label: "Delete",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => deleteHandler(),
      },
    ];

    const deleteHandler = async () => {
      try {

        const res = await deleteTask({
          id: task._id,
          isTrashed: "trash",
        }).unwrap();

        toast.success(res?.message);
        window.location.reload();


      } catch (error) {
        console.log(error);
        toast.error(err?.data?.message || err.error);
      }
    };

    const duplicateHandler = async () => {
      try {
        const res = await duplicateTask(task._id).unwrap();

        toast.success(res?.message);

        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        console.log(error);
        toast.error(err?.data?.message || err.error);
      }
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {menuItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              onClick={item.onClick}
              className="flex items-center gap-2"
            >
              <span className="text-muted-foreground">{item.icon}</span>
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Card key={task._id} className="group hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="space-y-0 pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={PRIORITY_CONFIG[task.priority]?.badge}>
                  <div className="flex items-center gap-1.5">
                    {PRIORITY_CONFIG[task.priority]?.icon &&
                      React.createElement(PRIORITY_CONFIG[task.priority]?.icon, {
                        className: `h-3.5 w-3.5 ${PRIORITY_CONFIG[task.priority]?.class}`
                      })}
                    <span className="capitalize">{task.priority}</span>
                  </div>
                </Badge>
                <TaskDialog task={task} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${STATUS_CONFIG[task.stage]}`} />
                  <h3 className="font-semibold line-clamp-1">{task.title}</h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(task.date)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {task.activities?.length || 0}
                    </Button>
                  </HoverCardTrigger>
                  {task.activities?.length > 0 && <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      {task.activities?.map((activity) => (
                        <div key={activity._id} className="flex items-start gap-2 text-sm">
                          <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div>
                            <span className="font-medium">{activity.by.name}</span>
                            <span className="text-muted-foreground"> {activity.activity}</span>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(activity.date)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </HoverCardContent>}
                </HoverCard>

                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8">
                      <Paperclip className="h-4 w-4 mr-2" />
                      {task.assets?.length || 0}
                    </Button>
                  </HoverCardTrigger>
                  {task.assets?.length > 0 && <HoverCardContent className="w-80">
                    <div className="grid grid-cols-2 gap-2">
                      {task.assets?.map((asset, index) => (
                        <img key={index} src={asset} alt={`Asset ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
                      ))}
                    </div>
                  </HoverCardContent>}
                </HoverCard>

                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8">
                      <ListTodo className="h-4 w-4 mr-2" />
                      {task.subTask?.length || 0}
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      {task.subTask?.map((subtask) => (
                        <div key={subtask._id} className="space-y-1">
                          <h4 className="text-sm font-medium">{subtask.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(subtask.date)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>

              {task.subTasks?.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="space-y-2">
                    <h4 className="font-medium line-clamp-1">{task.subTasks[0].title}</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(task.subTasks[0].date)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8">
                      <Users className="h-4 w-4 mr-2" />
                      {task.team?.length || 0} Members
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      {task.team?.map((member) => (
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

                <Button variant="ghost" size="sm" className="h-8" onClick={() => { setSelectedTask(task); setOpenSubTaskDialog(true) }}>
                  Add Subtask
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddTask open={openTaskDialog} setOpen={setOpenTaskDialog} task={selectedTask} />
      <AddSubTask open={openSubTaskDialog} setOpen={setOpenSubTaskDialog} id={selectedTask?._id} />

    </div>
  );
};

export default BoardView;