import React, { useEffect } from 'react';
import { renderByStatus } from '../../helpers/rendererByStatus';
import { useApi } from '../../api/useApi';
import PostItem from '../PostItem';
import './PostList.scss'
import { getPosts } from '../../api';
import { Post } from '../../Types';

const PostList = () => {
    const postsApi = useApi<Post[]>(getPosts);

    useEffect(() => {
        postsApi.perform();
    }, [])

    return (
        <div className='post-list-container'>
            {renderByStatus(postsApi)((data) => (
                <div className="post-list">
                {
                    data && data.length > 0 ? (
                        data.map((post: Post) => <PostItem key={post.id} post={post}/>)
                    ) : (
                        <div className="post-list-empty">
                            <h2>There are no posts. Let's create a new one!</h2>
                        </div>
                    )
                }
            </div>
            ))}
        </div>
    )

}

export default PostList;