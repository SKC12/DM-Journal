import { nanoid } from "nanoid";

export class Session {
  constructor(
    name,
    color,
    date,
    arc,
    ingameTime,
    partyLevel,
    description = ""
  ) {
    this.name = name;
    this.color = color;
    this.date = date;
    this.arc = arc;
    this.ingameTime = ingameTime;
    this.partyLevel = partyLevel;
    this.description = description;
    this.uid = nanoid();
  }
}
