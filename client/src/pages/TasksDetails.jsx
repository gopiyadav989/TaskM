import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ClipboardList, Activity, Calendar, Users, Loader2 } from 'lucide-react';
import Activities from '../components/task_details/Activities';
import Details from '../components/task_details/Details';
import { useGetSingleTaskQuery } from '../redux/slices/api/taskApiSlice';

const PRIORITY_STYLES = {
  high: 'bg-red-50 text-red-700 border-red-200 shadow-sm shadow-red-100',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200 shadow-sm shadow-yellow-100',
  low: 'bg-green-50 text-green-700 border-green-200 shadow-sm shadow-green-100'
};

const STAGE_STYLES = {
  todo: 'bg-slate-100 text-slate-700 border-slate-200',
  'in-progress': 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

const TaskDetails = () => {
  const { id } = useParams();
  const {data, isLoading, refetch} = useGetSingleTaskQuery(id);
  
  const formatDate = (date) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Loading Task</p>
      </div>
    );
  }
  console.log(data.task);
  const task = data.task;

  return (
    <div className="mx-auto py-8 px-4 max-w-7xl">
      <Card className="border-none shadow-xl bg-gradient-to-b from-white to-slate-50/50">
        <CardHeader className="space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                {task.title}
              </CardTitle>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>Created {formatDate(task.date)}</span>
                <Separator orientation="vertical" className="h-4" />
                <Users className="w-4 h-4" />
                <span>{task.team?.length} team members</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Badge variant="outline" className={`text-sm px-4 py-1.5 rounded-full font-medium ${PRIORITY_STYLES[task.priority]}`}>
                {task.priority.toUpperCase()} PRIORITY
              </Badge>
              <Badge variant="outline" className={`text-sm px-4 py-1.5 rounded-full font-medium ${STAGE_STYLES[task.stage]}`}>
                {task.stage.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="inline-flex h-12 items-center text-base rounded-lg bg-slate-100 p-1 mb-8">
              <TabsTrigger value="details" className="gap-2 rounded-md px-6 py-2.5">
                <ClipboardList className="w-5 h-5" />
                Details
              </TabsTrigger>
              <TabsTrigger value="activity" className="gap-2 rounded-md px-6 py-2.5">
                <Activity className="w-5 h-5" />
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Details task={task} />
            </TabsContent>

            <TabsContent value="activity">
              <Activities activity={data?.task?.activities} id={data?.task._id} refetch={refetch}/>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDetails;