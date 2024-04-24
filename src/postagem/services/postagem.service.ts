import { TemaService } from './../../tema/services/tema.service';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Postagem } from "../entities/postagem.entity";
import { DeleteResult, ILike, Repository } from "typeorm";

@Injectable()
export class PostagemService{
    constructor(
        @InjectRepository(Postagem)
        private postagemRepository: Repository<Postagem>,
        private temaService: TemaService
    ){}

    async findAll(): Promise<Postagem[]>{
        return await this.postagemRepository.find({
            relations: {
                tema: true,
                usuario: true
            }
        });

        // SELECT * FROM tb_postagens;
    }

    async findById(id: number): Promise<Postagem> {

        let postagem = await this.postagemRepository.findOne({
            where:{
                id
            },
            relations: {
                tema: true,
                usuario: true
            }
        });

        // Checar se a postagem não foi encontrada
        if (!postagem)
            throw new HttpException('Postagem não encontrada!', HttpStatus.NOT_FOUND);

        // Retornar a postagem, caso ela exista
        return postagem;

        // SELECT * FROM tb_postagens WHERE id = ?;
    }

    async findByTitulo(titulo: string): Promise<Postagem[]>{
        return await this.postagemRepository.find({
            where:{
                titulo: ILike(`%${titulo}%`)
            },
            relations: {
                tema: true,
                usuario: true
            }
        })

        // SELECT * FROM tb_postagens WHERE titulo LIKE '%titulo%';
    }

    async create(postagem: Postagem): Promise<Postagem>{

        // Caso o tema tenha sido preenchido
        if (postagem.tema){

            let tema = await this.temaService.findById(postagem.tema.id)

            if(!tema)
                throw new HttpException('Tema não foi encontrado!', HttpStatus.NOT_FOUND)

            return await this.postagemRepository.save(postagem);
        }

        // Caso o tema não tenha sido preenchido
        return await this.postagemRepository.save(postagem);

         // INSERT INTO tb_postagens (titulo, texto, data) VALUES (?, ?, server);
    }

    async update(postagem: Postagem): Promise<Postagem>{
        
        let buscaPostagem: Postagem = await this.findById(postagem.id);
        
        // Verifica se a postagem existe
        if (!buscaPostagem || !postagem.id)
            throw new HttpException('Postagem não foi encontrada!', HttpStatus.NOT_FOUND)

         // Caso o tema tenha sido preenchido
        if (postagem.tema){

            let tema = await this.temaService.findById(postagem.tema.id)

            if(!tema)
                throw new HttpException('Tema não foi encontrado!', HttpStatus.NOT_FOUND)

            return await this.postagemRepository.save(postagem);
        }

        return await this.postagemRepository.save(postagem);

         // UPDATE tb_postagens SET titulo = ?, texto = ?, data = server WHERE id = ?;

    }

    async delete(id: number): Promise<DeleteResult>{
        
        let buscaPostagem: Postagem = await this.findById(id);
        
        if (!buscaPostagem)
            throw new HttpException('Postagem não foi encontrada!', HttpStatus.NOT_FOUND)

        return await this.postagemRepository.delete(id);
        
    }

}