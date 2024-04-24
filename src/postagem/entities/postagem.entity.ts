import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Tema } from "../../tema/entities/tema.entity";
import { Usuario } from "../../usuario/entities/usuario.entity";

@Entity({name: "tb_postagens"})
export class Postagem{

    @PrimaryGeneratedColumn() // Chave Primária e Auto_Increment
    id: number;

    // Validação para espaços em branco
    @Transform(({ value }: TransformFnParams) => value?.trim()) 
    @IsNotEmpty()
    @Column({length: 100, nullable: false})
    titulo: string;

    // Validação para espaços em branco
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    @Column({length: 1000, nullable: false})
    texto: string;

    @UpdateDateColumn()
    data: Date;

    @ManyToOne(() => Tema, (tema) => tema.postagem, {
        onDelete: "CASCADE"
    })
    tema: Tema; // Chave Estrangeira

    @ManyToOne(() => Usuario, (usuario) => usuario.postagem, {
        onDelete: "CASCADE"
    })
    usuario: Usuario; // Chave Estrangeira
    
}