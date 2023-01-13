import { createBrowserRouter, Outlet, useLocation } from "react-router-dom";
import PostList from '../components/PostList';
import Header from '../components/Header'
import PostComponent from '../components/PostComponent';
import NotFound from '../components/NotFound';
import { useEffect } from "react";

export const routes = {
  home: '/',
  addPost: '/posts/add',
  post: (postId: string | number | undefined) => `/posts/${postId}`,
}

function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}

const Root = () => {
  useScrollToTop();
  return (
    <div className="app">
      <Header />
      <Outlet />
    </div>
  )
}

const router = createBrowserRouter([
    {
      element: <Root/>,
      errorElement: <NotFound />,
      children: [
        {
          path: routes.home,
          element: <PostList />,
        },
        {
          path: routes.addPost,
          element: <PostComponent key={"add-post"} />,
        
        },
        {
          path: routes.post(':postId'),
          element: <PostComponent key="view-post" />,
        },
      ],
    },
  ]);

  export default router
