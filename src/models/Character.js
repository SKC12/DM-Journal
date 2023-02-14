import { nanoid } from "nanoid";

export class Character {
  constructor(name, img, description, privateDescription) {
    this.name = name;
    this.img = img;
    this.description = description;
    this.privateDescription = privateDescription;
    this.uid = nanoid();
  }
}
