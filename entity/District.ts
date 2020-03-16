import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { City } from "./City";

@Entity()
export class District {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    href: string;

    @ManyToOne(type => City)
    city: City;

}
