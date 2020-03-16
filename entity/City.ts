import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Province } from './Province';

@Entity()
export class City {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    pinyin: string;

    @Column({nullable: false})
    name: string;

    @Column({nullable: false})
    href: string;

    @ManyToOne(type => Province)
    province: Province;

}
