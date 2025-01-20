"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoviesByYear = void 0;
const axios_1 = __importDefault(require("axios"));
const date_fns_1 = require("date-fns");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = process.env.TMDB_BEARER_TOKEN;
console.log("TMDB_TOKEN: ", TMDB_TOKEN);
const tmdbApi = axios_1.default.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
    },
});
const getMoviesByYear = (year, page) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield tmdbApi.get(`/discover/movie`, {
            params: {
                language: 'en-US',
                page,
                primary_release_year: year,
                sort_by: 'popularity.desc',
            },
        });
        const movies = response.data.results;
        console.log('movies data: ', movies);
        const moviesWithEditors = yield Promise.all(movies.map((movie) => __awaiter(void 0, void 0, void 0, function* () {
            const editors = yield fetchEditors(movie.id);
            return {
                title: movie.title,
                release_date: (0, date_fns_1.format)(new Date(movie.release_date), 'MMMM d, yyyy'),
                vote_average: parseFloat(movie.vote_average.toFixed(2)),
                editors,
            };
        })));
        return moviesWithEditors;
    }
    catch (error) {
        console.error('Error fetching movies:', error);
        throw new Error('Failed to fetch movies.');
    }
});
exports.getMoviesByYear = getMoviesByYear;
const fetchEditors = (movieId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield tmdbApi.get(`/movie/${movieId}/credits`);
        const editors = response.data.crew
            .filter((member) => member.known_for_department === 'Editing')
            .map((editor) => editor.name);
        return editors;
    }
    catch (error) {
        console.warn(`Failed to fetch editors for movie ID ${movieId}. Continuing without editors.`);
        return [];
    }
});
