export type eventType = {
    id: number;
    event_date: string;
    name: string;
    type: eventCategory;
    schedule_id: string;

}

export type eventCategory = "Viagem" | "Medicacao" | "Outro"