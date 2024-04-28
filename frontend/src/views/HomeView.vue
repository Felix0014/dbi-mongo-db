<script setup lang="ts">
import type {Post} from "@/persistence/Schema";
import {inject, onMounted} from "vue";

let value = "Hello"
let posts: []

async function refreshData(): Promise<Post[]> {
  const mongo = <Realm.Services.MongoDBDatabase>inject<Realm.Services.MongoDBDatabase>('mongo')
  const posts = <Realm.Services.MongoDB.MongoDBCollection<Post>>mongo.collection<Post>("Posts")
  return await posts.find()
}

onMounted(() => {
  refreshData()
})
</script>

<template>
  <main>
    <InputText type="text" v-model="value"/>
  </main>
</template>