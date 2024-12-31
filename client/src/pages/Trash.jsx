import React, { useEffect, useState } from 'react';
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
} from "@/components/ui/hover-card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  Users,
  Paperclip,
  ListTodo,
  Minus,
  Loader2
} from 'lucide-react';

import { useDeleteRestoreTaskMutation, useGetAllTaskQuery } from '../redux/slices/api/taskApiSlice';
import { toast } from 'sonner';

const PRIORITY_ICONS = {
  high: <ChevronUp className="h-4 w-4" />,
  medium: <ArrowUp className="h-4 w-4" />,
  low: <ArrowDown className="h-4 w-4" />,
  normal: <Minus className="h-4 w-4" />
};

const PRIORITY_STYLES = {
  high: "text-red-500",
  medium: "text-yellow-500",
  low: "text-green-500"
};

const STATUS_STYLES = {
  todo: "bg-slate-500",
  "in-progress": "bg-blue-500",
  completed: "bg-green-500",
  blocked: "bg-red-500"
};

const TaskTeamPreview = ({ team }) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <Button variant="ghost" size="sm" className="h-8">
        <Users className="h-4 w-4 mr-2" />
        {team.length} Members
      </Button>
    </HoverCardTrigger>
    <HoverCardContent className="w-80">
      <div className="space-y-2">
        {team.map((member) => (
          <div key={member._id} className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{member.name}</span>
              <span className="text-xs text-gray-500">{member.title}</span>
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
        {assets.length} Files
      </Button>
    </HoverCardTrigger>
    <HoverCardContent className="w-80">
      <div className="grid grid-cols-2 gap-2">
        {assets.map((asset, index) => (
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
        {subTasks?.length} Subtasks
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

const TrashedTasks = () => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    description: '',
    action: () => { },
    type: 'delete'
  });

  const [tasks, setTasks] = useState([]);
  const { data, isLoading, refetch } = useGetAllTaskQuery({
    strQuery: "",
    isTrashed: "true",
    search: ""
  });
  const [deleteRestore] = useDeleteRestoreTaskMutation();


  useEffect(() => {
    if (data?.tasks) {
      setTasks(data.tasks);
    }
  }, [data]);

  const handleDelete = async (id) => {
    setAlertConfig({
      title: 'Delete Task',
      description: 'Are you sure you want to permanently delete this task? This action cannot be undone.',
      action: async () => {
        try {
          const res = await deleteRestore({ id, actionType: 'delete' }).unwrap();
          setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
          toast.success(res?.message);
        } catch (error) {
          toast(error?.data?.message || error.error);
          console.error('Failed to delete task:', error);
        }
      },
      type: 'delete'
    });
    setAlertOpen(true);
  };

  const handleRestore = async (id) => {
    setAlertConfig({
      title: 'Restore Task',
      description: 'Are you sure you want to restore this task?',
      action: async () => {
        try {
          const res = await deleteRestore({ id, actionType: 'restore' }).unwrap();
          toast.success(res?.message);
          setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
        } catch (error) {
          toast(error?.data?.message || error.error);
          console.error('Failed to restore task:', error);
        }
      },
      type: 'restore'
    });
    setAlertOpen(true);
  };

  const handleDeleteAll = () => {
    setAlertConfig({
      title: 'Delete All Tasks',
      description: 'Are you sure you want to permanently delete all trashed tasks? This action cannot be undone.',
      action: async () => {
        try {
          const res = await deleteRestore({ actionType: 'deleteAll' }).unwrap();
          setTasks([]);
          toast.success(res?.message);
        } catch (error) {
          toast(error?.data?.message || error.error);
          console.error('Failed to delete all tasks:', error);
        }
      },
      type: 'deleteAll'
    });
    setAlertOpen(true);
  };

  const handleRestoreAll = () => {
    setAlertConfig({
      title: 'Restore All Tasks',
      description: 'Are you sure you want to restore all trashed tasks?',
      action: async () => {
        try {
          const res = await deleteRestore({ actionType: 'restoreAll' }).unwrap();
          setTasks([]);
          toast.success(res?.message);
        } catch (error) {
          toast(error?.data?.message || error.error);
          console.error('Failed to restore all tasks:', error);
        }
      },
      type: 'restoreAll'
    });
    setAlertOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Loading Task</p>
      </div>
    );
  }


  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold">Trashed Tasks</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {tasks.length} tasks in trash
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleRestoreAll} disabled={tasks.length === 0} >
              <RotateCcw className="h-4 w-4" />
              Restore All
            </Button>
            <Button variant="destructive" size="sm" className="flex items-center gap-2" onClick={handleDeleteAll} disabled={tasks.length === 0} >
              <Trash2 className="h-4 w-4" />
              Delete All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <Trash2 className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No tasks in trash</h3>
              <p className="text-sm text-gray-500">Deleted tasks will appear here</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Task Details</TableHead>
                    <TableHead>Team & Assets</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Modified On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task._id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{task.title}</div>
                          {task.subTask.length > 0 && (
                            <SubTasksPreview subTasks={task.subTasks} />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <TaskTeamPreview team={task.team} />
                          {task.assets.length > 0 && (
                            <TaskAssets assets={task.assets} />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className={PRIORITY_STYLES[task.priority]}>
                            {PRIORITY_ICONS[task.priority]}
                          </span>
                          <span className="capitalize">{task.priority}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${STATUS_STYLES[task.stage]} text-white`}>
                          {task.stage}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(task.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleRestore(task._id)}>
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(task._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertConfig.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className={alertConfig.type.includes('delete') ? 'bg-red-500 hover:bg-red-600' : ''} onClick={() => {
              alertConfig.action();
              setAlertOpen(false);
            }}>
              {alertConfig.type.includes('delete') ? 'Delete' : 'Restore'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TrashedTasks;