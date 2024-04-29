<script setup lang="ts">
import type {Post} from "@/persistence/Schema";
import {inject, onMounted, ref} from "vue";

let posts = ref<Post[]>()

async function refreshData() {
  const mongo = <Realm.Services.MongoDBDatabase>inject<Realm.Services.MongoDBDatabase>('mongo')
  const postCollection = <Realm.Services.MongoDB.MongoDBCollection<Post>>mongo.collection<Post>("Post")
  posts.value = await postCollection.find()
  console.log(posts.value)
}

onMounted(() => {
  refreshData()
})
</script>

<template>
  <main>
    <div class="container">
      <a v-for="post in posts" :href="`/post/${post._id}`">
        <Card>
          <template #title>{{ post.title }}</template>
          <template #content>{{ post.description }}</template>
          <template #footer>Views: {{ post.impressionCount }}</template>
        </Card>
      </a>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  width: 40vw
}
</style>