import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => {
        return {user: ""}
    },
    actions: {
        set(name: string) {
            this.user = name
        },
        logout() {
            this.user = ""
        }
    },
})