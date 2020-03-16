import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { District } from "./District";

@Entity()
export class BizCircle {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    href: string;

    @ManyToOne(type => District)
    district: District;

}
