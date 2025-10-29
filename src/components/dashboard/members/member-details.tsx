import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import type { Member } from '@/services/members/types'
import { MemberProfileSidebar } from './member-profile-sidebar'
import { MemberInfoSection } from './member-info-section'
import { ScrollArea } from '@/components/ui/scroll-area'

const tabItems = [
  { value: 'personal-info', label: 'Personal Info' },
  { value: 'contact-location', label: 'Contact & Location' },
  { value: 'work-education', label: 'Work & Education' },
  { value: 'society-membership', label: 'Society & Membership' },
]

type MemberDetailsProps = {
  children: React.ReactNode
  member: Member
}

export const MemberDetails = ({ children, member }: MemberDetailsProps) => {
  const personalInfoData = [
    { label: 'First Name', value: member.firstName },
    { label: 'Last Name', value: member.lastName },
    { label: 'Middle Name', value: member.middleName },
    { label: 'Gender', value: member.gender },
    { label: 'Date of Birth', value: member.dateOfBirth },
    { label: 'Place of Birth', value: member.placeOfBirth },
  ]

  const contactLocationData = [
    { label: 'Email', value: member.email },
    { label: 'Phone Number', value: member.phoneNumber },
    { label: 'Region', value: member.region },
    { label: 'Home Town', value: member.homeTown },
    { label: 'Place of Residence', value: member.placeOfResidence },
    { label: 'Home Address', value: member.homeAddress },
  ]

  const workEducationData = [
    { label: 'Occupation', value: member.occupation },
    { label: 'Academic Qualification', value: member.academicQualification },
  ]

  const societyMembershipData = [
    { label: 'Membership Number', value: member.membershipNumber },
    { label: 'Nationality', value: member.nationality },
    { label: 'Belongs to Society', value: member.belongsToSociety },
    { label: 'Society Name(s)', value: member.societyName },
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <ScrollArea>
        <DialogContent className="min-w-5xl max-h-[96vh] flex flex-col">
          <DialogHeader className="p-0">
            <DialogTitle>Membership Profile</DialogTitle>
            {/* <DialogDescription className="sr-only">
              View detailed information about {member.firstName}{' '}
              {member.lastName}
            </DialogDescription> */}
          </DialogHeader>

          <Tabs defaultValue="personal-info" className="w-full ">
            <TabsList className="w-full justify-start p-0 border-b border-[#eaecf0] rounded-none bg-transparent">
              {tabItems.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="px-3  py-3 rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-[#6838ee] shadow-none data-[state=active]:bg-transparent font-text-md-medium font-[number:var(--text-md-medium-font-weight)] text-gray-600 text-[length:var(--text-md-medium-font-size)] tracking-[var(--text-md-medium-letter-spacing)] leading-[var(--text-md-medium-line-height)] [font-style:var(--text-md-medium-font-style)] data-[state=active]:shadow-none"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="personal-info" className="mt-12">
              <div className="flex gap-[51px]">
                <MemberProfileSidebar member={member} />
                <MemberInfoSection
                  title="Personal Information"
                  data={personalInfoData}
                />
              </div>
            </TabsContent>

            <TabsContent value="contact-location" className="mt-12">
              <div className="flex gap-[51px]">
                <MemberProfileSidebar member={member} />
                <MemberInfoSection
                  title="Contact & Location Details"
                  data={contactLocationData}
                />
              </div>
            </TabsContent>

            <TabsContent value="work-education" className="mt-12">
              <div className="flex gap-[51px]">
                <MemberProfileSidebar member={member} />
                <MemberInfoSection
                  title="Work & Education"
                  data={workEducationData}
                />
              </div>
            </TabsContent>

            <TabsContent value="society-membership" className="mt-12">
              <div className="flex gap-[51px]">
                <MemberProfileSidebar member={member} />
                <MemberInfoSection
                  title="Society & Membership Details"
                  data={societyMembershipData}
                />
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </ScrollArea>
    </Dialog>
  )
}
