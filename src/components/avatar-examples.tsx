
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VerifiedAvatar } from "@/components/ui/verified-avatar";
import { BadgeAvatar } from "@/components/ui/badge-avatar";
import { AvatarGroup } from "@/components/ui/avatar-group";

export function AvatarExamples() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-lg font-semibold mb-4">Standard Avatars</h2>
        <div className="flex flex-wrap gap-4">
          <Avatar>
            <AvatarImage src="https://originui.com/avatar-80-01.jpg" alt="User 1" />
            <AvatarFallback>U1</AvatarFallback>
          </Avatar>
          
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://originui.com/avatar-80-02.jpg" alt="User 2" />
            <AvatarFallback>U2</AvatarFallback>
          </Avatar>
          
          <Avatar className="h-16 w-16">
            <AvatarImage src="https://originui.com/avatar-80-03.jpg" alt="User 3" />
            <AvatarFallback>U3</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-4">Verified Avatars</h2>
        <div className="flex flex-wrap gap-4">
          <VerifiedAvatar>
            <AvatarImage src="https://originui.com/avatar-80-04.jpg" alt="Verified User 1" />
            <AvatarFallback>V1</AvatarFallback>
          </VerifiedAvatar>
          
          <VerifiedAvatar className="h-12 w-12">
            <AvatarImage src="https://originui.com/avatar-80-05.jpg" alt="Verified User 2" />
            <AvatarFallback>V2</AvatarFallback>
          </VerifiedAvatar>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-4">Badge Avatars</h2>
        <div className="flex flex-wrap gap-8">
          <BadgeAvatar badgeContent="3">
            <AvatarImage src="https://originui.com/avatar-80-06.jpg" alt="User with 3 notifications" />
            <AvatarFallback>U6</AvatarFallback>
          </BadgeAvatar>
          
          <BadgeAvatar badgeContent="9+" badgeClassName="bg-red-500">
            <AvatarImage src="https://originui.com/avatar-80-07.jpg" alt="User with 9+ notifications" />
            <AvatarFallback>U7</AvatarFallback>
          </BadgeAvatar>
          
          <BadgeAvatar badgeContent="New" badgeClassName="bg-green-500">
            <AvatarImage src="https://originui.com/avatar-80-08.jpg" alt="New user" />
            <AvatarFallback>U8</AvatarFallback>
          </BadgeAvatar>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-4">Avatar Groups</h2>
        <div className="space-y-4">
          <AvatarGroup>
            <Avatar>
              <AvatarImage src="https://mynaui.com//avatars/avatar-01.jpg" />
              <AvatarFallback>U1</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://mynaui.com//avatars/avatar-02.jpg" />
              <AvatarFallback>U2</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://mynaui.com//avatars/avatar-03.jpg" />
              <AvatarFallback>U3</AvatarFallback>
            </Avatar>
          </AvatarGroup>
          
          <AvatarGroup reverse>
            <Avatar>
              <AvatarImage src="https://mynaui.com//avatars/avatar-04.jpg" />
              <AvatarFallback>U4</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://mynaui.com//avatars/avatar-05.jpg" />
              <AvatarFallback>U5</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://mynaui.com//avatars/avatar-06.jpg" />
              <AvatarFallback>U6</AvatarFallback>
            </Avatar>
          </AvatarGroup>
        </div>
      </div>
    </div>
  );
}
