import request from 'supertest';
import app from '../src/app';
import './utils/truncate';

describe('Routes', () => {
  test('it should create a game when POST /games', async () => {
    const response = await request(app).post('/games');
    expect(response.status).toBe(200);
  });
  test('it should create a game when POST /games and set browser_id using the body data', async () => {
    const response = await request(app)
      .post('/games')
      .send({ browser_id: new Date().getTime().toString() });
    expect(response.status).toBe(200);
  });
  test('it should return a array of games when GET /games', async () => {
    const response = await request(app).get('/games');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
  /* test('it should return the empty board when calling the /board route', async () => {
    const response = await request(app).get('/board');
    const squares = Object.keys(SQUARES);
    const board = {};
    squares.map(square => {
      board[square] = {
        color: '',
        piece: null,
      };
      return square;
    });
    expect(response.body).toEqual(board);
  }); */
});
