
export type validatorRules = 'empty' | 'regex' | 'min-len' | 'max-len' | 'msisdn' | 'url' | 'email' | 'stringonly' | 'numberonly' | 'date' | 'alphanumeric' | 'compare';
export type IBulkValidation = { id: any, value?: string; rules: { rule: validatorRules, message: string, data?: any }[] }[];

export type IUser = {
    roles?: string[];
    username?: string;
    additionalInfo?: IUserAdditionalInfo
}
export type IUserState = {
    user?: IUser
}



export type IConfig = {
    appName?: string;
    apiBaseUrl?: string;
    churchId: number;
}

export type IAppState = {
    config?: IFrontentConfig;
    loading: boolean;
    error: boolean;
}

export type IFrontentConfig = {
    appName: string;
    churchId : number;
    nationalId: number;
    createdBy: number;
    modifiedBy: number;
    id: number;
    ministerId: number
}

export type IApiResponse<T> = {
    success: boolean;
    responseMessage?: string;
    data?: T
}

export type IPaginatableRequestPayload = {
    query?: IPaginatableQuery;
    limit: number;
    offset: number;
}

export type ISortData = { dir: 'ASC' | 'DESC', id: string }
export type IPaginatableQuery = {
    keyword?: string;
    sort?: ISortData;
    startDate?: string;
    endDate?: string;
    meta?: any;
}

export type IPagenatableResponse<T> = {
    total: number;
    data?: T[]
}

export type IUserAdditionalInfo = {
    displayName?:string;
}
  
export interface ExpensesCategory{
    id: number,
    name: string,
    active: boolean,
    churchId:  number;
}

export interface Expenses{
    id: number;
    name: string;
    description: string;
    createdDate: string;
    createdBy: number;
    modifiedDate:string;
    modifiedBy: number;
    isActive: boolean;
    expensesCategoryId: number;
    expensesCategory: ExpensesCategory,
    amountSpent: number;
    paymentMethod: string;
    suppliersName: string;
    expenseDate:string;
    churchId:  number;
    church: ChurchSetup,
}

export interface Baptism {
    id: number;
    memberId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    baptismNumber: string;
    baptismDate: string;
    placeOfBaptism: string;
    godParent: string;
    ministerId: number;
    revMinister: Member;
    createdDate: string;
    createdBy: number;
    modifiedDate: string;
    modifiedBy: number;
    isActive: boolean;
}

export interface Confirmation {
    id: number;
    memberId: string;
    title: string;
    firstName: string;
    middleName: string;
    lastName: string;
    godParent: string;
    confirmationNumber: string;
    confirmationDate: string;
    placeOfConfirmation: string;
    ministerId: number;
    revMinister: Member;
    createdDate: string;
    createdBy: number;
    modifiedDate: string;
    modifiedBy: number;
    isActive: boolean;
}

export interface FirstCommunion {
    id: number;
    memberId: string;
    title: string;
    firstName: string;
    middleName: string;
    lastName: string;
    firstCommunionNumber: string;
    firstCommunionDate: string;
    placeOfFirstCommunion: string;
    ministerId: number;
    revMinister: Member;
    church: string;
    createdDate: string;
    createdBy: number;
    modifiedDate: string;
    modifiedBy: number;
    isActive: boolean;
}

export interface Marriage {
    id: number;
    marriageNumber: string;
    coupleName: string;
    placeOfMarriage: string;
    marriageDate: string;
    ministerId: number;
    revMinister: Member;
    groomId: string;
    groomWitness: string;
    brideId: string;
    brideWitness: string;
    groomParentName: string
    brideParentName: string
    marriageType: string
    nuptialBlessingDate: string
    createdDate: string;
    createdBy: number;
    modifiedDate: string;
    modifiedBy: number;
    isActive: boolean;
}

export interface Member {
    id: number;
    membershipNumber: string;
    cardNumber: string;
    title: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    gender: string;
    notes: string;
    dateOfBirth: string;
    dayBorn: string;
    placeOfStay: string;
    homeDistrict: string;
    region: string;
    occupation: string;
    fathersName: string;
    mothersName: string;
    phoneNumber: string;
    isDeceased: boolean;
    isMinister: boolean;
    createdDate: string;
    createdBy: number;
    modifiedDate: string;
    modifiedBy: number;
    isActive: boolean;
}

export interface MemberBirthdays {
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
    imageUrl: ""
}

export interface Contribution {
    id: number;
    name: string;
    description: string;
    active: boolean;
    contributionTypeId: number;
    contributionType: ContributionType;
    // contributionType: ContributionType[];
    amount: number;
    channel: string;
    mobileNumber: string;
    paymentDate: string;
    memberId: number;
    member: string;
    churchId: number;
    church: ChurchSetup;
    reference:"",
    taxDeductable : false
    // church: ChurchSetup[];
}


export interface ContributionType {
    id: number;
    name: string;
    active: boolean;
    paymentType: string;
    initialAmount: number;
    churchId: number;
    church: string;

    // church: ChurchSetup[];
}


export interface ChurchSetup {
    id: number;
    name: string;
    code: string;
    active: boolean;
    sendSms: boolean;
    sendBirthdayAlerts: boolean;
    sendAnnouncements: boolean;
    churchContact: string;
    churchEmail: string;
    parentChurch: string;
    isAnOutStation: boolean;
    clientType: string;
}


