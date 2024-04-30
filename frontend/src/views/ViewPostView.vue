<script setup lang="ts">
import {inject, onMounted, ref} from "vue";
import type {Post, User, Comment} from "@/persistence/Schema";
import {useRoute} from "vue-router";
import * as Realm from 'realm-web'
import {storeToRefs} from "pinia";
import {useUserStore} from "@/stores/user";

const route = useRoute()

const mongo = <Realm.Services.MongoDBDatabase>inject<Realm.Services.MongoDBDatabase>('mongo')
const commentCollection = <Realm.Services.MongoDB.MongoDBCollection<Comment>>mongo.collection<Comment>("Comment")

const userStore = useUserStore()
const {currentUser} = storeToRefs(userStore)
const {set, logout} = userStore

let post = ref<Post>()
let user = ref<User>()
let comment = ref("")
let comments = ref<Comment[]>()
let commentUsers = ref<User[]>([])

async function getPost() {
  const postCollection = <Realm.Services.MongoDB.MongoDBCollection<Post>>mongo.collection<Post>("Post")
  post.value = <Post>(await postCollection.findOne({_id: new Realm.BSON.ObjectId(<string>route.params.id)}))
  user.value = await getUserFromId(post.value?.author)
  await getComments()
}

async function getUserFromId(id: Realm.BSON.ObjectId): Promise<User> {
  const userCollection = <Realm.Services.MongoDB.MongoDBCollection<User>>mongo.collection<User>("User")
  return <User>(await userCollection.findOne({_id: id}))
}

async function getComments() {
  comments.value = <Comment[]>(await commentCollection.find({parent: post.value?._id}))
  comments.value.forEach(item => {
    getUserFromId(item.author).then(u => {
      commentUsers.value.push(u)
    })
  })
}

async function postComment() {
  await commentCollection.insertOne({
    content: comment.value,
    parent: post.value?._id,
    author: new Realm.BSON.ObjectId(<string>currentUser.value)
  })
  getComments()
  comment.value = ''
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
        marginTop: '5vh',
        marginBottom: '2vh',
      }">
        <FloatLabel>
          <InputText id="comment" v-model="comment" :style="{
            width: '40vw'
          }"/>
          <label for="comment">Your Comment</label>
        </FloatLabel>
        <Button label="Post" outlined v-on:click="postComment"/>
      </div>
      <Card v-for="(item, index) in comments" :style="{
        marginTop: '1vh'
      }">
        <template #content>{{ item.content }}</template>
        <template #footer>
          <p :style="{
            opacity: '0.6',
            marginTop: '0'
          }">
            {{ commentUsers[index] != null ? commentUsers[index].userName : 'user not found' }}
          </p>
        </template>
      </Card>
    </div>
  </main>
</template>

<style scoped>

</style>