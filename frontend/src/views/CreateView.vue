<script setup lang="ts">

import {inject, ref} from "vue";
import type {Post, User} from "@/persistence/Schema";

const mongo = <Realm.Services.MongoDBDatabase>inject('mongo')
console.log(inject('test'))

let title = ref("")
let content = ref("")
let category = ref("")
let categories = ref<string[]>([])

async function submit() {
  const posts = mongo.collection<Post>("Post")
}

async function addCategory() {
  categories.value.push(category.value)
  category.value = ""
}

</script>

<template>
  <div class="main">
    <div class="container">
      <InputText v-model="title" placeholder="Title"/>
      <Textarea v-model="content" placeholder="Content" rows="20" cols="60"/>
      <div>
        <Chip v-for="item in categories" :label="item" removable
              @remove="() => categories.splice(categories.indexOf(item), 1)"/>
      </div>
      <div>
        <InputText v-model="category" placeholder="Category"/>
        <Button label="Add" v-on:click="addCategory" outlined/>
      </div>
      <Button label="Submit" v-on:click="submit()"/>
    </div>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: start;
  min-width: 40vw;
}
</style>