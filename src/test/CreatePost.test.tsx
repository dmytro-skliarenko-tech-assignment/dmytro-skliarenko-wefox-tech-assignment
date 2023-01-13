import {fireEvent, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import ReactRouter from 'react-router'
import { rest } from 'msw'
import {setupServer} from 'msw/node'
import PostComponent from '../components/PostComponent'
import { Post } from '../Types'
import { BASE_URL } from '../api'

const draftFakePost = {
  title: "Test title",
  content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  lat: "1",
  long: "2",
  image_url: "https://test.com/image.jpg",
}
const createdFakePost: Post = {
  ...draftFakePost,
  id: 1,
  created_at: "2022-01-01T00:00:00.000Z",
  updated_at: "2022-01-01T00:00:00.000Z"
}

const createdPostPath = `${BASE_URL}/1`

const server = setupServer()
  
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('react-router', () => ({
  ...jest.requireActual("react-router") as {},
  useLocation: jest.fn().mockImplementation(() => {({} as any)}),
}))

test('loads and displays empty post component', async () => {
  render(<BrowserRouter><PostComponent /></BrowserRouter>)

  expect(screen.getByRole('button')).toBeDisabled()
  expect(screen.getByPlaceholderText('Title*')).toBeEmptyDOMElement();
  expect(screen.getByPlaceholderText('Image URL')).toBeEmptyDOMElement();
  expect(screen.getByPlaceholderText('Content*')).toBeEmptyDOMElement();
  expect(screen.getByPlaceholderText('Latitude')).toBeEmptyDOMElement();
  expect(screen.getByPlaceholderText('Longitude')).toBeEmptyDOMElement();
})

test('required fields in post component and create button', async () => {
  render(<BrowserRouter><PostComponent shouldRenderMap={false}/></BrowserRouter>)

  expect(screen.getByRole('button')).toBeDisabled();
  expect(screen.getByPlaceholderText('Title*')).toBeEmptyDOMElement();
  expect(screen.getByPlaceholderText('Content*')).toBeEmptyDOMElement();

  await userEvent.type(screen.getByPlaceholderText('Title*'), 'Test');
  expect(screen.getByRole('button')).toBeDisabled();

  await userEvent.type(screen.getByPlaceholderText('Content*'), 'Lorem ipsum');
  expect(screen.getByRole('button')).toBeDefined();
})
test('empty image url does not render image', async () => {
  render(<BrowserRouter><PostComponent shouldRenderMap={false}/></BrowserRouter>);

  expect(screen.queryByRole('img')).toBeNull();
})
test('image appears after setting link', async () => {
  render(<BrowserRouter><PostComponent shouldRenderMap={false}/></BrowserRouter>);

  userEvent.type(screen.getByPlaceholderText('Image URL'), 'http://test.com/image.png');

  expect(screen.getByRole('img')).toBeInTheDocument();
})
test('post is created when user click on create button', async () => {
  const fakeNavigate = jest.fn();
  jest.spyOn(ReactRouter, 'useNavigate').mockReturnValue(fakeNavigate);
  render(<BrowserRouter><PostComponent shouldRenderMap={false}/></BrowserRouter>);

  server.use(
      rest.get(createdPostPath, (req, res, ctx) => {
          return res(
              ctx.json(createdFakePost),
          )
      }),
      rest.post(BASE_URL, (req, res, ctx) => {
        return res(
          ctx.json(createdFakePost)
        )
      })
  )

  fireEvent.change(screen.getByPlaceholderText('Title*'), {target: { value: draftFakePost.title }});
  fireEvent.change(screen.getByPlaceholderText('Image URL'), {target: { value: draftFakePost.content }});
  fireEvent.change(screen.getByPlaceholderText('Content*'), {target: { value: draftFakePost.image_url }});
  fireEvent.change(screen.getByPlaceholderText('Latitude'), {target: { value: draftFakePost.long }});
  fireEvent.change(screen.getByPlaceholderText('Longitude'), {target: { value: draftFakePost.lat }});

  expect(screen.getByText('Save')).toBeDefined();
  expect(screen.queryByText('Cancel')).toBeNull();
  expect(screen.queryByText('Edit')).toBeNull();
  expect(screen.queryByText('Delete')).toBeNull();

  const saveButton = screen.getByText('Save');
  fireEvent.click(saveButton);

  await new Promise((r) => setTimeout(r, 1000));

  expect(fakeNavigate).toHaveBeenCalledWith(`/posts/${createdFakePost.id}`)
})