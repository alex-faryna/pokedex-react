import React, {useEffect, useState} from 'react';
import './App.css';
import axios from "axios";

const BASE_API = 'https://pokeapi.co/api/v2';
const POKEMON_API = `${BASE_API}/pokemon/`;
const POKEMON_TYPE_API = `${BASE_API}/type`;

// enum for types mb and their colors

interface PokemonListItem {
    name: string;
    url: string;
}

interface PokemonResponse {
    results: PokemonListItem[];
    count: number;
    next: string;
}

interface PokemonType {
    slot: number;
    type: {
        name: string;
    }
}

interface PokemonSprite {
    front_default: string;
}

interface Pokemon {
    id: number;
    name: string;
    sprites: PokemonSprite;
    types: PokemonType[];
}

function PokemonCard({ listItem }: { listItem: PokemonListItem }) {
    const [pokemon, setPokemon] = useState<Pokemon>();

    useEffect(() => {
        // make service for loading
        axios.get(listItem.url)
            .then(res => {
                console.log(res.data);
                return res;
            })
            .then(({ data }: { data: Pokemon }) => setPokemon(data))
            .catch(res => {});
    }, []);

    return <div className='pokemon-card'>
        <img src={ pokemon?.sprites.front_default } />
        <span>{ `#${ pokemon?.id } ${ pokemon?.name || listItem.name}` }</span>
        <div className='types'>
            { pokemon?.types.map(type => <span key={type.slot}>{ type.type.name }</span>) }
        </div>
    </div>
}

function Pokedex() {
    const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);

    useEffect(() => {
        // make service for loading
        axios.get(`${POKEMON_API}?limit=30`)
            .then(({ data }: { data: PokemonResponse }) => setPokemons(data.results))
            .catch(res => setPokemons([]));
    }, []);

    return <div className='pokedex-container'>
        <span>Pokedex</span>
        <div className='pokemon-list'>
            { pokemons.map(pokemon => <PokemonCard key={pokemon.name} listItem={pokemon}/>) }
        </div>
        <div className='footer'>
            Footer
        </div>
    </div>;
}


function App() {
    return <Pokedex />
}

export default App;
