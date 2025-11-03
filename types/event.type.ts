export type eventType = {
  id: number;
  event_date: string;
  name: string;
  type: eventCategory;
  schedule_id: string;
  travel_start?: string;
  travel_end?: string;
};

export type eventCategory = "Viagem" | "Medicacao" | "Outro";
