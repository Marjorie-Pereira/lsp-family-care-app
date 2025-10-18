import { familyMemberType } from "./familyMember.type";

export type scheduleType = {
    id: string;
    title: string;
    imageUrl: string;
    familyMember: familyMemberType
}