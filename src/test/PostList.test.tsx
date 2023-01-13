import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import PostList from '../components/PostList'
import { rest } from 'msw'
import {setupServer} from 'msw/node'
import { BASE_URL } from '../api'
import { formatDateString, limitString } from '../helpers'

const fakePost = {
    id: 1,
    title: "Test title",
    content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    lat: "1",
    long: "2",
    image_url: "https://test.com/image.jpg",
    created_at: "2022-01-01T00:00:00.000Z",
    updated_at: "2022-01-01T00:00:00.000Z"
}
const fakePostLongContent = {
    ...fakePost,
    content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
}

const server = setupServer()
  
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

test('api returned error, displaying error', async () => {

  render(<BrowserRouter><PostList /></BrowserRouter>)

  server.use(
    rest.get(BASE_URL, (req, res, ctx) => {
      return res(ctx.status(500))
    }),
  )
  await new Promise((r) => setTimeout(r, 1000));

  expect(screen.getByText('Something went wrong...')).toBeDefined()
})

test('api returned empty posts array, displaying message', async () => {
    render(<BrowserRouter><PostList /></BrowserRouter>)

    server.use(
        rest.get(BASE_URL, (req, res, ctx) => {
            return res(ctx.json([]))
        }),
    )
    await new Promise((r) => setTimeout(r, 1000));

    expect(screen.getByText('There are no posts. Let\'s create a new one!')).toBeDefined()
})

test('api returned posts array, displaying posts', async () => {
    render(<BrowserRouter><PostList /></BrowserRouter>)

    server.use(
        rest.get(BASE_URL, (req, res, ctx) => {
            return res(ctx.json([fakePost]))
        }),
    )
    await new Promise((r) => setTimeout(r, 1000));

    expect(screen.getByText(fakePost.title)).toBeDefined();
    expect(screen.getByText(fakePost.content)).toBeDefined();
    expect(screen.getByRole('img')).toHaveProperty('src', fakePost.image_url);
    expect(screen.getByText(formatDateString(fakePost.created_at))).toBeDefined();
})
test('api returned posts array, displaying posts, post has limited content length', async () => {
    render(<BrowserRouter><PostList /></BrowserRouter>)

    server.use(
        rest.get(BASE_URL, (req, res, ctx) => {
            return res(ctx.json([fakePostLongContent]))
        }),
    )
    await new Promise((r) => setTimeout(r, 1000));

    const text = limitString(fakePostLongContent.content)
    expect(screen.getByText(text as string)).toBeDefined();
})
