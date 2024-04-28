<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
import {useUserStore} from "@/stores/user";
import {inject, reactive, ref} from "vue";
import type {User} from "@/persistence/Schema";
import {storeToRefs} from "pinia";

const mongo = <Realm.Services.MongoDBDatabase>inject("mongo")
let userStore = storeToRefs(useUserStore())


let userName = ref("")
let password = ref("")
let email = ref("")
let firstName = ref("")
let lastName = ref("")
let registerView = ref(false)

async function login() {
  userStore.user.value = (await mongo.collection('User').findOne({
    email: email.value,
    password: password.value
  }))._id.toString()
}

async function register() {
  await mongo.collection<User>('User').insertOne({
    email: email.value,
    firstName: firstName.value,
    lastName: lastName.value,
    userName: userName.value,
    password: password.value,
  })
  await login()
}

function switchRegisterLogin() {
  registerView.value = !registerView.value
}

</script>

<template>
  <header>
    <div class="nav">
      <router-link class="nav-link" to="/">Home</router-link>
      <router-link to="/create">Create</router-link>
    </div>
  </header>

  <Dialog :visible="userStore.user.value == ''" modal :closable="false" :header="registerView ? 'Register' : 'Login'"
          :style="{ width: '35rem' }">
    <div v-if="registerView" class="field">
      <label for="firstName">First Name</label>
      <InputText id="firstname" autocomplete="off" v-model="firstName"/>
    </div>
    <div v-if="registerView" class="field">
      <label for="lastName">Last Name</label>
      <InputText id="lastName" autocomplete="off" v-model="lastName"/>
    </div>
    <div v-if="registerView" class="field">
      <label for="username">Username</label>
      <InputText id="username" autocomplete="off" v-model="userName"/>
    </div>
    <div class="field">
      <label for="email">E-mail</label>
      <InputText id="email" autocomplete="off" v-model="email"/>
    </div>
    <div class="field">
      <label for="password">Password</label>
      <Password id="password" :feedback="false" autocomplete="off" v-model="password"/>
    </div>
    <div class="field">
      <Button type="button" :label="registerView ? 'Register' : 'Login'"
              @click="registerView ? register() : login()"></Button>
      <Button type="button" :label="registerView ? 'I Already have an Account' : 'Create an Account'"
              @click="switchRegisterLogin()" link></Button>
    </div>
  </Dialog>

  <RouterView/>
</template>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 3vh 0;
}

.nav-link {
  margin: 0 1vw;
}

.field {
  margin: 2vh;
  display: flex;
}

input, #password {
  align-self: end;
  margin-left: auto;
}
</style>