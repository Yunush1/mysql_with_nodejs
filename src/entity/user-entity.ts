import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity({name:"User"})
export class UserEntity {

    @PrimaryGeneratedColumn("uuid")
    userId: number

    @CreateDateColumn()
    createdAt:Date

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({unique:true})
    email:string;

    @Column({name:"password_hash"})
    passwordHash:string;

    @Column()
    age: number

    @Column({name: "refresh_token_hash", nullable: true})
    refreshTokenHash?: string
    

}

