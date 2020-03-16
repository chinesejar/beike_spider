import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { BizCircle } from "./BizCircle";

@Entity()
export class Community {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    href: string;

    @Column({nullable: true})
    img: string;

    @Column()
    code: string;

    @Column({type: 'double', nullable: true})
    lng: number;

    @Column({type: 'double', nullable: true})
    lat: number;

    @Column({nullable: true})
    building_type: string;
    
    @Column({nullable: true})
    property_cost: string;
    
    @Column({nullable: true})
    property_manager: string;

    @Column({nullable: true})
    developer: string;

    @Column({nullable: true})
    building_count: number;

    @Column({nullable: true})
    house_count: number;

    @ManyToOne(type => BizCircle)
    biz_circle: BizCircle;

}
