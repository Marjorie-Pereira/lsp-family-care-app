export type eventType = {
    id: string;
    schedule_id: string;
    title: string;
    date: Date;
    category: eventCategory;

}

export type eventCategory = "Viagem" | "Medicação" | "Outro"