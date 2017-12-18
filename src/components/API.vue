<template>
   <div id="flip">
   <div class="container">
      <p>
         <input placeholder="username" v-model="username">
      </p>
      <p>
         <input v-show="username" placeholder="repo" v-model="repo">
      </p>
      <p>
         <input v-show="username && repo" @keyup.enter="getFile" placeholder="A folder or file" v-model="path">
      </p>
   </div>
   <p>Request path: https://api.github.com/{{ request }}</p>
   <div class="content">
      <div v-html="item" v-for="item in rendered" :key="item">
      </div>
   </div>
 </div>
</template>

<script>

import HTTP from '../http'
import axios from 'axios'
import showdown from 'showdown'

export default {
  name: 'api',
  data () {
    return {
      repo: "",
      username: "",
      path: "",
      rendered: [],
      converter: new showdown.Converter()
    }
  },
  computed: {
    request: function() {
      return `repos/${this.username}/${this.repo}/contents/${this.path}`
    }
  },
  methods: {
      getFile: function() {
         let vm = this
         HTTP.user = vm.username
         HTTP.repo = vm.repo

         HTTP.getContents(vm.path)
         .then(file => {
            vm.queries.push(file)
            return file
         })
         .then(file => axios.post('https://api.github.com/markdown',
            {
               text: file,
               mode: 'gfm',
               context: 'github/gollum'
            })
         )
         //.then(file => vm.converter.makeHtml(file))

         .then(file => {
            vm.rendered.push(file.data)
            vm.path = ""
         })
         .catch(err => {
            throw err
         })
      }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.container {
   width: 50%;
   margin: 0 auto;
}

.content {
   margin: 30px;
   padding: 30px;
   text-align: left;
}


input {
  text-align: center;
  font-size: 1.2em;
  padding: 5px;
  margin: 5px;
  border: 0;
  outline: 0;
  background: transparent;
  border-bottom: 1px solid black;
}

input:focus::-webkit-input-placeholder {
    opacity: 0;
}

pre {
  tab-size: 3;
  overflow-x: auto;
  text-align: left;
}

h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
