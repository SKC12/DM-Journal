import { nanoid } from "nanoid";

export class Location {
  constructor(name, img, location, description = "", privateDescription = "") {
    this.name = name;
    this.img = img;
    this.location = location;
    this.description = description;
    this.privateDescription = privateDescription;
    this.uid = nanoid();
  }
}
