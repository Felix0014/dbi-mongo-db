import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-green/theme.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'
import InputText from "primevue/inputtext";
import {getMongoClient} from "@/services/mongo";
import Button from "primevue/button";
import Dialog from 'primevue/dialog';
import Password from "primevue/password";
import Textarea from "primevue/textarea";
import Chip from "primevue/chip";


async function main() {
    const app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.use(PrimeVue)
    app.component('InputText', InputText)
    app.component('Button', Button)
    app.component('Dialog', Dialog)
    app.component('Password', Password)
    app.component('Textarea', Textarea)
    app.component('Chip', Chip)

    const mongoClient = await getMongoClient()
    app.provide('mongo', mongoClient)
    app.provide('test', 'test')
    app.mount('#app')
}

main()

