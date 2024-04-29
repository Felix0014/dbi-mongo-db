<script setup lang="ts">

import {inject, ref} from "vue";
import type {Post, User} from "@/persistence/Schema";
import type {FileUploadUploaderEvent} from "primevue/fileupload";
import {storeToRefs} from "pinia";
import {useUserStore} from "@/stores/user";
import * as Realm from 'realm-web'

const mongo = <Realm.Services.MongoDBDatabase>inject('mongo')
console.log(inject('test'))

let availableTypes = ["link", "image", "location", "text"]
let userStore = storeToRefs(useUserStore())

let title = ref("")
let categories = ref<string[]>([])
let content = ref<{ type: string, value: any }[]>([])
let value = ref()
let type = ref("")
let description = ref("")
let commentsAllowed = ref(true)

async function submit() {
  await mongo.collection<Post>("Post").insertOne({
    title: title.value,
    author: new Realm.BSON.ObjectId(userStore.user.value),
    description: description.value,
    creationDate: new Date(),
    impressionCount: 0,
    content: content.value,
    commentsAllowed: commentsAllowed.value,
    categories: categories.value,
  })
}

async function onUpload(event: FileUploadUploaderEvent) {
  (<File[]>event.files).forEach(file => {
    let reader = new FileReader()
    reader.onload = () => {
      value.value = reader.result
      content.value.push({type: type.value, value: reader.result})
      value.value = ''
    }
    reader.readAsDataURL(file)
  })
}

async function addCustomField() {
  content.value.push({type: type.value, value: value.value})
  value.value = ''
}

</script>

<template>
  <div class="main">
    <div class="container">
      <FloatLabel>
        <InputText id="title" v-model="title"/>
        <label for="title">Title</label>
      </FloatLabel>
      <FloatLabel>
        <InputText id="description" v-model="description"/>
        <label for="description">Description</label>
      </FloatLabel>
      <FloatLabel>
        <Chips id="categories" v-model="categories"/>
        <label for="categories">Categories</label>
      </FloatLabel>
      <label for="commentsAllowed" :style="{
          marginBottom: '1vh'
        }">Allow Comments</label>
      <InputSwitch id="commentsAllowed" v-model="commentsAllowed" :style="{
          marginTop: '1vh'
        }"/>
      <h3 :style="{
        marginBottom: '0px'
      }">Custom Fields</h3>
      <div v-for="item in content">
        <a v-if="item.type === 'link'" :href="item.value">
          <Button :label="item.value" link/>
        </a>
        <a v-if="item.type === 'location'" :href="'https://www.google.com/maps/search/' + item.value">
          <Button :label="item.value" link/>
        </a>
        <img v-if="item.type === 'image'" :src="item.value" alt="" :style="{
          height: '10vh'
        }">
        <p v-if="item.type === 'text'">{{ item.value }}</p>
      </div>
      <div class="custom-field" :style="{
        display: 'flex',
        flexDirection: type == 'text' ? 'column' : 'row'
      }">
        <Dropdown v-model="type" :options="availableTypes" placeholder="Select a Type"/>
        <FileUpload mode="basic" v-if="type === 'image'" accept="image/*" custom-upload
                    @uploader="event => onUpload(event)" :max-file-size="100000000"
                    :style="{
          marginLeft: '1vw'
        }"/>
        <InputText v-if="type === 'link' || type === 'location'" v-model="value" :style="{
          marginLeft: '1vw'
        }"/>
        <div>
          <Textarea v-if="type === 'text'" v-model="value" rows="20" cols="100"/>
        </div>
        <Button v-if="type != 'image'" label="Add" v-on:click="addCustomField()" :style="{
          marginLeft: '1vw'
        }" outlined/>
      </div>
      <Button label="Submit" v-on:click="submit()" :style="{
        alignSelf: 'end'
      }"/>
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
  width: 40vw;
}

.container > * {
  margin-top: 3vh;
}
</style>