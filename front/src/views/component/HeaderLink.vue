<template>
  <nav>
    <span v-if="loggedIn">
      <router-link to="/home">Home</router-link> |
      <router-link to="/create">Create</router-link> |
      <a href="" @click.prevent="logout">Logout</a>
    </span>
    <span v-else-if="!loggedIn">
      <router-link to="/">Login</router-link> |
      <router-link to="/signup">Register</router-link>
    </span>
  </nav>
</template>

<script>
const axios = require("axios").default;
import Cookies from "js-cookie";

export default {
  data() {
    return {
      loggedIn: "",
    };
  },

  methods: {
    logout() {
      axios
        .get(`http://127.0.0.1:3000/logout`, {
          withCredentials: true,
          credentials: "include",
        })
        .then((response) => {
          if (response.data.status == "success") {
            this.$router.push("/");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  mounted() {
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