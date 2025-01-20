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
const moviesServices_1 = require("../services/moviesServices");
const axios_1 = __importDefault(require("axios"));
const axios_mock_adapter_1 = __importDefault(require("axios-mock-adapter"));
const mock = new axios_mock_adapter_1.default(axios_1.default);
describe('getMoviesByYear', () => {
    afterEach(() => {
        mock.reset();
    });
    it('should fetch movies with multiple editors', () => __awaiter(void 0, void 0, void 0, function* () {
        mock.onGet('https://api.themoviedb.org/3/discover/movie').reply(200, {
            results: [
                { id: 1, title: 'Joker', release_date: 'October 1, 2019', vote_average: 8.15 },
            ],
        });
        mock.onGet('https://api.themoviedb.org/3/movie/1/credits').reply(200, {
            crew: [
                { known_for_department: 'Editing', name: 'Jeff Groth' },
                { known_for_department: 'Editing', name: 'Jeff Mee' },
                { known_for_department: 'Editing', name: 'Ray Neapolitan' },
                { known_for_department: 'Editing', name: 'Thomas J. Cabela' },
                { known_for_department: 'Editing', name: 'Jill Bogdanowicz' },
                { known_for_department: 'Editing', name: 'Jason Saulog' },
                { known_for_department: 'Editing', name: 'Cindy Bond' },
            ],
        });
        const movies = yield (0, moviesServices_1.getMoviesByYear)(2019, 1);
        expect(movies).toEqual([
            {
                title: 'Joker',
                release_date: 'October 1, 2019',
                vote_average: 8.15,
                editors: [
                    "Jeff Groth",
                    "Jeff Mee",
                    "Ray Neapolitan",
                    "Thomas J. Cabela",
                    "Jill Bogdanowicz",
                    "Jason Saulog",
                    "Cindy Bond"
                ],
            },
        ]);
    }));
    it('should handle missing editors gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
        mock.onGet('https://api.themoviedb.org/3/discover/movie').reply(200, {
            results: [
                { id: 1, title: 'Joker', release_date: 'October 1, 2019', vote_average: 8.15 },
            ],
        });
        mock.onGet('https://api.themoviedb.org/3/movie/1/credits').reply(500);
        const movies = yield (0, moviesServices_1.getMoviesByYear)(2019, 1);
        expect(movies).toEqual([
            {
                title: 'Joker',
                release_date: 'October 1, 2019',
                vote_average: 8.15,
                editors: [],
            },
        ]);
    }));
});
