import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle,
    Image as ImageIcon,
    ListTodo,
    Mail,
    Calendar,
    ExternalLink,
    MessageSquare,
    Users,
    Clock
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AddSubTask from '../task/AddSubTask';

const getInitials = (name) => {
    return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();
};

const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(new Date(date));
};

const Details = ({ task }) => {
    const [openSubTaskDialog, setOpenSubTaskDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">

                {/* Metrics Card */}
                <Card>
                    <CardHeader >
                        <CardTitle className="text-lg font-semibold text-slate-800">Task Overview</CardTitle>
                        <CardDescription>Key metrics and progress</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-around py-8">
                        <div className="text-center group cursor-pointer">
                            <div className="bg-white w-24 p-4 rounded-xl shadow-md mb-3 group-hover:shadow-lg transition-all duration-300">
                                <div className="bg-primary/10 p-2 rounded-lg mb-2 group-hover:bg-primary/20 ">
                                    <ImageIcon className="w-6 h-6 text-primary mx-auto" />
                                </div>
                                <p className="text-3xl font-bold text-primary">{task.assets?.length}</p>
                            </div>
                            <p className="text-sm text-gray-600 font-medium">Total Assets</p>
                        </div>
                        <Separator orientation="vertical" className="h-32" />
                        <div className="text-center group cursor-pointer">
                            <div className="bg-white w-24 p-4 rounded-xl shadow-md mb-3 group-hover:shadow-lg transition-all duration-300">
                                <div className="bg-primary/10 p-2 rounded-lg mb-2 group-hover:bg-primary/20 ">
                                    <ListTodo className="w-6 h-6 text-primary mx-auto" />
                                </div>
                                <p className="text-3xl font-bold text-primary">{task.subTask?.length}</p>
                            </div>
                            <p className="text-sm text-gray-600 font-medium">Active Sub-tasks</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Team Members Card */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-800">Team Members</CardTitle>
                                <CardDescription>Project contributors and roles</CardDescription>
                            </div>
                            <Badge variant="secondary" className="px-3">
                                <Users className="w-4 h-4 mr-1" />
                                {task.team?.length} Members
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {task.team?.map((member, index) => (
                            <TooltipProvider key={index}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all duration-300 group cursor-pointer border border-transparent hover:border-slate-200">
                                            <Avatar className="h-12 w-12 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
                                                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                                                    {getInitials(member.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-800 group-hover:text-primary transition-colors">
                                                    {member.name}
                                                </p>
                                                <p className="text-sm text-slate-500">{member.title}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Mail className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Click to contact {member.email}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </CardContent>
                </Card>

                {/* Sub-tasks Card */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-800">Sub-tasks</CardTitle>
                                <CardDescription>Task breakdown and progress</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2" onClick={() => { setSelectedTask(task); setOpenSubTaskDialog(true) }}>
                                <ListTodo className="w-4 h-4" />
                                Add SubTask
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {task.subTask?.map((subtask, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-200 cursor-pointer group">
                                <div className="mt-1">
                                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                        <CheckCircle className="text-primary h-5 w-5" />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <p className="font-medium text-slate-800 group-hover:text-primary transition-colors">
                                            {subtask.title}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="flex items-center gap-1 text-slate-500">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(subtask.date)}</span>
                                        </div>
                                        <Badge variant="secondary" className="rounded-full">
                                            {subtask.tag}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Assets Card */}
            <Card className="h-fit">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-lg font-semibold text-slate-800">Project Assets</CardTitle>
                            <CardDescription>Related files and media</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                            <ImageIcon className="w-4 h-4" />
                            Add Asset
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px] pr-4">
                        <div className="grid grid-cols-1 gap-6">
                            {task.assets?.map((asset, index) => (
                                <div key={index} className="group relative overflow-hidden rounded-xl shadow-sm border border-slate-200 hover:border-primary/50 transition-colors">
                                    <img src={asset} alt={`Asset ${index + 1}`} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        {/* <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <div className="flex gap-2 justify-end">
                                                <Button size="sm" variant="secondary" className="gap-2">
                                                    <MessageSquare className="w-4 h-4" />
                                                    Comment
                                                </Button>
                                                <Button size="sm" variant="secondary" className="gap-2">
                                                    <ExternalLink className="w-4 h-4" />
                                                    View
                                                </Button>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <AddSubTask open={openSubTaskDialog} setOpen={setOpenSubTaskDialog} id={selectedTask?._id} />
        </div>
    );
};

export default Details;