import {defineStore} from 'pinia'
import {computed, ref} from "vue";

export const useUserStore = defineStore('counter', () => {
    const currentUser = ref(localStorage.getItem("user"))

    function set(id: string) {
        currentUser.value = id
        localStorage.setItem("user", id)
    }

    function logout() {
        currentUser.value = ""
        localStorage.removeItem("user")
    }

    return {currentUser, set, logout}
})