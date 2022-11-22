<template>
  <nav>
    <span v-if="loggedIn">
      <router-link to="/home">Home</router-link> |
      <router-link to="/create">Create</router-link> |
      <router-link to="/logout">Logout</router-link>
    </span>
    <span v-else-if="!loggedIn">
      <router-link to="/">Login</router-link> |
      <router-link to="/signup">Register</router-link>
    </span>
  </nav>
</template>

<script>
import Cookies from "js-cookie";

export default {
  data() {
    return {
      loggedIn: "",
    };
  },

  mounted() {
    console.log(1);
    Cookies.get("jwt") ? (this.loggedIn = true) : (this.loggedIn = false);
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px !important;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>