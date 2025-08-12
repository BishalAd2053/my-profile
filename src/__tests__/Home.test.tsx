import { render, screen, waitFor } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from '../lib/query'
import Home from '../pages/Home'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.get('http://localhost:8080/api/v1/profile', (req, res, ctx) =>
    res(ctx.json({
      id: 1,
      name: 'Jane Doe',
      title: 'Software Engineer',
      bio: 'Passionate about building impactful software.',
      avatarUrl: 'https://example.com/avatar.jpg',
      location: 'San Francisco, CA',
      github: 'janedoe',
      linkedin: 'janedoe',
      email: 'jane@example.com'
    }))
  ),
  rest.get('http://localhost:8080/api/v1/stats/contributions', (req, res, ctx) =>
    res(ctx.json({
      year: 2025,
      items: [{ id: 1, date: '2025-01-01', count: 3 }]
    }))
  )
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('renders profile and heatmap', async () => {
  render(
    <QueryClientProvider client={createQueryClient()}>
      <Home />
    </QueryClientProvider>
  )
  await waitFor(() => expect(screen.getByText('Jane Doe')).toBeInTheDocument())
  expect(screen.getByText('Software Engineer')).toBeInTheDocument()
  expect(screen.getByAltText('avatar')).toBeInTheDocument()
  expect(screen.getByText(/Contribution heatmap/i)).toBeInTheDocument()
})

