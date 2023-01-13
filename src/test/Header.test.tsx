import {fireEvent, render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import Header from '../components/Header'
import { BrowserRouter } from 'react-router-dom'
import ReactRouter from 'react-router'

jest.mock('react-router', () => ({
    ...jest.requireActual("react-router") as {},
    useLocation: jest.fn().mockImplementation(() => {({} as any)}),
}))

test('create post button should exist', () => {
    render(<BrowserRouter><Header/></BrowserRouter>);

    expect(screen.getByText('Create Post')).toBeDefined();
})
test('create post button should navigate to new post component', () => {
    const fakeNavigate = jest.fn();
    jest.spyOn(ReactRouter, 'useNavigate').mockReturnValue(fakeNavigate);

    render(<BrowserRouter><Header/></BrowserRouter>);

    const createPostButton = screen.getByText('Create Post');
    
    fireEvent.click(createPostButton);

    expect(fakeNavigate).toHaveBeenCalledWith('/posts/add');
})
