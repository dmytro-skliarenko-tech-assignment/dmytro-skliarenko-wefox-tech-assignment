import React, { useEffect, useState } from "react";
import "./PostComponent.scss"
import Editable from "../Editable";
import Map from "../Map";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../api/useApi";
import { Post } from "../../Types";
import { formatDateTimeString, isEmpty, isNotEmpty } from "../../helpers";
import ImageComponent from "../ImageComponent";
import { createPost, getPost, removePost, updatePost } from "../../api";
import { routes } from "../../router";
import Loader from "../Loader";
import ErrorComponent from "../ErrorComponent";

const createEmptyPost: () => Post = () => ({
    title: '',
    content: '',
    lat: '',
    long: '',
    image_url: '',
})

type PostComponentProps = {
    shouldRenderMap?: boolean
}

/**
 * 
 * @param shouldRenderMap false value is used only for tests purposes, jest-dom has some problems with svg. Need to be investigated
 * @returns 
 */
const PostComponent = ({ shouldRenderMap = true }: PostComponentProps) => {
    const { postId } = useParams();    

    const isCreatingNew: boolean = isEmpty(postId);

    const [ post, setPost ] = useState<Post | null | undefined>(createEmptyPost());
    const [ isEditable, setIsEditable ] = useState<boolean>(false);

    const getPostApi = useApi<Post>(getPost);
    const updatePostApi = useApi<Post>(updatePost);
    const createPostApi = useApi<Post>(createPost);
    const removePostApi = useApi<Post>(removePost);

    const navigate = useNavigate();

    useEffect(() => {
        if (isNotEmpty(postId)) {
            getPostApi.perform(postId);
        }
    }, [])

    useEffect(() => {
        if (isEditable) {
            setPost(getPostApi.data);
        }
    }, [isEditable])

    useEffect(() => {
        if (createPostApi.data?.id !== undefined) {
            navigate(routes.post(createPostApi.data?.id));
        }
    }, [createPostApi.data])

    const renderActions = () => {
        if (isCreatingNew) {
            return (
                <button
                    className="post-save"
                    disabled={isEmpty(post?.title) || isEmpty(post?.content)}
                    onClick={() => createPostApi.perform(post)}
                >
                    Save
                </button>
            )
        }
        if (isEditable) {
            return <>
                <button
                    className="post-save"
                    disabled={isEmpty(post?.title) || isEmpty(post?.content)}
                    onClick={async () => {
                        await updatePostApi.perform(post);
                        await getPostApi.perform(postId);
                        setIsEditable(false);
                    }}
                >
                    Save
                </button>
                <button
                    className="post-cancel"
                    onClick={() => setIsEditable(false)}
                >
                    Cancel
                </button>
            </>
        } else {
            return <>
                <button className="post-edit" onClick={() => setIsEditable(true)}>Edit</button>
                <button className="post-remove" onClick={async () => {
                    await removePostApi.perform(getPostApi.data?.id);
                    navigate(routes.home);
                }}>Delete</button>
            </>
        }

    }

    const onChangeValue = (fieldName: string) => (value: string) => {
        const updatedPost: Post = {
            ...post,
            [fieldName]: value,
        } as Post
        setPost(updatedPost);
    }


    const renderPost = () => {
        const postToRender = isCreatingNew || isEditable ? post : getPostApi.data;
        return (
            <div className="post">
                <div className="post-actions-info">
                    <div className="post-dates">
                        {isNotEmpty(postToRender?.created_at) ? (
                            <div className="post-date">
                                Created: {formatDateTimeString(postToRender?.created_at)}
                            </div>
                        ) : null}
                        {isNotEmpty(postToRender?.updated_at) ? (
                            <div className="post-date">
                                Last modified: {formatDateTimeString(postToRender?.updated_at)}
                            </div>
                        ) : null}
                    </div>
                    <div className="post-actions">
                        {renderActions()}
                    </div>
                </div>
                <Editable
                    label="Title*" 
                    isEditable={isCreatingNew || isEditable} 
                    value={postToRender?.title} 
                    fieldType="text" 
                    onChange={onChangeValue('title')} 
                />
                <ImageComponent 
                    isEditable={isCreatingNew || isEditable} 
                    imageUrl={postToRender?.image_url } 
                    onChange={onChangeValue('image_url')}
                />
                <Editable 
                    label="Content*" 
                    isEditable={isCreatingNew || isEditable} 
                    value={postToRender?.content} 
                    fieldType="textarea" 
                    onChange={onChangeValue('content')}
                />
                <Map
                    lat={postToRender?.lat}
                    long={postToRender?.long}
                    isEditable={isCreatingNew || isEditable}
                    onChangeLatitude={onChangeValue('lat')} 
                    onChangeLongitude={onChangeValue('long')}
                    shouldRenderMap={shouldRenderMap}
                />
            </div>
        )
    }

    const renderWithStatus = () => {
        if (getPostApi.error) return <ErrorComponent />
        if (getPostApi.isLoading) return <Loader />
        return renderPost()
    }

    return (
        <div className="post-container">
            {renderWithStatus()}
        </div>
    )
}

export default PostComponent;
