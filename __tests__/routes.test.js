import request from 'supertest';
import app from '../src/app';
import './utils/truncate';

describe('Routes', () => {
  const browserId = new Date().getTime().toString();

  test('it should create a game when POST /new-game', async () => {
    const response = await request(app).post('/new-game');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('game');
    expect(response.body.game).toHaveProperty('browser_id');
    expect(response.body).toHaveProperty('board');
  });
  test('it should return 200 when POST /new-game and set browser_id using the body data', async () => {
    const response = await request(app)
      .post('/new-game')
      .send({ browser_id: browserId });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('game');
    expect(response.body.game).toHaveProperty('browser_id');
    expect(response.body.game.browser_id).toEqual(browserId);
  });
  test('it should return 400 when GET /load-game without a browser id', async () => {
    const response = await request(app).get('/load-game');
    expect(response.status).toBe(400);
  });
  test('it should return 400 when GET /load-game using a invalid browser id', async () => {
    const response = await request(app)
      .get('/load-game')
      .set('browser_id', 'someinvalidbrowserid');
    expect(response.status).toBe(400);
  });
  test('it should return 200 when GET /load-game with correct browser id', async () => {
    const response = await request(app)
      .get('/load-game')
      .set('browser_id', browserId);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('board');
  });
  test('it should return the moves history GET /load-game', async () => {
    const response = await request(app)
      .get('/load-game')
      .set('browser_id', browserId);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('board');
    expect(response.body).toHaveProperty('moves');
    expect(response.body.moves).toBeInstanceOf(Array);
  });
  test('it should return 200 when GET /legal-moves and passing a position as a parameter', async () => {
    const position = 'g4';
    const response = await request(app)
      .get(`/legal-moves/${position}`)
      .set('browser_id', browserId);
    expect(response.status).toBe(200);
  });
  test('it should return 400 when GET /legal-moves and passing a invalid position as a parameter', async () => {
    const position = '11';
    const response = await request(app)
      .get(`/legal-moves/${position}`)
      .set('browser_id', browserId);
    expect(response.status).toBe(400);
  });

  test('it should return 200 when GET /make-move and passing "from" and "to" as parameters', async () => {
    const from = 'g1';
    const to = 'f3';
    const response = await request(app)
      .get(`/make-move/${from}/${to}`)
      .set('browser_id', browserId);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('board');
    expect(response.body).toHaveProperty('move');
  });
  test('it should increment the move number when a move is made', async () => {
    // initializes a new game for a empty board
    let response = await request(app).post('/new-game');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('board');
    expect(response.body.board.move_number).toStrictEqual(0);
    expect(response.body.board.turn_player).toStrictEqual('');

    // white player makes a move
    const { browser_id } = response.body.game;
    let from = 'g1';
    let to = 'f3';
    response = await request(app)
      .get(`/make-move/${from}/${to}`)
      .set('browser_id', browser_id);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('board');
    expect(response.body.board).toHaveProperty('board');
    expect(response.body.board.move_number).toStrictEqual(1);
    expect(response.body.board.turn_player).toStrictEqual('W');

    // black player makes a move
    from = 'b8';
    to = 'c6';
    response = await request(app)
      .get(`/make-move/${from}/${to}`)
      .set('browser_id', browser_id);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('board');
    expect(response.body.board).toHaveProperty('board');
    expect(response.body.board.move_number).toStrictEqual(2);
    expect(response.body.board.turn_player).toStrictEqual('B');
  });
  test('it should return 400 when GET /make-move and passing invalid parameters', async () => {
    const from = 'g11';
    const to = 'f3';
    const response = await request(app)
      .get(`/make-move/${from}/${to}`)
      .set('browser_id', browserId);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
  test('it should return 400 when GET /make-move and passing from parameter of a empty square', async () => {
    const from = 'g2';
    const to = 'f3';
    const response = await request(app)
      .get(`/make-move/${from}/${to}`)
      .set('browser_id', browserId);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual('Invalid move!');
  });
  test('it should return the current score when GET /make-move', async () => {
    let response = await request(app).post('/new-game');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('game');
    expect(response.body.game).toHaveProperty('browser_id');
    const { browser_id } = response.body.game;
    let from = 'b2';
    let to = 'b4';
    response = await request(app)
      .get(`/make-move/${from}/${to}`)
      .set('browser_id', browser_id);
    expect(response.status).toBe(200);

    from = 'c7';
    to = 'c5';
    response = await request(app)
      .get(`/make-move/${from}/${to}`)
      .set('browser_id', browser_id);
    expect(response.status).toBe(200);

    from = 'b4';
    to = 'c5';
    response = await request(app)
      .get(`/make-move/${from}/${to}`)
      .set('browser_id', browser_id);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('board');
    expect(response.body.board).toHaveProperty('score');
  });
});
