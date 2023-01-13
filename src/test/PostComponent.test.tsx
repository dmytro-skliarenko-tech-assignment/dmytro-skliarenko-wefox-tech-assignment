import {fireEvent, render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import ReactRouter from 'react-router'
import PostComponent from '../components/PostComponent'
import { rest } from 'msw'
import {setupServer} from 'msw/node'
import { BASE_URL } from '../api'
import { formatDateTimeString } from '../helpers'
import { Post } from '../Types'

const fakePost: Post = {
    id: 1,
    title: "Test title",
    content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    lat: "1",
    long: "2",
    image_url: "https://test.com/image.jpg",
    created_at: "2022-01-01T00:00:00.000Z",
    updated_at: "2022-01-01T00:00:00.000Z"
}

// !!! this path should be used here `${BASE_URL}/${fakePost.id}` is failing test by unknown reason !!!
const successfullPath = `${BASE_URL}/1`
const failedPath = `${BASE_URL}/2`

const server = setupServer()
  
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('react-router', () => ({
    ...jest.requireActual("react-router") as {},
    useLocation: jest.fn().mockImplementation(() => {({} as any)}),
    useParams: jest.fn().mockImplementation(() => {
        return fakePost.id;
    }),
}))

test('api returned error, displaying error', async () => {
    jest.spyOn(ReactRouter, 'useParams').mockReturnValue({ postId: '2' });
    render(<BrowserRouter ><PostComponent shouldRenderMap={false}/></BrowserRouter>);

    server.use(
        rest.get(failedPath, (req, res, ctx) => {
            return res(ctx.status(500))
        })
    )
    await new Promise((r) => setTimeout(r, 1000));

    expect(screen.getByText('Something went wrong...')).toBeDefined()
})

test('api returned post, displaying post', async () => {
    jest.spyOn(ReactRouter, 'useParams').mockReturnValue({ postId: String(fakePost.id) });

    render(<BrowserRouter><PostComponent shouldRenderMap={false}/></BrowserRouter>);
    
    server.use(
        rest.get(successfullPath, (req, res, ctx) => {
            return res(
                ctx.json(fakePost),
            )
        }),
    )

    await new Promise((r) => setTimeout(r, 1000));

    expect(screen.getByText('Edit')).toBeDefined();
    expect(screen.getByText('Delete')).toBeDefined();

    expect(screen.getByDisplayValue(fakePost.title)).toBeDefined();
    expect(screen.getByDisplayValue(fakePost.content)).toBeDefined();
    expect(screen.getByRole('img')).toHaveProperty('src', fakePost.image_url);
    expect(screen.getByText(`Created: ${formatDateTimeString(fakePost.created_at)}`)).toBeDefined();
    expect(screen.getByText(`Last modified: ${formatDateTimeString(fakePost.updated_at)}`)).toBeDefined();
    expect(screen.getByDisplayValue(fakePost.lat)).toBeDefined();
    expect(screen.getByDisplayValue(fakePost.long)).toBeDefined();
})
test('click on edit makes fields editable', async () => {
    jest.spyOn(ReactRouter, 'useParams').mockReturnValue({ postId: String(fakePost.id) });

    render(<BrowserRouter><PostComponent shouldRenderMap={false}/></BrowserRouter>);

    server.use(
        rest.get(successfullPath, (req, res, ctx) => {
            return res(
                ctx.json(fakePost),
            )
        }),
        rest.put(successfullPath, (req, res, ctx) => {})
    )

    await new Promise((r) => setTimeout(r, 1000));

    expect(screen.getByText('Edit')).toBeDefined();
    expect(screen.getByText('Delete')).toBeDefined();

    expect(screen.getByDisplayValue(fakePost.title)).toBeDefined();
    expect(screen.getByDisplayValue(fakePost.content)).toBeDefined();
    expect(screen.getByRole('img')).toHaveProperty('src', fakePost.image_url);
    expect(screen.getByText(`Created: ${formatDateTimeString(fakePost.created_at)}`)).toBeDefined();
    expect(screen.getByText(`Last modified: ${formatDateTimeString(fakePost.updated_at)}`)).toBeDefined();
    expect(screen.getByDisplayValue(fakePost.lat)).toBeDefined();
    expect(screen.getByDisplayValue(fakePost.long)).toBeDefined();

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(screen.getByText('Save')).toBeDefined();
    expect(screen.getByText('Cancel')).toBeDefined();

    const updatedFakePost = {
        id: 1,
        title: 'Updated Title',
        content: 'Updated Content',
        image_url: 'http://test.com/updated_image.jpg',
        long: '30',
        lat: '40',
        created_at: "2022-01-01T00:00:00.000Z",
        updated_at: "2022-01-02T20:20:20.000Z"
    }

    fireEvent.change(screen.getByDisplayValue(fakePost.title), {target: {value: updatedFakePost.title}});
    fireEvent.change(screen.getByDisplayValue(fakePost.content), {target: {value: updatedFakePost.content}});
    fireEvent.change(screen.getByDisplayValue(fakePost.image_url), {target: {value: updatedFakePost.image_url}});
    fireEvent.change(screen.getByDisplayValue(fakePost.long), {target: {value: updatedFakePost.long}});
    fireEvent.change(screen.getByDisplayValue(fakePost.lat), {target: {value: updatedFakePost.lat}});

    const saveButton = screen.getByText('Save');

    server.use(
        rest.get(successfullPath, (req, res, ctx) => {
            return res(
                ctx.json(updatedFakePost),
            )
        }),
        rest.put(successfullPath, (req, res, ctx) => {})
    )

    fireEvent.click(saveButton);

    await new Promise((r) => setTimeout(r, 1000));

    expect(screen.queryByText('Save')).toBeNull();
    expect(screen.queryByText('Cancel')).toBeNull();
    expect(screen.getByText('Edit')).toBeDefined();
    expect(screen.getByText('Delete')).toBeDefined();

    expect(screen.getByDisplayValue(updatedFakePost.title)).toBeDefined();
    expect(screen.getByDisplayValue(updatedFakePost.content)).toBeDefined();
    expect(screen.getByRole('img')).toHaveProperty('src', updatedFakePost.image_url);
    expect(screen.getByText(`Created: ${formatDateTimeString(updatedFakePost.created_at)}`)).toBeDefined();
    expect(screen.getByText(`Last modified: ${formatDateTimeString(updatedFakePost.updated_at)}`)).toBeDefined();
    expect(screen.getByDisplayValue(updatedFakePost.lat)).toBeDefined();
    expect(screen.getByDisplayValue(updatedFakePost.long)).toBeDefined();
})
test('click on delete should remove post', async () => {
    jest.spyOn(ReactRouter, 'useParams').mockReturnValue({ postId: String(fakePost.id) });
    const fakeNavigate = jest.fn();
    jest.spyOn(ReactRouter, 'useNavigate').mockReturnValue(fakeNavigate);

    render(<BrowserRouter><PostComponent shouldRenderMap={false}/></BrowserRouter>);

    server.use(
        rest.get(successfullPath, (req, res, ctx) => {
            return res(
                ctx.json(fakePost),
            )
        }),
        rest.delete(successfullPath, (req, res, ctx) => {
            return res(ctx.status(204));
        })
    )

    await new Promise((r) => setTimeout(r, 1000));

    expect(screen.getByText('Edit')).toBeDefined();
    expect(screen.getByText('Delete')).toBeDefined();

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    await new Promise((r) => setTimeout(r, 1000));

    // TODO: check if delete request was really done

    expect(fakeNavigate).toHaveBeenCalledWith('/');
})