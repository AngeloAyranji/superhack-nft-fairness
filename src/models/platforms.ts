import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("platforms")
export class Platform {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @PrimaryColumn()
    contractAddress!: string;

    @Column()
    fair!: boolean;

    @Column({ default: 1 })
    chainId!: number;
}