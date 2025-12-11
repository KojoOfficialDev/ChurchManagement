import type { Member } from '@/services/members/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

type MemberProfileSidebarProps = {
  member: Member
}

export const MemberProfileSidebar = ({ member }: MemberProfileSidebarProps) => {
  const initials =
    `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase()

  return (
    <aside className="flex flex-col items-center gap-[22px] w-[266px] bg-[#b9b9ba1f] rounded-3xl pt-[37px] pb-8">
      <Avatar className="w-[147px] h-[147px]">
        <AvatarImage src={member.imageUrl} />
        <AvatarFallback className="bg-[#d9d9d9] text-2xl font-semibold text-gray-700">
          {initials}
        </AvatarFallback>
      </Avatar>
      {member.isActive ? (
        <Badge className="bg-[#ebfdf2] text-[#037847] hover:bg-[#ebfdf2] gap-1.5 px-2 py-0.5 h-auto">
          <div className="w-2 h-2 bg-[#14b96c] rounded-[3px]" />
          <span className="[font-family:'Inter',Helvetica] font-medium text-xs">
            Active
          </span>
        </Badge>
      ) : (
        <Badge className="bg-[#fef3f2] text-[#b42318] hover:bg-[#fef3f2] gap-1.5 px-2 py-0.5 h-auto">
          <div className="w-2 h-2 bg-[#f04438] rounded-[3px]" />
          <span className="[font-family:'Inter',Helvetica] font-medium text-xs">
            Inactive
          </span>
        </Badge>
      )}
    </aside>
  )
}
