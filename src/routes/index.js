//routes/index.js
import React, { lazy, Suspense } from 'react';
import { Navigate } from "react-router-dom";
import Home from '../application/Home/Home';


//React.lazy() 允许你定义一个动态加载的组件。这有助于缩减 bundle 的体积，并延迟加载在初次渲染时未用到的组件。
const RecommendComponent = lazy(() => import("../application/Recommend/Recommend.js"));
const SingersComponent = lazy(() => import("../application/Singers/Singers"));
const RankComponent = lazy(() => import("../application/Rank/Rank"));
const AlbumComponent = lazy(() => import("../application/Album/"));
const SingerComponent = lazy(() => import("./../application/Singer/"));
const SearchComponent = lazy(() => import("./../application/Search/"));

const SuspenseComponent = Component => {
    return ((props) => {
        return (
            <Suspense fallback={<>Loading...</>}>
                <Component {...props}></Component>
            </Suspense>
        )
    })()

}
const routes = [
    {
        path: "/",
        element: <Home />,
        children: [
            {
                index: true,
                element: SuspenseComponent(RecommendComponent)
            },
            {
                path: "recommend",
                element: SuspenseComponent(RecommendComponent),
                children: [{
                    path: "/recommend/:id",
                    element: SuspenseComponent(AlbumComponent)
                }]
            },
            {
                path: "singers",
                element: SuspenseComponent(SingersComponent),
                children: [{
                    path: "/singers/:id",
                    element: SuspenseComponent(SingerComponent)
                }]
            },
            {
                path: "rank",
                element: SuspenseComponent(RankComponent),
                children: [
                    {
                        path: "/rank/:id",
                        element: SuspenseComponent(AlbumComponent)
                    }
                ]
            },
            {
                path: "album/:id",
                exact: true,
                key: "album",
                element: SuspenseComponent(AlbumComponent)
            },
            {
                path: 'search',
                exact: true,
                key: 'search',
                element: SuspenseComponent(SearchComponent)
            }
        ]
    }
]
export default routes