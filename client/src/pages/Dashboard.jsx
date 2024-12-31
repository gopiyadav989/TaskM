import React from 'react';
import moment from "moment";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Users, TrendingUp, Layers, Star } from 'lucide-react';
import { activitiesData } from '../assets/data';
import { getInitials, TASK_TYPE } from '../utils/index';
import { useSelector } from 'react-redux';
import { useGetDashboardStatsQuery } from '../redux/slices/api/taskApiSlice';



const StatsCard = ({ icon: Icon, label, value, trend, color }) => (
    <Card className="relative overflow-hidden">
        <CardContent className="p-6">
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 ${color}`} />
            <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="text-3xl font-bold">{value}</p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                </div>
            </div>
            {trend && (
                <div className={`mt-4 text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                    {trend > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingUp className="w-4 h-4 mr-1 rotate-180" />}
                    {Math.abs(trend)}% from last month
                </div>
            )}
        </CardContent>
    </Card>
);

const TaskCard = ({ task }) => (
    <Card className="group hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${TASK_TYPE[task.stage]}`} />
                        <span className="text-sm font-medium text-muted-foreground capitalize">
                            {task.stage}
                        </span>
                    </div>
                    <h4 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {task.title}
                    </h4>
                </div>
                <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                    {task.priority}
                </Badge>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                    {task.team.slice(0, 3).map((member, idx) => (
                        <Avatar key={idx} className="border-2 border-background w-8 h-8">
                            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                {getInitials(member?.name)}
                            </AvatarFallback>
                        </Avatar>
                    ))}
                    {task.team.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border-2 border-background">
                            <span className="text-xs">+{task.team.length - 3}</span>
                        </div>
                    )}
                </div>
                <div className="text-sm text-muted-foreground">
                    {moment(task?.date).fromNow()}
                </div>
            </div>
        </CardContent>
    </Card>
);


const Dashboard = () => {

    const { data } = useGetDashboardStatsQuery();

    const { user } = useSelector((state) => state.auth);
    console.log(data);

    const stats = [
        { icon: Layers, label: 'Total Tasks', value: data?.totalTasks || 0, trend: 12, color: 'bg-blue-500' },
        { icon: CheckCircle, label: 'Completed', value: data?.tasks.completed || 0, trend: 8, color: 'bg-green-500' },
        { icon: Clock, label: 'In Progress', value: data?.tasks['in progress'] || 0, trend: -5, color: 'bg-amber-500' },
        { icon: Users, label: 'Team Members', value: data?.users.length || 0, color: 'bg-purple-500' }
    ];

    return (
        <div className="p-8 space-y-8 bg-gradient-to-b from-background to-muted/20">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center gap-2">
                    <h1 className="text-4xl font-bold tracking-tight">Welcome back, {user?.name} 👋</h1>
                    <Badge variant="secondary" className="ml-auto">
                        {moment().format('MMMM Do, YYYY')}
                    </Badge>
                </div>
                <p className="text-muted-foreground">Here's what's happening with your projects today</p>

            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <StatsCard key={i} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
                <Card className="lg:col-span-8">
                    <CardHeader>
                        <CardTitle>Task Distribution</CardTitle>
                        <CardDescription>Task priority breakdown</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data?.graphData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#8884d8"
                                    fill="url(#colorTotal)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[300px]">
                            <div className="space-y-4">
                                {activitiesData.map((activity, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className={`p-2 rounded-full ${activity.type === 'completed' ? 'bg-green-100 text-green-600' : activity.type === 'started' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {activity.type === 'completed' ? <CheckCircle className="w-4 h-4" /> : activity.type === 'started' ? <Clock className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{activity.by}</p>
                                            <p className="text-sm text-muted-foreground">{activity.activity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Tasks</CardTitle>
                                <CardDescription>Latest updates from your team</CardDescription>
                            </div>
                            <Badge variant="outline" className="ml-auto">
                                {data?.last10Task.length} tasks
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-4">
                                {data?.last10Task?.map((task, index) => (
                                    <TaskCard key={index} task={task} />
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Team Members</CardTitle>
                        <CardDescription>Active team collaboration</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px]">
                            <div className="space-y-4">
                                {data?.users?.map((user, index) => (
                                    <div key={index}
                                        className="flex items-center gap-4 p-4 hover:bg-muted/50 rounded-lg transition-colors">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                {getInitials(user?.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.role}</p>
                                        </div>
                                        <Badge variant={user?.isActive ? "success" : "secondary"}>
                                            {user?.isActive ? "Active" : "Away"}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;