import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreateView from "@/views/CreateView.vue";
import PostView from "@/views/PostView.vue";
import ViewPostView from "@/views/ViewPostView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/create',
            name: 'create',
            component: CreateView
        },
        {
            path: '/post',
            name: 'post',
            component: PostView
        },
        {
            path: '/post/:id',
            name: 'view post',
            component: ViewPostView
        }
    ]
})

export default router
