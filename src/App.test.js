import React from 'react';
import { unmountComponentAtNode } from "react-dom";
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';

// mock api calls
const server = setupServer(

  // capture "GET /api/members" requests
  rest.get('http://localhost:3000/api/members', (req, res, ctx) => {
    // mock JSON body response from nodejs server
    return res(ctx.json([
      {
        member: 'steve',
        'beer-style': 'IPA',
        date: '2015-01-01T01:00:00.000Z'
      },
      {
        member: 'steve',
        'beer-style': 'Porter',
        date: '2015-01-02T02:00:00.000Z' 
      },
      {
        member: 'bob',
        'beer-style': 'Porter',
        date: '2015-01-01T08:00:00.000Z' 
      }
    ]));
  }),

  // capture "GET /api/beers/:member" requests
  rest.get('http://localhost:3000/api/beers/steve', (req, res, ctx) => {
    return res(ctx.json([
      {
        member: 'steve',
        'beer-style': 'IPA',
        date: '2015-01-01T01:00:00.000Z'
      },
      {
        member: 'steve',
        'beer-style': 'Porter',
        date: '2015-01-02T02:00:00.000Z' 
      }
    ]));
  }),

  // capture "GET /api/consumptions/:member/:beer" requests
  rest.get('http://localhost:3000/api/consumptions/steve/IPA', (req, res, ctx) => {
    return res(ctx.json([
      {
        member: 'steve',
        'beer-style': 'IPA',
        date: '2015-01-01T01:00:00.000Z' 
      }
    ]));
  }),

  rest.get('http://localhost:3000/api/consumptions/steve/porter', (req, res, ctx) => {
    return res(ctx.json([
      {
        member: 'steve',
        'beer-style': 'Porter',
        date: '2015-01-02T02:00:00.000Z' 
      }
    ]));
  })
)

let container = null;

// establish API mocking before all tests
beforeAll(() => server.listen())

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

// reset any request handlers that are declared as a part of tests
afterEach(() => {
  server.resetHandlers();
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
})
// clean up once the tests are done
afterAll(() => server.close())

/**
 * Test passes
 */
test('renders NavBar', () => {
  render(<App />);
  const navBarElement = screen.getByText(/Beer Club Analytics by Tavour/i);
  expect(navBarElement).toBeInTheDocument();
});

/**
 * Test passes with warnings
 */
test('loads and displays member table', async () => {
  
  render(<App />);
  const values = [
    {
      name: 'steve',
      count: 2
    },
    {
      name: 'bob',
      count: 1
    }
  ]
  await waitFor(() => screen.getByText(/Beer Consumed by steve/i));
  values.forEach((obj) => {
    const tableRowElement = screen.getByText(obj.name).closest('tr');
    const utils = within(tableRowElement);
    expect(utils.getByText(obj.name)).toBeInTheDocument();
    expect(utils.getByText(obj.count)).toBeInTheDocument();
  });

  expect(screen.getByText(/Beer Consumed by steve/i)).toBeInTheDocument();
  
});

/**
 * Test Passes
 */
test('handles server error', async () => {
  server.use(
    rest.get('/api/members', (req, res, ctx) => {
      return res(ctx.status(500))
    })
  )

  render(<App />);
  const headerElement = screen.getByText(/ERROR GETTING CONSUMER/i);
  expect(headerElement).toBeInTheDocument();
})

/**
 * Test Fails
 * Trying to test clicking the table row, but click event not triggerring properly
 */
test('updates consumer on table row click', async () => {
  render(<App />);

  await waitFor(() => screen.getByText(/Beer Consumed by steve/i));
  
  const tableRowElement = screen.getByText('bob').closest('tr');

  fireEvent.mouseOver(tableRowElement);
  fireEvent.click(tableRowElement);

  await waitFor(() => screen.getByText(/Beer Consumed by bob/i));
  expect(screen.getByText(/Beer Consumed by bob/i)).toBeInTheDocument();
})


