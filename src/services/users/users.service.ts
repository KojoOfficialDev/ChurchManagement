import type {
  UserTableData,
  UsersQueryParams,
  PaginatedUsersResponse,
} from './types'

// Mock data for users
const mockUsers: Array<UserTableData> = [
  {
    id: '1',
    fullName: 'Bervelyn Amoako',
    email: 'johndoe@email.com',
    role: 'Admin',
    addedOn: '10/10/2024',
    status: 'Active',
  },
  {
    id: '2',
    fullName: 'Kweku Atomo',
    email: 'b.amoako@email.com',
    role: 'Finance',
    addedOn: '02/20/2024',
    status: 'Active',
  },
  {
    id: '3',
    fullName: 'Ansel Anana',
    email: 'kwame.atomo@email.com',
    role: 'Auditor',
    addedOn: '03/15/2024',
    status: 'Active',
  },
  {
    id: '4',
    fullName: 'Prince Osei',
    email: 'anana.ansel@email.com',
    role: 'Auditor',
    addedOn: '04/01/2024',
    status: 'Active',
  },
  {
    id: '5',
    fullName: 'Bervelyn Amoako',
    email: 'prince.osei@email.com',
    role: 'Auditor',
    addedOn: '05/22/2024',
    status: 'Active',
  },
  {
    id: '6',
    fullName: 'Bervelyn Amoako',
    email: 'berv.amoako@email.com',
    role: 'Auditor',
    addedOn: '06/14/2024',
    status: 'Active',
  },
  {
    id: '7',
    fullName: 'Bervelyn Amoako',
    email: 'berv.amoako@email.com',
    role: 'Auditor',
    addedOn: '07/03/2024',
    status: 'Active',
  },
  {
    id: '8',
    fullName: 'Bervelyn Amoako',
    email: 'berv.amoako@email.com',
    role: 'Auditor',
    addedOn: '08/11/2024',
    status: 'Active',
  },
  {
    id: '9',
    fullName: 'Bervelyn Amoako',
    email: 'berv.amoako@email.com',
    role: 'Auditor',
    addedOn: '09/08/2024',
    status: 'Active',
  },
  {
    id: '10',
    fullName: 'Bervelyn Amoako',
    email: 'berv.amoako@email.com',
    role: 'Auditor',
    addedOn: '10/29/2024',
    status: 'Active',
  },
  {
    id: '11',
    fullName: 'John Smith',
    email: 'john.smith@email.com',
    role: 'Admin',
    addedOn: '01/15/2024',
    status: 'Active',
  },
  {
    id: '12',
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    role: 'Finance',
    addedOn: '02/10/2024',
    status: 'Inactive',
  },
  {
    id: '13',
    fullName: 'Michael Brown',
    email: 'michael.brown@email.com',
    role: 'Auditor',
    addedOn: '03/05/2024',
    status: 'Active',
  },
  {
    id: '14',
    fullName: 'Emily Davis',
    email: 'emily.davis@email.com',
    role: 'Finance',
    addedOn: '04/20/2024',
    status: 'Active',
  },
  {
    id: '15',
    fullName: 'David Wilson',
    email: 'david.wilson@email.com',
    role: 'Auditor',
    addedOn: '05/12/2024',
    status: 'Inactive',
  },
  {
    id: '16',
    fullName: 'Jessica Martinez',
    email: 'jessica.martinez@email.com',
    role: 'Admin',
    addedOn: '06/08/2024',
    status: 'Active',
  },
  {
    id: '17',
    fullName: 'Christopher Lee',
    email: 'christopher.lee@email.com',
    role: 'Finance',
    addedOn: '07/25/2024',
    status: 'Active',
  },
  {
    id: '18',
    fullName: 'Amanda Garcia',
    email: 'amanda.garcia@email.com',
    role: 'Auditor',
    addedOn: '08/18/2024',
    status: 'Active',
  },
  {
    id: '19',
    fullName: 'Matthew Robinson',
    email: 'matthew.robinson@email.com',
    role: 'Finance',
    addedOn: '09/30/2024',
    status: 'Inactive',
  },
  {
    id: '20',
    fullName: 'Ashley Taylor',
    email: 'ashley.taylor@email.com',
    role: 'Auditor',
    addedOn: '10/15/2024',
    status: 'Active',
  },
  {
    id: '21',
    fullName: 'Daniel Anderson',
    email: 'daniel.anderson@email.com',
    role: 'Admin',
    addedOn: '11/02/2024',
    status: 'Active',
  },
  {
    id: '22',
    fullName: 'Olivia Thomas',
    email: 'olivia.thomas@email.com',
    role: 'Finance',
    addedOn: '11/20/2024',
    status: 'Active',
  },
  {
    id: '23',
    fullName: 'James Jackson',
    email: 'james.jackson@email.com',
    role: 'Auditor',
    addedOn: '12/05/2024',
    status: 'Inactive',
  },
  {
    id: '24',
    fullName: 'Sophia White',
    email: 'sophia.white@email.com',
    role: 'Finance',
    addedOn: '12/18/2024',
    status: 'Active',
  },
  {
    id: '25',
    fullName: 'William Harris',
    email: 'william.harris@email.com',
    role: 'Auditor',
    addedOn: '01/10/2024',
    status: 'Active',
  },
]

export class UsersService {
  static async getAllUsers(
    params: UsersQueryParams,
  ): Promise<PaginatedUsersResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    let filteredUsers = [...mockUsers]

    // Apply search filter
    if (params.search && params.search.trim() !== '') {
      const searchLower = params.search.toLowerCase()
      filteredUsers = filteredUsers.filter((user) =>
        user.fullName.toLowerCase().includes(searchLower),
      )
    }

    // Apply role filter
    if (params.role && params.role !== 'All Category') {
      filteredUsers = filteredUsers.filter((user) => user.role === params.role)
    }

    // Apply status filter
    if (params.status && params.status !== 'All Status') {
      filteredUsers = filteredUsers.filter(
        (user) => user.status === params.status,
      )
    }

    // Calculate pagination
    const totalCount = filteredUsers.length
    const totalPages = Math.ceil(totalCount / params.pageSize)
    const startIndex = (params.page - 1) * params.pageSize
    const endIndex = startIndex + params.pageSize
    const paginatedData = filteredUsers.slice(startIndex, endIndex)

    return {
      data: paginatedData,
      page: params.page,
      pageSize: params.pageSize,
      totalCount,
      totalPages,
      hasPrevious: params.page > 1,
      hasNext: params.page < totalPages,
    }
  }
}


