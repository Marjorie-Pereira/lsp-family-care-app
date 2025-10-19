export type familyMemberType = {
    id: string;
    name: string;
    age: string;
    phone: string;
    relation_type: relationship;
}

type relationship = "Pai/Mãe" | "Cônjuge" | "Filho(a)" | "Outro"