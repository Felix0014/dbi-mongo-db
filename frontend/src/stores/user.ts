import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => {
        return {user: localStorage.getItem("user")}
    },
    actions: {
        set(id: string) {
            this.user = id
            localStorage.setItem("user", id)
        },
        logout() {
            this.user = ""
            localStorage.removeItem("user")
        }
    },
})