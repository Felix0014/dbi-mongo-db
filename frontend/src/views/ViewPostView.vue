<script setup lang="ts">
import {inject, onMounted, ref} from "vue";
import type {Post, User, Comment} from "@/persistence/Schema";
import {useRoute} from "vue-router";
import * as Realm from 'realm-web'

const route = useRoute()

const mongo = <Realm.Services.MongoDBDatabase>inject<Realm.Services.MongoDBDatabase>('mongo')

let post = ref<Post>()
let user = ref<User>()
let comment = ref("")
let comments = ref<Comment[]>()

async function getPost() {
  const postCollection = <Realm.Services.MongoDB.MongoDBCollection<Post>>mongo.collection<Post>("Post")
  const userCollection = <Realm.Services.MongoDB.MongoDBCollection<User>>mongo.collection<User>("User")
  post.value = <Post>(await postCollection.findOne({_id: new Realm.BSON.ObjectId(route.params.id)}))
  user.value = <User>(await userCollection.findOne({_id: new Realm.BSON.ObjectId(post.value?.author)}))
  await getComments()
}

async function getComments() {
  const commentCollection = <Realm.Services.MongoDB.MongoDBCollection<Comment>>mongo.collection<Comment>("Comment")
  comments.value = <Comment[]>(await commentCollection.find({parent: post.value?._id}))
}

async function postComment() {

  getComments()
}

onMounted(() => {
  getPost()
})

</script>

<template>
  <main :style="{
   display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column'
  }">
    <div :style="{
      width: '60vw'
    }">
      <Card>
        <template #title>{{ post?.title }}</template>
        <template #subtitle>{{ post?.description }}</template>
        <template #content>
          <div v-for="item in post?.content" :style="{
            display: 'flex'
          }">
            <a v-if="item.type === 'link'" :href="item.value">
              <Button :label="item.value" link/>
            </a>
            <a v-if="item.type === 'location'" :href="'https://www.google.com/maps/search/' + item.value">
              <Button :label="item.value" link/>
            </a>
            <img v-if="item.type === 'image'" :src="item.value" alt="image" :style="{
            maxWidth: '50vw'
          }">
            <p v-if="item.type === 'text'">{{ item.value }}</p>
          </div>
        </template>
        <template #footer>{{ user?.userName }}</template>
      </Card>
      <div :style="{
        display: 'flex',
        flexDirection: 'row',
        marginTop: '5vh'
      }">
        <FloatLabel>
          <InputText id="comment" v-model="comment" :style="{
            width: '40vw'
          }"/>
          <label for="comment">Your Comment</label>
        </FloatLabel>
        <Button label="Post" outlined v-on:click="postComment"/>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>