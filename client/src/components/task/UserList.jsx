import React, { useEffect, useState } from 'react';
import { Search, Users, Check, Loader2 } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useGetTeamListQuery } from '../../redux/slices/api/userApiSlice';

const UserList = ({ setTeam, team = [] }) => {
  const { data: users, isLoading } = useGetTeamListQuery();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (team?.length > 0 && users?.length > 0) {
      const initialSelected = users.filter(user => team.includes(user._id));
      setSelectedUsers(initialSelected);
    }
  }, [team, users]);

  const filteredUsers = users?.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const toggleUser = (user) => {
    const isSelected = selectedUsers.some(u => u._id === user._id);
    let newSelected;
    
    if (isSelected) {
      newSelected = selectedUsers.filter(u => u._id !== user._id);
    } else {
      newSelected = [...selectedUsers, user];
    }
    
    setSelectedUsers(newSelected);
    setTeam(newSelected.map(u => u._id));
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('') || '';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Loading team members...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Team Members</Label>
        <Badge variant="secondary" className="font-normal">
          {selectedUsers.length} selected
        </Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search team members..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      <ScrollArea className="h-[280px] pr-4">
        <div className="space-y-2">
          {filteredUsers.map((user) => {
            const isSelected = selectedUsers.some(u => u._id === user._id);
            return (
              <div key={user._id} onClick={() => toggleUser(user)} className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors duration-200 ${isSelected ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-secondary'}`}>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.title || user.role}</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}
                `}>
                  {isSelected && <Check className="h-3 w-3" />}
                </div>
              </div>
            );
          })}
          
          {filteredUsers.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'No team members found' : 'No team members available'}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UserList;