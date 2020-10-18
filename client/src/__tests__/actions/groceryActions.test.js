import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { addIngredientToGroceries } from '../../actions/groceryActions';

const server = setupServer();

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

describe('addIngredientToGroceries function', () => {
  const ingredientData = {
    name: '',
    quantity: 1,
    quantityType: 'Ounces',
    groceryExtra: false,
  };

  it('Tests error handling for adding ingredient to grocery list', async () => {
    const response = await addIngredientToGroceries(ingredientData);

    expect(response.data).toBe('Please enter an ingredient name.');
  });

  it('Tests successful API post request for adding ingredient to grocery list', async () => {
    ingredientData.name = 'test ingredient';

    server.use(
      rest.post('/api/groceries', (req, res, ctx) => {
        return res(ctx.status(201), ctx.json('test payload'));
      })
    );

    const response = await addIngredientToGroceries(ingredientData);

    expect(response.status).toBe(201);
    expect(response.data).toEqual('test payload');
  });

  it('Tests failed API post request for adding ingredient to grocery list', async () => {
    ingredientData.name = 'test ingredient';
    const errorMessage = 'An error message';

    server.use(
      rest.post('/api/groceries', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json(errorMessage));
      })
    );

    const response = await addIngredientToGroceries(ingredientData);

    expect(response).toEqual(errorMessage);
  });
});
