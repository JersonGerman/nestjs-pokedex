import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor( 
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {}

  async executedSeed() {

    await this.pokemonModel.deleteMany({}); // delete * from
    
    const data = await this.http.get<PokeResponse>("https://pokeapi.co/api/v2/pokemon?limit=650")

    const pokemonToInsert: {no:number, name:string}[] = [];
    
    data.results.forEach( async({name, url}) => {
      
      const segments = url.split("/")
      const no: number = +segments[ segments.length - 2 ];

      // await this.pokemonModel.create({no, name})
      pokemonToInsert.push({no,name});

    })

    await this.pokemonModel.insertMany(pokemonToInsert);
    
    return "Seed Executed";
  }

}
