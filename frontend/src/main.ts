import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/lara-light-green/theme.css';
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
import Chips from "primevue/chips";
import FloatLabel from "primevue/floatlabel";
import Dropdown from "primevue/dropdown";
import FileUpload from "primevue/fileupload";
import InputSwitch from "primevue/inputswitch";
import Card from "primevue/card";


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
    app.component('Chips', Chips)
    app.component('FloatLabel', FloatLabel)
    app.component('Dropdown', Dropdown)
    app.component('FileUpload', FileUpload)
    app.component('InputSwitch', InputSwitch)
    app.component('Card', Card)

    const mongoClient = await getMongoClient()
    app.provide('mongo', mongoClient)
    app.provide('test', 'test')
    app.mount('#app')
}

main()

