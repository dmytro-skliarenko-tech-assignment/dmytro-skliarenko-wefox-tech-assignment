import React from "react";
import { useNavigate } from "react-router-dom";
import './PostItem.scss'
import { formatDateString, limitString } from "../../helpers";
import { Post } from '../../Types'
import { routes } from "../../router";

type PostProps = {
    post: Post,
}

const PostItem = ({ post }: PostProps) => {
    const { id, title, content, image_url, created_at }: Post = post;

    const navigate = useNavigate();

    return (
        <div className="post-item" onClick={() => navigate(routes.post(id))}>
            <div className="post-item-header">
                <h2 className="post-item-title">{title}</h2>
                <span className="created-at">{formatDateString(created_at)}</span>
            </div>
            <div className="info">
                <div className="content">{limitString(content)}</div>
                <div className="image-wrapper">
                    <img className="image" src={image_url} alt="Is not available"/>
                </div>
            </div>
        </div>
    )
};

export default PostItem;
