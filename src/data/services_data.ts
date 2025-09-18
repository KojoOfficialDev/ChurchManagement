import { fetchBaptism } from "../core/services/baptism.services";
import { fetchConfirmation } from "../core/services/confirmation.services";
import { fetchFirstCommunion } from "../core/services/firstcommunion.services";
import { fetchMarriages } from "../core/services/marriage.services";
import { fetchMembers } from "../core/services/member.services";
import moment from "moment";
import { Baptism, Confirmation, FirstCommunion, Marriage, Member } from "../core/interfaces";

const getMonthlyAdditions = (data: any[]) => {
    const currentYear = moment().year();
    return data.reduce((acc, item) => {
        const date = moment(item.createdDate);
        if (date.year() === currentYear) {
            const month = date.format('MMM'); // Format to show only the month (e.g., 'Jan', 'Feb')
            acc[month] = (acc[month] || 0) + 1;
        }
        return acc;
    }, {} as { [key: string]: number });
};

export const services = [
    {
        title: "Member List",
        description: "View and manage Membership",
        url: "/member/memberlist",
        fetchData: fetchMembers,
        getCounts: (data: any) => ({
            total: data.length,
            active: data.filter(member => member.isActive === true).length,
        }),
        getRecent: (data: Member[]) => {
            const sortedMembers = data.sort((a, b) => moment(b.createdDate).diff(moment(a.createdDate)));
            return sortedMembers.slice(0, 2);
        },
        getMonthlyAdditions: (data: Member[]) => getMonthlyAdditions(data),
    },
    {
        title: "Baptism List",
        description: "View and manage baptism list",
        url: "/baptism/baptismlist",
        fetchData: fetchBaptism,
        getCounts: (data) => ({
            total: data.length,
            active: data.filter(baptism => baptism.isActive === true).length,
        }),
        getRecent: (data: Baptism[]) => {
            const sortedMembers = data.sort((a, b) => moment(b.createdDate).diff(moment(a.createdDate)));
            return sortedMembers.slice(0, 2);
        },
        getMonthlyAdditions: (data: Baptism[]) => getMonthlyAdditions(data),
    },
    {
        title: "First Communion List",
        description: "View and manage all communicants",
        url: "/firstcommunion/firstcommunionlist",
        fetchData: fetchFirstCommunion, 
        getCounts: (data) => ({
            total: data.length,
            active: data.filter(firstCommunion => firstCommunion.isActive === true).length,
        }),
        getRecent: (data: FirstCommunion[]) => {
            const sortedMembers = data.sort((a, b) => moment(b.createdDate).diff(moment(a.createdDate)));
            return sortedMembers.slice(0, 2);
        },
        getMonthlyAdditions: (data: FirstCommunion[]) => getMonthlyAdditions(data),
    },
    {
        title: "Confirmation List",
        description: "View and manage confirmation list",
        url: "/confirmation/confirmationlist",
        fetchData: fetchConfirmation,
        getCounts: (data) => ({
            total: data.length,
            active: data.filter(confirmation => confirmation.isActive === true).length,
        }),
        getRecent: (data: Confirmation[]) => {
            const sortedMembers = data.sort((a, b) => moment(b.createdDate).diff(moment(a.createdDate)));
            return sortedMembers.slice(0, 2);
        },
        getMonthlyAdditions: (data: Confirmation[]) => getMonthlyAdditions(data),
    },
    {
        title: "Marriage List",
        description: "View and manage marriage list",
        url: "/marriage/marriagelist",
        fetchData: fetchMarriages,
        getCounts: (data) => ({
            total: data.length,
            active: data.filter(marriage => marriage.isActive === true).length,
        }),
        getRecent: (data: Marriage[]) => {
            const sortedMembers = data.sort((a, b) => moment(b.createdDate).diff(moment(a.createdDate)));
            return sortedMembers.slice(0, 2);
        },
        getMonthlyAdditions: (data: Marriage[]) => getMonthlyAdditions(data),
    },
    {
        title: "Contribution",
        description: "View and manage contributions",
        url: "/contribution/contributionlist",
        fetchData: fetchBaptism,
        getCounts: (data) => ({
            total: data.length,
            active: data.filter(baptism => baptism.isActive === true).length,
        }),
        getRecent: (data: Baptism[]) => {
            const sortedMembers = data.sort((a, b) => moment(b.createdDate).diff(moment(a.createdDate)));
            return sortedMembers.slice(0, 2);
        },
        getMonthlyAdditions: (data: Baptism[]) => getMonthlyAdditions(data),
    },
];
