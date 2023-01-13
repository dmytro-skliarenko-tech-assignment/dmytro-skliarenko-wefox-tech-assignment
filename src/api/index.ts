import axios, { AxiosInstance } from "axios";
import { Post } from "../Types";

export const BASE_URL: string = 'http://localhost:3000/api/v1/posts';

const instance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
  });

export const getPosts = () => instance.get('');

export const getPost = (id: string) => instance.get(`/${id}`);

export const createPost = (data: Post) => instance.post(
    '',
    JSON.stringify(data),
    {
        headers: {
            'Content-Type': 'application/json'
        },
    },
);

export const updatePost = (data: Post) => instance.put(
    `/${data.id}`,
    JSON.stringify(data),
    {
        headers: {
            'Content-Type': 'application/json'
        },
    },
);

export const removePost = (id: string) => instance.delete(`/${id}`);
